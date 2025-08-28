import React, { useContext, useState, useRef, useEffect } from 'react';
import {
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
import moment from "moment"
import Toast from 'react-native-toast-message';
import CheckBox from '@react-native-community/checkbox';
import { SafeAreaView } from 'react-native-safe-area-context'

const AddShippingAddress = ({ route }) => {
    const navigation = useNavigation();
    const [firstname, setFirstname] = useState('');
    const [firstNameError, setFirstNameError] = useState('')
    const [mobileno, setMobileno] = useState('');
    const [mobilenoError, setMobilenoError] = useState('')
    const [pincode, setPincode] = useState('')
    const [pincodeError, setpincodeError] = useState('')
    const [city, setCity] = useState('')
    const [cityError, setcityError] = useState('')
    const [flatno, setFlatno] = useState('')
    const [flatnoError, setflatnoError] = useState('')
    const [area, setArea] = useState('')
    const [areaError, setAreaError] = useState('')
    const [landmark, setLandmark] = useState('')

    const [stateList, setStateList] = useState([])

    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const { login, userToken } = useContext(AuthContext);

    const [statevalue, setStateValue] = useState(null);
    const [isStateFocus, setStateIsFocus] = useState(false);


    const [userInfo, setUserInfo] = useState([])

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
        fetchState()
    }, [])
    useFocusEffect(
        React.useCallback(() => {
            fetchState()
        }, [])
    )

    const fetchState = () => {
        AsyncStorage.getItem('userToken', async(err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.get(`${API_URL}/user/states`, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en',
                    //'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    console.log(JSON.stringify(res.data.data), 'fetch state data')
                    if (res.data.response == true) {
                        const transformedData = res.data.data.map(item => ({
                            label: item.state,
                            value: item.state
                        }));
                        setStateList(transformedData)
                        setIsLoading(false)
                    } else {
                        console.log('not okk')
                        setIsLoading(false)
                        Alert.alert('Oops..', res.data.message, [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ]);
                    }
                })
                .catch(e => {
                    setIsLoading(false)
                    console.log(`fetch state error ${e}`)
                    console.log(e.response)
                    Alert.alert('Oops..', e.response?.data?.message, [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                });
        });
    }

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

    const changeMobileno = (text) => {
        setMobileno(text)
        if (text) {
            setMobilenoError('')
        } else {
            setMobilenoError('Please enter Mobile No')
        }
    }
    const changePincode = (text) => {
        setPincode(text)
        if (text) {
            setpincodeError('')
        } else {
            setpincodeError('Please enter pincode')
        }

    }
    const changeCity = (text) => {
        setCity(text)
        if (text) {
            setcityError('')
        } else {
            setcityError('Please enter city')
        }

    }
    const changeFlatno = (text) => {
        setFlatno(text)
        if (text) {
            setflatnoError('')
        } else {
            setflatnoError('Please enter Flat No')
        }
    }

    const changeArea = (text) => {
        setArea(text)
        if (text) {
            setAreaError('')
        } else {
            setAreaError('Please enter Area')
        }
    }

    const changeLandmark = (text) => {
        setLandmark(text)
    }

    const submitForm = () => {

        if (!firstname) {
            setFirstNameError('Please enter name')
        } else if (!mobileno) {
            setMobilenoError('Please enter Mobile No')
        } else if (!pincode) {
            setpincodeError('Please enter pincode')
        } else if (!city) {
            setcityError('Please enter city')
        } else if (!statevalue) {
            setcityError('Please enter State')
        } else if (!flatno) {
            setflatnoError('Please enter Flat No')
        } else if (!area) {
            setAreaError('Please enter Area')
        } else {
            submitForApiCall()
        }
    }

    const submitForApiCall = () => {

        setIsLoading(true)
        const option = {
            "name": firstname,
            "mobile_no": mobileno,
            "pincode": pincode,
            "city": city,
            "state": statevalue,
            "flat_no": flatno,
            "area": area,
            "landmark": landmark,
        }
        console.log(option, 'dhhhdhhd')

        AsyncStorage.getItem('userToken', async(err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.post(`${API_URL}/user/save-address`, option, {
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
                        Toast.show({
                            type: 'success',
                            text1: '',
                            text2: res.data.message,
                            position: 'top',
                            topOffset: Platform.OS == 'ios' ? 55 : 20
                        });
                        navigation.navigate('ShippingAddressList', { productPrice: route?.params?.productPrice, productWeight: route?.params?.productWeight })
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
                    console.log(`save-address error ${e}`)
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


    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader commingFrom={'Add Shipping Address'} onPress={() => navigation.goBack()} title={'Add Shipping Address'} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: responsiveHeight(4) }}>
                <View style={styles.wrapper}>
                    <View style={styles.textinputview}>
                        <View style={styles.inputFieldHeader}>
                            <Text style={styles.header}>Full Name</Text>
                            <Text style={styles.requiredheader}>*</Text>
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
                            <Text style={styles.header}>Mobile Number</Text>
                            <Text style={styles.requiredheader}>*</Text>
                        </View>
                        {mobilenoError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{mobilenoError}</Text> : <></>}
                        <View style={styles.inputView}>
                            <InputField
                                label={'Enter Mobile Number'}
                                keyboardType=" "
                                value={mobileno}
                                //helperText={'Please enter lastname'}
                                inputType={'others'}
                                onChangeText={(text) => changeMobileno(text)}
                            />
                        </View>
                        <View style={styles.inputFieldHeader}>
                            <Text style={styles.header}>Pincode</Text>
                            <Text style={styles.requiredheader}>*</Text>
                        </View>
                        {pincodeError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{pincodeError}</Text> : <></>}
                        <View style={styles.inputView}>
                            <InputField
                                label={'Enter Pincode'}
                                keyboardType=" "
                                value={pincode}
                                //helperText={'Please enter lastname'}
                                inputType={'others'}
                                onChangeText={(text) => changePincode(text)}
                            />
                        </View>
                        {cityError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{cityError}</Text> : <></>}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: responsiveWidth(43) }}>
                                <View style={styles.inputFieldHeader}>
                                    <Text style={styles.header}>City</Text>
                                    <Text style={styles.requiredheader}>*</Text>
                                </View>
                                <InputField
                                    label={'Enter City Name'}
                                    keyboardType=" "
                                    value={city}
                                    //helperText={'Please enter lastname'}
                                    inputType={'small'}
                                    onChangeText={(text) => changeCity(text)}
                                />
                            </View>
                            <View style={{ width: responsiveWidth(43) }}>
                                <View style={styles.inputFieldHeader}>
                                    <Text style={styles.header}>State</Text>
                                    <Text style={styles.requiredheader}>*</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Dropdown
                                        style={[styles.dropdownHalf, isStateFocus && { borderColor: '#DDD' }]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        itemTextStyle={styles.selectedTextStyle}
                                        data={stateList}
                                        //search
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isStateFocus ? 'State' : '...'}
                                        searchPlaceholder="Search..."
                                        value={statevalue}
                                        onFocus={() => setStateIsFocus(true)}
                                        onBlur={() => setStateIsFocus(false)}
                                        onChange={item => {
                                            setStateValue(item.value);
                                            setcityError('')
                                            setStateIsFocus(false);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputFieldHeader}>
                            <Text style={styles.header}>Flat No</Text>
                            <Text style={styles.requiredheader}>*</Text>
                        </View>
                        {flatnoError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{flatnoError}</Text> : <></>}
                        <View style={styles.inputView}>
                            <InputField
                                label={'Enter Flat No'}
                                keyboardType=" "
                                value={flatno}
                                //helperText={'Please enter lastname'}
                                inputType={'others'}
                                onChangeText={(text) => changeFlatno(text)}
                            />
                        </View>
                        <View style={styles.inputFieldHeader}>
                            <Text style={styles.header}>Area/Locality</Text>
                            <Text style={styles.requiredheader}>*</Text>
                        </View>
                        {areaError ? <Text style={{ color: 'red', fontFamily: 'PlusJakartaSans-Regular' }}>{areaError}</Text> : <></>}
                        <View style={styles.inputView}>
                            <InputField
                                label={'Area'}
                                keyboardType=" "
                                value={area}
                                //helperText={'Please enter lastname'}
                                inputType={'others'}
                                onChangeText={(text) => changeArea(text)}
                            />
                        </View>
                        <View style={styles.inputFieldHeader}>
                            <Text style={styles.header}>Landmark</Text>
                            {/* <Text style={styles.requiredheader}>*</Text> */}
                        </View>
                        <View style={styles.inputView}>
                            <InputField
                                label={'Landmark'}
                                keyboardType=" "
                                value={landmark}
                                //helperText={'Please enter lastname'}
                                inputType={'others'}
                                onChangeText={(text) => changeLandmark(text)}
                            />
                        </View>
                    </View>

                </View>

            </KeyboardAwareScrollView>
            <View style={styles.buttonwrapper}>
                <CustomButton label={"Submit"}
                    // onPress={() => { login() }}
                    onPress={() => { submitForm() }}
                />
            </View>
        </SafeAreaView >
    );
};

export default AddShippingAddress;

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
    dateView: { height: responsiveHeight(7), width: responsiveWidth(42), borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: responsiveHeight(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 },
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
        height: responsiveHeight(7.2),
        width: responsiveWidth(91),
        borderColor: '#DDD',
        borderWidth: 0.7,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 5,
        marginBottom: responsiveHeight(2)
    },
    dropdownHalf: {
        height: responsiveHeight(7),
        width: responsiveWidth(42),
        borderColor: '#DDD',
        borderWidth: 0.7,
        borderRadius: 8,
        paddingHorizontal: 8,
        //marginTop: 5,
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

});
