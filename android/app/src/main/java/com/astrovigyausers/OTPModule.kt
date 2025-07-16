package com.astrovigyausers

import android.content.*
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.auth.api.phone.SmsRetriever

class OTPModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var receiver: MySMSBroadcastReceiver? = null
    private var isReceiverRegistered = false

    override fun getName(): String = "OTPModule"

    private fun sendEvent(eventName: String, data: String?) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, data)
    }

    private fun registerReceiver(context: Context) {
        receiver = MySMSBroadcastReceiver().apply {
            initListener(object : MySMSBroadcastReceiver.Listener {
                override fun onOtpReceived(value: String?) {
                    sendEvent("onOTPReceived", value)
                    unregisterReceiver(context)
                    startSmsRetriever(context) // restart listening
                }
            })
        }

        val filter = IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            context.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
        } else {
            context.registerReceiver(receiver, filter)
        }
        isReceiverRegistered = true
    }

    private fun unregisterReceiver(context: Context) {
        if (isReceiverRegistered) {
            try {
                context.unregisterReceiver(receiver)
            } catch (e: Exception) {
                Log.e("OTPModule", "Unregister failed: ${e.message}")
            }
            isReceiverRegistered = false
            receiver = null
        }
    }

    private fun startSmsRetriever(context: Context) {
        val task = SmsRetriever.getClient(context).startSmsRetriever()
        task.addOnSuccessListener {
            registerReceiver(context)
        }
        task.addOnFailureListener {
            sendEvent("onOTPError", "Failed to start SMS retriever")
        }
    }

    @ReactMethod
    fun startListeningForOTP() {
        startSmsRetriever(reactApplicationContext)
    }

    @ReactMethod
    fun stopListeningForOTP() {
        unregisterReceiver(reactApplicationContext)
    }
}