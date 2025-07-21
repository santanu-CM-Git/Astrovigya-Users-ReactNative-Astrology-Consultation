import React, { useContext, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, ImageBackground, Image, Platform, Alert, FlatList, Pressable } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ArrowGratter, ArrowUp, GreenTick, Payment, RedCross, YellowTck, chatColor, dateIcon, matchBoyImg, matchCompatability, matchGirlImg, matchmakingReport, notifyImg, phoneColor, timeIcon, userPhoto } from '../../../utils/Images'
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../../components/CustomButton';
import Loader from '../../../utils/Loader';
import axios from 'axios';
import { API_URL } from '@env'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment-timezone';

const MatchMakingReport = ({  }) => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Result');
    const [isLoading, setIsLoading] = useState(false)
    const tabs = [
        { label: 'Result', value: 'Result' },
        { label: 'Basic Details', value: 'Basic Details' },
        { label: 'Guna Details', value: 'Guna Details' },
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
            <CustomHeader commingFrom={'Match Making Report'} onPress={() => navigation.goBack()} title={'Match Making Report'} />
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
                        {activeTab === 'Result' &&
                            <>
                                <View style={styles.topAstrologerSection}>
                                    <View style={styles.totalValue}>
                                        <View style={styles.section1st}>
                                            <Text style={styles.bannerTitle}>Compatibility Score</Text>
                                            <Text style={styles.bannerDesc}>This is a good match. But, some remedies are advisiable.</Text>
                                        </View>
                                        <View style={styles.section2nd}>
                                            <Image
                                                source={matchmakingReport}
                                                style={styles.profilePicStyle}
                                            />
                                            <Text style={styles.ratingValue}>28/36</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.flexRowStyle}>
                                    <View style={styles.flexColumnStyle}>
                                        <Image
                                            source={matchBoyImg}
                                            style={styles.boygirlImg}
                                        />
                                        <Text style={styles.nameBoyGirl}>Steve Smith</Text>
                                        <Text style={[styles.doshaBoyGirl, { color: '#E1293B' }]}>Mangalik</Text>
                                    </View>
                                    <Image
                                        source={matchCompatability}
                                        style={styles.vsImg}
                                    />
                                    <View style={styles.flexColumnStyle}>
                                        <Image
                                            source={matchGirlImg}
                                            style={styles.boygirlImg}
                                        />
                                        <Text style={styles.nameBoyGirl}>Steve Smith</Text>
                                        <Text style={[styles.doshaBoyGirl, { color: '#1CAB04' }]}>Non-Mangalik</Text>
                                    </View>
                                </View>
                            </>
                        }
                        {activeTab === 'Basic Details' &&
                            <>
                                <View style={[styles.table]}>

                                    <View style={styles.tableRow2}>
                                        <View style={styles.cellmain}>
                                            <Text style={styles.tableHeader3}>Basic Details</Text>
                                        </View>

                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Name</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Steve Smith</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Olivia Russel</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Date of Birth</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>04-11-1992</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>08-06-1996</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Birth Time</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>09:15 AM</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>06:28 PM</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Location</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Kolkta,India</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Delhi,India</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Gender</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Male</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Female</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Rashi</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Pisces</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Aquarius</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4,{ borderBottomWidth: 0,}]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Nakshatra</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Uttara Bhadrapada</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Purba Bhadrapada</Text>
                                        </View>
                                    </View>
                                </View>
                            </>
                        }
                        {activeTab === 'Guna Details' &&
                            <>
                                <View style={styles.totalGunaValue}>
                                    <View style={styles.flexRowStyle}>
                                        <Text style={styles.gunaTitle}>Compatibility  (Varna)</Text>
                                        <View style={styles.compatabilityView}>
                                            <Text style={styles.compatabilityNo}>01/01</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.gunaDesc}>Varna refers to the mental compatibility of the two persons involved. It holds nominal effect in the matters of marriage comapatibility.</Text>
                                </View>

                            </>
                        }
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


export default MatchMakingReport


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
    /* Result section */
    topAstrologerSection: {
        marginBottom: responsiveHeight(1)
    },
    totalValue: {
        width: responsiveWidth(91),
        //height: responsiveHeight(20),
        //alignItems: 'center',
        backgroundColor: '#FEF3E5',
        padding: 15,
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
        marginBottom: responsiveHeight(2),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profilePicStyle: {
        height: 90,
        width: 90,
        resizeMode: 'contain',
        alignSelf: 'flex-end'
    },
    section1st: {
        width: responsiveWidth(60),
    },
    section2nd: {
        width: responsiveWidth(25),
    },
    bannerTitle: {
        color: '#894F00',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        marginBottom: responsiveHeight(2)
    },
    bannerDesc: {
        color: '#7C705F',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
    },
    ratingValue: {
        color: '#894F00',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        position: 'absolute',
        bottom: 30,
        left: 30,
    },
    flexRowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    boygirlImg: {
        height: 100,
        width: 100,
        resizeMode: 'contain',
    },
    vsImg: {
        height: 40,
        width: 40,
        resizeMode: 'contain',
    },
    flexColumnStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    nameBoyGirl: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        marginVertical: responsiveHeight(1)
    },
    doshaBoyGirl: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.7),
    },
    /* guna details */
    totalGunaValue: {
        width: responsiveWidth(91),
        //height: responsiveHeight(20),
        //alignItems: 'center',
        backgroundColor: '#F2F4F6',
        padding: 15,
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
        marginBottom: responsiveHeight(2),
    },
    gunaTitle: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
    },
    gunaDesc: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
    },
    compatabilityView: {
        backgroundColor: '#FB7401',
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    compatabilityNo: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(1.7),
    },
    // Basic Details
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        //margin: 10,
        width: responsiveWidth(91),
        //height: responsiveHeight(250),
        borderRadius: 10
    },
    tableRow2: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ddd',
         backgroundColor:'#F4F5F5'
        //height: responsiveHeight(15)
    },
    cellmain: {
        //flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
       
    },
    tableHeader2: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
        textAlign: 'left'
    },
    tableHeader3:{
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(1.7),
        textAlign: 'center'
    },
    tableRow4: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        //height: responsiveHeight(18)
    },
    cellmainlast: {
        //flex: 1,
        padding: 10,
        justifyContent: 'center',
        //alignItems: 'center',
        width: responsiveWidth(30)
    },
    verticleLine: {
        height: '100%',
        width: 1,
        backgroundColor: '#ddd',
    },
    cell6: {
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        width: responsiveWidth(30)
    },
});
