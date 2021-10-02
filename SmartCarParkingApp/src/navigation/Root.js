import React from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import MainStack from './MainStack';
import AuthStack from './AuthStack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {MaterialIndicator} from 'react-native-indicators';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      Login: false,
      routeName: '',
      Verify: false,
    };
  }

  async componentDidMount() {
    const checkpoint = await AsyncStorage.getItem('checkpoint');
    const uid = await AsyncStorage.getItem('uid');
    console.log('hello ', uid, checkpoint);
    if (uid && checkpoint) {
      console.log('asdfghjkoiuytzxcvbnm');
      this.setState({routeName: checkpoint, Login: false, loader: false});
    } else if (uid && !checkpoint) {
      await firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .get()
        .then(data => {
          if (data.data().time) {
            this.setState({routeName: 'ParkingTime'});
          } else if (data.data().parkingEnded) {
            console.log('parking end');
            this.setState({routeName: 'ParkingEnded'});
          } else {
            this.setState({routeName: 'home'});
          }
        });
      this.setState({
        Login: true,
        loader: false,
      });
    } else {
      this.setState({
        Login: false,
        loader: false,
      });
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.loader ? null : this.state.Login ? (
          <MainStack initialRouteName={this.state.routeName} />
        ) : (
          <AuthStack initialRouteName={this.state.routeName} />
        )}
      </View>
    );
  }
}
// const mapStateToProps = (state) => ({

//   user: state.auth
// });

export default Root;
