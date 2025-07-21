

import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, API_URL } from '@env'
import axios from "axios";
import { Alert } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userType, setUserType] = useState(null)
    const [userInfo, setUserInfo] = useState([])

    const [cartItems, setCartItems] = useState([]);


    const insertToCart = (item) =>{
        setCartItems(item)
    }

    // Function to add item to cart
    const addToCart = (item) => {
        //setCartItems((prevItems) => [...prevItems, item]);  
        console.log(item, 'new itemmmmm');
        setCartItems((prevItems) => {
            // Check if the item with the same product ID and variation ID exists in the cart
            const itemExists = prevItems.some(cartItem =>
                cartItem.store_products_id === item.store_products_id &&
                cartItem.store_product_variations_id === item.store_product_variations_id
            );

            if (itemExists) {
                console.log('Item already in cart');
                return prevItems; // Do not add the item if it exists
            } else {
                console.log('Adding new item to cart');
                return [...prevItems, item]; // Add the item if it doesn't exist
            }  
        });
    };

    const removeFromCart = (item) => {
        console.log(item, 'remove item')
        //setCartItems((prevItems) => prevItems.filter(item => item.store_products_id !== itemId));
        setCartItems((prevItems) => 
            prevItems.filter(cartItem => 
                !(
                    cartItem.store_products_id === item.store_products_id && 
                    cartItem.store_product_variations_id === item.store_product_variations_id
                )
            )
        );
    };

    // Function to get total number of items
    const getCartItemCount = () => {
        return cartItems.length;
    };
    // const login = () => {
    //     fetch('https://dummyjson.com/auth/login', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //             username: 'emilys',
    //             password: 'emilyspass',
    //             expiresInMins: 30, // optional, defaults to 60
    //           })
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             let userInfo = data;
    //             console.log(userInfo,'userInfo from loginnnnn')
    //             AsyncStorage.setItem('userToken', userInfo.token)
    //             AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
    //             setUserInfo(userInfo)
    //             setUserToken(userInfo.token)
    //             setIsLoading(false);
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //         });
    // }
    const login = async(token) => {
        console.log(token)
        setIsLoading(true);
        const savedLang = await AsyncStorage.getItem('selectedLanguage');
        axios.get(`${API_URL}/user/personal-information`, { 
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json',
                "Accept-Language": savedLang || 'en',
            },
        })
            .then(res => {
                //console.log(res.data,'user details')
                let userInfo = res.data.data;
                console.log(userInfo, 'userInfo from loginnnnn')
                AsyncStorage.setItem('userToken', token)
                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
                setUserInfo(userInfo)
                setUserToken(token)
                setIsLoading(false);
            })
            .catch(e => {
                console.log(`Login error ${e}`)
                console.log(e.response?.data?.message)
            });
    }


    const logout = () => {
        setIsLoading(true)
        setUserToken(null);
        AsyncStorage.removeItem('userInfo')
        AsyncStorage.removeItem('userToken')
        AsyncStorage.removeItem('notifications')
        setIsLoading(false);
    }
    const isLoggedIn = async () => {
        console.log('islogin')
        try {
            setIsLoading(true)
            let userInfo = await AsyncStorage.getItem('userInfo')
            let userToken = await AsyncStorage.getItem('userToken')
            userInfo = JSON.parse(userInfo)
            if (userInfo) {
                setUserToken(userToken)
                setUserInfo(userInfo)
            }
            setIsLoading(false)
        } catch (e) {
            console.log(`isLoggedIn error ${e}`)
        }
    }

    useEffect(() => {
        isLoggedIn()
    }, []);


    return (
        <AuthContext.Provider value={{ login, logout, isLoading, userToken, userInfo, cartItems,insertToCart, addToCart, removeFromCart, getCartItemCount }}>
            {children}
        </AuthContext.Provider>
    )
}
