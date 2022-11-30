import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Image, TextInput } from 'react-native';
import { RootStackParamList } from '../../App';
import styles from "../../styles/Style";
import Toast from 'react-native-simple-toast';


import { auth, db } from "../../database/firebase";
import Spinner from "../../utils/SpinnerUtil";
import { collection, getDocs, query, where } from 'firebase/firestore';
import EnConstruccionScreen from "../../utils/EnConstruccionUtil";
//import { addListaDeEspera } from "../utils/AddDocsUtil";

const HomeClienteEsperaScreen = () => {

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    async function handlerSignOut() {
        await auth
            .signOut()
            .then(() => {navigation.replace("Index")})
            .catch((error: any) => alert(error.message))
       }  

    return(
        <View style={styles.container}>
            {<Image
            source={require('../assets/logo.png')}
            resizeMode="contain"
            style={styles.logoHome}
            />}
            <View style={styles.buttonContainer}>         
                <Text style={styles.textEnEspera}>Espere a que lo acepten para poder continuar.</Text> 
                <View style={styles.buttonContainer} >   
                <TouchableOpacity 
                    onPress={handlerSignOut}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Salir</Text>
                </TouchableOpacity>
                </View>  
            </View> 
        </View> 
    )
}

export default HomeClienteEsperaScreen;