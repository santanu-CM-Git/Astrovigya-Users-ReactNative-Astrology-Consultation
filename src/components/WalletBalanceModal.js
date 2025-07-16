import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';

const WalletBalanceModal = ({ visible, onClose, balance, rechargeAmount }) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>Insufficient Wallet Balance</Text>

                    <View style={styles.balanceContainer}>
                        <Text style={styles.balanceLabel}>Available Balance</Text>
                        <Text style={styles.balanceAmount}>₹{balance || '0.00'}</Text>
                    </View>

                    <Text style={styles.rechargeInfo}>
                        Minimum Recharge of ₹{rechargeAmount || 101} Required to Connect Astrologers via Chat or Call
                    </Text>

                    <TouchableOpacity style={styles.rechargeButton} onPress={() => alert('Recharge Now')}>
                        <Text style={styles.rechargeButtonText}>Recharge Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    closeButtonText: {
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(2),
        color: '8B939D',
    },
    title: {
        fontSize: responsiveFontSize(2),
        color: '#1E2023',
        fontFamily: 'PlusJakartaSans-Bold',
        marginVertical: responsiveHeight(2),
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: responsiveHeight(2),
        backgroundColor:'#F7F7F7',
        padding:10,
        borderRadius:10
    },
    balanceLabel: {
        fontSize: responsiveFontSize(1.7),
        fontFamily: 'PlusJakartaSans-Regular',
        color: '#8B939D',
    },
    balanceAmount: {
        fontSize: responsiveFontSize(1.7),
        fontFamily: 'PlusJakartaSans-Bold',
        color: '#1E2023',
    },
    rechargeInfo: {
        fontFamily: 'PlusJakartaSans-Regular',
        fontSize: responsiveFontSize(1.7),
        color: '#8B939D',
        marginBottom: responsiveHeight(4),
        textAlign: 'center',
    },
    rechargeButton: {
        backgroundColor: '#FF6A00',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    rechargeButtonText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: responsiveFontSize(1.7),
    },
});

export default WalletBalanceModal;
