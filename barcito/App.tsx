import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import IndexScreen from './screens/IndexScreen';
import HomeScreen from './screens/Homes/HomeScreen';
import RegistroDuenioScreen2 from './screens/Registros/RegistroDuenioScreen2';
import RegistroEmpleadoScreen from './screens/Registros/RegistroEmpleadoScreen';
import RegistroClienteRegistradoScreen from './screens/Registros/RegistroClienteRegistradoScreen';
import RegistroClienteAnonimoScreen from './screens/Registros/RegistroClienteAnonimoScreen';
import RegistroMesaScreen from './screens/Registros/RegistroMesaScreen';
import RegistroComidaScreen from './screens/Registros/RegistroComidaScreen';
import RegistroBebidaScreen from './screens/Registros/RegistroBebidaScreen';

import HomeDuenioScreen from './screens/Homes/HomeDuenioScreen';
import HomeCocinaBarScreen from './screens/Homes/HomeCocinaBarScreen';
import HomeMetreScreen from './screens/Homes/HomeMetreScreen';
import HomeMozoScreen from './screens/Homes/HomeMozoScreen';
import HomeClienteScreen from './screens/Homes/HomeClienteScreen';
import HomeClienteEsperaScreen from './screens/Homes/HomeClienteEsperaScreen';

import GestionClienteDuenioScreen from './screens/GestionClientes/GestionClientesDuenioScreen';
import EncuestaEmpleadosDuenioScreen from './screens/Encuestas/EncuestaEmpleadosDuenioScreen';
import EncuestaClienteScreen from './screens/Encuestas/EncuestaClienteScreen';

import EstadisticasEncuestaClienteScreen from './screens/Estadisticas/EstadisticasEncuestaClienteScreen';


import ChatScreen from './screens/GestionClientes/ChatScreen';
import GestionClientesMetreScreen from './screens/GestionClientes/GestionClientesMetreScreen';
import EncuestaLugarDeTrabajoMetreScreen from './screens/Encuestas/EncuestaLugarDeTrabajoMetreScreen';
import GestionEnvioPedidosMozoScreen from './screens/GestionPedidos/GestionEnvioPedidosMozoScreen';
import GestionServirPedidosMozoScreen from './screens/GestionPedidos/GestionServirPedidosMozoScreen';

import GestionPedidosClienteScreen from './screens/GestionPedidos/GestionPedidosClienteScreen';
import GestionPedidosComidaBarScreen from './screens/GestionPedidos/GestionPedidosComidaBarScreen';
import GestionPedidosBebidaBarScreen from './screens/GestionPedidos/GestionPedidosBebidaBarScreen';
import PedirCuentaScreen from './screens/GestionPedidos/PedirCuentaScreen';
import GestionCobrarCuentaMozoScreen from './screens/GestionPedidos/GestionCobrarCuentaMozoScreen';



import EncuestaLugarDeTrabajoMozoScreen from './screens/Encuestas/EncuestaLugarDeTrabajoMozoScreen';
import EncuestaLugarDeTrabajoCocinaBarScreen from './screens/Encuestas/EncuestaLugarDeTrabajoCocinaBarScreen';
import MenuScreen from './screens/GestionPedidos/MenuScreen';






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
  EncuestaCliente: any;
  EstadisticasEncuestaCliente: any;

  GestionPedidosCocinaBar: any;
  GestionEnvioPedidosMozo: any;
  GestionServirPedidosMozo: any;
  GestionPedidosCliente: any;
  GestionPedidosComidaBar: any;
  GestionPedidosBebidaBar: any;
  GestionCobrarCuentaMozo: any;
  PedirCuenta: any;
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
       <Stack.Screen options={{ headerShown: false }} name="EncuestaCliente" component={EncuestaClienteScreen} />
       <Stack.Screen options={{ headerShown: false }} name="EstadisticasEncuestaCliente" component={EstadisticasEncuestaClienteScreen} />
       <Stack.Screen options={{ headerShown: false }} name="GestionClientesMetre" component={GestionClientesMetreScreen} />
       <Stack.Screen options={{ headerShown: false }} name="EncuestaEmpleadosDuenio" component={EncuestaEmpleadosDuenioScreen} />
       <Stack.Screen options={{ headerShown: false }} name="EncuestaLugarDeTrabajoMetre" component={EncuestaLugarDeTrabajoMetreScreen} />
       <Stack.Screen options={{ headerShown: false }} name="GestionEnvioPedidosMozo" component={GestionEnvioPedidosMozoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="GestionServirPedidosMozo" component={GestionServirPedidosMozoScreen} />
       <Stack.Screen options={{ headerShown: false }} name="GestionPedidosCliente" component={GestionPedidosClienteScreen} />
       <Stack.Screen options={{ headerShown: false }} name="GestionCobrarCuentaMozo" component={GestionCobrarCuentaMozoScreen} />

       <Stack.Screen options={{ headerShown: false }} name="GestionPedidosComidaBar" component={GestionPedidosComidaBarScreen} />
       <Stack.Screen options={{ headerShown: false }} name="PedirCuenta" component={PedirCuentaScreen} />
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


