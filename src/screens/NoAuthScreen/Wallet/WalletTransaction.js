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

const WalletTransaction = ({ navigation }) => {

    const [walletBalance, setWalletBalance] = React.useState(0)

    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

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
            <CustomHeader commingFrom={'Wallet Transaction'} onPress={() => navigation.goBack()} title={'Wallet Transaction'} />
            <ScrollView style={styles.wrapper}>
                <View style={{ marginBottom: responsiveHeight(5), alignSelf: 'center', marginTop: responsiveHeight(2) }}>
                    <View style={styles.totalValue}>
                        <View style={styles.walletTitleView}>
                            <Text style={styles.walletTitleSubtext}>Wallet Balance</Text>
                            <Text style={styles.walletTitleText}>₹{walletBalance}</Text>
                        </View>
                        <View style={{ width: responsiveWidth(30), marginBottom: -20 }}>
                            <CustomButton label={"Recharge"}
                                // onPress={() => { login() }}
                                onPress={() => { deleteAccount() }}

                            />
                        </View>
                    </View>
                </View>
                <Text style={styles.transactionHeader}>Recent Transaction</Text>
                <View style={styles.transactionList}>
                    <View style={styles.singleValue}>
                        <View style={styles.iconView}>
                            <Image
                                source={walletDebit}
                                style={styles.iconStyle}
                            />
                        </View>
                        <View style={styles.remarkView}>
                            <Text style={styles.remarkText}>dssf</Text>
                            <Text style={styles.remarkDate}>29 March, 2024</Text>
                        </View>
                        <View style={styles.remarkAmountView}>
                            <Text style={[styles.remarkAmount, { color: '#E1293B', }]}>- ₹444</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default WalletTransaction

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {
        padding: responsiveWidth(2),

    },
    totalValue: {
        width: responsiveWidth(92),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        elevation: 5,
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 15
    },
    walletTitleView: {
        flexDirection: 'column',
        marginLeft: 20,
        // width: responsiveWidth(40),
        // height: responsiveHeight(7),
        justifyContent: 'space-between',
    },
    walletTitleText: {
        color: '#444343',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(3),
    },
    walletTitleSubtext: {
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.5),
    },
    transactionHeader: {
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
        marginLeft: responsiveWidth(3)
    },
    transactionList: {
        marginBottom: responsiveHeight(10),
        alignSelf: 'center'
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
        fontFamily: 'DMSans-SemiBold',
        fontSize: responsiveFontSize(2),
    },
    remarkDate: {
        color: '#746868',
        fontFamily: 'DMSans-Regular',
        fontSize: responsiveFontSize(1.7),
    },
    remarkAmountView: {
        width: responsiveWidth(20),
        marginLeft: 10
    },
    remarkAmount: {
        fontFamily: 'DMSans-Regular',
        fontSize: responsiveFontSize(2),
        textAlign: 'right'
    },
});
