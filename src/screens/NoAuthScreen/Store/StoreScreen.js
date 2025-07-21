import React, { useState, useMemo, useEffect, useCallback, useRef, memo, useContext } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, ImageBackground, TextInput, Image, FlatList, TouchableOpacity, Animated, RefreshControl, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, categoryImg, chatColor, checkedImg, filterImg, forwordButtonImg, freeServiceImg, horo2Img, image1Img, image2Img, image3Img, image4Img, image5Img, kundliImg, matchmakingImg, phoneColor, productCategoryImg, starImg, uncheckedImg, userPhoto } from '../../../utils/Images'
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
import { AuthContext } from '../../../context/AuthContext';
import { withTranslation, useTranslation } from 'react-i18next';

const StoreScreen = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [langvalue, setLangValue] = useState('en');
    const { insertToCart } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false)
    const [category, setCategory] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    if (isLoading) {
        return (
            <Loader />
        )
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
        fetchCategory();
        fetchCartProduct()
    }, []);
    useFocusEffect(
        React.useCallback(() => {
            loadLanguage()
            fetchCategory(); // Call the async function
            fetchCartProduct()
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchCategory();
        setRefreshing(false);
    };

    const fetchCartProduct = () => {
        AsyncStorage.getItem('userToken', async(err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.get(`${API_URL}/user/add-to-cart`, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en',
                    //'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    console.log(JSON.stringify(res.data.data), 'fetch cart data from store screen')
                    if (res.data.response == true) {
                        const formattedData = res.data.data.map(item => ({
                            store_products_id: item.store_products_id ? item.store_products_id : null,
                            store_product_variations_id: item.store_product_variations_id ? item.store_product_variations_id : null,
                            price: item.price ? item.price : null,
                            qty: item.qty ? item.qty : 1
                        }));
                        insertToCart(formattedData)
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
                    console.log(`fetch cart error ${e}`)
                    console.log(e.response)
                    Alert.alert('Oops..', e.response?.data?.message, [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                });
        });
    }
    // const fetchCategory = () => {
    //     AsyncStorage.getItem('userToken', (err, usertoken) => {
    //         axios.get(`${API_URL}/user/category`, {
    //             headers: {
    //                 'Accept': 'application/json',
    //                 "Authorization": 'Bearer ' + usertoken,
    //                 //'Content-Type': 'multipart/form-data',
    //             },
    //         })
    //             .then(res => {
    //                 console.log(JSON.stringify(res.data.data), 'fetch all category')
    //                 if (res.data.response == true) {
    //                     setCategory(res.data.data);
    //                     setIsLoading(false);

    //                 } else {
    //                     console.log('not okk')
    //                     setIsLoading(false)
    //                     Alert.alert('Oops..', res.data.message, [
    //                         { text: 'OK', onPress: () => console.log('OK Pressed') },
    //                     ]);
    //                 }
    //             })
    //             .catch(e => {
    //                 setIsLoading(false)
    //                 console.log(`fetch all category error ${e}`)
    //                 console.log(e.response)
    //                 Alert.alert('Oops..', e.response?.data?.message, [
    //                     { text: 'OK', onPress: () => console.log('OK Pressed') },
    //                 ]);
    //             });
    //     });
    // }
    const fetchCategory = async () => {
        try {
            // Retrieve user token and selected language from AsyncStorage
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');

            if (!userToken) {
                console.log('User token not found');
                return;
            }

            // Make the API call with headers including Authorization and Accept-Language
            const response = await axios.get(`${API_URL}/user/category`, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${userToken}`,
                    "Accept-Language": savedLang || 'en',  // Default to 'en' if savedLang is not available
                },
            });

            console.log(JSON.stringify(response.data.data), 'fetch all category');

            if (response.data.response === true) {
                setCategory(response.data.data);
            } else {
                console.log('not okk');
                Alert.alert('Oops..', response.data.message, [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
            }
        } catch (error) {
            console.log(`fetch all category error ${error}`);
            console.log(error.response);
            Alert.alert('Oops..', error.response?.data?.message, [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        } finally {
            setIsLoading(false);
        }
    };
    const CategoryItem = memo(({ item }) => (
        <Pressable onPress={() => navigation.navigate('ProductListScreen', { categoryName: item?.name, categoryId: item?.id })}>
            <ImageBackground
                //source={productCategoryImg}
                source={{ uri: item?.image }}
                style={styles.singleCategoryView}
                imageStyle={styles.imageBackground}
            >
                <View style={styles.textView}>
                    <Text style={styles.text1}>{item?.name}</Text>
                    <Text style={styles.text2}>{item?.name}</Text>
                    <View style={styles.exploreView}>
                        <Text style={styles.text3}>{t('store.explorenow')}</Text>
                        <Image
                            source={forwordButtonImg}
                            style={styles.icon}
                        />
                    </View>
                </View>
            </ImageBackground>
        </Pressable>
    ))
    const renderCategoryItem = ({ item }) => <CategoryItem item={item} />;

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Store'} onPress={() => navigation.goBack()} title={t('store.store')} />
            <ScrollView style={styles.wrapper} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#417AA4" colors={['#417AA4']} />
            }>
                <LinearGradient
                    colors={['#FDEEDA', '#FEF7EF']} // Example colors, replace with your desired gradient
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.headingSection}
                >
                    <Text style={styles.headerText}>{t('store.chooseyourcategories')}</Text>
                </LinearGradient>
                <View style={styles.categoryListView}>
                    {category.length > 0 ?
                        <FlatList
                            data={category}
                            renderItem={renderCategoryItem}
                            keyExtractor={(item) => item.id.toString()}
                            maxToRenderPerBatch={10}
                            windowSize={5}
                            initialNumToRender={10}
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            getItemLayout={(category, index) => (
                                { length: 50, offset: 50 * index, index }
                            )}
                        /> :
                        <Text style={{
                            color: '#894F00',
                            fontFamily: 'PlusJakartaSans-Bold',
                            fontSize: responsiveFontSize(1.7), textAlign: 'center'
                        }}>No Category Found</Text>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default withTranslation()(StoreScreen)

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {
        paddingHorizontal: 15
    },
    headingSection: {
        height: responsiveHeight(6),
        width: responsiveWidth(60),
        alignSelf: 'center',
        marginTop: responsiveHeight(2),
        borderRadius: 20,
        borderColor: '#FFE8C5',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerText: {
        color: '#894F00',
        fontFamily: 'PlusJakartaSans-SeniBold',
        fontSize: responsiveFontSize(2),
    },
    categoryListView: {
        marginTop: responsiveHeight(2),
        alignSelf: 'center'
    },
    singleCategoryView: {
        height: responsiveHeight(20),
        width: responsiveWidth(91),
        borderRadius: 15,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: 10,
        marginBottom: responsiveHeight(1)
    },
    imageBackground: {
        borderRadius: 15, // Applies the border radius to the background image,
        resizeMode: 'cover'
    },
    textView: {
        position: 'absolute',
        left: 10,
        top: 20,
        width: responsiveWidth(50)
    },
    text1: {
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2.8),
        marginBottom: responsiveHeight(1)
    },
    text2: {
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
        marginBottom: responsiveHeight(2)
    },
    text3: {
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
    },
    exploreView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
        marginLeft: responsiveWidth(2)
    }
});
