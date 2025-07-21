import React, { useState, useMemo, useEffect,useCallback } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Switch, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Platform } from 'react-native'
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { withTranslation, useTranslation } from 'react-i18next';

const WalletTransaction = ({  }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [walletBalance, setWalletBalance] = React.useState(0)
    const [WalletTransaction, setWalletTransaction] = useState([])
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    //pagination
    const [hasMore, setHasMore] = useState(true);
    const [perPage, setPerPage] = useState(10);
    const [pageno, setPageno] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchWalletBalance();
        fetchWalletTransaction(pageno);
    }, [fetchWalletTransaction, pageno]);

    useFocusEffect(
        useCallback(() => {
            fetchWalletBalance();
            setPageno(1);
            setHasMore(true); // Reset hasMore on focus
            fetchWalletTransaction(1);
        }, [fetchWalletTransaction])
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
    const fetchWalletTransaction = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                console.log('No user token found');
                setIsLoading(false);
                return;
            }
            const response = await axios.post(`${API_URL}/user/wallet-transactions`, {}, {
                params: {
                    page
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                    "Accept-Language": savedLang || 'en',
                },
            });

            const responseData = response.data.data.data;
            console.log(responseData, 'wallet-transactions')
            setWalletTransaction(prevData => page === 1 ? responseData : [...prevData, ...responseData]);
            if (responseData.length === 0) {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            console.log(`Fetch wallet-transactions error: ${error}`);
            let myerror = error.response?.data?.message;
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                { text: 'OK', onPress: () => myerror == 'Unauthorized' ? logout() : console.log('OK Pressed') },
            ]);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    }, []);

    const renderWalletTransaction = ({ item }) => (
        <View style={styles.singleValue}>
            <View style={styles.iconView}>
                <Image
                    source={item.transaction_type == 'credit' ? walletCredit : walletDebit}
                    style={styles.iconStyle}
                />
            </View>
            <View style={styles.remarkView}>
                <Text style={styles.remarkText}>{item.description}</Text>
                <Text style={styles.remarkDate}>{moment(item.created_at).format('dddd, D MMMM')}</Text>
            </View>
            {item.transaction_type == 'credit' ?
                <View style={styles.remarkAmountView}>
                    <Text style={[styles.remarkAmount, { color: '#19BF1F', }]}>+ ₹{item.amount}</Text>
                </View>
                :
                <View style={styles.remarkAmountView}>
                    <Text style={[styles.remarkAmount, { color: '#E1293B', }]}>- ₹{item.amount}</Text>
                </View>
            }
        </View>
    );

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPageno(prevPage => prevPage + 1);
        }
    };

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.loaderContainer}>
                <Loader />
            </View>
        );
    };

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Wallet Transaction'} onPress={() => navigation.goBack()} title={t('wallettransaction.wallettransaction')} />
            <ScrollView style={styles.wrapper}>
                <View style={{ marginBottom: responsiveHeight(5), alignSelf: 'center', marginTop: responsiveHeight(2) }}>
                    <View style={styles.totalValue}>
                        <View style={styles.walletTitleView}>
                            <Text style={styles.walletTitleSubtext}>{t('wallettransaction.walletbalance')}</Text>
                            <Text style={styles.walletTitleText}>₹{walletBalance}</Text>
                        </View>
                        <View style={{ width: responsiveWidth(30), marginBottom: -20 }}>
                            <CustomButton label={t('wallettransaction.recharge')}
                                // onPress={() => { login() }}
                                onPress={() => { navigation.navigate('WalletRechargeScreen') }}

                            />
                        </View>
                    </View>
                </View>
                <Text style={styles.transactionHeader}>{t('wallettransaction.recenttransaction')}</Text>
                <View style={styles.transactionList}>
                    <FlatList
                        data={WalletTransaction}
                        renderItem={renderWalletTransaction}
                        keyExtractor={(item) => item.id?.toString()}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        initialNumToRender={10}
                        showsVerticalScrollIndicator={false}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                        getItemLayout={(WalletTransaction, index) => (
                            { length: 50, offset: 50 * index, index }
                        )}
                    />
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default withTranslation()(WalletTransaction)

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
        fontSize: responsiveFontSize(1.7),
        textAlign: 'right'
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
