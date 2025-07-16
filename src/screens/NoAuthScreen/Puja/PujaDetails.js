import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Dimensions, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
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
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FastImage from '@d11/react-native-fast-image';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 350;
const { height, width } = Dimensions.get('screen')
const sliderWidth = Dimensions.get('window').width;
const paddingHorizontal = 10;
const itemWidth = sliderWidth - (2 * paddingHorizontal);

const PujaDetails = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [bannerData, setBannerData] = useState([])
    const [isFocus, setIsFocus] = useState(false);
    const [value, setValue] = useState('1');
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedDate, setSelectedDate] = useState('')

    const data = [
        { label: 'January', value: '1' },
        { label: 'February', value: '2' },
        { label: 'March', value: '3' },
        { label: 'April', value: '4' },
        { label: 'May', value: '5' },
        { label: 'June', value: '6' },
        { label: 'July', value: '7' },
        { label: 'August', value: '8' },
        { label: 'September', value: '9' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' },
    ];

    const getNextSevenDays = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(moment().add(i, 'days'));
        }
        return days;
    };

    const nextSevenDays = getNextSevenDays();
    const selectedDateChange = (index, day, date) => {
        console.log(index, day, date);
        setSelectedDay(index);
        setSelectedDate(date);
       // setIsLoading(true);

        // let givendate = '';
        // switch (day) {
        //     case 'Monday':
        //         givendate = 'monday';
        //         break;
        //     case 'Tuesday':
        //         givendate = 'tuesday';
        //         break;
        //     case 'Wednesday':
        //         givendate = 'wednessday';
        //         break;
        //     case 'Thursday':
        //         givendate = 'thursday';
        //         break;
        //     case 'Friday':
        //         givendate = 'friday';
        //         break;
        //     case 'Saturday':
        //         givendate = 'saturday';
        //         break;
        //     case 'Sunday':
        //         givendate = 'sunday';
        //         break;
        //     default:
        //         givendate = '';
        // }

        // const option = {
        //     "day": givendate,
        //     "date": date,
        //     "therapist_id": route?.params?.therapistId,
        //     "booking_type": route?.params?.mode
        // };
        // console.log(option);

        // AsyncStorage.getItem('userToken', (err, usertoken) => {
        //     axios.post(`${API_URL}/patient/therapist-date-slots`, option, {
        //         headers: {
        //             'Accept': 'application/json',
        //             "Authorization": 'Bearer ' + usertoken,
        //             //'Content-Type': 'multipart/form-data',
        //         },
        //     })
        //         .then(res => {
        //             console.log(JSON.stringify(res.data.data), 'fetch all therapist availability');
        //             if (res.data.response == true) {
        //                 const currentTime = moment();
        //                 const filteredData = res.data.data.filter(slot => {
        //                     const slotStartTime = moment(date + ' ' + slot.slot_start_time, 'YYYY-MM-DD HH:mm:ss');
        //                     return slotStartTime.isSameOrAfter(currentTime);
        //                 });
        //                 setTherapistAvailability(filteredData);
        //                 setIsLoading(false);
        //             } else {
        //                 console.log('not okk');
        //                 setIsLoading(false);
        //                 Alert.alert('Oops..', "Something went wrong", [
        //                     {
        //                         text: 'Cancel',
        //                         onPress: () => console.log('Cancel Pressed'),
        //                         style: 'cancel',
        //                     },
        //                     { text: 'OK', onPress: () => console.log('OK Pressed') },
        //                 ]);
        //             }
        //         })
        //         .catch(e => {
        //             setIsLoading(false);
        //             console.log(`Available slot error ${e}`);
        //             console.log(e.response);
        //             Alert.alert('Oops..', e.response?.data?.message, [
        //                 {
        //                     text: 'Cancel',
        //                     onPress: () => console.log('Cancel Pressed'),
        //                     style: 'cancel',
        //                 },
        //                 { text: 'OK', onPress: () => console.log('OK Pressed') },
        //             ]);
        //         });
        // });
    };

    const fetchBanner = () => {
        axios.get(`${API_URL}/patient/banners`, {
            headers: {
                "Content-Type": 'application/json'
            },
        })
            .then(res => {
                //console.log(res.data,'user details')
                let banner = res.data.data;
                console.log(banner, 'banner data')
                setBannerData(banner)
                banner.forEach(item => {
                    Image.prefetch(item.banner_image);
                });
                //setIsLoading(false);
            })
            .catch(e => {
                console.log(`fetch banner error ${e}`)
                console.log(e.response?.data?.message)
                setIsLoading(false);
            });
    }
    useEffect(() => {
        fetchBanner()
    }, [])

    const CarouselCardItem = ({ item, index }) => {
        //console.log(item, 'banner itemmm')
        {/* <View style={styles.textWrap}>
              {item?.banner_title && <Text style={styles.bannerText}>{item?.banner_title}</Text>}
              {item?.banner_description && <Text style={styles.bannerSubText} numberOfLines={4}>{item?.banner_description}</Text>}
              <View style={styles.bannerButtonView}>
                <Text style={styles.bannerButtonText}>Call Us Today!</Text>
              </View>
            </View> */}
        return (
            <View style={styles.bannerContainer}>
                <FastImage
                    //source={{ uri: item.banner_image }}
                    source={pujaImg}
                    //source={freebannerPlaceHolder}
                    //style={{ width: BannerWidth, height: BannerHeight }}
                    style={styles.bannerImage}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
        )
    }

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Details'} onPress={() => navigation.goBack()} title={'Details'} />
            <ScrollView style={styles.wrapper}>

                <View style={styles.carouselView}>
                    <Carousel
                        data={bannerData}
                        renderItem={CarouselCardItem}
                        showsPageIndicator={true}
                        pageSize={BannerWidth}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        autoplay={true}
                        autoplayTimeout={5000}
                        autoplayInterval={5000}
                        loop={true}
                        index={0}
                        //enableSnap={true}
                        onSnapToItem={(index) => setActiveSlide(index)}
                        activePageIndicatorStyle={{ backgroundColor: 'red' }}
                    />
                </View>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>About Astro Shivnash</Text>
                </View>
                <Text style={styles.sectionDesc}>Kal Sarp Puja is a powerful Hindu ritual performed to alleviate the negative effects of the Kal Sarp Dosh. This dosh occurs when all planets are positioned between Rahu and Ketu in a person's birth chart, often leading to various challenges and obstacles in life. The puja is conducted with specific rituals and mantras to appease Rahu and Ketu, seeking their blessings for harmony, prosperity, and well-being. By performing the Kal Sarp Puja, individuals can overcome difficulties, reduce the impact of the dosh, and invite positive energy and success into their lives.</Text>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>Benefits</Text>
                </View>
                <Text style={styles.sectionDesc}>Performing the Kal Sarp Puja can bring a multitude of benefits, including:</Text>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>Select Dates</Text>
                    <View style={{ width: responsiveWidth(32), }}>
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: '#E3E3E3' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            itemTextStyle={styles.selectedTextStyle}
                            data={data}
                            //search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'Select item' : '...'}
                            searchPlaceholder="Search..."
                            value={value}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setValue(item.value);
                                setIsFocus(false);
                            }}
                        />
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: responsiveWidth(2), }}>
                    <View style={styles.dateView}>
                        {nextSevenDays.map((day, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dayContainer,
                                    selectedDay === index ? styles.selectedDay : styles.defaultDay,
                                ]}
                                onPress={() => selectedDateChange(index, day.format('dddd'), day.format('YYYY-MM-DD'))}
                            >
                                <Text style={styles.weekDay}>
                                    {day.format('ddd')}
                                </Text>
                                <Text style={styles.date}>
                                    {day.format('D')}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </ScrollView>
            <View style={{ width: responsiveWidth(92), alignSelf: 'center' }}>
                <CustomButton label={"Book Now"}
                    // onPress={() => { login() }}
                    onPress={() => { navigation.navigate('ChooseAstologerList') }}
                />
            </View>
        </SafeAreaView >
    )
}

