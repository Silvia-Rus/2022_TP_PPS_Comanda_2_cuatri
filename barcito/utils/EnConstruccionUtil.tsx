import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { RootStackParamList } from '../App';
import styles from "../styles/Style";

import { auth } from "../database/firebase";

const EnConstruccionScreen = (ruta) => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    // async function handlerSignOut() {
    //     await auth
    //         .signOut()
    //         .then(() => {navigation.replace(ruta)})
    //         .catch((error: any) => alert(error.message))
    //         navigation.replace(ruta)
    // }  
    
     function handlerSignOut() {

          navigation.replace(ruta);
     } 

  return (
    <View style={styles.container}>         
        <Text style={styles.textHomePequeño}>En construcción...</Text> 
        <View style={styles.buttonContainer} >   
                <TouchableOpacity 
                    onPress={handlerSignOut}
                    style={styles.button}
                >
                <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>
        </View>                          
    </View>
  );
}

export default EnConstruccionScreen;