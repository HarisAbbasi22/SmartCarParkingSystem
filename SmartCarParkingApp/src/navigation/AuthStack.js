import React from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import Login from '../views/Login';
import SignUp from '../views/SignUp';
import AddVehicle from '../views/AddVehicle';

import ForgetPassword from '../views/ForgetPassword';
import MainStack from './MainStack';
const Stack = createStackNavigator();

class AuthStack extends React.Component {
  render() {
    return (
      <Stack.Navigator initialRouteName={this.props.initialRouteName}>
        <Stack.Screen
          name={'SignUp'}
          component={SignUp}
          options={{title: '', headerTitleAlign: 'center', headerShown: false}}
        />

        <Stack.Screen
          name={'Login'}
          component={Login}
          options={{title: '', headerTitleAlign: 'center', headerShown: false}}
        />
        <Stack.Screen
          name={'ForgetPassword'}
          component={ForgetPassword}
          options={{title: '', headerTitleAlign: 'center', headerShown: false}}
        />
        <Stack.Screen
          name={'AddNewVehicle'}
          component={AddVehicle}
          options={{title: '', headerTitleAlign: 'center', headerShown: false}}
        />
        <Stack.Screen
          name={'MainStack'}
          component={MainStack}
          options={{title: '', headerTitleAlign: 'center', headerShown: false}}
        />
      </Stack.Navigator>
    );
  }
}

export default AuthStack;
