import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, ImageBackground, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, categoryImg, chatColor, checkedImg, filterImg, forwordButtonImg, freeServiceImg, horo2Img, image1Img, image2Img, image3Img, image4Img, image5Img, kundliImg, matchmakingImg, phoneColor, productCategoryImg, productImg, starImg, uncheckedImg, userPhoto } from '../../../utils/Images'
import { API_URL } from '@env'
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '../../../utils/Loader';
import moment from "moment"
import StarRating from 'react-native-star-rating-widget';
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Entypo';
import CheckBox from '@react-native-community/checkbox';
import SelectMultiple from 'react-native-select-multiple'
import { Dropdown } from 'react-native-element-dropdown';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import LinearGradient from 'react-native-linear-gradient';


const ProductListScreen = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('Result');
    const tabs = [
        { label: 'All', value: 'All' },
        { label: 'Yellow Sapphire', value: 'Yellow Sapphire' },
        { label: 'Blue Sapphire', value: 'Blue Sapphire' },
        { label: 'Blue Sapphire', value: 'Blue Sapphire' },
        { label: 'Blue Sapphire', value: 'Blue Sapphire' },
    ];

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Gemstone'} onPress={() => navigation.goBack()} title={'Gemstone'} />
            <ScrollView style={styles.wrapper}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={styles.tabContainer}>
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab.value}
                                onPress={() => setActiveTab(tab.value)}
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
                <View style={styles.titleSection}>
                    <View style={styles.columnSection}>
                        <Text style={styles.titleText}>Certified Gemstones</Text>
                        <Text style={styles.titleDesc}>Products for effective remedies</Text>
                    </View>
                    <View style={styles.filterView}>
                        <Text style={styles.filterText}>Filter</Text>
                        <Image
                            source={filterImg}
                            style={{ height: 20, width: 20, resizeMode: 'contain' }}
                        />
                    </View>
                </View>
                <View style={styles.productSection}>
                    <View style={styles.topAstrologerSection}>
                        <View style={styles.totalValue}>
                            <Image
                                source={productImg}
                                style={styles.productImg}
                            />
                            <Text style={styles.productText}>Blue Sapphire - 4.84 Carat</Text>
                            <View style={styles.productAmountView}>
                                <Text style={styles.productAmount}>₹ 4,950</Text>
                                <Text style={styles.productPreviousAmount}>₹ 5,950</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProductListScreen

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
        alignItems: 'center'
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
    filterView: {
        height: responsiveHeight(5),
        width: responsiveWidth(25),
        borderColor: '#E3E3E3',
        borderWidth: 1,
        borderRadius: 20,
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
        marginTop: responsiveHeight(2)
    },
    //product section
    topAstrologerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    totalValue: {
        width: responsiveWidth(43),
        height: responsiveHeight(32),
        //alignItems: 'center',
        backgroundColor: '#fff',
        //justifyContent: 'center',
        padding: 5,
        borderRadius: 15,
        elevation: 5,
        margin: 2,
        marginBottom: responsiveHeight(2)
    },
    productImg: {
        height: responsiveHeight(20),
        width: responsiveFontSize(19.5),
        resizeMode: 'contain',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    productText: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(1.7),
        marginTop: responsiveHeight(1)
    },
    productAmountView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    productAmount:{
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
        marginRight: responsiveWidth(2)
    },
    productPreviousAmount:{
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
        textDecorationLine: 'line-through' 
    }
});
