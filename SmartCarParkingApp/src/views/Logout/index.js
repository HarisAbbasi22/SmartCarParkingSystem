import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class index extends Component {
  signOut = () => {
    auth()
      .signOut()
      .then(async () => {
        await AsyncStorage.removeItem('uid');
        this.props.navigation.replace('Login');
      })
      .catch(error => {
        console.log('error', error);
        this.setState({errorMessage: error.message});
      });
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#E5E5E5',
        }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            backgroundColor: '#FFD428',
            width: 250,
            height: 50,
            padding: 10,
            borderWidth: 1,
            borderColor: 'transparent',
            borderRadius: 8,
            marginBottom: 10,
          }}
          onPress={() => this.signOut()}>
          <Text
            style={{
              fontSize: 20,
              alignItems: 'center',
              justifyContent: 'center',
              color: 'black',
            }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
