import React, { useContext, useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    BackHandler
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import { dateIcon, plus, timeIcon, userPhoto } from '../../../utils/Images';
import { AuthContext } from '../../../context/AuthContext';
import Loader from '../../../utils/Loader';
import axios from 'axios';
import { API_URL, GOOGLE_PLACE_KEY } from '@env'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomHeader from '../../../components/CustomHeader';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from 'react-native-element-dropdown';
import Modal from "react-native-modal";
import Entypo from 'react-native-vector-icons/Entypo';
import RNDateTimePicker from '@react-native-community/datetimepicker' 
import moment from "moment"
import Toast from 'react-native-toast-message';
import CheckBox from '@react-native-community/checkbox';
import messaging from '@react-native-firebase/messaging';
import { withTranslation, useTranslation } from 'react-i18next';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const dataGender = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Others', value: 'Others' }
];
const dataMarital = [
    { label: 'Married', value: 'Married' },
    { label: 'Single', value: 'Single' },
    { label: 'Divorced', value: 'Divorced' },
    { label: 'Widowed', value: 'Widowed' }
];
const dataOccupation = [
    { label: 'Profession', value: 'Profession' },
    { label: 'Employment', value: 'Employment' },
    { label: 'Business', value: 'Business' },
    { label: 'Education', value: 'Education' }
];

