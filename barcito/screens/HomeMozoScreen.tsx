import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { RootStackParamList } from './../App';
import styles from "../styles/Style";

import { auth } from "../database/firebase";
import Spinner from "../utils/SpinnerUtil";
import insertarToast from '../utils/ToastUtil';


const HomeMozoScreen = () => {

    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [loading, setLoading] = useState(false);

    async function handlerSignOut() {
        setLoading(true);
        await auth
            .signOut()
            .then(() => {navigation.replace('Index')})
            .catch((error: any) => alert(error.message))
            .finally(() => { setLoading(false) });
    } 

    // const displayName = auth.currentUser.email;
    
    const handlerGestionEnvioPedidos = () => {
        setLoading(true);
        navigation.replace('GestionEnvioPedidosMozo');
        setLoading(false);
      }
    
     const handlerGestionServirPedidos = () => {
        setLoading(true);
        navigation.replace('GestionServirPedidosMozo');
        setLoading(false);
      }

    const handlerChat = () => {
        navigation.replace('Chat');
      }

    const handlerEncuestaLugarTrabajo = () => {
        navigation.replace('EncuestaLugarDeTrabajoMozo');
      }
    
  return (
    <View style={styles.container}>  
     {loading ?
        <View style={styles.spinContainer}><Spinner/></View>
    : null}
    {<Image
        source={require('../assets/logo.png')}
        resizeMode="contain"
        style={styles.logoHome}
    />}
        
        <View style={styles.buttonContainer} >
             
                <TouchableOpacity
                    onPress={handlerGestionEnvioPedidos}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                    <Text style={styles.buttonOutlineTextRole}>Envío de Pedidos a Cocina/Bar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handlerGestionServirPedidos}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                    <Text style={styles.buttonOutlineTextRole}>Servir Pedidos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                        onPress={handlerChat}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                        <Text style={styles.buttonOutlineTextRole}>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                        onPress={handlerEncuestaLugarTrabajo}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                        <Text style={styles.buttonOutlineTextRole}>Encuesta Lugar de Trabajo</Text>
                </TouchableOpacity>
            </View> 
            <View style={styles.buttonContainer} >  
                <View style={styles.buttonContainer} > 
                    <TouchableOpacity 
                        onPress={handlerSignOut}
                        style={styles.button}
                    >
                    <Text style={styles.buttonText}>Cerrar Sesión</Text>
                    </TouchableOpacity>         
                </View>
            </View>
            <Text style={styles.textHomePequeño}>mozo@barcito.com</Text>

        
    </View>
  );
}

export default HomeMozoScreen;