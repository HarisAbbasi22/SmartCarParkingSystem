import React, {Component} from 'react';
import {
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {widthToDp, heightToDp} from '../../utils/dimensions';
class index extends Component {
  state = {
    StartTime: 0,
    EndTime: 0,
    totalTime: '0:0:0',
    Status: false,
    loading: true,
    parkingHistory: [],
  };
  componentDidMount() {
    const user = auth().currentUser;
    firestore()
      .collection('Users')
      .doc(user.uid)
      .collection('parkingHistory')
      .orderBy('endTime', 'desc')
      .get()
      .then(snapshot => {
        let arr = [];
        snapshot.forEach(doc => {
          arr.push(doc.data());
        });
        this.setState({
          parkingHistory: arr,
          loading: false,
        });
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <View
          style={{
            backgroundColor: 'white',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={'large'} color={'#000'} />
        </View>
      );
    }
    return (
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          paddingTop: 40,
        }}>
        <FlatList
          data={this.state.parkingHistory}
          ListHeaderComponent={() => (
            <View style={{width: '80%', alignSelf: 'center'}}>
              <Text style={styles.headerText}>Your parking history</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                width: '80%',
                alignSelf: 'center',
              }}>
              <Text style={styles.titleText}>No parking yet</Text>
            </View>
          )}
          renderItem={({item, index}) => (
            <View style={styles.container}>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 15,
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: widthToDp(7),
                    height: widthToDp(7),
                    marginRight: 10,
                  }}
                  source={require('../../Images/history.png')}
                />
                <View
                  style={{
                    width: '90%',
                    paddingHorizontal: 10,
                  }}>
                  <Text style={styles.firstText}>COMPLETED</Text>
                  <Text style={styles.titleText}>KL Tower parking garage</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      alignSelf: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text style={styles.smallesttitleText}>Start time</Text>
                      <Text style={styles.timeText}>
                        {moment(item.startTime).format('hh:mm:ss')}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.smallesttitleText}>End time</Text>
                      <Text style={styles.timeText}>
                        {moment(item.endTime).format('hh:mm:ss')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#FFD428',
    width: '80%',
    marginVertical: heightToDp(2),
    alignSelf: 'center',
  },
  firstText: {
    fontSize: 16,
    color: 'orange',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  secondText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#0BC555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 21,
    justifyContent: 'center',
    color: '#000',
    marginVertical: 10,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 18,
    justifyContent: 'center',
    color: '#666',
    marginBottom: 10,
  },
  timeText: {
    fontWeight: 'bold',
    fontSize: 16,
    justifyContent: 'center',
    color: '#666',
    alignItems: 'center',
    alignSelf: 'center',
  },
  smalltitleText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallesttitleText: {
    marginBottom: 5,
    fontSize: 14,
    color: '#838383',
  },
  littletitleText: {
    marginBottom: 50,
    fontWeight: 'bold',
  },
});

export default index;
