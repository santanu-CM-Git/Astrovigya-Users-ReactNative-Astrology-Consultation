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
  ImageBackground,
  Platform
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import messaging from '@react-native-firebase/messaging';
import LinearGradient from 'react-native-linear-gradient';
import { withTranslation, useTranslation } from 'react-i18next';

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


const HomeScreen = ({  }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [langvalue, setLangValue] = useState('en');
  const dispatch = useDispatch();
  const { data: products, status } = useSelector(state => state.products)
  // const { userInfo } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [notificationStatus, setNotificationStatus] = useState(false)
  const [topAstrologerData, setTopAstrologerData] = React.useState([])
  const [newAstrologerData, setNewAstrologerData] = React.useState([])
  const [starCount, setStarCount] = useState(4)
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [bannerData, setBannerData] = useState([])
  const [customerSpeaksData, setCustomerSpeaksData] = useState([])
  const [userInfo, setUserInfo] = useState([])
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

    // if (Platform.OS == 'android') {
    //   /* this is app foreground notification */
    //   const unsubscribe = messaging().onMessage(async remoteMessage => {
    //     // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    //     // console.log('Received background message:', JSON.stringify(remoteMessage));
    //     setNotificationStatus(true)
    //   });
    //   /* This is for handling background messages */
    //   messaging().setBackgroundMessageHandler(async remoteMessage => {
    //     // console.log('Received background message:', remoteMessage);
    //     // Handle background message here
    //     setNotificationStatus(true)
    //   });

    //   return unsubscribe;
    // }
  }, [])
  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('selectedLanguage');
      if (savedLang) {
        console.log(savedLang, 'console language from home screen');

        setLangValue(savedLang);
        i18n.changeLanguage(savedLang);
      }
    } catch (error) {
      console.error('Failed to load language from AsyncStorage', error);
    }
  };

  const fetchBanner = async () => {
    const savedLang = await AsyncStorage.getItem('selectedLanguage');
    axios.get(`${API_URL}/patient/banners`, {
      headers: {
        "Content-Type": 'application/json',
        "Accept-Language": savedLang || 'en',
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
  // const fetchAllTopAstrologer = async () => {
  //   AsyncStorage.getItem('userToken', (err, usertoken) => {
  //     console.log(usertoken, 'usertokenusertokenusertokenusertoken');

  //     axios.get(`${API_URL}/user/top-astrologers-list`, {
  //       headers: {
  //         'Accept': 'application/json',
  //         "Authorization": 'Bearer ' + usertoken,
  //         //'Content-Type': 'multipart/form-data',
  //       },
  //     })
  //       .then(res => {
  //         console.log(JSON.stringify(res.data.data), 'fetch all astrologer')
  //         if (res.data.response == true) {
  //           setTopAstrologerData(res.data.data);
  //           //setIsLoading(false);

  //         } else {
  //           console.log('not okk')
  //           setTopAstrologerData([])
  //           setIsLoading(false)
  //         }
  //       })
  //       .catch(e => {
  //         setIsLoading(false)
  //         console.log(`fetch all top-astrologers-list error ${e}`)
  //         console.log(e.response)
  //         Alert.alert('Oops..', e.response?.data?.message, [
  //           {
  //             text: 'Cancel',
  //             onPress: () => console.log('Cancel Pressed'),
  //             style: 'cancel',
  //           },
  //           { text: 'OK', onPress: () => console.log('OK Pressed') },
  //         ]);
  //       });
  //   });
  // }

  const fetchAllTopAstrologer = async () => {
    try {
      // Retrieve user token and selected language from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
      const savedLang = await AsyncStorage.getItem('selectedLanguage');

      if (!userToken) {
        console.log('User token not found');
        return;
      }

      console.log(userToken, 'usertokenusertokenusertokenusertoken');

      // Make the API call with the headers including Authorization and Accept-Language
      const response = await axios.get(`${API_URL}/user/top-astrologers-list`, {
        headers: {
          'Accept': 'application/json',
          "Authorization": `Bearer ${userToken}`,
          "Accept-Language": savedLang || 'en',  // Default to 'en' if savedLang is not available
        },
      });

      console.log(JSON.stringify(response.data.data), 'fetch all astrologer');

      if (response.data.response === true) {
        setTopAstrologerData(response.data.data);
      } else {
        console.log('not okk');
        setTopAstrologerData([]);
      }
    } catch (error) {
      console.log(`fetch all top-astrologers-list error ${error}`);
      console.log(error.response);
      Alert.alert('Oops..', error.response?.data?.message, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const TopAstrologerListItem = memo(({ item }) => (
    <Pressable onPress={() => navigation.navigate('AstrologerProfile', { astrologerId: item?.id })}>
      <View style={styles.totalValue}>
        <View style={styles.totalValue1stSection}>
          <View style={styles.profilePicSection}>
            {item?.profile_pic ?
              <Image
                source={{ uri: item?.image }}
                style={styles.profilePicStyle}
              /> :
              <Image
                source={userPhoto}
                style={styles.profilePicStyle}
              />
            }
            <View style={styles.rateingView}>
              <Text style={styles.ratingText}>{item?.rating}</Text>
              <Image
                source={starImg}
                style={styles.staricon}
              />
            </View>
          </View>
          <View style={styles.contentStyle}>
            <Text style={styles.contentStyleName}>{item?.full_name}</Text>
            <Text style={styles.contentStyleQualification}>{item?.astrologer_specialization?.map(spec => spec.specializations_name).join(', ')}</Text>
            <Text style={styles.contentStyleLangValue}>{item?.astrologer_language?.map(lang => lang.language).join(', ')}</Text>
            <Text style={styles.contentStyleExp}>{item?.year_of_experience} {t('home.yearsexperience')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Display when free_min is 0 */}
              {userInfo?.user_free_min?.free_min > 0 && (
                <>
                  <Text style={[
                    styles.contentStyleRate,
                    {
                      marginRight: 5,
                      textDecorationLine: 'line-through', // Strikethrough when free_min is 0
                      textDecorationStyle: 'solid',
                    }
                  ]}>
                    ₹ {item?.rate_price}/Min
                  </Text>
                  <Text style={styles.contentStyleRateFree}>Free</Text>
                </>
              )}

              {/* Display only the price when free_min > 0 */}
              {userInfo?.user_free_min?.free_min === 0 && (
                <Text style={styles.contentStyleRate}>
                  ₹ {item?.rate_price}/Min
                </Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.listButtonSecondSection}>
          {/* Call Button */}
          <View style={[
            styles.iconView,
            {
              backgroundColor: item?.call_consultancy == '1' ? '#EFFFF3' : '#F2F2F2',
              borderColor: item?.call_consultancy == '1' ? '#1CAB04' : '#CCD3CF',
            }
          ]}>
            <Image
              source={phoneColor}
              style={[
                styles.iconSize,
                { tintColor: item?.call_consultancy == '1' ? '#1CAB04' : '#969796' }
              ]}
            />
            <Text style={{ color: item?.call_consultancy == '1' ? '#1CAB04' : '#969796' }}>{t('home.call')}</Text>
          </View>

          {/* Chat Button */}
          <View style={[
            styles.iconView,
            {
              backgroundColor: item?.chat_consultancy == '1' ? '#EFFFF3' : '#F2F2F2',
              borderColor: item?.chat_consultancy == '1' ? '#1CAB04' : '#CCD3CF',
            }
          ]}>
            <Image
              source={chatColor}
              style={[
                styles.iconSize,
                { tintColor: item?.chat_consultancy == '1' ? '#1CAB04' : '#969796' }
              ]}
            />
            <Text style={{ color: item?.chat_consultancy == '1' ? '#1CAB04' : '#969796' }}>{t('home.chat')}</Text>
          </View>
        </View>

      </View>
    </Pressable>
  ))

  const rendertopAstrologerItem = ({ item }) => <TopAstrologerListItem item={item} />;

  // const fetchNewAstrologer = async () => {
  //   AsyncStorage.getItem('userToken', (err, usertoken) => {
  //     console.log(usertoken, 'usertokenusertokenusertokenusertoken');

  //     axios.get(`${API_URL}/user/top-astrologers-list`, {
  //       headers: {
  //         'Accept': 'application/json',
  //         "Authorization": 'Bearer ' + usertoken,
  //         //'Content-Type': 'multipart/form-data',
  //       },
  //     })
  //       .then(res => {
  //         console.log(JSON.stringify(res.data.data), 'fetch all astrologer')
  //         if (res.data.response == true) {
  //           setNewAstrologerData(res.data.data);
  //           //setIsLoading(false);

  //         } else {
  //           console.log('not okk')
  //           setIsLoading(false)
  //           setNewAstrologerData([])
  //         }
  //       })
  //       .catch(e => {
  //         setIsLoading(false)
  //         console.log(`fetch all top-astrologers-list error ${e}`)
  //         console.log(e.response)
  //         Alert.alert('Oops..', e.response?.data?.message, [
  //           {
  //             text: 'Cancel',
  //             onPress: () => console.log('Cancel Pressed'),
  //             style: 'cancel',
  //           },
  //           { text: 'OK', onPress: () => console.log('OK Pressed') },
  //         ]);
  //       });
  //   });
  // }

  const fetchNewAstrologer = async () => {
    try {
      // Retrieve user token and selected language from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
      const savedLang = await AsyncStorage.getItem('selectedLanguage');

      if (!userToken) {
        console.log('User token not found');
        return;
      }

      console.log(userToken, 'usertokenusertokenusertokenusertoken');

      // Make the API call with headers including Authorization and Accept-Language
      const response = await axios.get(`${API_URL}/user/top-astrologers-list`, {
        headers: {
          'Accept': 'application/json',
          "Authorization": `Bearer ${userToken}`,
          "Accept-Language": savedLang || 'en',  // Default to 'en' if savedLang is not available
        },
      });

      console.log(JSON.stringify(response.data.data), 'fetch all astrologer');

      if (response.data.response === true) {
        setNewAstrologerData(response.data.data);
      } else {
        console.log('not okk');
        setNewAstrologerData([]);
      }
    } catch (error) {
      console.log(`fetch all top-astrologers-list error ${error}`);
      console.log(error.response);
      Alert.alert('Oops..', error.response?.data?.message, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    } finally {
      setIsLoading(false);
    }
  };


  const NewAstrologerListItem = memo(({ item }) => (
    <Pressable onPress={() => navigation.navigate('AstrologerProfile', { astrologerId: item?.id })}>
      <LinearGradient
        colors={['#EFDFC9', '#FFFFFF']} // Example colors, replace with your desired gradient
        locations={[0, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.singleNewAstrologer}
      >
        {item?.profile_pic ?
          <Image
            source={{ uri: item?.image }}
            style={styles.profilePicStyle}
          /> :
          <Image
            source={userPhoto}
            style={styles.profilePicStyle}
          />
        }
        <Text style={styles.nameText} numberOfLines={1} ellipsizeMode='tail'>{item?.full_name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Display when free_min is 0 */}
          {userInfo?.user_free_min?.free_min > 0 && (
            <>
              <Text style={[
                styles.contentStyleRate,
                {
                  marginRight: 5,
                  textDecorationLine: 'line-through', // Strikethrough when free_min is 0
                  textDecorationStyle: 'solid',
                }
              ]}>
                ₹ {item?.rate_price}/Min
              </Text>
              <Text style={styles.contentStyleRateFree}>Free</Text>
            </>
          )}

          {/* Display only the price when free_min > 0 */}
          {userInfo?.user_free_min?.free_min === 0 && (
            <Text style={styles.contentStyleRate}>
              ₹ {item?.rate_price}/Min
            </Text>
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item?.chat_consultancy == '1' ?
            <Image
              source={chatButtonImg}
              style={[styles.iconButtonSize]}
            />
            : null}
          {item?.call_consultancy == '1' ?
            <Image
              source={callButtonImg}
              style={[styles.iconButtonSize]}
            />
            : null}
        </View>
      </LinearGradient>
    </Pressable>
  ))

  const renderNewAstrologerItem = ({ item }) => <NewAstrologerListItem item={item} />;

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

  // const fetchUserData = async () => {
  //   AsyncStorage.getItem('userToken', (err, usertoken) => {
  //     setIsLoading(true);
  //     axios.get(`${API_URL}/user/personal-information`, {
  //       headers: {
  //         "Authorization": `Bearer ${usertoken}`,
  //         "Content-Type": 'application/json'
  //       },
  //     })
  //       .then(res => {
  //         //console.log(res.data,'user details')
  //         let userInfo = res.data.data;
  //         console.log(userInfo, 'userInfo from Homepage')
  //         setUserInfo(userInfo)
  //         setIsLoading(false);
  //       })
  //       .catch(e => {
  //         console.log(`Login error ${e}`)
  //         console.log(e.response?.data?.message)
  //       });
  //   });
  // }
  const fetchUserData = async () => {
    try {
      // Retrieve user token and selected language from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
      const savedLang = await AsyncStorage.getItem('selectedLanguage');

      if (!userToken) {
        console.log('User token not found');
        return;
      }

      // Make the API call with headers including Authorization and Accept-Language
      const response = await axios.get(`${API_URL}/user/personal-information`, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
          "Content-Type": 'application/json',
          "Accept-Language": savedLang || 'en', // Default to 'en' if savedLang is not available
        },
      });

      const userInfo = response.data.data;
      console.log(userInfo, 'userInfo from Homepage');
      setUserInfo(userInfo);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      console.error('Server response:', error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadLanguage()
        await fetchUserData();         // Call fetchUserData first
        await fetchAllTopAstrologer(); // Then fetchAllTopAstrologer
        await fetchNewAstrologer();    // Finally fetchNewAstrologer
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          await loadLanguage()
          await fetchUserData();         // Call fetchUserData first
          await fetchAllTopAstrologer(); // Then fetchAllTopAstrologer
          await fetchNewAstrologer();    // Finally fetchNewAstrologer

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData(); // Call the async function
    }, [])
  );

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
            <Pressable onPress={() => { navigation.navigate('Store', { screen: 'StoreScreen', }) }}>
              <ImageBackground
                source={categoryImg}
                style={styles.singleCategoryView}
                imageStyle={styles.imageBackground}
              >
                <Image
                  source={storeImg}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>{t('home.onlinestore')}</Text>
              </ImageBackground>
            </Pressable>
            <Pressable onPress={() => { navigation.navigate('Consult', { screen: 'AstrologerList', }) }}>
              <ImageBackground
                source={categoryImg}
                style={styles.singleCategoryView}
                imageStyle={styles.imageBackground}
              >
                <Image
                  source={chatImg}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>{t('home.talktoastrologers')}</Text>
              </ImageBackground>
            </Pressable>
            {/* <ImageBackground
              source={categoryImg}
              style={styles.singleCategoryView}
              imageStyle={styles.imageBackground}
            >
              <Image
                source={horoImg}
                style={styles.icon}
              />
              <Text style={styles.iconText}>{t('home.horoscope')}</Text>
            </ImageBackground> */}
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
                <Text style={styles.iconText}>{t('home.kundli')}</Text>
              </ImageBackground>
            </Pressable>
          </View>
          <View style={styles.sectionHeaderView}>
            <Text style={styles.sectionHeaderText}>{t('home.topastrologers')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AstrologerList')}>
              <Text style={styles.seeallText}>{t('home.viewall')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.topAstrologerSection}>
            <FlatList
              data={topAstrologerData}
              renderItem={rendertopAstrologerItem}
              keyExtractor={(item) => item.id.toString()}
              maxToRenderPerBatch={10}
              windowSize={5}
              initialNumToRender={10}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              getItemLayout={(topAstrologerData, index) => (
                { length: 50, offset: 50 * index, index }
              )}
            />
          </View>
          <View style={styles.sectionHeaderView}>
            <Text style={styles.sectionHeaderText}>{t('home.newastrologers')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AstrologerList')}>
              <Text style={styles.seeallText}>{t('home.viewall')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryView}>
            <FlatList
              data={newAstrologerData}
              renderItem={renderNewAstrologerItem}
              keyExtractor={(item) => item.id.toString()}
              maxToRenderPerBatch={10}
              windowSize={5}
              initialNumToRender={10}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              getItemLayout={(newAstrologerData, index) => (
                { length: 50, offset: 50 * index, index }
              )}
            />

          </View>
          <View style={styles.freebannerContainer}>
            <TouchableOpacity onPress={() => { navigation.navigate('Remedies', { screen: 'OnlinePujaList', }) }}>
              <Image
                source={freebannerPlaceHolder}
                style={styles.freebannerImg}
              />
            </TouchableOpacity>
          </View>
          {/* <View style={styles.sectionHeaderView}>
            <Text style={styles.sectionHeaderText}>{t('home.knowmoreaboutyou')}</Text>

          </View> */}
          {/* <View style={styles.categoryView}>
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
                <Text style={styles.iconText}>{t('home.kundli')}</Text>
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
                <Text style={styles.iconText}>{t('home.matchmaking')}</Text>
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
                <Text style={styles.iconText}>{t('home.horoscope')}</Text>
              </ImageBackground>
            </Pressable>
          </View> */}
        </View>
      </ScrollView>
      {userInfo?.user_free_min?.free_min > 0 ?
        <LinearGradient
          colors={['#1E2023', '#1E2023']} // Example colors, replace with your desired gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.stickyFooter}
        >
          <TouchableWithoutFeedback onPress={() => navigation.navigate('AstrologerList')}>
            <View style={styles.stickywrapper}>
              <Image
                source={discountImg}
                style={{ height: 25, width: 25, resizeMode: 'contain' }}
              />
              <Text style={styles.stickyHeaderText}>{t('home.freecosulttext')}</Text>
              <Image
                source={nextImg}
                style={{ height: 25, width: 25, resizeMode: 'contain' }}
              />
            </View>
          </TouchableWithoutFeedback>
        </LinearGradient>
        : null}
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
    width: responsiveWidth(91),
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
    margin: 1,
    marginBottom: responsiveHeight(2),
    marginRight: responsiveWidth(3)
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
    marginRight: responsiveWidth(3),
    paddingHorizontal:2
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
    marginBottom: responsiveHeight(1)
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
    fontFamily: 'PlusJakartaSans-Medium',
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

export default withTranslation()(HomeScreen);