import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const PaymentScreen = ({ route }) => {
  const navigation = useNavigation();
  const { payuUrl, postData, orderPlacedSubmit,txnid } = route.params;

  const handleNavigationChange = (webViewState) => {
    const { url } = webViewState;
    console.log(webViewState,'webViewStatewebViewStatewebViewState');
    if (url.includes('success')) {
      // Call the orderPlacedSubmit function
      orderPlacedSubmit(txnid);

      // Navigate to success screen or handle success state
      navigation.replace('PaymentSuccess');
    } else if (url.includes('failure')) {
      // Handle failure state or navigate to a failure screen
      navigation.replace('PaymentFailure');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: payuUrl, method: 'POST', body: postData }}
        javaScriptEnabled={true}
        onNavigationStateChange={handleNavigationChange}
        renderLoading={() => <ActivityIndicator size="large" color="#FB7401" />}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
};

export default PaymentScreen;
