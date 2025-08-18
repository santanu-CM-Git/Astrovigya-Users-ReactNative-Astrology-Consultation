import React, { useState, useMemo, useEffect,useCallback } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Switch, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Alert, Platform } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { TextInput, LongPressGestureHandler, State } from 'react-native-gesture-handler'
import { checkRadioImg, uncheckRadioImg, wallet, walletCredit, walletDebit } from '../../../utils/Images'
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '../../../utils/Loader';
import moment from "moment"
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Entypo';
import RazorpayCheckout from 'react-native-razorpay';
import {API_URL, PAYU_BASE_URL, PAYU_MERCHANT_KEY, PAYU_MERCHANT_SALT, PAYU_SUCCESS_URL, PAYU_FAILURE_URL } from '@env'; 
import CryptoJS from 'crypto-js';
import { withTranslation, useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const WalletRechargeScreen = ({  }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [langvalue, setLangValue] = useState('en');
    const [userInfo, setUserInfo] = useState([])
    const [walletBalance, setWalletBalance] = React.useState(0)
    const [selectedPackageType, setSelectedPackageType] = useState(1);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [packageAmount, setPackageAmount] = useState('');
    const [amount, setAmount] = useState('');
    const [payableAmount, setPayableAmount] = useState(0);
    const [gstAmount, setGstAmount] = useState(0);
    const [packages, setPackages] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true)

    const loadLanguage = async () => {
        try {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (savedLang) {
                console.log(savedLang, 'console language from home screen');

                setLangValue(savedLang);
                i18n.changeLanguage(savedLang);
            }
        } catch (error) {
            console.error('Failed to load language from AsyncStorage', error);
        }
    };

    const generateOrderId = () => {
        const timestamp = Date.now(); // Get the current timestamp in milliseconds
        const randomNum = Math.floor(Math.random() * 100000); // Generate a random number
        return `ORDER-${timestamp}-${randomNum}`; // Combine for the order ID
    }

    const toggleSwitch = async (value) => {
        if (value == 1) {
            setSelectedPackageType(1)
            setAmount('')
        } else if (value == 2) {
            setSelectedPackageType(2)
            setSelectedPackage(null)
            setPackageAmount('')
        }
    };
    const handlePackageSelect = (packageId, packagePrice) => {
        setSelectedPackage(packageId);
        setPackageAmount(packagePrice);
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const changeAmount = (text) => {
        setAmount(text)
    }

    useEffect(() => {
        loadLanguage();
        fetchWalletBalance();
        fetchRechargePackage();
        fetchUserData()
    }, [])

    useFocusEffect(
        useCallback(() => {
            loadLanguage();
            fetchWalletBalance();
            fetchRechargePackage();
        }, [])
    );

    const fetchWalletBalance = () => {
        AsyncStorage.getItem('userToken', async(err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.get(`${API_URL}/user/my-wallet-recharge`, {
                headers: {
                    "Authorization": `Bearer ${usertoken}`,
                    "Content-Type": 'application/json',
                    "Accept-Language": savedLang || 'en',
                },
            })
                .then(res => {
                    //console.log(res.data,'user details')
                    let userBalance = res.data.data.balance;
                    console.log(userBalance, 'wallet balance')
                    setWalletBalance(userBalance)
                    //setIsLoading(false);
                })
                .catch(e => {
                    console.log(`Login error ${e}`)
                    console.log(e.response?.data?.message)
                });
        });
    }
    const fetchRechargePackage = () => {
        AsyncStorage.getItem('userToken', async(err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.get(`${API_URL}/user/package-price-list`, {
                headers: {
                    "Authorization": `Bearer ${usertoken}`,
                    "Content-Type": 'application/json',
                    "Accept-Language": savedLang || 'en',
                },
            })
                .then(res => {
                    //console.log(res.data,'user details')
                    let packageList = res.data.data;
                    console.log(packageList, 'package list')
                    setPackages(packageList)
                    setIsLoading(false);
                })
                .catch(e => {
                    console.log(`Login error ${e}`)
                    console.log(e.response?.data?.message)
                });
        });
    }
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

    const handleProceed = () => {
        let amountToPay = 0;
        if (selectedPackageType === 1) {
            amountToPay = packageAmount;  // Use the package amount
        } else if (selectedPackageType === 2) {
            amountToPay = amount;  // Use the custom amount
        }

        // Check if amount is valid
        if (amountToPay === '' || amountToPay <= 100) {
            Alert.alert(
                'Invalid Amount',
                'Please choose a package or enter a valid amount (minimum amount 100).',
                [{ text: 'OK' }]
            );
            return; 
        }

        const gst = (amountToPay * 18) / 100;  // Calculate GST (18%)

        setPayableAmount(parseFloat(amountToPay));
        setGstAmount(parseFloat(gst));

        toggleModal();  // Open the modal
    };

    const generateHash = (key, txnid, amount, productinfo, firstname, email, salt) => {
        // Concatenate the string in the exact order that PayU requires
        const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;

        // Generate the SHA-512 hash using crypto-js
        const hash = CryptoJS.SHA512(hashString).toString(CryptoJS.enc.Hex);

        return hash;
    };

    const handlePayment = () => {
        toggleModal()
        const txnid = `TXN${new Date().getTime()}`;
        const amount = payableAmount + gstAmount;
        const productinfo = 'Wallet recharge';
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
        navigation.navigate('WPaymentScreen', { 
            payuUrl: PAYU_BASE_URL,
            postData,
            submitForm, // Pass the orderPlacedSubmit function
            txnid
        });


    };

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

    const submitForm = (transId) => {
        AsyncStorage.getItem('userToken', async(err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            const option = {
                "customer_amount": payableAmount,
                "transaction_id": transId,
                "order_id": generateOrderId()
            }
            console.log(option);
            
            axios.post(`${API_URL}/user/my-wallet-recharge`, option, {
                headers: {
                    "Authorization": `Bearer ${usertoken}`,
                    "Content-Type": 'application/json',
                    "Accept-Language": savedLang || 'en',
                },
            })
                .then(res => {
                    console.log(res.data, 'user details')
                    if (res?.data?.response) {
                        let userBalance = res.data.amount;
                        console.log(userBalance, 'wallet balance')
                        setWalletBalance(userBalance)
                        //setIsLoading(false);
                        toggleModal();
                        navigation.navigate('WithdrawSuccess', { amount: payableAmount })
                    } else {
                        handleAlert('Oops..', res?.data?.message);
                    }

                })
                .catch(e => {
                    console.log(`Login error ${e}`)
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
            <CustomHeader commingFrom={'Wallet'} onPress={() => navigation.goBack()} title={t('wallet.wallet')} />
            <ScrollView style={styles.wrapper}>
                <View style={{ marginBottom: responsiveHeight(5), alignSelf: 'center', marginTop: responsiveHeight(2) }}>
                    <View style={styles.totalValue}>

                        <View style={styles.transactionIconView}>
                            <Image
                                source={wallet}
                                style={styles.transactionIconStyle}
                            />
                        </View>
                        <View style={styles.walletTitleView}>
                            <Text style={styles.walletTitleText}>{t('wallet.walletbalance')}</Text>
                            <Text style={styles.walletTitleSubtext}>{t('wallet.availableamount')}</Text>
                        </View>
                        <View style={{ width: responsiveWidth(20) }}>
                            <Text style={styles.walletBalance}>₹{walletBalance ? walletBalance : 0}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.headerStyle}>
                    <Text style={styles.transactionHeader}>{t('wallet.choosefrompackage')}</Text>
                    <TouchableOpacity onPress={() => toggleSwitch(1)}>
                        <Image
                            source={selectedPackageType == 1 ? checkRadioImg : uncheckRadioImg}
                            style={styles.transactionIconStyle}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.packageView}>
                    <View style={styles.singlePackageView}>
                        {packages.map((pkg) => (
                            <TouchableOpacity
                                key={pkg.id}
                                style={[
                                    styles.singlePackage,
                                    selectedPackage === pkg.id
                                        ? { backgroundColor: '#FEF3E5', borderColor: '#ECCEA8' }
                                        : { backgroundColor: '#FFFFFF', borderColor: '#E3E3E3' }
                                ]}
                                onPress={() => handlePackageSelect(pkg.id, pkg.package_price)}
                                disabled={selectedPackageType !== 1}
                            >
                                <Text
                                    style={[
                                        styles.singlePackageAmount,
                                        { color: selectedPackage === pkg.id ? '#894F00' : '#8B939D' }
                                    ]}
                                >
                                    ₹ {pkg.package_price}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.headerStyle}>
                    <Text style={styles.transactionHeader}>{t('wallet.choosecustomamount')}</Text>
                    <TouchableOpacity onPress={() => toggleSwitch(2)}>
                        <Image
                            source={selectedPackageType == 2 ? checkRadioImg : uncheckRadioImg}
                            style={styles.transactionIconStyle}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.amountView}>
                    <InputField
                        label={'Amount'}
                        keyboardType="numeric"
                        value={amount}
                        inputType={selectedPackageType == 2 ? 'others' : 'nonedit'}
                        onChangeText={(text) => changeAmount(text)}
                    />
                </View>
            </ScrollView>
            <View style={{ width: responsiveWidth(92), alignSelf: 'center' }}>
                <CustomButton label={t('wallet.proceed')}
                    // onPress={() => { login() }}
                    onPress={() => { handleProceed() }}
                />
            </View>
            <Modal
                isVisible={isModalVisible}
                style={styles.modalOuterView}>
                {/* <TouchableWithoutFeedback onPress={() => setIsFocus(false)} style={{  }}> */}
                <View style={styles.modalMainView}>
                    <View style={styles.modalPadding}>
                        <View style={styles.tableRow2}>
                            <View style={styles.cellmain}>
                                <Text style={styles.tableHeader2}>{t('wallet.paymentdetails')}</Text>
                            </View>
                            <Icon name="cross" size={30} color="#894F00" onPress={toggleModal} />
                        </View>
                        <View style={styles.amountContainer}>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountText}>{t('wallet.amount')}</Text>
                                <Text style={styles.amountValue}>₹ {payableAmount}</Text>
                            </View>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountText}>{t('wallet.tax')} (GST 18%)</Text>
                                <Text style={styles.amountValue}>₹ {gstAmount}</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#E3E3E3',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                marginHorizontal: 20
                            }}
                        />
                        <View style={styles.amountContainer}>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountTotalText}>{t('wallet.amount')}</Text>
                                <Text style={styles.amountTotalValue}>₹ {(payableAmount + gstAmount).toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: responsiveWidth(92), alignSelf: 'center', position: 'absolute', bottom: 0 }}>
                        <CustomButton label={t('wallet.proceedtopay')}
                            onPress={() => { handlePayment() }}
                        //onPress={() => { submitForm('123testrazorpayId') }}
                        />
                    </View>
                </View>
                {/* </TouchableWithoutFeedback> */}
            </Modal>
        </SafeAreaView>
    )
}

