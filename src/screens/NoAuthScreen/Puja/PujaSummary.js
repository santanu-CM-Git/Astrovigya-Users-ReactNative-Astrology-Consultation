import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, StatusBar, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, chatColor, checkedImg, dateIcon, filterImg, phoneColor, starImg, timeIcon, uncheckedImg, userPhoto } from '../../../utils/Images'
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
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useNavigation } from '@react-navigation/native';

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


const PujaSummary = ({ route }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false)


    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Summary'} onPress={() => navigation.goBack()} title={'Summary'} />
            <ScrollView style={styles.wrapper}>
                <View style={styles.topAstrologerSection}>
                    <View style={styles.totalValue}>
                        <View style={styles.totalValue1stSection}>
                            <View style={styles.profilePicSection}>
                                <Image
                                    source={userPhoto}
                                    style={styles.profilePicStyle}
                                />
                            </View>
                            <View style={styles.contentStyle}>
                                <Text style={styles.contentStyleName}>Astro Shivnash</Text>
                                <Text style={styles.contentStyleQualification}>Vedic, Prashna Chart, Life Coach</Text>
                                <Text style={styles.contentStyleLangValue}>Bengali, Hindi, English</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: responsiveWidth(55) }}>
                                    <Text style={styles.contentStyleExp}>Exp : 3 Years</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.totalValue2stSection}>
                            <Text style={styles.totalValue2stSectionHeader}>Kaal Sarp Dosh Puja</Text>
                            <View style={styles.totalValue2stSectionDetails}>
                                <View style={styles.imageSection1st}>
                                    <Image
                                        source={dateIcon}
                                        style={styles.imageSection1stImg}
                                        tintColor={'#FB7401'}
                                    />
                                    <Text style={styles.imageSection1stText}>Monday, 26 July, 2024</Text>
                                </View>
                                <View style={styles.imageSection2nd}>
                                    <Image
                                        source={timeIcon}
                                        style={styles.imageSection1stImg}
                                        tintColor={'#FB7401'}
                                    />
                                    <Text style={styles.imageSection1stText}>3 Hours</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.sectionHeaderView}>
                        <Text style={styles.sectionHeaderText}>Payment Details</Text>
                    </View>
                    <View style={styles.totalValue}>
                        <View style={styles.amountContainer}>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountText}>Puja Booking Fee</Text>
                                <Text style={styles.amountValue}>₹ 3100</Text>
                            </View>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountText}>Tax (GST 18%)</Text>
                                <Text style={styles.amountValue}>₹ 558</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#E3E3E3',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                marginHorizontal: 5
                            }}
                        />
                        <View style={styles.amountContainer}>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountTotalText}>Total Payable Amount</Text>
                                <Text style={styles.amountTotalValue}>₹ 3658</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </ScrollView>
            <View style={{ width: responsiveWidth(92), alignSelf: 'center' }}>
                <CustomButton label={"Proceed To Pay"}
                    // onPress={() => { login() }}
                    onPress={() => { navigation.navigate('ChooseAstologerList') }}
                />
            </View>
        </SafeAreaView >
    )
}

export default PujaSummary

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
    buttonText: {
        color: '#1CAB04'
    },
    verticleLine: {
        height: '50%',
        width: 1,
        backgroundColor: '#E3E3E3',
    },
    totalValue2stSection: { width: responsiveWidth(87), backgroundColor: '#FEF3E5', height: responsiveHeight(10), marginTop: responsiveHeight(2), borderRadius: 10, padding: 10, },
    totalValue2stSectionHeader: { color: '#1E2023', fontFamily: 'PlusJakartaSans-Bold', fontSize: responsiveFontSize(1.7) },
    totalValue2stSectionDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: responsiveHeight(2) },
    imageSection1st: { flexDirection: 'row', alignItems: 'center', width: responsiveWidth(40) },
    imageSection1stImg: { height: 20, width: 20, resizeMode: 'contain', marginRight: responsiveWidth(2) },
    imageSection1stText: { color: '##FB7401', fontFamily: 'PlusJakartaSans-SemiBold', fontSize: responsiveFontSize(1.5) },
    imageSection2nd: { flexDirection: 'row', alignItems: 'center', width: responsiveWidth(30), marginLeft: responsiveWidth(1.5) },
    sectionHeaderView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(1),
    },
    sectionHeaderText: {
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2)
    },
    amountContainer: {
        padding: 5
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    amountText: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D'
    },
    amountValue: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D'
    },
    amountTotalText: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.8),
        color: '#8B939D'
    },
    amountTotalValue: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.8),
        color: '#1E2023'
    }
});
