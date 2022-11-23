import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import IndexScreen from './screens/IndexScreen';
import HomeScreen from './screens/HomeScreen';
import RegistroDuenioScreen2 from './screens/RegistroDuenioScreen2';
import RegistroEmpleadoScreen from './screens/RegistroEmpleadoScreen';
import RegistroClienteRegistradoScreen from './screens/RegistroClienteRegistradoScreen';
import RegistroClienteAnonimoScreen from './screens/RegistroClienteAnonimoScreen';
import RegistroMesaScreen from './screens/RegistroMesaScreen';
import RegistroProductoScreen from './screens/RegistroProductoScreen';
import HomeDuenioScreen from './screens/HomeDuenioScreen';
import HomeCocinaBarScreen from './screens/HomeCocinaBarScreen';
import HomeMetreScreen from './screens/HomeMetreScreen';
import HomeMozoScreen from './screens/HomeMozoScreen';
import HomeClienteScreen from './screens/HomeClienteScreen';
import HomeClienteEsperaScreen from './screens/HomeClienteEsperaScreen';

import GestionClienteDuenioScreen from './screens/GestionClientesDuenioScreen';
import EncuestaEmpleadosDuenioScreen from './screens/EncuestaEmpleadosDuenioScreen';
import EnConstruccionCocinaBarScreen from './screens/GestionPedidosCocinaBarScreen';
import ChatMozoScreen from './screens/ChatMozoScreen';
import GestionClientesMetreScreen from './screens/GestionClientesMetreScreen';
import EncuestaLugarDeTrabajoMetreScreen from './screens/EncuestaLugarDeTrabajoMetreScreen';
import GestionPedidosMozoScreen from './screens/GestionPedidosMozoScreen';
import GestionPedidosCocinaBarScreen from './screens/GestionPedidosCocinaBarScreen';
import EncuestaLugarDeTrabajoMozoScreen from './screens/EncuestaLugarDeTrabajoMozoScreen';
import EncuestaLugarDeTrabajoCocinaBarScreen from './screens/EncuestaLugarDeTrabajoCocinaBarScreen';





// import { LogBox } from 'react-native';
// LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
// LogBox.ignoreAllLogs();//Ignore all log notifications

import AnimatedLottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';


export type RootStackParamList = {
  RegistroClienteRegistrado: any;
  Login: any;
  Home: any;
  Index: any;
  SignUp: any;
  RegistroDuenio2: any;
  RegistroEmpleado: any;
  RegistroClienteAnonimo: any;
  RegistroMesa: any;
  RegistroProducto: any;
  HomeCocinaBar: any;
  HomeDuenio: any;
  HomeMetre: any;
  HomeMozo: any;
  HomeCliente: any;
  HomeClienteEspera: any;
  GestionClienteDuenio: any;
  EnConstruccionCocinaBar: any;
  ChatMozo: any;
  GestionClientesMetre: any;
  EncuestaEmpleadosDuenio: any;
  EncuestaLugarDeTrabajoMetre: any;
  EncuestaLugarDeTrabajoMozo: any;
  EncuestaLugarDeTrabajoCocinaBar: any;
  GestionPedidosCocinaBar : any;

  GestionPedidosMozo : any;
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
       <Stack.Screen options={{ headerShown: false }} name="GestionClienteDuenio" component={GestionClienteDuenioScreen} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroEmpleado" component={RegistroEmpleadoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroDuenio2" component={RegistroDuenioScreen2} />
       <Stack.Screen options={{ headerShown: false }} name="HomeDuenio" component={HomeDuenioScreen} />
       <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroProducto" component={RegistroProductoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroMesa" component={RegistroMesaScreen} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroClienteAnonimo" component={RegistroClienteAnonimoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroClienteRegistrado" component={RegistroClienteRegistradoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
       <Stack.Screen options={{ headerShown: false }} name="HomeCocinaBar" component={HomeCocinaBarScreen} />
       <Stack.Screen options={{ headerShown: false }} name="HomeMetre" component={HomeMetreScreen} />
       <Stack.Screen options={{ headerShown: false }} name="HomeMozo" component={HomeMozoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="HomeCliente" component={HomeClienteScreen} />
       <Stack.Screen options={{ headerShown: false }} name="HomeClienteEspera" component={HomeClienteEsperaScreen} />
       <Stack.Screen options={{ headerShown: false }} name="EnConstruccionCocinaBar" component={EnConstruccionCocinaBarScreen} />
       <Stack.Screen options={{ headerShown: false }} name="ChatMozo" component={ChatMozoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="GestionClientesMetre" component={GestionClientesMetreScreen} />
       <Stack.Screen options={{ headerShown: false }} name="EncuestaEmpleadosDuenio" component={EncuestaEmpleadosDuenioScreen} />
       <Stack.Screen options={{ headerShown: false }} name="EncuestaLugarDeTrabajoMetre" component={EncuestaLugarDeTrabajoMetreScreen} />
       <Stack.Screen options={{ headerShown: false }} name="GestionPedidosMozo" component={GestionPedidosMozoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="GestionPedidosCocinaBar" component={GestionPedidosCocinaBarScreen} />
       <Stack.Screen options={{ headerShown: false }} name="EncuestaLugarDeTrabajoMozo" component={EncuestaLugarDeTrabajoMozoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="EncuestaLugarDeTrabajoCocinaBar" component={EncuestaLugarDeTrabajoCocinaBarScreen} />
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