export default withTranslation()(WalletRechargeScreen)

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {
        padding: responsiveWidth(2),

    },
    singleValue: {
        width: responsiveWidth(90),
        height: responsiveHeight(10),
        padding: 5,
        borderBottomColor: '#E4E4E4',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    totalValue: {
        width: responsiveWidth(92),
        height: responsiveHeight(10),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
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
        //justifyContent: 'center',
        padding: 20,
        borderRadius: 15
    },
    transactionIconView: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
        backgroundColor: '#FFF',
        borderColor: '#E3E3E3',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    transactionIconStyle: {
        height: 20,
        width: 20,
        resizeMode: 'contain'
    },
    walletTitleView: {
        flexDirection: 'column',
        marginLeft: 20,
        width: responsiveWidth(40),
        height: responsiveHeight(5),
        justifyContent: 'space-between',
    },
    walletTitleText: {
        color: '#444343',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
    },
    walletTitleSubtext: {
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.5),
    },
    walletBalance: {
        color: '#444343',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2.5),
        textAlign: 'right'
    },
    iconView: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
        backgroundColor: '#F4F5F5',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconStyle: {
        height: 20,
        width: 20,
        resizeMode: 'contain'
    },
    remarkView: {
        flexDirection: 'column',
        marginLeft: 20,
        width: responsiveWidth(45),
    },
    remarkText: {
        color: '#444343',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
    },
    remarkDate: {
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
    },
    remarkAmountView: {
        width: responsiveWidth(20),
        marginLeft: 10
    },
    remarkAmount: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(2),
        textAlign: 'right'
    },
    transactionList: {
        marginBottom: responsiveHeight(10),
        alignSelf: 'center'
    },
    transactionHeader: {
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
    },
    switchStyle: {
        transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }]
    },
    headerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: responsiveHeight(2)
    },
    packageView: {
        marginHorizontal: 10
    },
    singlePackageView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveHeight(1),
        flexWrap: 'wrap'
    },
    singlePackage: {
        height: responsiveHeight(15),
        width: responsiveWidth(29),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 5
    },
    singlePackageAmount: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(3),
    },
    amountView: {
        alignSelf: 'center'
    },
    //modal style
    modalOuterView: {
        margin: 0, // Add this line to remove the default margin
        justifyContent: 'flex-end',
    },
    modalIconView: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', height: 50, width: 50, borderRadius: 25, position: 'absolute', bottom: '55%', left: '45%', right: '45%' },
    modalMainView: { height: '40%', backgroundColor: '#fff', position: 'absolute', bottom: 0, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 },
    modalPadding: { paddingVertical: 0 },
    tableRow2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#FEF3E5',
        backgroundColor: '#FEF3E5',
        height: responsiveHeight(8),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 10
    },
    cellmain: {
        //flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableHeader2: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        color: '#1E2023'
    },
    amountContainer: {
        padding: 20
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    amountText: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(2),
        color: '#8B939D'
    },
    amountValue: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        color: '#8B939D'
    },
    amountTotalText: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(2),
        color: '#8B939D'
    },
    amountTotalValue: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        color: '#1E2023'
    }
});
