import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {Context} from './context/Store';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();

//storage
import { storageSet, storageGet } from './storage';

//utils
import { IS_IPHONE_X } from './utils';

//screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import BarcodeScreen from './screens/BarcodeScreen';
import HistoryScreen from './screens/HistoryScreen';
import PersonalScreen from './screens/PersonalScreen';
import PosScreen from './screens/PosScreen';
import DetailHistoryScreen from './screens/DetailHistoryScreen';
import CameraScreen from './screens/CameraScreen';

//tab button
import TabBarcodeButton from './components/TabBarcodeButton';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabScreen() {

  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      tabBar={(props) => (
        <View style={styles.navigatorContainer}>
          <BottomTabBar
            {...props}
          />
          {IS_IPHONE_X && (
            <View style={[styles.xFillLine, {
              backgroundColor: '#FFFFFF'
            }]}/>
          )}
        </View>
      )}
      tabBarOptions={{
        showIcon: true,
        style: [styles.navigator, {paddingBottom: insets.bottom}],
        tabStyle: {
          backgroundColor: '#FFFFFF'
        },
        activeTintColor: '#7d8032',
        inactiveTintColor: 'grey',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="home-outline" size={24} color="grey" style={{color: color}}/>
        )
      }}/>
      <Tab.Screen
        name="TabNavigate"
        component=""
        options={{
          tabBarButton: (props) => (
            <TabBarcodeButton
              bgColor={'#FFFFFF'}
              {...props}
            />
          )
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="person-outline" size={24} color="grey" style={{color: color}}/>
        )
      }}/>
    </Tab.Navigator>
  )
}

function Route({ navigation }) {

  const [state, dispatch] = useContext(Context);

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let accessToken;

      try {
        accessToken = await storageGet('access_token');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setTimeout(() => {
        dispatch({ type: 'RESTORE_TOKEN', token: accessToken });
      }, 1000);
    };

    bootstrapAsync();
  }, []);

  if (state.auth.isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator initialRouteName="Login">
      {state.auth.accessToken == null ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
      ) : (
        <>
          <Stack.Screen name="Home" component={TabScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Camera" component={CameraScreen} options={{headerShown: false}}/>
          <Stack.Screen name="History" component={HistoryScreen} options={{}}/>
          <Stack.Screen name="Personal Information" component={PersonalScreen} options={{}}/>
          <Stack.Screen name="Pos" component={PosScreen} options={{title: 'Point Of Sale'}}/>
          <Stack.Screen name="Detail History" component={DetailHistoryScreen} options={{}}/>
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navigatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  navigator: {
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 30
  },
  xFillLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 34
  }
});

export default Route;