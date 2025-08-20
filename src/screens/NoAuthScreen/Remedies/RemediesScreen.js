import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, ImageBackground, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, categoryImg, chatColor, checkedImg, filterImg, freeServiceImg, horo2Img, image1Img, image2Img, image3Img, image4Img, image5Img, kundliImg, matchmakingImg, phoneColor, starImg, uncheckedImg, userPhoto } from '../../../utils/Images'
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { withTranslation, useTranslation } from 'react-i18next';


const RemediesScreen = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
      const [langvalue, setLangValue] = useState('en');
    const [isLoading, setIsLoading] = useState(false)


    const loadLanguage = async () => {
        try {
          const savedLang = await AsyncStorage.getItem('selectedLanguage');
          if (savedLang) {
            console.log(savedLang,'console language from home screen');
            
            setLangValue(savedLang);
            i18n.changeLanguage(savedLang);
          }
        } catch (error) {
          console.error('Failed to load language from AsyncStorage', error);
        }
      };
      useEffect(() => {
        loadLanguage();
      }, []);
    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Remedies'} onPress={() => navigation.goBack()} title={t('Remedies.remedies')} />
            <ScrollView style={styles.wrapper}>
                <View style={styles.flexrowView}>
                    {/* <Pressable onPress={() => navigation.navigate('OnlinePujaList')} style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={image1Img}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.textView}>
                                <Text style={styles.text1}>{t('Remedies.premiumkundli')}</Text>
                            </View>
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>{t('Remedies.booknow')}</Text>
                            </View>
                        </ImageBackground>
                    </Pressable> */}
                    <Pressable onPress={() => { navigation.navigate('COURSE', { screen: 'CourseScreen', }) }} style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={image2Img}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.textView}>
                                <Text style={styles.text1}>{t('Remedies.onlinecourse')}</Text>
                                {/* <Text style={styles.text2}>Starting From</Text>
                                <Text style={styles.text3}>₹ 249</Text> */}
                            </View>
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>{t('Remedies.enrollnow')}</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                    <Pressable onPress={() => { navigation.navigate('Consult', { screen: 'AstrologerList', }) }} style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={image3Img}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.textView}>
                                <Text style={styles.text1}>{t('Remedies.chatwithastrologers')}</Text>
                                {/* <Text style={styles.text2}>Starting From</Text>
                                <Text style={styles.text3}>₹ 10/min</Text> */}
                            </View>
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>{t('Remedies.chatnow')}</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                    <Pressable onPress={() => { navigation.navigate('Store', { screen: 'StoreScreen', }) }} style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={image4Img}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.textView}>
                                <Text style={styles.text1}>{t('Remedies.buycertifiedgemstones')}</Text>
                                {/* <Text style={styles.text2}>Starting From</Text>
                                <Text style={styles.text3}>₹ 1499</Text> */}
                            </View>
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>{t('Remedies.buynow')}</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('OnlinePujaList')} style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={image5Img}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >

                            <View style={styles.textView}>
                                <Text style={styles.text1}>{t('Remedies.onlinepuja')}</Text>
                                {/* <Text style={styles.text2}>Starting From</Text>
                                <Text style={styles.text3}>₹ 1499</Text> */}
                            </View>
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>{t('Remedies.booknow')}</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                </View>
                {/* <View style={styles.freeServiceView}>
                    <Image
                        source={freeServiceImg}
                        style={styles.serviceStyle}
                    />
                </View> */}
                {/* <View style={styles.categoryView}>
                    <ImageBackground
                        source={categoryImg}
                        style={styles.singleKnowmoreView}
                        imageStyle={styles.imageBackground}
                    >
                        <Image
                            source={kundliImg}
                            style={styles.icon}
                        />
                        <Text style={styles.iconText}>{t('home.kundli')}</Text>
                    </ImageBackground>
                    <ImageBackground
                        source={categoryImg}
                        style={styles.singleKnowmoreView}
                        imageStyle={styles.imageBackground}
                    >
                        <Image
                            source={matchmakingImg}
                            style={styles.icon}
                        />
                        <Text style={styles.iconText}>{t('home.matchmaking')}</Text>
                    </ImageBackground>
                    <Pressable onPress={()=> navigation.navigate('HoroscopeScreen')}>
                    <ImageBackground
                        source={categoryImg}
                        style={styles.singleKnowmoreView}
                        imageStyle={styles.imageBackground}
                    >
                        <Image
                            source={horo2Img}
                            style={styles.icon}
                        />
                        <Text style={styles.iconText}>{t('home.horoscope')}</Text>
                    </ImageBackground>
                    </Pressable>
                </View> */}
            </ScrollView>
        </SafeAreaView>
    )
}

export default withTranslation()(RemediesScreen)

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
        marginBottom: responsiveHeight(10),
        flexWrap: 'wrap'
    },
    singleCategoryView: {
        height: responsiveHeight(23),
        width: responsiveWidth(45),
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
        //width: responsiveWidth(38)
    },
    text1: {
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2.8),
        alignSelf:'center'
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
        backgroundColor: '#FB7401',
        height: 40,
        width: 100,
        borderRadius: 20,
        position: 'absolute',
        bottom: -responsiveHeight(2),
        right: 35,
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
});
