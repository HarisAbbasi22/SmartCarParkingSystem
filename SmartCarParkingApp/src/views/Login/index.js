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
import {getStatusBarHeight} from 'react-native-status-bar-height';
import firestore from '@react-native-firebase/firestore';
import {heightToDp, widthToDp} from '../../utils/dimensions';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class index extends Component {
  state = {
    email: '',
    password: '',
    user: '',
    isLoading: false,
    isverify: false,
  };
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };
  onLogin = () => {
    if (this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signin!');
    } else {
      this.setState({
        isLoading: true,
      });
      this.setState({isverify: true});

      auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(res => {
          res.user.reload().then(async response => {
            if (!res.user.emailVerified) {
              Alert.alert(
                'Sorry!',
                'Please verify your email to continue. We have sent a new verification email to your provided email address.',
                [
                  {
                    text: 'OK',
                    onPress: () => res.user.sendEmailVerification(),
                  },
                ],
              );
              this.setState({isLoading: false});
            } else {
              await AsyncStorage.setItem('uid', auth().currentUser.uid);

              this.setState({user: res.user.displayName});
              console.log(res);
              console.log('User logged-in successfully!');
              this.setState({
                isLoading: false,
                email: '',
                password: '',
              });
              firestore()
                .collection('Users')
                .doc(auth().currentUser.uid)
                .get()
                .then(data => {
                  if (data.data().LicensePlateNo) {
                    this.props.navigation.replace('MainStack');
                  } else {
                    this.props.navigation.replace('AddNewVehicle', {
                      from: 'auth',
                    });
                  }
                });
            }
          });
        })
        .catch(error => {
          this.setState({errorMessage: error.message, isLoading: false});
          alert(error.message);
        });
    }
  };

  componentDidMount() {}

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
            backgroundColor: '#fff',
          }}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          padding: 10,
          paddingTop: 30 + getStatusBarHeight(),
          backgroundColor: '#fafafa',
        }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{paddingTop: 30, fontSize: 31, fontWeight: 'bold'}}>
              Welcome Back!
            </Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 14,
              }}>
              Enter your email and password
            </Text>
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
                this.onLogin();
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
                Login
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{justifyContent: 'center'}}>
            <Text
              onPress={() => {
                this.props.navigation.navigate('SignUp');
              }}
              style={{paddingTop: 20, fontSize: 16, textAlign: 'center'}}>
              Don't have an account? Sign Up
            </Text>
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text
              onPress={() => {
                this.props.navigation.navigate('ForgetPassword');
              }}
              style={{paddingTop: 20, fontSize: 16, textAlign: 'center'}}>
              Forget Password
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
