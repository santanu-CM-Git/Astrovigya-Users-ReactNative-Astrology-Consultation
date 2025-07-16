import React, { useContext, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, ImageBackground, Image, Platform, Alert, FlatList } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ArrowGratter, ArrowUp, GreenTick, Payment, RedCross, YellowTck, chatColor, dateIcon, kalsarpImg, mangaldoshaImg, notifyImg, phoneColor, timeIcon, userPhoto } from '../../../utils/Images'
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../../components/CustomButton';
import Loader from '../../../utils/Loader';
import axios from 'axios';
import { API_URL } from '@env'
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment-timezone';
import LagnaChart from '../../../components/LagnaChart';
import { useNavigation } from '@react-navigation/native';

const KundliDetailsScreen = ({  }) => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Basic Details');
    const [isLoading, setIsLoading] = useState(false)
    const tabs = [
        { label: 'Basic Details', value: 'Basic Details' },
        { label: 'Charts', value: 'Charts' },
        { label: 'Ashtakvarga', value: 'Ashtakvarga' },
        { label: 'Dasha', value: 'Dasha' },
        { label: 'Remedies', value: 'Remedies' },
        { label: 'Prediction', value: 'Prediction' },
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
            <CustomHeader commingFrom={'Kundli Details'} onPress={() => navigation.goBack()} title={'Kundli Details'} />
            <ScrollView style={styles.wrapper}>
                <View style={{ marginBottom: responsiveHeight(3) }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
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
                    </ScrollView>
                    <View style={styles.contentContainer}>
                        {/* Render content based on activeTab */}
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
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Date of Birth</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>04-11-1992</Text>
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
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Location</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Kolkta,India</Text>
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
                                    </View>
                                    <View style={[styles.tableRow4]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Rashi</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Pisces</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4, { borderBottomWidth: 0, }]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Nakshatra</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Uttara Bhadrapada</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.flexRowStyle}>
                                    <View style={styles.halfBox}>
                                        <Image
                                            source={mangaldoshaImg}
                                            style={[styles.iconStyle]}
                                        />
                                        <Text style={styles.detailsTitle}>Mangal Dosha</Text>
                                        <View style={[styles.buttonView, { backgroundColor: '#FB7401' }]}>
                                            <Text style={styles.buttonText}>Yes</Text>
                                        </View>
                                    </View>
                                    <View style={styles.halfBox}>
                                        <Image
                                            source={kalsarpImg}
                                            style={[styles.iconStyle]}
                                        />
                                        <Text style={styles.detailsTitle}>Kalsarp Dosha</Text>
                                        <View style={[styles.buttonView, { backgroundColor: '#B1B1B1' }]}>
                                            <Text style={styles.buttonText}>Yes</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.table, { marginTop: responsiveHeight(2) }]}>

                                    <View style={styles.tableRow2}>
                                        <View style={styles.cellmain}>
                                            <Text style={styles.tableHeader3}>Panchang Details</Text>
                                        </View>

                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Tithi</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Shukla Dwadashi</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Karan</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Baalav</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Yog</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Harshana</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Nakshatra</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Uttara Bhadrapada</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Sunrise</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>5:42:39 AM</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4, { borderBottomWidth: 0, }]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Sunset</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>4:57:45 PM</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.table, { marginTop: responsiveHeight(2) }]}>

                                    <View style={styles.tableRow2}>
                                        <View style={styles.cellmain}>
                                            <Text style={styles.tableHeader3}>Avakhada Details</Text>
                                        </View>

                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Varna</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Brahmin</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Vasya</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Jalchar</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Yoni</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Mesha</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Gan</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Manav</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Nadi</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Madhya</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4, { borderBottomWidth: 0, }]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Sign</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>Pisces</Text>
                                        </View>
                                    </View>
                                </View>
                            </>
                        }
                        {activeTab === 'Charts' &&
                            <>
                                <LagnaChart />
                            </>
                        }
                        {activeTab === 'Ashtakvarga' &&
                            <>

                            </>
                        }
                        {activeTab === 'Dasha' &&
                            <>

                            </>
                        }
                        {activeTab === 'Remedies' &&
                            <>

                            </>
                        }
                        {activeTab === 'Prediction' &&
                            <>

                            </>
                        }
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


export default KundliDetailsScreen


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
        //justifyContent: 'space-around',
        marginVertical: 20,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#FEF3E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: responsiveWidth(2)
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
        backgroundColor: '#F4F5F5'
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
    tableHeader3: {
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
        width: responsiveWidth(60),
    },
    /*tab section */
    flexRowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: responsiveHeight(2)
    },
    halfBox: {
        height: responsiveHeight(20),
        width: responsiveWidth(40),
        borderRadius: 5,
        backgroundColor: '#FEF3E5',
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconStyle: { height: 25, width: 25, resizeMode: 'contain' },
    detailsTitle: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(1.7),
        marginVertical: 5
    },
    buttonView: {
        height: responsiveHeight(4),
        width: responsiveWidth(20),
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5
    },
    buttonText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(1.7),
    }
});
