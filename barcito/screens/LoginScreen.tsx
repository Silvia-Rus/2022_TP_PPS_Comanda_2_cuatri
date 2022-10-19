import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground } from "react-native";
import { auth } from "../database/firebase";
import styles from "../styles/Style";
import { signInWithEmailAndPassword } from "firebase/auth";
import { RootStackParamList } from "./../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
//import Spinner from "react-native-loading-spinner-overlay/lib";
import Spinner from "../utils/SpinnerUtil";;


export let admin = false;

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const handlerLogin = async () => {
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential: { user: any; }) => {
                const user = userCredential.user;
                console.log("Logged in with", user.email);
                navigation.replace('Home');
            })
            .catch(error => {
                switch (error.code) {
                    case 'auth/invalid-email':
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                    case 'auth/internal-error':
                    case 'auth/too-many-requests':
                        setMessageError("Credenciales inválidas");
                        break;
                    default:
                        setMessageError(error.message);
                        break;
                }
            }).finally(() => { setLoading(false) });
    }

    const setMessageError = (message: string) => {
        setMessage(message);
        setTimeout(() => {
            setMessage("");
        }, 3000);
    }

    const duenioLogin = () => {
        //setEmail("duenio@rus.com");
        setEmail("invitado@rus.com");

        setPassword("123456");
        admin = false;
    }

    const supervisorLogin = () => {
        //setEmail("supervisor@rus.com");
        setEmail("invitado@rus.com");

        admin = true;
    }

    const empleadoLogin = () => {
        //setEmail("empleado@rus.com");
        setEmail("invitado@rus.com");

        setPassword("123456");
        admin = false;
    }

    const handlerBack = () => {
        navigation.replace('Index');
    }

    return (
            <View style={styles.container}>
                {loading && <View style={styles.spinContainer}>
                    <Spinner/>
                </View>}
               {<Image
                    source={require('../assets/LOGOS/cubiertos_cuadrado.png')}
                    resizeMode="contain"
                    style={styles.logoHome}
                />}

                <View style={styles.inputContainer}>
                    {!!message ? <TouchableOpacity
                        style={styles.buttonError}
                        onPress={() => setMessage("")}
                    >
                        <Text style={styles.buttonText}>{message}</Text>
                    </TouchableOpacity> : null}

                    <TextInput placeholder="Correo electrónico"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.input}
                    />

                    <TextInput placeholder="Contraseña"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={styles.input}
                        secureTextEntry
                    />
                </View>

                <View style={styles.buttonContainer} >
                    <TouchableOpacity
                        onPress={handlerLogin}
                        style={styles.buttonLogin}
                    >
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handlerBack}
                        style={[styles.buttonLogin, styles.buttonOutlineLogin]}
                    >
                        <Text style={styles.buttonOutlineText}>Volver</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer} >
                    <TouchableOpacity
                        onPress={duenioLogin}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                        <Text style={styles.buttonOutlineTextRole}>Dueño</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={supervisorLogin}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                        <Text style={styles.buttonOutlineTextRole}>Supervisor</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={empleadoLogin}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                        <Text style={styles.buttonOutlineTextRole}>Empleado</Text>
                    </TouchableOpacity>
                </View>
            </View>
    );
}
export default LoginScreen