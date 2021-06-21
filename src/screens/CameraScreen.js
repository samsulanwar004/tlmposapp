import React, { useContext, useState, useEffect, Fragment } from "react";
import { View, TouchableOpacity, StyleSheet, Image, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import {Context} from '../context/Store';
import { Button, ThemeProvider, Input, Text, Avatar } from 'react-native-elements';
import { RNCamera } from 'react-native-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('screen');
const maskRowHeight = Math.round((SCREEN_HEIGHT - 200) / 80);
const maskColWidth = (SCREEN_WIDTH - 250) / 4;

function CameraScreen({ navigation, route }) {

	const {mode, callback, key} = route.params;

	const insets = useSafeAreaInsets();
	const [state, dispatch] = useContext(Context);
	const [flash, setFlash] = useState(false);
	const [cameraReverse, setCameraReverse] = useState(false);
	const [image, setImage] = useState('');
	const [type, setType] = useState(RNCamera.Constants.Type.front);
	const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);
	const [isActive, setIsActive] = useState(false);
	const [loading, setloading] = useState(false);

	useEffect(() => {
		setIsActive(true);

		if (mode === 'back') {
			setCameraReverse(true);
			setType(RNCamera.Constants.Type.back);
		}

	}, []);

	takePicture = async function() {

		setloading(true);

	    const options = { quality: 0.5, base64: true };
	    const data = await camera.takePictureAsync(options);
	    //  eslint-disable-next-line
	    setImage(data.base64);
	    setIsActive(false);
	    setloading(false);
	};

	async function toggleFlash() {
		await setFlash(!flash);

		if (!flash) {
			setFlashMode(RNCamera.Constants.FlashMode.torch);
		} else {
			setFlashMode(RNCamera.Constants.FlashMode.off);
		}
	}

	async function toggleCameraReverse() {
		await setCameraReverse(!cameraReverse);

		if (!cameraReverse) {
			setType(RNCamera.Constants.Type.back);
		} else {
			setType(RNCamera.Constants.Type.front);
		}
	}

	function renderCamera() {

	    if (!isActive) {
	      return (
	      	<Fragment>
	      		<Image source={{uri: 'data:image/jpg;base64,'+image}} resizeMode="contain" style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}/>
	            <View style={styles.maskOutter}>
		          <View
		            style={[
		              { flex: maskRowHeight },
		              styles.maskRow,
		              styles.maskFrame
		            ]}
		          />
		          <View style={[{ flex: 30 }, styles.maskCenter]}>
		            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
		            <View style={styles.maskInner} />
		            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
		          </View>
		          <View
		            style={[
		              { flex: maskRowHeight },
		              styles.maskRow,
		              styles.maskFrame
		            ]}
		          />
		        </View>
		        <View
		          style={{
		          	width: SCREEN_WIDTH,
		          	position: 'absolute',
		          	top: 30 + insets.top,
		          	flexDirection: 'row',
	          		justifyContent: 'space-between',
	          		alignItems: 'center',
	          		paddingHorizontal: 20
		          }}
		        >	
		        	<TouchableOpacity onPress={() => navigation.goBack()}>
			            <Ionicons name="ios-chevron-back" size={30} color="#FFFFFF" />
		            </TouchableOpacity>
		            <View style={{
		            	flexDirection: 'row'
		            }}>
		            	<TouchableOpacity style={{marginRight: 20}} onPress={() => toggleFlash()}>
			            	<Ionicons name={flash ? 'ios-flash' : 'ios-flash-off'} size={24} color="#FFFFFF" />
			            </TouchableOpacity>
			            <TouchableOpacity onPress={() => toggleCameraReverse()}>
			            	<Ionicons name="ios-camera-reverse" size={24} color="#FFFFFF" />
			            </TouchableOpacity>
		            </View>
		        </View>
		        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', position: 'absolute', bottom: 40 + insets.bottom, width: SCREEN_WIDTH }}>
	                <TouchableOpacity onPress={() => setIsActive(true)} style={{borderRadius: 30, padding: 10, backgroundColor: '#FFFFFF'}}>
	                	<Ionicons name="ios-reload" size={24} color="#1293FF" />
	                </TouchableOpacity>
	                <TouchableOpacity onPress={() => navigation.navigate(callback, {image: image, key: key})} style={{borderRadius: 30, padding: 10, backgroundColor: '#FFFFFF'}}>
	                	<Ionicons name="ios-checkmark" size={24} color="#1293FF" />
	                </TouchableOpacity>
	            </View>
	      	</Fragment>
	      );
	    }

	    return (
	    	<Fragment>
			    <RNCamera
			    	ref={ref => {
			            camera = ref;
			        }}
			        style={styles.cameraView}
			        type={type}
			        defaultTouchToFocus
			        flashMode={flashMode}
			        mirrorImage={true}
			        onFocusChanged={() => {}}
			        onZoomChanged={() => {}}
			        captureAudio={false}
			      >
			        <View style={styles.maskOutter}>
			          <View
			            style={[
			              { flex: maskRowHeight },
			              styles.maskRow,
			              styles.maskFrame
			            ]}
			          />
			          <View style={[{ flex: 30 }, styles.maskCenter]}>
			            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
			            <View style={styles.maskInner} />
			            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
			          </View>
			          <View
			            style={[
			              { flex: maskRowHeight },
			              styles.maskRow,
			              styles.maskFrame
			            ]}
			          />
			        </View>
			    </RNCamera>
			    <View
		          style={{
		          	width: SCREEN_WIDTH,
		          	position: 'absolute',
		          	top: 30 + insets.top,
		          	flexDirection: 'row',
	          		justifyContent: 'space-between',
	          		alignItems: 'center',
	          		paddingHorizontal: 20
		          }}
		        >	
		        	<TouchableOpacity onPress={() => navigation.goBack()}>
			            <Ionicons name="ios-chevron-back" size={30} color="#FFFFFF" />
		            </TouchableOpacity>
		            <View style={{
		            	flexDirection: 'row'
		            }}>
		            	<TouchableOpacity style={{marginRight: 20}} onPress={() => toggleFlash()}>
			            	<Ionicons name={flash ? 'ios-flash' : 'ios-flash-off'} size={24} color="#FFFFFF" />
			            </TouchableOpacity>
			            <TouchableOpacity onPress={() => toggleCameraReverse()}>
			            	<Ionicons name="ios-camera-reverse" size={24} color="#FFFFFF" />
			            </TouchableOpacity>
		            </View>
		        </View>
		        <View
		          style={{
		          	width: SCREEN_WIDTH,
		          	position: 'absolute',
		          	bottom: 20 + insets.bottom,
		          	flexDirection: 'row',
	          		justifyContent: 'center',
	          		alignItems: 'center'
		          }}
		        >	
		        	<TouchableOpacity onPress={() => takePicture()} style={styles.capture}>
	                	<View style={{backgroundColor: '#FFFFFF', width: 60, height: 60, borderRadius: 50}} />
	                </TouchableOpacity>
		        </View>
		        {loading &&
			      	<View style={{
			      		width: SCREEN_WIDTH,
			      		height: SCREEN_HEIGHT,
			      		position: 'absolute', 
			      		flexDirection: 'row',
	          			justifyContent: 'center',
	          			alignItems: 'center'
	          		}}> 
			        	<ActivityIndicator
				            animating={true}
				            style= {{ opacity : 1}}
				            size="large" 
				            color="#FFFFFF"
				        />
				    </View>
			    }
	        </Fragment>
		)
	}

	return (
		<ThemeProvider>
			<StatusBar barStyle="light-content" animated={true} showHideTransition="slide"/>
	        {renderCamera()}
	     </ThemeProvider>
	);
}

const styles = StyleSheet.create({
  cameraView: {
    flex: 1,
    justifyContent: "flex-start",
  },
  maskOutter: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around"
  },
  maskInner: {
    width: SCREEN_WIDTH,
    backgroundColor: "transparent",
  },
  maskFrame: {
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  maskRow: {
    width: "100%"
  },
  maskCenter: { 
    flexDirection: "row" 
  },
  capture: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 50,
    padding: 5,
  }
});

export default CameraScreen;