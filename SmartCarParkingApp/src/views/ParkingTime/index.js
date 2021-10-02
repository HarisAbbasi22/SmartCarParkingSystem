import {anyTypeAnnotation} from '@babel/types';
import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  AppState,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';

let res = [];
let interval = 0;

const user = auth().currentUser;

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      s: '',
      Press: true,
      minutes: 0,
      hours: 0,
      seconds: 0,
      timestamp: null,
    };
  }

  componentDidMount() {
    this.getAndUpdateTimer();
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  getAndUpdateTimer = () => {
    const user = auth().currentUser;

    firestore()
      .collection('Users')
      .doc(user.uid)
      .get()
      .then(snapshot => {
        let timestamp = snapshot.data().time;
        this.setState({timestamp});
        let sec = 0;
        let min = 0;
        let hour = 0;
        if (timestamp) {
          sec = moment().diff(moment(timestamp), 'seconds') % 60;
          min = moment().diff(moment(timestamp), 'minutes') % 60;
          hour = moment().diff(moment(timestamp), 'hours');

          let time_in_seconds = `${hour}:${min}:${sec}`;

          console.log('time', time_in_seconds);
          console.log('TIME', timestamp);
          console.log('sec', sec);
          console.log('min', min);
          console.log('ohur', hour);

          this.setState(
            {
              minutes: min,
              hours: hour,
              seconds: sec,
              Press: this.state.timestamp ? false : true,
            },
            () => {
              if (this.state.timestamp) {
                console.log('TIMESTAMP', this.state.timestamp);
                this.startTimer();
              }
            },
          );
        } else {
          this.setState(
            {
              minutes: 0,
              hours: 0,
              seconds: 0,
              Press: false,
            },
            () => {
              this.startTimer();
            },
          );
        }
      });
  };

  startTimer = async () => {
    let {seconds, minutes, hours, Press, timestamp} = this.state;
    await this.myTimer();
    interval = setInterval(() => {
      if (seconds < 60) {
        if (seconds == 59) {
          seconds = 0;
          minutes++;
          this.setState({seconds, minutes});
        } else {
          seconds++;
          this.setState({seconds});
        }
      }
      if (minutes >= 60) {
        minutes = 0;
        hours++;
        this.setState({minutes, hours});
      }
    }, 1000);
  };

  stopTimer = async () => {
    const user = auth().currentUser;

    let {timestamp} = this.state;
    let sec = moment().diff(moment(timestamp), 'seconds') % 60;
    let min = moment().diff(moment(timestamp), 'minutes') % 60;
    let hour = moment().diff(moment(timestamp), 'hours');
    let totalTime = '' + hour + ':' + min + ':' + sec;
    console.log('', timestamp, sec, min, hour, totalTime);
    await firestore()
      .collection('Users')
      .doc(user.uid)
      .collection('parkingHistory')
      .add({
        startTime: timestamp,
        endTime: parseInt(moment().format('x')),
        totalTime,
      });
    await firestore().collection('Users').doc(user.uid).update({
      time: null,
    });
    await firestore()
      .collection('Users')
      .doc(user.uid)
      .get()
      .then(data => {
        console.log('DATA', data.data().slot_id);
        firestore().collection('AllSlots').doc(data.data().slot_id).update({
          booked: false,
        });
      });

    await firestore()
      .collection('Users')
      .doc(user.uid)
      .get()
      .then(user_data => {
        if (user_data.data().seasonParker) {
          Alert.alert('Thank you!', 'Have a safe journey.');
          this.props.navigation.replace('home');
        } else {
          this.props.navigation.replace('ParkingEnded');
        }
      });
    this.setState({
      Press: true,
      timestamp: null,
    });
  };

  TimerGet = () => {
    let PreTimeStamp = 0;
    const user = auth().currentUser;

    firestore()
      .collection('Users')
      .doc(user.uid)
      .get()
      .then(snapshot => {
        PreTimeStamp = snapshot.data().time;
        let sec = 0;
        let min = 0;
        let hour = 0;
        if (PreTimeStamp) {
          sec = moment().diff(moment(PreTimeStamp), 'seconds');
          min = moment().diff(moment(PreTimeStamp), 'minutes');
          hour = moment().diff(moment(PreTimeStamp), 'hours');
          console.log('TIME', PreTimeStamp);
          console.log('sec', sec);
          console.log('min', min);
          console.log('ohur', hour);

          while (sec <= 60) {
            if (sec == 60) {
              this.setState({seconds: 0});
              break;
            } else {
              sec = sec + 1;
              this.setState({seconds: sec});
            }
          }

          console.log('ADD SEC:', sec);
        } else if (PreTimeStamp === 0) {
          sec++;
          while (sec <= 60) {
            if (sec == 60) {
              break;
            } else {
              this.setState({seconds: sec});
              sec = sec + 1;
            }
          }
          while (min <= 60) {
            if (min == 60) {
              break;
            } else {
              this.setState({minutes: min});
              min = min + 1;
            }
          }
        }

        console.log('ADD SEC:', sec);
      });
  };

  myTimer = async () => {
    const user = auth().currentUser;
    this.setState({
      timestamp: parseInt(moment().format('x')),
    });
    await firestore()
      .collection('Users')
      .doc(user.uid)
      .update({
        time: parseInt(moment().format('x')),
      });
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {!this.state.Press ? (
          <>
            <Text style={{fontSize: 50, textAlign: 'center', marginBottom: 30}}>
              {Math.round(this.state.hours)}:{Math.round(this.state.minutes)}:
              {Math.round(this.state.seconds)}
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.stopTimer();
              }}
              style={{
                backgroundColor: 'red',
                paddingHorizontal: 30,
                paddingVertical: 10,
              }}>
              <Text style={{fontSize: 18, color: 'white'}}>STOP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={() => {
              this.setState({Press: false});
              this.startTimer();
            }}
            style={{
              backgroundColor: 'red',
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <Text style={{fontSize: 18, color: 'white'}}>START</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
