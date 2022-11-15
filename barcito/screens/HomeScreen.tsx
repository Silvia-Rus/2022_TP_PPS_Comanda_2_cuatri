import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { RootStackParamList } from './../App';
import styles from "../styles/Style";

import { auth } from "../database/firebase";

const HomeScreen = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    async function handlerSignOut() {
        await auth
            .signOut()
            .then(() => {navigation.replace('Index')})
            .catch((error: any) => alert(error.message))
    }    

  return (
    <View style={styles.container}>         
        
        <Text style={styles.textHome}>¡Holi!</Text> 

        <View style={styles.buttonContainer} >   
                <TouchableOpacity 
                    onPress={handlerSignOut}
                    style={styles.button}
                >
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
        </View>                       
    
        
    </View>
  );
}

export default HomeScreen;