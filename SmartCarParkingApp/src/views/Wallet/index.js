import React, {Component} from 'react';
import {
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {getStatusBarHeight} from 'react-native-status-bar-height';

class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      creditDebitCard: '',
      paypal: '',
      payoneer: '',
      jazzcash: '',
      easypaisa: '',
    };
  }

  onPayment() {
    const {creditDebitCard, paypal, payoneer, jazzcash, easypaisa} = this.state;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>Choose Payment Method</Text>
        <Text style={styles.smalltitleText}>Add payment information </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('AddCreditCard')}>
          <Text style={styles.buttonText}>Credit / Debit Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            firestore().collection('Users').doc(auth().currentUser.uid).update({
              parkingEnded: firestore.FieldValue.delete(),
            });
            Alert.alert('Thank you!', 'Have a safe journey.');
            this.props.navigation.replace('home');
          }}>
          <Text style={styles.buttonText}>Cash</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 30 + getStatusBarHeight(),
  },

  titleText: {
    fontWeight: 'bold',

    fontSize: 25,
  },
  smalltitleText: {
    marginBottom: 50,
  },
  smallesttitleText: {
    marginRight: 1,
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#FFD428',
    width: 360,
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },
});

export default index;
