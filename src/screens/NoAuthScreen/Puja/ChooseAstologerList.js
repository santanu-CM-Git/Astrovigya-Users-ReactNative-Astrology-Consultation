import React, { useState, useMemo, useEffect, useCallback, useRef, memo } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, StatusBar, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert, Platform } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, chatColor, checkedImg, filterImg, phoneColor, starImg, uncheckedImg, userPhoto } from '../../../utils/Images'
import { API_URL } from '@env'
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '../../../utils/Loader';
import moment from "moment"
import { withTranslation, useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';


const ChooseAstologerList = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(true)
    const [astrologerList, setAstrologerList] = useState([])

    const fetchAstrologerList = () => {
        console.log(route?.params?.date);
        console.log(route?.params?.pujaid);
        const option = {
            "puja_id": route?.params?.pujaid,
            "date": route?.params?.date
        };
        console.log(option);

        AsyncStorage.getItem('userToken', async(err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.post(`${API_URL}/user/puja-astrologer`, option, {
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
                        setAstrologerList(res.data.data)
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
        fetchAstrologerList()
    }, [])

    const NewAstrologerListItem = memo(({ item }) => (
        <Pressable onPress={() => navigation.navigate('PujaSummary',{ astroDetails: item, pujaDetails: route?.params?.pujaDetails,pujaDate: route?.params?.date})}>
            <View style={styles.totalValue}>
                <View style={styles.totalValue1stSection}>
                    <View style={styles.profilePicSection}>
                        {item?.astrologer_details?.profile_pic ?
                            <Image
                                source={{ uri: item?.astrologer_details?.profile_pic }}
                                style={styles.profilePicStyle}
                            /> :
                            <Image
                                source={userPhoto}
                                style={styles.profilePicStyle}
                            />
                        }
                        <View style={styles.rateingView}>
                            <Text style={styles.ratingText}>{item?.astrologer_details?.rating}</Text>
                            <Image
                                source={starImg}
                                style={styles.staricon}
                            />
                        </View>
                    </View>
                    <View style={styles.contentStyle}>
                        <Text style={styles.contentStyleName}>{item?.astrologer_details?.display_name}</Text>
                        <Text style={styles.contentStyleQualification}>{item?.astrologer_details?.astrologer_specialization?.map(spec => spec.specializations_name).join(', ')}</Text>
                        <Text style={styles.contentStyleLangValue}>{item?.astrologer_details?.astrologer_language?.map(lang => lang.language).join(', ')}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: responsiveWidth(55) }}>
                            <Text style={styles.contentStyleExp}>Exp : {item?.astrologer_details?.year_of_experience} Years</Text>
                            {/* <View style={styles.verticleLine}></View>
                            <Text style={styles.contentStyleExp}> {moment(item.st, 'HH:mm:ss').format('hh:mm A')} - {moment(item.et, 'HH:mm:ss').format('hh:mm A')}</Text> */}
                        </View>
                        <Text style={styles.contentStyleExp}> {moment(item.st, 'HH:mm:ss').format('hh:mm A')} - {moment(item.et, 'HH:mm:ss').format('hh:mm A')}</Text>
                    </View>
                </View>

                <View style={styles.listButtonSecondSection}>
                    <Text style={[styles.contentStyleRate, { marginRight: 5 }]}>₹ {item?.rate_price}</Text>
                    <TouchableOpacity onPress={()=> navigation.navigate('PujaSummary',{ astroDetails: item, pujaDetails: route?.params?.pujaDetails,pujaDate: route?.params?.date}) }>
                    <View style={[styles.iconView, { backgroundColor: '#EFFFF3', borderColor: '#1CAB04' }]}>
                        <Text style={styles.buttonText}>Select</Text>
                    </View>
                    </TouchableOpacity>
                </View>

            </View>
        </Pressable>
    ))

    const renderNewAstrologerItem = ({ item }) => <NewAstrologerListItem item={item} />;

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Choose an astrologer'} onPress={() => navigation.goBack()} title={t('pujaastrolist.Chooseanastrologer')} />
            <ScrollView style={styles.wrapper}>
                <View style={styles.topAstrologerSection}>
                    {astrologerList.length != '0'?
                    <FlatList
                        data={astrologerList}
                        renderItem={renderNewAstrologerItem}
                        keyExtractor={(item) => item.id.toString()}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        initialNumToRender={10}
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        getItemLayout={(astrologerList, index) => (
                            { length: 50, offset: 50 * index, index }
                        )}
                    />
                    :
                    <Text style={{fontSize: responsiveFontSize(1.7),
                        color: '#746868',
                        fontFamily: 'PlusJakartaSans-Bold',textAlign:'center'}}>{t('pujaastrolist.NoAstrologersavailableforpuja')}</Text>
}
                </View>

            </ScrollView>
        </SafeAreaView >
    )
}

export default withTranslation()(ChooseAstologerList)

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {

    },
    topAstrologerSection: {
        marginHorizontal: 13,
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
       ...Platform.select({
             android: {
               elevation: 5, // Only for Android
             },
             ios: {
               shadowColor: '#000', // Only for iOS
               shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 0.3,
               shadowRadius: 5,
             },
           }),
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
        //textDecorationLine: 'line-through', textDecorationStyle: 'solid'
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
});
