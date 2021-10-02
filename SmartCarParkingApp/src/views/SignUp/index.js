import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {heightToDp, widthToDp} from '../../utils/dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class index extends Component {
  state = {
    displayName: '',
    email: '',
    password: '',
    isLoading: false,
    check: '',
    errorMessage: '',
  };

  registerUser = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signup!');
    } else if (reg.test(this.state.email) === false) {
      Alert.alert('Email is Not Correct');
      // this.setState({email:'Email is Not Correct'})
      return false;
    } else if (this.state.password.length < 3) {
      Alert.alert('Password format Not Correct');
      // this.setState({email:'Email is Not Correct'})
      return false;
    } else {
      this.setState({
        isLoading: true,
      });
      auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(async res => {
          res.user.updateProfile({
            displayName: this.state.displayName,
          });

          res.user.sendEmailVerification();
          await firestore().collection('Users').doc(res.user.uid).set({
            name: this.state.displayName,
            email: this.state.email,
            password: this.state.password,
            uid: res.user.uid,
          });
          res.user.reload().then(async response => {
            if (res.user.emailVerified) {
              this.setState({
                isLoading: false,
                displayName: '',
                email: '',
                password: '',
              });
              await AsyncStorage.setItem('uid', auth().currentUser.uid);
              this.props.navigation.replace('AddNewVehicle', {from: 'auth'});
            } else {
              Alert.alert('Sorry!', 'Please verify your email to continue', [
                {
                  text: 'OK',
                  onPress: () => this.props.navigation.navigate('Login'),
                },
              ]);
              this.setState({isLoading: false});
            }
          });
        })

        .catch(error => {
          if (error.code === 'auth/weak-password') {
            alert(' Password should be at least 6 characters');
          } else if (error.code === 'auth/email-already-in-use') {
            alert('The email address is already in use by another account');
          } else {
            alert(error.message);
          }
          this.setState({errorMessage: error, isLoading: false});
        });
    }
  };

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fafafa',
          }}>
          <ActivityIndicator size="large" color="#9E9E9E" />
          {/* <Text style={{fontSize: 31, fontWeight: 'bold', textAlign: 'center'}}>
            {alert(this.state.errorMessage)}
          </Text> */}
        </View>
      );
    }
    return (
      <View style={{padding: 10, paddingTop: 30 + getStatusBarHeight()}}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{paddingTop: 30, fontSize: 31, fontWeight: 'bold'}}>
              Get Started
            </Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 14}}>Let's create your account</Text>
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
                source={require('../..//Images/name.jpeg')}
              />
              <TextInput
                style={{
                  color: 'black',
                  paddingHorizontal: 15,

                  height: 50,
                  width: '100%',
                  fontSize: 18,
                }}
                placeholder="Name" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                underlineColorAndroid="#f000"
                returnKeyType="next"
                value={this.state.displayName}
                onChangeText={val => this.updateInputVal(val, 'displayName')}
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
                onChangeText={val =>
                  this.updateInputVal(val.toLocaleLowerCase(), 'email')
                }
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
                style={{
                  height: 20,
                  width: 20,
                  tintColor: 'black',
                  resizeMode: 'contain',
                }}
                source={require('../..//Images/password.png')}
              />
              <TextInput
                style={{
                  color: 'black',
                  paddingHorizontal: 15,

                  height: 50,
                  width: '100%',
                  fontSize: 18,
                }}
                secureTextEntry={true}
                placeholder="Password" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                underlineColorAndroid="#f000"
                returnKeyType="next"
                value={this.state.password}
                onChangeText={val => this.updateInputVal(val, 'password')}
              />
            </View>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                this.registerUser();
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
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{justifyContent: 'center'}}>
            <Text
              onPress={() => this.props.navigation.navigate('Login')}
              style={{paddingTop: 20, fontSize: 16, textAlign: 'center'}}>
              Already have an account? Login
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
