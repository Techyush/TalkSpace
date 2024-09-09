import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { SCREENS } from '../utils/Strings';
import JoinSpace from '../screens/JoinSpace';

const Stack = createNativeStackNavigator()

const AppRouter = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.JoinSpace} component={JoinSpace} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppRouter