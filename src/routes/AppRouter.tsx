import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import JoinSpace from '../screens/JoinSpace';
import TalkSpace from '../screens/TalkSpace';
import { SCREENS } from '../utils/Strings';

const Stack = createNativeStackNavigator()

const AppRouter = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade', animationDuration: 3000 }} initialRouteName={SCREENS.JoinSpace}>
        <Stack.Screen name={SCREENS.JoinSpace} component={JoinSpace} />
        <Stack.Screen name={SCREENS.TalkSpace} component={TalkSpace} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppRouter