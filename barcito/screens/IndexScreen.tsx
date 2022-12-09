import { useNavigation } from "@react-navigation/core";
import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image } from "react-native";
import { RootStackParamList } from "./../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "../styles/Style";
import insertarToast from "../utils/ToastUtil";

const IndexScreen = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const handlerAccederClienteRegistrado = () => {  
        navigation.replace('RegistroClienteRegistrado'); /// CAMBIAR
    }

    const handlerAccederClienteAnonimo = () => {  
        navigation.replace('RegistroClienteAnonimo'); /// CAMBIAR
    }

    const handlerSignIn = () => {
        navigation.replace('Login');
    }

    const handlerReservas = () => {
        //insertarToast("Reservas");
        navigation.replace('LoginReservas');
    }

    return (   
        <View style={styles.container}>  
      
            {<Image
                source={require('../assets/logo.png')}
                resizeMode="contain"
                style={styles.logoIndex}
            />}
            <View style={styles.buttonContainer} >  
                <TouchableOpacity
                    onPress={handlerSignIn}
                    style={styles.button}
                    >
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                        
                <TouchableOpacity
                    onPress={handlerAccederClienteRegistrado}                   
                    style={[styles.buttonReserva, styles.buttonOutlineRole]}
                    >
                    <Text style={styles.buttonOutlineTextRole}>Registrarse como cliente</Text>
                </TouchableOpacity>                   
                <TouchableOpacity
                    onPress={handlerAccederClienteAnonimo}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                    <Text style={styles.buttonOutlineTextRole}>Acceder como anónimo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handlerReservas}
                    style={[styles.buttonReserva, styles.buttonOutlineRoleReserva]}
                    >
                    <Text style={styles.buttonText}>Reservar</Text>
                </TouchableOpacity> 
            
            </View>              
        </View> 
         
    );
}
        
export default IndexScreen