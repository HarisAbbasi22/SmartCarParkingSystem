import React, {Component} from 'react';
import {
  Alert,
  Button,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CreditCardInput,
  LiteCreditCardInput,
} from 'react-native-credit-card-input';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

var CARD_TOKEN = null;

class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardHolderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      creditCardDetails: {},
      creditCardSaved: false,
      from: this.props.route.params?.from,
      package_id: this.props.route.params?.package_id,
      package_name: this.props.route.params?.package_name,
      rate: this.props.route.params?.rate,
    };
  }

  componentDidMount = async () => {
    if (!this.state.rate) {
      await firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .get()
        .then(data => {
          this.setState({
            rate: data.data().parkingFee,
          });
        });
    }
    let creditCardDetails = JSON.parse(
      await AsyncStorage.getItem('creditCardDetails'),
    );
    if (creditCardDetails != null) {
      this.setState({
        creditCardSaved: true,
        creditCardDetails,
      });
    } else {
      this.setState({creditCardSaved: false});
    }
  };

  _onChange = async item => {
    this.setState({
      creditCardDetails: item,
    });
  };

  getCreditCardToken = async () => {
    const {creditCardDetails} = this.state;
    const card = {
      'card[number]': creditCardDetails.values.number.replace(/ /g, ''),
      'card[exp_month]': creditCardDetails.values.expiry.split('/')[0],
      'card[exp_year]': creditCardDetails.values.expiry.split('/')[1],
      'card[cvc]': creditCardDetails.values.cvc,
    };

    return fetch('https://api.stripe.com/v1/tokens', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Bearer pk_test_51JhJdPIhhYh0yCMeZwXWpztWIX8PiNzmyHb206KLo4XsPFwf4Im8U1ChbgtVfv1AnmYYK899WmD5wdPuQCFpdUxi00Ewi0EVGO',
      },
      method: 'POST',
      body: Object.keys(card)
        .map(key => key + '=' + card[key])
        .join('&'),
    })
      .then(res => res.json())
      .catch(err => console.log(err));
  };

  subscribeUser = async creditCardToken => {
    return new Promise(resolve => {
      CARD_TOKEN = creditCardToken.id;
      setTimeout(() => {
        resolve({status: true});
      }, 1000);
    });
  };

  charges = async () => {
    const card = {
      amount: parseInt(this.state.rate) * 160,
      currency: 'USD',
      source: CARD_TOKEN,
      description: 'Car parking fees',
    };

    console.log('card', this.state.rate, card);

    return fetch('https://api.stripe.com/v1/charges', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Bearer sk_test_51JhJdPIhhYh0yCMe3ZNlOH5UoVmQn2EJg2cAfhkQd6oiwBALfaGc15UpnJ3UwMDWOr2xn03XsmyptJRrR8vZ2gbc00ctloxQbH',
      },
      method: 'POST',
      body: Object.keys(card)
        .map(key => key + '=' + card[key])
        .join('&'),
    })
      .then(res => res.json())
      .catch(err => console.log(err));
  };

  onSubmit = async i => {
    const {creditCardDetails} = this.state;
    if (i === '2') {
      await AsyncStorage.setItem(
        'creditCardDetails',
        JSON.stringify(creditCardDetails),
      );
    }
    if (
      creditCardDetails.valid == false ||
      typeof creditCardDetails.valid == 'undefined'
    ) {
      alert('Invalid Credit Card');
      return;
    }
    let creditCardToken;
    try {
      creditCardToken = await this.getCreditCardToken(creditCardDetails);
      if (creditCardToken.error) {
        alert('Credit Card token error');
      }
    } catch (error) {
      console.log('error', error);
      return;
    }

    const {error} = await this.subscribeUser(creditCardToken);
    if (error) {
      alert(error);
    } else {
      let payment_data = await this.charges();
      if (payment_data.status === 'succeeded') {
        if (this.state.from === 'BuyPackage') {
          console.log('', this.state.package_id, this.state.package_name);
          firestore()
            .collection('Users')
            .doc(auth().currentUser.uid)
            .update({
              seasonParker: this.state.package_id ? true : false,
              package_id: this.state.package_id,
            })
            .then(data => {
              Alert.alert(
                'Success',
                `You have bought ${this.state.package_name}`,
              );
              this.props.navigation.replace('home');
            });
        } else {
          firestore().collection('Users').doc(auth().currentUser.uid).update({
            parkingEnded: firestore.FieldValue.delete(),
          });
          this.props.navigation.replace('home');
          Alert.alert('Success', `Have a safe journey!`);
        }
      } else {
        alert('Payment Failed!');
      }
    }
  };

  removeCard = async () => {
    await AsyncStorage.removeItem('creditCardDetails');
    this.setState({creditCardSaved: false});
  };

  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={styles.container}>
          <Image
            style={{resizeMode: 'cover', width: 150, height: 100}}
            source={require('../../Images/credit-card.png')}
          />

          <Text style={styles.titleText}>
            {this.state.creditCardSaved
              ? 'Your saved credit card'
              : 'Add Credit Card'}
          </Text>
          {this.state.creditCardSaved ? null : (
            <Text style={styles.smalltitleText}>
              Add your credit card information
            </Text>
          )}

          {this.state.creditCardSaved ? (
            <View
              style={{
                width: '100%',
                height: 300,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: 'gray',
                }}>
                <Text>{`${this.state.creditCardDetails.values.number
                  .replace(/\s/g, '')
                  .replace(/.(?=.{4})/g, '#')}`}</Text>
              </View>
            </View>
          ) : (
            <View style={{width: '100%', height: 300}}>
              <CreditCardInput
                ref={ref => (this.cardRef = ref)}
                onChange={this._onChange}
              />
            </View>
          )}

          {!this.state.creditCardSaved && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.onSubmit('1')}>
              <Text style={styles.buttonText}>Pay without saving card</Text>
            </TouchableOpacity>
          )}
          <View style={{marginTop: 10}}></View>
          {!this.state.creditCardSaved && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.onSubmit('2')}>
              <Text style={styles.buttonText}>Save and pay</Text>
            </TouchableOpacity>
          )}
          <View style={{marginTop: 10}}></View>
          {this.state.creditCardSaved && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.onSubmit('3')}>
              <Text style={styles.buttonText}>Pay from card</Text>
            </TouchableOpacity>
          )}
          <View style={{marginTop: 10}}></View>
          {this.state.creditCardSaved && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.removeCard()}>
              <Text style={styles.buttonText}>Remove existing card</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  input: {
    width: 327,
    height: 60,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: 'white',
    marginBottom: 10,
    color: 'black',
  },
  titleText: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 30,
  },
  smalltitleText: {
    marginBottom: 20,
  },
  smallesttitleText: {
    marginRight: 1,
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#FFD428',
    width: 327,
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
});
export default index;
