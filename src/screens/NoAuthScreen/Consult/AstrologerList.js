import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, StatusBar, TextInput, Image, FlatList, TouchableOpacity, Animated, KeyboardAwareScrollView, useWindowDimensions, Switch, Pressable, Alert } from 'react-native'
import CustomHeader from '../../../components/CustomHeader'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { LongPressGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { bookmarkedFill, bookmarkedNotFill, cameraColor, chatColor, checkedImg, filterImg, phoneColor, starImg, uncheckedImg, userPhoto } from '../../../utils/Images'
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
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import WalletBalanceModal from '../../../components/WalletBalanceModal';
import { useNavigation } from '@react-navigation/native';

// const dropdowndata = [
//     { label: 'All therapist', value: 'All' },
//     { label: 'Individual', value: 'Individual' },
//     { label: 'Couple', value: 'Couple' },
//     { label: 'Child', value: 'Child' },
// ];
const Experience = [
    { label: '0 - 2 Years', value: '0-2' },
    { label: '3 - 5 Years', value: '2-5' },
    { label: '6 - 8 Years', value: '6-8' },
    { label: '9 - 12 Years', value: '9-12' },
    { label: '13 - 15 Years', value: '13-15' },
    { label: '15 - 20 Years', value: '15-20' },
    { label: '20+ Years', value: '20-100' }
]
const Rating = [
    { label: '1 Star', value: '1' },
    { label: '2 Star', value: '2' },
    { label: '3 Star', value: '3' },
    { label: '4 Star', value: '4' },
    { label: '5 Star', value: '5' }
]
const Gender = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Others', value: 'Others' }
]
const Ages = [
    { label: '20 - 30', value: '20-30' },
    { label: '30 - 40', value: '30-40' },
    { label: '40 - 50', value: '40-50' },
    { label: '50 - 60', value: '50-60' },
    { label: '60 above', value: '60-100' },
]
// const Rate = [
//     { label: 'below 300', value: '1' },
//     { label: 'below 500', value: '2' },
//     { label: 'below 1000', value: '3' },
//     { label: 'below 2000', value: '4' },
//     { label: 'above 2000', value: '5' },
// ]


