import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import IndexScreen from './screens/IndexScreen';
import HomeScreen from './screens/HomeScreen';
import RegistroDuenioScreen from './screens/RegistroDuenioScreen';
import RegistroDuenioScreen2 from './screens/RegistroDuenioScreen2';
import RegistroEmpleadoScreen from './screens/RegistroEmpleadoScreen';
import RegistroClienteRegistradoScreen from './screens/RegistroClienteRegistradoScreen';
import RegistroClienteAnonimoScreen from './screens/RegistroClienteAnonimoScreen';
import RegistroMesaScreen from './screens/RegistroMesaScreen';


import AnimatedLottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';


export type RootStackParamList = {
  RegistroClienteRegistrado: any;
  Login: any;
  Home: any;
  Index: any;
  SignUp: any;
  RegistroDuenio: any;
  RegistroDuenio2: any;
  RegistroEmpleado: any;
  RegistroClienteAnonimo: any;
  RegistroMesa: any;

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
       <Stack.Screen options={{ headerShown: false }} name="RegistroMesa" component={RegistroMesaScreen} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroClienteAnonimo" component={RegistroClienteAnonimoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroClienteRegistrado" component={RegistroClienteRegistradoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="Index" component={IndexScreen} />
       <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
       <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroDuenio" component={RegistroDuenioScreen} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroDuenio2" component={RegistroDuenioScreen2} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroEmpleado" component={RegistroEmpleadoScreen} />
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


