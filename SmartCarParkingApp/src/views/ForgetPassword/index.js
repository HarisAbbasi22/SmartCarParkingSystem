import React, {Component} from 'react';
import {Text, View, TextInput, Image, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';

import {getStatusBarHeight} from 'react-native-status-bar-height';

import {heightToDp, widthToDp} from '../../utils/dimensions';
export default class index extends Component {
  state = {
    email: '',
  };
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };
  Forgetpass = () => {
    auth()
      .sendPasswordResetEmail(this.state.email)
      .then(() => {
        alert('Email has been sent');
      })
      .catch(() => {
        // An error happened.
      });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          padding: 10,
          paddingTop: 30 + getStatusBarHeight(),
          backgroundColor: '#fafafa',
        }}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{paddingTop: 30, fontSize: 31, fontWeight: 'bold'}}>
            Forget Password
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 14}}>Enter your email address</Text>
        </View>
        <View style={{justifyContent: 'center'}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{
                height: heightToDp(30),
                width: widthToDp(30),
                resizeMode: 'contain',
              }}
              source={require('../..//Images/parking.png')}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#afafaf',
              borderRadius: 15,
              marginBottom: 10,
              paddingHorizontal: 15,
              marginTop: 20,
              backgroundColor: 'white',
            }}>
            <Image
              style={{height: 20, width: 20, resizeMode: 'contain'}}
              source={require('../..//Images/email.jpg')}
            />
            <TextInput
              style={{
                color: 'black',
                paddingHorizontal: 15,

                height: 50,
                width: '100%',
                fontSize: 18,
              }}
              placeholder="Email" //12345
              placeholderTextColor="#8b9cb5"
              keyboardType="default"
              underlineColorAndroid="#f000"
              returnKeyType="next"
              value={this.state.email}
              onChangeText={val => this.updateInputVal(val, 'email')}
            />
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              this.Forgetpass();
            }}
            style={{
              paddingVertical: 15,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: '#dadae8',
              backgroundColor: '#FFD428',
              marginTop: 50,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 18,
                color: 'black',
              }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{justifyContent: 'center'}}>
          <Text
            onPress={() => {
              this.props.navigation.navigate('Login');
            }}
            style={{paddingTop: 20, fontSize: 16, textAlign: 'center'}}>
            Back to Login
          </Text>
        </View>
      </View>
    );
  }
}
