import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, StatusBar, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert, Platform } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, chatColor, chatInfoImg, checkedImg, dateIcon, filterImg, phoneColor, starImg, timeIcon, uncheckedImg, userPhoto } from '../../../utils/Images'
import { API_URL } from '@env'
import { PAYU_BASE_URL, PAYU_MERCHANT_KEY, PAYU_MERCHANT_SALT, PAYU_SUCCESS_URL, PAYU_FAILURE_URL } from '@env'; 
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '../../../utils/Loader';
import moment from "moment"
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import RazorpayCheckout from 'react-native-razorpay';
import Toast from 'react-native-toast-message';
import { withTranslation, useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js';
import { useNavigation } from '@react-navigation/native';

const OrderSummary = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [userInfo, setUserInfo] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedAddressId, setSelectedAddressId] = useState(route.params?.addressId)
    const [address, setAddress] = useState(null)
    const [shippingData, setShippingData] = useState(null)
    const [productAmount, setproductAmount] = useState(0)
    const [gstAmount, setGstAmount] = useState(0)
    const [shippingAmount, setShippingAmount] = useState(0)
    const [grandToatal, setGrandTotal] = useState(0)


    const handleAlert = (title, message) => {
        Alert.alert(title, message, [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
    };

    useEffect(() => {
        console.log(route.params.productWeight, '<-product weight')
        fetchUserData()
        fetchShippingCharge()
    }, [])

    const fetchUserData = () => {
        AsyncStorage.getItem('userToken', async(err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            setIsLoading(true);
            axios.get(`${API_URL}/user/personal-information`, {
                headers: {
                    "Authorization": `Bearer ${usertoken}`,
                    "Content-Type": 'application/json',
                    "Accept-Language": savedLang || 'en',
                },
            })
                .then(res => {
                    console.log(res.data.data, 'user details')
                    let userInfo = res.data.data;

                    setUserInfo(userInfo)
                    //setIsLoading(false);
                })
                .catch(e => {
                    console.log(`Login error ${e}`)
                    console.log(e.response?.data?.message)
                });
        });
    }
    const fetchShippingCharge = async() => {
        const option = {
            "address_id": selectedAddressId,
            "weight": route.params.productWeight,
            "cod": 0
        }
        console.log(option)
        setIsLoading(true);
        const savedLang = await AsyncStorage.getItem('selectedLanguage');
        axios.post(`${API_URL}/shiprocket-shipping-charge-estimate`, option, {
            headers: {
                "Content-Type": 'application/json',
                "Accept-Language": savedLang || 'en',
            },
        })
            .then(res => {
                console.log(res.data, 'shipping charges data')
                if (res?.data?.response == true) {
                    setAddress(res?.data?.address)
                    setShippingData(res?.data?.data)
                    setproductAmount(route?.params?.productPrice)
                    setGstAmount((route?.params?.productPrice * 18) / 100)
                    setShippingAmount(res?.data?.data?.rate.toFixed(2))
                    setGrandTotal((
                        parseFloat(route?.params?.productPrice || 0) +
                        (route?.params?.productPrice ? (route.params.productPrice * 18) / 100 : 0) +
                        parseFloat(res?.data?.data?.rate || 0)
                    ).toFixed(2))
                }
                setIsLoading(false);
            })
            .catch(e => {
                console.log(`shipping-charge error ${e}`)
                console.log(e.response?.data?.message)
            });
    }
    const orderPlacedSubmit = async (txnid) => {
        setIsLoading(true);
        const option = {
            "gst": gstAmount,
            "coupon": null,
            "coupon_discount": null,
            "shipping_address_id": selectedAddressId,
            "shipping_cost": shippingAmount,
            "payment_method": "online",
            "payment_gateway": "PayU",
            "payment_gateway_order_id": `orderId-${txnid}`,
            "transaction_id": txnid,
            "payment_status": "paid",
            "shipping_track_link": null
        }
        console.log(option)
        AsyncStorage.getItem('userToken', async (err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.post(`${API_URL}/user/order-place`, option, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en', // Default to 'en' if savedLang is not available
                    //'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    console.log(JSON.stringify(res.data.data), 'order placed data')
                    if (res.data.response == true) {
                        setIsLoading(false);
                        Toast.show({
                            type: 'success',
                            text1: '',
                            text2: res?.data?.message,
                            position: 'top',
                            topOffset: Platform.OS === 'ios' ? 55 : 20,
                        });
                        navigation.push('OrderSuccess')
                    } else {
                        console.log('not okk')
                        setIsLoading(false)
                        Alert.alert('Oops..', res.data.message, [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ]);
                    }
                })
                .catch(e => {
                    setIsLoading(false)
                    console.log(`order placed error ${e}`)
                    console.log(e.response)
                    Alert.alert('Oops..', e.response?.data?.message, [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                });
        });
    }
    const generateHash = (key, txnid, amount, productinfo, firstname, email, salt) => {
        // Concatenate the string in the exact order that PayU requires
        const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
      
        // Generate the SHA-512 hash using crypto-js
        const hash = CryptoJS.SHA512(hashString).toString(CryptoJS.enc.Hex);
        
        return hash;
      };
    const ProcedToPay = () => {
        const txnid = `TXN${new Date().getTime()}`;
        const amount = grandToatal;
        const productinfo = 'Order Payment';
        const firstname = userInfo.name;
        const email = userInfo.email;
        console.log(amount,'amountamountamountamount')
        const hash = generateHash(
            PAYU_MERCHANT_KEY,
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            PAYU_MERCHANT_SALT
        );

        const postData = `key=${PAYU_MERCHANT_KEY}&txnid=${txnid}&amount=${amount}&productinfo=${productinfo}&firstname=${firstname}&email=${email}&hash=${hash}&surl=${PAYU_SUCCESS_URL}&furl=${PAYU_FAILURE_URL}`;
console.log(PAYU_BASE_URL)
        navigation.navigate('PaymentScreen', {
            payuUrl: PAYU_BASE_URL, 
            postData,
            orderPlacedSubmit, // Pass the orderPlacedSubmit function
            txnid
        });
    }


    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Payment Summary'} onPress={() => navigation.goBack()} title={t('ordersummary.paymentsummary')} />
            <ScrollView style={styles.wrapper}>
                <View style={styles.topAstrologerSection}>
                    <View style={styles.sectionHeaderView}>
                        <Text style={styles.sectionHeaderText}>{t('ordersummary.deliverto')}</Text>
                    </View>
                    <View style={styles.totalValue}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <View style={styles.trackButton}>
                                    <Text style={styles.trackButtonText}>{t('ordersummary.change')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.name}>{address?.name}</Text>
                        <Text style={styles.address}>{address?.flat_no}, {address?.area}, {address?.city}, {address?.state}</Text>
                        {address?.landmark?<Text style={styles.pincode}>{address?.landmark}</Text>:null}
                        <Text style={styles.pincode}>{address?.pincode}</Text>
                        <Text style={styles.phone}>{address?.mobile_no}</Text>
                    </View>
                    <View style={styles.sectionHeaderView}>
                        <Text style={styles.sectionHeaderText}>Payment Details</Text>
                    </View>
                    <View style={styles.totalValue}>
                        <View style={styles.amountContainer}>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountText}>Total Amount</Text>
                                <Text style={styles.amountValue}>₹ {route?.params?.productPrice}</Text>
                            </View>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountText}>Tax (GST 18%)</Text>
                                <Text style={styles.amountValue}>₹ {(route?.params?.productPrice * 18) / 100}</Text>
                            </View>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountText}>Shipping Fee</Text>
                                <Text style={styles.amountValue}>₹ {shippingData?.rate.toFixed(2)}</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#E3E3E3',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                marginHorizontal: 5
                            }}
                        />
                        <View style={styles.amountContainer}>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountTotalText}>Total Payable Amount</Text>
                                <Text style={styles.amountTotalValue}>₹ {(
                                    parseFloat(route?.params?.productPrice || 0) +
                                    (route?.params?.productPrice ? (route.params.productPrice * 18) / 100 : 0) +
                                    parseFloat(shippingData?.rate || 0)
                                ).toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: responsiveWidth(90), paddingRight: 10, marginHorizontal: 15, }}>
                    <Image
                        source={chatInfoImg}
                        style={{ height: 20, width: 20, resizeMode: 'contain' }}
                    />
                    <Text style={styles.stickyHeaderText}>We kindly inform you that this product does not qualify for returns or refunds.</Text>
                </View>
            </ScrollView>
            <View style={{ width: responsiveWidth(92), alignSelf: 'center' }}>
                <CustomButton label={"Proceed To Pay"}
                    // onPress={() => { login() }}
                    onPress={() => { ProcedToPay() }}
                //onPress={() => { orderPlacedSubmit() }}
                />
            </View>
        </SafeAreaView >
    )
}

