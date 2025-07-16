import React, { useContext, useState, useEffect, memo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
  Alert,
  Dimensions,
  Pressable,
  ImageBackground
} from 'react-native';
import Modal from "react-native-modal";
import { AuthContext } from '../../context/AuthContext';
import { getProducts } from '../../store/productSlice'
import FastImage from '@d11/react-native-fast-image';
import moment from 'moment';
import CustomButton from '../../components/CustomButton'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { add } from '../../store/cartSlice';
import { dateIcon, timeIcon, yellowStarImg, qouteImg, bannerPlaceHolder, freebannerPlaceHolder, categoryImg, horoImg, storeImg, chatImg, userPhoto, starImg, phoneColor, chatColor, chatButtonImg, callButtonImg, knowmoreImg, kundliImg, matchmakingImg, horo2Img, discountImg, nextImg } from '../../utils/Images';
import Loader from '../../utils/Loader';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import CustomHeader from '../../components/CustomHeader';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from '@env'
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import messaging from '@react-native-firebase/messaging';
import LinearGradient from 'react-native-linear-gradient';

const data = [
  { label: 'Today', value: '1' },
  { label: 'Date Wise', value: '2' },
];
const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 120;
const { height, width } = Dimensions.get('screen')
const sliderWidth = Dimensions.get('window').width;
const paddingHorizontal = 10;
const itemWidth = sliderWidth - (2 * paddingHorizontal);


