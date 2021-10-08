import React, {Component} from 'react';
import {Text, View, TouchableOpacity, FlatList, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default class index extends Component {
  state = {
    oneMonthPackage: '',
    threeMonthPackage: '',
    sixMonthPackage: '',
    twelveMonthPackage: '',
    packages: [],
    selectedPackage_id: null,
  };

  async componentDidMount() {
    this.props.navigation.addListener('focus', () => this.getData());
    this.getData();
  }

  getData = async () => {
    await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get()
      .then(data => {
        this.setState({
          selectedPackage_id: data.data().package_id,
        });
      });
    firestore()
      .collection('Packages')
      .get()
      .then(data => {
        let arr = [];
        data.forEach(doc => {
          arr.push(doc.data());
        });
        this.setState({
          packages: arr,
        });
      });
  };

  cancel = packages => {
    if (this.props.route.params && this.props.route.params.from === 'Home') {
      firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .update({
          seasonParker: packages ? true : false,
          packages,
        })
        .then(data => {
          this.props.navigation.goBack();
        });
    } else {
      this.props.navigation.goBack();
    }
  };

  onPackage = (package_id, package_name, rate) => {
    // firestore()
    //   .collection('Users')
    //   .doc(auth().currentUser.uid)
    //   .update({
    //     seasonParker: package_id ? true : false,
    //     package_id,
    //   })
    //   .then(data => {
    //     Alert.alert('Success', `You have bought ${package_name}`);
    //     this.props.navigation.goBack();
    //   });
    this.props.navigation.navigate('AddCreditCard', {
      from: 'BuyPackage',
      package_id,
      package_name,
      rate,
    });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          padding: 30,
          paddingTop: 20,
          backgroundColor: '#FFFFFF',
        }}>
        <View>
          <FlatList
            data={this.state.packages}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => this.onPackage(item.id, item.name, item.rate)}
                style={{
                  paddingVertical: 15,
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor:
                    this.state.selectedPackage_id === item.id
                      ? '#FFD428'
                      : '#dadae8',
                  backgroundColor:
                    this.state.selectedPackage_id === item.id
                      ? 'white'
                      : '#FFD428',
                  marginTop: 50,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 18,
                    color: 'black',
                  }}>
                  {item.name} @ Rs.{item.rate} /
                  {item.name.includes('Month') ? ' month' : ' year'}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={() => this.cancel(null)}
            style={{
              paddingVertical: 15,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: '#dadae8',
              marginTop: 50,
            }}>
            <Text
              style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>
              CANCEL
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
