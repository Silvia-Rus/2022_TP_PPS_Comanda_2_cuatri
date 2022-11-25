import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { RootStackParamList } from './../App';
import styles from "../styles/Style";

import { auth, db } from "../database/firebase";
import Spinner from "../utils/SpinnerUtil";
import { collection, getDocs, query, where } from 'firebase/firestore';


const HomeCocinaBarScreen = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
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
    
    const handlerRegistroProducto = async () => {
        setLoading(true);
        const q2 = query(collection(db, "userInfo"), where("email", "==", auth.currentUser?.email));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach(async (item2) =>{
            const tipoUsuarioAux = item2.data().rol;
            if(tipoUsuarioAux === 'Bartender') { navigation.replace('RegistroBebida');}
            else{navigation.replace('RegistroComida');}
        });

        setLoading(false);
      }

    const handlerGestionPedidos = () => {
        navigation.replace('EnConstruccionCocinaBar');
      }

    const handlerEncuestaLugarTrabajo = () => {
        navigation.replace('EncuestaLugarDeTrabajoCocinaBar');
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
                    onPress={handlerRegistroProducto}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                    <Text style={styles.buttonOutlineTextRole}>Registro Producto</Text>
                </TouchableOpacity>
                <TouchableOpacity
                        onPress={handlerGestionPedidos}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                        <Text style={styles.buttonOutlineTextRole}>Gestionar Pedidos</Text>
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
            <Text style={styles.textHomePequeño}>bartender@barcito</Text>

        
    </View>
  );
}

export default HomeCocinaBarScreen;