export default function HomeScreen({ navigation }) {

  const dispatch = useDispatch();
  const { data: products, status } = useSelector(state => state.products)
  // const { userInfo } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [notificationStatus, setNotificationStatus] = useState(false)
  const [therapistData, setTherapistData] = React.useState([])
  const [upcomingBooking, setUpcomingBooking] = useState([])
  const [previousBooking, setPreviousBooking] = useState([])
  const [starCount, setStarCount] = useState(4)
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [bannerData, setBannerData] = useState([])
  const [customerSpeaksData, setCustomerSpeaksData] = useState([])
  const [userInfo, setuserInfo] = useState([])
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const getFCMToken = async () => {
    try {
      // if (Platform.OS == 'android') {
      await messaging().registerDeviceForRemoteMessages();
      // }
      const token = await messaging().getToken();
      AsyncStorage.setItem('fcmToken', token)
      console.log(token, 'fcm token');
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getFCMToken()

    if (Platform.OS == 'android') {
      /* this is app foreground notification */
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        // console.log('Received background message:', JSON.stringify(remoteMessage));
        setNotificationStatus(true)
      });
      /* This is for handling background messages */
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        // console.log('Received background message:', remoteMessage);
        // Handle background message here
        setNotificationStatus(true)
      });

      return unsubscribe;
    }
  }, [])

  const fetchBanner = () => {
    axios.get(`${API_URL}/patient/banners`, {
      headers: {
        "Content-Type": 'application/json'
      },
    })
      .then(res => {
        //console.log(res.data,'user details')
        let banner = res.data.data;
        console.log(banner, 'banner data')
        setBannerData(banner)
        banner.forEach(item => {
          Image.prefetch(item.banner_image);
        });
        //setIsLoading(false);
      })
      .catch(e => {
        console.log(`fetch banner error ${e}`)
        console.log(e.response?.data?.message)
        setIsLoading(false);
      });
  }
  const fetchCustomerSpeaks = () => {
    AsyncStorage.getItem('userToken', (err, usertoken) => {
      axios.post(`${API_URL}/patient/good-reviews`, {}, {
        headers: {
          "Authorization": `Bearer ${usertoken}`,
          "Content-Type": 'application/json'
        },
      })
        .then(res => {
          //console.log(res.data,'user details')
          let customerSpeak = res.data.data;
          console.log(customerSpeak, 'customer speaks data')
          const limitedData = customerSpeak.slice(0, 5);
          setCustomerSpeaksData(limitedData)
          //setIsLoading(false);
        })
        .catch(e => {
          console.log(`fetch customer speak error ${e}`)
          console.log(e.response?.data?.message)
          setIsLoading(false);
        });
    });
  }

  const CarouselCardItem = ({ item, index }) => {
    //console.log(item, 'banner itemmm')
    {/* <View style={styles.textWrap}>
          {item?.banner_title && <Text style={styles.bannerText}>{item?.banner_title}</Text>}
          {item?.banner_description && <Text style={styles.bannerSubText} numberOfLines={4}>{item?.banner_description}</Text>}
          <View style={styles.bannerButtonView}>
            <Text style={styles.bannerButtonText}>Call Us Today!</Text>
          </View>
        </View> */}
    return (
      <View style={styles.bannerContainer}>
        <FastImage
          //source={{ uri: item.banner_image }}
          source={bannerPlaceHolder}
          //source={freebannerPlaceHolder}
          //style={{ width: BannerWidth, height: BannerHeight }}
          style={styles.bannerImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    )
  }


  useEffect(() => {
    fetchBanner()
  }, [])

  if (isLoading) {
    return (
      <Loader />
    )
  }

  return (
    <SafeAreaView style={styles.Container}>
      <CustomHeader commingFrom={'Home'} onPressProfile={() => navigation.navigate('Profile')} />
      <ScrollView>
        <View style={styles.wrapper}>
          <View style={styles.carouselView}>
            <Carousel
              data={bannerData}
              renderItem={CarouselCardItem}
              showsPageIndicator={true}
              pageSize={BannerWidth}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              autoplay={true}
              autoplayTimeout={5000}
              autoplayInterval={5000}
              loop={true}
              index={0}
              //enableSnap={true}
              onSnapToItem={(index) => setActiveSlide(index)}
              activePageIndicatorStyle={{ backgroundColor: 'red' }}
            />
          </View>
          <View style={styles.categoryView}>
            <ImageBackground
              source={categoryImg}
              style={styles.singleCategoryView}
              imageStyle={styles.imageBackground}
            >
              <Image
                source={storeImg}
                style={styles.icon}
              />
              <Text style={styles.iconText}>Online Store</Text>
            </ImageBackground>
            <ImageBackground
              source={categoryImg}
              style={styles.singleCategoryView}
              imageStyle={styles.imageBackground}
            >
              <Image
                source={chatImg}
                style={styles.icon}
              />
              <Text style={styles.iconText}>Talk to Astrologers</Text>
            </ImageBackground>
            <ImageBackground
              source={categoryImg}
              style={styles.singleCategoryView}
              imageStyle={styles.imageBackground}
            >
              <Image
                source={horoImg}
                style={styles.icon}
              />
              <Text style={styles.iconText}>Horoscope</Text>
            </ImageBackground>
          </View>
          <View style={styles.sectionHeaderView}>
            <Text style={styles.sectionHeaderText}>Top Astrologers</Text>
            <TouchableOpacity>
              <Text style={styles.seeallText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.topAstrologerSection}>
            <Pressable>
              <View style={styles.totalValue}>
                <View style={styles.totalValue1stSection}>
                  <View style={styles.profilePicSection}>
                    <Image
                      source={userPhoto}
                      style={styles.profilePicStyle}
                    />
                    <View style={styles.rateingView}>
                      <Text style={styles.ratingText}>3.5</Text>
                      <Image
                        source={starImg}
                        style={styles.staricon}
                      />
                    </View>
                  </View>
                  <View style={styles.contentStyle}>
                    <Text style={styles.contentStyleName}>Astro Shivnash</Text>
                    <Text style={styles.contentStyleQualification}>Vedic, Prashna Chart, Life Coach</Text>
                    <Text style={styles.contentStyleLangValue}>Bengali, Hindi, English</Text>
                    <Text style={styles.contentStyleExp}>4 Years Experience</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.contentStyleRate, { marginRight: 5 }]}>₹ 35/Min</Text>
                      <Text style={[styles.contentStyleRateFree, { marginRight: 5 }]}>Free</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.listButtonSecondSection}>
                  <View style={[styles.iconView, { backgroundColor: '#EFFFF3', borderColor: '#1CAB04' }]}>
                    <Image
                      source={phoneColor}
                      style={[styles.iconSize, { tintColor: '#1CAB04' }]}
                    />
                    <Text>Call</Text>
                  </View>
                  <View style={[styles.iconView, { backgroundColor: '#F2F2F2', borderColor: '#CCD3CF' }]}>
                    <Image
                      source={chatColor}
                      style={[styles.iconSize, { tintColor: '#969796' }]}
                    />
                    <Text>Chat</Text>
                  </View>
                </View>

              </View>
            </Pressable>
          </View>
          <View style={styles.sectionHeaderView}>
            <Text style={styles.sectionHeaderText}>New Astrologers</Text>
            <TouchableOpacity>
              <Text style={styles.seeallText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryView}>

            <LinearGradient
              colors={['#EFDFC9', '#FFFFFF']} // Example colors, replace with your desired gradient
              locations={[0, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.singleNewAstrologer}
            >
              <Image
                source={userPhoto}
                style={styles.profilePicStyle}
              />
              <Text style={styles.nameText}>Astro Shivnash</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.contentStyleRate, { marginRight: 5 }]}>₹ 35/Min</Text>
                <Text style={[styles.contentStyleRateFree, { marginRight: 5 }]}>Free</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={chatButtonImg}
                  style={[styles.iconButtonSize]}
                />
                <Image
                  source={callButtonImg}
                  style={[styles.iconButtonSize]}
                />
              </View>
            </LinearGradient>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('FreeTherapistList')}>
            <View style={styles.freebannerContainer}>
              <Image
                source={freebannerPlaceHolder}
                style={styles.freebannerImg}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.sectionHeaderView}>
            <Text style={styles.sectionHeaderText}>Know More About You</Text>

          </View>
          <View style={styles.categoryView}>
            <Pressable onPress={() => navigation.navigate('KundliScreen')}>
              <ImageBackground
                source={categoryImg}
                style={styles.singleKnowmoreView}
                imageStyle={styles.imageBackground}
              >
                <Image
                  source={kundliImg}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>Kundli</Text>
              </ImageBackground>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('MatchMaking')}>
              <ImageBackground
                source={categoryImg}
                style={styles.singleKnowmoreView}
                imageStyle={styles.imageBackground}
              >
                <Image
                  source={matchmakingImg}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>Match Making</Text>
              </ImageBackground>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('HoroscopeScreen')}>
              <ImageBackground
                source={categoryImg}
                style={styles.singleKnowmoreView}
                imageStyle={styles.imageBackground}
              >
                <Image
                  source={horo2Img}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>Horoscope</Text>
              </ImageBackground>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <LinearGradient
        colors={['#1E2023', '#1E2023']} // Example colors, replace with your desired gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.stickyFooter}
      >
        <View style={styles.stickywrapper}>
          <Image
            source={discountImg}
            style={{ height: 25, width: 25, resizeMode: 'contain' }}
          />
          <Text style={styles.stickyHeaderText}>Free Consultation for the First-Time Users!</Text>
          <Image
            source={nextImg}
            style={{ height: 25, width: 25, resizeMode: 'contain' }}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: responsiveHeight(1),
  },
  wrapper: {
    marginBottom: responsiveHeight(6)
  },
  textWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: responsiveFontSize(2),
    color: '#000',
    fontFamily: 'PlusJakartaSans-Bold',
    position: 'relative',
    zIndex: 1,
    width: width * 0.5,
    marginBottom: responsiveHeight(1),
    paddingLeft: 20,
  },
  bannerSubText: {
    fontSize: 14,
    color: '#746868',
    fontFamily: 'PlusJakartaSans-Regular',
    position: 'relative',
    zIndex: 1,
    width: width * 0.7,
    marginBottom: 15,
    paddingLeft: 20,
  },
  bannerButtonView: {
    height: responsiveHeight(4),
    width: responsiveWidth(25),
    backgroundColor: '#FFFFFF',
    marginLeft: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bannerButtonText: {
    color: '#E88036',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: responsiveFontSize(1.5)
  },
  carouselView: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginTop: responsiveHeight(1)
  },
  bannerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: BannerHeight,
    //backgroundColor: 'red',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  sectionHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1)
  },
  sectionHeaderText: {
    marginHorizontal: 20,
    color: '#2D2D2D',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: responsiveFontSize(2)
  },
  seeallText: {
    marginHorizontal: 20,
    color: '#746868',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: responsiveFontSize(1.7)
  },
  categoryView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1)
  },
  singleCategoryView: {
    height: responsiveHeight(20),
    width: responsiveWidth(30),
    borderRadius: 15,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  imageBackground: {
    borderRadius: 15, // Applies the border radius to the background image
  },
  icon: {
    height: 50,
    width: 50,
    resizeMode: 'contain'
  },
  iconText: {
    color: '#894F00',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: responsiveFontSize(1.7),
    textAlign: 'center'
  },
  topAstrologerSection: {
    marginHorizontal: 15,
    marginTop: responsiveHeight(1)
  },
  totalValue: {
    width: responsiveWidth(92),
    //height: responsiveHeight(36),
    //alignItems: 'center',
    backgroundColor: '#fff',
    //justifyContent: 'center',
    padding: 10,
    borderRadius: 15,
    elevation: 5,
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
  starStyle: {
    marginHorizontal: responsiveWidth(0.5),
    marginBottom: responsiveHeight(1)
  },
  noOfReview: {
    fontSize: responsiveFontSize(1.7),
    color: '#746868',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  contentStyle: {
    flexDirection: 'column',
    width: responsiveWidth(60),
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
  contentStyleExp: {
    fontSize: responsiveFontSize(1.7),
    color: '#8B939D',
    fontFamily: 'PlusJakartaSans-Regular',
    marginBottom: responsiveHeight(1)
  },
  contentStyleLang: {
    fontSize: responsiveFontSize(1.7),
    color: '#746868',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: responsiveHeight(1)
  },
  contentStyleLangValue: {
    fontSize: responsiveFontSize(1.7),
    color: '#8B939D',
    fontFamily: 'PlusJakartaSans-Regular',
    marginBottom: responsiveHeight(0.5)
  },
  contentStyleRate: {
    fontSize: responsiveFontSize(1.7),
    color: '#1E2023',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: responsiveHeight(1),
    textDecorationLine: 'line-through', textDecorationStyle: 'solid'
  },
  contentStyleRateFree: {
    fontSize: responsiveFontSize(1.7),
    color: '#FF5A6A',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: responsiveHeight(1),
  },
  contentStyleAvailableSlot: {
    fontSize: responsiveFontSize(1.5),
    color: '#444343',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: responsiveHeight(1)
  },
  rateingView: {
    backgroundColor: '#F6C94B',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    fontSize: responsiveFontSize(1.5),
    color: '#1E2023',
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginRight: 5
  },
  staricon: {
    height: 20,
    width: 20,
    resizeMode: 'contain'
  },
  listButtonSecondSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: responsiveWidth(40),
    alignSelf: 'flex-end'
  },
  iconView: {
    height: responsiveHeight(4.5),
    width: responsiveWidth(18),
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  iconSize: {
    height: 20,
    width: 20,
    marginRight: 5
  },
  singleNewAstrologer: {
    height: responsiveHeight(28),
    width: responsiveWidth(35),
    borderRadius: 15,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderColor: '#E3BE8C',
    borderWidth: 1,
  },
  nameText: {
    color: '#1E2023',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: responsiveFontSize(1.7),
    textAlign: 'center'
  },
  iconButtonSize: {
    height: 30,
    width: 55,
    resizeMode: 'contain'
  },
  freebannerContainer: {
    marginTop: responsiveHeight(1),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  freebannerImg: {
    height: responsiveHeight(15), // Adjust height based on desired aspect ratio
    width: responsiveWidth(92),   // 92% of the screen width
    borderRadius: 6,
    resizeMode: 'contain',
  },
  singleKnowmoreView: {
    height: responsiveHeight(20),
    width: responsiveWidth(30),
    borderRadius: 15,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    resizeMode: 'contain'
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    height: responsiveHeight(6),
    width: responsiveWidth(100),
    overflow: 'hidden'
  },
  stickywrapper: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  stickySec1: {
    flexDirection: 'column'
  },
  stickyHeaderText: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: responsiveFontSize(1.7)
  },
  stickyHeaderSubText: {
    color: '#FFFFFF',
    fontFamily: 'DMSans-Medium',
    fontSize: responsiveFontSize(1.7)
  },
  stickyButton: {
    height: responsiveHeight(4.5),
    marginLeft: responsiveWidth(2),
    backgroundColor: '#EDF1F3',
    borderColor: '#EDF1F3',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stickyButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#8B939D',
    fontSize: responsiveFontSize(1.7)
  },
});