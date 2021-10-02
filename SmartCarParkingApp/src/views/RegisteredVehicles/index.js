import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {getStatusBarHeight} from 'react-native-status-bar-height';
export default class index extends Component {
  state = {
    CarModel: '',
    CarModelList: [],
    PlateNo: '',
    PlateNoList: [],
    found: false,
  };
  componentDidMount() {
    const user = auth().currentUser;
    firestore()
      .collection('Users')
      .doc(user.uid)
      .get()
      .then(snapshot => {
        this.setState({
          CarModel: snapshot.data().CarModel,
          PlateNo: snapshot.data().LicensePlateNo,
        });
        if (this.state.CarModel && this.state.PlateNo) {
          this.setState({found: true});
        } else {
          this.setState({found: false});
        }
      });
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          padding: 10,
          paddingTop: 30 + getStatusBarHeight(),
          backgroundColor: '#FFFFFF',
        }}>
        <View>
          <Text
            style={{
              paddingTop: 30,
              textAlign: 'center',
              fontSize: 31,
              fontWeight: 'bold',
            }}>
            Registered Vehicles
          </Text>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{width: 300, height: 200}}
              source={require('../../Images/Vehicle.png')}
            />
          </View>
        </View>
        {this.state.found ? (
          <View>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                paddingVertical: 15,
                borderWidth: 1,
                borderRadius: 8,
                borderColor: 'grey',
                backgroundColor: '#FFFF',
                // marginTop: 50,
              }}>
              <Text
                style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>
                {this.state.CarModel} {this.state.PlateNo}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!this.state.found ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('AddVehicle');
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
                Add new vehicle
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{marginTop: '0%'}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('AddVehicle');
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
                  color: 'black',
                  fontSize: 18,
                }}>
                Change vehicle
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}