export default withTranslation()(OrderSummary)

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {

    },
    topAstrologerSection: {
        marginHorizontal: 15,
        marginTop: responsiveHeight(1)
    },
    totalValue: {
        width: responsiveWidth(92),
        //height: responsiveHeight(36),
        //alignItems: 'center',
        backgroundColor: '#fff',
        //justifyContent: 'center',
        padding: 10,
        borderRadius: 15,
        ...Platform.select({
              android: {
                elevation: 5, // Only for Android
              },
              ios: {
                shadowColor: '#000', // Only for iOS
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
              },
            }),
        margin: 2,
        marginBottom: responsiveHeight(2)
    },
    totalValue1stSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    profilePicSection: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: responsiveWidth(25),
    },
    profilePicStyle: {
        height: 80,
        width: 80,
        borderRadius: 40,
        resizeMode: 'contain',
        marginBottom: responsiveHeight(1)
    },
    starStyle: {
        marginHorizontal: responsiveWidth(0.5),
        marginBottom: responsiveHeight(1)
    },
    noOfReview: {
        fontSize: responsiveFontSize(1.7),
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Regular',
    },
    rateingView: {
        backgroundColor: '#F6C94B',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingText: {
        fontSize: responsiveFontSize(1.5),
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        marginRight: 5
    },
    staricon: {
        height: 20,
        width: 20,
        resizeMode: 'contain'
    },
    contentStyle: {
        flexDirection: 'column',
        width: responsiveWidth(60),
        //height: responsiveHeight(10),
        //backgroundColor:'red'
    },
    contentStyleName: {
        fontSize: responsiveFontSize(2),
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-Bold',
        marginBottom: responsiveHeight(1)
    },
    contentStyleQualification: {
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Medium',
        marginBottom: responsiveHeight(0.5)
    },
    contentStyleExp: {
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        marginBottom: responsiveHeight(1)
    },
    contentStyleLang: {
        fontSize: responsiveFontSize(1.7),
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Medium',
        marginBottom: responsiveHeight(1)
    },
    contentStyleLangValue: {
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        marginBottom: responsiveHeight(0.5)
    },
    contentStyleRate: {
        fontSize: responsiveFontSize(2),
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        marginBottom: responsiveHeight(1),
        textDecorationLine: 'line-through', textDecorationStyle: 'solid'
    },
    contentStyleRateFree: {
        fontSize: responsiveFontSize(1.7),
        color: '#FF5A6A',
        fontFamily: 'PlusJakartaSans-Medium',
        marginBottom: responsiveHeight(1),
    },
    contentStyleAvailableSlot: {
        fontSize: responsiveFontSize(1.5),
        color: '#444343',
        fontFamily: 'PlusJakartaSans-Medium',
        marginBottom: responsiveHeight(1)
    },
    listButtonSecondSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: responsiveWidth(60),
        alignSelf: 'flex-end',
    },
    iconView: {
        height: responsiveHeight(4.5),
        width: responsiveWidth(30),
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    iconSize: {
        height: 20,
        width: 20,
        marginRight: 5
    },
    buttonText: {
        color: '#1CAB04'
    },
    verticleLine: {
        height: '50%',
        width: 1,
        backgroundColor: '#E3E3E3',
    },
    totalValue2stSection: { width: responsiveWidth(87), backgroundColor: '#FEF3E5', height: responsiveHeight(10), marginTop: responsiveHeight(2), borderRadius: 10, padding: 10, },
    totalValue2stSectionHeader: { color: '#1E2023', fontFamily: 'PlusJakartaSans-Bold', fontSize: responsiveFontSize(1.7) },
    totalValue2stSectionDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: responsiveHeight(2) },
    imageSection1st: { flexDirection: 'row', alignItems: 'center', width: responsiveWidth(35) },
    imageSection1stImg: { height: 20, width: 20, resizeMode: 'contain', marginRight: responsiveWidth(2) },
    imageSection1stText: { color: '##FB7401', fontFamily: 'PlusJakartaSans-SemiBold', fontSize: responsiveFontSize(1.5) },
    imageSection2nd: { flexDirection: 'row', alignItems: 'center', width: responsiveWidth(40), marginLeft: responsiveWidth(1.5) },
    sectionHeaderView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(1),
    },
    sectionHeaderText: {
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2)
    },
    amountContainer: {
        padding: 5
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    amountText: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D'
    },
    amountValue: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D'
    },
    amountTotalText: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.8),
        color: '#8B939D'
    },
    amountTotalValue: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.8),
        color: '#1E2023'
    },
    stickyHeaderText: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
        marginLeft: 5
    },
    name: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.8),
        color: '#808080',
    },
    address: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.8),
        color: '#808080',
    },
    pincode: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.8),
        color: '#808080',
    },
    phone: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.8),
        color: '#808080',
    },
    trackButton: {
        height: responsiveHeight(4),
        width: responsiveWidth(20),
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FB7401',
        borderWidth: 1
    },
    trackButtonText: {
        color: '#FB7401',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.7)
    },
});
