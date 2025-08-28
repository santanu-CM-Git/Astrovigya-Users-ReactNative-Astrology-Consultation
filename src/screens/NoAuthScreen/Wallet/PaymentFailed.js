import React, { useState, useEffect } from 'react';
import {  View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Thankyou from '../../../assets/images/misc/Thankyou.svg';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from '../../../components/CustomButton';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import moment from 'moment-timezone';
import { withTranslation, useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'

const PaymentFailed = ({ route }) => {
    const navigation = useNavigation();
     const { t, i18n } = useTranslation();
    const [data, setData] = useState(JSON.stringify(route?.params?.message));

    useEffect(() => {
        // const detailsData = JSON.parse(route?.params?.detailsData);
        // setData(detailsData);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.thankYouImageWrapper}>
                <Thankyou width={300} height={150} />
            </View>
            <View style={styles.thankYouTextWrapper}>
                <Text style={styles.thankYouText}>{t('paymentfailed.Oops')}</Text>
                <Text style={styles.appreciationText}>{data}</Text>
            </View>
            <View style={{ width: responsiveWidth(92), alignSelf: 'center' }}>
                <CustomButton label={t('paymentfailed.backtohome')}
                    onPress={() => navigation.navigate('Home')}
                />
            </View>
        </SafeAreaView>
    );
};

export default withTranslation()(PaymentFailed);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    thankYouImageWrapper: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    thankYouTextWrapper: {
        paddingHorizontal: 20,
        marginBottom: responsiveHeight(2),
        marginTop: responsiveHeight(2),
    },
    thankYouText: {
        color: '#444343',
        alignSelf: 'center',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2.5),
        textAlign: 'center',
        marginBottom: 10,
    },
    appreciationText: {
        color: '#746868',
        alignSelf: 'center',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(2),
        textAlign: 'center',
    },
    totalValue: {
        width: responsiveWidth(89),
        backgroundColor: '#fff',
        borderRadius: 15,
        borderColor: '#E3E3E3',
        borderWidth: 1,
        marginTop: responsiveHeight(5),
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        height: responsiveHeight(7),
        backgroundColor: '#DEDEDE',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        alignItems: 'center',
    },
    headerText: {
        color: '#2D2D2D',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: responsiveWidth(2),
    },
    detailsWrapper: {
        padding: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveHeight(2),
    },
    detailLabel: {
        color: '#746868',
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
    },
    detailValue: {
        color: '#444343',
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: responsiveFontSize(1.7),
    },
    buttonWrapper: {
        position: 'absolute',
        bottom: 0,
        width: responsiveWidth(90),
    },
});