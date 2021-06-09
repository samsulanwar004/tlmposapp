import React, { useContext, useState, useEffect, useLayoutEffect } from "react";
import { View, FlatList, StyleSheet, Dimensions, TouchableOpacity, Alert, RefreshControl, StatusBar } from 'react-native';
import {Context} from '../context/Store';
import { Button, ThemeProvider, Input, Text, Avatar, ListItem } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import _ from 'lodash';

//api
import {history} from '../api/user';

//lib
import {formatDate, toSerialize} from '../lib';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('screen');

function HistoryScreen({ navigation }) {

	const insets = useSafeAreaInsets();
	const [state, dispatch] = useContext(Context);
	const [loading, setLoading] = useState(false);
	const [dataHistory, setDataHistory] = useState(Array());

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
	    getHistory();
	}, []);

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
			<StatusBar barStyle="dark-content" animated={true} showHideTransition="slide"/>
			<FlatList
				refreshControl={<RefreshControl
                    color="#7d8032"
                    refreshing={false}
                    onRefresh={() => getHistory()} />
                }
				style={[styles.containerHistory, {marginBottom: insets.bottom}]}
		      	keyExtractor={keyExtractor}
		      	data={dataHistory}
		      	renderItem={renderItem}
		    />
		</ThemeProvider>
	);
}

const styles = StyleSheet.create({
	containerHistory : {
		flex: 1,
		backgroundColor: '#f9fafe',
		width: SCREEN_WIDTH, 
		borderTopLeftRadius: 10, 
		borderTopRightRadius: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 1,
	},
});

export default HistoryScreen;