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
import { API_URL, ASTRO_API_URL, ASTRO_USERID, ASTRO_APIKEY } from '@env'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment-timezone';
import LagnaChart from '../../../components/LagnaChart';
import { SvgXml } from 'react-native-svg';
import base64 from 'base-64';

const KundliDetailsScreen = ({ route }) => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Basic Details');
    const [isLoading, setIsLoading] = useState(false)
    const tabs = [
        { label: 'Basic Details', value: 'Basic Details' },
        { label: 'Charts', value: 'Charts' },
        // { label: 'Ashtakvarga', value: 'Ashtakvarga' },
        // { label: 'Dasha', value: 'Dasha' },
        // { label: 'Remedies', value: 'Remedies' },
        // { label: 'Prediction', value: 'Prediction' },
    ];
    const [activeTab2, setActiveTab2] = useState('Sign');
    const tabs2 = [
        { label: 'Sign', value: 'Sign' },
        { label: 'Nakshatra', value: 'Nakshatra' },
    ];
    const [basicDetails, setBasicDetails] = useState(null)
    const [panchangDetails, setPanchangDetails] = useState(null)
    const [avakhadaDetails, setAvakhadaDetails] = useState(null)
    const [kalsarpaDetails, setKalsarpaDetails] = useState(null)
    const [svgData, setSvgData] = useState("");
    const [planetDetails, setPlanetDetails] = useState([])

    // In-memory cache to store API results for the session
    const apiCache = React.useRef({});

    const {
        firstname,
        date,
        time,
        location,
        locationLat,
        locationLong,
        timeZone,
    } = route.params;

    // Helper to generate a unique cache key for the current params
    const getCacheKey = () => {
        return `${date}_${time}_${locationLat}_${locationLong}_${timeZone}`;
    };

    useEffect(() => {
        fetchBirthDetails()
        fetchPanchangDetails()
        fetchAvakhadaDetails()
        fetchKalsarpaDetails()
        fetchChartImg()
        fetchPlanetDetails()
    }, [])
    useFocusEffect(
        React.useCallback(() => {

        }, [])
    )

    const fetchBirthDetails = () => {
        const cacheKey = getCacheKey();
        if (apiCache.current[cacheKey]?.birthDetails) {
            setBasicDetails(apiCache.current[cacheKey].birthDetails);
            return;
        }
        const username = ASTRO_USERID;
        const password = ASTRO_APIKEY;
        const basicAuth = 'Basic ' + base64.encode(`${username}:${password}`);
        const [day, month, year] = date.split('-');
        const [hour, minute] = time.split(':');
        const option = {
            "day": day,
            "month": month,
            "year": year,
            "hour": hour,
            "min": minute,
            "lat": locationLat,
            "lon": locationLong,
            "tzone": timeZone
        }
        axios.post(`${ASTRO_API_URL}/birth_details`, option, {
            headers: {
                Accept: 'application/json',
                Authorization: basicAuth, // Add Basic Auth here
            },
        })
            .then(res => {
                setBasicDetails(res.data)
                apiCache.current[cacheKey] = {
                    ...apiCache.current[cacheKey],
                    birthDetails: res.data,
                };
                setIsLoading(false);
            })
            .catch(e => {
                setIsLoading(false);
                console.log(`birth_details error ${e}`);
            });
    }
    const fetchPanchangDetails = () => {
        const cacheKey = getCacheKey();
        if (apiCache.current[cacheKey]?.panchangDetails) {
            setPanchangDetails(apiCache.current[cacheKey].panchangDetails);
            return;
        }
        const username = ASTRO_USERID;
        const password = ASTRO_APIKEY;
        const basicAuth = 'Basic ' + base64.encode(`${username}:${password}`);
        const [day, month, year] = date.split('-');
        const [hour, minute] = time.split(':');
        const option = {
            "day": day,
            "month": month,
            "year": year,
            "hour": hour,
            "min": minute,
            "lat": locationLat,
            "lon": locationLong,
            "tzone": timeZone
        }
        axios.post(`${ASTRO_API_URL}/basic_panchang`, option, {
            headers: {
                Accept: 'application/json',
                Authorization: basicAuth, // Add Basic Auth here
            },
        })
            .then(res => {
                setPanchangDetails(res.data)
                apiCache.current[cacheKey] = {
                    ...apiCache.current[cacheKey],
                    panchangDetails: res.data,
                };
                setIsLoading(false);
            })
            .catch(e => {
                setIsLoading(false);
                console.log(`basic_panchang error ${e}`);
            });
    }
    const fetchAvakhadaDetails = () => {
        const cacheKey = getCacheKey();
        if (apiCache.current[cacheKey]?.avakhadaDetails) {
            setAvakhadaDetails(apiCache.current[cacheKey].avakhadaDetails);
            return;
        }
        const username = ASTRO_USERID;
        const password = ASTRO_APIKEY;
        const basicAuth = 'Basic ' + base64.encode(`${username}:${password}`);
        const [day, month, year] = date.split('-');
        const [hour, minute] = time.split(':');
        const option = {
            "day": day,
            "month": month,
            "year": year,
            "hour": hour,
            "min": minute,
            "lat": locationLat,
            "lon": locationLong,
            "tzone": timeZone
        }
        axios.post(`${ASTRO_API_URL}/astro_details`, option, {
            headers: {
                Accept: 'application/json',
                Authorization: basicAuth, // Add Basic Auth here
            },
        })
            .then(res => {
                setAvakhadaDetails(res.data)
                apiCache.current[cacheKey] = {
                    ...apiCache.current[cacheKey],
                    avakhadaDetails: res.data,
                };
                setIsLoading(false);
            })
            .catch(e => {
                setIsLoading(false);
                console.log(`astro_details error ${e}`);
            });
    }
    const fetchKalsarpaDetails = () => {
        const cacheKey = getCacheKey();
        if (apiCache.current[cacheKey]?.kalsarpaDetails) {
            setKalsarpaDetails(apiCache.current[cacheKey].kalsarpaDetails);
            return;
        }
        const username = ASTRO_USERID;
        const password = ASTRO_APIKEY;
        const basicAuth = 'Basic ' + base64.encode(`${username}:${password}`);
        const [day, month, year] = date.split('-');
        const [hour, minute] = time.split(':');
        const option = {
            "day": day,
            "month": month,
            "year": year,
            "hour": hour,
            "min": minute,
            "lat": locationLat,
            "lon": locationLong,
            "tzone": timeZone
        }
        axios.post(`${ASTRO_API_URL}/kalsarpa_details`, option, {
            headers: {
                Accept: 'application/json',
                Authorization: basicAuth, // Add Basic Auth here
            },
        })
            .then(res => {
                setKalsarpaDetails(res.data)
                apiCache.current[cacheKey] = {
                    ...apiCache.current[cacheKey],
                    kalsarpaDetails: res.data,
                };
                setIsLoading(false);
            })
            .catch(e => {
                setIsLoading(false);
                console.log(`kalsarpa_details error ${e}`);
            });
    }
    const fetchChartImg = () => {
        const cacheKey = getCacheKey();
        if (apiCache.current[cacheKey]?.svgData) {
            setSvgData(apiCache.current[cacheKey].svgData);
            return;
        }
        const username = ASTRO_USERID;
        const password = ASTRO_APIKEY;
        const basicAuth = 'Basic ' + base64.encode(`${username}:${password}`);
        const [day, month, year] = date.split('-');
        const [hour, minute] = time.split(':');
        const option = {
            "day": day,
            "month": month,
            "year": year,
            "hour": hour,
            "min": minute,
            "lat": locationLat,
            "lon": locationLong,
            "tzone": timeZone
        }
        axios.post(`${ASTRO_API_URL}/horo_chart_image/:chartId`, option, {
            headers: {
                Accept: 'application/json',
                Authorization: basicAuth, // Add Basic Auth here
            },
        })
            .then(res => {
                setSvgData(res?.data?.svg)
                apiCache.current[cacheKey] = {
                    ...apiCache.current[cacheKey],
                    svgData: res?.data?.svg,
                };
                setIsLoading(false);
            })
            .catch(e => {
                setIsLoading(false);
                console.log(`horo_chart_image error ${e}`);
            });
    }

    const fetchPlanetDetails = () => {
        const cacheKey = getCacheKey();
        if (apiCache.current[cacheKey]?.planetDetails) {
            setPlanetDetails(apiCache.current[cacheKey].planetDetails);
            return;
        }
        const username = ASTRO_USERID;
        const password = ASTRO_APIKEY;
        const basicAuth = 'Basic ' + base64.encode(`${username}:${password}`);
        const [day, month, year] = date.split('-');
        const [hour, minute] = time.split(':');
        const option = {
            "day": day,
            "month": month,
            "year": year,
            "hour": hour,
            "min": minute,
            "lat": locationLat,
            "lon": locationLong,
            "tzone": timeZone
        }
        axios.post(`${ASTRO_API_URL}/planets`, option, {
            headers: {
                Accept: 'application/json',
                Authorization: basicAuth, // Add Basic Auth here
            },
        })
            .then(res => {
                setPlanetDetails(res.data)
                apiCache.current[cacheKey] = {
                    ...apiCache.current[cacheKey],
                    planetDetails: res.data,
                };
                setIsLoading(false);
            })
            .catch(e => {
                setIsLoading(false);
                console.log(`basic_panchang error ${e}`);
            });
    }

    const renderRow = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.sign}</Text>
            <Text style={styles.cell}>{item.signLord}</Text>
            <Text style={styles.cell}>{`${item.normDegree.toFixed(2)}°`}</Text>
            <Text style={styles.cell}>{item.house}</Text>
        </View>
    );

    const renderRow2 = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.nakshatra}</Text>
            <Text style={styles.cell}>{item.nakshatraLord}</Text>
            <Text style={styles.cell}>{item.house}</Text>
        </View>
    );

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
                                            <Text style={styles.tableHeader3}>{firstname}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Date of Birth</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{date}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Birth Time</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{time}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Location</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{location}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Latitude</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{locationLat}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Longitude</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{locationLong}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Timezone</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>GMT+{timeZone}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Sunrise</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{basicDetails?.sunrise}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Sunset</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{basicDetails?.sunset}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4, { borderBottomWidth: 0, }]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Ayanamsha</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{basicDetails?.ayanamsha}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.flexRowStyle}>
                                    {/* <View style={styles.halfBox}>
                                        <Image
                                            source={mangaldoshaImg}
                                            style={[styles.iconStyle]}
                                        />
                                        <Text style={styles.detailsTitle}>Mangal Dosha</Text>
                                        <View style={[styles.buttonView, { backgroundColor: '#FB7401' }]}>
                                            <Text style={styles.buttonText}>Yes</Text>
                                        </View>
                                    </View> */}
                                    <View style={styles.halfBox}>
                                        <Image
                                            source={kalsarpImg}
                                            style={[styles.iconStyle]}
                                        />
                                        <Text style={styles.detailsTitle}>Kalsarp Dosha</Text>
                                        <View style={[styles.buttonView, { backgroundColor: kalsarpaDetails?.present == false ? "#B1B1B1" : "#FB7401" }]}>
                                            <Text style={styles.buttonText}>{kalsarpaDetails?.present == false ? "No" : "Yes"}</Text>
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
                                            <Text style={styles.tableHeader3}>{panchangDetails?.tithi}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Karan</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{panchangDetails?.karan}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Yog</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{panchangDetails?.yog}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Nakshatra</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{panchangDetails?.nakshatra}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Sunrise</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{panchangDetails?.sunrise}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4, { borderBottomWidth: 0, }]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Sunset</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{panchangDetails?.sunset}</Text>
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
                                            <Text style={styles.tableHeader3}>{avakhadaDetails?.Varna}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Vasya</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{avakhadaDetails?.Vashya}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Yoni</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{avakhadaDetails?.Yoni}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow4}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Gan</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{avakhadaDetails?.Gan}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Nadi</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{avakhadaDetails?.Nadi}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow4, { borderBottomWidth: 0, }]}>
                                        <View style={styles.cellmainlast}>
                                            <Text style={styles.tableHeader2} numberOfLines={1}>Sign</Text>
                                        </View>
                                        <View style={styles.verticleLine}></View>
                                        <View style={styles.cell6}>
                                            <Text style={styles.tableHeader3}>{avakhadaDetails?.sign}</Text>
                                        </View>
                                    </View>
                                </View>
                            </>
                        }
                        {activeTab === 'Charts' &&
                            <>
                                {/* <LagnaChart /> */}
                                <View style={{ alignSelf: 'center' }}>
                                    {svgData ? <SvgXml xml={svgData} width="350" height="350" /> : null}
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={styles.headingText}>Planets</Text>
                                    <View style={[styles.tabContainer, { alignSelf: 'flex-end' }]}>
                                        {tabs2.map((tab) => (
                                            <TouchableOpacity
                                                key={tab.value}
                                                onPress={() => setActiveTab2(tab.value)}
                                                style={[
                                                    styles.tab,
                                                    activeTab2 === tab.value && styles.activeTab,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.tabText,
                                                        activeTab2 === tab.value && styles.activeTabText,
                                                    ]}
                                                >
                                                    {tab.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                                {activeTab2 === 'Sign' &&
                                    <>
                                        <View style={styles.container}>
                                            {/* Header Row */}
                                            <View style={[styles.row, styles.header]}>
                                                <Text style={styles.headerCell}>Planet</Text>
                                                <Text style={styles.headerCell}>Sign</Text>
                                                <Text style={styles.headerCell}>Sign Lord</Text>
                                                <Text style={styles.headerCell}>Degree</Text>
                                                <Text style={styles.headerCell}>House</Text>
                                            </View>

                                            {/* Data Rows */}
                                            <FlatList
                                                data={planetDetails}
                                                renderItem={renderRow}
                                                keyExtractor={(item) => item.id.toString()}
                                            />
                                        </View>
                                    </>
                                }
                                {activeTab2 === 'Nakshatra' &&
                                    <>
                                        <View style={styles.container}>
                                            {/* Header Row */}
                                            <View style={[styles.row, styles.header]}>
                                                <Text style={styles.headerCell}>Planet</Text>
                                                <Text style={styles.headerCell}>Nakshatra</Text>
                                                <Text style={styles.headerCell}>Nakshatra Lord</Text>
                                                <Text style={styles.headerCell}>House</Text>
                                            </View>

                                            {/* Data Rows */}
                                            <FlatList
                                                data={planetDetails}
                                                renderItem={renderRow2}
                                                keyExtractor={(item) => item.id.toString()}
                                            />
                                        </View>
                                    </>
                                }
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
        width: responsiveWidth(91),
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
    },
    headingText: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-bold',
        fontSize: responsiveFontSize(2),
    },
    //planet section
    container: {
        flex: 1,
        //padding: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 10
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    header: {
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 2,
        borderBottomColor: '#E3E3E3',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D'
    },
    headerCell: {
        flex: 1,
        textAlign: 'center',
        fontFamily: 'PlusJakartaSans-bold',
        fontSize: responsiveFontSize(1.8),
        color: '#1E2023'
    },
});
