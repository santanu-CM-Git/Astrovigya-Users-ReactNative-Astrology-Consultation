import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Text, Image, View, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import HomeScreen from '../screens/NoAuthScreen/HomeScreen';
import ProfileScreen from '../screens/NoAuthScreen/ProfileScreen';
import NotificationScreen from '../screens/NoAuthScreen/NotificationScreen';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

import PrivacyPolicy from '../screens/NoAuthScreen/PrivacyPolicy';
import ChatScreen from '../screens/NoAuthScreen/Consult/ChatScreen';
import { consultIconFocusedImg, consultIconImg, coursesIconFocusedImg, coursesIconImg, homeIconFocusedImg, homeIconImg, remediesIconFocusedImg, remediesIconImg, storeIconFocusedImg, storeIconImg, talkImg } from '../utils/Images';
import WalletRechargeScreen from '../screens/NoAuthScreen/Wallet/WalletRechargeScreen';
import ReviewScreen from '../screens/NoAuthScreen/Consult/ReviewScreen';
import AstrologerList from '../screens/NoAuthScreen/Consult/AstrologerList';
import AstrologerProfile from '../screens/NoAuthScreen/Consult/AstrologerProfile';
import PaymentFailed from '../screens/NoAuthScreen/Wallet/PaymentFailed';
import WithdrawSuccess from '../screens/NoAuthScreen/Wallet/WithdrawSuccess';
import ChatSummary from '../screens/NoAuthScreen/Consult/ChatSummary';
import RemediesScreen from '../screens/NoAuthScreen/Remedies/RemediesScreen';
import OnlinePujaList from '../screens/NoAuthScreen/Puja/OnlinePujaList';
import PujaDetails from '../screens/NoAuthScreen/Puja/PujaDetails';
import ChooseAstologerList from '../screens/NoAuthScreen/Puja/ChooseAstologerList';
import PujaSummary from '../screens/NoAuthScreen/Puja/PujaSummary';
import PujaSuccess from '../screens/NoAuthScreen/Puja/PujaSuccess';
import CourseScreen from '../screens/NoAuthScreen/Courses/CourseScreen';
import HoroscopeScreen from '../screens/NoAuthScreen/Remedies/HoroscopeScreen';
import HoroscopeDetails from '../screens/NoAuthScreen/Remedies/HoroscopeDetails';
import CustomerSupport from '../screens/NoAuthScreen/CustomerSupport';
import MatchMaking from '../screens/NoAuthScreen/Remedies/MatchMaking';
import MatchMakingReport from '../screens/NoAuthScreen/Remedies/MatchMakingReport';
import KundliScreen from '../screens/NoAuthScreen/Remedies/KundliScreen';
import KundliDetailsScreen from '../screens/NoAuthScreen/Remedies/KundliDetailsScreen';
import BirthDetailsScreen from '../screens/NoAuthScreen/Consult/BirthDetailsScreen';
import StoreScreen from '../screens/NoAuthScreen/Store/StoreScreen';
import ProductListScreen from '../screens/NoAuthScreen/Store/ProductListScreen';
import ChatHistory from '../screens/NoAuthScreen/ChatHistory';
import OrderHistory from '../screens/NoAuthScreen/OrderHistory';
import ProductDetails from '../screens/NoAuthScreen/Store/ProductDetails';
import AddToCart from '../screens/NoAuthScreen/Store/AddToCart';
import AddShippingAddress from '../screens/NoAuthScreen/Store/AddShippingAddress';
import ShippingAddressList from '../screens/NoAuthScreen/Store/ShippingAddressList';
import WishListScreen from '../screens/NoAuthScreen/Store/WishListScreen';
import MyOrderScreen from '../screens/NoAuthScreen/Store/MyOrderScreen';
import OrderDetails from '../screens/NoAuthScreen/Store/OrderDetails';
import OrderSuccess from '../screens/NoAuthScreen/Store/OrderSuccess';
import OrderSummary from '../screens/NoAuthScreen/Store/OrderSummary';
import PaymentScreen from '../screens/NoAuthScreen/Store/PaymentScreen';
import PaymentSuccess from '../screens/NoAuthScreen/Store/PaymentSuccess';
import PaymentFailure from '../screens/NoAuthScreen/Store/PaymentFailure';
import WPaymentScreen from '../screens/NoAuthScreen/Wallet/WPaymentScreen';
import WPaymentSuccess from '../screens/NoAuthScreen/Wallet/WPaymentSuccess';
import WPaymentFailure from '../screens/NoAuthScreen/Wallet/WPaymentFailure';
import PPaymentScreen from '../screens/NoAuthScreen/Puja/PPaymentScreen';
import PPaymentSuccess from '../screens/NoAuthScreen/Puja/PPaymentSuccess';
import PPaymentFailure from '../screens/NoAuthScreen/Puja/PPaymentFailure';

