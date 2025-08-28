
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert, Platform, Linking } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, categoryImg, chatColor, chatInfoImg, checkedImg, deleteImg, filterImg, forwordButtonImg, forwordImg, freeServiceImg, horo2Img, image1Img, image2Img, image3Img, image4Img, image5Img, kundliImg, matchmakingImg, phoneColor, productCategoryImg, productImg, starImg, uncheckedImg, userPhoto } from '../../../utils/Images'
import { API_URL } from '@env'
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '../../../utils/Loader';
import moment from "moment"
import StarRating from 'react-native-star-rating-widget';
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Entypo';
import CheckBox from '@react-native-community/checkbox';
import SelectMultiple from 'react-native-select-multiple'
import { Dropdown } from 'react-native-element-dropdown';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import { withTranslation, useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context'

const OrderDetails = ({ route }) => {
    const navigation = useNavigation();
 const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false)
    const [myProductDetails, setMyProductDetails] = useState(route?.params?.details)
    const [starCount, setStarCount] = useState(5)
    const [address, setaddress] = useState('');
    const [addressError, setaddressError] = useState('')

    const submitForm = () => {
        if (address == '') {
            Toast.show({
                type: 'error',
                text1: '',
                text2: t('OrderDetails.Pleasewritesomereview'),
                position: 'top',
                topOffset: Platform.OS == 'ios' ? 55 : 20
            });
        } else {
            const option = {
                "store_product_id": myProductDetails?.store_product_id,
                "comment": address,
                "star": starCount
            }
            setIsLoading(true)
            AsyncStorage.getItem('userToken', async(err, usertoken) => {
                const savedLang = await AsyncStorage.getItem('selectedLanguage');
                axios.post(`${API_URL}/user/product-review`, option, {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${usertoken}`,
                        "Accept-Language": savedLang || 'en', // Default to 'en' if savedLang is not available
                    },
                })
                    .then(res => {
                        //console.log(res.data)
                        if (res.data.response == true) {
                            setIsLoading(false)
                            Toast.show({
                                type: 'success',
                                text1: '',
                                text2: res?.data?.message,
                                position: 'top',
                                topOffset: Platform.OS == 'ios' ? 55 : 20
                            });
                            setaddress('')
                        } else {
                            //console.log('not okk')
                            setIsLoading(false)
                            Alert.alert('Oops..', "Something went wrong.", [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                },
                                { text: 'OK', onPress: () => console.log('OK Pressed') },
                            ]);
                        }
                    })
                    .catch(e => {
                        setIsLoading(false)
                        console.log(`user register error ${e}`)
                        console.log(e.response)
                        Alert.alert('Oops..', e.response?.data?.message, [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ]);
                    });
            });
        }

    }

    useEffect(() => {
        console.log(JSON.stringify(myProductDetails),'myProductDetailsmyProductDetails')
    }, []);
    useFocusEffect(
        React.useCallback(() => {

        }, [])
    );

    const handleTrackOrder = async () => {
        const trackingLink = myProductDetails?.orders[0]?.shipping_track_link;
        if (trackingLink) {
            try {
                const supported = await Linking.canOpenURL(trackingLink);
                if (supported) {
                    await Linking.openURL(trackingLink);
                } else {
                    Alert.alert('Error', 'Cannot open this tracking link');
                }
            } catch (error) {
                console.log('Error opening tracking link:', error);
                Alert.alert('Error', 'Failed to open tracking link');
            }
        } else {
            Alert.alert('Error', 'Tracking link not available');
        }
    }

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Store'} onPress={() => navigation.goBack()} title={t('OrderDetails.OrderDetails')} />
            <ScrollView style={styles.wrapper}>

                <View style={styles.productSection}>

                    <View style={styles.orderHeaderView}>
                        <Text style={styles.orderSectionTitle}>{t('OrderList.orderid')}:
                            <Text style={styles.orderSectionValue}>{myProductDetails?.order_group_id}</Text>
                        </Text>
                        <Text style={styles.orderSectionTitle}>{t('OrderList.date')}:
                            <Text style={styles.orderSectionValue}>{moment(myProductDetails?.created_at).format('DD-MM-YYYY')}</Text>
                        </Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => navigation.push('ProductDetails',{ productId: myProductDetails?.store_product?.id })}>
                        <View style={styles.totalValue}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={{ uri: myProductDetails?.store_product?.images[0] }}
                                    style={styles.productImg}
                                />
                                <View style={{ flexDirection: 'column', marginLeft: responsiveWidth(2) }}>
                                    <Text style={styles.productText}>{myProductDetails?.store_product?.name}</Text>
                                    <View style={styles.productAmountView}>
                                        <Text style={styles.productAmount}>₹ {myProductDetails?.store_product_varient ? myProductDetails?.store_product_varient?.price : myProductDetails?.store_product?.price}</Text>

                                    </View>
                                    <Text style={styles.productQty}>{t('OrderList.qty')}: {myProductDetails?.qty}</Text>
                                </View>

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {myProductDetails?.orders[0]?.shipping_track_link?
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>{t('OrderDetails.trackyourorder')}</Text>
                </View>:null}
                {myProductDetails?.orders[0]?.shipping_track_link?
                <Text style={styles.sectionHeaderText2}>{t('OrderDetails.trackdesc')}</Text>
                :null}
                 {myProductDetails?.orders[0]?.shipping_track_link?
                <TouchableOpacity style={styles.trackButton} onPress={handleTrackOrder}>
                    <Text style={styles.trackButtonText}>{t('OrderDetails.trackordernow')}</Text>
                </TouchableOpacity> 
                :null}
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>{t('OrderDetails.shippingdetails')}</Text>
                </View>
                <View>
                    <Text style={styles.name}>{myProductDetails?.orders[0]?.shipping_address?.name}</Text>
                    <Text style={styles.address}>{myProductDetails?.orders[0]?.shipping_address?.flat_no}, {myProductDetails?.orders[0]?.shipping_address?.area}, {myProductDetails?.orders[0]?.shipping_address?.city}, {myProductDetails?.orders[0]?.shipping_address?.state}</Text>
                    <Text style={styles.pincode}>{myProductDetails?.orders[0]?.shipping_address?.landmark}</Text>
                    <Text style={styles.pincode}>{myProductDetails?.orders[0]?.shipping_address?.pincode}</Text>
                    <Text style={styles.phone}>{myProductDetails?.orders[0]?.shipping_address?.mobile_no}</Text>
                </View>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>{t('OrderDetails.howwasexp')}</Text>
                </View>
                <View style={{ alignSelf: 'baseline', width: responsiveWidth(50), marginTop: responsiveHeight(2) }}>
                    <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={starCount}
                        onChange={(rating) => setStarCount(rating)}
                        fullStarColor={'#FFCB45'}
                        starSize={30}
                        starStyle={{ marginHorizontal: responsiveWidth(1) }}
                    />
                </View>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>{t('OrderDetails.writeareview')}</Text>
                </View>
                <View style={{ marginTop: responsiveHeight(1) }}>
                    <InputField
                        label={t('OrderDetails.enterreview')}
                        keyboardType="default"
                        value={address}
                        helperText={addressError}
                        inputType={'address'}
                        inputFieldType={'address'}
                        onChangeText={(text) => {``
                            setaddress(text)
                        }}
                    />
                </View>
                <View style={{ width: responsiveWidth(90), alignSelf: 'center', }}>
                    <CustomButton label={t('OrderDetails.submitreview')}
                        // onPress={() => { booknow() }}
                        onPress={() => { submitForm() }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default withTranslation()(OrderDetails)

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {
        paddingHorizontal: 15
    },
    productSection: {
        marginTop: responsiveHeight(2)
    },
    totalValue: {
        width: responsiveWidth(91),
        //height: responsiveHeight(16),
        //alignItems: 'center',
        backgroundColor: '#fff',
        //justifyContent: 'center',
        padding: 5,
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
    productImg: {
        height: responsiveHeight(12),
        width: responsiveFontSize(15),
        resizeMode: 'cover',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    productText: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(2),
        marginVertical: responsiveHeight(0)
    },
    productAmountView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    productAmount: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
        marginRight: responsiveWidth(2)
    },
    productQty: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
    },
    cartButton: {
        height: responsiveHeight(5),
        width: responsiveWidth(30),
        borderColor: '#FB7401',
        borderRadius: 8,
        borderWidth: 1,
        marginVertical: responsiveHeight(1),
        justifyContent: 'center',
        alignItems: 'center'
    },
    cartButtonText: {
        color: '#FB7401',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(2),
    },
    orderHeaderView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    },
    orderSectionTitle: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
    },
    orderSectionValue: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.7),
    },
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
    sectionHeaderText2: {
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7)
    },
    trackButton: {
        height: responsiveHeight(6),
        width: responsiveWidth(40),
        backgroundColor: '#1E2023',
        marginTop: responsiveHeight(2),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    trackButtonText: {
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2)
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
    icon: {
        alignSelf: 'flex-start'
    }
});
