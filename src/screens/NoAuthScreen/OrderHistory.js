import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image, Platform, Alert, FlatList } from 'react-native'
import CustomHeader from '../../components/CustomHeader'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ArrowGratter, ArrowUp, GreenTick, Payment, RedCross, YellowTck, chatColor, dateIcon, notifyImg, phoneColor, pujaImg, timeIcon, userPhoto } from '../../utils/Images'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton';
import Loader from '../../utils/Loader';
import axios from 'axios';
import { API_URL } from '@env'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment-timezone';
import SwitchSelector from "react-native-switch-selector";
import { SafeAreaView } from 'react-native-safe-area-context'
const OrderHistory = ({  }) => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Chat');
    const [activeTabForPuja, setActiveTabForPuja] = useState('Upcoming')
    const [isLoading, setIsLoading] = useState(false)
    const tabs = [
        { label: 'Consult', value: 'Chat' },
        // { label: 'Call', value: 'Call' },
        { label: 'Purchase', value: 'Purchase' },
        { label: 'Puja', value: 'Puja' },
    ];
    const [consultHistory, setConsultHistory] = useState([])
    //pagination
    const [hasMore, setHasMore] = useState(true);
    const [perPage, setPerPage] = useState(10);
    const [pageno, setPageno] = useState(1);
    const [loading, setLoading] = useState(false);

    const [pujaHistory, setPujaHistory] = useState([])
    const [pujaHistoryPrev, setPujaHistoryPrev] = useState([])
    // const [hasMorePuja, setHasMorePuja] = useState(true);
    // const [perPagePuja, setPerPagePuja] = useState(10);
    // const [pagenoPuja, setPagenoPuja] = useState(1);

    useEffect(() => {
        fetchConsultHistory(pageno);
    }, [fetchConsultHistory, pageno]);

    useFocusEffect(
        useCallback(() => {
            setPageno(1);
            setHasMore(true); // Reset hasMore on focus
            fetchConsultHistory(1);
        }, [fetchConsultHistory])
    );

    const fetchConsultHistory = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                console.log('No user token found');
                setIsLoading(false);
                return;
            }
            const response = await axios.post(`${API_URL}/user/session-history`, {}, {
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
            console.log(responseData, 'consult history')
            setConsultHistory(prevData => page === 1 ? responseData : [...prevData, ...responseData]);
            if (responseData.length === 0) {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            console.log(`Fetch consult history error: ${error}`);
            let myerror = error.response?.data?.message;
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                { text: 'OK', onPress: () => myerror == 'Unauthorized' ? logout() : console.log('OK Pressed') },
            ]);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    }, []);

    const renderConsultHistory = ({ item }) => (
        <View style={styles.totalValue}>
            <View style={styles.totalValue1stSection}>
                <View style={styles.profilePicSection}>
                    {item?.astrologer?.profile_pic ?
                        <Image
                            source={{ uri: item?.astrologer?.profile_pic }}
                            style={styles.profilePicStyle}
                        /> :
                        <Image
                            source={userPhoto}
                            style={styles.profilePicStyle}
                        />
                    }
                </View>
                <View style={styles.contentStyle}>
                    <View style={styles.flexRowStyle}>
                        <Text style={styles.contentStyleName}>{item?.astrologer?.display_name}</Text>
                        <Text
                            style={[
                                styles.contentStyleStatus,
                                { color: item?.session_status == 2 ? '#1CAB04' : '#E1293B' }
                            ]}
                        >
                            {item?.session_status == 2 ? "Completed" : "Incomplete"}
                        </Text>
                    </View>
                    <Text style={styles.contentStyleQualification}>{moment(item?.created_at).format('MMMM DD, YYYY hh:mm A')}</Text>

                    <Text style={styles.contentStyleLangValue}>
                        Duration: {Number(item?.total_session_time).toFixed(2)} Min
                    </Text>
                    <Text style={styles.contentStyleExp}>
                        Total Cost: ₹{(item?.cost ? Number(item?.cost) : 0).toFixed(2)}
                    </Text>
                </View>
            </View>
            <View style={styles.listButtonSecondSection}>
                <View style={{ width: responsiveWidth(30), alignSelf: 'flex-end' }}>
                    <CustomButton label={"View Chat"}
                        // onPress={() => { login() }}
                        onPress={() => { navigation.navigate('ChatHistory', { astrologerName: item?.astrologer?.display_name, astrologerId: item?.astrologer?.id, userId: item?.user?.id, Uid: item?.uuid,key: item?.uuid, }) }}
                        buttonColor={'red'}
                    />
                </View>
                {/* <View style={{ width: responsiveWidth(30), alignSelf: 'center' }}>
                    <CustomButton label={"Chat Again"}
                        // onPress={() => { login() }}
                        onPress={() => { null }}

                    />
                </View> */}
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

    // For puja section

    useEffect(() => {
        fetchPujaHistory();
        fetchPujaHistoryPrev()
    }, []);
    useFocusEffect(
        useCallback(() => {
            fetchPujaHistory();
            fetchPujaHistoryPrev()
        }, [])
    );

    const fetchPujaHistory = async () => {
        try {
            setLoading(true);
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                console.log('No user token found');
                setIsLoading(false);
                return;
            }
            const response = await axios.post(`${API_URL}/user/puja-booking-history-upcomming`, {}, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                    "Accept-Language": savedLang || 'en',
                },
            });

            const responseData = response.data.data;

            console.log(responseData, 'vbvbvbvb')
            setPujaHistory(responseData)

        } catch (error) {
            console.log(`Fetch puja history error: ${error}`);
            let myerror = error.response?.data?.message;
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                { text: 'OK', onPress: () => myerror == 'Unauthorized' ? logout() : console.log('OK Pressed') },
            ]);
        } finally {
            setIsLoading(false);
        }
    };
    const renderPujaHistory = ({ item }) => {
        const totalCost = (Number(item?.puja?.min_amount) + (Number(item?.puja?.min_amount) * 18) / 100).toFixed(2);
        return (
            <View style={styles.totalValue}>
                <View style={styles.totalValue1stSection}>
                    <View style={styles.profilePicSection}>
                        {item?.puja?.images[0] ?
                            <Image
                                source={{ uri: item?.puja?.images[0] }}
                                style={styles.profilePicStyleForPuja}
                            /> :
                            <Image
                                source={pujaImg}
                                style={styles.profilePicStyleForPuja}
                            />
                        }
                    </View>
                    <View style={styles.contentStyle}>
                        <View style={styles.flexRowStyle}>
                            <Text style={styles.contentStyleName}>{item?.puja?.name}</Text>
                        </View>
                        <Text style={styles.contentStyleQualification}>By {item?.astrologer?.display_name}</Text>
                        <Text style={styles.contentStyleLangValue}>{moment(item?.puja_dates?.date).format('dddd, DD MMMM, YYYY')}</Text>
                        <Text style={styles.contentStyleLangValue}>{moment(item.puja_availability?.st, 'HH:mm:ss').format('hh:mm A')} - {moment(item.puja_availability?.et, 'HH:mm:ss').format('hh:mm A')}</Text>
                        <Text style={styles.contentStyleExp}>Total Cost : ₹ {totalCost}</Text>
                    </View>
                </View>
                {/* <View style={styles.listButtonSecondSection}>
                <View style={{ width: responsiveWidth(30), alignSelf: 'center' }}>
                    <CustomButton label={"Track My Order"}
                        // onPress={() => { login() }}
                        onPress={() => { deleteAccount() }}
                    />
                </View>
            </View> */}

            </View>
        )
    };

    const fetchPujaHistoryPrev = async () => {
        try {
            setLoading(true);
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                console.log('No user token found');
                setIsLoading(false);
                return;
            }
            const response = await axios.post(`${API_URL}/user/puja-booking-history-previous`, {}, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                    "Accept-Language": savedLang || 'en',
                },
            });

            const responseData = response.data.data;

            console.log(responseData, 'vbvbvbvb')
            setPujaHistoryPrev(responseData)

        } catch (error) {
            console.log(`Fetch puja history error: ${error}`);
            let myerror = error.response?.data?.message;
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                { text: 'OK', onPress: () => myerror == 'Unauthorized' ? logout() : console.log('OK Pressed') },
            ]);
        } finally {
            setIsLoading(false);
        }
    };
    const renderPujaHistoryPrev = ({ item }) => {
        const totalCost = (Number(item?.puja?.min_amount) + (Number(item?.puja?.min_amount) * 18) / 100).toFixed(2);
        return (
            <View style={styles.totalValue}>
                <View style={styles.totalValue1stSection}>
                    <View style={styles.profilePicSection}>
                        {item?.puja?.images[0] ?
                            <Image
                                source={{ uri: item?.puja?.images[0] }}
                                style={styles.profilePicStyleForPuja}
                            /> :
                            <Image
                                source={pujaImg}
                                style={styles.profilePicStyleForPuja}
                            />
                        }
                    </View>
                    <View style={styles.contentStyle}>
                        <View style={styles.flexRowStyle}>
                            <Text style={styles.contentStyleName}>{item?.puja?.name}</Text>
                        </View>
                        <Text style={styles.contentStyleQualification}>By {item?.astrologer?.display_name}</Text>
                        <Text style={styles.contentStyleLangValue}>{moment(item?.puja_dates?.date).format('dddd, DD MMMM, YYYY')}</Text>
                        <Text style={styles.contentStyleLangValue}>{moment(item.puja_availability?.st, 'HH:mm:ss').format('hh:mm A')} - {moment(item.puja_availability?.et, 'HH:mm:ss').format('hh:mm A')}</Text>
                        <Text style={styles.contentStyleExp}>Total Cost : ₹ {totalCost}</Text>
                    </View>
                </View>
                {/* <View style={styles.listButtonSecondSection}>
                <View style={{ width: responsiveWidth(30), alignSelf: 'center' }}>
                    <CustomButton label={"Track My Order"}
                        // onPress={() => { login() }}
                        onPress={() => { deleteAccount() }}
                    />
                </View>
            </View> */}

            </View>
        )
    };



    if (isLoading) {
        return (
            <Loader />
        )
    }
    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Order History'} onPress={() => navigation.goBack()} title={'Order History'} />
            <ScrollView style={styles.wrapper}>
                <View style={{ marginBottom: responsiveHeight(3) }}>
                    <View style={styles.tabContainer}>
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab.value}
                                onPress={() => setActiveTab(tab.value)}
                                style={[
                                    styles.tab,
                                    activeTab === tab.value && styles.activeTab,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === tab.value && styles.activeTabText,
                                    ]}
                                >
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.contentContainer}>
                        {/* Render content based on activeTab */}
                        {activeTab === 'Chat' &&
                            <>
                                <Text style={styles.headerText}>Consult History</Text>
                                <View style={styles.topAstrologerSection}>
                                    {consultHistory.length != '0' ?
                                        <FlatList
                                            data={consultHistory}
                                            renderItem={renderConsultHistory}
                                            keyExtractor={(item) => item.id?.toString()}
                                            maxToRenderPerBatch={10}
                                            windowSize={5}
                                            initialNumToRender={10}
                                            showsVerticalScrollIndicator={false}
                                            onEndReached={handleLoadMore}
                                            onEndReachedThreshold={0.5}
                                            ListFooterComponent={renderFooter}
                                            getItemLayout={(consultHistory, index) => (
                                                { length: 50, offset: 50 * index, index }
                                            )}
                                        />
                                        :
                                        <Text style={{
                                            color: '#894F00',
                                            fontFamily: 'PlusJakartaSans-Bold',
                                            fontSize: responsiveFontSize(1.7), textAlign: 'center'
                                        }}>No Consultation Yet</Text>
                                    }
                                </View>
                            </>
                        }
                        {/* {activeTab === 'Call' &&
                            <>
                                <Text style={styles.headerText}>Call History</Text>
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
                                                <View style={styles.flexRowStyle}>
                                                    <Text style={styles.contentStyleName}>Astro Shivnash</Text>
                                                    <Text style={styles.contentStyleStatus}>Completed</Text>
                                                </View>
                                                <Text style={styles.contentStyleQualification}>May 31,2024   02:19 PM</Text>
                                                <Text style={styles.contentStyleLangValue}>Duration : 3 Min</Text>
                                                <Text style={styles.contentStyleExp}>Total Cost : ₹33</Text>
                                            </View>
                                        </View>
                                        <View style={styles.listButtonSecondSection}>
                                            <View style={{ width: responsiveWidth(30), alignSelf: 'center' }}>
                                                <CustomButton label={"Call Again"}
                                                    // onPress={() => { login() }}
                                                    onPress={() => { deleteAccount() }}

                                                />
                                            </View>
                                        </View>

                                    </View>
                                </View>
                            </>
                        } */}
                        {activeTab === 'Purchase' &&
                            <>
                                <Text style={styles.headerText}>Purchase History</Text>
                                <View style={styles.topAstrologerSection}>
                                    <View style={styles.totalValue}>
                                        <View style={styles.totalValue1stSection}>
                                            <View style={styles.profilePicSection}>
                                                <Image
                                                    source={userPhoto}
                                                    style={styles.profilePicStyleForPuja}
                                                />
                                            </View>
                                            <View style={styles.contentStyle}>
                                                <View style={styles.flexRowStyle}>
                                                    <Text style={styles.contentStyleName}>Yellow Sapphire - 3.50</Text>
                                                </View>
                                                <Text style={styles.contentStyleQualification}>Origin : Ceylon (Sri Lanka)</Text>
                                                <Text style={styles.contentStyleLangValue}>Delivery : May 31,2024</Text>
                                                <View style={styles.flexRowStyleForPurchase}>
                                                    <Text style={styles.contentStyleAmount}>₹ 4,950</Text>
                                                    <Text style={styles.contentStyleExp}>Qty : 1</Text>
                                                </View>
                                            </View>
                                        </View>

                                    </View>
                                </View>
                            </>
                        }
                        {activeTab === 'Puja' &&
                            // <>
                            //     <Text style={styles.headerText}>Puja History</Text>
                            //     <View style={styles.topAstrologerSection}>
                            //         {pujaHistory.length != '0' ?
                            //             <FlatList
                            //                 data={pujaHistory}
                            //                 renderItem={renderPujaHistory}
                            //                 keyExtractor={(item) => item.id?.toString()}
                            //                 maxToRenderPerBatch={10}
                            //                 windowSize={5}
                            //                 initialNumToRender={10}
                            //                 showsVerticalScrollIndicator={false}
                            //                 // onEndReached={handleLoadMore}
                            //                 // onEndReachedThreshold={0.5}
                            //                 // ListFooterComponent={renderFooter}
                            //                 getItemLayout={(pujaHistory, index) => (
                            //                     { length: 50, offset: 50 * index, index }
                            //                 )}
                            //             />
                            //             :
                            //             <Text style={{
                            //                 color: '#894F00',
                            //                 fontFamily: 'PlusJakartaSans-Bold',
                            //                 fontSize: responsiveFontSize(1.7), textAlign: 'center'
                            //             }}>No Puja Booked Yet</Text>
                            //         }
                            //     </View>
                            // </>
                            <View>
                                <View style={{ marginBottom: responsiveHeight(2) }}>
                                    <SwitchSelector
                                        initial={0}
                                        onPress={value => setActiveTabForPuja(value)}
                                        textColor={'#746868'}
                                        selectedColor={'#894F00'}
                                        buttonColor={'#FFFFFF'}
                                        backgroundColor={'#FEF3E5'}
                                        borderWidth={0}
                                        height={responsiveHeight(5)}
                                        valuePadding={6}
                                        hasPadding
                                        options={[
                                            { label: "Upcoming", value: "Upcoming" },
                                            { label: "Previous", value: "Previous" },
                                        ]}
                                    />
                                </View>
                                {activeTabForPuja === 'Upcoming' ? (
                                    pujaHistory.length != '0' ?
                                        <FlatList
                                            data={pujaHistory}
                                            renderItem={renderPujaHistory}
                                            keyExtractor={(item) => item.id?.toString()}
                                            maxToRenderPerBatch={10}
                                            windowSize={5}
                                            initialNumToRender={10}
                                            showsVerticalScrollIndicator={false}
                                            // onEndReached={handleLoadMore}
                                            // onEndReachedThreshold={0.5}
                                            // ListFooterComponent={renderFooter}
                                            getItemLayout={(pujaHistory, index) => (
                                                { length: 50, offset: 50 * index, index }
                                            )}
                                        />
                                        :
                                        <Text style={{
                                            color: '#894F00',
                                            fontFamily: 'PlusJakartaSans-Bold',
                                            fontSize: responsiveFontSize(1.7), textAlign: 'center'
                                        }}>No Puja Booked Yet</Text>

                                ) : (
                                    pujaHistoryPrev.length != '0' ?
                                        <FlatList
                                            data={pujaHistoryPrev}
                                            renderItem={renderPujaHistoryPrev}
                                            keyExtractor={(item) => item.id?.toString()}
                                            maxToRenderPerBatch={10}
                                            windowSize={5}
                                            initialNumToRender={10}
                                            showsVerticalScrollIndicator={false}
                                            // onEndReached={handleLoadMore}
                                            // onEndReachedThreshold={0.5}
                                            // ListFooterComponent={renderFooter}
                                            getItemLayout={(pujaHistoryPrev, index) => (
                                                { length: 50, offset: 50 * index, index }
                                            )}
                                        />
                                        :
                                        <Text style={{
                                            color: '#894F00',
                                            fontFamily: 'PlusJakartaSans-Bold',
                                            fontSize: responsiveFontSize(1.7), textAlign: 'center'
                                        }}>No Previous Puja Found</Text>
                                )

                                }
                            </View>
                        }
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


