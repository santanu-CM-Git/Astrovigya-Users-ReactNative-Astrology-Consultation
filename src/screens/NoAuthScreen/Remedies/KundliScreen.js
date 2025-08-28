import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image, Platform, Alert, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ArrowGratter, ArrowUp, GreenTick, Payment, RedCross, YellowTck, boyDetailsImg, chatColor, dateIcon, femaleIconImg, freebannerPlaceHolder, girlDetailsImg, kundliBannerImg, maleIconImg, matchMakingBanner, notifyImg, othersIconImg, phoneColor, timeIcon, userPhoto } from '../../../utils/Images'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../../components/CustomButton';
import InputField from '../../../components/InputField';
import Loader from '../../../utils/Loader';
import axios from 'axios';
import { API_URL, GOOGLE_PLACE_KEY } from '@env'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment-timezone';
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SafeAreaView } from 'react-native-safe-area-context'

const KundliScreen = ({  }) => {
    const navigation = useNavigation();
    const autocompleteRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false)
    const [firstname, setFirstname] = useState('');
    const [firstNameError, setFirstNameError] = useState('')
    const [location, setLocation] = useState('')
    const [locationLat, setLocationLat] = useState('')
    const [locationLong, setLocationLong] = useState('')
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
    const [timeError, settimeError] = useState('')
    const [timeZone, setTimeZone] = useState('5.5')

    const [activeTab, setActiveTab] = useState('Male');
    const tabs = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Others', value: 'Others' },
    ];

    const [tempDOB, setTempDOB] = useState(selectedDOB);
    const [tempDOT, setTempDOT] = useState(selectedDOT);

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

    const submitKundliDetails = () => {

        if (!firstname) {
            setFirstNameError('Please enter First name')
        } else if (date == 'DD - MM  - YYYY') {
            setdobError('Please enter Date of birth')
        } else if (!time) {
            settimeError('Please enter Time of birth')
        } else if (!location) {
            setLocationError('Please enter Place of birth')
        } else {
            //navigation.navigate('KundliDetailsScreen')
            // console.log(firstname)
            // console.log(activeTab)
            // console.log(date)
            // console.log(time)
            // console.log(location)
            // console.log(locationLat)
            // console.log(locationLong)
            // console.log(timeZone)
            navigation.navigate('KundliDetailsScreen', {
                firstname,
                date,
                time,
                location,
                locationLat,
                locationLong,
                timeZone,
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
            <CustomHeader commingFrom={'Add Kundli'} onPress={() => navigation.goBack()} title={'Add Kundli'} />
            <ScrollView style={styles.wrapper} keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1 }}>
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
                        label={'Full name'}
                        keyboardType=" "
                        value={firstname}
                        //helperText={'Please enter lastname'}
                        inputType={'others'}
                        onChangeText={(text) => changeFirstname(text)}
                    />
                </View>
                <View style={styles.inputFieldHeader}>
                    <Text style={styles.header}>Place of Birth</Text>
                </View>
                {locationError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{locationError}</Text> : <></>}
                <TouchableWithoutFeedback
                    onPress={() => {
                        Keyboard.dismiss(); // Dismiss keyboard
                        autocompleteRef.current?.setAddressText(location); // Prevent results from disappearing
                    }}
                >
                    <View style={[styles.inputView, { flex: 1 }]} >
                        <GooglePlacesAutocomplete
                            placeholder="Enter Location"
                            minLength={2}
                            fetchDetails={true}
                            onPress={(data, details = null) => {
                                // 'details' is provided when fetchDetails = true
                                console.log('Place data:', data);
                                console.log('Place details:', details);
                                setLocation(details?.formatted_address);
                                setLocationLat(details?.geometry?.location?.lat)
                                setLocationLong(details?.geometry?.location?.lng)
                                setLocationError('')
                            }}
                            onFail={error => console.log(error)}
                            onNotFound={() => console.log('no results')}
                            query={{
                                key: GOOGLE_PLACE_KEY,
                                language: 'en', // language of the results
                            }}
                            styles={{
                                textInput: styles.textInput,
                                listView: styles.listView,
                                description: {
                                    color: '#716E6E', // Text color of the suggestions
                                    fontSize: responsiveFontSize(1.6),
                                    fontFamily: 'PlusJakartaSans-Regular'
                                },
                            }}
                            debounce={200}
                            enablePoweredByContainer={false}
                            textInputProps={{
                                autoCorrect: false,
                                autoCapitalize: 'none',
                                placeholderTextColor: '#999999',
                                onFocus: () => console.log('Input focused'),
                                onBlur: () => {
                                    console.log('Input blurred');
                                    autocompleteRef.current?.focus(); // Refocus input to prevent hiding results
                                },
                            }}
                        />

                    </View>
                </TouchableWithoutFeedback>
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
                        <TouchableOpacity onPress={() => {
                            setTempDOB(selectedDOB);
                            setOpen(true);
                        }}>
                            <View style={styles.dateView}>
                                <Text style={styles.dayname}>  {date}</Text>
                                <Image source={dateIcon} style={styles.iconStyle} tintColor={'#7F8896'} />
                            </View>
                        </TouchableOpacity>
                        {open && (
                            Platform.OS === 'android' ? (
                                <RNDateTimePicker
                                    mode="date"
                                    display="spinner"
                                    value={selectedDOB}
                                    textColor="#000"
                                    minimumDate={MIN_DATE}
                                    themeVariant="light"
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            const formattedDate = moment(selectedDate).format('DD-MM-YYYY');
                                            setOpen(false);
                                            setSelectedDOB(selectedDate);
                                            setDate(formattedDate);
                                            setdobError('');
                                        } else {
                                            setOpen(false);
                                        }
                                    }}
                                />
                            ) : (
                                <View style={{backgroundColor: '#fff', borderRadius: 10, marginTop: 10}}>
                                    <RNDateTimePicker
                                        mode="date"
                                        display="spinner"
                                        value={tempDOB}
                                        textColor="#000"
                                        minimumDate={MIN_DATE}
                                        onChange={(event, selectedDate) => {
                                            if (selectedDate) setTempDOB(selectedDate);
                                        }}
                                    />
                                    <TouchableOpacity
                                        style={{
                                            marginTop: 10,
                                            padding: 10,
                                            backgroundColor: '#EEF8FF',
                                            borderRadius: 5,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: 20,
                                        }}
                                        onPress={() => {
                                            setOpen(false);
                                            setSelectedDOB(tempDOB);
                                            setDate(moment(tempDOB).format('DD-MM-YYYY'));
                                            setdobError('');
                                        }}
                                    >
                                        <Text style={{color: '#000', fontWeight: 'bold'}}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        )}
                    </View>
                    <View style={{ width: responsiveWidth(41) }}>
                        <View style={styles.inputFieldHeader}>
                            <Text style={styles.header}>Time of Birth</Text>
                        </View>
                        {timeError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{timeError}</Text> : <></>}
                        <TouchableOpacity onPress={() => {
                            setTempDOT(selectedDOT);
                            setOpen2(true);
                        }}>
                            <View style={styles.dateView}>
                                <Text style={styles.dayname}>  {time}</Text>
                                <Image source={timeIcon} style={styles.iconStyle} tintColor={'#7F8896'} />
                            </View>
                        </TouchableOpacity>
                        {open2 && (
                            Platform.OS === 'android' ? (
                                <RNDateTimePicker
                                    mode="time"
                                    display="spinner"
                                    value={selectedDOT}
                                    textColor="#000"
                                    themeVariant="light"
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            const formattedTime = moment(selectedDate).format('HH:mm');
                                            setOpen2(false);
                                            setSelectedDOT(selectedDate);
                                            setTime(formattedTime);
                                            settimeError('');
                                        } else {
                                            setOpen2(false);
                                        }
                                    }}
                                />
                            ) : (
                                <View style={{backgroundColor: '#fff', borderRadius: 10, marginTop: 10}}>
                                    <RNDateTimePicker
                                        mode="time"
                                        display="spinner"
                                        value={tempDOT}
                                        textColor="#000"
                                        onChange={(event, selectedDate) => {
                                            if (selectedDate) setTempDOT(selectedDate);
                                        }}
                                    />
                                    <TouchableOpacity
                                        style={{
                                            marginTop: 10,
                                            padding: 10,
                                            backgroundColor: '#EEF8FF',
                                            borderRadius: 5,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: 20,
                                        }}
                                        onPress={() => {
                                            setOpen2(false);
                                            setSelectedDOT(tempDOT);
                                            setTime(moment(tempDOT).format('HH:mm'));
                                            settimeError('');
                                        }}
                                    >
                                        <Text style={{color: '#000', fontWeight: 'bold'}}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        )}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonwrapper}>
                <CustomButton label={"View Kundli"}
                    onPress={() => { submitKundliDetails() }}
                //onPress={() => { navigation.navigate('KundliDetailsScreen') }}
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
        bottom: 10,
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
    dateView: { height: responsiveHeight(6), width: responsiveWidth(40), borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: responsiveHeight(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 },
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
    textInput: {
        height: 50,
        color: '#5d5d5d',
        fontSize: 16,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    listView: {
        backgroundColor: '#fff',
    },
});