export default PujaDetails

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {
        marginBottom: responsiveHeight(1)
    },
    carouselView: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        marginTop: responsiveHeight(1)
    },
    bannerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: BannerHeight,
        //backgroundColor: 'red',
        overflow: 'hidden',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
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
    dropdown: {
        height: responsiveHeight(4),
        borderColor: '#E3E3E3',
        borderWidth: 0.7,
        borderRadius: 8,
        paddingHorizontal: 8,

    },
    placeholderStyle: {
        fontSize: 16,
        color: '#746868',
        fontFamily: 'DMSans-Regular'
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#746868',
        fontFamily: 'DMSans-Regular'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: '#746868',
        fontFamily: 'DMSans-Regular'
    },
    imageStyle: {
        height: 20,
        width: 20,
        resizeMode: 'contain'
    },
     //date loop
     dateView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dayContainer: {
        height: responsiveHeight(10),
        width: responsiveWidth(14),
        borderRadius: 30,
        marginRight: responsiveWidth(3),
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    selectedDay: {
        backgroundColor: '#FEF3E5',
        borderColor: '#ECCEA8',
        borderWidth: 1,
    },
    defaultDay: {
        backgroundColor: '#F2F2F2',
        borderColor: '#F2F2F2',
        borderWidth: 1
    },
    weekDay: {
        color: '#746868',
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'DMSans-Regular',
    },
    date: {
        color: '#2D2D2D',
        fontSize: responsiveFontSize(2.3),
        fontFamily: 'DMSans-Bold',
    },
});
