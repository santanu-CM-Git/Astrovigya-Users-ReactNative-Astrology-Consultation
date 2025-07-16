import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, StatusBar, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
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


const OnlinePujaList = ({ route }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false)


    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Online Puja'} onPress={() => navigation.goBack()} title={'Online Puja'} />
            <ScrollView style={styles.wrapper}>
                <View style={styles.topAstrologerSection}>
                    <Pressable onPress={() => navigation.navigate('PujaDetails')}>
                        <View style={styles.totalValue}>
                            <View style={styles.flexDirectionRow}>
                                <Image
                                    source={pujaImg}
                                    style={styles.imageStyle}
                                />
                                <View style={styles.containSection}>
                                    <Text style={styles.pujaName}>Kaal Sarp Dosh Puja</Text>
                                    <Text style={styles.pujaDesc}>Starting From <Text style={styles.pujaAmount}>₹ 2200</Text></Text>
                                    <View style={styles.bookNowButton}>
                                        <Text style={styles.buttonText}>Book Now</Text>
                                    </View>
                                </View>

                            </View>
                        </View>
                    </Pressable>
                </View>

            </ScrollView>
        </SafeAreaView >
    )
}

export default OnlinePujaList

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
    flexDirectionRow: {
        flexDirection: 'row',

    },
    imageStyle: {
        height: responsiveHeight(15),
        width: responsiveWidth(30),
        borderRadius: 10
    },
    containSection: {
        flexDirection: 'column',
        marginLeft: responsiveWidth(2)
    },
    pujaName: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        marginBottom: responsiveHeight(1)
    },
    pujaDesc: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
        marginBottom: responsiveHeight(3)
    },
    pujaAmount: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.7),
        marginBottom: responsiveHeight(1)
    },
    bookNowButton: {
        height: responsiveHeight(5),
        width: responsiveWidth(30),
        borderRadius: 10,
        backgroundColor: '#FB7401',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText:{
        color: '#FFF',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(1.7),
    }
});
