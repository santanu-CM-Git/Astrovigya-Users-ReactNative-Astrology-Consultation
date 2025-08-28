import React, { useRef, useState, useEffect,useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image, Platform, Alert, FlatList, TextInput } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { ArrowDown, ArrowGratter, ArrowUp, GreenTick, Payment, RedCross, YellowTck, bankImg, cardArrowImg, dateIcon, notifyImg, timeIcon, userPhoto } from '../../../utils/Images'
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
import { AuthContext } from '../../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context'

const OrderSuccess = ({ route }) => {
    const navigation = useNavigation();
    const { insertToCart } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false)
    // const slideAnim = useRef(new Animated.Value(-200)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;

    // useEffect(() => {
    //     Animated.spring(slideAnim, {
    //         toValue: 0,
    //         useNativeDriver: true,
    //     }).start();
    // }, [slideAnim]);
    useEffect(() => {
        fetchCartProduct()
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 2, // Adjust the friction to control the bounciness
            tension: 160, // Adjust the tension to control the speed
            useNativeDriver: true,
        }).start();
    }, [scaleAnim]);
    const fetchCartProduct = () => {
        AsyncStorage.getItem('userToken', async(err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.get(`${API_URL}/user/add-to-cart`, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en',
                    //'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    console.log(JSON.stringify(res.data.data), 'fetch cart data from store screen')
                    if (res.data.response == true) {
                        const formattedData = res.data.data.map(item => ({
                            store_products_id: item.store_products_id ? item.store_products_id : null,
                            store_product_variations_id: item.store_product_variations_id ? item.store_product_variations_id : null,
                            price: item.price ? item.price : null,
                            qty: item.qty ? item.qty : 1
                        }));
                        insertToCart(formattedData)
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
                    console.log(`fetch cart error ${e}`)
                    console.log(e.response)
                    Alert.alert('Oops..', e.response?.data?.message, [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                });
        });
    }
    useFocusEffect(
        React.useCallback(() => {
            fetchCartProduct()
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
                {/* <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
                    <Image source={GreenTick} style={styles.icon} />
                </Animated.View> */}
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <Image source={GreenTick} style={styles.icon} />
                </Animated.View>
                <Text style={styles.title}>Order Successful!</Text>
                <Text style={styles.message}>
                    Your order has been successfully placed! Thank you for shopping with us.
                </Text>
            </ScrollView>
            <View style={styles.buttonWrapper}>
                <CustomButton
                    label="Back to My Order"
                    onPress={() => navigation.navigate('MyOrderScreen')}
                    buttonColor="red"
                />
            </View>
        </SafeAreaView>
    )
}


export default OrderSuccess


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    wrapper: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    icon: {
        width: 80,
        height: 80,
        marginBottom: responsiveHeight(2),
    },
    title: {
        fontSize: responsiveFontSize(2.5),
        fontFamily: 'PlusJakartaSans-Bold',
        color: '#1CAB04',
        marginBottom: responsiveHeight(1),
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

});
