import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Dimensions, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
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
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import RenderHTML from 'react-native-render-html';
import { Dropdown } from 'react-native-element-dropdown';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FastImage from '@d11/react-native-fast-image';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 250;
const { height, width } = Dimensions.get('screen')
const sliderWidth = Dimensions.get('window').width;
const paddingHorizontal = 10;
const itemWidth = sliderWidth - (2 * paddingHorizontal);

const ProductDetails = ({ route }) => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();

    const [isLoading, setIsLoading] = useState(false)
    const [productDetails, setProductDetails] = useState(null)
    const [activeSlide, setActiveSlide] = React.useState(0);
    const [activeTabWeight, setActiveTabWeight] = useState('');
    const [activeTabColor, setActiveTabColor] = useState('');
    const [activeTabSize, setActiveTabSize] = useState('');
    const [weightArray, setWeightArray] = useState([]);
    const [colorArray, setColorArray] = useState([]);
    const [sizeArray, setSizeArray] = useState([]);
    const [availableWeights, setAvailableWeights] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);

    useEffect(() => {
        if (route?.params?.details) {
            setProductDetails(route?.params?.details);

            const tempWeightArray = [];
            const tempColorArray = [];
            const tempSizeArray = [];

            route?.params?.details.store_variations.forEach(item => {
                item.attributes.forEach(attr => {
                    if (attr.type === 'Weight') tempWeightArray.push(attr.attribute);
                    if (attr.type === 'color') tempColorArray.push(attr.attribute);
                    if (attr.type === 'size') tempSizeArray.push(attr.attribute);
                });
            });

            // Remove duplicates and update the state
            setWeightArray([...new Set(tempWeightArray)]);
            setColorArray([...new Set(tempColorArray)]);
            setSizeArray([...new Set(tempSizeArray)]);
        }
    }, [])

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
        if (type === 'Weight') setActiveTabWeight(value);
        if (type === 'color') setActiveTabColor(value);
        if (type === 'size') setActiveTabSize(value);

        const filteredVariations = route?.params?.details.store_variations.filter(variation =>
            variation.attributes.some(attr => (type === 'Weight' ? attr.attribute === value && attr.type === 'Weight' : true)) &&
            variation.attributes.some(attr => (type === 'color' ? attr.attribute === value && attr.type === 'color' : true)) &&
            variation.attributes.some(attr => (type === 'size' ? attr.attribute === value && attr.type === 'size' : true))
        );

        const updatedColors = filteredVariations.flatMap(variation =>
            variation.attributes.filter(attr => attr.type === 'color').map(attr => attr.attribute)
        );
        const updatedWeights = filteredVariations.flatMap(variation =>
            variation.attributes.filter(attr => attr.type === 'Weight').map(attr => attr.attribute)
        );
        const updatedSizes = filteredVariations.flatMap(variation =>
            variation.attributes.filter(attr => attr.type === 'size').map(attr => attr.attribute)
        );

        // Update available attributes dynamically
        setAvailableColors([...new Set(updatedColors)]);
        setAvailableWeights([...new Set(updatedWeights)]);
        setAvailableSizes([...new Set(updatedSizes)]);
    }

    const findProductDetails = () => {
        const productResponse = route?.params?.details;

        const filteredProduct = productResponse.store_variations.filter(variation => {
            const attributes = variation.attributes;

            const weightMatch = attributes.some(attr => attr.attribute === activeTabWeight && attr.type === "Weight");
            const colorMatch = attributes.some(attr => attr.attribute === activeTabColor && attr.type === "color");
            const sizeMatch = attributes.some(attr => attr.attribute === activeTabSize && attr.type === "size");

            return weightMatch && colorMatch && sizeMatch;
        });

        if (filteredProduct.length > 0) {
            setProductDetails(filteredProduct[0]);
        }
        //console.log(filteredProduct, 'product after search')
    }

    useEffect(() => {
        if (activeTabWeight && activeTabColor && activeTabSize) {
            findProductDetails();
        }
    }, [activeTabWeight, activeTabColor, activeTabSize]);

    const renderTab = (type, data, activeValue, availableValues) => (
        <>
            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeaderText}>Select {type}:</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tabContainer}>
                    {data.map((item) => {
                        const isDisabled = availableValues.includes(item);
                        return (
                            <TouchableOpacity
                                key={item}
                                onPress={() => !isDisabled && onSelectAttribute(type, item)}
                                style={[
                                    styles.tab,
                                    activeValue === item && styles.activeTab,
                                    isDisabled && styles.disabledTab
                                ]}
                                disabled={isDisabled}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeValue === item && styles.activeTabText,
                                        isDisabled && styles.disabledTabText
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>
        </>
    );

    const booknow = () => {


    }

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Store'} onPress={() => navigation.goBack()} title={'Details'} />
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
                    <Text style={styles.sectionDesc}>Origin : {productDetails?.origin}</Text>
                ) : null}
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>₹ {productDetails?.price}
                        <Text style={styles.sectionHeaderOldPrice}> ₹ {productDetails?.max_price}</Text>
                    </Text>
                </View>
                <View>
                    {weightArray.length > 0 && renderTab('Weight', weightArray, activeTabWeight, availableWeights)}
                    {colorArray.length > 0 && renderTab('Color', colorArray, activeTabColor, availableColors)}
                    {sizeArray.length > 0 && renderTab('Size', sizeArray, activeTabSize, availableSizes)}
                </View>
                {productDetails?.description ? (
                    <View style={styles.sectionHeaderView}>
                        <Text style={styles.sectionHeaderText}>About {productDetails?.name}</Text>
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
                        <Text style={styles.sectionHeaderText}>Return & Refund</Text>
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
            </ScrollView>
            <View style={styles.bottomPriceSection}>
                <View style={{ width: responsiveWidth(45), flexDirection: 'column', alignSelf: 'center' }}>
                    <Text style={{
                        color: '#8B939D',
                        fontFamily: 'PlusJakartaSans-Regular',
                        fontSize: responsiveFontSize(1.7)
                    }}>Product Price</Text>
                    <Text style={{
                        color: '#000',
                        fontFamily: 'PlusJakartaSans-Bold',
                        fontSize: responsiveFontSize(2)
                    }}>₹ 4,950</Text>
                </View>
                <View style={{ width: responsiveWidth(50), alignSelf: 'center', marginBottom: -20, }}>
                    <CustomButton label={"Buy Now"}
                        onPress={() => { booknow() }}
                    //onPress={() => { navigation.navigate('ChooseAstologerList') }}
                    />
                </View>
            </View>
        </SafeAreaView >
    )
}

export default ProductDetails

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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(1),
        marginHorizontal: 15
    },
    sectionHeaderText: {
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2)
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
});
