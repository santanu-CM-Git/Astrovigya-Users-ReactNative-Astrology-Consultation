import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, ImageBackground, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
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


const StoreScreen = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false)


    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Store'} onPress={() => navigation.goBack()} title={'Store'} />
            <ScrollView style={styles.wrapper}>
                <LinearGradient
                    colors={['#FDEEDA', '#FEF7EF']} // Example colors, replace with your desired gradient
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.headingSection}
                >
                    <Text style={styles.headerText}>Choose Your Categories</Text>
                </LinearGradient>
                <View style={styles.categoryListView}>
                    <Pressable onPress={() => navigation.navigate('ProductListScreen')}>
                        <ImageBackground
                            source={productCategoryImg}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.textView}>
                                <Text style={styles.text1}>Gemstones</Text>
                                <Text style={styles.text2}>Purchase Gemstones at Affordable Prices</Text>
                                <View style={styles.exploreView}>
                                    <Text style={styles.text3}>Explore Now</Text>
                                    <Image
                                        source={forwordButtonImg}
                                        style={styles.icon}
                                    />
                                </View>
                            </View>
                        </ImageBackground>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default StoreScreen

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
        marginTop: responsiveHeight(2)
    },
    singleCategoryView: {
        height: responsiveHeight(22),
        width: responsiveWidth(92),
        borderRadius: 15,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: 10,
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
