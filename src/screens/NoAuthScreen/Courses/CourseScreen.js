import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Linking, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
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
import { SafeAreaView } from 'react-native-safe-area-context'

const CourseScreen = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false)
    const [courseData, setCourseData] = useState([])

    //pagination
    const [hasMore, setHasMore] = useState(true);
    const [perPage, setPerPage] = useState(10);
    const [pageno, setPageno] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllCourse(pageno);
    }, [fetchAllCourse, pageno]);

    useFocusEffect(
        useCallback(() => {
            setPageno(1);
            setHasMore(true); // Reset hasMore on focus
            fetchAllCourse(1);
        }, [fetchAllCourse])
    );

    const fetchAllCourse = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                console.log('No user token found');
                setIsLoading(false);
                return;
            }
            const response = await axios.get(`${API_URL}/user/course`, {
                params: {
                    page
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                    "Accept-Language": savedLang || 'en',
                },
            });

            const responseData = response.data.data.data;
            console.log(responseData, 'course')
            setCourseData(prevData => page === 1 ? responseData : [...prevData, ...responseData]);
            if (responseData.length === 0) {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            console.log(`Fetch course error: ${error}`);
            let myerror = error.response?.data?.message;
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                { text: 'OK', onPress: () => myerror == 'Unauthorized' ? logout() : console.log('OK Pressed') },
            ]);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    }, []);

    const handlePress = (url) => {
        if (url) {
            Linking.openURL(url)
                .catch(err => console.error("Failed to open URL:", err));
        } else {
            console.log("No URL available");
        }
    };

    const renderCourse = ({ item }) => (
        <TouchableOpacity
            style={styles.singleItemView}
            onPress={() => handlePress(item?.video_link)}
        >
            {item?.thumbnail ?
                <Image
                    source={{ uri: item?.thumbnail }}
                    style={styles.imageStyle}
                /> :
                <Image
                    source={courseImg}
                    style={styles.imageStyle}
                />
            }
            <View style={styles.courseContain}>
                <Text style={styles.courseTitle}>{item?.course_name}</Text>
                {/* <Text style={styles.courseDesc}>Astro Srinivash</Text> */}
                {/* <Text style={styles.courseDuration}>Duration :<Text style={styles.courseDuration2}> 01 Year</Text></Text> */}
            </View>
        </TouchableOpacity>
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
            <CustomHeader commingFrom={'Courses'} onPress={() => navigation.goBack()} title={t('Courses.Courses')} />
            <ScrollView style={styles.wrapper}>
                {/* <View style={styles.flexrowView}> */}

                {courseData.length != '0' ?
                    <FlatList
                        data={courseData}
                        renderItem={renderCourse}
                        keyExtractor={(item) => item.id?.toString()}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        initialNumToRender={10}
                        showsVerticalScrollIndicator={false}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={renderFooter}
                        getItemLayout={(courseData, index) => (
                            { length: 50, offset: 50 * index, index }
                        )}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                    />
                    :
                    <Text style={{
                        color: '#894F00',
                        fontFamily: 'PlusJakartaSans-Bold',
                        fontSize: responsiveFontSize(1.7), textAlign: 'center'
                    }}>{t('Courses.NoCourseYet')}</Text>
                }
                {/* </View> */}
            </ScrollView>
        </SafeAreaView>
    )
}

export default withTranslation()(CourseScreen)

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
        //height: responsiveHeight(40),
        width: responsiveWidth(45),
        paddingBottom: 5
    },
    imageStyle: {
        height: responsiveHeight(25),
        width: responsiveWidth(45),
        borderRadius: 12,
        resizeMode: 'cover'
    },
    courseContain: {
        marginTop: responsiveHeight(1)
    },
    courseTitle: {
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
        marginBottom: responsiveHeight(1)
    },
    courseDesc: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7)
    },
    courseDuration: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.7)
    },
    courseDuration2: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7)
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
