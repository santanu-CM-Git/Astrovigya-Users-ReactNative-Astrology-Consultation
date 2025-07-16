import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, StatusBar, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, chatColor, checkedImg, filterImg, phoneColor, starImg, uncheckedImg, userPhoto } from '../../../utils/Images'
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

// const dropdowndata = [
//     { label: 'All therapist', value: 'All' },
//     { label: 'Individual', value: 'Individual' },
//     { label: 'Couple', value: 'Couple' },
//     { label: 'Child', value: 'Child' },
// ];
const Experience = [
    { label: '0 - 2 Years', value: '0-2' },
    { label: '3 - 5 Years', value: '2-5' },
    { label: '6 - 8 Years', value: '6-8' },
    { label: '9 - 12 Years', value: '9-12' },
    { label: '13 - 15 Years', value: '13-15' },
    { label: '15 - 20 Years', value: '15-20' },
    { label: '20+ Years', value: '20-100' }
]
const Rating = [
    { label: '1 Star', value: '1' },
    { label: '2 Star', value: '2' },
    { label: '3 Star', value: '3' },
    { label: '4 Star', value: '4' },
    { label: '5 Star', value: '5' }
]
const Gender = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Others', value: 'Others' }
]
const Ages = [
    { label: '20 - 30', value: '20-30' },
    { label: '30 - 40', value: '30-40' },
    { label: '40 - 50', value: '40-50' },
    { label: '50 - 60', value: '50-60' },
    { label: '60 above', value: '60-100' },
]
// const Rate = [
//     { label: 'below 300', value: '1' },
//     { label: 'below 500', value: '2' },
//     { label: 'below 1000', value: '3' },
//     { label: 'below 2000', value: '4' },
//     { label: 'above 2000', value: '5' },
// ]


const ChooseAstologerList = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false)


    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Choose an astrologer'} onPress={() => navigation.goBack()} title={'Choose an astrologer'} />
            <ScrollView style={styles.wrapper}>
                <View style={styles.topAstrologerSection}>
                    <Pressable onPress={() => navigation.navigate('PujaSummary')}>
                        <View style={styles.totalValue}>
                            <View style={styles.totalValue1stSection}>
                                <View style={styles.profilePicSection}>
                                    <Image
                                        source={userPhoto}
                                        style={styles.profilePicStyle}
                                    />
                                    <View style={styles.rateingView}>
                                        <Text style={styles.ratingText}>3.5</Text>
                                        <Image
                                            source={starImg}
                                            style={styles.staricon}
                                        />
                                    </View>
                                </View>
                                <View style={styles.contentStyle}>
                                    <Text style={styles.contentStyleName}>Astro Shivnash</Text>
                                    <Text style={styles.contentStyleQualification}>Vedic, Prashna Chart, Life Coach</Text>
                                    <Text style={styles.contentStyleLangValue}>Bengali, Hindi, English</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between',width:responsiveWidth(55) }}>
                                        <Text style={styles.contentStyleExp}>Exp : 3 Years</Text>
                                        <View style={styles.verticleLine}></View>
                                        <Text style={styles.contentStyleExp}>Duration : 4 Hours</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.listButtonSecondSection}>
                            <Text style={[styles.contentStyleRate, { marginRight: 5 }]}>₹ 3100</Text>
                                <View style={[styles.iconView, { backgroundColor: '#EFFFF3', borderColor: '#1CAB04' }]}>
                                    <Text style={styles.buttonText}>Select</Text>
                                </View>
                            </View>

                        </View>
                    </Pressable>
                </View>

            </ScrollView>
        </SafeAreaView >
    )
}

export default ChooseAstologerList

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {

    },
    topAstrologerSection: {
        marginHorizontal: 15,
        marginTop: responsiveHeight(1)
    },
    totalValue: {
        width: responsiveWidth(92),
        //height: responsiveHeight(36),
        //alignItems: 'center',
        backgroundColor: '#fff',
        //justifyContent: 'center',
        padding: 10,
        borderRadius: 15,
        elevation: 5,
        margin: 2,
        marginBottom: responsiveHeight(2)
    },
    totalValue1stSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    profilePicSection: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: responsiveWidth(25),
    },
    profilePicStyle: {
        height: 80,
        width: 80,
        borderRadius: 40,
        resizeMode: 'contain',
        marginBottom: responsiveHeight(1)
    },
    starStyle: {
        marginHorizontal: responsiveWidth(0.5),
        marginBottom: responsiveHeight(1)
    },
    noOfReview: {
        fontSize: responsiveFontSize(1.7),
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Regular',
    },
    rateingView: {
        backgroundColor: '#F6C94B',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingText: {
        fontSize: responsiveFontSize(1.5),
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        marginRight: 5
    },
    staricon: {
        height: 20,
        width: 20,
        resizeMode: 'contain'
    },
    contentStyle: {
        flexDirection: 'column',
        width: responsiveWidth(60),
        //height: responsiveHeight(10),
        //backgroundColor:'red'
    },
    contentStyleName: {
        fontSize: responsiveFontSize(2),
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-Bold',
        marginBottom: responsiveHeight(1)
    },
    contentStyleQualification: {
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Medium',
        marginBottom: responsiveHeight(0.5)
    },
    contentStyleExp: {
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        marginBottom: responsiveHeight(1)
    },
    contentStyleLang: {
        fontSize: responsiveFontSize(1.7),
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Medium',
        marginBottom: responsiveHeight(1)
    },
    contentStyleLangValue: {
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        marginBottom: responsiveHeight(0.5)
    },
    contentStyleRate: {
        fontSize: responsiveFontSize(2),
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        marginBottom: responsiveHeight(1),
        textDecorationLine: 'line-through', textDecorationStyle: 'solid'
    },
    contentStyleRateFree: {
        fontSize: responsiveFontSize(1.7),
        color: '#FF5A6A',
        fontFamily: 'PlusJakartaSans-Medium',
        marginBottom: responsiveHeight(1),
    },
    contentStyleAvailableSlot: {
        fontSize: responsiveFontSize(1.5),
        color: '#444343',
        fontFamily: 'PlusJakartaSans-Medium',
        marginBottom: responsiveHeight(1)
    },
    listButtonSecondSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: responsiveWidth(60),
        alignSelf: 'flex-end',
    },
    iconView: {
        height: responsiveHeight(4.5),
        width: responsiveWidth(30),
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    iconSize: {
        height: 20,
        width: 20,
        marginRight: 5
    },
    buttonText:{
        color:'#1CAB04'
    },
    verticleLine: {
        height: '50%',
        width: 1,
        backgroundColor: '#E3E3E3',
    },
});
