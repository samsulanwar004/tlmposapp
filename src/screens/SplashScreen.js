import React, {useEffect, useContext} from "react";
import { View, Dimensions, Image, StatusBar } from 'react-native';
import { Button, ThemeProvider, Text } from 'react-native-elements';
import OneSignal from 'react-native-onesignal';
import {ONESIGNAL_APPID} from '@env';
import {Context} from '../context/Store';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('screen');

function SplashScreen({ navigation }) {

  const [state, dispatch] = useContext(Context);

	useEffect(() => {
		initOsignal();
	}, []);

  async function initOsignal() {
    /* O N E S I G N A L   S E T U P */
    OneSignal.setAppId(ONESIGNAL_APPID);
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log("Prompt response:", response);
    });
    /* O N E S I G N A L  H A N D L E R S */
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log("OneSignal: notification opened:", notification);
    });
  }

  return (
  	<ThemeProvider>
  		<StatusBar barStyle="light-content" animated={true} showHideTransition="slide" backgroundColor="#7d8032"/>
		<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#7d8032', width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}>
			<Image source={require('../assets/logo_tlm.png')} resizeMode="contain" style={{width: SCREEN_WIDTH/2, height: SCREEN_WIDTH/2}} />
		  	<Text h1 style={{color: 'white'}}>TLM POS</Text>
		</View>
    </ThemeProvider>
  );
}

export default SplashScreen;