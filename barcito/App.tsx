import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import IndexScreen from './screens/IndexScreen';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';

import AnimatedLottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';


export type RootStackParamList = {
  Login: any;
  Home: any;
  Index: any;
  SignUp: any;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  const [lottieLoad, setLottieLoad] = React.useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLottieLoad(true)
    }, 4000);
  }, [])

  if (!lottieLoad) {
    return (
      <AnimatedLottieView duration={5000}
        autoPlay
        style={styles.splash}
        source={require('./assets/animation.json')}        
      />)
  }

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#c5dfe0'
    },
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
       <Stack.Screen options={{ headerShown: false }} name="Index" component={IndexScreen} />
       <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
       <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
       <Stack.Screen options={{ headerShown: false }} name="SignUp" component={SignUpScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#81749c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splash: {    
    backgroundColor: '#81749c',
  },
});


