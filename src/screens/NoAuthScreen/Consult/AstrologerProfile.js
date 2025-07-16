import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, StatusBar, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Alert } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { TextInput, LongPressGestureHandler, State } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, chatColor, checkedImg, expImg, likeImg, phoneColor, starImg, uncheckedImg, userPhoto, } from '../../../utils/Images'
import { API_URL, } from '@env'
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '../../../utils/Loader';
import moment from "moment"
import StarRating from 'react-native-star-rating-widget';
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

const items = [
    { id: 1, icon: chatColor },
    { id: 2, icon: phoneColor },
    { id: 3, icon: cameraColor },
];
const AstrologerProfile = ({ navigation, route }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false)

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Profile'} onPress={() => navigation.goBack()} title={'Profile'} />
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
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.contentStyleRate, { marginRight: 5 }]}>₹ 35/Min</Text>
                                    <Text style={[styles.contentStyleRateFree, { marginRight: 5 }]}>Free</Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#E3E3E3',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                        <View style={styles.totalValue2ndSection}>
                            <View style={styles.totalValue2ndflexColumn}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={starImg}
                                        style={styles.staricon}
                                        tintColor={'#FB7401'}
                                    />
                                    <Text style={styles.ratingText}>3.5</Text>

                                </View>
                                <Text style={styles.ratingText2}>104 Ratings</Text>
                            </View>
                            <View style={styles.verticleLine}></View>
                            <View style={styles.totalValue2ndflexColumn}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={expImg}
                                        style={styles.staricon}
                                        tintColor={'#FB7401'}
                                    />
                                    <Text style={styles.ratingText}>13 Years</Text>

                                </View>
                                <Text style={styles.ratingText2}>Experience</Text>
                            </View>
                            <View style={styles.verticleLine}></View>
                            <View style={styles.totalValue2ndflexColumn}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={likeImg}
                                        style={styles.staricon}
                                        tintColor={'#FB7401'}
                                    />
                                    <Text style={styles.ratingText}>150+</Text>

                                </View>
                                <Text style={styles.ratingText2}>Consultation</Text>
                            </View>
                        </View>
                    </View>

                </View>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>About Astro Shivnash</Text>
                </View>
                <Text style={styles.sectionDesc}>Astro Shivnash is an Indian astrologer from Delhi
                    having 18 years of experience in the field of
                    astrology. He belongs to the national capital of
                    India and offers his services to the people who
                    are looking for guidance in astrology through
                    Astrovigya.</Text>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>Specialization</Text>
                </View>
                <View style={styles.specializationView}>
                    <View style={styles.singleTagview}>
                        <Text style={styles.singleTagText}>Vedic Astrology</Text>
                    </View>
                    <View style={styles.singleTagview}>
                        <Text style={styles.singleTagText}>Tarot Expert</Text>
                    </View>
                    <View style={styles.singleTagview}>
                        <Text style={styles.singleTagText}>Palmistry</Text>
                    </View>
                    <View style={styles.singleTagview}>
                        <Text style={styles.singleTagText}>Tarot Expert</Text>
                    </View>
                    <View style={styles.singleTagview}>
                        <Text style={styles.singleTagText}>KP Astrology</Text>
                    </View>
                </View>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>Certifications</Text>
                </View>
                <Text style={styles.sectionDesc}>I have learned KP astrology (Acharya
                    degree) from kp stellar astrological
                    research institute, Chennai and tarot card
                    reading from the tarotpreneur, Hyderabad
                    and Coaching guidance from Sanjay Shastri.</Text>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>Customer Reviews</Text>
                </View>
                <View style={styles.topAstrologerSection}>
                    <View style={styles.totalValue}>
                        <View style={{ flexDirection: 'row',padding:5}}>
                            <Image
                                source={userPhoto}
                                style={styles.reviewImg}
                            />
                            <View style={styles.reviewSec}>
                                <Text style={styles.reviewName}>Ragini Pandey</Text>
                                <View style={styles.ratingView}>
                                    <StarRating
                                        disabled={true}
                                        maxStars={5}
                                        rating={4}
                                        onChange={(rating) => setStarCount(rating)}
                                        fullStarColor={'#FFCB45'}
                                        starSize={14}
                                        starStyle={{ marginHorizontal: responsiveWidth(0.5) }}
                                    />
                                </View>
                                <Text style={styles.reviewContain}>I am satisfied</Text>
                            </View>
                            <Text style={styles.reviewContain}>May 25,2024</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonWrapper}>
                <View style={{ width: responsiveWidth(45), alignSelf: 'center' }}>
                    <CustomButton label={"Chat Now"}
                        // onPress={() => { login() }}
                        onPress={() => { submitForm() }}
                        buttonIconForwordChat={true}
                    />
                </View>
                <View style={{ width: responsiveWidth(45), alignSelf: 'center' }}>
                    <CustomButton label={"Call Now"}
                        // onPress={() => { login() }}
                        onPress={() => { submitForm() }}
                        buttonIconForwordCall={true}
                    />
                </View>
            </View>
        </SafeAreaView >
    )
}

export default AstrologerProfile

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {

    },
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
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
        borderRadius: 10,
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
    ratingText2: {
        fontSize: responsiveFontSize(1.5),
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-SemiBold',
        marginRight: 5
    },
    staricon: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
        marginRight: 5
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
        fontSize: responsiveFontSize(1.7),
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Medium',
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
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: responsiveWidth(40),
        alignSelf: 'flex-end'
    },
    iconView: {
        height: responsiveHeight(4.5),
        width: responsiveWidth(18),
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
    totalValue2ndSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    totalValue2ndflexColumn: {
        padding: 10
    },
    verticleLine: {
        height: '80%',
        width: 1,
        backgroundColor: '#E3E3E3',
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
    sectionDesc: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.75),
        marginHorizontal: 15
    },
    specializationView: {
        marginHorizontal: 15,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    singleTagview: {
        padding: 10,
        backgroundColor: '#FEF3E5',
        marginRight: 5,
        marginBottom: 5,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    singleTagText: {
        color: '#894F00',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
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
    }
});
