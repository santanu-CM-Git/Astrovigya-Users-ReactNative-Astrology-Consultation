import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { StatusBar, Platform, Alert } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNav from './src/navigation/AppNav';
import store from './src/store/store';
import "./ignoreWarnings";
import OfflineNotice from './src/utils/OfflineNotice';
import Toast from 'react-native-toast-message';

import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERMISSIONS, request } from 'react-native-permissions';
import SplashScreen from 'react-native-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [notifyStatus, setnotifyStatus] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  const requestLocationPermission = async () => {
    try {
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      });
      const granted = await request(permission);
      if (granted === 'granted') {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Failed to request location permission:', error);
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('FCM Permission status:', authStatus);
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      await AsyncStorage.setItem('fcmToken', token);
    }
  };

  useEffect(() => {
    requestUserPermission();
    requestLocationPermission();

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      handleNotification(remoteMessage);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      handleNotification(remoteMessage);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background:', remoteMessage);
      // Optional: Navigate based on `remoteMessage`
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage);
        // Optional: Navigate based on `remoteMessage`
      }
    });

    return () => {
      unsubscribeForeground();
    };
  }, []);

  const handleNotification = (remoteMessage) => {
    console.log('Received message:', JSON.stringify(remoteMessage));

    const action = remoteMessage?.data?.action;
    if (action) {
      handleAction(action, remoteMessage);
    } else {
      setNotifications(prevNotifications => {
        const newNotifications = [...prevNotifications, remoteMessage];
        setnotifyStatus(true);
        return newNotifications;
      });
    }
  };

  const handleAction = (action, remoteMessage) => {
    switch (action) {
      case 'reply':
        console.log('User chose to reply to the message:', remoteMessage);
        break;
      case 'mark_as_read':
        console.log('User chose to mark the message as read:', remoteMessage);
        break;
      default:
        console.log('Unknown action:', action);
        break;
    }
  };

  return (
    <Provider store={store}>
      <SafeAreaProvider>
      <StatusBar backgroundColor="#000" />
      <OfflineNotice />
      <AuthProvider>
        <AppNav />
      </AuthProvider>
      <Toast />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
