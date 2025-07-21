import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, RefreshControl, TextInput, Image, FlatList, TouchableOpacity, Keyboard, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert, Platform } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, categoryImg, chatColor, checkedImg, filterImg, forwordButtonImg, freeServiceImg, horo2Img, image1Img, image2Img, image3Img, image4Img, image5Img, kundliImg, matchmakingImg, phoneColor, productCategoryImg, productImg, sortImg, starImg, uncheckedImg, userPhoto } from '../../../utils/Images'
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

const ProductListScreen = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [langvalue, setLangValue] = useState('en');
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState(route?.params?.categoryId);
    const [tabs, setTabs] = useState([])
    const [perPage, setPerPage] = useState(10);
    const [pageno, setPageno] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [categoryProduct, setCategoryProduct] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const searchInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const changeSearchValue = (text) => {
        setSearchValue(text);
        // Clear the previous timeout to prevent premature calls
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set a new timeout to call the function after 5 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            searchWiseProduct(text);
        }, 3000); // 5 seconds delay
    }
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const [isModalVisibleForSort, setModalVisibleForSort] = useState(false);
    const toggleModalForSort = () => {
        setModalVisibleForSort(!isModalVisibleForSort);
    };

    const [sliderValuesForPrice, setSliderValuesForPrice] = useState([0, 10000]);
    const sliderValuesChange = (values) => {
        setSliderValuesForPrice(values);
    };

    const [selectedSort, setSelectedSort] = useState('');

    const sortOptions = [
        // 'Relevance',
        // 'Popularity',
        'Price -- Low to High',
        'Price -- High to Low',
        // 'Newest First',
    ];

    const handleSort = async (sortoption, page = 1) => {
        setSelectedSort(sortoption);
        setModalVisibleForSort(false);
        // Trigger the sort functionality (API call or local sort)
        console.log(`Selected Sort Option: ${sortoption}`);

        try {
            setLoading(true);
            const option = {
                "category_id": activeTab,
                "price_order": sortoption === 'Price -- Low to High' ? 'asc' : sortoption === 'Price -- High to Low' ? 'desc' : undefined
            };
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                console.log('No user token found');
                setIsLoading(false);
                return;
            }
            console.log(option, 'sort product formdata')
            const response = await axios.post(`${API_URL}/user/category-product`, option, {
                params: {
                    page
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                    "Accept-Language": savedLang || 'en',  // Default to 'en' if savedLang is not available
                },
            });

            const responseData = response.data.data.data;
            console.log(responseData, 'sort data')
            setCategoryProduct(prevData => page === 1 ? responseData : [...prevData, ...responseData]);
            if (responseData.length === 0) {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            console.log(`Fetch session history error: ${error}`);
            let myerror = error.response?.data?.message;
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                { text: 'OK', onPress: () => myerror == 'Unauthorized' ? logout() : console.log('OK Pressed') },
            ]);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }

    };
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
        setSliderValuesForPrice([0, 10000])
        setSelectedSort('')
        setSearchValue('')
        fetchCategory();
    }, []);
    useFocusEffect(
        React.useCallback(() => {
            loadLanguage()
            setSliderValuesForPrice([0, 10000])
            setSelectedSort('')
            setSearchValue('')
            fetchCategory(); // Call the async function
        }, [])
    );
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
    //                     const categoryData = res.data.data;
    //                     const transformedData = categoryData.map(item => ({
    //                         label: item.name,
    //                         value: item.id,
    //                     }));
    //                     setTabs(transformedData)
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
                const categoryData = response.data.data;
                const transformedData = categoryData.map(item => ({
                    label: item.name,
                    value: item.id,
                }));
                setTabs(transformedData);
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


    const filterWiseProduct = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const option = {
                "category_id": activeTab,
                "s_price": sliderValuesForPrice[0],
                "e_price": sliderValuesForPrice[1],
            };
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                console.log('No user token found');
                setIsLoading(false);
                return;
            }
            console.log(option, 'sort filter product')
            const response = await axios.post(`${API_URL}/user/category-product`, option, {
                params: {
                    page
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                    "Accept-Language": savedLang || 'en',  // Default to 'en' if savedLang is not available
                },
            });

            const responseData = response.data.data.data;
            console.log(responseData, 'sort data')
            setModalVisible(false)
            setCategoryProduct(prevData => page === 1 ? responseData : [...prevData, ...responseData]);
            if (responseData.length === 0) {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            console.log(`Fetch session history error: ${error}`);
            let myerror = error.response?.data?.message;
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                { text: 'OK', onPress: () => myerror == 'Unauthorized' ? logout() : console.log('OK Pressed') },
            ]);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    })

    const searchWiseProduct = useCallback(async (value, page = 1) => {
        try {
            setLoading(true);
            setIsLoading(true)
            const option = {
                "category_id": activeTab,
                "search": value,
            };
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                console.log('No user token found');
                setIsLoading(false);
                return;
            }
            console.log(option, 'search product formdata')
            const response = await axios.post(`${API_URL}/user/category-product`, option, {
                params: {
                    page
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                    "Accept-Language": savedLang || 'en',  // Default to 'en' if savedLang is not available
                },
            });

            const responseData = response.data.data.data;
            console.log(responseData, 'sort data')
            Keyboard.dismiss();
            setIsLoading(false)
            setCategoryProduct(prevData => page === 1 ? responseData : [...prevData, ...responseData]);
            if (responseData.length === 0) {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            console.log(`Fetch session history error: ${error}`);
            let myerror = error.response?.data?.message;
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                { text: 'OK', onPress: () => myerror == 'Unauthorized' ? logout() : console.log('OK Pressed') },
            ]);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    });

    const categoryWiseProduct = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const option = {
                "category_id": activeTab
            }
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                console.log('No user token found');
                setIsLoading(false);
                return;
            }
            const response = await axios.post(`${API_URL}/user/category-product`, option, {
                params: {
                    page
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                    "Accept-Language": savedLang || 'en',  // Default to 'en' if savedLang is not available
                },
            });

            const responseData = response.data.data.data;
            console.log(responseData, 'category wise product')
            setCategoryProduct(prevData => page === 1 ? responseData : [...prevData, ...responseData]);
            if (responseData.length === 0) {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            console.log(`Fetch session history error: ${error}`);
            let myerror = error.response?.data?.message;
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                { text: 'OK', onPress: () => myerror == 'Unauthorized' ? logout() : console.log('OK Pressed') },
            ]);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    }, []);

    const onCategoryChangeFromTab = useCallback(async (categoryId, page = 1) => {
        try {
            setLoading(true);
            const option = {
                "category_id": categoryId
            }
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                console.log('No user token found');
                setIsLoading(false);
                return;
            }
            const response = await axios.post(`${API_URL}/user/category-product`, option, {
                params: {
                    page
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                    "Accept-Language": savedLang || 'en',  // Default to 'en' if savedLang is not available
                },
            });

            const responseData = response.data.data.data;
            console.log(responseData, 'category wise product')
            setCategoryProduct(prevData => page === 1 ? responseData : [...prevData, ...responseData]);
            if (responseData.length === 0) {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            console.log(`Fetch session history error: ${error}`);
            let myerror = error.response?.data?.message;
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                { text: 'OK', onPress: () => myerror == 'Unauthorized' ? logout() : console.log('OK Pressed') },
            ]);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    });

    useEffect(() => {
        categoryWiseProduct(pageno);
    }, [categoryWiseProduct, pageno]);

    useFocusEffect(
        useCallback(() => {
            setCategoryProduct([]);
            setPageno(1);
            setHasMore(true); // Reset hasMore on focus
            categoryWiseProduct(1);
        }, [categoryWiseProduct])
    );

    const sortData = (option, data) => {
        switch (option) {
            case 'Price -- Low to High':
                return data.sort((a, b) => a.price - b.price);
            case 'Price -- High to Low':
                return data.sort((a, b) => b.price - a.price);
            case 'Popularity':
                return data.sort((a, b) => b.popularity - a.popularity);
            case 'Newest First':
                return data.sort((a, b) => new Date(b.date) - new Date(a.date));
            default:
                return data; // Default sort (Relevance or no sort)
        }
    };

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
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setCategoryProduct([]);
        setPageno(1);
        setHasMore(true); // Reset hasMore on focus
        categoryWiseProduct(1);
        setRefreshing(false);
    }, []);

    const renderProduct = ({ item }) => {
        return (

            <View style={styles.productSection}>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('ProductDetails', { details: item, productId: item?.id })}>
                    <View style={styles.topAstrologerSection}>
                        <View style={styles.totalValue}>
                            <Image
                                source={{ uri: item?.images[0] }}
                                style={styles.productImg}
                            />

                            <Text style={styles.productText}>{item?.name}</Text>
                            <View style={styles.productAmountView}>
                                <Text style={styles.productAmount}>₹ {item?.price}</Text>
                                <Text style={styles.productPreviousAmount}>₹ {item?.max_price}</Text>
                            </View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.wishlistView}>
                    {item?.is_wishlist ?
                        <TouchableOpacity onPress={(e) => {
                            e.stopPropagation();
                            bookmarkedToggle(item?.id)
                        }}>
                            <Image
                                source={bookmarkedFill}
                                style={styles.iconSize}
                            />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={(e) => {
                            e.stopPropagation();
                            bookmarkedToggle(item?.id)
                        }}>
                            <Image
                                source={bookmarkedNotFill}
                                style={styles.iconSize}
                            />
                        </TouchableOpacity>
                    }
                </View>
            </View>

        )
    };

    // const bookmarkedToggle = (productId) => {
    //     console.log(productId)
    //     const option = {
    //         "store_products_id": productId
    //     }
    //     AsyncStorage.getItem('userToken', (err, usertoken) => {
    //         axios.post(`${API_URL}/user/wishlist`, option, {
    //             headers: {
    //                 'Accept': 'application/json',
    //                 "Authorization": 'Bearer ' + usertoken,
    //                 //'Content-Type': 'multipart/form-data',
    //             },
    //         })
    //             .then(res => {
    //                 console.log(JSON.stringify(res.data), 'add wishlist response')
    //                 if (res.data.response == true) {
    //                     setIsLoading(false);
    //                     Toast.show({
    //                         type: 'success',
    //                         text1: '',
    //                         text2: res?.data?.message,
    //                         position: 'top',
    //                         topOffset: Platform.OS == 'ios' ? 55 : 20
    //                     });
    //                     onCategoryChangeFromTab(activeTab)
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
    //                 console.log(`add wishlist error ${e}`)
    //                 console.log(e.response)
    //                 Alert.alert('Oops..', e.response?.data?.message, [
    //                     { text: 'OK', onPress: () => console.log('OK Pressed') },
    //                 ]);
    //             });
    //     });
    // }
    const bookmarkedToggle = async (productId) => {
        console.log(productId);
        const option = {
            "store_products_id": productId,
        };

        try {
            // Retrieve user token and selected language from AsyncStorage
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');

            if (!userToken) {
                console.log('User token not found');
                return;
            }

            // Make the API call with headers including Authorization and Accept-Language
            const response = await axios.post(`${API_URL}/user/wishlist`, option, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${userToken}`,
                    "Accept-Language": savedLang || 'en',  // Default to 'en' if savedLang is not available
                },
            });

            console.log(JSON.stringify(response.data), 'add wishlist response');

            if (response.data.response === true) {
                setIsLoading(false);
                Toast.show({
                    type: 'success',
                    text1: '',
                    text2: response?.data?.message,
                    position: 'top',
                    topOffset: Platform.OS === 'ios' ? 55 : 20,
                });
                onCategoryChangeFromTab(activeTab);
            } else {
                console.log('not okk');
                setIsLoading(false);
                Alert.alert('Oops..', response.data.message, [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
            }
        } catch (error) {
            setIsLoading(false);
            console.log(`add wishlist error ${error}`);
            console.log(error.response);
            Alert.alert('Oops..', error.response?.data?.message, [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        }
    };


    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Store'} onPress={() => navigation.goBack()} title={t('Productlist.products')} />
            <ScrollView style={styles.wrapper}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => toggleModalForSort()}>
                        <View style={[styles.SortView, { marginRight: 10 }]}>
                            <Text style={styles.filterText}>{t('Productlist.sort')}</Text>
                            <Image
                                source={sortImg}
                                style={{ height: 20, width: 20, resizeMode: 'contain' }}
                            />
                        </View>
                    </TouchableOpacity>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={styles.tabContainer}>
                            {tabs.map((tab) => (
                                <TouchableOpacity
                                    key={tab.value}
                                    onPress={() => {
                                        setActiveTab(tab.value)
                                        onCategoryChangeFromTab(tab.value)
                                        setSearchValue('')
                                    }}
                                    style={[
                                        styles.tab,
                                        activeTab === tab.value && styles.activeTab,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.tabText,
                                            activeTab === tab.value && styles.activeTabText,
                                        ]}
                                    >
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>


                <View style={styles.titleSection}>
                    <View style={styles.columnSection}>
                        {/* <Text style={styles.titleText}>Certified Gemstones</Text>
                        <Text style={styles.titleDesc}>Products for effective remedies</Text> */}
                        <TextInput
                            style={styles.editinput}
                            onChangeText={(text) => changeSearchValue(text)}
                            value={searchValue}
                            ref={route?.params?.comingFrom === 'search' ? searchInputRef : null}
                            placeholder={t('Productlist.searchbyproductname')}
                            keyboardType={''}
                            placeholderTextColor="#808080"
                        />
                    </View>
                    <TouchableOpacity onPress={() => toggleModal()}>
                        <View style={styles.filterView}>
                            <Text style={styles.filterText}>{t('Productlist.filter')}</Text>
                            <Image
                                source={filterImg}
                                style={{ height: 20, width: 20, resizeMode: 'contain' }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                {categoryProduct.length > 0 ?
                    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: responsiveHeight(2) }}>

                        <FlatList
                            data={categoryProduct}
                            renderItem={renderProduct}
                            keyExtractor={(item) => item.id.toString()}
                            maxToRenderPerBatch={10}
                            windowSize={5}
                            numColumns={2}
                            initialNumToRender={10}
                            showsVerticalScrollIndicator={false}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={renderFooter}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#417AA4" colors={['#417AA4']} />
                            }
                        />
                    </View>
                    :
                    <Text style={[styles.tabText, { alignSelf: 'center',marginTop: responsiveHeight(5) }]}>No product found</Text>
                }
            </ScrollView>
            <Modal
                isVisible={isModalVisible}
                style={styles.modalContainer}
                onBackdropPress={() => setModalVisible(false)}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalHeader}>Filter by Price Range</Text>
                    <View style={{ alignSelf: 'center', width: responsiveWidth(60) }}>
                        <MultiSlider
                            values={sliderValuesForPrice}
                            sliderLength={200}
                            onValuesChange={sliderValuesChange}
                            min={0}
                            max={10000}
                            step={100}
                            vertical={false}
                            allowOverlap={false}
                            snapped
                            selectedStyle={{
                                backgroundColor: '#D9B17E',
                            }}
                            unselectedStyle={{
                                backgroundColor: 'gray',
                            }}
                            markerStyle={{
                                backgroundColor: '#D9B17E',
                                height: 15,
                                width: 15,
                                borderRadius: 15 / 2,
                            }}
                        />
                        <Text style={styles.valueText}>Price Range: ₹{sliderValuesForPrice[0]} - ₹{sliderValuesForPrice[1]}</Text>
                    </View>
                    <CustomButton label={"Apply Filter"} onPress={() => filterWiseProduct()} />
                </View>
            </Modal>
            <Modal
                isVisible={isModalVisibleForSort}
                style={styles.modalContainer}
                onBackdropPress={() => setModalVisibleForSort(false)}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalHeader}>Sort Product</Text>
                    <FlatList
                        data={sortOptions}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.sortOption}
                                onPress={() => handleSort(item)}
                            >
                                <Text
                                    style={[
                                        styles.sortOptionText,
                                        selectedSort === item && styles.selectedSort,
                                    ]}
                                >
                                    {item}
                                </Text>
                                {selectedSort === item && (
                                    <Icon name="check" size={20} color="#FB7401" style={styles.icon} />
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default withTranslation()(ProductListScreen)

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {
        paddingHorizontal: 15
    },
    /* tab section */
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#FEF3E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    activeTab: {
        backgroundColor: '#FEF3E5',
        borderColor: '#D9B17E',
        borderWidth: 1
    },
    tabText: {
        color: '#894F00',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(1.7),
    },
    activeTabText: {
        color: '#894F00',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(1.7),
    },
    contentContainer: {
        flex: 1,
        //paddingHorizontal: 10,
        paddingVertical: 10,
    },
    /* tab section */
    titleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    columnSection: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    titleText: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
    },
    titleDesc: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
    },
    SortView: {
        height: responsiveHeight(5),
        width: responsiveWidth(20),
        borderColor: '#E3E3E3',
        borderWidth: 1,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    filterView: {
        height: responsiveHeight(5),
        width: responsiveWidth(25),
        borderColor: '#E3E3E3',
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    filterText: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(1.7),
    },
    productSection: {
        marginTop: responsiveHeight(0),
    },
    //product section
    topAstrologerSection: {
        alignItems: 'center',
    },
    totalValue: {
        width: responsiveWidth(43),
        height: responsiveHeight(32),
        alignItems: 'center',
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
        marginBottom: responsiveHeight(2),
        marginHorizontal: responsiveWidth(1.5),
    },
    productImg: {
        height: responsiveHeight(20),
        width: responsiveFontSize(19.5),
        resizeMode: 'cover',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    productText: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(1.7),
        marginTop: responsiveHeight(1),
        alignSelf: 'flex-start'
    },
    productAmountView: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'baseline'
    },
    productAmount: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(1.8),
        marginRight: responsiveWidth(2)
    },
    productPreviousAmount: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(1.6),
        textDecorationLine: 'line-through'
    },
    editinput: {
        color: '#808080',
        fontFamily: 'PlusJakartaSans-Regular',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: responsiveHeight(1),
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
        width: responsiveWidth(66),
        height: responsiveHeight(5),
    },
    modalContainer: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 25,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalHeader: {
        color: '#894F00',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
        marginBottom: 10,
    },
    valueText: {
        fontSize: responsiveFontSize(2),
        marginBottom: 10,
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-Regular',

    },
    sortOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    sortOptionText: {
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(2),
    },
    selectedSort: {
        color: '#894F00',
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconSize: {
        height: 25,
        width: 25
    },
    wishlistView: {
        position: 'absolute',
        top: 20,
        right: 20
    }
});
