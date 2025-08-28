import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { aquariusImg, ariesImg, bookmarkedFill, bookmarkedNotFill, cameraColor, cancerImg, capriconImg, categoryImg, chatColor, checkedImg, filterImg, freeServiceImg, geminiImg, horo2Img, image1Img, image2Img, image3Img, image4Img, image5Img, kundliImg, leoImg, libraImg, matchmakingImg, phoneColor, piscesImg, sagittariusImg, scorpioImg, starImg, taurasImg, uncheckedImg, userPhoto, virgoImg } from '../../../utils/Images'
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
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context'


const HoroscopeScreen = ({ route }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false)


    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Horoscope'} onPress={() => navigation.goBack()} title={'Horoscope'} />
            <ScrollView style={styles.wrapper}>
                <LinearGradient
                    colors={['#FDEEDA', '#FEF7EF']} // Example colors, replace with your desired gradient
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.headingSection}
                >
                    <Text style={styles.headerText}>Choose Your Zodiac Sign</Text>
                </LinearGradient>
                <View style={styles.flexrowView}>
                    <Pressable onPress={() => navigation.navigate('HoroscopeDetails')} style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={ariesImg}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>Aries</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                    <Pressable style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={taurasImg}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>Tauras</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                    <Pressable style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={geminiImg}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>Gemini</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                    <Pressable style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={cancerImg}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>Cancer</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                    <Pressable style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={leoImg}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>Leo</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                    <Pressable style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={virgoImg}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>Virgo</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                    <Pressable style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={libraImg}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>Libra</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                    <Pressable style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={scorpioImg}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>Scorpio</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                    <Pressable style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={sagittariusImg}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>Sagittarius</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                    <Pressable style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={capriconImg}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>Capricorn</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                    <Pressable style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={aquariusImg}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>Aquarius</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                    <Pressable style={{ marginBottom: responsiveHeight(4) }}>
                        <ImageBackground
                            source={piscesImg}
                            style={styles.singleCategoryView}
                            imageStyle={styles.imageBackground}
                        >
                            <View style={styles.flotingButton}>
                                <Text style={styles.flotingButtonText}>Pisces</Text>
                            </View>
                        </ImageBackground>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HoroscopeScreen

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
        resizeMode: 'cover'
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
        justifyContent:'center',
        alignItems:'center'
    },
    headerText:{
        color: '#894F00',
        fontFamily: 'PlusJakartaSans-SeniBold',
        fontSize: responsiveFontSize(2),
    }
});
