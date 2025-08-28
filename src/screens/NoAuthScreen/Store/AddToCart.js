
import React, { useState, useMemo, useEffect, useCallback, useRef, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TextInput, Image, FlatList, TouchableOpacity, Picker, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert, Platform } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, categoryImg, chatColor, chatInfoImg, checkedImg, deleteImg, productImg } from '../../../utils/Images'
import { API_URL } from '@env'
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '../../../utils/Loader';
import moment from "moment"
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Entypo';
import CheckBox from '@react-native-community/checkbox';
import SelectMultiple from 'react-native-select-multiple'
import { Dropdown } from 'react-native-element-dropdown';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../../context/AuthContext';
import { withTranslation, useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context'

const AddToCart = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const [langvalue, setLangValue] = useState('en');
    const { removeFromCart, addToCart } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true)
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [cartItem, setCartItem] = useState([])
    const [addressList, setAddressList] = useState([])

    const handleQuantityChange = (itemId, selectedQuantity) => {
        const updatedCart = cartItem.map(item =>
            item.id === itemId ? { ...item, selectedQty: selectedQuantity } : item
        );
        setCartItem(updatedCart);
        calculateTotalPrice(updatedCart);
        updateCartQtyApi(itemId, selectedQuantity)
    };

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
    useEffect(() => {
        loadLanguage();
        fetchCartProduct();
        fetchAddress()
    }, []);
    useFocusEffect(
        useCallback(() => {
            loadLanguage();
            fetchCartProduct();
        }, [])
    );

    const fetchAddress = () => {
        AsyncStorage.getItem('userToken', async (err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.post(`${API_URL}/user/address`, {}, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en', // Default to 'en' if savedLang is not available
                    //'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    console.log(JSON.stringify(res.data.data), 'fetch address data')
                    if (res.data.response == true) {
                        setAddressList(res.data.data)
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
                    console.log(`fetch address error ${e}`)
                    console.log(e.response)
                    Alert.alert('Oops..', e.response?.data?.message, [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                });
        });
    }

    const updateCartQtyApi = (itemId, selectedQuantity) => {
        console.log(itemId, selectedQuantity, 'sddsfdsfdsfdsfdsf')
        const option = {
            "cart_id": itemId,
            "qty": selectedQuantity
        }
        AsyncStorage.getItem('userToken', async (err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.post(`${API_URL}/user/qty-update`, option, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en', // Default to 'en' if savedLang is not available
                    //'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    if (res.data.response == true) {

                        fetchCartProduct()
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
                    console.log(`update cart error ${e}`)
                    console.log(e.response)
                    Alert.alert('Oops..', e.response?.data?.message, [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                });
        });
    }

    const deleteCartQtyApi = (itemId, item) => {
        console.log(itemId, 'item iddddd')
        console.log(item, 'itemmmmmmmm')
        const option = {
            "cart_id": itemId,
        }
        AsyncStorage.getItem('userToken', async (err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.post(`${API_URL}/user/delete-cart-item`, option, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en', // Default to 'en' if savedLang is not available
                    //'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    if (res.data.response == true) {
                        removeFromCart(item)
                        fetchCartProduct()
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
                    console.log(`delete cart error ${e}`)
                    console.log(e.response)
                    Alert.alert('Oops..', e.response?.data?.message, [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                });
        });
    }

    // Function to calculate total price
    const calculateTotalPrice = (cartItems) => {
        const totalPrice = cartItems.reduce((total, item) => {
            const price = item?.store_product_varient?.price
                ? parseFloat(item.store_product_varient.price)
                : parseFloat(item.store_product.price);
            const itemTotal = price * item.selectedQty;
            return total + itemTotal;
        }, 0);

        console.log("Total Price:", totalPrice);
        setTotalPrice(totalPrice); // Set the total price
    }
    const calculateTotalWeight = (cartItems) => {
        const totalWeight = cartItems.reduce((total, item) => {
            // Ensure weight is parsed as a number
            const weight = parseFloat(item.store_product.weight || 0);
            return total + weight;
        }, 0);

        console.log("Total Weight:", totalWeight);
        setTotalWeight(totalWeight); // Set the total weight
    };
    const fetchCartProduct = () => {
        AsyncStorage.getItem('userToken', async (err, usertoken) => {
            const savedLang = await AsyncStorage.getItem('selectedLanguage');
            axios.get(`${API_URL}/user/add-to-cart`, {
                headers: {
                    'Accept': 'application/json',
                    "Authorization": 'Bearer ' + usertoken,
                    "Accept-Language": savedLang || 'en', // Default to 'en' if savedLang is not available
                    //'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    console.log(JSON.stringify(res.data.data), 'fetch cart data')
                    if (res.data.response == true) {
                        const updatedCart = res.data.data.map(item => ({
                            ...item,
                            selectedQty: item.qty // Attach selected quantity to each cart item
                        }));
                        calculateTotalPrice(updatedCart);
                        calculateTotalWeight(updatedCart)
                        console.log(updatedCart, 'updatedCartupdatedCartupdatedCart')
                        setCartItem(updatedCart);
                        setIsLoading(false);
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

    const deleteFromCart = (id, item) => {
        Alert.alert(
            '',
            t('Cart.Areyousuretoremovethisitemfromcart'),
            [
                {
                    text: t('Cart.Cancel'),
                    onPress: () => console.log('cancel pressed'),
                    style: 'cancel',
                },
                {
                    text: t('Cart.OK'),
                    onPress: () => {
                        deleteCartQtyApi(id, item)
                    },
                },
            ],
        );
    }
    const renderCartItem = ({ item }) => {
        if (item?.store_product_varient) {
            return (
                <>
                    <View style={styles.totalValue}>
                        <View style={{ flexDirection: 'row', }}>
                            <Image
                                source={{ uri: item?.store_product?.images[0] }}
                                style={styles.productImg}
                            />
                            <View style={{ flexDirection: 'column', marginLeft: responsiveWidth(2) }}>
                                <Text style={styles.productText}>{item?.store_product?.name}</Text>
                                <View style={styles.productAmountView}>
                                    <Text style={styles.productAmount}>₹ {item?.store_product_varient?.price}</Text>
                                    {/* <Text style={styles.productPreviousAmount}>₹ 5,950</Text> */}
                                </View>
                                <View style={styles.quantityContainer}>
                                    <Text style={styles.qtyText}>Qty:</Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        containerStyle={styles.dropdownContainer}
                                        data={quantityOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select"
                                        value={JSON.parse(item.selectedQty)}
                                        onChange={(newQty) => handleQuantityChange(item.id, newQty.value)}
                                        renderItem={(item, selected) => (
                                            <View style={styles.item}>
                                                <Text style={[styles.itemText, selected && styles.selectedText]}>
                                                    {item.label}
                                                </Text>
                                            </View>
                                        )}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', top: 10, right: 10 }}>
                        <TouchableOpacity onPress={() => deleteFromCart(item.id, item)}>
                            <Image
                                source={deleteImg}
                                style={{ height: 20, width: 20 }}
                            />
                        </TouchableOpacity>
                    </View>
                </>
            )
        } else {
            return (
                <>
                    <View style={styles.totalValue}>
                        <View style={{ flexDirection: 'row', }}>
                            <Image
                                source={{ uri: item?.store_product?.images[0] }}
                                style={styles.productImg}
                            />
                            <View style={{ flexDirection: 'column', marginLeft: responsiveWidth(2) }}>
                                <Text style={styles.productText}>{item?.store_product?.name}</Text>
                                <View style={styles.productAmountView}>
                                    <Text style={styles.productAmount}>₹ {item?.store_product?.price}</Text>
                                    {/* <Text style={styles.productPreviousAmount}>₹ 5,950</Text> */}
                                </View>
                                <View style={styles.quantityContainer}>
                                    <Text style={styles.qtyText}>Qty:</Text>
                                    <Dropdown
                                        style={styles.dropdown}
                                        containerStyle={styles.dropdownContainer}
                                        data={quantityOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select"
                                        value={item.selectedQty}
                                        onChange={(newQty) => handleQuantityChange(item.id, newQty.value)}
                                        renderItem={(item, selected) => (
                                            <View style={styles.item}>
                                                <Text style={[styles.itemText, selected && styles.selectedText]}>
                                                    {item.label}
                                                </Text>
                                            </View>
                                        )}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', top: 10, right: 10 }}>
                        <TouchableOpacity onPress={() => deleteFromCart(item.id, item)}>
                            <Image
                                source={deleteImg}
                                style={{ height: 20, width: 20 }}
                            />
                        </TouchableOpacity>
                    </View>
                </>
            )
        }

    }

    if (isLoading) {
        return (
            <Loader />
        )
    }

    const goToNextPage = () => {
        navigation.navigate(
            addressList.length !== 0 ? 'ShippingAddressList' : 'AddShippingAddress',
            { productPrice: totalPrice, productWeight: totalWeight }
        );
    }

    const quantityOptions = Array.from({ length: 5 }, (_, i) => ({
        label: `${i + 1}`,
        value: i + 1,
    }));

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Store'} onPress={() => navigation.goBack()} title={t('Cart.cart')} />
            <ScrollView style={styles.wrapper}>

                <View style={styles.productSection}>
                    {cartItem.length > 0 ?
                        <FlatList
                            data={cartItem}
                            renderItem={renderCartItem}
                            keyExtractor={(item) => item.id.toString()}
                            maxToRenderPerBatch={10}
                            windowSize={5}
                            initialNumToRender={10}
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            getItemLayout={(cartItem, index) => (
                                { length: 50, offset: 50 * index, index }
                            )}
                        /> :
                        <Text style={{
                            color: '#894F00',
                            fontFamily: 'PlusJakartaSans-Bold',
                            fontSize: responsiveFontSize(1.7), textAlign: 'center'
                        }}>{t('Cart.noiteminyourcart')}</Text>
                    }
                </View>
                {/* <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeaderText}>Payment Details</Text>
                </View> */}
                {/* <View style={styles.totalValue}>
                    <View style={styles.amountContainer}>
                        <View style={styles.amountRow}>
                            <Text style={styles.amountText}>Total Amount</Text>
                            <Text style={styles.amountValue}>₹ 11,800</Text>
                        </View>
                        <View style={styles.amountRow}>
                            <Text style={styles.amountText}>Tax (GST 18%)</Text>
                            <Text style={styles.amountValue}>₹ 2,124</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            borderBottomColor: '#E3E3E3',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            marginHorizontal: 5
                        }}
                    />
                    <View style={styles.amountContainer}>
                        <View style={styles.amountRow}>
                            <Text style={styles.amountTotalText}>Total Payable Amount</Text>
                            <Text style={styles.amountTotalValue}>₹ 13,924</Text>
                        </View>
                    </View>
                </View> */}
                {cartItem.length > 0 ?
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: responsiveWidth(90), paddingRight: 10 }}>
                        <Image
                            source={chatInfoImg}
                            style={{ height: 20, width: 20, resizeMode: 'contain' }}
                        />
                        <Text style={styles.stickyHeaderText}>{t('Cart.warningmsg')}</Text>
                    </View> : null}
            </ScrollView>
            {cartItem.length > 0 ?
                <View style={styles.bottomPriceSection}>
                    <View style={{ width: responsiveWidth(45), flexDirection: 'column', alignSelf: 'center' }}>
                        <Text style={{
                            color: '#8B939D',
                            fontFamily: 'PlusJakartaSans-Regular',
                            fontSize: responsiveFontSize(1.7)
                        }}>{t('ProductDetails.productprice')}</Text>
                        <Text style={{
                            color: '#000',
                            fontFamily: 'PlusJakartaSans-Bold',
                            fontSize: responsiveFontSize(2)
                        }}>₹ {totalPrice}</Text>
                    </View>
                    <View style={{ width: responsiveWidth(50), alignSelf: 'center', marginBottom: -20, }}>
                        <CustomButton label={t('Cart.Continue')}
                            // onPress={() => { booknow() }}
                            onPress={() => { goToNextPage() }}
                        />
                    </View>
                </View> : null}
        </SafeAreaView>
    )
}

export default withTranslation()(AddToCart)

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {
        paddingHorizontal: 15
    },
    productSection: {
        marginTop: responsiveHeight(2)
    },
    totalValue: {
        width: responsiveWidth(91),
        height: responsiveHeight(15),
        //alignItems: 'center',
        backgroundColor: '#fff',
        //justifyContent: 'center',
        padding: 5,
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
        marginBottom: responsiveHeight(2)
    },
    productImg: {
        height: responsiveHeight(14),
        width: responsiveFontSize(15),
        resizeMode: 'cover',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    productText: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(2),
        marginVertical: responsiveHeight(1)
    },
    productAmountView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    productAmount: {
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
        marginRight: responsiveWidth(2)
    },
    productPreviousAmount: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
        textDecorationLine: 'line-through'
    },
    sectionHeaderView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(1),
    },
    sectionHeaderText: {
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(2)
    },
    amountContainer: {
        padding: 5
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    amountText: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D'
    },
    amountValue: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D'
    },
    amountTotalText: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.8),
        color: '#8B939D'
    },
    amountTotalValue: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: responsiveFontSize(1.8),
        color: '#1E2023'
    },
    bottomPriceSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: responsiveHeight(2),
        borderTopColor: '#F2F2F2',
        borderTopWidth: 2,
        paddingTop: 10
    },
    stickyHeaderText: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
        marginLeft: 5
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
        justifyContent: 'space-between'
    },
    quantityLabel: {
        fontSize: 14,
        marginRight: 10,
    },
    dropdown: {
        width: 70,
        height: 30,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    dropdownContainer: {
        borderRadius: 8,
    },
    qtyText: {
        color: '#8B939D',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
        marginRight: responsiveWidth(1)
    },
    item: {
        padding: 10,
    },
    itemText: {
        color: '#8B939D', // Default text color
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
    },
    selectedText: {
        color: '#1E2023', // Change color when selected
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
    },
});