const AstrologerList = ({ route }) => {
    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const searchInputRef = useRef(null);
    const [searchValue, setSearchValue] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const tabs = [
        { label: 'All', value: 'All' },
        { label: 'Love', value: 'Love' },
        { label: 'Career', value: 'Career' },
        { label: 'Marriage', value: 'Marriage' },
    ];
    const [activeFilterTab, setActiveFilterTab] = useState('Experience')
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);

    const [sliderValuesForPrice, setSliderValuesForPrice] = useState([0, 2000]);
    const sliderValuesChange = (values) => {
        setSliderValuesForPrice(values);
    };
    const [sliderValuesForAge, setSliderValuesForAge] = useState([18, 100]);
    const sliderValuesChangeForAge = (values) => {
        setSliderValuesForAge(values);
    };
    // Experience
    const [selectedExperience, setSelectedExperience] = useState([]);
    const onSelectionsChangeExperience = (selectedExperience) => {
        // selectedFruits is array of { label, value }
        setSelectedExperience(selectedExperience);
    };
    // Type
    const [qualificationitemsTypeForDropdown, setqualificationitemsTypeForDropdown] = useState([])
    const [qualificationitemsType, setqualificationitemsType] = useState([])
    const [selectedType, setSelectedType] = useState([]);
    const onSelectionsChangeType = (selectedType) => {
        // selectedFruits is array of { label, value }
        setSelectedType(selectedType);
    };
    // Rating
    const [selectedRating, setSelectedRating] = useState([]);
    const onSelectionsChangeRating = (selectedRating) => {
        // selectedFruits is array of { label, value }
        setSelectedRating(selectedRating);
    };
    // Gender
    const [selectedGender, setSelectedGender] = useState([]);
    const onSelectionsChangeGender = (selectedGender) => {
        // selectedFruits is array of { label, value }
        setSelectedGender(selectedGender);
    };
    // Age
    const [selectedAge, setSelectedAge] = useState([]);
    const onSelectionsChangeAge = (selectedAge) => {
        // selectedFruits is array of { label, value }
        setSelectedAge(selectedAge);
    };
    // Qualification
    const [qualificationitems, setqualificationitems] = useState([])
    const [selectedQualification, setSelectedQualification] = useState([]);
    const onSelectionsChangeQualification = (selectedQualification) => {
        // selectedFruits is array of { label, value }
        console.log(selectedQualification, 'jjjjjjjjj')
        setSelectedQualification(selectedQualification);
    };
    // Language
    const [qualificationitemsLanguage, setqualificationitemsLanguage] = useState([])
    const [selectedLanguage, setSelectedLanguage] = useState([]);
    const onSelectionsChangeLanguage = (selectedLanguage) => {
        // selectedFruits is array of { label, value }
        setSelectedLanguage(selectedLanguage);
    };
    // Rate
    const [selectedRate, setSelectedRate] = useState([]);
    const onSelectionsChangeRate = (selectedRate) => {
        // selectedFruits is array of { label, value }
        setSelectedRate(selectedRate);
    };


    const toggleFilterModal = () => {
        setFilterModalVisible(!isFilterModalVisible);
    };

    const changeSearchValue = (text) => {
        // const searchText = text.toLowerCase().trim();
        // const filteredData = therapistData.filter(therapist =>
        //     therapist.user.name.toLowerCase().includes(searchText)
        // );
        setSearchValue(text);
        //setTherapistFilterData(filteredData);
    }

    if (isLoading) {
        return (
            <Loader />
        )
    }

    return (
        <SafeAreaView style={styles.Container}>
            <CustomHeader commingFrom={'Consult'} onPress={() => navigation.goBack()} title={'Consult'} />
            <ScrollView style={styles.wrapper}>
                <View style={styles.topHeaderSection}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ width: responsiveWidth(80) }}>
                        <View style={styles.tabContainer}>
                            {tabs.map((tab) => (
                                <TouchableOpacity
                                    key={tab.value}
                                    onPress={() => setActiveTab(tab.value)}
                                    style={[
                                        styles.tab,
                                        activeTab === tab.value && styles.activeTab,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.tabText,
                                            activeTab === tab.value && styles.activeTabText,
                                        ]}
                                    >
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    <View style={{ width: responsiveWidth(12) }}>
                        <TouchableWithoutFeedback onPress={() => toggleFilterModal()}>
                            <Image
                                source={filterImg}
                                style={styles.filterImg}
                            />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={{ alignSelf: 'center', marginBottom: responsiveHeight(1) }}>
                    <TextInput
                        style={styles.editinput}
                        onChangeText={(text) => changeSearchValue(text)}
                        value={searchValue}
                        ref={route?.params?.comingFrom === 'search' ? searchInputRef : null}
                        placeholder={'Search Astrologer'}
                        keyboardType={''}
                        placeholderTextColor="#808080"
                    />
                </View>
                <View style={styles.topAstrologerSection}>
                    <Pressable onPress={() => navigation.navigate('TherapistProfile')}>
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
                                <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                                    <View style={[styles.iconView, { backgroundColor: '#EFFFF3', borderColor: '#1CAB04' }]}>
                                        <Image
                                            source={phoneColor}
                                            style={[styles.iconSize, { tintColor: '#1CAB04' }]}
                                        />
                                        <Text>Call</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('BirthDetailsScreen')}>
                                <View style={[styles.iconView, { backgroundColor: '#F2F2F2', borderColor: '#CCD3CF' }]}>
                                    <Image
                                        source={chatColor}
                                        style={[styles.iconSize, { tintColor: '#969796' }]}
                                    />
                                    <Text>Chat</Text>
                                </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </Pressable>
                </View>

            </ScrollView>
            <Modal
                isVisible={isFilterModalVisible}
                // onBackdropPress={() => setIsFocus(false)} // modal off by clicking outside of the modal
                style={{
                    margin: 0, // Add this line to remove the default margin
                    justifyContent: 'flex-end',
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', height: 50, width: 50, borderRadius: 25, position: 'absolute', bottom: '91%', left: '45%', right: '45%' }}>
                    <Icon name="cross" size={30} color="#B0B0B0" onPress={toggleFilterModal} />
                </View>
                {/* <TouchableWithoutFeedback onPress={() => setIsFocus(false)} style={{  }}> */}
                <View style={{ height: '88%', backgroundColor: '#fff', position: 'absolute', bottom: 0, width: '100%' }}>
                    <View style={{ padding: 0 }}>
                        <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: responsiveHeight(2), marginTop: responsiveHeight(2) }}>
                            <Text style={{ fontSize: responsiveFontSize(2), color: '#2D2D2D', fontFamily: 'DMSans-Bold', }}>Filter</Text>
                        </View>
                    </View>
                    {/* <ScrollView style={{ marginBottom: responsiveHeight(0) }} > */}
                    <View style={{ borderTopColor: '#E3E3E3', borderTopWidth: 1, flexDirection: 'row' }}>
                        <View style={{ width: responsiveWidth(41), backgroundColor: '#FFF', borderRightColor: '#E3E3E3', borderRightWidth: 1 }}>
                            <TouchableOpacity onPress={() => setActiveFilterTab('Experience')}>
                                <View style={{ width: responsiveWidth(40), height: responsiveHeight(8), borderBottomColor: '#E3E3E3', backgroundColor: activeFilterTab == 'Experience' ? '#FEF3E5' : '#fff', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#444343', fontFamily: 'DMSans-SemiBold', fontSize: responsiveFontSize(2) }}>Experience</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveFilterTab('Type')}>
                                <View style={{ width: responsiveWidth(40), height: responsiveHeight(8), borderBottomColor: '#E3E3E3', backgroundColor: activeFilterTab == 'Type' ? '#FEF3E5' : '#fff', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#444343', fontFamily: 'DMSans-SemiBold', fontSize: responsiveFontSize(2) }}>Type</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveFilterTab('Rating')}>
                                <View style={{ width: responsiveWidth(40), height: responsiveHeight(8), borderBottomColor: '#E3E3E3', backgroundColor: activeFilterTab == 'Rating' ? '#FEF3E5' : '#fff', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#444343', fontFamily: 'DMSans-SemiBold', fontSize: responsiveFontSize(2) }}>Rating</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveFilterTab('Gender')}>
                                <View style={{ width: responsiveWidth(40), height: responsiveHeight(8), borderBottomColor: '#E3E3E3', backgroundColor: activeFilterTab == 'Gender' ? '#FEF3E5' : '#fff', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#444343', fontFamily: 'DMSans-SemiBold', fontSize: responsiveFontSize(2) }}>Gender</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveFilterTab('Age')}>
                                <View style={{ width: responsiveWidth(40), height: responsiveHeight(8), borderBottomColor: '#E3E3E3', backgroundColor: activeFilterTab == 'Age' ? '#FEF3E5' : '#fff', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#444343', fontFamily: 'DMSans-SemiBold', fontSize: responsiveFontSize(2) }}>Age</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveFilterTab('Qualification')}>
                                <View style={{ width: responsiveWidth(40), height: responsiveHeight(8), borderBottomColor: '#E3E3E3', backgroundColor: activeFilterTab == 'Qualification' ? '#FEF3E5' : '#fff', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#444343', fontFamily: 'DMSans-SemiBold', fontSize: responsiveFontSize(2) }}>Qualification</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveFilterTab('Language')}>
                                <View style={{ width: responsiveWidth(40), height: responsiveHeight(8), borderBottomColor: '#E3E3E3', backgroundColor: activeFilterTab == 'Language' ? '#FEF3E5' : '#fff', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#444343', fontFamily: 'DMSans-SemiBold', fontSize: responsiveFontSize(2) }}>Language</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveFilterTab('Rate')}>
                                <View style={{ width: responsiveWidth(40), height: responsiveHeight(8), borderBottomColor: '#E3E3E3', backgroundColor: activeFilterTab == 'Rate' ? '#FEF3E5' : '#fff', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#444343', fontFamily: 'DMSans-SemiBold', fontSize: responsiveFontSize(2) }}>Price</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ padding: 20, width: responsiveWidth(59), }}>
                            {/* Experience */}
                            {activeFilterTab == 'Experience' ?
                                <View style={{}}>
                                    <SelectMultiple
                                        items={Experience}
                                        selectedItems={selectedExperience}
                                        onSelectionsChange={onSelectionsChangeExperience}
                                        rowStyle={styles.item}
                                        labelStyle={styles.itemText}
                                    />
                                </View>
                                : activeFilterTab == 'Type' ?
                                    <View style={{}}>
                                        <SelectMultiple
                                            items={qualificationitemsType}
                                            selectedItems={selectedType}
                                            onSelectionsChange={onSelectionsChangeType}
                                            rowStyle={styles.item}
                                            labelStyle={styles.itemText}
                                        />
                                    </View>
                                    : activeFilterTab == 'Rating' ?
                                        <View style={{}}>
                                            <SelectMultiple
                                                items={Rating}
                                                selectedItems={selectedRating}
                                                onSelectionsChange={onSelectionsChangeRating}
                                                rowStyle={styles.item}
                                                labelStyle={styles.itemText}
                                            />
                                        </View>
                                        : activeFilterTab == 'Gender' ?
                                            <View style={{}}>
                                                <SelectMultiple
                                                    items={Gender}
                                                    selectedItems={selectedGender}
                                                    onSelectionsChange={onSelectionsChangeGender}
                                                    rowStyle={styles.item}
                                                    labelStyle={styles.itemText}
                                                />
                                            </View>

                                            : activeFilterTab == 'Age' ?
                                                <View style={{ marginTop: responsiveHeight(20), justifyContent: 'center', alignItems: 'center', width: responsiveWidth(50) }}>
                                                    <MultiSlider
                                                        values={sliderValuesForAge}
                                                        sliderLength={180}
                                                        onValuesChange={sliderValuesChangeForAge}
                                                        min={18}
                                                        max={100}
                                                        step={1}
                                                        vertical={true}
                                                        allowOverlap={false}
                                                        snapped
                                                        selectedStyle={{
                                                            backgroundColor: '#417AA4',
                                                        }}
                                                        unselectedStyle={{
                                                            backgroundColor: 'gray',
                                                        }}
                                                        markerStyle={{
                                                            backgroundColor: '#417AA4',
                                                            height: 15,
                                                            width: 15,
                                                            borderRadius: 15 / 2,
                                                        }}
                                                    />
                                                    <Text style={styles.valueText}>Age Range: {sliderValuesForAge[0]} - {sliderValuesForAge[1]}</Text>
                                                </View>


                                                : activeFilterTab == 'Qualification' ?
                                                    <View style={{}}>
                                                        <SelectMultiple
                                                            items={qualificationitems}
                                                            selectedItems={selectedQualification}
                                                            onSelectionsChange={onSelectionsChangeQualification}
                                                            rowStyle={styles.item}
                                                            labelStyle={styles.itemText}
                                                        />
                                                    </View>
                                                    : activeFilterTab == 'Language' ?
                                                        <View style={{}}>
                                                            <SelectMultiple
                                                                items={qualificationitemsLanguage}
                                                                selectedItems={selectedLanguage}
                                                                onSelectionsChange={onSelectionsChangeLanguage}
                                                                rowStyle={styles.item}
                                                                labelStyle={styles.itemText}
                                                            />
                                                        </View>
                                                        : activeFilterTab == 'Rate' ?
                                                            <View style={{ marginTop: responsiveHeight(20), justifyContent: 'center', alignItems: 'center', width: responsiveWidth(50) }}>
                                                                <MultiSlider
                                                                    values={sliderValuesForPrice}
                                                                    sliderLength={180}
                                                                    onValuesChange={sliderValuesChange}
                                                                    min={0}
                                                                    max={2000}
                                                                    step={1}
                                                                    vertical={true}
                                                                    allowOverlap={false}
                                                                    snapped
                                                                    selectedStyle={{
                                                                        backgroundColor: '#417AA4',
                                                                    }}
                                                                    unselectedStyle={{
                                                                        backgroundColor: 'gray',
                                                                    }}
                                                                    markerStyle={{
                                                                        backgroundColor: '#417AA4',
                                                                        height: 15,
                                                                        width: 15,
                                                                        borderRadius: 15 / 2,
                                                                    }}
                                                                />
                                                                <Text style={styles.valueText}>Price Range: ₹{sliderValuesForPrice[0]} - ₹{sliderValuesForPrice[1]}</Text>
                                                            </View>
                                                            :

                                                            <></>
                            }
                        </View>
                    </View>
                    {/* </ScrollView> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', bottom: 0, width: responsiveWidth(100), paddingHorizontal: 10, borderTopColor: '#E3E3E3', borderTopWidth: 1 }}>
                        <View style={{ width: responsiveWidth(45), marginTop: responsiveHeight(2) }}>
                            <CustomButton label={"Reset"}
                                buttonColor={'gray'}
                                onPress={() => resetValueOfFilter()}
                            />
                        </View>
                        <View style={{ width: responsiveWidth(45), marginTop: responsiveHeight(2) }}>
                            <CustomButton label={"Apply"}
                                onPress={() => submitForFilter()}
                            />
                        </View>
                    </View>
                </View>
                {/* </TouchableWithoutFeedback> */}
            </Modal>
            <WalletBalanceModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                balance="0.00"
                rechargeAmount={101}
            />
        </SafeAreaView>
    )
}

export default AstrologerList

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {

    },
    topHeaderSection: {
        flexDirection: 'row',
        width: responsiveWidth(100),
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: responsiveWidth(4)
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
    editinput: {
        color: '#808080',
        fontFamily: 'DMSans-Regular',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
        paddingLeft: responsiveHeight(1),
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
        width: responsiveWidth(91),
        height: responsiveHeight(7),
    },
    filterImg: {
        height: 25,
        width: 25,
        resizeMode: 'contain',
        alignSelf: 'flex-end'
    },
    /* tab section */
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
        marginLeft: responsiveWidth(4)
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#FEF3E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: responsiveWidth(2)
    },
    activeTab: {
        backgroundColor: '#FEF3E5',
        borderColor: '#D9B17E',
        borderWidth: 1
    },
    tabText: {
        color: '#894F00',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(1.7),
    },
    activeTabText: {
        color: '#894F00',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(1.7),
    },
    contentContainer: {
        flex: 1,
        //paddingHorizontal: 10,
        paddingVertical: 10,
    },
    /* tab section */
    item: {
        borderBottomWidth: 0,
    },
    itemText: {
        color: '#444343',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
    },
    //range slider
    slider: {
        width: responsiveWidth(50),
        height: responsiveWidth(10),
    },
    valueText: {
        fontSize: responsiveFontSize(2),
        marginBottom: 10,
        color: '#2D2D2D',
        fontFamily: 'DMSans-Regular',
        marginTop: responsiveHeight(15)
    },
    valueTextValue: {
        fontSize: responsiveFontSize(2),
        marginBottom: 10,
        color: '#2D2D2D',
        fontFamily: 'DMSans-Bold'
    },
    track: {
        height: 10,
        borderRadius: 5,
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    editinput: {
        color: '#808080',
        fontFamily: 'DMSans-Regular',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
        paddingLeft: responsiveHeight(1),
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
        width: responsiveWidth(88),
        height: responsiveHeight(7),
    },
});
