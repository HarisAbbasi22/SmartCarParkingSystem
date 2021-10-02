import React, {Component, useEffect, useRef, useState} from 'react';
import {AppState, Text, View} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import Root from './src/navigation/Root';
console.disableYellowBox = true;
import firestore from '@react-native-firebase/firestore';

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    );
  }
}
