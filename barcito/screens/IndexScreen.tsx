import { useNavigation } from "@react-navigation/core";
import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image } from "react-native";
import { RootStackParamList } from "./../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "../styles/Style";

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

    return (   
        <View style={styles.container}>  
      
            {<Image
                source={require('../assets/logo.png')}
                resizeMode="contain"
                style={styles.logoIndex}
            />}

            <View style={styles.buttonContainer} >   
                <TouchableOpacity
                    onPress={handlerAccederClienteRegistrado}                   
                    style={styles.button}
                    >
                    <Text style={styles.buttonText}>Registrarse como cliente</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    onPress={handlerAccederClienteAnonimo}
                    style={styles.button}
                    //style={[styles.button, styles.buttonOutline]}
                    >
                    <Text style={styles.buttonText}>Acceder como anónimo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handlerSignIn}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                    <Text style={styles.buttonOutlineTextRole}>Iniciar Sesión (solo staff)</Text>
                </TouchableOpacity>
            </View>              
        </View> 
         
    );
}
        
export default IndexScreen