import React, { useContext, useState } from "react";
import { 
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image ,
  StatusBar,
  StyleSheet
} from 'react-native';
import {Context} from '../context/Store';
import { Button, ThemeProvider, Input, Text } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//api
import {login} from '../api/auth';

//storage
import { storageSet, storageGet } from '../storage';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('screen');

const theme = {
  Button: {
    raised: true,
    titleStyle: {
      color: 'white',
      fontWeight: 'bold'
    },
    buttonStyle: {
      backgroundColor: '#7d8032',
      height: 50,
      width: SCREEN_WIDTH-30
    }
  },
  Input: {
    inputContainerStyle: {
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 5
    },
    labelStyle: {
      color: 'black',
      fontWeight: 'normal',
      marginBottom: 5
    },
    inputStyle: {
      height: 50
    }
  }
};

function LoginScreen() {

  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordHide, setPasswordHide] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({username: [], password: []});

  const [state, dispatch] = useContext(Context);

  async function logIn() {
    const {device} = state.onesignal;

    setLoading(true);

    let data = {
      username: username,
      password: password,
      player_id: device != null ? device.userId : ''
    }

    const {code, result} = await login(data);

    if (code === 200) {
      await storageSet('access_token', result.data.access_token);
      dispatch({ type: 'LOG_IN', token: result.data.access_token });
      setLoading(false);
    } else if (code === 422) {
      setError(result.errors)
      setLoading(false);
    } else {
      console.log(result);
      setLoading(false);
    }
  }
    
  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="light-content" animated={true} showHideTransition="slide" backgroundColor="#7d8032"/>
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: '#7d8032', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{marginLeft: 10, marginBottom: 20}}>
          <Image source={require('../assets/logo_tlm.png')} resizeMode="contain" style={{width: SCREEN_WIDTH/2, height: SCREEN_WIDTH/2}} />
        </View>
      </View>
      <View style={{flex: 2, flexDirection: 'column', backgroundColor: 'white', paddingTop: 40}}>
        <Input
          label="Username"
          placeholder=' Username'
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          errorMessage={typeof error.username != 'undefined' ? error.username[0] : ''}
        />
        <Input
          label="Password"
          placeholder=' Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry={passwordHide}
          rightIcon={
            <TouchableOpacity onPress={() => setPasswordHide(!passwordHide)}>
              <Ionicons name={passwordHide ? 'ios-eye-off' : 'ios-eye'} size={24} color="grey" />
            </TouchableOpacity>
          }
          autoCapitalize="none"
          autoCorrect={false}
          errorMessage={typeof error.password != 'undefined' ? error.password[0] : ''}
        />
        <View style={{height: 30}}>
          {loading && <ActivityIndicator
            animating={true}
            style= {{ opacity : 1}}
            size="large" 
            color="#1293ff"
          />}
        </View>
        <View style={[styles.containerButton, {bottom: insets.bottom}]}>
          <Button title="LOGIN" onPress={() => logIn()} />
        </View>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  containerButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    position: 'absolute',
    bottom: 0
  }
});

export default LoginScreen;