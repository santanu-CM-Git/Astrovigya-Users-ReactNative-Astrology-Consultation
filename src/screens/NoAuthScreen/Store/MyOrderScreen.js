
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, ImageBackground, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert, Platform } from 'react-native'
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
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Entypo';
import CheckBox from '@react-native-community/checkbox';
import SelectMultiple from 'react-native-select-multiple'
import { Dropdown } from 'react-native-element-dropdown';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import LinearGradient from 'react-native-linear-gradient';
import { withTranslation, useTranslation } from 'react-i18next';

const MyOrderScreen = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [langvalue, setLangValue] = useState('en');
    const [isLoading, setIsLoading] = useState(true)
    const [myProductData, setMyProductData] = useState([])
    const [perPage, setPerPage] = useState(10);
    const [pageno, setPageno] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

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

    const fetchAllMyOrder = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                console.log('No user token found');
                setIsLoading(false);
                return;
            }
            const response = await axios.post(`${API_URL}/user/my-order`, {}, {
                params: {
                    page
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                    "Accept-Language": savedLang || 'en', // Default to 'en' if savedLang is not available
                },
            });

            const responseData = response.data.data.data;
            console.log(responseData, 'all myorder')
            setMyProductData(prevData => page === 1 ? responseData : [...prevData, ...responseData]);
            if (responseData.length === 0) {
                setHasMore(false); // No more data to load
            }
            setIsLoading(false);
        } catch (error) {
            console.log(`all myorder error: ${error}`);
            let myerror = error.response?.data?.message;
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                { text: 'OK', onPress: () => myerror == 'Unauthorized' ? logout() : console.log('OK Pressed') },
            ]);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    }, []);

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

    useEffect(() => {
        loadLanguage()
        fetchAllMyOrder()
    }, []);
    useFocusEffect(
        React.useCallback(() => {
            loadLanguage()
            fetchAllMyOrder()
        }, [])
    );

    useEffect(() => {
        fetchAllMyOrder(pageno);
    }, [fetchAllMyOrder, pageno]);

    useFocusEffect(
        useCallback(() => {
            fetchAllMyOrder()
        }, [fetchAllMyOrder])
    );

    const renderMyorder = ({ item }) => {
        return (
            <>
                <View style={styles.orderHeaderView}>
                    <Text style={styles.orderSectionTitle}>{t('OrderList.orderid')}:
                        <Text style={styles.orderSectionValue}>{item?.order_group_id}</Text>
                    </Text>
                    <Text style={styles.orderSectionTitle}>{t('OrderList.date')}:
                        <Text style={styles.orderSectionValue}>{moment(item?.created_at).format('DD-MM-YYYY')}</Text>
                    </Text>
                </View>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('OrderDetails', { details: item })}>
                    <View style={styles.totalValue}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={{ uri: item?.store_product?.images[0] }}
                                style={styles.productImg}
                            />
                            <View style={{ flexDirection: 'column', marginLeft: responsiveWidth(2) }}>
                                <Text style={styles.productText}>{item?.store_product?.name}</Text>
                                <View style={styles.productAmountView}>
                                    <Text style={styles.productAmount}>₹ {item?.store_product_varient ? item?.store_product_varient?.price : item?.store_product?.price}</Text>

                                </View>
                                <Text style={styles.productQty}>{t('OrderList.qty')}: {item?.qty}</Text>
                            </View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ position: 'absolute', top: 35, right: 10 }}>
                    <Image
                        source={forwordImg}
                        style={{ height: 20, width: 20 }}
                        tintColor={"#FB7401"}
                    />
                </View>
            </>

        )
    };

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Store'} onPress={() => navigation.goBack()} title={t('OrderList.orderlist')} />
            <ScrollView style={styles.wrapper}>

                <View style={styles.productSection}>
                    {myProductData.length > 0 ?
                        <FlatList
                            data={myProductData}
                            renderItem={renderMyorder}
                            keyExtractor={(item) => item.id.toString()}
                            maxToRenderPerBatch={10}
                            windowSize={5}
                            initialNumToRender={10}
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={renderFooter}
                            getItemLayout={(myProductData, index) => (
                                { length: 50, offset: 50 * index, index }
                            )}
                        /> :
                        <Text style={{
                            color: '#894F00',
                            fontFamily: 'PlusJakartaSans-Bold',
                            fontSize: responsiveFontSize(1.7), textAlign: 'center'
                        }}>{t('OrderList.NoOrderFound')}</Text>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default withTranslation()(MyOrderScreen)

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
        margin: 1,
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
    }
});
