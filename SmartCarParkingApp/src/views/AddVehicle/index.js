import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';

export default class index extends Component {
  state = {
    CarModel: '',
    PlateNo: '',
    loading: false,
  };

  componentDidMount() {
    if (this.props.route.params?.from === 'auth') {
      AsyncStorage.setItem('checkpoint', 'AddNewVehicle');
    }
  }

  AddCar = async () => {
    const user = auth().currentUser;
    this.setState({
      loading: true,
    });
    await firestore().collection('Users').doc(user.uid).update({
      CarModel: this.state.CarModel,
      LicensePlateNo: this.state.PlateNo,
    });

    await AsyncStorage.setItem('checkpoint', '');

    this.setState({
      loading: false,
    });
    Alert.alert('Congrats!', 'Your vehicle is added successfully.');
    this.props.navigation.replace('MainStack');
  };

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <View>
            <Image
              style={{width: '100%', height: 250, resizeMode: 'cover'}}
              source={require('../../Images/add-vehicle.png')}
            />
          </View>
          <View style={{padding: 10}}>
            <Text style={{fontSize: 31, fontWeight: 'bold'}}>
              Vehicle Details
            </Text>
            <Text style={{fontSize: 18}}>Add your vehicle details below</Text>

            <View style={{height: 50, marginTop: 30}}>
              <TextInput
                style={{
                  flex: 1,
                  color: 'black',
                  backgroundColor: 'white',
                  paddingLeft: 15,
                  paddingRight: 15,
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: '#dadae8',
                }}
                placeholder="License Plate Number" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                underlineColorAndroid="#f000"
                returnKeyType="next"
                value={this.state.PlateNo}
                onChangeText={val => this.updateInputVal(val, 'PlateNo')}
              />
            </View>
            <View style={{height: 50, marginTop: 30}}>
              <TextInput
                style={{
                  color: 'black',
                  backgroundColor: 'white',
                  paddingLeft: 15,
                  paddingRight: 15,
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: '#dadae8',
                }}
                placeholder="Car Model" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                underlineColorAndroid="#f000"
                returnKeyType="next"
                value={this.state.CarModel}
                onChangeText={val => this.updateInputVal(val, 'CarModel')}
              />
            </View>
            <View>
              {!this.state.loading ? (
                <TouchableOpacity
                  onPress={() => {
                    this.AddCar();
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
                    Add Vehicle
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    paddingVertical: 15,
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: '#dadae8',
                    backgroundColor: '#FFD428',
                    marginTop: 50,
                  }}>
                  <ActivityIndicator size={'small'} color={'#000'} />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
