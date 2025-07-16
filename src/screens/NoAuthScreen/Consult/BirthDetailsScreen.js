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
    ActivityIndicator
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import { useFocusEffect } from '@react-navigation/native';
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import { dateIcon, plus, timeIcon, userPhoto } from '../../../utils/Images';
import { AuthContext } from '../../../context/AuthContext';
import Loader from '../../../utils/Loader';
import axios from 'axios';
import { API_URL } from '@env'
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
import { useNavigation } from '@react-navigation/native';

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

const BirthDetailsScreen = ({ route }) => {
    const navigation = useNavigation();
    const concatNo = route?.params?.countrycode + '-' + route?.params?.phoneno;
    const [firstname, setFirstname] = useState('Jennifer Kourtney');
    const [firstNameError, setFirstNameError] = useState('')
    const [phoneno, setPhoneno] = useState('');
    const [phonenoError, setphonenoError] = useState('')
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('')
    const [location, setLocation] = useState('')
    const [locationError, setLocationError] = useState('')
    const [pickedDocument, setPickedDocument] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [toggleCheckBox, setToggleCheckBox] = useState(false)

    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [isPicUploadLoading, setIsPicUploadLoading] = useState(false);
    const { login, userToken } = useContext(AuthContext);

    const [yearvalue, setYearValue] = useState(null);
    const [isYearFocus, setYearIsFocus] = useState(false);

    const [monthvalue, setMonthValue] = useState(null);
    const [isMonthFocus, setMonthIsFocus] = useState(false);

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

    const [reason, setReason] = useState('')


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


    const fetchUserData = () => {
        setIsLoading(true)
        AsyncStorage.getItem('userToken', (err, usertoken) => {
            console.log(usertoken, 'usertoken')
            axios.post(`${API_URL}/patient/profile`, {}, {
                headers: {
                    "Authorization": `Bearer ${usertoken}`,
                    "Content-Type": 'application/json'
                },
            })
                .then(res => {
                    let userInfo = res.data.data;
                    console.log(userInfo, 'user data from profile api ')
                    setFirstname(userInfo?.name)
                    setEmail(userInfo?.email)
                    setPhoneno(userInfo?.mobile)
                    setDate(userInfo?.dob)
                    setYearValue(userInfo?.gender)
                    setMonthValue(userInfo?.marital_status)
                    setImageFile(userInfo?.profile_pic)
                    setIsLoading(false)
                })
                .catch(e => {
                    console.log(`Profile error ${e}`)
                    setIsLoading(false)
                });
        });
    }

    useEffect(() => {
        //fetchUserData();
    }, [])
    useFocusEffect(
        React.useCallback(() => {
            //fetchUserData()
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
            setFirstNameError('Please enter First name')
        }
    }

    const changePhone = (text) => {
        const phoneRegex = /^\d{10}$/;
        setPhoneno(text)
        if (!phoneRegex.test(text)) {
            setphonenoError('Please enter a 10-digit number.')
        } else {
            setphonenoError('')
        }
    }

    const changeEmail = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(text) === false) {
            console.log("Email is Not Correct");
            setEmail(text)
            setEmailError('Please enter correct Email Id')
            return false;
        }
        else {
            setEmailError('')
            console.log("Email is Correct");
            setEmail(text)
        }
    }

    const changeLocation = (text) => {
        setLocation(text)
    }


    const submitForm = () => {
        //console.log(selectedItemsType, " type off therapist")
        if (!firstname) {
            setFirstNameError('Please enter Name')
        } else if (!phoneno) {
            setphonenoError('Please enter Mobile No')
        } else if (!email) {
            setEmailError('Please enter Email Id')
        } else if (date == 'DD - MM  - YYYY') {
            setdobError('Please enter DOB')
        } else {
            setIsLoading(true)
            const option = {
                "name": firstname,
                "email": email,
                "dob": moment(date, "DD-MM-YYYY").format("YYYY-MM-DD"),
                "gender": yearvalue,
                "marital_status": monthvalue,
                //"mobile": "7797599595"
            }
            console.log(option, 'dhhhdhhd')
            AsyncStorage.getItem('userToken', (err, usertoken) => {
                axios.post(`${API_URL}/patient/registration`, option, {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": 'Bearer ' + usertoken,
                    },
                })
                    .then(res => {
                        console.log(res.data)
                        if (res.data.response == true) {
                            setIsLoading(false)
                            Toast.show({
                                type: 'success',
                                text1: 'Hello',
                                text2: "Profile data updated successfully",
                                position: 'top',
                                topOffset: Platform.OS == 'ios' ? 55 : 20
                            });
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
    }



    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader commingFrom={'Share Birth Details'} onPress={() => navigation.goBack()} title={'Share Birth Details'} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: responsiveHeight(4) }}>
                <View style={styles.wrapper}>
                    <View style={{ marginTop: responsiveHeight(1) }}>
                        <Text style={{ color: '#8B939D', fontFamily: 'PlusJakartaSans-Regular', fontSize: responsiveFontSize(1.7) }}>To share it with your astrologer, to save time on consultation</Text>
                    </View>
                    <View style={styles.textinputview}>
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
                        <View style={styles.inputFieldHeader}>
                            <Text style={styles.header}>Gender</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Dropdown
                                style={[styles.dropdownHalf, isYearFocus && { borderColor: '#DDD' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                itemTextStyle={styles.selectedTextStyle}
                                data={dataGender}
                                //search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isYearFocus ? 'Select Gender' : '...'}
                                searchPlaceholder="Search..."
                                value={yearvalue}
                                onFocus={() => setYearIsFocus(true)}
                                onBlur={() => setYearIsFocus(false)}
                                onChange={item => {
                                    setYearValue(item.value);
                                    setYearIsFocus(false);
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: responsiveWidth(43) }}>
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
                            <View style={{ width: responsiveWidth(43) }}>
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
                        <View style={styles.termsView}>
                            <View style={styles.checkboxContainer}>
                                <CheckBox
                                    disabled={false}
                                    value={toggleCheckBox}
                                    onValueChange={(newValue) => setToggleCheckBox(newValue)}
                                    tintColors={{ true: '#FB7401', false: '#444343' }}
                                />
                            </View>
                            <Text style={styles.termsText}>Don’t know my exact birth time</Text>
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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: responsiveWidth(43) }}>
                                <View style={styles.inputFieldHeader}>
                                    <Text style={styles.header}>Marital Status</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Dropdown
                                        style={[styles.dropdownHalf, isMonthFocus && { borderColor: '#DDD' }]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        itemTextStyle={styles.selectedTextStyle}
                                        data={dataMarital}
                                        //search
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isMonthFocus ? 'Marital Status' : '...'}
                                        searchPlaceholder="Search..."
                                        value={monthvalue}
                                        onFocus={() => setMonthIsFocus(true)}
                                        onBlur={() => setMonthIsFocus(false)}
                                        onChange={item => {
                                            setMonthValue(item.value);
                                            setMonthIsFocus(false);
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{ width: responsiveWidth(43) }}>
                                <View style={styles.inputFieldHeader}>
                                    <Text style={styles.header}>Occupation</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Dropdown
                                        style={[styles.dropdownHalf, isMonthFocus && { borderColor: '#DDD' }]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        itemTextStyle={styles.selectedTextStyle}
                                        data={dataMarital}
                                        //search
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isMonthFocus ? 'Occupation' : '...'}
                                        searchPlaceholder="Search..."
                                        value={monthvalue}
                                        onFocus={() => setMonthIsFocus(true)}
                                        onBlur={() => setMonthIsFocus(false)}
                                        onChange={item => {
                                            setMonthValue(item.value);
                                            setMonthIsFocus(false);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputFieldHeader}>
                            <Text style={styles.header}>What would you like to consult with</Text>
                        </View>
                        <View style={styles.inputView}>
                            <InputField
                                label={'Consult reason'}
                                keyboardType=" "
                                value={reason}
                                //helperText={'Please enter lastname'}
                                inputType={'others'}
                                onChangeText={(text) => setReason(text)}
                            />
                        </View>
                    </View>

                </View>

            </KeyboardAwareScrollView>
            <View style={styles.buttonwrapper}>
                <CustomButton label={"Proceed Chat"}
                    // onPress={() => { login() }}
                    onPress={() => { toggleModal() }}
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

                        <Text style={styles.title}>No Refund Available</Text>

                        <Text style={styles.rechargeInfo}>
                            We regret to inform you that if you choose to cancel a session, no refund will be issued. Thank you for your understanding!
                        </Text>

                        <TouchableOpacity style={styles.rechargeButton} onPress={() => navigation.navigate('ChatScreen')}>
                            <Text style={styles.rechargeButtonText}>Proceed Chat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView >
    );
};

export default BirthDetailsScreen;

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
    dateView: { height: responsiveHeight(7), width: responsiveWidth(42), borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: responsiveHeight(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 },
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
        borderRadius: 5
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
        borderRadius: 5,
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
    dropdownHalf: {
        height: responsiveHeight(7.2),
        width: responsiveWidth(42),
        borderColor: '#DDD',
        borderWidth: 0.7,
        borderRadius: 5,
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
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    rechargeButtonText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(1.7),
    },

});
