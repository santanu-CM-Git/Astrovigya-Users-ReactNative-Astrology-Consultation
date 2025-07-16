import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Text, Image, View } from 'react-native';

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
import PaymentFailed from '../screens/NoAuthScreen/PaymentFailed';
import WithdrawSuccess from '../screens/NoAuthScreen/Wallet/WithdrawSuccess';
import ChatSummary from '../screens/NoAuthScreen/Consult/ChatSummary';
import RemediesScreen from '../screens/NoAuthScreen/Remedies/RemediesScreen';
import OnlinePujaList from '../screens/NoAuthScreen/Puja/OnlinePujaList';
import PujaDetails from '../screens/NoAuthScreen/Puja/PujaDetails';
import ChooseAstologerList from '../screens/NoAuthScreen/Puja/ChooseAstologerList';
import PujaSummary from '../screens/NoAuthScreen/Puja/PujaSummary';
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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
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
        </Stack.Navigator>
    );
};

const TherapistStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AstrologerList"
                component={AstrologerList}
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

const StoreStack = () => {
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
        </Stack.Navigator>
    )

};

const RemediesStack = () => {
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
        </Stack.Navigator>
    )
}

const CourseStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CourseScreen"
                component={CourseScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )

};

const TabNavigator = () => {
    const cartProducts = useSelector(state => state.cart)
    console.log(cartProducts)
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarInactiveTintColor: '#CACCCE',
                tabBarActiveTintColor: '#FB7401',
                tabBarStyle: {
                    height: 100,
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
                        height: responsiveHeight(8),
                        alignSelf: 'center',
                        //marginTop: -responsiveHeight(10),
                        //borderRadius: 30,
                        //marginBottom: 20,
                        //borderWidth: 1,
                        //borderColor: '#CACCCE'
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                            {focused && <View style={{ width: responsiveWidth(12), borderColor: color, backgroundColor: color, borderWidth: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }} />}
                            <Image source={focused ? homeIconFocusedImg : homeIconImg} style={{ width: responsiveWidth(6), height: responsiveHeight(3.5), marginTop: responsiveHeight(0.2),marginBottom: responsiveHeight(1) }} />
                        </View>
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <Text style={{ color, fontSize: responsiveFontSize(1.2), marginBottom: responsiveHeight(1) }}>Home</Text>
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
                        height: responsiveHeight(8),
                        alignSelf: 'center',
                        //marginTop: -responsiveHeight(10),
                        //borderRadius: 30,
                        //marginBottom: 20,
                        //borderWidth: 1,
                        //borderColor: '#CACCCE'
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                            {focused && <View style={{ width: responsiveWidth(12), borderColor: color, backgroundColor: color, borderWidth: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }} />}
                            <Image source={focused ? consultIconFocusedImg : consultIconImg} style={{ width: responsiveWidth(6), height: responsiveHeight(3.5), marginTop: responsiveHeight(0.2),marginBottom: responsiveHeight(1) }} />
                        </View>
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <Text style={{ color, fontSize: responsiveFontSize(1.2), marginBottom: responsiveHeight(1) }}>Consult</Text>
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
                        height: responsiveHeight(8),
                        alignSelf: 'center',
                        //marginTop: -responsiveHeight(10),
                        //borderRadius: 30,
                        //marginBottom: 20,
                        //borderWidth: 1,
                        //borderColor: '#CACCCE'
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                            {focused && <View style={{ width: responsiveWidth(12), borderColor: color, backgroundColor: color, borderWidth: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }} />}
                            <Image source={focused ? storeIconFocusedImg : storeIconImg} style={{ width: responsiveWidth(6), height: responsiveHeight(3.5), marginTop: responsiveHeight(0.2),marginBottom: responsiveHeight(1) }} />
                        </View>
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <Text style={{ color, fontSize: responsiveFontSize(1.2), marginBottom: responsiveHeight(1) }}>Store</Text>
                    ),
                })}
            />
            <Tab.Screen
                name="PROFILE"
                component={RemediesStack}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: getTabBarVisibility(route),
                        backgroundColor: '#FFFFFF',
                        width: responsiveWidth(100),
                        height: responsiveHeight(8),
                        alignSelf: 'center',
                        //marginTop: -responsiveHeight(10),
                        //borderRadius: 30,
                        //marginBottom: 20,
                        //borderWidth: 1,
                        //borderColor: '#CACCCE'
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                            {focused && <View style={{ width: responsiveWidth(12), borderColor: color, backgroundColor: color, borderWidth: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }} />}
                            <Image source={focused ? remediesIconFocusedImg : remediesIconImg} style={{ width: responsiveWidth(6), height: responsiveHeight(3.5), marginTop: responsiveHeight(0.2),marginBottom: responsiveHeight(1) }} />
                        </View>
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <Text style={{ color, fontSize: responsiveFontSize(1.2), marginBottom: responsiveHeight(1) }}>Remedies</Text>
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
                        height: responsiveHeight(8),
                        alignSelf: 'center',
                        //marginTop: -responsiveHeight(10),
                        //borderRadius: 30,
                        //marginBottom: 20,
                        //borderWidth: 1,
                        //borderColor: '#CACCCE'
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                            {focused && <View style={{ width: responsiveWidth(12), borderColor: color, backgroundColor: color, borderWidth: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }} />}
                            <Image source={focused ? coursesIconFocusedImg : coursesIconImg} style={{ width: responsiveWidth(6), height: responsiveHeight(3.5), marginTop: responsiveHeight(0.2),marginBottom: responsiveHeight(1) }} />
                        </View>
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <Text style={{ color, fontSize: responsiveFontSize(1.2), marginBottom: responsiveHeight(1) }}>Courses</Text>
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
    } else if (routeName == 'TherapistProfile') {
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
    } else {
        return 'flex';
    }
};

export default TabNavigator;
