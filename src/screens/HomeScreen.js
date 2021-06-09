import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, StatusBar, FlatList, Alert, RefreshControl} from 'react-native';
import {Context} from '../context/Store';
import { Button, ThemeProvider, Input, Text, Avatar, ListItem } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import _ from 'lodash';

//api
import {profile, history} from '../api/user';

//lib
import {formatDate, toSerialize} from '../lib';

//storage
import { storageGet, storageClear } from '../storage';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('screen');

function HomeScreen({ navigation, route }) {

	const insets = useSafeAreaInsets();
	const [state, dispatch] = useContext(Context);
	const [loading, setLoading] = useState(false);
	const [dataProfile, setDataProfile] = useState('');
	const [dataAnnouncement, setDataAnnouncement] = useState('');
	const [dataHistory, setDataHistory] = useState(Array());

	async function getProfile() {
	    setLoading(true);

	    const {code, result} = await profile(state.auth.accessToken);

	    if (code === 200) {
	    	setDataProfile(result.data);
	    	dispatch({type: 'RESTORE_PROFILE', profile: result.data});
	    	setLoading(false);
	    } else if (code === 401) {
	    	Alert.alert(
			  'Unauthenticated',
			  'Session Expired'
			);

			setLoading(false);
			//logout
			await storageClear('access_token');
	      	dispatch({ type: 'LOG_OUT' });
	    } else {
	      	Alert.alert(
			  'Error',
			  JSON.stringify(result)
			);
	      	setLoading(false);
	    }
	}

	async function getHistory() {
		setLoading(true);

	    let params = toSerialize({
	    	limit: 100,
	    	offset: 0,
	    });

	    const {code, result} = await history(state.auth.accessToken, params);

	    if (code === 200) {
	    	setDataHistory(result.data)
	    	setLoading(false);
	    } else if (code === 422) {
	    	console.log(result);
	      	setLoading(false);
	    } else {
	      	console.log(result);
	      	setLoading(false);
	    }
	}

	useEffect(() => {
	    getProfile();

	    const unsubscribe = navigation.addListener('focus', () => {
	      // The screen is focused
	      // Call any action
	      getHistory();
	    });

	    // Return the function to unsubscribe from the event so it gets removed on unmount
	    return unsubscribe;
	}, [navigation]);

	keyExtractor = (item, index) => index.toString();

	renderItem = ({ item }) => (
		<ListItem
			onPress={() => navigation.navigate('Detail History', {data: item})} 
		  	bottomDivider
		  	containerStyle={{backgroundColor: 'white'}}
		>
		    <ListItem.Content>
		      	<ListItem.Title>Order ID : {item.id}</ListItem.Title>
		      	<ListItem.Subtitle>{item.status}</ListItem.Subtitle>
		      	<ListItem.Subtitle>{item.number_reference}</ListItem.Subtitle>
		    </ListItem.Content>
		    <ListItem.Subtitle>{formatDate(new Date(item.created_at.split(' ')[0]))}</ListItem.Subtitle>
		</ListItem>
	)

	return (
		<ThemeProvider>
			<StatusBar barStyle="light-content" animated={true} showHideTransition="slide" backgroundColor="#7d8032"/>
			<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: '#7d8032'}}>
				<View style={{position: 'absolute', top: 0, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', width: SCREEN_WIDTH}}>
		          <Image source={require('../assets/logo_tlm.png')} resizeMode="contain" style={{width: SCREEN_WIDTH/3, height: SCREEN_WIDTH/3}} />
		        </View>
				<View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 20}}>
					<Avatar containerStyle={{borderColor: 'white', borderWidth: 2, backgroundColor: 'grey'}} rounded size="large" title={dataProfile.initial_user} />
					<View style={{marginLeft: 10}}>
						<Text style={styles.textProfile}>{dataProfile.name}</Text>
						<Text style={styles.textProfile}>{dataProfile.email}</Text>
					</View>
				</View>
			</View>
			<View style={{flex: 3, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafe'}}>
				<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: SCREEN_WIDTH-40, marginTop: (SCREEN_WIDTH-40)/6+(insets.top/3) }}>
					<Text h4 style={{fontWeight: 'bold'}}>History</Text>
					<Text onPress={() => navigation.navigate('History')} style={{fontWeight: 'bold', color: '#7d8032'}}>View All</Text>
				</View>
				<FlatList
					refreshControl={<RefreshControl
	                    color="#7d8032"
	                    refreshing={false}
	                    onRefresh={() => getHistory()} />
	                }
					style={[styles.containerHistory, {marginBottom: 50 + insets.bottom}]}
			      	keyExtractor={keyExtractor}
			      	data={dataHistory}
			      	renderItem={renderItem}
			    />
			</View>
			<View style={[styles.containerMenu, {top: SCREEN_HEIGHT/6 + insets.top}]}>
				<TouchableOpacity
					activeOpacity={1} 
					style={styles.menu}
					onPress={() => navigation.navigate('Pos')}
				>
					<View style={{backgroundColor: '#7d8032', padding: 15, borderRadius: 50}}>
						<Ionicons name="cart-outline" size={24} color="#FFFFFF"/>
					</View>
					<Text>
						Pos
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={1} 
					style={styles.menu}
					onPress={() => navigation.navigate('History')}
				>
					<View style={{backgroundColor: '#7d8032', padding: 15, borderRadius: 50}}>
						<Ionicons name="list-outline" size={24} color="#FFFFFF"/>
					</View>
					<Text>
						History
					</Text>
				</TouchableOpacity>
			</View>
		</ThemeProvider>
	);
}

const styles = StyleSheet.create({
	containerMenu: {
		top: 150,
		left: 20,
		position: 'absolute',
		flexWrap: 'wrap',
		flexDirection: 'row',
		backgroundColor: 'white',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
		width: SCREEN_WIDTH - 40,
		borderRadius: 10
	},
    menu: {
		flexDirection: 'column', 
		justifyContent: 'center', 
		alignItems: 'center', 
		width: (SCREEN_WIDTH-40)/4, 
		marginVertical: 10
	},
	textProfile: {
		color: 'white', 
		fontWeight: 'bold', 
		fontSize: 20
	},
	containerHistory : {
		width: SCREEN_WIDTH - 40, 
		borderTopLeftRadius: 10, 
		borderTopRightRadius: 10, 
		marginTop: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 0
	},
});

export default HomeScreen;