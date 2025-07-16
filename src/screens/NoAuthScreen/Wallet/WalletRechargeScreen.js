import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Switch, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { TextInput, LongPressGestureHandler, State } from 'react-native-gesture-handler'
import { checkRadioImg, uncheckRadioImg, wallet, walletCredit, walletDebit } from '../../../utils/Images'
import { API_URL } from '@env'
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '../../../utils/Loader';
import moment from "moment"
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Entypo';

const WalletRechargeScreen = ({ navigation }) => {

    const [walletBalance, setWalletBalance] = React.useState(0)
    const [selectedPackageType, setSelectedPackageType] = useState(1);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [amount, setAmount] = useState('')
    const packages = [
        { id: 1, amount: 101 },
        { id: 2, amount: 201 },
        { id: 3, amount: 301 },
        { id: 3, amount: 401 },
    ];
    const [isModalVisible, setModalVisible] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const toggleSwitch = async (value) => {
        if (value == 1) {
            setSelectedPackageType(1)
        } else if (value == 2) {
            setSelectedPackageType(2)
        }
    };
    const handlePackageSelect = (packageId) => {
        setSelectedPackage(packageId);
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const changeAmount = (text) => {
        setAmount(text)
    }

    useEffect(() => {
        // fetchWalletBalance();
    }, [])

    const fetchWalletBalance = () => {
        AsyncStorage.getItem('userToken', (err, usertoken) => {
            axios.post(`${API_URL}/patient/wallet`, {}, {
                headers: {
                    "Authorization": `Bearer ${usertoken}`,
                    "Content-Type": 'application/json'
                },
            })
                .then(res => {
                    //console.log(res.data,'user details')
                    let userBalance = res.data.wallet_amount;
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

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Wallet'} onPress={() => navigation.goBack()} title={'Wallet'} />
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
                            <Text style={styles.walletTitleText}>Wallet Balance</Text>
                            <Text style={styles.walletTitleSubtext}>Available Amount</Text>
                        </View>
                        <View style={{ width: responsiveWidth(20), marginLeft: 10 }}>
                            <Text style={styles.walletBalance}>₹{walletBalance}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.headerStyle}>
                    <Text style={styles.transactionHeader}>Choose From Package</Text>
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
                                onPress={() => handlePackageSelect(pkg.id)}
                            >
                                <Text
                                    style={[
                                        styles.singlePackageAmount,
                                        { color: selectedPackage === pkg.id ? '#894F00' : '#8B939D' }
                                    ]}
                                >
                                    ₹ {pkg.amount}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.headerStyle}>
                    <Text style={styles.transactionHeader}>Choose Custom Amount</Text>
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
                <CustomButton label={"Proceed"}
                    // onPress={() => { login() }}
                    onPress={() => { toggleModal() }}
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
                                <Text style={styles.tableHeader2}>Payment Details</Text>
                            </View>
                            <Icon name="cross" size={30} color="#894F00" onPress={toggleModal} />
                        </View>
                        <View style={styles.amountContainer}>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountText}>Amount</Text>
                                <Text style={styles.amountValue}>₹ 149</Text>
                            </View>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountText}>Tax (GST 18%)</Text>
                                <Text style={styles.amountValue}>₹ 27</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#E3E3E3',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                marginHorizontal:20
                            }}
                        />
                        <View style={styles.amountContainer}>
                        <View style={styles.amountRow}>
                                <Text style={styles.amountTotalText}>Amount</Text>
                                <Text style={styles.amountTotalValue}>₹ 149</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: responsiveWidth(92), alignSelf: 'center', position: 'absolute', bottom: 0 }}>
                        <CustomButton label={"Proceed To Pay"}
                            // onPress={() => { login() }}
                            onPress={() => { navigation.navigate('WithdrawSuccess') }}
                        />
                    </View>
                </View>
                {/* </TouchableWithoutFeedback> */}
            </Modal>
        </SafeAreaView>
    )
}

export default WalletRechargeScreen

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
        elevation: 5,
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
        justifyContent: 'space-between'
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
    amountTotalText:{
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(2),
        color: '#8B939D'
    },
    amountTotalValue:{
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        color: '#1E2023'
    }
});
