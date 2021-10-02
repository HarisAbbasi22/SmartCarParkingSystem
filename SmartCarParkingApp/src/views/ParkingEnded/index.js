import React, {Component} from 'react';
import {
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
class index extends Component {
  state = {
    StartTime: 0,
    EndTime: 0,
    totalTime: '0:0:0',
    sec: 0,
    min: 0,
    hour: 0,
    rate_per_hour: 0,
    seasonParker: false,
    amount: 0,
    loading: true,
  };

  async componentDidMount() {
    const user = auth().currentUser;
    firestore().collection('Users').doc(user.uid).update({
      parkingEnded: true,
    });
    await firestore()
      .collection('Users')
      .doc(user.uid)
      .get()
      .then(user_data => {
        if (user_data.data().seasonParker) {
          this.setState({
            seasonParker: user_data.data().seasonParker
              ? user_data.data().seasonParker
              : false,
          });
        }
      });
    await firestore()
      .collection('Rates')
      .get()
      .then(snapshot => {
        let data = snapshot.docs[0];
        this.setState({
          rate_per_hour: data.data().rate_per_hour,
        });
      });

    await firestore()
      .collection('Users')
      .doc(user.uid)
      .collection('parkingHistory')
      .orderBy('endTime', 'desc')
      .get()
      .then(snapshot => {
        let data = snapshot.docs[0];
        let hour = parseInt(data.data().totalTime?.split(':')[0]);
        let min = parseInt(data.data().totalTime?.split(':')[1]);
        let sec = parseInt(data.data().totalTime?.split(':')[2]);
        let amount =
          min > 0 || sec > 0
            ? (hour + 1) * this.state.rate_per_hour
            : hour * this.state.rate_per_hour;
        console.log(amount, '', hour, '', this.state.rate_per_hour);
        this.setState({
          EndTime: moment(data.data().endTime).format('hh:mm:ss'),
          StartTime: moment(data.data().startTime).format('hh:mm:ss'),
          totalTime: data.data().totalTime,
          amount,
        });
      });

    this.setState({
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      <View
        style={{
          paddingVertical: 15,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: '#dadae8',
          backgroundColor: '#fff',
          marginTop: 50,
        }}>
        <ActivityIndicator size={'small'} color={'#FFD428'} />
      </View>;
    }
    return (
      <View style={styles.container}>
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.titleText}>Parking Ended</Text>
        </View>
        <Text style={styles.smalltitleText}> KL Tower Parking Garage</Text>
        <Text style={styles.smallesttitleText}>Start Time</Text>
        <Text style={styles.titleText}>{this.state.StartTime}</Text>
        <Text style={styles.smallesttitleText}>End Time</Text>
        <Text style={styles.titleText}>{this.state.EndTime}</Text>

        <Text style={styles.titleText}>Parking Duration</Text>
        <Text style={styles.smallesttitleText}>{this.state.totalTime}</Text>

        <Text style={styles.titleText}>Pay for Parking</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            firestore()
              .collection('Users')
              .doc(auth().currentUser.uid)
              .collection('parkingHistory')
              .orderBy('endTime', 'desc')
              .get()
              .then(snapshot => {
                let data = snapshot.docs[0];
                firestore()
                  .collection('Users')
                  .doc(auth().currentUser.uid)
                  .collection('parkingHistory')
                  .doc(data.id)
                  .update({
                    parkingFee: this.state.amount,
                  });
              });
            this.props.navigation.replace('wallet');
          }}>
          <Text style={styles.buttonText}>
            PROCEED • Rs.{this.state.amount}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  titleText: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 25,
    textAlign: 'center',
  },
  smalltitleText: {
    marginBottom: 25,
    textAlign: 'center',
  },
  smallesttitleText: {
    marginBottom: 40,
    fontWeight: 'bold',
    marginTop: 40,
    fontSize: 18,
    textAlign: 'center',
  },
  littletitleText: {
    marginBottom: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#FFD428',
    width: 300,
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
    marginBottom: 30,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },
});

export default index;
