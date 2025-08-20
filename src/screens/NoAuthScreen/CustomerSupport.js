import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    StyleSheet,
    Dimensions,
    Alert,
    Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomSwitch from '../../components/CustomSwitch';
import ListItem from '../../components/ListItem';
import { AuthContext } from '../../context/AuthContext';
import { getProducts } from '../../store/productSlice'
import { API_URL } from '@env'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { add } from '../../store/cartSlice';
import { emailIcon, facebookIcon, instagramIcon, whatsappIcon, youtubeIcon } from '../../utils/Images';
import Loader from '../../utils/Loader';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import CustomHeader from '../../components/CustomHeader';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import data from '../../model/data'
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

const BannerWidth = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(BannerWidth * 0.7)
const { height, width } = Dimensions.get('screen')

export default function CustomerSupport({  }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { data: products, status } = useSelector(state => state.products)
    const { userInfo } = useContext(AuthContext)

    const [activeSections, setActiveSections] = useState([]);
    const [collapsed, setCollapsed] = useState(true);
    const [getFaq, setFaq] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [getAllData, setAllData] = useState([])


    return (
        <SafeAreaView style={styles.Container}>
        <CustomHeader commingFrom={'Privacy Policy'} title={'About Us'} onPress={() => navigation.goBack()} onPressProfile={() => navigation.navigate('Profile')} />
        <WebView
            source={{ uri: 'https://astrovigya.com/about-us/' }}
            style={{ flex: 1 }}
            startInLoadingState={true}
        />
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    wrapper: {
        padding: 20,
        //paddingBottom: responsiveHeight(2)
    },

});