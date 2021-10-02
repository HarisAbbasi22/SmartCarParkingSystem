import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {heightToDp, widthToDp} from '../../utils/dimensions';
import Swiper from 'react-native-swiper';
const {width, height} = Dimensions.get('screen');
const pixelValue = 1.2;

export default class index extends Component {
  state = {
    data: [
      {
        color: '#FFD428',
        name: 'My Vehicle',
        onPress: () =>
          this.props.navigation.navigate('Vehicle', {
            screen: 'RegisteredVehicles',
          }),
      },
      {
        color: '#FFD428',
        name: 'Parking History',
        onPress: () => this.props.navigation.navigate('Parking History'),
      },
      {
        color: '#FFD428',
        name: 'Packages',
        onPress: () => this.props.navigation.navigate('Packages'),
      },
      {
        color: '#FFD428',
        name: 'Logout',
        onPress: () => this.props.navigation.navigate('Logout'),
      },
    ],
    array: [],
    carmodel: '',
    licenseNo: '',
  };
  componentDidMount() {
    firestore()
      .collection('Announcements')
      .get()
      .then(data => {
        let arr = [];
        data.forEach(doc => {
          arr.push(doc.data());
        });
        this.setState({array: arr});
      });

    firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get()
      .then(data => {
        console.log('USER INFO', data.data());
        this.setState({carmodel: data.data().CarModel});
        this.setState({licenseNo: data.data().LicensePlateNo});
      });

    // console.log(this.state.array);
  }
  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          backgroundColor: '#ffff',
          // alignItems: 'center',
          paddingTop: getStatusBarHeight(),
          backgroundColor: '#fafafa',
          // padding: 30,
        }}>
        <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
          <Text
            style={{
              fontSize: 30,
              color: '#436385',
              fontWeight: 'bold',
              paddingHorizontal: 30,
            }}>
            Welcome to Smart Parking App!
          </Text>
        </View>

        <Swiper
          key={this.state.array.length}
          activeDotColor={'#FFF'}
          removeClippedSubviews={false}
          dotStyle={{
            marginBottom: 10,
            width: 10,
            height: 10,
            borderRadius: 6,
            backgroundColor: '#rgba(255,255,255,0.7)',
          }}
          activeDotStyle={{
            marginBottom: 10,
            width: 12,
            height: 12,
            borderRadius: 6,
            borderWidth: 1,
          }}
          autoplay
          loop
          autoplayDirection={true}
          autoplayTimeout={5}
          style={[styles.wrapper, {height: 210, marginTop: 20}]}
          showsPagination={true}
          showsButtons={false}>
          {this.state.array.map((value, index) => (
            <View
              key={index}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                backgroundColor: '#FFD428',
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                  zIndex: -10,
                }}>
                <Image
                  style={{width: width, height: '100%'}}
                  resizeMode={'cover'}
                  source={require('../../Images/background_banner_image.jpeg')}
                />
              </View>
              <View
                style={{
                  height: 200,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  width: width,
                  borderColor: '#dadae8',
                  backgroundColor: 'rgba(0,0,0,0.25)',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 32 * pixelValue,
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  {value?.amount}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    alignSelf: 'center',
                    marginTop: 10,
                    lineHeight: 20,
                    color: 'white',
                    fontSize: 16,
                  }}>
                  {value?.name}
                </Text>
              </View>
            </View>
          ))}
        </Swiper>

        <FlatList
          data={this.state.data}
          numColumns={2}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => item.onPress()}
                style={{
                  width: width * 0.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: width * 0.2,
                  marginRight: 2,
                  marginTop: 2,
                  backgroundColor: item.color,
                }}>
                <Text style={{fontWeight: '900', fontSize: 17}}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        <View>
          <TouchableOpacity
            onPress={() => {
              firestore()
                .collection('Users')
                .doc(auth().currentUser.uid)
                .get()
                .then(data => {
                  firestore()
                    .collection('RegisteredVehicles')
                    .where('LicensePlateNo', '==', data.data().LicensePlateNo)
                    .get()
                    .then(res => {
                      if (res.docs.length > 0) {
                        this.props.navigation.navigate('ParkingSlots');
                      } else {
                        alert;
                        Alert.alert(
                          "Sorry!', Your car is not inside the parking garage",
                        );
                      }
                    });
                });
            }}
            style={{
              paddingVertical: 15,
              borderWidth: 1,
              paddingHorizontal: 60,
              borderRadius: 8,
              borderColor: '#dadae8',
              backgroundColor: '#FFD428',
              marginTop: 30,
            }}>
            <Text style={{textAlign: 'center', color: 'black', fontSize: 16}}>
              Park Car
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
