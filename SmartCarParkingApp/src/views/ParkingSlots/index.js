import React, {Component} from 'react';
import {
  Button,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  ScrollView,
} from 'react-native';
// import CButton from './CButton';
import firestore from '@react-native-firebase/firestore';
import index from '../Log';
import auth from '@react-native-firebase/auth';
import {getStatusBarHeight} from 'react-native-status-bar-height';

class ParkingSlots extends Component {
  constructor(props) {
    super(props);

    this.state = {
      floors: [
        {id: 1, floor: 'Floor 1'},
        {id: 2, floor: 'Floor 2'},
      ],
      data: [],
      loading: true,
      selectedId: '',
      selectedItem: 0,
      selected: 'floor1',
    };
  }
  async componentDidMount() {
    let array = [];
    let Slot = [];
    await firestore()
      .collection('AllSlots')
      .where('floor', '==', 1)
      .get()
      .then(data => {
        data.forEach(docs => {
          array.push(docs.data());
          console.log('data', array);
        });
      });

    this.setState({
      data: array,
      loading: false,
    });
  }
  filterByFloors = async floor_id => {
    this.setState({floor: floor_id});
    let array = [];
    await firestore()
      .collection('AllSlots')
      .where('floor', '==', floor_id)
      .get()
      .then(data => {
        data.forEach(docs => {
          array.push(docs.data());
          console.log('data', array);
        });
      });
    this.setState({
      data: array,
      loading: false,
    });
  };
  handleSelection = id => {
    this.state.selectedId = '';
    if (!this.state.selectedId) {
      this.setState({selectedId: id});
      const user = auth().currentUser;
      firestore()
        .collection('Users')
        .doc(user.uid)
        .update({
          slot_id: id,
        })
        .then(() => {
          console.log('SLOT ALLOTED TO USER');
        });
    } else {
      console.log('ALREADY BOOKED A SLOT', this.state.selectedId);
    }
  };

  onSlot() {
    firestore()
      .collection('AllSlots')
      .where('slot_id', '==', this.state.selectedId)
      .get()
      .then(data => {
        data.forEach(docs => {
          this.props.navigation.navigate('ParkingTime');
          firestore().collection('AllSlots').doc(docs.data().slot_id).update({
            booked: true,
          });
        });
      });
    this.setState({selectedId: ''});
  }

  render() {
    if (this.state.loading) {
      return null;
    }
    return (
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          paddingTop: getStatusBarHeight(),
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 32,
            color: '#000',
          }}>
          Parking Slots
        </Text>
        <StatusBar barStyle="dark-content" />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FlatList
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
            }}
            data={this.state.floors}
            horizontal
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    this.filterByFloors(item.id);
                    this.setState({selectedItem: index});
                  }}
                  style={{
                    paddingHorizontal: 25,
                    paddingVertical: 15,
                    backgroundColor: '#FFD428',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor:
                      this.state.selectedItem === index ? 'black' : undefined,
                    borderWidth:
                      this.state.selectedItem === index ? 1 : undefined,
                    margin: 5,
                    marginTop: 20,
                    borderRadius: 8,
                  }}>
                  <Text style={{color: 'white', fontSize: 18}}>
                    {item.floor}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.id}
          />
        </View>

        <View style={{flex: 1}}>
          <FlatList
            style={{flexGrow: 1, marginTop: 50, width: '100%'}}
            data={this.state.data}
            extraData={this.state.selectedId}
            numColumns={2}
            renderItem={({item, index}) => {
              console.log('FULL ITEM', item);
              return (
                <TouchableOpacity
                  onPress={() => this.handleSelection(item.slot_id)}
                  key={index}
                  disabled={item.booked ? true : false}>
                  <View
                    key={index}
                    style={
                      this.state.selectedId === item.slot_id
                        ? {
                            borderRadius: 10,
                            width: 180,
                            height: 100,
                            backgroundColor: '#270a3f',
                            opacity: !item.booked ? 1 : 0.5,
                            borderWidth: 1,
                            borderColor: 'grey',
                            borderStyle: 'dotted',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }
                        : {
                            borderRadius: 10,
                            width: 180,
                            height: 100,
                            opacity: !item.booked ? 1 : 0.5,
                            borderWidth: 1,
                            borderStyle: 'dotted',
                            borderColor: 'grey',
                            backgroundColor: '#270a3f',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }
                    }>
                    <Image
                      style={{
                        width: 120,
                        height: 80,
                        transform:
                          index % 2 === 0
                            ? [{rotate: '180deg'}]
                            : [{rotate: '0deg'}],
                        resizeMode: 'contain',
                      }}
                      source={
                        this.state.selectedId === item.slot_id ||
                        item.booked === true
                          ? require('../../Images/car.png')
                          : null
                      }
                    />
                    {/* <Text key={item.id} style={{color: '#fff', fontSize: 18}}>
                      {item.slot}
                    </Text> */}
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.id}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onSlot.bind(this)}>
          <Text style={styles.buttonText}>Proceed to Park</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#FFD428',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 40,

    // flex: 0.5,
  },
  buttonText: {
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },
});

export default ParkingSlots;
