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

class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardHolderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    };
  }

  onSaveCardDetails() {
    const {cardHolderName, cardNumber, expiryDate, cvv} = this.state;

    Alert.alert(
      'Credentials',
      `${cardHolderName} + ${cardNumber} + ${expiryDate} + ${cvv}`,
    );
  }

  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
          flex: 1,
        }}>
        <View style={styles.container}>
          <Image
            style={{resizeMode: 'cover', width: 400, height: 250}}
            source={require('../../Images/credit-card.png')}
          />

          <Text style={styles.titleText}>Add Credit Card</Text>
          <Text style={styles.smalltitleText}>
            Add your credit card information
          </Text>

          <TextInput
            value={this.state.cardHolderName}
            onChangeText={cardHolderName => this.setState({cardHolderName})}
            placeholder={'Card Holder Name'}
            secureTextEntry={true}
            style={styles.input}
          />
          <TextInput
            value={this.state.cardNumber}
            onChangeText={cardNumber => this.setState({cardNumber})}
            placeholder={'Card Number'}
            secureTextEntry={true}
            style={styles.input}
          />
          <TextInput
            value={this.state.expiryDate}
            onChangeText={expiryDate => this.setState({expiryDate})}
            placeholder={'Expiry Date'}
            secureTextEntry={true}
            style={styles.input}
          />
          <TextInput
            value={this.state.cvv}
            onChangeText={cvv => this.setState({cvv})}
            placeholder={'CVV'}
            secureTextEntry={true}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={this.onSaveCardDetails.bind(this)}>
            <Text style={styles.buttonText}>Save Card Details</Text>
          </TouchableOpacity>
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
    marginTop: 20,
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
    marginTop: 20,
    marginBottom: 60,
  },
  buttonText: {
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
});
export default index;
