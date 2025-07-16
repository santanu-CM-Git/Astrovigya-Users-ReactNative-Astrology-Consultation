import React from 'react';
import {Image} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { homeImg, helpImg, SessionIcon, PolicyIcon, availabilityBlackImg, bookmarkedNotFill, chatImg, transactionIconImg, settingsIcon} from '../utils/Images';
import CustomDrawer from '../components/CustomDrawer';

import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomerSupport from '../screens/NoAuthScreen/CustomerSupport';

import TabNavigator from './TabNavigator';
import PrivacyPolicy from '../screens//NoAuthScreen/PrivacyPolicy';
import SessionHistory from '../screens/NoAuthScreen/OrderHistory';
import WalletRechargeScreen from '../screens/NoAuthScreen/Wallet/WalletRechargeScreen';
import TherapistList from '../screens/NoAuthScreen/Consult/AstrologerList';
import TestPage from '../screens/NoAuthScreen/TestPage';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import ChatSummary from '../screens/NoAuthScreen/Consult/ChatSummary';
import SettingsScreen from '../screens/NoAuthScreen/SettingsScreen';
import WalletTransaction from '../screens/NoAuthScreen/Wallet/WalletTransaction';
import OrderHistory from '../screens/NoAuthScreen/OrderHistory';

const Drawer = createDrawerNavigator();

const AuthStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#FEF3E5',
        drawerActiveTintColor: '#2D2D2D',
        drawerInactiveTintColor: '#949494',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'PlusJakartaSans-Medium',
          fontSize: responsiveFontSize(1.8),
        },
        //swipeEdgeWidth: 0, //for off the drawer swipe
      }}>
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          drawerIcon: ({color}) => (
            // <Ionicons name="home-outline" size={22} color={color} />
            <Image source={homeImg} style={{ width: 25,height: 25,marginRight:5}} color={color}/>
          ),
        }}
      />
       <Drawer.Screen
        name="Chat With Astrologers"
        component={TherapistList}
        options={{
          drawerIcon: ({color}) => (
            // <Ionicons name="settings-outline" size={22} color={color} />
            <Image source={chatImg} style={{ width: 25,height: 25,marginRight:5}} color={color} tintColor={'#8B939D'}/>
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Session History"
        component={SessionHistory}
        options={{
          drawerIcon: ({color}) => (
            // <Ionicons name="home-outline" size={22} color={color} />
            <Image source={SessionIcon} style={{ width: 25,height: 25,marginRight:5}} color={color}/>
          ),
        }}
      /> */}
       {/* <Drawer.Screen
        name="Customer Support"
        component={CustomerSupport}
        options={{
          drawerIcon: ({color}) => (
            // <Ionicons name="settings-outline" size={22} color={color} />
            <Image source={helpImg} style={{ width: 25,height: 25,marginRight:5}} color={color}/>
          ),
        }}
      /> */}
       <Drawer.Screen
        name="Wallet Transactions"
        component={WalletTransaction}
        options={{
          drawerIcon: ({color}) => (
            // <Ionicons name="settings-outline" size={22} color={color} />
            <Image source={transactionIconImg} style={{ width: 25,height: 25,marginRight:5}} color={color}/>
          ),
        }}
      />
      <Drawer.Screen
        name="Order History"
        component={OrderHistory}
        options={{
          drawerIcon: ({color}) => (
            // <Ionicons name="settings-outline" size={22} color={color} />
            <Image source={SessionIcon} style={{ width: 25,height: 25,marginRight:5}} color={color}/>
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Privacy Policy"
        component={PrivacyPolicy}
        options={{
          drawerIcon: ({color}) => (
            // <Ionicons name="settings-outline" size={22} color={color} />
            <Image source={PolicyIcon} style={{ width: 25,height: 25,marginRight:5}} color={color}/>
          ),
        }}
      /> */}
       {/* <Drawer.Screen
        name="ChatSummary"
        component={ChatSummary}
        options={{
          drawerIcon: ({color}) => (
            // <Ionicons name="settings-outline" size={22} color={color} />
            <Image source={PolicyIcon} style={{ width: 25,height: 25,marginRight:5}} color={color}/>
          ),
        }}
      /> */}
       <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => (
            // <Ionicons name="settings-outline" size={22} color={color} />
            <Image source={settingsIcon} style={{ width: 25, height: 25, marginRight: 5 }} color={color} />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="  testtttt"
        component={TestPage}
        options={{
          drawerIcon: ({color}) => (
            // <Ionicons name="settings-outline" size={22} color={color} />
            <Image source={PolicyIcon} style={{ width: 25,height: 25}} color={color}/>
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
};

export default AuthStack;
