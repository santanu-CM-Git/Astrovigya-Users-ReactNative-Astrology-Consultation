import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { withTranslation, useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const PPaymentFailure = ({  }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const handleRetry = () => {
        // Redirect to the payment page or retry logic
        navigation.goBack(); // Adjust to navigate to the payment page
    };

    return (
        <View style={styles.container}>
            <View style={{ padding: 20 }}>
                <Text style={styles.title}>{t('paymentfailed.paymentfailed')} 😞</Text>
                <Text style={styles.message}>{t('paymentfailed.paymentfaileddesc')}</Text>
                <Button title={t('paymentfailed.retrypayment')} onPress={handleRetry} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff0f0',
        padding: 20
    },
    title: {
        fontSize: responsiveFontSize(2),
        fontFamily: 'PlusJakartaSans-Regular',
        marginBottom: 20,
        color: '#d32f2f',
    },
    message: {
        fontSize: responsiveFontSize(1.7),
        fontFamily: 'PlusJakartaSans-Regular',
        textAlign: 'center',
        marginBottom: 20,
        color: '#f44336',
    },
});

export default withTranslation()(PPaymentFailure);
