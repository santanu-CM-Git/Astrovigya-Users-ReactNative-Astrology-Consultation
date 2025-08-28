import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image, Platform, Alert, FlatList, TextInput } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { ArrowDown, ArrowGratter, ArrowUp, GreenTick, Payment, RedCross, YellowTck, bankImg, cardArrowImg, dateIcon, fileImg, notifyImg, timeIcon, userPhoto } from '../../../utils/Images'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Entypo';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import CustomButton from '../../../components/CustomButton'
import moment from 'moment';
import axios from 'axios';
import Loader from '../../../utils/Loader';
import { API_URL } from '@env'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Logo from '../../../assets/images/misc/logo.svg';
import { SafeAreaView } from 'react-native-safe-area-context'

const ChatSummary = ({ route }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false)



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
        <SafeAreaView style={styles.container}>
            <CustomHeader commingFrom={'Withdraw'} onPress={() => navigation.goBack()} title={' '} />
            <ScrollView contentContainerStyle={styles.wrapper}>
                <Logo
                    width={responsiveWidth(40)}
                    height={responsiveHeight(8)}
                //style={{transform: [{rotate: '-15deg'}]}}
                />
                <Image
                    source={fileImg}
                    style={styles.icon}
                />
                <Text style={styles.title}>Session Summary</Text>
                <View style={styles.totalValue}>
                    <View style={styles.totalValue1stSection}>
                        <View style={styles.profilePicSection}>
                            {route?.params?.details?.astrologer?.profile_pic ?
                                <Image
                                    source={{ uri: route?.params?.details?.astrologer?.profile_pic }}
                                    style={styles.profilePicStyle}
                                /> :
                                <Image
                                    source={userPhoto}
                                    style={styles.profilePicStyle}
                                />}
                        </View>
                        <View style={styles.contentStyle}>
                            <Text style={styles.contentStyleName}>{route?.params?.details?.astrologer?.display_name}</Text>
                            <Text style={styles.contentStyleQualification}>{route?.params?.details?.astrologer?.specialization}</Text>
                            <Text style={styles.contentStyleLangValue}>Astrologer</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.totalValue2}>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountText}>Total Duration</Text>
                        <Text style={styles.amountValue}>{Number(route.params.details.total_session_time).toFixed(2)} Min</Text>
                    </View>
                    <View
                        style={{
                            borderBottomColor: '#E3E3E3',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            marginVertical: responsiveHeight(2)
                        }}
                    />
                    <View style={styles.amountRow}>
                        <Text style={styles.amountTotalText}>Amount</Text>
                        <Text style={styles.amountTotalValue}>₹ {route?.params?.details?.userWallet?.balance}</Text>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonWrapper}>
                <CustomButton
                    label={`Rate ${route?.params?.details?.astrologer?.display_name}`}
                    onPress={() => navigation.navigate('ReviewScreen', { astrologerId: route?.params?.details?.astrologer?.id, astrologerName: route?.params?.details?.astrologer?.display_name,sessionId:route?.params?.details?.id, astrologerPic: route?.params?.details?.astrologer?.profile_pic })}
                />
            </View>
        </SafeAreaView>
    )
}


export default ChatSummary


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    wrapper: {
        flexGrow: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    icon: {
        width: 90,
        height: 90,
        marginBottom: responsiveHeight(2),
        marginTop: responsiveHeight(5)
    },
    title: {
        fontSize: responsiveFontSize(2.5),
        fontFamily: 'PlusJakartaSans-Bold',
        color: '#1E2023',
        marginBottom: responsiveHeight(8),
    },
    message: {
        fontSize: responsiveFontSize(2),
        textAlign: 'center',
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        marginBottom: responsiveHeight(2),
    },
    buttonWrapper: {
        width: responsiveWidth(92),
        marginVertical: responsiveHeight(2),
        alignSelf: 'center',
    },
    totalValue: {
        width: responsiveWidth(92),
        //height: responsiveHeight(36),
        //alignItems: 'center',
        backgroundColor: '#fff',
        //justifyContent: 'center',
        padding: 10,
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
        justifyContent: 'center'
        //height: responsiveHeight(10),
        //backgroundColor:'red'
    },
    contentStyleName: {
        fontSize: responsiveFontSize(2),
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-Bold',
        marginBottom: responsiveHeight(1)
    },
    contentStyleQualification: {
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Medium',
        marginBottom: responsiveHeight(0.5)
    },
    contentStyleLangValue: {
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        marginBottom: responsiveHeight(0.5)
    },
    totalValue2: {
        width: responsiveWidth(92),
        //height: responsiveHeight(36),
        //alignItems: 'center',
        backgroundColor: '#FFF5E9',
        //justifyContent: 'center',
        padding: 10,
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
        marginBottom: responsiveHeight(2)
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    amountText: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(2),
        color: '#1E2023'
    },
    amountValue: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        color: '#8B939D'
    },
    amountTotalText: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        color: '#1E2023'
    },
    amountTotalValue: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2),
        color: '#1E2023'
    }
});
