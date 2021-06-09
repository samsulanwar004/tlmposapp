import React, { useContext, useState, useEffect, useLayoutEffect } from "react";
import { View, Dimensions, Alert, ActivityIndicator, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import {Context} from '../context/Store';
import { Button, ThemeProvider, Input, Text, Avatar } from 'react-native-elements';
import HTML from "react-native-render-html";
import {
  IGNORED_TAGS,
  alterNode,
  makeTableRenderer
} from '@native-html/table-plugin';
import WebView from 'react-native-webview';
import { ListItem } from 'react-native-elements';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();

//lib
import {formatDate, nowDate, convertToRupiah, round} from '../lib';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

function DetailHistoryScreen({ navigation, route }) {

	const [state, dispatch] = useContext(Context);
	const [loading, setLoading] = useState(false);

	const {data} = route.params;

	let html = `
		<div style="overflow: scroll;">
			<table border="1" style="width: ${SCREEN_WIDTH}px;">
			    <thead>
			        <tr>
			            <th style="vertical-align: middle; text-align: center; background-color: #7d8032;">No</th>
			            <th style="vertical-align: middle; text-align: center; background-color: #7d8032;">Product Name</th>
			            <th style="vertical-align: middle; text-align: center; background-color: #7d8032;">Qty</th>
			            <th style="vertical-align: middle; text-align: center; background-color: #7d8032;">Price</th>
			        </tr>
			    </thead>
			    <tbody>`;

			    if (data.order_details.length > 0) {
			    	var i;
					for (i = 0; i < data.order_details.length; i++) {
					  	let detail = data.order_details[i];
					  	html += `<tr>
						    <td style="vertical-align: middle;">${i+1}</td>
						    <td style="vertical-align: middle;">${detail.product_name}</td>
						    <td style="vertical-align: middle;">${detail.qty}</td>
						    <td style="vertical-align: middle;">${convertToRupiah(round(detail.price ?? 0))}</td>
						</tr>
						`;
					}
			    } else {
			    	html += `<tr><td colspan="4">No data</td></tr>`;
			    }	        

		html += `<tr></tr></tbody>
			</table>
		</div>
	`;

	const renderers = {
	  table: makeTableRenderer({ WebView })
	};

	const htmlConfig = {
	  alterNode,
	  renderers,
	  ignoredTags: IGNORED_TAGS
	};

	return (
		<ThemeProvider>
			<StatusBar barStyle="dark-content" animated={true} showHideTransition="slide"/>
			<ScrollView style={{flex: 1,backgroundColor: '#FFFFFF'}}>
				<ListItem bottomDivider>
				    <ListItem.Content>
				      <ListItem.Title>Order ID</ListItem.Title>
				    </ListItem.Content>
				    <ListItem.Content>
				      <ListItem.Title>{data.id}</ListItem.Title>
				    </ListItem.Content>
				</ListItem>
				<ListItem bottomDivider>
				    <ListItem.Content>
				      <ListItem.Title>Status</ListItem.Title>
				    </ListItem.Content>
				    <ListItem.Content>
				      <ListItem.Title>{data.status}</ListItem.Title>
				    </ListItem.Content>
				</ListItem>
				<ListItem bottomDivider>
				    <ListItem.Content>
				      <ListItem.Title>Number Reference</ListItem.Title>
				    </ListItem.Content>
				    <ListItem.Content>
				      <ListItem.Title>{data.number_reference}</ListItem.Title>
				    </ListItem.Content>
				</ListItem>
				<ListItem bottomDivider>
				    <ListItem.Content>
				      <ListItem.Title>Created Date</ListItem.Title>
				    </ListItem.Content>
				    <ListItem.Content>
				      <ListItem.Title>{formatDate(new Date(data.created_at))}</ListItem.Title>
				    </ListItem.Content>
				</ListItem>
				<HTML html={html} {...htmlConfig} />
			</ScrollView>
		</ThemeProvider>
	);
}

export default DetailHistoryScreen;