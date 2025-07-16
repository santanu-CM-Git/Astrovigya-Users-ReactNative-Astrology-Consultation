import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, ImageBackground, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, categoryImg, chatColor, checkedImg, courseImg, filterImg, freeServiceImg, horo2Img, image1Img, image2Img, image3Img, image4Img, image5Img, kundliImg, matchmakingImg, phoneColor, starImg, uncheckedImg, userPhoto } from '../../../utils/Images'
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



const CourseScreen = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false)


    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Courses'} onPress={() => navigation.goBack()} title={'Courses'} />
            <ScrollView style={styles.wrapper}>
                <View style={styles.flexrowView}>
                    <View style={styles.singleItemView}>
                        <Image
                            source={courseImg}
                            style={styles.imageStyle}
                        />
                        <View style={styles.courseContain}>
                        <Text style={styles.courseTitle}>Fundamentals of Vedic astrology</Text>
                        <Text style={styles.courseDesc}>Astro Srinivash</Text>
                        <Text style={styles.courseDuration}>Duration :<Text style={styles.courseDuration2}>01 Year</Text></Text>
                        </View>
                    </View>
                    <View style={styles.singleItemView}>
                        <Image
                            source={courseImg}
                            style={styles.imageStyle}
                        />
                        <View style={styles.courseContain}>
                        <Text style={styles.courseTitle}>Fundamentals of Vedic astrology</Text>
                        <Text style={styles.courseDesc}>Astro Srinivash</Text>
                        <Text style={styles.courseDuration}>Duration :<Text style={styles.courseDuration2}>01 Year</Text></Text>
                        </View>
                    </View>
                    <View style={styles.singleItemView}>
                        <Image
                            source={courseImg}
                            style={styles.imageStyle}
                        />
                        <View style={styles.courseContain}>
                        <Text style={styles.courseTitle}>Fundamentals of Vedic astrology</Text>
                        <Text style={styles.courseDesc}>Astro Srinivash</Text>
                        <Text style={styles.courseDuration}>Duration :<Text style={styles.courseDuration2}>01 Year</Text></Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CourseScreen

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
    singleItemView: {
        height: responsiveHeight(40),
        width: responsiveWidth(45),
    },
    imageStyle:{
        height: responsiveHeight(25),
        width: responsiveWidth(45),
        borderRadius:12,
        resizeMode:'cover'
    },
    courseContain:{
        marginTop: responsiveHeight(1)
    },
    courseTitle:{
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
        marginBottom: responsiveHeight(1)     
    },
    courseDesc:{
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7)
    },
    courseDuration:{
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.7)
    },
    courseDuration2:{
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7)
    }
});
