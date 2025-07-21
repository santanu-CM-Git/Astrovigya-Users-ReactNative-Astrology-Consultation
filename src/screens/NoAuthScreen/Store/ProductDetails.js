import React, { useState, useMemo, useEffect, useCallback, useRef, useContext } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Dimensions, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert, Platform } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, chatColor, checkedImg, filterImg, phoneColor, pujaImg, starImg, uncheckedImg, userPhoto } from '../../../utils/Images'
import { API_URL } from '@env'
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '../../../utils/Loader';
import moment from "moment"
import StarRating from 'react-native-star-rating-widget';
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import RenderHTML from 'react-native-render-html';
import { Dropdown } from 'react-native-element-dropdown';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FastImage from '@d11/react-native-fast-image';
import { AuthContext } from '../../../context/AuthContext';
import { withTranslation, useTranslation } from 'react-i18next';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 250;
const { height, width } = Dimensions.get('screen')
const sliderWidth = Dimensions.get('window').width;
const paddingHorizontal = 10;
const itemWidth = sliderWidth - (2 * paddingHorizontal);

const ProductDetails = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [langvalue, setLangValue] = useState('en');
    const { width } = useWindowDimensions();
    const { addToCart } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true)
    const [productDetails, setProductDetails] = useState(null)
    const [productPrice, setProductPrice] = useState(null);
    const [storeProductsId, setStoreProductsId] = useState(null);
    const [storeProductVariationsId, setStoreProductVariationsId] = useState(null);

    const [reviewList, setReviewList] = useState([])
    const [perPage, setPerPage] = useState(10);
    const [pageno, setPageno] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [activeTabAttributes, setActiveTabAttributes] = useState({});
    const [availableAttributes, setAvailableAttributes] = useState({}); // For dynamically storing attributes like Weight, Color, Size, etc.

    const [activeSlide, setActiveSlide] = React.useState(0);

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
    // const fetchProductDetails = async () => {
    //     const option = {
    //         "store_product_id": route?.params?.productId,
    //     }
    //     AsyncStorage.getItem('userToken', (err, usertoken) => {
    //         axios.post(`${API_URL}/user/product-details`, option, {
    //             headers: {
    //                 'Accept': 'application/json',
    //                 "Authorization": 'Bearer ' + usertoken,
    //                 //'Content-Type': 'multipart/form-data',
    //             },
    //         })
    //             .then(res => {
    //                 console.log(JSON.stringify(res.data), 'product details response')
    //                 if (res.data.response == true) {
    //                     const productData = res?.data?.data;
    //                     console.log(productData, 'Product Details')
    //                     console.log(productData?.price, 'product price')
    //                     setProductDetails(productData);
    //                     setProductPrice(productData?.price);
    //                     setStoreProductsId(productData?.id)

    //                     const tempAttributes = {}; // Store attributes dynamically based on type
    //                     productData?.store_variations.forEach(variation => {
    //                         variation.attributes.forEach(attr => {
    //                             if (!tempAttributes[attr.type]) {
    //                                 tempAttributes[attr.type] = new Set(); // Using Set to avoid duplicates
    //                             }
    //                             tempAttributes[attr.type].add(attr.attribute);
    //                         });
    //                     });

    //                     // Convert the sets into arrays to store them in the state
    //                     const formattedAttributes = {};
    //                     const defaultActiveAttributes = {};
    //                     for (let key in tempAttributes) {
    //                         formattedAttributes[key] = Array.from(tempAttributes[key]);
    //                         if (formattedAttributes[key].length > 0) {
    //                             defaultActiveAttributes[key] = formattedAttributes[key][0]; // Select the first tab by default
    //                         }
    //                     }

    //                     setAvailableAttributes(formattedAttributes);
    //                     setActiveTabAttributes(defaultActiveAttributes);
    //                     setIsLoading(false)
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
    //                 console.log(`product details error ${e}`)
    //                 console.log(e.response)
    //                 Alert.alert('Oops..', e.response?.data?.message, [
    //                     { text: 'OK', onPress: () => console.log('OK Pressed') },
    //                 ]);
    //             });
    //     });
    // }

    const fetchProductDetails = async () => {
        const option = {
            "store_product_id": route?.params?.productId,
        };

        try {
            // Retrieve user token and selected language from AsyncStorage
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');

            if (!userToken) {
                console.log('User token not found');
                return;
            }

            // Make the API request with headers including Authorization and Accept-Language
            const response = await axios.post(`${API_URL}/user/product-details`, option, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${userToken}`,
                    "Accept-Language": savedLang || 'en', // Default to 'en' if savedLang is not available
                },
            });

            console.log(JSON.stringify(response.data), 'product details response');

            if (response.data.response === true) {
                const productData = response?.data?.data;
                console.log(productData, 'Product Details');
                console.log(productData?.price, 'product price');

                setProductDetails(productData);
                setProductPrice(productData?.price);
                setStoreProductsId(productData?.id);

                const tempAttributes = {}; // Store attributes dynamically based on type
                productData?.store_variations.forEach(variation => {
                    variation.attributes.forEach(attr => {
                        if (!tempAttributes[attr.type]) {
                            tempAttributes[attr.type] = new Set(); // Using Set to avoid duplicates
                        }
                        tempAttributes[attr.type].add(attr.attribute);
                    });
                });

                // Convert the sets into arrays to store them in the state
                const formattedAttributes = {};
                const defaultActiveAttributes = {};
                for (let key in tempAttributes) {
                    formattedAttributes[key] = Array.from(tempAttributes[key]);
                    if (formattedAttributes[key].length > 0) {
                        defaultActiveAttributes[key] = formattedAttributes[key][0]; // Select the first tab by default
                    }
                }

                setAvailableAttributes(formattedAttributes);
                setActiveTabAttributes(defaultActiveAttributes);
                setIsLoading(false);
            } else {
                console.log('not okk');
                setIsLoading(false);
                Alert.alert('Oops..', response.data.message, [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
            }
        } catch (error) {
            setIsLoading(false);
            console.log(`product details error ${error}`);
            console.log(error.response);
            Alert.alert('Oops..', error.response?.data?.message, [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        }
    };


    const CarouselCardItem = ({ item, index }) => {
        return (
            <View style={styles.bannerContainer}>
                <FastImage
                    source={{ uri: item }}
                    //source={pujaImg}
                    //source={freebannerPlaceHolder}
                    //style={{ width: BannerWidth, height: BannerHeight }}
                    style={styles.bannerImage}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
        )
    }

    const onSelectAttribute = (type, value) => {
        setActiveTabAttributes(prevState => ({
            ...prevState,
            [type]: value
        }));
    };

    const findProductDetails = () => {
        if (!productDetails) {
            console.log('productDetails is null or undefined');
            return;
        }
        console.log('Active Tab Attributes:', activeTabAttributes);
        const productResponse = productDetails;
        console.log(productResponse, 'productResponseproductResponseproductResponse')

        // Filter products based on active attributes
        const filteredProduct = productResponse?.store_variations?.filter(variation => {
            return Object.entries(activeTabAttributes).every(([type, value]) => {
                return variation.attributes.some(attr => attr.attribute === value && attr.type === type);
            });
        });

        console.log('Filtered Product:', JSON.stringify(filteredProduct));
        console.log(activeTabAttributes, 'sadsfdsfd')
        if (filteredProduct.length > 0) {
            setProductPrice(filteredProduct[0]?.price); // **Update the product price**
            setStoreProductsId(filteredProduct[0]?.store_products_id)
            setStoreProductVariationsId(filteredProduct[0]?.id)
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await loadLanguage();
            await fetchProductDetails();
        };
        fetchData();
    }, []);
    useFocusEffect(
        useCallback(() => {
            loadLanguage();
        }, [])
    );

    useEffect(() => {
        if (productDetails) {
            findProductDetails();
        }
    }, [activeTabAttributes, productDetails]);

    // const AddToCart = () => {
    //     setIsLoading(true)
    //     const option = {
    //         "store_products_id": storeProductsId ? storeProductsId : null,
    //         "store_product_variations_id": storeProductVariationsId ? storeProductVariationsId : null,
    //         "price": productPrice,
    //         "qty": 1
    //     }
    //     console.log(option)
    //     AsyncStorage.getItem('userToken', (err, usertoken) => {
    //         axios.post(`${API_URL}/user/add-to-cart`, option, {
    //             headers: {
    //                 'Accept': 'application/json',
    //                 "Authorization": 'Bearer ' + usertoken,
    //                 //'Content-Type': 'multipart/form-data',
    //             },
    //         })
    //             .then(res => {
    //                 console.log(JSON.stringify(res.data), 'add to cart response')
    //                 if (res.data.response == true) {
    //                     Toast.show({
    //                         type: 'success',
    //                         text1: '',
    //                         text2: res.data.message,
    //                         position: 'top',
    //                         topOffset: Platform.OS == 'ios' ? 55 : 20
    //                     });
    //                     setIsLoading(false);
    //                     addToCart(option);
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
    //                 console.log(`add to cart error ${e}`)
    //                 console.log(e.response)
    //                 Alert.alert('Oops..', e.response?.data?.message, [
    //                     { text: 'OK', onPress: () => console.log('OK Pressed') },
    //                 ]);
    //             });
    //     });

    // }
    const AddToCart = () => {
        setIsLoading(true);
    
        const option = {
            "store_products_id": storeProductsId ? storeProductsId : null,
            "store_product_variations_id": storeProductVariationsId ? storeProductVariationsId : null,
            "price": productPrice,
            "qty": 1
        };
        console.log(option);
    
        // Retrieve user token and selected language from AsyncStorage
        AsyncStorage.getItem('userToken', async (err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage'); // Retrieve selected language
    
            if (!usertoken) {
                console.log('User token not found');
                setIsLoading(false);
                return;
            }
    
            // Make the API request with headers including Authorization and Accept-Language
            axios.post(`${API_URL}/user/add-to-cart`, option, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${usertoken}`,
                    "Accept-Language": savedLang || 'en', // Default to 'en' if savedLang is not available
                },
            })
            .then(res => {
                console.log(JSON.stringify(res.data), 'add to cart response');
    
                if (res.data.response === true) {
                    Toast.show({
                        type: 'success',
                        text1: '',
                        text2: res.data.message,
                        position: 'top',
                        topOffset: Platform.OS === 'ios' ? 55 : 20
                    });
                    setIsLoading(false);
                    addToCart(option);
                } else {
                    console.log('not okk');
                    setIsLoading(false);
                    Alert.alert('Oops..', res.data.message, [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                }
            })
            .catch(e => {
                setIsLoading(false);
                console.log(`add to cart error ${e}`);
                console.log(e.response);
                Alert.alert('Oops..', e.response?.data?.message, [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
            });
        });
    };
    
    const fetchProductReview = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                console.log('No user token found');

                return;
            }
            const response = await axios.get(`${API_URL}/user/product-review?store_product_id=${route?.params?.productId}`, {
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
            console.log(responseData, 'review list')
            setReviewList(prevData => page === 1 ? responseData : [...prevData, ...responseData]);
            if (responseData.length === 0) {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            console.log(`review list error: ${error}`);
            let myerror = error.response?.data?.message;
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                { text: 'OK', onPress: () => myerror == 'Unauthorized' ? logout() : console.log('OK Pressed') },
            ]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductReview(pageno);
    }, [fetchProductReview, pageno]);

    useFocusEffect(
        useCallback(() => {
            setReviewList([]);
            setPageno(1);
            setHasMore(true); // Reset hasMore on focus
            fetchProductReview(1);
        }, [fetchProductReview])
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

    const renderReview = ({ item }) => {
        // Function to get initials from full name
        const getInitials = (name) => {
            if (!name) return '';
            const nameArray = name.trim().split(' ');
            if (nameArray.length === 1) return nameArray[0][0].toUpperCase();
            return (nameArray[0][0] + nameArray[1][0]).toUpperCase();
        };

        // Randomize background color
        const getRandomColor = () => {
            const colors = ['#FF5733', '#33B5FF', '#FFBD33', '#33FF57', '#E833FF', '#338EFF'];
            return colors[Math.floor(Math.random() * colors.length)];
        };
        return (
            <View style={styles.totalValue}>
                <View style={{ flexDirection: 'row', padding: 5 }}>
                    <View
                        style={[
                            styles.avatarContainer,
                            {
                                backgroundColor: getRandomColor(),
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                            },
                        ]}
                    >
                        <Text style={styles.avatarText}>
                            {getInitials(item?.user?.full_name)}
                        </Text>
                    </View>
                    <View style={styles.reviewSec}>
                        <Text style={styles.reviewName}>{item?.user?.full_name}</Text>
                        <View style={styles.ratingView}>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={item?.star}
                                onChange={(rating) => setStarCount(rating)}
                                fullStarColor={'#FFCB45'}
                                starSize={14}
                                starStyle={{ marginHorizontal: responsiveWidth(0.5) }}
                            />
                        </View>
                        <Text style={styles.reviewContain}>{item?.comment}</Text>
                    </View>
                    <Text style={styles.reviewContain}>{moment(item?.created_at).format('MMM DD, YYYY')}</Text>
                </View>
            </View>
        )
    }

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Store'} onPress={() => navigation.goBack()} title={t('ProductDetails.details')} />
            <ScrollView style={styles.wrapper}>

                <View style={styles.carouselView}>
                    <Carousel
                        data={productDetails?.images}
                        renderItem={CarouselCardItem}
                        showsPageIndicator={true}
                        pageSize={BannerWidth}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        autoplay={true}
                        autoplayTimeout={5000}
                        autoplayInterval={5000}
                        loop={true}
                        index={0}
                        //enableSnap={true}
                        onSnapToItem={(index) => setActiveSlide(index)}
                        activePageIndicatorStyle={{ backgroundColor: 'red' }}  // Active indicator color
                        inactivePageIndicatorStyle={{ backgroundColor: 'gray' }} // Inactive indicator color
                    />
                    <Pagination
                        dotsLength={productDetails?.images.length}
                        activeDotIndex={activeSlide}
                        containerStyle={{ paddingVertical: responsiveHeight(2) }}
                        dotStyle={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            marginHorizontal: 2,
                            backgroundColor: '#FB7401', // Active dot color
                        }}
                        inactiveDotStyle={{
                            backgroundColor: 'gray', // Inactive dot color
                        }}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                    />
                </View>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>{productDetails?.name}</Text>
                </View>
                {productDetails?.origin ? (
                    <Text style={styles.sectionDesc}>{t('ProductDetails.origin')} : {productDetails?.origin}</Text>
                ) : null}
                <View style={styles.sectionHeaderView}>
                    <Text style={[styles.sectionHeaderText, { marginRight: responsiveWidth(2) }]}>₹ {productPrice}</Text>
                    <Text style={styles.sectionHeaderOldPrice}> ₹ {productDetails?.max_price}</Text>
                </View>
                {/* Dynamic Attribute Selectors */}
                {Object.entries(availableAttributes).map(([type, attributes]) => (
                    <View key={type}>
                        <View style={styles.sectionHeaderView}>
                            <Text style={styles.sectionHeaderText}>{type}</Text>
                        </View>

                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={styles.tabContainer}>
                                {attributes.map(attribute => (
                                    <TouchableOpacity
                                        key={attribute}
                                        //onPress={() => setActiveTabWeight(tab.attribute)}
                                        onPress={() => onSelectAttribute(type, attribute)}
                                        style={[
                                            styles.tab,
                                            activeTabAttributes[type] === attribute && styles.activeTab,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.tabText,
                                                activeTabAttributes[type] === attribute && styles.activeTabText,
                                            ]}
                                        >
                                            {attribute}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                ))}

                {productDetails?.description ? (
                    <View style={styles.sectionHeaderView}>
                        <Text style={styles.sectionHeaderText}>{t('ProductDetails.about')} {productDetails?.name}</Text>
                    </View>
                ) : null}
                {/* <Text style={styles.sectionDesc}>{pujaDetails?.about}</Text> */}
                {productDetails?.description ? (
                    <View style={{ paddingHorizontal: 15 }}>
                        <RenderHTML
                            contentWidth={width}
                            source={{ html: productDetails?.description || '' }}
                            baseStyle={{
                                color: '#8B939D', // Change text color
                                fontSize: responsiveFontSize(1.7),  // Optional: Set font size
                                fontFamily: 'PlusJakartaSans-Regular'
                            }}
                        />
                    </View>
                ) : null}
                {productDetails?.refund ? (
                    <View style={styles.sectionHeaderView}>
                        <Text style={styles.sectionHeaderText}>{t('ProductDetails.returnrefund')}</Text>
                    </View>
                ) : null}
                {/* <Text style={styles.sectionDesc}>{pujaDetails?.benefits}</Text> */}
                {productDetails?.refund ? (
                    <View style={{ paddingHorizontal: 15 }}>
                        <RenderHTML
                            contentWidth={width}
                            source={{ html: productDetails?.refund || 'We kindly inform you that this product does not qualify for returns or refunds. Once purchased, the transaction is final.' }}
                            baseStyle={{
                                color: '#8B939D', // Change text color
                                fontSize: responsiveFontSize(1.7),  // Optional: Set font size
                                fontFamily: 'PlusJakartaSans-Regular'
                            }}
                        />
                    </View>
                ) : null}
                <View style={{ alignSelf: 'center', marginTop: responsiveHeight(2) }}>
                    <FlatList
                        data={reviewList}
                        renderItem={renderReview}
                        keyExtractor={(item) => item.id.toString()}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        initialNumToRender={10}
                        showsVerticalScrollIndicator={false}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                    />
                </View>
            </ScrollView>
            <View style={styles.bottomPriceSection}>
                <View style={{ width: responsiveWidth(45), flexDirection: 'column', alignSelf: 'center' }}>
                    <Text style={{
                        color: '#8B939D',
                        fontFamily: 'PlusJakartaSans-Regular',
                        fontSize: responsiveFontSize(1.7)
                    }}>{t('ProductDetails.productprice')}</Text>
                    <Text style={{
                        color: '#000',
                        fontFamily: 'PlusJakartaSans-Bold',
                        fontSize: responsiveFontSize(2)
                    }}>₹ {productPrice}</Text>
                </View>
                <View style={{ width: responsiveWidth(50), alignSelf: 'center', marginBottom: -20, }}>
                    <CustomButton label={t('ProductDetails.addtocart')}
                        onPress={() => { AddToCart() }}
                    //onPress={() => { navigation.navigate('ChooseAstologerList') }}
                    />
                </View>
            </View>
        </SafeAreaView >
    )
}

export default withTranslation()(ProductDetails)

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {
        marginBottom: responsiveHeight(1)
    },
    carouselView: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        marginTop: responsiveHeight(1)
    },
    bannerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: BannerHeight,
        //backgroundColor: 'red',
        overflow: 'hidden',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    sectionHeaderView: {
        flexDirection: 'row',
        //justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(1),
        marginHorizontal: 15
    },
    sectionHeaderText: {
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
    },
    sectionHeaderOldPrice: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(2),
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'

    },
    sectionDesc: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.75),
        marginHorizontal: 15
    },
    dropdown: {
        height: responsiveHeight(4),
        borderColor: '#E3E3E3',
        borderWidth: 0.7,
        borderRadius: 8,
        paddingHorizontal: 8,

    },
    placeholderStyle: {
        fontSize: 16,
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Regular'
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Regular'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Regular'
    },
    imageStyle: {
        height: 20,
        width: 20,
        resizeMode: 'contain'
    },
    //date loop
    dateView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dayContainer: {
        height: responsiveHeight(10),
        width: responsiveWidth(14),
        borderRadius: 30,
        marginRight: responsiveWidth(3),
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    selectedDay: {
        backgroundColor: '#FEF3E5',
        borderColor: '#ECCEA8',
        borderWidth: 1,
    },
    defaultDay: {
        backgroundColor: '#F2F2F2',
        borderColor: '#F2F2F2',
        borderWidth: 1
    },
    weekDay: {
        color: '#746868',
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'PlusJakartaSans-Regular',
    },
    date: {
        color: '#2D2D2D',
        fontSize: responsiveFontSize(2.3),
        fontFamily: 'PlusJakartaSans-Bold',
    },
    noDateText: {
        color: '#746868',
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'PlusJakartaSans-Bold',
        alignItems: 'center',
        textAlign: 'center',
        paddingHorizontal: 20
    },
    bottomPriceSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: responsiveHeight(2),
        borderTopColor: '#F2F2F2',
        borderTopWidth: 2,
        paddingTop: 10
    },
    /* tab section */
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
        marginHorizontal: 15
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
    disabledTab: {
        backgroundColor: '#CCC',
    },
    disabledTabText: {
        color: '#888',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    totalValue: {
        width: responsiveWidth(91),
        //height: responsiveHeight(36),
        //alignItems: 'center',
        backgroundColor: '#fff',
        //justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
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
    reviewImg: {
        height: 40,
        width: 40,
        borderRadius: 20,
        resizeMode: 'contain',
        marginBottom: responsiveHeight(1)
    },
    reviewSec: {
        flexDirection: 'column',
        marginLeft: responsiveWidth(2),
        width: responsiveWidth(50),
    },
    reviewName: {
        color: '#292D34',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.7),
        marginBottom: 5
    },
    ratingView: {
        width: responsiveWidth(25),
    },
    reviewContain: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
    },
    avatarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