const BirthDetailsScreen = ({ route }) => {
    const navigation = useNavigation();
    const autocompleteRef = useRef(null);
    const { t, i18n } = useTranslation();
    const [firstname, setFirstname] = useState('');
    const [firstNameError, setFirstNameError] = useState('')
    const [location, setLocation] = useState('')
    const [locationError, setLocationError] = useState('')

    const [toggleCheckBox, setToggleCheckBox] = useState(false)

    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const { login, userToken } = useContext(AuthContext);

    const [yearvalue, setYearValue] = useState(null);
    const [genderError, setgenderError] = useState(null);
    const [isYearFocus, setYearIsFocus] = useState(false);

    const [maritalvalue, setMaritalValue] = useState(null);
    const [isMaritalFocus, setMaritalIsFocus] = useState(false);

    const [occupationvalue, setOccupationValue] = useState(null);
    const [isOccupationFocus, setOccupationIsFocus] = useState(false);

    const MIN_DATE = new Date(1930, 0, 1)
    const MAX_DATE = new Date()
    const [date, setDate] = useState('DD-MM-YYYY')
    const [selectedDOB, setSelectedDOB] = useState(MAX_DATE)
    const [open, setOpen] = useState(false)
    const [dobError, setdobError] = useState('')

    const [time, setTime] = useState('HH:MM')
    const [selectedDOT, setSelectedDOT] = useState(MAX_DATE)
    const [open2, setOpen2] = useState(false)
    const [dotError, setdotError] = useState('')

    const [reason, setReason] = useState('')
    const [resonError, setResonError] = useState('')

    const [userInfo, setUserInfo] = useState([])

    const [waitingForAstrologer, setWaitingForAstrologer] = useState(false);

    const [tempDOB, setTempDOB] = useState(selectedDOB); // For iOS date picker
    const [tempDOT, setTempDOT] = useState(selectedDOT); // For iOS time picker

    const handleAlert = (title, message) => {
        Alert.alert(title, message, [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
    };
    useEffect(() => {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
            const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
                const parsevalue = JSON.parse(remoteMessage?.data?.data)
                console.log(parsevalue, 'parsevalue')
                if (remoteMessage?.data?.screen === 'Session') {
                    if (parsevalue.session_status == '3') {
                        setWaitingForAstrologer(false);
                        alert("Astrologer are unavailabe to pickup the call/chat")
                    } else if (parsevalue.session_status == '1') {
                        setWaitingForAstrologer(false);
                        const option2 = {
                            "astrologer_id": route?.params?.astrologerId,
                            "full_name": firstname,
                            "gender": yearvalue,
                            "date_of_birth": moment(date, "DD-MM-YYYY").format("YYYY-MM-DD"),
                            "time_of_birth": time,
                            "place_of_birth": location,
                            "martial_status": maritalvalue,
                            "occupation": occupationvalue,
                            "consult_id": reason
                        }
                        console.log(parsevalue, 'details param console')
                        console.log(option2, 'details2 param console')
                        navigation.push("ChatScreen", { commingFrom: route?.params?.comingFrom == 'from_chat' ? "from_chat" : "from_call", details: parsevalue, details2: option2 })
                    }
                }
                console.log('Received foreground message:', remoteMessage);

            });

            const unsubscribeBackground = messaging().setBackgroundMessageHandler(async remoteMessage => {
                console.log('Received background message:', remoteMessage);

            });

            return () => {
                unsubscribeForeground();
                //unsubscribeBackground();
            };
        }
    }, [])

    const fetchUserData = () => {
        AsyncStorage.getItem('userToken', async (err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            setIsLoading(true);
            axios.get(`${API_URL}/user/personal-information`, {
                headers: {
                    "Authorization": `Bearer ${usertoken}`,
                    "Content-Type": 'application/json',
                    "Accept-Language": savedLang || 'en',
                },
            })
                .then(res => {
                    //console.log(res.data,'user details')
                    let userInfo = res.data.data;
                    console.log(userInfo, 'userInfo from Birth details page')
                    setUserInfo(userInfo)
                    setFirstname(userInfo?.full_name)
                    setYearValue(userInfo?.gender)
                    setDate(userInfo?.dob)
                    setTime(userInfo?.dot != null ? userInfo?.dot : 'HH:MM')
                    setLocation(userInfo?.pob)
                    setMaritalValue(userInfo?.merital_status)
                    setOccupationValue("")
                    setReason("")
                    setIsLoading(false);
                })
                .catch(e => {
                    console.log(`Login error ${e}`)
                    console.log(e.response?.data?.message)
                });
        });
    }

    useEffect(() => {
        fetchUserData();
    }, [])
    useFocusEffect(
        React.useCallback(() => {
            setModalVisible(false)
            fetchUserData()
        }, [])
    )

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const changeFirstname = (text) => {
        setFirstname(text)
        if (text) {
            setFirstNameError('')
        } else {
            setFirstNameError(t('birthdetails.Pleaseentername'))
        }
    }
    const changeLocation = (text) => {
        setLocation(text)
        if (text) {
            setLocationError('')
        } else {
            setLocationError(t('birthdetails.Pleaseenterplaceofbirth'))
        }

    }
    const changeReson = (text) => {
        setReason(text)
        if (text) {
            setResonError('')
        } else {
            setResonError(t('birthdetails.Pleaseenterreson'))
        }
    }

    const submitForm = () => {
        if (!firstname) {
            setFirstNameError(t('birthdetails.Pleaseentername'))
        } else if (!yearvalue) {
            setgenderError(t('birthdetails.Pleaseselectgender'))
        } else if (date == 'DD-MM-YYYY') {
            setdobError(t('birthdetails.PleaseenterDate'))
        } else if (time == 'HH:MM') {
            setdotError(t('birthdetails.Pleaseentertime'))
        } else if (!location) {
            setLocationError(t('birthdetails.Pleaseenterplaceofbirth'))
        } else {
            toggleModal()
        }
    }

    const submitForApiCall = () => {

        setIsLoading(true)
        const option = {
            "astrologer_id": route?.params?.astrologerId,
            "full_name": firstname,
            "gender": yearvalue,
            "date_of_birth": moment(date, "DD-MM-YYYY").format("YYYY-MM-DD"),
            "time_of_birth": time,
            "place_of_birth": location,
            "martial_status": maritalvalue,
            "occupation": occupationvalue,
            "consult_id": reason
        }
        console.log(option, 'dhhhdhhd')

        // navigation.navigate("ChatScreen", { commingFrom: route?.params?.comingFrom == 'from_chat' ? "from_chat" : "from_call", details: option })

        AsyncStorage.getItem('userToken', async (err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.post(`${API_URL}/user/share-birth-details`, option, {
                headers: {
                    Accept: 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en',
                },
            })
                .then(res => {
                    console.log(res.data)
                    if (res.data.response == true) {
                        setIsLoading(false)
                        toggleModal()
                        beforeSessionCheckAPI(res?.data?.data?.id)
                    } else {
                        console.log('not okk')
                        setIsLoading(false)
                        Alert.alert('Oops..', "Something went wrong", [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ]);
                    }
                })
                .catch(e => {
                    setIsLoading(false)
                    console.log(`user update error ${e}`)
                    console.log(e.response.data?.response.records)
                    Alert.alert('Oops..', e.response?.data?.message, [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                });
        });
    }

    const beforeSessionCheckAPI = async (id) => {

        setIsLoading(true)
        const option = {
            astrologer_id: route?.params?.astrologerId,
            chat: route?.params?.comingFrom === "from_chat" ? '1' : '0',
            call: route?.params?.comingFrom !== "from_chat" ? '1' : '0',
            share_birthdetails_id: id
        };
        console.log(option, 'payload for save-session api');

        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            if (!userToken) {
                throw new Error('User token not found');
            }

            const response = await axios.post(`${API_URL}/user/save-session`, option, {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + userToken,
                    "Accept-Language": savedLang || 'en',
                },
            });

            if (response.data.response) {
                console.log(response.data, 'response after save session');

                setIsLoading(false);
                setWaitingForAstrologer(true);
                //navigation.navigate("ChatScreen", { commingFrom: route?.params?.comingFrom == 'from_chat' ? "from_chat" : "from_call", details:option2 })
            } else {
                setIsLoading(false);
                Alert.alert('Oops..', response.data.message || "Something went wrong", [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => navigation.navigate('WalletRechargeScreen') },
                ]);
            }
        } catch (error) {
            setIsLoading(false);
            console.log(`Error: ${error}`);
            console.log(`Error: ${error.response?.data?.message}`);
            Alert.alert('Oops..', error.response?.data?.message || 'Something went wrong', [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        }
    };

    useEffect(() => {
        if (waitingForAstrologer) {
            const backAction = () => {
              // If you want to block back press:
              return true;
      
              // OR if you want to navigate back instead:
              // navigation.goBack();
              // return true;
            };
      
            const backHandler = BackHandler.addEventListener(
              'hardwareBackPress',
              backAction
            );
      
            return () => backHandler.remove();
          }
    }, [waitingForAstrologer]);

    if (isLoading) {
        return (
            <Loader />
        )
    }

   

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader commingFrom={'Share Birth Details'} onPress={() => navigation.goBack()} title={t('birthdetails.ShareBirthDetails')} />
            <ScrollView style={styles.wrapper} keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ marginTop: responsiveHeight(1) }}>
                    <Text style={{ color: '#8B939D', fontFamily: 'PlusJakartaSans-Regular', fontSize: responsiveFontSize(1.7) }}>{t('birthdetails.desc')}</Text>
                </View>
                <View style={styles.textinputview}>
                    <View style={styles.inputFieldHeader}>
                        <Text style={styles.header}>{t('birthdetails.FullName')}</Text>
                        <Text style={styles.requiredheader}>*</Text>
                    </View>
                    {firstNameError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{firstNameError}</Text> : <></>}
                    <View style={styles.inputView}>
                        <InputField
                            label={t('birthdetails.Firstname')}
                            keyboardType=" "
                            value={firstname}
                            //helperText={'Please enter lastname'}
                            inputType={'others'}
                            onChangeText={(text) => changeFirstname(text)}
                        />
                    </View>
                    <View style={styles.inputFieldHeader}>
                        <Text style={styles.header}>{t('birthdetails.Gender')}</Text>
                        <Text style={styles.requiredheader}>*</Text>
                    </View>
                    {genderError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{genderError}</Text> : <></>}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Dropdown
                            style={[styles.dropdownFull, isYearFocus && { borderColor: '#DDD' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            itemTextStyle={styles.selectedTextStyle}
                            data={dataGender}
                            //search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isYearFocus ? t('birthdetails.SelectGender') : '...'}
                            searchPlaceholder="Search..."
                            value={yearvalue}
                            onFocus={() => setYearIsFocus(true)}
                            onBlur={() => setYearIsFocus(false)}
                            onChange={item => {
                                setYearValue(item.value);
                                setgenderError('')
                                setYearIsFocus(false);
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: responsiveWidth(43) }}>
                            <View style={styles.inputFieldHeader}>
                                <Text style={styles.header}>{t('birthdetails.DateofBirth')}</Text>
                                <Text style={styles.requiredheader}>*</Text>
                            </View>
                            {dobError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{dobError}</Text> : <></>}
                            <TouchableOpacity onPress={() => {
                                if (Platform.OS === 'ios') setTempDOB(selectedDOB);
                                setOpen(true);
                            }}>
                                <View style={styles.dateView}>
                                    <Text style={styles.dayname}>  {date}</Text>
                                    <Image source={dateIcon} style={styles.iconStyle} tintColor={'#7F8896'} />
                                </View>
                            </TouchableOpacity>
                            {open == true ?
                                Platform.OS === 'android' ? (
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
                                                setOpen(false)
                                                setSelectedDOB(selectedDate);
                                                setDate(formattedDate);
                                                setdobError('')
                                            } else {
                                                setOpen(false)
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
                            : null}
                        </View>
                        <View style={{ width: responsiveWidth(43) }}>
                            <View style={styles.inputFieldHeader}>
                                <Text style={styles.header}>{t('birthdetails.TimeofBirth')}</Text>
                                <Text style={styles.requiredheader}>*</Text>
                            </View>
                            {dotError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{dotError}</Text> : <></>}
                            <TouchableOpacity onPress={() => {
                                if (Platform.OS === 'ios') setTempDOT(selectedDOT);
                                setOpen2(true);
                            }}>
                                <View style={styles.dateView}>
                                    <Text style={styles.dayname}>  {time}</Text>
                                    <Image source={timeIcon} style={styles.iconStyle} tintColor={'#7F8896'} />
                                </View>
                            </TouchableOpacity>
                            {open2 == true ?
                                Platform.OS === 'android' ? (
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
                                                setOpen2(false);
                                                setSelectedDOT(selectedDate);
                                                setTime(formattedTime);
                                                setdotError('');
                                            } else {
                                                setOpen2(false)
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
                                                setdotError('');
                                            }}
                                        >
                                            <Text style={{color: '#000', fontWeight: 'bold'}}>Done</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            : null}
                        </View>
                    </View>
                    {/* <View style={styles.termsView}>
                            <View style={styles.checkboxContainer}>
                                <CheckBox
                                    disabled={false}
                                    value={toggleCheckBox}
                                    onValueChange={(newValue) => setToggleCheckBox(newValue)}
                                    tintColors={{ true: '#FB7401', false: '#444343' }}
                                />
                            </View>
                            <Text style={styles.termsText}>Don't know my exact birth time</Text>
                        </View> */}
                    <View style={styles.inputFieldHeader}>
                        <Text style={styles.header}>{t('birthdetails.PlaceofBirth')}</Text>
                        <Text style={styles.requiredheader}>*</Text>
                    </View>
                    {locationError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{locationError}</Text> : <></>}
                    <View style={styles.inputView}>
                        <GooglePlacesAutocomplete
                            placeholder={t('birthdetails.Location')}
                            minLength={2}
                            fetchDetails={true}
                            onPress={(data, details = null) => {
                                setLocation(data.description);
                                setLocationError('');
                            }}
                            query={{
                                key: GOOGLE_PLACE_KEY,
                                language: 'en',
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
                            enablePoweredByContainer={false}
                            debounce={200}
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

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: responsiveWidth(43) }}>
                            <View style={styles.inputFieldHeader}>
                                <Text style={styles.header}>{t('birthdetails.MaritalStatus')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Dropdown
                                    style={[styles.dropdownHalf, isMaritalFocus && { borderColor: '#DDD' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    itemTextStyle={styles.selectedTextStyle}
                                    data={dataMarital}
                                    //search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isMaritalFocus ? t('birthdetails.MaritalStatus') : '...'}
                                    searchPlaceholder="Search..."
                                    value={maritalvalue}
                                    onFocus={() => setMaritalIsFocus(true)}
                                    onBlur={() => setMaritalIsFocus(false)}
                                    onChange={item => {
                                        setMaritalValue(item.value);
                                        setMaritalIsFocus(false);
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ width: responsiveWidth(43) }}>
                            <View style={styles.inputFieldHeader}>
                                <Text style={styles.header}>{t('birthdetails.Occupation')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Dropdown
                                    style={[styles.dropdownHalf, isOccupationFocus && { borderColor: '#DDD' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    itemTextStyle={styles.selectedTextStyle}
                                    data={dataOccupation}
                                    //search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isOccupationFocus ? t('birthdetails.Occupation') : '...'}
                                    searchPlaceholder="Search..."
                                    value={occupationvalue}
                                    onFocus={() => setOccupationIsFocus(true)}
                                    onBlur={() => setOccupationIsFocus(false)}
                                    onChange={item => {
                                        setOccupationValue(item.value);
                                        setOccupationIsFocus(false);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.inputFieldHeader}>
                        <Text style={styles.header}>{t('birthdetails.Whatwouldyouliketoconsultwith')}</Text>
                        {/* <Text style={styles.requiredheader}>*</Text> */}
                    </View>
                    {resonError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{resonError}</Text> : <></>}
                    <View style={styles.inputView}>
                        <InputField
                            label={t('birthdetails.Consultreason')}
                            keyboardType=" "
                            value={reason}
                            //helperText={'Please enter lastname'}
                            inputType={'others'}
                            onChangeText={(text) => changeReson(text)}
                        />
                    </View>
                </View>

            </ScrollView>
            <View style={styles.buttonwrapper}>
                <CustomButton label={route?.params?.comingFrom == 'from_chat' ? t('birthdetails.ProceedChat') : t('birthdetails.ProceedCall')}
                    // onPress={() => { login() }}
                    onPress={() => { submitForm() }}
                />
            </View>
            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={() => toggleModal()}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={() => toggleModal()} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>

                        <Text style={styles.title}>{t('birthdetails.NoRefundAvailable')}</Text>

                        <Text style={styles.rechargeInfo}>
                            {t('birthdetails.norefunddesc')}
                        </Text>

                        <TouchableOpacity style={styles.rechargeButton} onPress={() => submitForApiCall()}>
                            <Text style={styles.rechargeButtonText}>{route?.params?.comingFrom == 'from_chat' ? t('birthdetails.ProceedChat') : t('birthdetails.ProceedCall')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                transparent={true}
                visible={waitingForAstrologer}
                animationType="fade"
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                    {/* Close button */}
            <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setWaitingForAstrologer(false)}
            >
                <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
                        <Text style={styles.title}>Please wait for astrologer response....</Text>
                        <Text style={styles.rechargeInfo}>Do not press back button. Please stay on this page.</Text>
                        <ActivityIndicator size="large" color="#FF6A00" />
                    </View>
                </View>
            </Modal>

        </SafeAreaView >
    );
};

export default withTranslation()(BirthDetailsScreen);

const styles = StyleSheet.create({

    container: {
        //justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    wrapper: {
        paddingHorizontal: 15,
        //height: responsiveHeight(78)
    },
    header1: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(3),
        color: '#2F2F2F',
        marginBottom: responsiveHeight(1),
    },
    header: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        color: '#2F2F2F',
        marginBottom: responsiveHeight(1),
    },
    dateView: { height: responsiveHeight(6), width: responsiveWidth(42), borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: responsiveHeight(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 },
    dayname: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.8),
        color: '#808080',
    },
    requiredheader: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.5),
        color: '#E1293B',
        marginBottom: responsiveHeight(1),
        marginLeft: responsiveWidth(1)
    },
    subheader: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.8),
        fontWeight: '400',
        color: '#808080',
        marginBottom: responsiveHeight(1),
    },
    photoheader: {
        fontFamily: 'Outfit-Bold',
        fontSize: responsiveFontSize(2),
        color: '#2F2F2F'
    },
    imageView: {
        marginTop: responsiveHeight(2)
    },
    imageStyle: {
        height: 90,
        width: 90,
        borderRadius: 45,
        marginBottom: 10
    },
    plusIcon: {
        position: 'absolute',
        top: 0,
        left: 60
    },
    iconStyle: { height: 20, width: 20, resizeMode: 'contain' },
    textinputview: {
        marginBottom: responsiveHeight(10),
        marginTop: responsiveHeight(2)
    },
    inputFieldHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputView: {
        paddingVertical: 1
    },
    buttonwrapper: {
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 0,
        width: responsiveWidth(100),
    },
    searchInput: {
        color: '#333',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 10,
        //borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8
    },
    dropdownMenu: {
        backgroundColor: '#FFF'
    },
    dropdownMenuSubsection: {
        borderBottomWidth: 0,

    },
    mainWrapper: {
        flex: 1,
        marginTop: responsiveHeight(1)

    },
    dropdown: {
        height: responsiveHeight(7.2),
        borderColor: '#DDD',
        borderWidth: 0.7,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 5,
        marginBottom: responsiveHeight(4)
    },
    placeholderStyle: {
        fontSize: responsiveFontSize(1.8),
        color: '#2F2F2F',
        fontFamily: 'PlusJakartaSans-Regular'
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#2F2F2F'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: '#2F2F2F'
    },
    dropdownFull: {
        height: responsiveHeight(6),
        width: responsiveWidth(91),
        borderColor: '#DDD',
        borderWidth: 0.7,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 5,
        marginBottom: responsiveHeight(2)
    },
    dropdownHalf: {
        height: responsiveHeight(6),
        width: responsiveWidth(42),
        borderColor: '#DDD',
        borderWidth: 0.7,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 5,
        marginBottom: responsiveHeight(2)
    },
    headerImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10
    },
    mainView: {
        alignSelf: 'center',
        marginTop: responsiveHeight(2)
    },
    loader: {
        position: 'absolute',
    },
    imageContainer: {
        height: 90,
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    flexRowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    termsView: {
        marginBottom: responsiveHeight(2),
        alignItems: 'center',
        flexDirection: 'row',
    },
    termsText: {
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.5),

    },
    checkboxContainer: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        // Adjust the scale values to control the size
    },
    /* modal style  */
    modalOverlay: {
        height: responsiveHeight(100),
        width: responsiveWidth(100),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignSelf: 'center'
    },
    modalContainer: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    closeButtonText: {
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
        color: '8B939D',
    },
    title: {
        fontSize: responsiveFontSize(2),
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Bold',
        marginVertical: responsiveHeight(2),
    },
    rechargeInfo: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D',
        marginBottom: responsiveHeight(4),
        textAlign: 'center',
    },
    rechargeButton: {
        backgroundColor: '#FF6A00',
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    rechargeButtonText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans-Bold',
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