import { withTranslation, useTranslation } from 'react-i18next';
import TermsConditions from '../screens/NoAuthScreen/TermsConditions';

import { useSafeAreaInsets } from 'react-native-safe-area-context';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = ({ route }) => {
    const navigation = useNavigation();
    useFocusEffect(
        React.useCallback(() => {
            navigation.navigate('Home');
        }, [route, navigation])
    );
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Notification"
                component={NotificationScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='ChatScreen'
                component={ChatScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="WalletRechargeScreen"
                component={WalletRechargeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ReviewScreen"
                component={ReviewScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AstrologerList"
                component={AstrologerList}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AstrologerProfile"
                component={AstrologerProfile}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PaymentFailed"
                component={PaymentFailed}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="WithdrawSuccess"
                component={WithdrawSuccess}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PujaSuccess"
                component={PujaSuccess}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ChatSummary"
                component={ChatSummary}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicy}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CustomerSupport"
                component={CustomerSupport}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="TermsConditions"
                component={TermsConditions}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="MatchMaking"
                component={MatchMaking}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="MatchMakingReport"
                component={MatchMakingReport}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="KundliScreen"
                component={KundliScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="KundliDetailsScreen"
                component={KundliDetailsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="BirthDetailsScreen"
                component={BirthDetailsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="HoroscopeScreen"
                component={HoroscopeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="OrderHistory"
                component={OrderHistory}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ChatHistory"
                component={ChatHistory}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="WPaymentScreen"
                component={WPaymentScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="WPaymentSuccess"
                component={WPaymentSuccess}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="WPaymentFailure"
                component={WPaymentFailure}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

const TherapistStack = ({ route }) => {
    const navigation = useNavigation();
    useFocusEffect(
        React.useCallback(() => {
            // Reset to initial screen when tab is focused
            navigation.reset({
                index: 0,
                routes: [{ name: 'AstrologerList' }],
            });
        }, [navigation])
    );
    
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AstrologerList"
                component={AstrologerList}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AstrologerProfile"
                component={AstrologerProfile}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="BirthDetailsScreen"
                component={BirthDetailsScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )

};

const StoreStack = ({ route }) => {
    const navigation = useNavigation();
    useFocusEffect(
        React.useCallback(() => {
            // Reset to initial screen when tab is focused
            navigation.reset({
                index: 0,
                routes: [{ name: 'StoreScreen' }],
            });
        }, [navigation])
    );
    
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="StoreScreen"
                component={StoreScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductListScreen"
                component={ProductListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductDetails"
                component={ProductDetails}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddToCart"
                component={AddToCart}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddShippingAddress"
                component={AddShippingAddress}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ShippingAddressList"
                component={ShippingAddressList}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="WishListScreen"
                component={WishListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="MyOrderScreen"
                component={MyOrderScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="OrderDetails"
                component={OrderDetails}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="OrderSummary"
                component={OrderSummary}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="OrderSuccess"
                component={OrderSuccess}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PaymentScreen"
                component={PaymentScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PaymentSuccess"
                component={PaymentSuccess}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PaymentFailure"
                component={PaymentFailure}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )

};

const RemediesStack = ({ route }) => {
    const navigation = useNavigation();
    useFocusEffect(
        React.useCallback(() => {
            // Reset to initial screen when tab is focused
            navigation.reset({
                index: 0,
                routes: [{ name: 'RemediesScreen' }],
            });
        }, [navigation])
    );
    
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="RemediesScreen"
                component={RemediesScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="OnlinePujaList"
                component={OnlinePujaList}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PujaDetails"
                component={PujaDetails}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ChooseAstologerList"
                component={ChooseAstologerList}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PujaSummary"
                component={PujaSummary}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="HoroscopeScreen"
                component={HoroscopeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="HoroscopeDetails"
                component={HoroscopeDetails}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PPaymentScreen"
                component={PPaymentScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PPaymentSuccess"
                component={PPaymentSuccess}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PPaymentFailure"
                component={PPaymentFailure}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

const CourseStack = ({ route }) => {
    const navigation = useNavigation();
    useFocusEffect(
        React.useCallback(() => {
            // Reset to initial screen when tab is focused
            navigation.reset({
                index: 0,
                routes: [{ name: 'CourseScreen' }],
            });
        }, [navigation])
    );
    
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CourseScreen"
                component={CourseScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

const TabNavigator = () => {
    const { t, i18n } = useTranslation();
    const cartProducts = useSelector(state => state.cart)
    console.log(cartProducts)
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarInactiveTintColor: '#CACCCE',
                tabBarActiveTintColor: '#FB7401',
                tabBarStyle: {
                    height: Platform.select({
                      android: responsiveHeight(8) + insets.bottom, // Add bottom safe area
                      ios: responsiveHeight(11) + insets.bottom, // Add bottom safe area
                    }),
                    paddingBottom: insets.bottom, // Add padding for safe area
                  },
            }}>
            <Tab.Screen
                name="HOME"
                component={HomeStack}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: getTabBarVisibility(route),
                        backgroundColor: '#FFFFFF',
                        width: responsiveWidth(100),
                        height: Platform.select({
                            android: responsiveHeight(8) + Math.max(insets.bottom, 10), // Ensure minimum padding
                            ios: responsiveHeight(11) + Math.max(insets.bottom, 10), // Ensure minimum padding
                          }),
                          alignSelf: 'center',
                          paddingBottom: Math.max(insets.bottom, 10), // Ensure minimum padding
                          paddingTop: 5, // Add some top padding
                        //marginTop: -responsiveHeight(10),
                        //borderRadius: 30,
                        //marginBottom: 20,
                        //borderWidth: 1,
                        //borderColor: '#CACCCE'
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                            {focused && <View style={{ width: responsiveWidth(12), borderColor: color, backgroundColor: color, borderWidth: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5,marginTop:- responsiveHeight(0.5) }} />}
                            <Image source={focused ? homeIconFocusedImg : homeIconImg} style={{ width: responsiveWidth(6), height: responsiveHeight(3.5), marginTop: responsiveHeight(0.6),marginBottom: responsiveHeight(1) }} />
                        </View>
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <Text style={{ color, fontSize: responsiveFontSize(1.2), marginBottom: responsiveHeight(1) }}>{t('tab.Home')}</Text>
                    ),
                })}
            />
            <Tab.Screen
                name="Consult"
                component={TherapistStack}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: getTabBarVisibility(route),
                        backgroundColor: '#FFFFFF',
                        width: responsiveWidth(100),
                        height: Platform.select({
                            android: responsiveHeight(8) + Math.max(insets.bottom, 10), // Ensure minimum padding
                            ios: responsiveHeight(11) + Math.max(insets.bottom, 10), // Ensure minimum padding
                          }),
                          alignSelf: 'center',
                          paddingBottom: Math.max(insets.bottom, 10), // Ensure minimum padding
                          paddingTop: 5, // Add some top padding
                        //marginTop: -responsiveHeight(10),
                        //borderRadius: 30,
                        //marginBottom: 20,
                        //borderWidth: 1,
                        //borderColor: '#CACCCE'
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                            {focused && <View style={{ width: responsiveWidth(12), borderColor: color, backgroundColor: color, borderWidth: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5,marginTop:- responsiveHeight(0.5) }} />}
                            <Image source={focused ? consultIconFocusedImg : consultIconImg} style={{ width: responsiveWidth(6), height: responsiveHeight(3.5), marginTop: responsiveHeight(0.6),marginBottom: responsiveHeight(1) }} />
                        </View>
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <Text style={{ color, fontSize: responsiveFontSize(1.2), marginBottom: responsiveHeight(1) }}>{t('tab.Consult')}</Text>
                    ),
                })}
            />
            <Tab.Screen
                name="Store"
                component={StoreStack}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: getTabBarVisibility(route),
                        backgroundColor: '#FFFFFF',
                        width: responsiveWidth(100),
                        height: Platform.select({
                            android: responsiveHeight(8) + Math.max(insets.bottom, 10), // Ensure minimum padding
                            ios: responsiveHeight(11) + Math.max(insets.bottom, 10), // Ensure minimum padding
                          }),
                          alignSelf: 'center',
                          paddingBottom: Math.max(insets.bottom, 10), // Ensure minimum padding
                          paddingTop: 5, // Add some top padding
                        //marginTop: -responsiveHeight(10),
                        //borderRadius: 30,
                        //marginBottom: 20,
                        //borderWidth: 1,
                        //borderColor: '#CACCCE'
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                            {focused && <View style={{ width: responsiveWidth(12), borderColor: color, backgroundColor: color, borderWidth: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5,marginTop:- responsiveHeight(0.5) }} />}
                            <Image source={focused ? storeIconFocusedImg : storeIconImg} style={{ width: responsiveWidth(6), height: responsiveHeight(3.5), marginTop: responsiveHeight(0.6),marginBottom: responsiveHeight(1) }} />
                        </View>
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <Text style={{ color, fontSize: responsiveFontSize(1.2), marginBottom: responsiveHeight(1) }}>{t('tab.Store')}</Text>
                    ),
                })}
            />
            <Tab.Screen
                name="Remedies"
                component={RemediesStack}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: getTabBarVisibility(route),
                        backgroundColor: '#FFFFFF',
                        width: responsiveWidth(100),
                        height: Platform.select({
                            android: responsiveHeight(8) + Math.max(insets.bottom, 10), // Ensure minimum padding
                            ios: responsiveHeight(11) + Math.max(insets.bottom, 10), // Ensure minimum padding
                          }),
                          alignSelf: 'center',
                          paddingBottom: Math.max(insets.bottom, 10), // Ensure minimum padding
                          paddingTop: 5, // Add some top padding
                        //marginTop: -responsiveHeight(10),
                        //borderRadius: 30,
                        //marginBottom: 20,
                        //borderWidth: 1,
                        //borderColor: '#CACCCE'
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                            {focused && <View style={{ width: responsiveWidth(12), borderColor: color, backgroundColor: color, borderWidth: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5,marginTop:- responsiveHeight(0.5) }} />}
                            <Image source={focused ? remediesIconFocusedImg : remediesIconImg} style={{ width: responsiveWidth(6), height: responsiveHeight(3.5), marginTop: responsiveHeight(0.6),marginBottom: responsiveHeight(1) }} />
                        </View>
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <Text style={{ color, fontSize: responsiveFontSize(1.2), marginBottom: responsiveHeight(1) }}>{t('tab.Remedies')}</Text>
                    ),
                })}
            />
            <Tab.Screen
                name="COURSE"
                component={CourseStack}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: getTabBarVisibility(route),
                        backgroundColor: '#FFFFFF',
                        width: responsiveWidth(100),
                        height: Platform.select({
                            android: responsiveHeight(8) + Math.max(insets.bottom, 10), // Ensure minimum padding
                            ios: responsiveHeight(11) + Math.max(insets.bottom, 10), // Ensure minimum padding
                          }),
                          alignSelf: 'center',
                          paddingBottom: Math.max(insets.bottom, 10), // Ensure minimum padding
                          paddingTop: 5, // Add some top padding
                        //marginTop: -responsiveHeight(10),
                        //borderRadius: 30,
                        //marginBottom: 20,
                        //borderWidth: 1,
                        //borderColor: '#CACCCE'
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                            {focused && <View style={{ width: responsiveWidth(12), borderColor: color, backgroundColor: color, borderWidth: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5,marginTop:- responsiveHeight(0.5) }} />}
                            <Image source={focused ? coursesIconFocusedImg : coursesIconImg} style={{ width: responsiveWidth(6), height: responsiveHeight(3.5), marginTop: responsiveHeight(0.6),marginBottom: responsiveHeight(1) }} />
                        </View>
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <Text style={{ color, fontSize: responsiveFontSize(1.2), marginBottom: responsiveHeight(1) }}>{t('tab.Courses')}</Text>
                    ),
                })}
            />
        </Tab.Navigator>
    );
};

