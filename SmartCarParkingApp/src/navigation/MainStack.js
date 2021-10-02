import React from 'react';
import {View, Text, Image} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from '../views/Home';
import AddVehicle from '../views/AddVehicle';
import RegisteredVehicles from '../views/RegisteredVehicles';
import BuyParking from '../views/BuyParking';
import Log from '../views/Log';
import Wallet from '../views/Wallet';
import ParkingSlots from '../views/ParkingSlots';
import AddCreditCard from '../views/AddCreditCard';
import ParkingEnded from '../views/ParkingEnded';
import ParkingTime from '../views/ParkingTime';
import Logout from '../views/Logout';
import AuthStack from './AuthStack';
const Stack = createStackNavigator();
const Stack2 = createStackNavigator();
const Drawer = createDrawerNavigator();
export default class MainStack extends React.Component {
  createHomeStack = () => (
    <Stack.Navigator initialRouteName={this.props.initialRouteName}>
      <Stack.Screen
        name={'home'}
        component={Home}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />
      <Stack.Screen
        name="ParkingSlots"
        component={ParkingSlots}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />
      <Stack.Screen
        name="ParkingEnded"
        component={ParkingEnded}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />
      <Stack.Screen
        name="ParkingTime"
        component={ParkingTime}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />

      <Stack.Screen
        name={'BuyParking'}
        component={BuyParking}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />
      <Stack.Screen
        name={'Log'}
        component={Log}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />
      <Stack.Screen
        name={'wallet'}
        component={Wallet}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />
      <Stack.Screen
        name="AddCreditCard"
        component={AddCreditCard}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />
      <Stack.Screen
        name="AddVehicle"
        component={AddVehicle}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />
      <Stack.Screen
        name="AuthStack"
        component={AuthStack}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />
    </Stack.Navigator>
  );
  createVehicleStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="RegisteredVehicles"
        component={RegisteredVehicles}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />
      <Stack.Screen
        name="AddVehicle"
        component={AddVehicle}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />
      <Stack.Screen
        name={'BuyParking'}
        component={BuyParking}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />
    </Stack.Navigator>
  );
  createWalletStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Wallet"
        component={Wallet}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />
      <Stack.Screen
        name="AddCreditCard"
        component={AddCreditCard}
        options={{title: '', headerTitleAlign: 'center', headerShown: false}}
      />
    </Stack.Navigator>
  );

  render() {
    return (
      <Drawer.Navigator>
        <Drawer.Screen
          name="Home"
          children={this.createHomeStack}
          options={{headerTitle: 'Home', headerShown: true}}
        />
        <Drawer.Screen
          name="Vehicle"
          children={this.createVehicleStack}
          options={{headerTitle: 'Vehicle', headerShown: true}}
        />
        <Drawer.Screen
          name="Parking History"
          component={Log}
          options={{headerTitle: 'Parking History', headerShown: true}}
        />
        <Drawer.Screen
          name="Packages"
          component={BuyParking}
          options={{headerTitle: 'Buy Parking Packages', headerShown: true}}
        />
        <Drawer.Screen
          name="Logout"
          component={Logout}
          options={{headerTitle: '', headerShown: true}}
        />
      </Drawer.Navigator>
    );
  }
}
