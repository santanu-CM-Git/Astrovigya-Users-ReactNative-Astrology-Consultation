import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert, Platform } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { pujaImg } from '../../../utils/Images'
import { API_URL } from '@env'
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '../../../utils/Loader';
import moment from "moment"
import { withTranslation, useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'

const OnlinePujaList = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [perPage, setPerPage] = useState(10);
    const [pageno, setPageno] = useState(1);
    const [isLoading, setIsLoading] = useState(true)
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [pujaList, setPujaList] = useState([]);

    useEffect(() => {
        fetchPujaList(pageno);
    }, [fetchPujaList, pageno]);

    const fetchPujaList = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                console.log('No user token found');
                setIsLoading(false);
                return;
            }
            const response = await axios.get(`${API_URL}/user/puja`, {
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
            console.log(responseData, 'puja list')
            setPujaList(prevData => page === 1 ? responseData : [...prevData, ...responseData]);
            if (responseData.length === 0) {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            console.log(`Fetch puja list error: ${error}`);
            let myerror = error.response?.data?.message;
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                { text: 'OK', onPress: () => myerror == 'Unauthorized' ? logout() : console.log('OK Pressed') },
            ]);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    }, []);

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
    const renderPujaList = ({ item }) => {
        return (
            <Pressable onPress={() => navigation.navigate('PujaDetails', { pujaDetails: item })}>
                <View style={styles.totalValue}>
                    <View style={styles.flexDirectionRow}>
                        {item?.images[0] ?
                            <Image
                                source={{ uri: item?.images[0] }}
                                style={styles.imageStyle}
                            /> :
                            <Image
                                source={pujaImg}
                                style={styles.imageStyle}
                            />
                        }
                        <View style={styles.containSection}>
                            <Text style={styles.pujaName}>{item?.name}</Text>
                            <Text style={styles.pujaDesc}>{t('puja.StartingFrom')} <Text style={styles.pujaAmount}>₹ {item?.min_amount}</Text></Text>
                            <View style={styles.bookNowButton}>
                                <Text style={styles.buttonText}>{t('puja.BookNow')}</Text>
                            </View>
                        </View>

                    </View>
                </View>
            </Pressable>
        )

    };

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Online Puja'} onPress={() => navigation.goBack()} title={t('puja.OnlinePuja')} />
            <ScrollView style={styles.wrapper}>
                <View style={styles.topAstrologerSection}>
                    {/* <Pressable onPress={() => navigation.navigate('PujaDetails')}>
                        <View style={styles.totalValue}>
                            <View style={styles.flexDirectionRow}>
                                <Image
                                    source={pujaImg}
                                    style={styles.imageStyle}
                                />
                                <View style={styles.containSection}>
                                    <Text style={styles.pujaName}>Kaal Sarp Dosh Puja</Text>
                                    <Text style={styles.pujaDesc}>Starting From <Text style={styles.pujaAmount}>₹ 2200</Text></Text>
                                    <View style={styles.bookNowButton}>
                                        <Text style={styles.buttonText}>Book Now</Text>
                                    </View>
                                </View>

                            </View>
                        </View>
                    </Pressable> */}
                    {pujaList.length != '0' ?
                        <FlatList
                            data={pujaList}
                            renderItem={renderPujaList}
                            keyExtractor={(item) => item.id.toString()}
                            maxToRenderPerBatch={10}
                            windowSize={5}
                            initialNumToRender={10}
                            showsVerticalScrollIndicator={false}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={renderFooter}
                        /> :
                        <Text style={{
                            color: '#894F00',
                            fontFamily: 'PlusJakartaSans-Bold',
                            fontSize: responsiveFontSize(1.7), textAlign: 'center'
                        }}>{t('puja.NoPujafound')}</Text>
                    }
                </View>

            </ScrollView>
        </SafeAreaView >
    )
}

export default withTranslation()(OnlinePujaList)

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {

    },
    topAstrologerSection: {
        marginHorizontal: 15,
        marginTop: responsiveHeight(1)
    },
    totalValue: {
        //width: responsiveWidth(92),
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
    flexDirectionRow: {
        flexDirection: 'row',

    },
    imageStyle: {
        height: responsiveHeight(15),
        width: responsiveWidth(30),
        borderRadius: 10
    },
    containSection: {
        flexDirection: 'column',
        marginLeft: responsiveWidth(2),
        width: responsiveWidth(55),
    },
    pujaName: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        marginBottom: responsiveHeight(1)
    },
    pujaDesc: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
        marginBottom: responsiveHeight(3)
    },
    pujaAmount: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.7),
        marginBottom: responsiveHeight(1)
    },
    bookNowButton: {
        height: responsiveHeight(5),
        width: responsiveWidth(30),
        borderRadius: 10,
        backgroundColor: '#FB7401',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(1.7),
    }
});
