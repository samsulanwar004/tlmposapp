import React, { useContext, useState } from "react";
import { 
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image ,
  StatusBar,
  StyleSheet,
  Alert
} from 'react-native';
import {Context} from '../context/Store';
import { Button, ThemeProvider, Input, Text } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OneSignal from 'react-native-onesignal';

//api
import {register} from '../api/auth';

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

function RegisterScreen({navigation}) {

  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordHide, setPasswordHide] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({username: [], password: []});

  const [state, dispatch] = useContext(Context);

  async function handleRegister() {
    const deviceState = await OneSignal.getDeviceState();

    setLoading(true);

    let data = {
      username: username,
      password: password,
      name: name,
      player_id: typeof deviceState.userId != 'undefined' ? deviceState.userId : ''
    }

    const {code, result} = await register(data);

    if (code === 200) {
      setLoading(false);
      Alert.alert(
        'Success',
        result.data
      );
      navigation.navigate('Login')
    } else if (code === 422) {
      setError(result.errors)
      setLoading(false);
    } else {
      console.log(result);
      setLoading(false);
      Alert.alert(
        'Error',
        JSON.stringify(result)
      );
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
          label="Nama"
          placeholder=' Nama'
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
          autoCorrect={false}
          errorMessage={typeof error.name != 'undefined' ? error.name[0] : ''}
        />
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
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{marginHorizontal: 20, flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Text style={{color: 'grey'}}>Login</Text>
        </TouchableOpacity>
        <View style={{height: 30}}>
          {loading && <ActivityIndicator
            animating={true}
            style= {{ opacity : 1}}
            size="large" 
            color="#7d8032"
          />}
        </View>
        <View style={[styles.containerButton, {bottom: insets.bottom}]}>
          <Button title="REGISTER" onPress={() => handleRegister()} />
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

export default RegisterScreen;