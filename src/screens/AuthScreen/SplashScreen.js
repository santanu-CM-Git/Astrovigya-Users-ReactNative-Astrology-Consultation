import React, { useEffect, useState,useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image, ImageBackground, Animated,Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from '../../components/CustomButton';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { withTranslation, useTranslation } from 'react-i18next';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = ({  }) => {
    const navigation = useNavigation();
    const moveAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(moveAnim, {
                duration: 2000,
                toValue: Dimensions.get('window').width / 1.6,
                delay: 0,
                useNativeDriver: false,
            }),
            Animated.timing(moveAnim, {
                duration: 2000,
                toValue: 0,
                delay: 0,
                useNativeDriver: false,
            }),
        ]).start();
        Animated.timing(fadeAnim, {
            duration: 1000,
            toValue: 1,
            delay: 2000,
            useNativeDriver: false,
        }).start();

        const timeout = setTimeout(() => {
            navigation.push('Onboarding');
        }, 5000);

        return () => clearTimeout(timeout);
    }, [moveAnim, fadeAnim]);
    return (
        <LinearGradient
            colors={['#FFF9F1', '#FFF9F1', '#FFF9F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <ImageBackground
                source={require('../../assets/images/onboard_background.png')}
                style={styles.backgroundImage}
            >
                <SafeAreaView style={styles.safeArea}>
                    {/* <View style={styles.imageContainer}>
                        <Image
                            source={require('../../assets/images/icon.png')}
                            style={styles.logo}
                        />
                    </View> */}
                    <Animated.View style={[styles.imageContainer, { marginLeft: moveAnim }]}>
                        <Animated.Image
                            source={require('../../assets/images/icon.png')}
                            style={[styles.logo, { opacity: fadeAnim }]}
                        />
                    </Animated.View>
                </SafeAreaView> 
            </ImageBackground>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        alignItems: 'center'
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        position: 'relative',
        height: responsiveHeight(100),
        width: responsiveWidth(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: responsiveHeight(7),
        width: responsiveWidth(60),
        resizeMode: 'contain',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        height: '50%',
        width: '100%',
    },
    overlay: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(5),
    },
    iconContainer: {
        marginTop: responsiveHeight(2),
        marginBottom: responsiveHeight(5),
    },
    icon: {
        height: responsiveHeight(7),
        width: responsiveWidth(80),
        resizeMode: 'contain',
    },
    welcomeText: {
        fontSize: responsiveFontSize(2),
        color: '#1E2023',
        textAlign: 'center',
        marginBottom: '5%',
        fontFamily: 'PlusJakartaSans-Bold'
    },
    description: {
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D',
        textAlign: 'center',
        marginBottom: '10%',
        fontFamily: 'PlusJakartaSans-Regular'
    },
    buttonContainer: {
        width: responsiveWidth(70),
        position: 'absolute',
        bottom: 50
    },
    dropdownHalf: {
        height: responsiveHeight(4),
        width: responsiveWidth(25),
        borderColor: '#E3A15D',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 8,
        position: 'absolute',
        right: 5,
        top: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 5
    },
    placeholderStyle: {
        fontSize: responsiveFontSize(1.8),
        color: '#2F2F2F',
        fontFamily: 'PlusJakartaSans-Bold'
    },
    selectedTextStyle: {
        fontSize: responsiveFontSize(1.8),
        color: '#2F2F2F',
        fontFamily: 'PlusJakartaSans-Bold'
    },
    inputSearchStyle: {
        fontSize: responsiveFontSize(1.8),
        color: '#2F2F2F',
        fontFamily: 'PlusJakartaSans-Bold'
    },
    iconStyle: {
        tintColor: '#FB7401',
        marginTop: 5
    }
});

export default SplashScreen;
