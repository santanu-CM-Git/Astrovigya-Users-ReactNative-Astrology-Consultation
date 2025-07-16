import React, { useContext, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, ImageBackground, Image, Platform, Alert, FlatList } from 'react-native'
import CustomHeader from '../../components/CustomHeader'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ArrowGratter, ArrowUp, GreenTick, Payment, RedCross, YellowTck, chatColor, dateIcon, notifyImg, phoneColor, timeIcon, userPhoto } from '../../utils/Images'
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton';
import Loader from '../../utils/Loader';
import axios from 'axios';
import { API_URL } from '@env'
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment-timezone';
import { useNavigation } from '@react-navigation/native';

const OrderHistory = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Chat');
    const [isLoading, setIsLoading] = useState(false)
    const tabs = [
        { label: 'Chat', value: 'Chat' },
        { label: 'Call', value: 'Call' },
        { label: 'Purchase', value: 'Purchase' },
        { label: 'Puja', value: 'Puja' },
    ];

    useEffect(() => {

    }, [])
    useFocusEffect(
        React.useCallback(() => {

        }, [])
    )

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
                                <Text style={styles.headerText}>Chat History</Text>
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
                                                <CustomButton label={"View Chat"}
                                                    // onPress={() => { login() }}
                                                    onPress={() => { toggleAccountDeleteModal() }}
                                                    buttonColor={'red'}
                                                />
                                            </View>
                                            <View style={{ width: responsiveWidth(30), alignSelf: 'center' }}>
                                                <CustomButton label={"Chat Again"}
                                                    // onPress={() => { login() }}
                                                    onPress={() => { deleteAccount() }}

                                                />
                                            </View>
                                        </View>

                                    </View>
                                </View>
                            </>
                        }
                        {activeTab === 'Call' &&
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
                        }
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
                            <>
                                <Text style={styles.headerText}>Puja History</Text>
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
                                                    <Text style={styles.contentStyleName}>Kaal Sarp Dosh Puja</Text>
                                                </View>
                                                <Text style={styles.contentStyleQualification}>By Astro Shivnash</Text>
                                                <Text style={styles.contentStyleLangValue}>Monday, 26 July, 2024</Text>
                                                <Text style={styles.contentStyleExp}>Total Cost : ₹ 3,658</Text>
                                            </View>
                                        </View>
                                        <View style={styles.listButtonSecondSection}>
                                            <View style={{ width: responsiveWidth(30), alignSelf: 'center' }}>
                                                <CustomButton label={"Track My Order"}
                                                    // onPress={() => { login() }}
                                                    onPress={() => { deleteAccount() }}
                                                />
                                            </View>
                                        </View>

                                    </View>
                                </View>
                            </>
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
        paddingHorizontal: 20,
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
        elevation: 5,
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
        color: '#1CAB04',
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
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: responsiveWidth(35),
        alignSelf: 'flex-end',
        marginBottom: -responsiveHeight(1),
        marginTop: responsiveHeight(1)
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
    flexRowStyleForPurchase:{
        flexDirection: 'row',
        alignItems: 'center',
    }
});
