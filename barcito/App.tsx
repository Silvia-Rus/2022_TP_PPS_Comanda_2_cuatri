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
import RegistroComidaScreen from './screens/RegistroComidaScreen';
import RegistroBebidaScreen from './screens/RegistroBebidaScreen';

import HomeDuenioScreen from './screens/HomeDuenioScreen';
import HomeCocinaBarScreen from './screens/HomeCocinaBarScreen';
import HomeMetreScreen from './screens/HomeMetreScreen';
import HomeMozoScreen from './screens/HomeMozoScreen';
import HomeClienteScreen from './screens/HomeClienteScreen';
import HomeClienteEsperaScreen from './screens/HomeClienteEsperaScreen';

import GestionClienteDuenioScreen from './screens/GestionClientesDuenioScreen';
import EncuestaEmpleadosDuenioScreen from './screens/EncuestaEmpleadosDuenioScreen';
import ChatScreen from './screens/ChatScreen';
import GestionClientesMetreScreen from './screens/GestionClientesMetreScreen';
import EncuestaLugarDeTrabajoMetreScreen from './screens/EncuestaLugarDeTrabajoMetreScreen';
import GestionEnvioPedidosMozoScreen from './screens/GestionEnvioPedidosMozoScreen';
import GestionServirPedidosMozoScreen from './screens/GestionServirPedidosMozoScreen';

import GestionPedidosClienteScreen from './screens/GestionPedidosClienteScreen';
import GestionPedidosComidaBarScreen from './screens/GestionPedidosComidaBarScreen';
import GestionPedidosBebidaBarScreen from './screens/GestionPedidosBebidaBarScreen';


import EncuestaLugarDeTrabajoMozoScreen from './screens/EncuestaLugarDeTrabajoMozoScreen';
import EncuestaLugarDeTrabajoCocinaBarScreen from './screens/EncuestaLugarDeTrabajoCocinaBarScreen';
import MenuScreen from './screens/MenuScreen';






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
  RegistroComida: any;
  RegistroBebida: any;
  HomeCocinaBar: any;
  HomeDuenio: any;
  HomeMetre: any;
  HomeMozo: any;
  HomeCliente: any;
  HomeClienteEspera: any;
  GestionClienteDuenio: any;
  EnConstruccionCocinaBar: any;
  Chat: any;
  GestionClientesMetre: any;
  EncuestaEmpleadosDuenio: any;
  EncuestaLugarDeTrabajoMetre: any;
  EncuestaLugarDeTrabajoMozo: any;
  EncuestaLugarDeTrabajoCocinaBar: any;
  GestionPedidosCocinaBar: any;
  GestionEnvioPedidosMozo: any;
  GestionServirPedidosMozo: any;
  GestionPedidosCliente: any;
  GestionPedidosComidaBar: any;
  GestionPedidosBebidaBar: any;
  Menu: any;
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
       <Stack.Screen options={{ headerShown: false }} name="RegistroComida" component={RegistroComidaScreen} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroBebida" component={RegistroBebidaScreen} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroMesa" component={RegistroMesaScreen} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroClienteAnonimo" component={RegistroClienteAnonimoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="RegistroClienteRegistrado" component={RegistroClienteRegistradoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
       <Stack.Screen options={{ headerShown: false }} name="HomeCocinaBar" component={HomeCocinaBarScreen} />
       <Stack.Screen options={{ headerShown: false }} name="HomeMetre" component={HomeMetreScreen} />
       <Stack.Screen options={{ headerShown: false }} name="HomeMozo" component={HomeMozoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="HomeCliente" component={HomeClienteScreen} />
       <Stack.Screen options={{ headerShown: false }} name="HomeClienteEspera" component={HomeClienteEsperaScreen} />
       <Stack.Screen options={{ headerShown: true }} name="Chat" component={ChatScreen} />
       <Stack.Screen options={{ headerShown: false }} name="GestionClientesMetre" component={GestionClientesMetreScreen} />
       <Stack.Screen options={{ headerShown: false }} name="EncuestaEmpleadosDuenio" component={EncuestaEmpleadosDuenioScreen} />
       <Stack.Screen options={{ headerShown: false }} name="EncuestaLugarDeTrabajoMetre" component={EncuestaLugarDeTrabajoMetreScreen} />
       <Stack.Screen options={{ headerShown: false }} name="GestionEnvioPedidosMozo" component={GestionEnvioPedidosMozoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="GestionServirPedidosMozo" component={GestionServirPedidosMozoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="GestionPedidosCliente" component={GestionPedidosClienteScreen} />
       <Stack.Screen options={{ headerShown: false }} name="GestionPedidosComidaBar" component={GestionPedidosComidaBarScreen} />
       <Stack.Screen options={{ headerShown: false }} name="GestionPedidosBebidaBar" component={GestionPedidosBebidaBarScreen} />
       <Stack.Screen options={{ headerShown: false }} name="EncuestaLugarDeTrabajoMozo" component={EncuestaLugarDeTrabajoMozoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="EncuestaLugarDeTrabajoCocinaBar" component={EncuestaLugarDeTrabajoCocinaBarScreen} />
       <Stack.Screen options={{ headerShown: false }} name="Menu" component={MenuScreen} />
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


