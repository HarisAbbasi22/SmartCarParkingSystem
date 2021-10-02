import React, {useState, useEffect, useRef} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AppState,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {Stopwatch, Timer} from 'react-native-stopwatch-timer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const index = () => {
  const [isTimerStart, setIsTimerStart] = useState(false);
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [timerDuration, setTimerDuration] = useState(120000);
  const [resetTimer, setResetTimer] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);
  const [time, settime] = useState();
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(0);
  useEffect(async () => {
    const user = auth().currentUser;
    let diff = 0;
    let PreTimeStamp = 0;

    await firestore()
      .collection('Users')
      .doc(user.uid)
      .get()
      .then(snapshot => {
        PreTimeStamp = snapshot.data().time.seconds;
      });
    let total_time = moment().diff(moment(PreTimeStamp), 'milliseconds');
    console.log('dsfsdf', typeof total_time);
    setStartTime(total_time);
    setLoading(false);
    // const doc = val.get();
  }, []);

  const OnTimeAdded = () => {
    const user = auth().currentUser;
    console.log('SFSF', user);
    firestore()
      .collection('Users')
      .doc(user.uid)
      .update({
        time: new Date(),
      })
      .then(() => {
        console.log('Time added');
      });
  };

  if (loading) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Parking Timer</Text>
        <View style={styles.sectionStyle}>
          <Stopwatch
            laps
            msecs
            start={isStopwatchStart}
            startTime={startTime}
            options={options}
            getTime={async time => {
              settime(time);
              AsyncStorage.setItem('timer', time);
              console.log(time);
            }}
          />
          <TouchableHighlight
            onPress={() => {
              OnTimeAdded();
              setIsStopwatchStart(!isStopwatchStart);
              setResetStopwatch(false);
            }}>
            <Text style={styles.buttonText}>
              {!isStopwatchStart ? 'START' : 'STOP'}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
  sectionStyle: {
    flex: 1,
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    marginTop: 10,
  },
});

const options = {
  container: {
    backgroundColor: '#FF0000',
    padding: 5,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    color: '#FFF',
    marginLeft: 7,
  },
};
