import React from 'react';
import {View, Text} from 'react-native';
import Home from "../views/Home";

import {createDrawerNavigator} from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Notifications" component={Settings} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
