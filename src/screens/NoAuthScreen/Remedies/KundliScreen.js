import React, { useContext, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, ImageBackground, Image, Platform, Alert, FlatList } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ArrowGratter, ArrowUp, GreenTick, Payment, RedCross, YellowTck, boyDetailsImg, chatColor, dateIcon, femaleIconImg, freebannerPlaceHolder, girlDetailsImg, kundliBannerImg, maleIconImg, matchMakingBanner, notifyImg, othersIconImg, phoneColor, timeIcon, userPhoto } from '../../../utils/Images'
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../../components/CustomButton';
import InputField from '../../../components/InputField';
import Loader from '../../../utils/Loader';
import axios from 'axios';
import { API_URL } from '@env'
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment-timezone';
import RNDateTimePicker from '@react-native-community/datetimepicker'

const KundliScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [firstname, setFirstname] = useState('Jennifer Kourtney');
    const [firstNameError, setFirstNameError] = useState('')
    const [location, setLocation] = useState('')
    const [locationError, setLocationError] = useState('')
    const MIN_DATE = new Date(1930, 0, 1)
    const MAX_DATE = new Date()
    const [date, setDate] = useState('DD - MM  - YYYY')
    const [selectedDOB, setSelectedDOB] = useState(MAX_DATE)
    const [open, setOpen] = useState(false)
    const [dobError, setdobError] = useState('')

    const [time, setTime] = useState(moment().format('HH:mm'))
    const [selectedDOT, setSelectedDOT] = useState(MAX_DATE)
    const [open2, setOpen2] = useState(false)
    const [dotError, setdotError] = useState('')

    const [activeTab, setActiveTab] = useState('Male');
    const tabs = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Others', value: 'Others' },
    ];

    useEffect(() => {

    }, [])
    useFocusEffect(
        React.useCallback(() => {

        }, [])
    )

    const changeFirstname = (text) => {
        setFirstname(text)
        if (text) {
            setFirstNameError('')
        } else {
            setFirstNameError('Please enter First name')
        }
    }
    const changeLocation = (text) => {
        setLocation(text)
    }

    if (isLoading) {
        return (
            <Loader />
        )
    }
    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Add Kundli'} onPress={() => navigation.goBack()} title={'Add Kundli'} />
            <ScrollView style={styles.wrapper}>
                <View style={styles.freebannerContainer}>
                    <Image
                        source={kundliBannerImg}
                        style={styles.freebannerImg}
                    />
                </View>
                <View style={styles.inputFieldHeader}>
                    <Text style={styles.header}>Full Name</Text>
                </View>
                {firstNameError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{firstNameError}</Text> : <></>}
                <View style={styles.inputView}>
                    <InputField
                        label={'First name'}
                        keyboardType=" "
                        value={firstname}
                        //helperText={'Please enter lastname'}
                        inputType={'others'}
                        onChangeText={(text) => changeFirstname(text)}
                    />
                </View>
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
                            <Image
                                source={
                                    tab.value === "Male"
                                        ? maleIconImg
                                        : tab.value === "Female"
                                            ? femaleIconImg
                                            : othersIconImg
                                }
                                style={[styles.iconStyle, { marginLeft: responsiveWidth(1) }]}
                                tintColor={activeTab === tab.value ? '#894F00' : '#7F8896'}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: responsiveWidth(41) }}>
                        <View style={styles.inputFieldHeader}>
                            <Text style={styles.header}>Date of Birth</Text>
                        </View>
                        {dobError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{dobError}</Text> : <></>}
                        <TouchableOpacity onPress={() => setOpen(true)}>
                            <View style={styles.dateView}>
                                <Text style={styles.dayname}>  {date}</Text>
                                <Image source={dateIcon} style={styles.iconStyle} tintColor={'#7F8896'} />
                            </View>
                        </TouchableOpacity>
                        {open == true ?
                            <RNDateTimePicker
                                mode="date"
                                display='spinner'
                                value={selectedDOB}
                                textColor={'#000'}
                                minimumDate={MIN_DATE}
                                // maximumDate={MAX_DATE}
                                themeVariant="light"
                                onChange={(event, selectedDate) => {
                                    if (selectedDate) {
                                        const formattedDate = moment(selectedDate).format('DD-MM-YYYY');
                                        console.log(formattedDate);
                                        setOpen(false)
                                        setSelectedDOB(selectedDate);
                                        setDate(formattedDate);
                                        setdobError('')
                                    } else {
                                        // User canceled the picker
                                        setOpen(false)
                                    }

                                }}
                            /> : null}
                    </View>
                    <View style={{ width: responsiveWidth(41) }}>
                        <View style={styles.inputFieldHeader}>
                            <Text style={styles.header}>Time of Birth</Text>
                        </View>
                        {dotError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{dotError}</Text> : <></>}
                        <TouchableOpacity onPress={() => setOpen2(true)}>
                            <View style={styles.dateView}>
                                <Text style={styles.dayname}>  {time}</Text>
                                <Image source={timeIcon} style={styles.iconStyle} tintColor={'#7F8896'} />
                            </View>
                        </TouchableOpacity>
                        {open2 == true ?
                            <RNDateTimePicker
                                mode="time"
                                display='spinner'
                                value={selectedDOT}
                                textColor={'#000'}
                                minimumDate={MIN_DATE}
                                // maximumDate={MAX_DATE}
                                themeVariant="light"
                                onChange={(event, selectedDate) => {
                                    if (selectedDate) {
                                        const formattedTime = moment(selectedDate).format('HH:mm');
                                        console.log(formattedTime);
                                        setOpen2(false);
                                        setSelectedDOT(selectedDate);
                                        setTime(formattedTime);
                                        setdotError('');
                                    } else {
                                        // User canceled the picker
                                        setOpen2(false)
                                    }

                                }}
                            /> : null}
                    </View>
                </View>
                <View style={styles.inputFieldHeader}>
                    <Text style={styles.header}>Place of Birth</Text>
                </View>
                {locationError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{locationError}</Text> : <></>}
                <View style={styles.inputView}>
                    <InputField
                        label={'Location'}
                        keyboardType=" "
                        value={location}
                        //helperText={'Please enter lastname'}
                        inputType={'others'}
                        onChangeText={(text) => changeLocation(text)}
                    />
                </View>
            </ScrollView>
            <View style={styles.buttonwrapper}>
                <CustomButton label={"View Kundli"}
                    // onPress={() => { login() }}
                    onPress={() => { navigation.navigate('KundliDetailsScreen') }}
                />
            </View>
        </SafeAreaView>
    )
}


export default KundliScreen


const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {
        paddingHorizontal: 15,
        marginBottom: responsiveHeight(8)
    },
    freebannerContainer: {
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(2),
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    freebannerImg: {
        height: responsiveHeight(20),
        width: responsiveWidth(92),
        borderRadius: 6,
        //resizeMode: 'contain',
    },
    headingImg: {
        height: responsiveHeight(5),
        width: responsiveWidth(92),
        marginTop: responsiveHeight(2)
    },
    buttonwrapper: {
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 0,
        width: responsiveWidth(100),
    },
    inputFieldHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputView: {
        paddingVertical: 0,
    },
    header: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        color: '#2F2F2F',
        marginBottom: responsiveHeight(1),
    },
    dateView: { height: responsiveHeight(7), width: responsiveWidth(40), borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: responsiveHeight(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 },
    dayname: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.5),
        color: '#808080',
    },
    iconStyle: { height: 20, width: 20, resizeMode: 'contain' },
    /* tab section */
    tabContainer: {
        flexDirection: 'row',
        //justifyContent: 'space-around',
        marginBottom: responsiveHeight(2),
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#FEF3E5',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
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
});
