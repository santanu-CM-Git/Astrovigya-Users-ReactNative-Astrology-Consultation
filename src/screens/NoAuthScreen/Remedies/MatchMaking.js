import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image, Platform, Alert, FlatList } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ArrowGratter, ArrowUp, GreenTick, Payment, RedCross, YellowTck, boyDetailsImg, chatColor, dateIcon, freebannerPlaceHolder, girlDetailsImg, matchMakingBanner, notifyImg, phoneColor, timeIcon, userPhoto } from '../../../utils/Images'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../../components/CustomButton';
import InputField from '../../../components/InputField';
import Loader from '../../../utils/Loader';
import axios from 'axios';
import { API_URL, GOOGLE_PLACE_KEY } from '@env'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment-timezone';
import RNDateTimePicker from '@react-native-community/datetimepicker'
import LinearGradient from 'react-native-linear-gradient';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SafeAreaView } from 'react-native-safe-area-context'

const MatchMaking = ({  }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false)
    const [firstname, setFirstname] = useState('');
    const [firstNameError, setFirstNameError] = useState('')
    const [firstnamegirl, setFirstnamegirl] = useState('');
    const [firstNameErrorgirl, setFirstNameErrorgirl] = useState('')
    const [location, setLocation] = useState('')
    const [locationLat, setLocationLat] = useState('')
    const [locationLong, setLocationLong] = useState('')
    const [locationError, setLocationError] = useState('')
    const [locationgirl, setLocationgirl] = useState('')
    const [locationLatgirl, setLocationLatgirl] = useState('')
    const [locationLonggirl, setLocationLonggirl] = useState('')
    const [locationErrorgirl, setLocationErrorgirl] = useState('')

    const MIN_DATE = new Date(1930, 0, 1)
    const MAX_DATE = new Date()
    const [date, setDate] = useState('DD - MM  - YYYY')
    const [selectedDOB, setSelectedDOB] = useState(MAX_DATE)
    const [open, setOpen] = useState(false)
    const [dobError, setdobError] = useState('')

    const [dategirl, setDategirl] = useState('DD - MM  - YYYY')
    const [selectedDOBgirl, setSelectedDOBgirl] = useState(MAX_DATE)
    const [opengirl, setOpengirl] = useState(false)
    const [dobErrorgirl, setdobErrorgirl] = useState('')

    const [time, setTime] = useState(moment().format('HH:mm'))
    const [selectedDOT, setSelectedDOT] = useState(MAX_DATE)
    const [open2, setOpen2] = useState(false)
    const [dotError, setdotError] = useState('')

    const [timegirl, setTimegirl] = useState(moment().format('HH:mm'))
    const [selectedDOTgirl, setSelectedDOTgirl] = useState(MAX_DATE)
    const [open2girl, setOpen2girl] = useState(false)
    const [dotErrorgirl, setdotErrorgirl] = useState('')

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

    const changeFirstnamegirl = (text) => {
        setFirstnamegirl(text)
        if (text) {
            setFirstNameErrorgirl('')
        } else {
            setFirstNameErrorgirl('Please enter First name')
        }
    }
    const changeLocationgirl = (text) => {
        setLocationgirl(text)
    }

    const matchmakingSubmit = () => {
        //navigation.navigate('MatchMakingReport')

        console.log(firstname, 'first name boy')
        console.log(date, 'dob boy')
        console.log(time, 'tob boy')
        console.log(location, 'location boy')
        console.log(locationLat, 'lat boy');
        console.log(locationLong, 'long boy');
        
        console.log(firstnamegirl,'first name girl')
        console.log(dategirl,'dob girl')
        console.log(timegirl, 'tob girl')
        console.log(locationgirl,'location girl')
        console.log(locationLatgirl,'lat girl');
        console.log(locationLonggirl,'long girl');
    }

    if (isLoading) {
        return (
            <Loader />
        )
    }
    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Match Making'} onPress={() => navigation.goBack()} title={'Match Making'} />
            <ScrollView style={styles.wrapper} keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.freebannerContainer}>
                    <Image
                        source={matchMakingBanner}
                        style={styles.freebannerImg}
                    />
                </View>
                <LinearGradient
                    colors={['#FDEEDA', '#FEF7EF', '#FFFCF8', '#FFFFFF']} // Example colors, replace with your desired gradient
                    locations={[0, 1, 1, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.headingSection}
                >
                    <Text style={styles.headerText}>Boy Details</Text>
                </LinearGradient>
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: responsiveWidth(41) }}>
                        <View style={styles.inputFieldHeader}>
                            <Text style={styles.header}>Date of Birth</Text>
                        </View>
                        {dobError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{dobError}</Text> : <></>}
                        <TouchableOpacity onPress={() => setOpen(true)}>
                            <View style={styles.dateView}>
                                <Text style={styles.dayname}>  {date}</Text>
                                <Image source={dateIcon} style={styles.iconStyle} />
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
                                <Image source={timeIcon} style={styles.iconStyle} />
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
                <View style={[styles.inputView,{ flex: 1 }]}>
                    {/* <InputField
                        label={'Location'}
                        keyboardType=" "
                        value={location}
                        //helperText={'Please enter lastname'}
                        inputType={'others'}
                        onChangeText={(text) => changeLocation(text)}
                    /> */}
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
                               
                            },
                        }}
                    />
                </View>
                <LinearGradient
                    colors={['#FDEEDA', '#FEF7EF', '#FFFCF8', '#FFFFFF']} // Example colors, replace with your desired gradient
                    locations={[0, 1, 1, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.headingSection}
                >
                    <Text style={styles.headerText}>Girl Details</Text>
                </LinearGradient>
                <View style={styles.inputFieldHeader}>
                    <Text style={styles.header}>Full Name</Text>
                </View>
                {firstNameErrorgirl ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{firstNameErrorgirl}</Text> : <></>}
                <View style={styles.inputView}>
                    <InputField
                        label={'First name'}
                        keyboardType=" "
                        value={firstnamegirl}
                        //helperText={'Please enter lastname'}
                        inputType={'others'}
                        onChangeText={(text) => changeFirstnamegirl(text)}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: responsiveWidth(41) }}>
                        <View style={styles.inputFieldHeader}>
                            <Text style={styles.header}>Date of Birth</Text>
                        </View>
                        {dobErrorgirl ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{dobErrorgirl}</Text> : <></>}
                        <TouchableOpacity onPress={() => setOpengirl(true)}>
                            <View style={styles.dateView}>
                                <Text style={styles.dayname}>  {dategirl}</Text>
                                <Image source={dateIcon} style={styles.iconStyle} tintColor={'#7F8896'} />
                            </View>
                        </TouchableOpacity>
                        {opengirl == true ?
                            <RNDateTimePicker
                                mode="date"
                                display='spinner'
                                value={selectedDOBgirl}
                                textColor={'#000'}
                                minimumDate={MIN_DATE}
                                // maximumDate={MAX_DATE}
                                themeVariant="light"
                                onChange={(event, selectedDate) => {
                                    if (selectedDate) {
                                        const formattedDate = moment(selectedDate).format('DD-MM-YYYY');
                                        console.log(formattedDate);
                                        setOpengirl(false)
                                        setSelectedDOBgirl(selectedDate);
                                        setDategirl(formattedDate);
                                        setdobErrorgirl('')
                                    } else {
                                        // User canceled the picker
                                        setOpengirl(false)
                                    }

                                }}
                            /> : null}
                    </View>
                    <View style={{ width: responsiveWidth(41) }}>
                        <View style={styles.inputFieldHeader}>
                            <Text style={styles.header}>Time of Birth</Text>
                        </View>
                        {dotErrorgirl ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{dotErrorgirl}</Text> : <></>}
                        <TouchableOpacity onPress={() => setOpen2girl(true)}>
                            <View style={styles.dateView}>
                                <Text style={styles.dayname}>  {timegirl}</Text>
                                <Image source={timeIcon} style={styles.iconStyle} tintColor={'#7F8896'} />
                            </View>
                        </TouchableOpacity>
                        {open2girl == true ?
                            <RNDateTimePicker
                                mode="time"
                                display='spinner'
                                value={selectedDOTgirl}
                                textColor={'#000'}
                                minimumDate={MIN_DATE}
                                // maximumDate={MAX_DATE}
                                themeVariant="light"
                                onChange={(event, selectedDate) => {
                                    if (selectedDate) {
                                        const formattedTime = moment(selectedDate).format('HH:mm');
                                        console.log(formattedTime);
                                        setOpen2girl(false);
                                        setSelectedDOTgirl(selectedDate);
                                        setTimegirl(formattedTime);
                                        setdotErrorgirl('');
                                    } else {
                                        // User canceled the picker
                                        setOpen2girl(false)
                                    }

                                }}
                            /> : null}
                    </View>
                </View>
                <View style={styles.inputFieldHeader}>
                    <Text style={styles.header}>Place of Birth</Text>
                </View>
                {locationErrorgirl ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{locationErrorgirl}</Text> : <></>}
                <View style={styles.inputView}>
                    {/* <InputField
                        label={'Location'}
                        keyboardType=" "
                        value={locationgirl}
                        //helperText={'Please enter lastname'}
                        inputType={'others'}
                        onChangeText={(text) => changeLocationgirl(text)}
                    /> */}
                     <GooglePlacesAutocomplete
                        placeholder="Enter Location"
                        minLength={2}
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            console.log('Place data:', data);
                            console.log('Place details:', details);
                            setLocationgirl(details?.formatted_address);
                            setLocationLatgirl(details?.geometry?.location?.lat)
                            setLocationLonggirl(details?.geometry?.location?.lng)
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
                               
                            },
                        }}
                    />
                </View>
            </ScrollView>
            <View style={styles.buttonwrapper}>
                <CustomButton label={"Know Your Score"}
                    onPress={() => { matchmakingSubmit() }}
                //onPress={() => { navigation.navigate('MatchMakingReport') }}
                />
            </View>
        </SafeAreaView>
    )
}


export default MatchMaking


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
    headingSection: {
        height: responsiveHeight(5),
        width: responsiveWidth(50),
        alignSelf: 'center',
        marginTop: responsiveHeight(2),
        borderRadius: 20,
        borderColor: '#FFE8C5',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerText: {
        color: '#894F00',
        fontFamily: 'PlusJakartaSans-SeniBold',
        fontSize: responsiveFontSize(2),
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
