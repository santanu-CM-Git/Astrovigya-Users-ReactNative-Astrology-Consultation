import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, ImageBackground, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { aquariusImg, ariesImg, bookmarkedFill, bookmarkedNotFill, cameraColor, cancerImg, capriconImg, categoryImg, chatColor, checkedImg, filterImg, freeServiceImg, geminiImg, horo2Img, image1Img, image2Img, image3Img, image4Img, image5Img, kundliImg, leoImg, libraImg, luckyColorImg, luckyNoImg, matchmakingImg, phoneColor, piscesImg, sagittariusImg, scorpioImg, starImg, taurasImg, uncheckedImg, userPhoto, virgoImg } from '../../../utils/Images'
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
import LinearGradient from 'react-native-linear-gradient';
import SwitchSelector from "react-native-switch-selector";
import { useNavigation } from '@react-navigation/native';

const HoroscopeDetails = ({ route }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false)
    const [activeButtonNo, setActiveButtonNo] = useState(0)
    const [activeTab, setActiveTab] = useState('Upcoming')

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Horoscope'} onPress={() => navigation.goBack()} title={'Horoscope'} />
            <ScrollView style={styles.wrapper}>
                <View style={styles.headerSection}>
                    <ImageBackground
                        source={ariesImg}
                        style={styles.singleCategoryView}
                        imageStyle={styles.imageBackground}
                    >
                    </ImageBackground>
                    <View style={styles.flexColumn}>
                        <Text style={styles.headerText}>Aries</Text>
                        <Text style={styles.headerTime}>21 May - 20 June</Text>
                    </View>
                </View>
                <View style={{ marginVertical: responsiveHeight(3) }}>
                    <SwitchSelector
                        initial={activeButtonNo}
                        onPress={value => setActiveTab(value)}
                        textColor={'#1E2023'}
                        selectedColor={'#FFFFFF'}
                        buttonColor={'#FB7401'}
                        backgroundColor={'#FEF3E5'}
                        borderWidth={0}
                        height={responsiveHeight(7)}
                        valuePadding={6}
                        hasPadding
                        options={[
                            { label: "Daily", value: "Daily", }, //images.feminino = require('./path_to/assets/img/feminino.png')
                            { label: "Monthly", value: "Monthly", }, //images.masculino = require('./path_to/assets/img/masculino.png')
                            { label: "Yearly", value: "Yearly", },
                        ]}
                        testID="gender-switch-selector"
                        accessibilityLabel="gender-switch-selector"
                    />

                </View>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>Date : <Text style={styles.dateValue}>03-06-2024</Text></Text>
                </View>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>General</Text>
                </View>
                <Text style={styles.sectionDesc}>Kal Sarp Puja is a powerful Hindu ritual performed to alleviate the negative effects of the Kal Sarp Dosh. This dosh occurs when all planets are positioned between Rahu and Ketu in a person's birth chart, often leading to various challenges and obstacles in life. The puja is conducted with specific rituals and mantras to appease Rahu and Ketu, seeking their blessings for harmony, prosperity, and well-being. By performing the Kal Sarp Puja, individuals can overcome difficulties, reduce the impact of the dosh, and invite positive energy and success into their lives.</Text>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>Love</Text>
                </View>
                <Text style={styles.sectionDesc}>Kal Sarp Puja is a powerful Hindu ritual performed to alleviate the negative effects of the Kal Sarp Dosh. This dosh occurs when all planets are positioned between Rahu and Ketu in a person's birth chart, often leading to various challenges and obstacles in life. The puja is conducted with specific rituals and mantras to appease Rahu and Ketu, seeking their blessings for harmony, prosperity, and well-being. By performing the Kal Sarp Puja, individuals can overcome difficulties, reduce the impact of the dosh, and invite positive energy and success into their lives.</Text>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>Career</Text>
                </View>
                <Text style={styles.sectionDesc}>Kal Sarp Puja is a powerful Hindu ritual performed to alleviate the negative effects of the Kal Sarp Dosh. This dosh occurs when all planets are positioned between Rahu and Ketu in a person's birth chart, often leading to various challenges and obstacles in life. The puja is conducted with specific rituals and mantras to appease Rahu and Ketu, seeking their blessings for harmony, prosperity, and well-being. By performing the Kal Sarp Puja, individuals can overcome difficulties, reduce the impact of the dosh, and invite positive energy and success into their lives.</Text>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>Health</Text>
                </View>
                <Text style={styles.sectionDesc}>Kal Sarp Puja is a powerful Hindu ritual performed to alleviate the negative effects of the Kal Sarp Dosh. This dosh occurs when all planets are positioned between Rahu and Ketu in a person's birth chart, often leading to various challenges and obstacles in life. The puja is conducted with specific rituals and mantras to appease Rahu and Ketu, seeking their blessings for harmony, prosperity, and well-being. By performing the Kal Sarp Puja, individuals can overcome difficulties, reduce the impact of the dosh, and invite positive energy and success into their lives.</Text>
                <View style={styles.tableRow2}>
                    <View style={styles.cellmain}>
                        <Text style={styles.tableHeader2}>Lucky Color & Lucky Numbers</Text>
                    </View>
                    <View style={styles.containSection}>
                        <View style={styles.leftSection}>
                            <Image
                                source={luckyColorImg}
                                style={styles.iconSize}
                            />
                            <Text style={styles.sectionText}>Aries Lucky Color for Today</Text>
                            <Text style={styles.sectionText2}>Red</Text>
                        </View>
                        <View style={styles.rightSection}>
                            <Image
                                source={luckyNoImg}
                                style={styles.iconSize}
                            />
                            <Text style={styles.sectionText}>Aries Lucky Number for Today</Text>
                            <Text style={styles.sectionText2}>8,9</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HoroscopeDetails

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {
        paddingHorizontal: 15
    },
    flexrowView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: responsiveHeight(2),
        flexWrap: 'wrap'
    },
    singleCategoryView: {
        height: responsiveHeight(15),
        width: responsiveWidth(30),
        borderRadius: 15,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: 10,
    },
    imageBackground: {
        borderRadius: 15, // Applies the border radius to the background image,
        resizeMode: 'contain'
    },
    textView: {
        //width: responsiveWidth(38)
    },
    text1: {
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2.8),
        alignSelf: 'center'
    },
    text2: {
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.5),
    },
    text3: {
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(3),
    },
    flotingButton: {
        backgroundColor: '#1E2023',
        height: 30,
        width: 80,
        borderRadius: 20,
        position: 'absolute',
        bottom: -responsiveHeight(2),
        right: 20,
        borderColor: "#FFFFFF",
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flotingButtonText: {
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(1.5),
    },
    serviceStyle: {
        height: responsiveHeight(4),
        width: responsiveWidth(90),
    },
    categoryView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(1)
    },
    singleKnowmoreView: {
        height: responsiveHeight(20),
        width: responsiveWidth(30),
        borderRadius: 15,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        resizeMode: 'contain'
    },
    icon: {
        height: 50,
        width: 50,
        resizeMode: 'contain'
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
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SeniBold',
        fontSize: responsiveFontSize(2.5),
    },
    headerTime: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-SeniBold',
        fontSize: responsiveFontSize(2),
    },
    headerSection: {
        marginTop: responsiveHeight(2),
        flexDirection: 'row',
        alignItems: 'center'
    },
    flexColumn: {
        flexDirection: 'column',
        marginLeft: responsiveWidth(3)
    },
    sectionHeaderView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(1)
    },
    sectionHeaderText: {
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2)
    },
    dateValue: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(2)
    },
    sectionDesc: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.75),
    },
    tableRow2: {
        borderBottomWidth: 1,
        borderColor: '#E3E3E3',
        borderWidth: 1,
        marginVertical: responsiveHeight(2),
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
        //height: responsiveHeight(15)
    },
    cellmain: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4F5F5',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    tableHeader2: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.7),
        textAlign: 'center'
    },
    containSection: {
        flexDirection: 'row',
        width: responsiveWidth(100),
    },
    leftSection: {
        width: responsiveWidth(45),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#E3E3E3',
        padding: 10
    },
    rightSection: {
        width: responsiveWidth(45),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    sectionText: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.2),
        marginBottom: responsiveHeight(1)
    },
    sectionText2:{
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        marginBottom: responsiveHeight(1)
    },
    iconSize: {
        height: 20,
        width: 20,
        marginBottom: responsiveHeight(1)
    },
});
