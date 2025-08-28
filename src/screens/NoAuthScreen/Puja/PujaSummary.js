import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert, Platform } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, chatColor, checkedImg, dateIcon, filterImg, phoneColor, starImg, timeIcon, uncheckedImg, userPhoto } from '../../../utils/Images'
import { API_URL } from '@env'
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '../../../utils/Loader';
import moment from "moment"
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import RazorpayCheckout from 'react-native-razorpay';
import { PAYU_BASE_URL, PAYU_MERCHANT_KEY, PAYU_MERCHANT_SALT, PAYU_SUCCESS_URL, PAYU_FAILURE_URL } from '@env';
import CryptoJS from 'crypto-js';
import { withTranslation, useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'

const PujaSummary = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [userInfo, setUserInfo] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [pujaDetails, setPujaDetails] = useState(route?.params?.pujaDetails)
    const [astroDetails, setAstroDetails] = useState(route?.params?.astroDetails)
    const [selectedPujaDate, setSelectedPujaDate] = useState(route?.params?.pujaDate)


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
        console.log(pujaDetails, ' puja details');
        console.log(astroDetails, ' astro details');
        fetchUserData()
    }, [])

    const fetchUserData = () => {
        AsyncStorage.getItem('userToken', async (err, usertoken) => {
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
                    setIsLoading(false);
                })
                .catch(e => {
                    console.log(`Login error ${e}`)
                    console.log(e.response?.data?.message)
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
        const amount = (
            Number(astroDetails?.rate_price) + (Number(astroDetails?.rate_price) * 18) / 100
          ).toFixed(2);
        const productinfo = 'Puja booking';
        const firstname = userInfo.name;
        const email = userInfo.email;
        console.log(amount, 'amountamountamountamount')
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
        navigation.navigate('PPaymentScreen', {
            payuUrl: PAYU_BASE_URL,
            postData,
            submitForm, // Pass the orderPlacedSubmit function
            txnid
        });
    }

    const confirmationBeforeSubmit = (transId) => {
        Alert.alert(
            t('pujaSummary.NoRefundAvailable'),
            t('pujaSummary.desc'),
            [

                { text: t('pujaSummary.OK'), onPress: () => ProcedToPay() },
            ]
        );
    }

    const submitForm = (transId) => {
        setIsLoading(true)
        console.log(transId);

        AsyncStorage.getItem('userToken', async (err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            const option = {
                "astrologer_id": astroDetails?.user_id,
                "puja_id": astroDetails?.puja_id,
                "puja_date_id": astroDetails?.puja_date_id,
                "puja_available_id": astroDetails?.id,
                "amount": Number(astroDetails?.rate_price),
                "gst": Number((astroDetails?.rate_price * 18) / 100)
            }
            console.log(option);

            axios.post(`${API_URL}/user/puja-booking`, option, {
                headers: {
                    "Authorization": `Bearer ${usertoken}`,
                    "Content-Type": 'application/json',
                    "Accept-Language": savedLang || 'en',
                },
            })
                .then(res => {
                    console.log(res.data, 'user details')
                    if (res?.data?.response) {
                        navigation.navigate('PujaSuccess')
                        setIsLoading(false)
                    } else {
                        handleAlert('Oops..', res?.data?.message);
                        setIsLoading(true)
                    }

                })
                .catch(e => {
                    console.log(`puja-booking error ${e}`)
                    console.log(e.response?.data?.message)
                });
        });
    }

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Summary'} onPress={() => navigation.goBack()} title={t('pujaSummary.Summary')} />
            <ScrollView style={styles.wrapper}>
                <View style={styles.topAstrologerSection}>
                    <View style={styles.totalValue}>
                        <View style={styles.totalValue1stSection}>
                            <View style={styles.profilePicSection}>
                                {astroDetails?.astrologer_details?.profile_pic ?
                                    <Image
                                        source={{ uri: astroDetails?.astrologer_details?.profile_pic }}
                                        style={styles.profilePicStyle}
                                    /> :
                                    <Image
                                        source={userPhoto}
                                        style={styles.profilePicStyle}
                                    />
                                }
                            </View>
                            <View style={styles.contentStyle}>
                                <Text style={styles.contentStyleName}>{astroDetails?.astrologer_details?.display_name}</Text>
                                <Text style={styles.contentStyleQualification}>{astroDetails?.astrologer_details?.astrologer_specialization?.map(spec => spec.specializations_name).join(', ')}</Text>
                                <Text style={styles.contentStyleLangValue}>{astroDetails?.astrologer_details?.astrologer_language?.map(lang => lang.language).join(', ')}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: responsiveWidth(55) }}>
                                    <Text style={styles.contentStyleExp}>Exp : {astroDetails?.astrologer_details?.year_of_experience} Years</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.totalValue2stSection}>
                            <Text style={styles.totalValue2stSectionHeader}>{pujaDetails?.name}</Text>
                            <View style={styles.totalValue2stSectionDetails}>
                                <View style={styles.imageSection1st}>
                                    <Image
                                        source={dateIcon}
                                        style={styles.imageSection1stImg}
                                        tintColor={'#FB7401'}
                                    />
                                    <Text style={styles.imageSection1stText}>{moment(selectedPujaDate).format('ddd, D MMM, YYYY')}</Text>
                                </View>
                                <View style={styles.imageSection2nd}>
                                    <Image
                                        source={timeIcon}
                                        style={styles.imageSection1stImg}
                                        tintColor={'#FB7401'}
                                    />
                                    <Text style={styles.imageSection1stText}>{moment(astroDetails.st, 'HH:mm:ss').format('hh:mm A')} - {moment(astroDetails.et, 'HH:mm:ss').format('hh:mm A')}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.sectionHeaderView}>
                        <Text style={styles.sectionHeaderText}>{t('pujaSummary.PaymentDetails')}</Text>
                    </View>
                    <View style={styles.totalValue}>
                        <View style={styles.amountContainer}>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountText}>{t('pujaSummary.PujaBookingFee')}</Text>
                                <Text style={styles.amountValue}>₹ {Number(astroDetails?.rate_price).toFixed(2)}</Text>
                            </View>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountText}>{t('pujaSummary.Tax')} (GST 18%)</Text>
                                <Text style={styles.amountValue}>
                                    ₹ {((Number(astroDetails?.rate_price) * 18) / 100).toFixed(2)}
                                </Text>
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
                                <Text style={styles.amountTotalText}>{t('pujaSummary.TotalPayableAmount')}</Text>
                                <Text style={styles.amountTotalValue}>
                                    ₹ {(Number(astroDetails?.rate_price) + (Number(astroDetails?.rate_price) * 18) / 100).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

            </ScrollView>
            <View style={{ width: responsiveWidth(92), alignSelf: 'center' }}>
                <CustomButton label={t('pujaSummary.ProceedToPay')}
                    // onPress={() => { login() }}
                    //onPress={() => { ProcedToPay() }}
                    onPress={() => { confirmationBeforeSubmit() }}
                />
            </View>
        </SafeAreaView >
    )
}

export default withTranslation()(PujaSummary)

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
    imageSection1stText: { color: '#FB7401', fontFamily: 'PlusJakartaSans-SemiBold', fontSize: responsiveFontSize(1.5) },
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
    }
});