// const getTabBarVisibility = route => {
//    console.log(route);
//   const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
//   console.log(routeName);


//   if (routeName == 'Chat') {
//     return 'none';
//   } else {
//     return 'flex';
//   }

// };
const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
    console.log(routeName)
    if (routeName == 'Summary') {
        return 'none';
    } else if (routeName == 'ThankYouBookingScreen') {
        return 'none';
    } else if (routeName == 'ChatScreen') {
        return 'none';
    } else if (routeName == 'ReviewScreen') {
        return 'none';
    } else if (routeName == 'WalletRechargeScreen') {
        return 'none';
    } else if (routeName == 'AstrologerProfile') {
        return 'none';
    } else if (routeName == 'ScheduleScreen') {
        return 'none';
    } else if (routeName == 'PaymentFailed') {
        return 'none';
    } else if (routeName == 'WithdrawSuccess') {
        return 'none';
    } else if (routeName == 'ChatSummary') {
        return 'none';
    } else if (routeName == 'PrivacyPolicy') {
        return 'none';
    } else if (routeName == 'CustomerSupport') {
        return 'none';
    } else if (routeName == 'ProfileScreen') {
        return 'none';
    } else if (routeName == 'Notification') {
        return 'none';
    } else if (routeName == 'MatchMaking') {
        return 'none';
    } else if (routeName == 'MatchMakingReport') {
        return 'none';
    } else if (routeName == 'KundliScreen') {
        return 'none';
    } else if (routeName == 'KundliDetailsScreen') {
        return 'none';
    } else if (routeName == 'BirthDetailsScreen') {
        return 'none';
    } else if (routeName == 'HoroscopeScreen') {
        return 'none';
    } else if (routeName == 'ChatHistory') {
        return 'none';
    } else {
        return 'flex';
    }
};

export default withTranslation()(TabNavigator);
