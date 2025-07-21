import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, StatusBar, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Alert, Platform } from 'react-native'
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
import { withTranslation, useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const items = [
    { id: 1, icon: chatColor },
    { id: 2, icon: phoneColor },
    { id: 3, icon: cameraColor },
];
const AstrologerProfile = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false)
    const [profileDetails, setProfileDetails] = useState([])
    const [userInfo, setUserInfo] = useState([])
    const [customarFeedback, setCustomarFeedback] = useState([])
    //pagination
    const [hasMore, setHasMore] = useState(true);
    const [perPage, setPerPage] = useState(10);
    const [pageno, setPageno] = useState(1);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     const { astrologerId } = route.params;
    //     fetchUserData()
    //     fetchAstrologerData(astrologerId)
    // }, [route.params])

    useEffect(() => {
        const fetchData = async () => {

            try {
                const { astrologerId } = route.params;
                await fetchUserData();         // Call fetchUserData first
                await fetchAstrologerData(astrologerId);    // Finally fetchNewAstrologer
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [route.params]);

    useEffect(() => {
        fetchCustomerReview(pageno);
    }, [fetchCustomerReview, pageno]);

    const fetchUserData = async () => {
        AsyncStorage.getItem('userToken', async(err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            setIsLoading(true);
            axios.get(`${API_URL}/user/personal-information`, {
                headers: {
                    "Authorization": `Bearer ${usertoken}`,
                    "Content-Type": 'application/json',
                    "Accept-Language": savedLang || 'en',
                },
            })
                .then(res => {
                    //console.log(res.data,'user details')
                    let userInfo = res.data.data;
                    console.log(userInfo, 'userInfo from astrologerprofile')
                    setUserInfo(userInfo)

                })
                .catch(e => {
                    console.log(`Login error ${e}`)
                    console.log(e.response?.data?.message)
                });
        });
    }

    const fetchAstrologerData = async (astrologerId) => {
        setIsLoading(true);
        AsyncStorage.getItem('userToken', async(err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.get(`${API_URL}/user/astrologers-details/${astrologerId}`, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en',
                    //'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    console.log(JSON.stringify(res.data.data), 'response from astrologer details data')
                    if (res.data.response == true) {
                        setProfileDetails(res.data.data)
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
                    console.log(`fetch therapist data error ${e}`)
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

    const fetchCustomerReview = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                console.log('No user token found');
                setIsLoading(false);
                return;
            }
            const option = {
                "astrologer_id": route?.params?.astrologerId
            }
            const response = await axios.post(`${API_URL}/user/customer-reviews`, option, {
                params: {
                    page,
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                    "Accept-Language": savedLang || 'en',
                },
            });

            const responseData = response.data.data.data;
            console.log(responseData, 'customer feedback')
            setCustomarFeedback(prevData => page === 1 ? responseData : [...prevData, ...responseData]);
            if (responseData.length === 0) {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            console.log(`Fetch customer feedback error: ${error}`);
            let myerror = error.response?.data?.message;
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                { text: 'OK', onPress: () => myerror == 'Unauthorized' ? logout() : console.log('OK Pressed') },
            ]);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    }, []);

    const submitForm = (commingFrom) => {
        if (commingFrom === "from_chat") {
            navigation.navigate('BirthDetailsScreen', { astrologerDetails: profileDetails, astrologerId: route?.params?.astrologerId, comingFrom: "from_chat" });
            //beforeSessionCheckAPI('from_chat')
        } else {
            //beforeSessionCheckAPI('from_call')
            //navigation.navigate('ChatScreen', { commingFrom: "from_call" })
            navigation.navigate('BirthDetailsScreen', { astrologerDetails: profileDetails, astrologerId: route?.params?.astrologerId, comingFrom: "from_call" });
        }

    }

    const renderCustomerReview = ({ item }) => (
        <View style={styles.totalValue}>
            <View style={{ flexDirection: 'row', padding: 5 }}>
                {item?.user_name?.profile_pic ?
                    <Image
                        source={{ uri: item?.user_name?.profile_pic }}
                        style={styles.reviewImg}
                    /> :
                    <Image
                        source={userPhoto}
                        style={styles.reviewImg}
                    />
                }
                <View style={styles.reviewSec}>
                    <Text style={styles.reviewName}>{item?.user_name?.full_name}</Text>
                    <View style={styles.ratingView}>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={item?.rating}
                            onChange={(rating) => setStarCount(rating)}
                            fullStarColor={'#FFCB45'}
                            starSize={14}
                            starStyle={{ marginHorizontal: responsiveWidth(0.5) }}
                        />
                    </View>
                    <Text style={styles.reviewContain}>{item?.customer_feedback?.feedback_name}</Text>
                </View>
                <Text style={styles.reviewContain}>{moment(item?.customer_feedback?.created_at).format('MMM DD, YYYY')}</Text>
            </View>
        </View>
    );

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPageno(prevPage => prevPage + 1);
        }
    };

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.loaderContainer}>
                <Loader />
            </View>
        );
    };
    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Profile'} onPress={() => navigation.goBack()} title={t('astrologerprofile.profile')} />
            <ScrollView style={styles.wrapper}>
                <View style={styles.topAstrologerSection}>
                    <View style={styles.totalValue}>
                        <View style={styles.totalValue1stSection}>
                            <View style={styles.profilePicSection}>
                                {profileDetails?.profile_pic ?
                                    <Image
                                        source={{ uri: profileDetails?.profile_pic }}
                                        style={styles.profilePicStyle}
                                    /> :
                                    <Image
                                        source={userPhoto}
                                        style={styles.profilePicStyle}
                                    />
                                }
                            </View>
                            <View style={styles.contentStyle}>
                                <Text style={styles.contentStyleName}>{profileDetails?.full_name}</Text>
                                <Text style={styles.contentStyleQualification}>{profileDetails?.astrologer_specialization?.map(spec => spec.specializations_name).join(', ')}</Text>
                                <Text style={styles.contentStyleLangValue}>{profileDetails?.astrologer_language?.map(lang => lang.language).join(', ')}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {userInfo?.user_free_min?.free_min > 0 && (
                                        <>
                                            <Text style={[
                                                styles.contentStyleRate,
                                                {
                                                    marginRight: 5,
                                                    textDecorationLine: 'line-through', // Strikethrough when free_min is 0
                                                    textDecorationStyle: 'solid',
                                                }
                                            ]}>
                                                ₹ {profileDetails?.rate_price}/Min
                                            </Text>
                                            <Text style={styles.contentStyleRateFree}>Free</Text>
                                        </>
                                    )}

                                    {userInfo?.user_free_min?.free_min === 0 && (
                                        <Text style={styles.contentStyleRate}>
                                            ₹ {profileDetails?.rate_price}/Min
                                        </Text>
                                    )}
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
                                    <Text style={styles.ratingText}>{profileDetails?.customer_rating}</Text>

                                </View>
                                <Text style={styles.ratingText2}>{profileDetails?.total_customer_rating_count} {t('astrologerprofile.Ratings')}</Text>
                            </View>
                            <View style={styles.verticleLine}></View>
                            <View style={styles.totalValue2ndflexColumn}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={expImg}
                                        style={styles.staricon}
                                        tintColor={'#FB7401'}
                                    />
                                    <Text style={styles.ratingText}>{profileDetails?.year_of_experience} Years</Text>

                                </View>
                                <Text style={styles.ratingText2}>{t('astrologerprofile.Experience')}</Text>
                            </View>
                            <View style={styles.verticleLine}></View>
                            <View style={styles.totalValue2ndflexColumn}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={likeImg}
                                        style={styles.staricon}
                                        tintColor={'#FB7401'}
                                    />
                                    <Text style={styles.ratingText}>0 +</Text>

                                </View>
                                <Text style={styles.ratingText2}>{t('astrologerprofile.Consultation')}</Text>
                            </View>
                        </View>
                    </View>

                </View>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>{t('astrologerprofile.About')} {profileDetails?.full_name}</Text>
                </View>
                <Text style={styles.sectionDesc}>{profileDetails?.short_bio}</Text>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>{t('astrologerprofile.Specialization')}</Text>
                </View>
                <View style={styles.specializationView}>
                    {profileDetails?.astrologer_specialization?.map((spec, index) => (
                        <View key={index} style={styles.singleTagview}>
                            <Text style={styles.singleTagText}>{spec.specializations_name}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>{t('astrologerprofile.Certifications')}</Text>
                </View>
                <Text style={styles.sectionDesc}>{profileDetails?.astrologer_certification?.map(certi => certi.certification_name).join(', ')}</Text>
                <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>{t('astrologerprofile.customerreviews')}</Text>
                </View>
                <View style={styles.topAstrologerSection}>
                    {customarFeedback.length > 0 ?
                        <FlatList
                            data={customarFeedback}
                            renderItem={renderCustomerReview}
                            keyExtractor={(item) => item.id?.toString()}
                            maxToRenderPerBatch={10}
                            windowSize={5}
                            initialNumToRender={10}
                            showsVerticalScrollIndicator={false}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={renderFooter}
                            getItemLayout={(customarFeedback, index) => (
                                { length: 50, offset: 50 * index, index }
                            )}
                        /> :
                        <Text style={{
                            color: '#894F00',
                            fontFamily: 'PlusJakartaSans-Bold',
                            fontSize: responsiveFontSize(1.7), textAlign: 'left'
                        }}>{t('astrologerprofile.Noreviewyet')}</Text>
                    }
                </View>
            </ScrollView>
            <View style={styles.buttonWrapper}>
                {profileDetails?.chat_consultancy == '1' && profileDetails?.call_consultancy == '1' ? (
                    <>
                        {/* Chat Button */}
                        <View style={{ width: responsiveWidth(45), alignSelf: 'center' }}>
                            <CustomButton
                                label={t('astrologerprofile.chatnow')}
                                onPress={() => { submitForm("from_chat") }}
                                buttonIconForwordChat={true}
                            />
                        </View>
                        {/* Call Button */}
                        <View style={{ width: responsiveWidth(45), alignSelf: 'center' }}>
                            <CustomButton
                                label={t('astrologerprofile.callnow')}
                                onPress={() => { submitForm("from_call") }}
                                buttonIconForwordCall={true}
                            />
                        </View>
                    </>
                ) : profileDetails?.chat_consultancy == '1' ? (
                    <View style={{ width: responsiveWidth(92), alignSelf: 'center' }}>
                        <CustomButton
                            label={t('astrologerprofile.chatnow')}
                            onPress={() => { submitForm("from_chat") }}
                            buttonIconForwordChat={true}
                        />
                    </View>
                ) : profileDetails?.call_consultancy == '1' ? (
                    <View style={{ width: responsiveWidth(92), alignSelf: 'center' }}>
                        <CustomButton
                            label={t('astrologerprofile.callnow')}
                            onPress={() => { submitForm("from_call") }}
                            buttonIconForwordCall={true}
                        />
                    </View>
                ) : null}
            </View>

        </SafeAreaView >
    )
}

export default withTranslation()(AstrologerProfile)

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
        width: responsiveWidth(91),
        //height: responsiveHeight(36),
        //alignItems: 'center',
        backgroundColor: '#fff',
        //justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
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
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
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
