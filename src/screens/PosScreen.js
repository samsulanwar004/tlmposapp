import React, { useContext, useState, useEffect, Fragment } from "react";
import { 
	View, 
	StatusBar, 
	StyleSheet, 
	Dimensions, 
	TouchableOpacity, 
	Modal, 
	FlatList, 
	ActivityIndicator, 
	Alert,
	Image,
	ScrollView,
	KeyboardAvoidingView
} from 'react-native';
import {Context} from '../context/Store';
import { 
	Button, 
	ThemeProvider, 
	Input, 
	Text, 
	Avatar, 
	ListItem,
	CheckBox
} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//api
import {order} from '../api/user';

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
  	containerStyle: {
  		height: 50
  	},
    inputContainerStyle: {
    	paddingLeft: 10,
    	borderWidth: 1,
    	borderColor: 'grey',
    	borderRadius: 5,
    	backgroundColor: '#FFFFFF'
    },
    inputStyle: {
      height: 50
    }
  }
};

function PosScreen({ navigation, route }) {

	const params = route.params;

	const insets = useSafeAreaInsets();
	const [state, dispatch] = useContext(Context);
	const [loading, setLoading] = useState(false);
	const [orders, setOrders] = useState([{
		product_name: '',
		image: '',
		qty: '',
		price: '',
	}]);
	const [error, setError] = useState({orders: []});
	const [modalImageZoom, setModalImageZoom] = useState(false);
	const [imageZoom, setImageZoom] = useState('');

	useEffect(() => {
		imageCollection();
	}, [route.params]);

	async function imageCollection() {
		if (typeof params != 'undefined') {
			let oldItem = [...orders];

			oldItem[params.key].image = params.image;
			
			setOrders(oldItem)
		}
	}

	async function request() {

		const {accessToken} = state.auth;

		setLoading(true);

		let data = {
		    orders: orders
	    }

	    const {code, result} = await order(accessToken, data);

	    if (code === 200) {
	    	setLoading(false);
	    	Alert.alert(
			  'Success',
			  'Order ID :'+result.data.id
			);
			
	    	setOrders([{
				product_name: '',
				image: '',
				qty: '',
				price: '',
			}]);
	    } else if (code === 422) {
	    	setLoading(false);
	    	console.log(result)
	    	setError(result.errors);
	    } else {
	    	setLoading(false);
	    	Alert.alert(
			  'Error',
			  JSON.stringify(result)
			);
	    }
	}

	function setName(text, key) {
		let oldItem = [...orders];

		oldItem[key].product_name = text;
		
		setOrders(oldItem)
	}

	function setQty(text, key) {
		let oldItem = [...orders];

		oldItem[key].qty = text;
		
		setOrders(oldItem)
	}

	function setPrice(text, key) {
		let oldItem = [...orders];

		oldItem[key].price = text;
		
		setOrders(oldItem)
	}

	function removeImage(key) {
		let oldItem = [...orders];

		oldItem[key].image = '';
		
		setOrders(oldItem)
	}

	function addItem() {
		let oldItem = [...orders];

		oldItem = oldItem.concat({
			product_name: '',
			image: '',
			qty: '',
			price: '',
		})

		setOrders(oldItem);
	}

	function removeItem(key) {
		let oldItem = [...orders];

		oldItem = oldItem.filter((r, k) => k != key);

		setOrders(oldItem);
	}

	function zoomImage(key) {
		setImageZoom(orders[key].image)

		setModalImageZoom(true)
	}

	const errorStye = (value, replace) => {
		return value.replace(replace,''); 
	}

	return (
		<ThemeProvider theme={theme}>
			<StatusBar barStyle="dark-content" animated={true} showHideTransition="slide"/>
			<KeyboardAvoidingView 
				behavior="padding"
      			style={{flex: 1}}
      		>
				<ScrollView style={{backgroundColor: '#f9fafe', marginBottom: 70}}>
					<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
						{orders.map((data, key) => {
							return (
								<Fragment key={key}>
									<View style={{flexDirection: 'row', width: SCREEN_WIDTH-30, marginVertical: 5, justifyContent: 'space-between', alignItems: 'center'}}>
										<Text style={{fontWeight: 'bold'}}>Item {key+1}</Text>
										<TouchableOpacity disabled={orders.length <= 1 ? true : false} onPress={() => removeItem(key)}>
											<Ionicons name="ios-trash-outline" size={20} color="#EB5757" />
										</TouchableOpacity>
									</View>
									<View style={{flexDirection: 'row', width: SCREEN_WIDTH-30, marginVertical: 5, justifyContent: 'space-between'}}>
										<Text style={{width: (SCREEN_WIDTH-40)/2}}>Product Name</Text>
									</View>
									<View style={{flexDirection: 'row', width: SCREEN_WIDTH-30, alignItems: 'center', justifyContent: 'space-between', paddingBottom: typeof error['orders.'+key+'.product_name'] != 'undefined' ? 15 : 0}}>
										<Input
											inputContainerStyle={{width: SCREEN_WIDTH - 45}}
											inputStyle={{height: 48}}
					          	placeholder=' Fill Product Name'
					          	value={data.product_name}
					          	onChangeText={(text) => setName(text, key)}
					          	autoCapitalize="none"
					          	autoCorrect={false}
					          	errorMessage={typeof error['orders.'+key+'.product_name'] != 'undefined' ? errorStye(error['orders.'+key+'.product_name'][0], 'orders.'+key+'.') : ''}
					        	/>
									</View>
									<View style={{flexDirection: 'row', width: SCREEN_WIDTH-30, marginVertical: 5, justifyContent: 'space-between'}}>
										<Text style={{width: (SCREEN_WIDTH-40)/2}}>QTY</Text>
									</View>
									<View style={{flexDirection: 'row', width: SCREEN_WIDTH-30, alignItems: 'center', justifyContent: 'space-between', paddingBottom: typeof error['orders.'+key+'.qty'] != 'undefined' ? 15 : 0}}>
										<Input
											inputContainerStyle={{width: SCREEN_WIDTH/3}}
											inputStyle={{height: 48}}
					          	placeholder=' Fill qty here'
					          	value={data.qty}
					          	onChangeText={(text) => setQty(text, key)}
					          	autoCapitalize="none"
					          	autoCorrect={false}
					          	keyboardType="numeric"
					          	errorMessage={typeof error['orders.'+key+'.qty'] != 'undefined' ? errorStye(error['orders.'+key+'.qty'][0], 'orders.'+key+'.') : ''}
					        	/>
					        	{data.image == '' && 
					        		<TouchableOpacity 
												onPress={() => navigation.navigate('Camera', {mode: 'back', callback: 'Pos', key: key})}
												style={{
													flexDirection: 'column',
													justifyContent: 'center',
													alignItems: 'center',
													borderWidth: 1, 
													borderRadius: 5, 
													borderColor: 'grey',
													borderStyle: 'dashed', 
													backgroundColor: '#E5E5E5', 
													width: 48, 
													height: 48,
													position: 'absolute',
													left: SCREEN_WIDTH/3 + 20,
													bottom: typeof error['orders.'+key+'.qty'] != 'undefined' ? 15 : 0,
												}}
											>
												<Ionicons name="ios-camera" size={SCREEN_WIDTH/12} color="grey" />
											</TouchableOpacity>
					        	}
					        	{data.image != '' &&
											<TouchableOpacity 
												onPress={() => zoomImage(key)}
												style={{
													top: 1,
													bottom: typeof error['orders.'+key+'.qty'] != 'undefined' ? 15 : 0,
													position: 'absolute',
													left: SCREEN_WIDTH/3 + 20
												}}
											>
												<Image
													source={{uri: 'data:image/jpg;base64,'+data.image}} 
													resizeMode="cover" 
													style={{
														width: 48, 
														height: 48, 
														borderRadius: 5,
														marginRight: 10,
														marginBottom: 10
													}} 
												/>
												<TouchableOpacity 
													onPress={() => removeImage(key)}
													style={{
														position: 'absolute', 
														top: 3, 
														right: 13, 
														backgroundColor: '#FFFFFF', 
														borderRadius: 10
													}}>
													<Ionicons name="ios-close" size={SCREEN_WIDTH/25} color="#EB5757" />
												</TouchableOpacity>
											</TouchableOpacity>
										}
									</View>
									<View style={{flexDirection: 'row', width: SCREEN_WIDTH-30, marginVertical: 5, justifyContent: 'space-between'}}>
										<Text style={{width: (SCREEN_WIDTH-40)/2}}>Price</Text>
									</View>
									<View style={{flexDirection: 'row', width: SCREEN_WIDTH-30, alignItems: 'center', justifyContent: 'space-between', paddingBottom: typeof error['orders.'+key+'.price'] != 'undefined' ? 15 : 0}}>
										<Input
											inputContainerStyle={{width: SCREEN_WIDTH - 45}}
											inputStyle={{height: 48}}
								          	placeholder=' Fill price here'
								          	value={data.price}
								          	onChangeText={(text) => setPrice(text, key)}
								          	autoCapitalize="none"
								          	autoCorrect={false}
								          	keyboardType="numeric"
								          	errorMessage={typeof error['orders.'+key+'.price'] != 'undefined' ? errorStye(error['orders.'+key+'.price'][0], 'orders.'+key+'.') : ''}
								        />
									</View>
								</Fragment>
							)
						})}
						<View style={{flexDirection: 'row', width: SCREEN_WIDTH-30, marginVertical: 10}}>
							<Button 
								title="Add New Item" 
								raised={false} 
								buttonStyle={{backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#7d8032'}} 
								titleStyle={{color: '#7d8032', fontWeight: 'normal'}}
								onPress={() => addItem()} 
							/>
						</View>
					</View>
				</ScrollView>
				<View style={[styles.containerButton, {bottom: insets.bottom}]}>
					<Button 
						icon={ loading && <ActivityIndicator
				            animating={true}
				            style= {{ opacity : 1}}
				            size="large" 
				            color="grey"
				        />}
						title="Process" 
						disabled={loading} 
						onPress={() => request()} 
					/>
				</View>
		    </KeyboardAvoidingView>
		    <Modal
	        animationType="slide"
	        transparent={true}
	        visible={modalImageZoom}
		    >
		    	<View style={styles.centeredViewImageZoom}>
          	<View style={styles.modalViewImageZoom}>
          		<View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          			<Image
									source={{uri: 'data:image/jpg;base64,'+imageZoom}} 
									resizeMode="cover" 
									style={{
										width: SCREEN_WIDTH - 100, 
										height: SCREEN_HEIGHT/2, 
										borderRadius: 5
									}} 
								/>
          		</View>
          		<TouchableOpacity 
          			onPress={() => setModalImageZoom(false)}
          			style={{position: 'absolute', right: 6, top: 6}}>
								<Ionicons name="ios-close" size={30} color="#EB5757" />
							</TouchableOpacity>
          	</View>
		      </View>
		    </Modal>
		</ThemeProvider>
	);
}

const styles = StyleSheet.create({
	containerButton: {
		backgroundColor: '#FFFFFF',
		paddingVertical: 10,
		paddingHorizontal: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: SCREEN_WIDTH,
		borderWidth: 0.3,
		borderColor: 'grey',
		position: 'absolute',
		bottom: 0
	},
	centeredViewImageZoom: {
    flex: 1,
    justifyContent: 'center'
	},
	modalViewImageZoom: {
		marginHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
	},
});

export default PosScreen;