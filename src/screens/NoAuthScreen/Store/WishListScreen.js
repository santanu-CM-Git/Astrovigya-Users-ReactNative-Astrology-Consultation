
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, ImageBackground, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert, Platform } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, categoryImg, chatColor, chatInfoImg, checkedImg, deleteImg, filterImg, forwordButtonImg, freeServiceImg, horo2Img, image1Img, image2Img, image3Img, image4Img, image5Img, kundliImg, matchmakingImg, phoneColor, productCategoryImg, productImg, starImg, uncheckedImg, userPhoto } from '../../../utils/Images'
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

const WishListScreen = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [langvalue, setLangValue] = useState('en');
    const [isLoading, setIsLoading] = useState(true)
    const [wishlistData, setWishlistData] = useState([])
    const [searchValue, setSearchValue] = useState('');
    const searchInputRef = useRef(null);
    const changeSearchValue = (text) => {

        setSearchValue(text);
    }

    const deleteFromWishlist = (productId) => {
        Alert.alert(
            '',
            `Are you sure to remove this item from wishlist?`,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('cancel pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        deleteWishlistApi(productId)
                    },
                },
            ],
        );
    }

    const deleteWishlistApi = (productId) => {
        console.log(productId)
        const option = {
            "store_products_id": productId
        }
        AsyncStorage.getItem('userToken', async (err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.post(`${API_URL}/user/wishlist`, option, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en', // Default to 'en' if savedLang is not available
                    //'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    console.log(JSON.stringify(res.data), 'add wishlist response')
                    if (res.data.response == true) {
                        setIsLoading(false);
                        Toast.show({
                            type: 'success',
                            text1: '',
                            text2: res?.data?.message,
                            position: 'top',
                            topOffset: Platform.OS == 'ios' ? 55 : 20
                        });
                        fetchAllWishlist()
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
                    console.log(`add wishlist error ${e}`)
                    console.log(e.response)
                    Alert.alert('Oops..', e.response?.data?.message, [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                });
        });
    }

    const fetchAllWishlist = () => {
        AsyncStorage.getItem('userToken', async (err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.get(`${API_URL}/user/wishlist`, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en', // Default to 'en' if savedLang is not available
                    //'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    console.log(JSON.stringify(res.data), 'all wishlist response')
                    if (res.data.response == true) {
                        setWishlistData(res.data.data)
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
                    console.log(`all wishlist error ${e}`)
                    console.log(e.response)
                    Alert.alert('Oops..', e.response?.data?.message, [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                });
        });
    }
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
        fetchAllWishlist()
    }, []);
    useFocusEffect(
        React.useCallback(() => {
            loadLanguage()
            fetchAllWishlist()
        }, [])
    );

    const renderWishlist = ({ item }) => {
        return (
            <>
                <TouchableWithoutFeedback onPress={() => navigation.push('ProductDetails', { productId: item?.store_product?.id })}>
                    <View style={styles.totalValue}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={{ uri: item?.store_product?.images[0] }}
                                style={styles.productImg}
                            />
                            <View style={{ flexDirection: 'column', marginLeft: responsiveWidth(2) }}>
                                <Text style={styles.productText}>{item?.store_product?.name}</Text>
                                <View style={styles.productAmountView}>
                                    <Text style={styles.productAmount}>₹ {item?.store_product?.price}</Text>

                                </View>
                                <Text style={styles.productPreviousAmount}>₹ {item?.store_product?.max_price}</Text>
                            </View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ position: 'absolute', top: 10, right: 10 }}>
                    <TouchableOpacity onPress={(e) => {
                        e.stopPropagation();
                        deleteFromWishlist(item?.store_product?.id)
                    }}>
                        <Image
                            source={deleteImg}
                            style={{ height: 20, width: 20 }}
                        />
                    </TouchableOpacity>
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
            <CustomHeader commingFrom={'Store'} onPress={() => navigation.goBack()} title={t('Wishlist.wishlist')} />
            <ScrollView style={styles.wrapper}>

                <View style={styles.productSection}>
                    {wishlistData.length > 0 ?
                        <FlatList
                            data={wishlistData}
                            renderItem={renderWishlist}
                            keyExtractor={(item) => item.id.toString()}
                            maxToRenderPerBatch={10}
                            windowSize={5}
                            initialNumToRender={10}
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            getItemLayout={(wishlistData, index) => (
                                { length: 50, offset: 50 * index, index }
                            )}
                        />
                        :
                        <Text style={{
                            color: '#894F00',
                            fontFamily: 'PlusJakartaSans-Bold',
                            fontSize: responsiveFontSize(1.7), textAlign: 'center'
                        }}>No Wishlist Found</Text>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default withTranslation()(WishListScreen)

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
        height: responsiveHeight(16),
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
        height: responsiveHeight(15),
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
        marginVertical: responsiveHeight(1)
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
    productPreviousAmount: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
        textDecorationLine: 'line-through'
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
    }
});
