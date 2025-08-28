import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Alert, Platform } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { TextInput, LongPressGestureHandler, State } from 'react-native-gesture-handler'
import { API_URL } from '@env'
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '../../../utils/Loader';
import moment from "moment"
import StarRating from 'react-native-star-rating-widget';
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import Toast from 'react-native-toast-message';
import { userPhoto } from '../../../utils/Images';
import RadioGroup from 'react-native-radio-buttons-group';
import { withTranslation, useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'
const ReviewScreen = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [walletHistory, setWalletHistory] = React.useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [starCount, setStarCount] = useState(5)
    const [address, setaddress] = useState('');
    const [addressError, setaddressError] = useState('')
    const [astrologerId, setAstrologerId] = useState(route?.params?.astrologerId)
    const [radioButtons, setRadioButtons] = useState([]);

    const [selectedId, setSelectedId] = useState();

    useEffect(() => {
        fetchFeedback()
    }, [])

    const fetchFeedback = () => {
        AsyncStorage.getItem('userToken', async(err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.get(`${API_URL}/user/feedback-string`, {
                headers: {
                    Accept: 'application/json',
                    "Authorization": `Bearer ${usertoken}`,
                    "Accept-Language": savedLang || 'en',
                },
            })
                .then(res => {
                    console.log(res.data)
                    if (res.data.response == true) {
                        const feedbackData = res.data.data.map(item => ({
                            id: item.id.toString(),
                            label: item.feedback_name,
                            value: item.feedback_name
                        }));

                        // Update the radioButtons state with the transformed data
                        setRadioButtons(feedbackData);
                        setIsLoading(false);

                    } else {
                        console.log('not okk')
                        setIsLoading(false)
                        Alert.alert('Oops..', "Something went wrong", [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ]);
                    }
                })
                .catch(e => {
                    setIsLoading(false)
                    console.log(`user register error ${e}`)
                    console.log(e.response)
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

    const submitForm = () => {
        if (selectedId == undefined) {
            Toast.show({
                type: 'error',
                text1: 'Hello',
                text2: "Please choose some review",
                position: 'top',
                topOffset: Platform.OS == 'ios' ? 55 : 20
            });
        } else {
            const option = {
                "astrologer_id": astrologerId,
                "session_id": route?.params?.sessionId,
                "feedback": address,
                "rating": starCount,
                "customer_feedback_id": selectedId
            }
        
            setIsLoading(true)
            AsyncStorage.getItem('userToken', async(err, usertoken) => {
                const savedLang = await AsyncStorage.getItem('selectedLanguage');
                axios.post(`${API_URL}/user/add-customer-feedback-form`, option, {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${usertoken}`,
                        "Accept-Language": savedLang || 'en',
                    },
                })
                    .then(res => {
                        console.log(res.data)
                        if (res.data.response == true) {
                            setIsLoading(false)
                            Toast.show({
                                type: 'success',
                                text1: 'Hello',
                                text2: "Upload data Successfully",
                                position: 'top',
                                topOffset: Platform.OS == 'ios' ? 55 : 20
                            });
                            navigation.navigate('Home')
                        } else {
                            console.log('not okk')
                            setIsLoading(false)
                            Alert.alert('Oops..', "Something went wrong", [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                },
                                { text: 'OK', onPress: () => console.log('OK Pressed') },
                            ]);
                        }
                    })
                    .catch(e => {
                        setIsLoading(false)
                        console.log(`user register error ${e}`)
                        console.log(e.response)
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

    }

    if (isLoading) {
        return (
            <Loader />
        )
    }



    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Write Review'} onPress={() => navigation.goBack()} title={t('review.WriteReview')} />
            <ScrollView style={styles.wrapper}>
                <View style={{ marginBottom: responsiveHeight(5), alignSelf: 'center', marginTop: responsiveHeight(2) }}>
                    <View style={styles.totalValue}>

                        {route?.params?.astrologerPic ?
                            <Image
                                source={{ uri: route?.params?.astrologerPic }}
                                style={{ height: 90, width: 90, borderRadius: 90 / 2, resizeMode: 'contain' }}
                            /> :
                            <Image
                                source={userPhoto}
                                style={{ height: 90, width: 90, borderRadius: 90 / 2, resizeMode: 'contain' }}
                            />}
                    </View>
                    <Text style={{ fontSize: responsiveFontSize(2), color: '#746868', fontFamily: 'PlusJakartaSans-Regular', textAlign: 'center', marginTop: responsiveHeight(2), marginBottom: responsiveHeight(5) }}>How was your experience with {route?.params?.astrologerName}?</Text>
                    <View style={{ alignSelf: 'center', width: responsiveWidth(70), marginTop: responsiveHeight(2) }}>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={starCount}
                            onChange={(rating) => setStarCount(rating)}
                            fullStarColor={'#FB7401'}
                            starSize={25}
                            starStyle={styles.eachStar}
                        />
                    </View>
                    <View style={styles.flexView}>
                        <Text style={styles.flexText}>{t('review.VeryBad')}</Text>
                        <Text style={styles.flexText}>{t('review.Excellent')}</Text>
                    </View>
                    <Text style={styles.headerText}>{t('review.FeedbackForm')}</Text>
                    <View style={styles.radioContainer}>
                        <RadioGroup
                            radioButtons={radioButtons}
                            onPress={setSelectedId}
                            selectedId={selectedId}
                            layout='row'
                            containerStyle={{ flexWrap: 'wrap' }}
                            labelStyle={styles.flexText}
                        />
                    </View>
                    <View style={{ marginTop: responsiveHeight(1) }}>
                        <InputField
                            label={t('review.Tellusaboutyourexperience')}
                            keyboardType="default"
                            value={address}
                            helperText={addressError}
                            inputType={'address'}
                            inputFieldType={'address'}
                            onChangeText={(text) => {
                                setaddress(text)
                            }}
                        />
                    </View>
                    <View style={styles.buttonwrapper}>
                        <CustomButton label={t('review.SubmitReview')}
                            onPress={() => submitForm()}
                        />
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Text style={{ fontSize: responsiveFontSize(1.7), color: '#808080', fontFamily: 'PlusJakartaSans-Regular', textAlign: 'center', }}>{t('review.Skip')}</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default withTranslation()(ReviewScreen)

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {
        padding: responsiveWidth(2),

    },
    totalValue: {
        width: responsiveWidth(89),
        //height: responsiveHeight(25),
        alignItems: 'center',
        //backgroundColor: '#F4F5F5',
        //justifyContent: 'center',
        padding: 20,
        borderRadius: 15
    },
    flexView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: responsiveWidth(72),
        alignSelf: 'center',
        marginVertical: responsiveHeight(2)
    },
    flexText: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.5),
    },
    eachStar: {
        marginHorizontal: responsiveWidth(1),
        backgroundColor: '#FEF3E5',
        padding: 10,
        borderRadius: 5,
        color: '#FB7401'
    },
    headerText: {
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
        marginBottom: responsiveHeight(2)
    },
    radioContainer: {
        width: responsiveWidth(90),
    },
});
