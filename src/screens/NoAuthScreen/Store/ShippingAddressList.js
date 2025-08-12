import React, { useContext, useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    FlatList
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Entypo';
import DocumentPicker from 'react-native-document-picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import { dateIcon, plus, timeIcon, userPhoto } from '../../../utils/Images';
import { AuthContext } from '../../../context/AuthContext';
import Loader from '../../../utils/Loader';
import axios from 'axios';
import { API_URL } from '@env'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomHeader from '../../../components/CustomHeader';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from 'react-native-element-dropdown';
import Modal from "react-native-modal";
import Entypo from 'react-native-vector-icons/Entypo';
import moment from "moment"
import Toast from 'react-native-toast-message';
import CheckBox from '@react-native-community/checkbox';
import { withTranslation, useTranslation } from 'react-i18next';

const ShippingAddressList = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [langvalue, setLangValue] = useState('en');
    const [isLoading, setIsLoading] = useState(true)
    const { login, userToken } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState([])
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(1);

    const handleAddressSelect = (id) => {
        setSelectedAddress(id);
    };

    const handleProceed = () => {
        if (selectedAddress) {
            //alert(`Proceeding with address ID: ${selectedAddress}`);
            //orderPlacedSubmit(selectedAddress)
            navigation.navigate('OrderSummary', { addressId: selectedAddress, productPrice: route?.params?.productPrice, productWeight: route?.params?.productWeight })
        } else {
            alert('Please select an address.');
        }
    };

    const orderPlacedSubmit = async (selectedAddress) => {
        setIsLoading(true);
        const option = {
            "gst": "76",
            "coupon": null,
            "coupon_discount": null,
            "shipping_address_id": selectedAddress,
            "shipping_cost": 10,
            "payment_method": "upi",
            "payment_gateway": "Razorpay",
            "payment_gateway_order_id": 'orderId-22',
            "transaction_id": 'hhhhh',
            "payment_status": "paid",
            "shipping_track_link": null
        }
        console.log(option)
        AsyncStorage.getItem('userToken', async(err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.post(`${API_URL}/user/order-place`, option, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en',
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

    //    const handlePayment = () => {
    //         if (payableAmount > 100){
    //             const totalAmount = payableAmount + gstAmount;
    //             const options = {
    //                 description: 'This is the description we need',
    //                 //image: `${BASE_URL}/public/assets/dist/img/logo.jpg`,
    //                 image: ``,
    //                 currency: 'INR',
    //                 key: razorpayKeyId,
    //                 amount: totalAmount * 100,
    //                 name: userInfo?.full_name,
    //                 order_id: '',
    //                 prefill: {
    //                     email: userInfo?.email,
    //                     contact: userInfo?.mobile,
    //                     name: userInfo?.full_name,
    //                 },
    //                 theme: { color: '#D96400' }
    //             };
    //             RazorpayCheckout.open(options).then((data) => {
    //                 console.log(data, 'data');
    //                 submitForm(data.razorpay_payment_id);
    //             }).catch((error) => {
    //                 console.log(JSON.parse(error.description));
    //                 const errorMsg = JSON.parse(error.description);
    //                 console.log(errorMsg.error.description);
    //                 navigation.navigate('PaymentFailed', { message: errorMsg.error.description });
    //             });
    //         }else{
    //             handleAlert('Oops..', "Please recharge more than 100 rupess.")
    //         }


    //     };

    useEffect(() => {
        fetchAddressList()
    }, [])
    useFocusEffect(
        React.useCallback(() => {
            fetchAddressList()
        }, [])
    )

    const fetchAddressList = () => {
        AsyncStorage.getItem('userToken', async (err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.post(`${API_URL}/user/address`, {}, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en', // Default to 'en' if savedLang is not available
                    //'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    console.log(JSON.stringify(res.data.data), 'fetch address data')
                    if (res.data.response == true) {
                        setAddresses(res.data.data)
                        setSelectedAddress(res.data.data[0].id)
                        setIsLoading(false);
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
                    console.log(`fetch address error ${e}`)
                    console.log(e.response)
                    Alert.alert('Oops..', e.response?.data?.message, [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                });
        });
    }


    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader commingFrom={'Add Shipping Address'} onPress={() => navigation.goBack()} title={t('addresslist.title')} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: responsiveHeight(4) }}>
                <View style={styles.wrapper}>
                    <FlatList
                        data={addresses}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.addressBox,
                                    item.id === selectedAddress ? styles.selected : null,
                                ]}
                                onPress={() => handleAddressSelect(item.id)}
                            >
                                <View>
                                    <Text style={styles.name}>{item?.name}</Text>
                                    <Text style={styles.address}>{item?.flat_no}, {item?.area}, {item?.city}, {item?.state}</Text>
                                    {item?.landmark ? <Text style={styles.pincode}>{item?.landmark}</Text> : null}
                                    <Text style={styles.pincode}>{item?.pincode}</Text>
                                    <Text style={styles.phone}>{item?.mobile_no}</Text>
                                </View>
                                {item.id === selectedAddress && (
                                    <Icon name="check" size={20} color="#FB7401" style={styles.icon} />
                                )}
                            </TouchableOpacity>
                        )}
                    />

                </View>

            </KeyboardAwareScrollView>
            <View style={styles.buttonwrapper2}>
                <CustomButton label={t('addresslist.addnewaddress')}
                    // onPress={() => { login() }}
                    buttonColor={'red'}
                    onPress={() => { navigation.navigate('AddShippingAddress', { productPrice: route?.params?.productPrice, productWeight: route?.params?.productWeight}) }}
                />
            </View>
            <View style={styles.buttonwrapper}>
                <CustomButton label={t('addresslist.proceedtopayment')}
                    // onPress={() => { login() }}
                    onPress={() => { handleProceed() }}
                />
            </View>
        </SafeAreaView >
    );
};

export default withTranslation()(ShippingAddressList);

const styles = StyleSheet.create({

    container: {
        //justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    wrapper: {
        paddingHorizontal: 15,
        //height: responsiveHeight(78)
        marginBottom: responsiveHeight(10)
    },
    buttonwrapper: {
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 0,
        width: responsiveWidth(100),
    },
    buttonwrapper2: {
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 55,
        width: responsiveWidth(100),
    },
    addressBox: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selected: {
        borderColor: '#FB7401',
        backgroundColor: '#FFF5E5',
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
