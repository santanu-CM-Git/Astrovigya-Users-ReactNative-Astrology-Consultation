import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Dimensions, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
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
import RenderHTML from 'react-native-render-html';
import { Dropdown } from 'react-native-element-dropdown';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FastImage from '@d11/react-native-fast-image';
import { withTranslation, useTranslation } from 'react-i18next';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 350;
const { height, width } = Dimensions.get('screen')
const sliderWidth = Dimensions.get('window').width;
const paddingHorizontal = 10;
const itemWidth = sliderWidth - (2 * paddingHorizontal);

const PujaDetails = ({ route }) => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
const { t, i18n } = useTranslation();

    const [isLoading, setIsLoading] = useState(false)
    const [bannerData, setBannerData] = useState([])
    const [pujaDetails, setPujaDetails] = useState([])
    const [pujaDate, setPujaDate] = useState([])
    const [isFocus, setIsFocus] = useState(false);
    const [value, setValue] = useState('January');
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedDate, setSelectedDate] = useState('')
    const [activeSlide, setActiveSlide] = React.useState(0);

    const data = [
        { label: 'January', value: 'January' },
        { label: 'February', value: 'February' },
        { label: 'March', value: 'March' },
        { label: 'April', value: 'April' },
        { label: 'May', value: 'May' },
        { label: 'June', value: 'June' },
        { label: 'July', value: 'July' },
        { label: 'August', value: 'August' },
        { label: 'September', value: 'September' },
        { label: 'October', value: 'October' },
        { label: 'November', value: 'November' },
        { label: 'December', value: 'December' },
    ];

    const selectedDateChange = (index, day, date) => {
        console.log(index, day, date);
        setSelectedDay(index);
        setSelectedDate(date);
    };

    const fetchPujaDate = (paramData) => {
        console.log(paramData, 'paramDataparamDataparamData');

        const currentYear = moment().year(); // Get the current year
        const currentMonth = paramData ? paramData : moment().format('MMMM');
        // Get start and end of the specified month
        const currentMonthStart = moment(`${currentMonth} ${currentYear}`, 'MMMM YYYY').startOf('month').format('YYYY-MM-DD');
        const currentMonthEnd = moment(`${currentMonth} ${currentYear}`, 'MMMM YYYY').endOf('month').format('YYYY-MM-DD');
        console.log('Start Date:', currentMonthStart);
        console.log('End Date:', currentMonthEnd);

        const option = {
            "puja_id": route?.params?.pujaDetails.id,
            "start_date": currentMonthStart,
            "end_date": currentMonthEnd
        };
        console.log(option);

        AsyncStorage.getItem('userToken', async(err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.post(`${API_URL}/user/puja-dates`, option, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en',
                    //'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    console.log(JSON.stringify(res.data), 'fetch all puja date');
                    if (res.data.response == true) {
                        setPujaDate(res.data.message)
                        setIsLoading(false);
                    } else {
                        console.log('not okk');
                        setIsLoading(false);
                        Alert.alert('Oops..', res.data.message, [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ]);
                    }
                })
                .catch(e => {
                    setIsLoading(false);
                    console.log(`Available slot error ${e}`);
                    console.log(e.response);
                    Alert.alert('Oops..', e.response?.data?.message, [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                });
        });
    }

    useEffect(() => {
        const imageData = route?.params?.pujaDetails;
        const currentMonth = moment().format('MMMM');
        setPujaDetails(imageData)
        setBannerData(imageData.images)
        console.log(route?.params?.pujaDetails, "sfsfs");
        setValue(currentMonth)
        fetchPujaDate()

    }, [])

    const CarouselCardItem = ({ item, index }) => {
        console.log(item, 'banner itemmm')
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
                    source={{ uri: item }}
                    //source={freebannerPlaceHolder}
                    //style={{ width: BannerWidth, height: BannerHeight }}
                    style={styles.bannerImage}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
        )
    }

    const booknow = () => {

        if (selectedDate.length === 0) {
            Alert.alert('Oops..', 'You need to select at least one Date.', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        } else {
            console.log(selectedDate);
            console.log(route?.params?.pujaDetails.id)
            navigation.navigate('ChooseAstologerList',{ date: selectedDate, pujaid: route?.params?.pujaDetails.id, pujaDetails: route?.params?.pujaDetails})
        }

    }

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Details'} onPress={() => navigation.goBack()} title={t('pujadetails.Details')} />
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
                    <Text style={styles.sectionHeaderText}>{pujaDetails?.name}</Text>
                </View>
                {/* <Text style={styles.sectionDesc}>{pujaDetails?.description}</Text> */}
                <View style={{ paddingHorizontal: 20 }}>
                    <RenderHTML
                        contentWidth={width}
                        source={{ html: pujaDetails?.about || '' }}
                        baseStyle={{
                            color: '#8B939D', // Change text color
                            fontSize: responsiveFontSize(1.7),  // Optional: Set font size
                            fontFamily:'PlusJakartaSans-Regular'
                          }}
                    />
                </View>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>{t('pujadetails.About')} {pujaDetails?.name}</Text>
                </View>
                {/* <Text style={styles.sectionDesc}>{pujaDetails?.about}</Text> */}
                <View style={{ paddingHorizontal: 20 }}>
                    <RenderHTML
                        contentWidth={width}
                        source={{ html: pujaDetails?.about || '' }}
                        baseStyle={{
                            color: '#8B939D', // Change text color
                            fontSize: responsiveFontSize(1.7),  // Optional: Set font size
                            fontFamily:'PlusJakartaSans-Regular'
                          }}
                    />
                </View>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>{t('pujadetails.Benefits')}</Text>
                </View>
                {/* <Text style={styles.sectionDesc}>{pujaDetails?.benefits}</Text> */}
                <View style={{ paddingHorizontal: 20 }}>
                    <RenderHTML
                        contentWidth={width}
                        source={{ html: pujaDetails?.benefits || '' }}
                        baseStyle={{
                            color: '#8B939D', // Change text color
                            fontSize: responsiveFontSize(1.7),  // Optional: Set font size
                            fontFamily:'PlusJakartaSans-Regular'
                          }}
                    />
                </View>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>{t('pujadetails.SelectDates')}</Text>
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
                                fetchPujaDate(item.value)
                                setIsFocus(false);
                            }}
                        />
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: responsiveWidth(2), }}>
                    <View style={styles.dateView}>
                        {/* {pujaDate.map((day, index) => (
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
                        ))} */}
                        {pujaDate && pujaDate.length > 0 ? (
                            pujaDate.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.dayContainer,
                                        selectedDay === index ? styles.selectedDay : styles.defaultDay,
                                    ]}
                                    onPress={() => selectedDateChange(index, moment(item.date).format('dddd'), item.date)}
                                >
                                    {/* Format the date */}
                                    <Text style={styles.weekDay}>
                                        {moment(item.date).format('ddd')} {/* e.g., Mon */}
                                    </Text>
                                    <Text style={styles.date}>
                                        {moment(item.date).format('D')} {/* e.g., 25 */}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.noDateText}>{t('pujadetails.Nodateisavailable')}</Text>
                        )}
                    </View>
                </ScrollView>
            </ScrollView>
            <View style={{ width: responsiveWidth(92), alignSelf: 'center' }}>
                <CustomButton label={t('pujadetails.BookNow')}
                    onPress={() => { booknow() }}
                //onPress={() => { navigation.navigate('ChooseAstologerList') }}
                />
            </View>
        </SafeAreaView >
    )
}

export default withTranslation()(PujaDetails)

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
        fontFamily: 'PlusJakartaSans-Regular'
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Regular'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Regular'
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
        //width: responsiveWidth(14),
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
        fontFamily: 'PlusJakartaSans-Regular',
    },
    date: {
        color: '#2D2D2D',
        fontSize: responsiveFontSize(2.3),
        fontFamily: 'PlusJakartaSans-Bold',
    },
    noDateText: {
        color: '#746868',
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'PlusJakartaSans-Bold',
        alignItems: 'center',
        textAlign: 'center',
        paddingHorizontal: 20
    }
});
