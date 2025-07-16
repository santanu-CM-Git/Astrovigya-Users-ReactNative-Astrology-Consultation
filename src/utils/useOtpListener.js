// useOtpListener.js
import { useEffect, useRef } from 'react';
import {
    NativeModules,
    NativeEventEmitter,
    Platform,
} from 'react-native';

const { OTPModule } = NativeModules;

export const useOtpListener = (onOtpReceived, onOtpError) => {
    const emitterRef = useRef(null);
    const otpSubscriptionRef = useRef(null);
    const errorSubscriptionRef = useRef(null);

    useEffect(() => {
        if (Platform.OS !== 'android' || !OTPModule) return;

        const emitter = new NativeEventEmitter(OTPModule);
        emitterRef.current = emitter;

        OTPModule.startListeningForOTP();

        otpSubscriptionRef.current = emitter.addListener(
            'onOTPReceived',
            onOtpReceived,
        );

        if (onOtpError) {
            errorSubscriptionRef.current = emitter.addListener(
                'onOTPError',
                onOtpError,
            );
        }

        return () => {
            OTPModule.stopListeningForOTP();
            otpSubscriptionRef.current?.remove();
            errorSubscriptionRef.current?.remove();
            emitter.removeAllListeners('onOTPReceived');
            if (onOtpError) {
                emitter.removeAllListeners('onOTPError');
            }
        };
    }, [onOtpReceived, onOtpError]);
};
