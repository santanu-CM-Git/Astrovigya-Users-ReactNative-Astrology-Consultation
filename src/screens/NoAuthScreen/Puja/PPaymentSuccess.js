import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { withTranslation, useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const PPaymentSuccess = ({ route }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const { orderId } = route.params || {}; // Pass any additional data like orderId if available

    const handleContinue = () => {
        // Redirect to another screen or perform further actions
        navigation.navigate('Home'); // Adjust the target screen
    };

    return (
        <View style={styles.container}>
            <View style={{ padding: 20,justifyContent: 'center',
        alignItems: 'center', }}>
                <Text style={styles.title}>{t('paymentsuccess.paymentsuccessful')} 🎉</Text>
                <Text style={styles.message}>{t('paymentsuccess.paymentsuccessful')}</Text>
                {orderId && <Text style={styles.orderId}>Order ID: {orderId}</Text>}
                <Button title={t('paymentsuccess.continue')} onPress={handleContinue} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0fff0',

    },
    title: {
        fontSize: responsiveFontSize(2),
        fontFamily: 'PlusJakartaSans-Regular',
        marginBottom: 20,
        color: '#2e7d32',
    },
    message: {
        fontSize: responsiveFontSize(1.7),
        fontFamily: 'PlusJakartaSans-Regular',
        textAlign: 'center',
        marginBottom: 20,
        color: '#4caf50',
    },
    orderId: {
        fontSize: responsiveFontSize(1.7),
        fontFamily: 'PlusJakartaSans-Regular',
        marginBottom: 20,
        color: '#388e3c',
    },
});

export default withTranslation()(PPaymentSuccess);