export default OrderHistory


const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {
        paddingHorizontal: 15,
        //marginBottom: responsiveHeight(1)
    },
    /* tab section */
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 20,
        backgroundColor: '#FEF3E5',
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeTab: {
        backgroundColor: '#FEF3E5',
        borderColor: '#D9B17E',
        borderWidth: 1
    },
    tabText: {
        color: '#894F00',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(1.7),
    },
    activeTabText: {
        color: '#894F00',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(1.7),
    },
    contentContainer: {
        flex: 1,
        //paddingHorizontal: 10,
        paddingVertical: 10,
    },
    /* tab section */
    headerText: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
    },
    /* chat section */
    topAstrologerSection: {
        marginTop: responsiveHeight(2)
    },
    totalValue: {
        width: responsiveWidth(91),
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
        resizeMode: 'cover',
        marginBottom: responsiveHeight(1)
    },
    contentStyle: {
        flexDirection: 'column',
        width: responsiveWidth(60),
        //height: responsiveHeight(10),
        //backgroundColor:'red'
    },
    flexRowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveHeight(1)
    },
    contentStyleName: {
        fontSize: responsiveFontSize(2),
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-SemiBold',
    },
    contentStyleStatus: {
        fontSize: responsiveFontSize(1.7),
        fontFamily: 'PlusJakartaSans-SemiBold',
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
    listButtonSecondSection: {
        //flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: responsiveWidth(65),
        alignSelf: 'flex-end',
        marginBottom: -responsiveHeight(1),
        marginTop: responsiveHeight(1),
    },
    /* puja section */
    profilePicStyleForPuja: {
        height: 100,
        width: 80,
        borderRadius: 15,
        resizeMode: 'contain',
    },
    /* purchase section */
    contentStyleAmount: {
        fontSize: responsiveFontSize(1.7),
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Bold',
        marginBottom: responsiveHeight(1),
        marginRight: responsiveWidth(5)
    },
    flexRowStyleForPurchase: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
