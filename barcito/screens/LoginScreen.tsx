import { useFocusEffect, useNavigation } from "@react-navigation/core";
import React, { useCallback, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground } from "react-native";
import { auth, db } from "../database/firebase";
import styles from "../styles/Style";
import { signInWithEmailAndPassword } from "firebase/auth";
import { RootStackParamList } from "./../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
//import Spinner from "react-native-loading-spinner-overlay/lib";
import Spinner from "../utils/SpinnerUtil";
import { collection, getDocs, query, where } from "firebase/firestore";
import Toast from 'react-native-simple-toast';

export let admin = false;

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [rol, setRol] = useState("");

    const [isModalSpinnerVisible, setModalSpinnerVisible] = useState(false);

    //const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const toggleSpinnerAlert = () => {
        setModalSpinnerVisible(true);
        setTimeout(() => {
            setModalSpinnerVisible(false);
        }, 3000);
        };

        const loginManager = async (userMail) => {

            // setLoading(true)
            // toggleSpinnerAlert();

            const q = query(collection(db, "userInfo"), where("email", "==", userMail));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setRol(doc.data().rol);
            });
                    
            if(querySnapshot.size  == 0){
                Toast.showWithGravity(
                    "USUARIO NO ENCONTRADO",
                    Toast.LONG, 
                    Toast.CENTER);
            } 
       
            // toggleSpinnerAlert();
            // setLoading(false);
        }; 

    useFocusEffect(
        useCallback(() => {
            console.log(rol);
            Redireccionador(rol);
    }, [rol]));
    
    const Redireccionador = (rol) => {

        if(rol === 'Dueño' || rol === 'Supervisor')
        {
            navigation.replace("HomeDuenio");
        }
        else if(rol === 'Mozo')
        {
            navigation.replace("HomeMozo");
        }
        else if(rol === 'Bartender' || rol === 'Cocinero' )
        {
            navigation.replace("HomeCocinaBar");
        }
        else if(rol === 'Metre')
        {
            navigation.replace("HomeMetre");
        }
        else if(rol === 'clienteRegistrado')
        {
            navigation.replace("HomeCliente");
        }
    }

    const handlerLogin = async () => {
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential: { user: any; }) => {
                const user = userCredential.user;
                console.log("Logged in with", user.email);
                loginManager(email)
                Redireccionador(rol);
                //navigation.replace('Home');
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
        //setEmail("supervisor@barcito.com");
        setEmail("duenio@barcito.com");
        //setEmail("silrusma@gmail.com");
        setPassword("123456");
        admin = false;
    }

    // const supervisorLogin = () => {
    //     //setEmail("supervisor@rus.com");
    //     setEmail("Russsss@gmaim.xmn");

    //     admin = true;
    // }

    const cocinaBarLogin = () => {
        //setEmail("cocinero@barcito.com");
        setEmail("bartender@barcito.com");

        setPassword("123456");
        admin = false;
    }

    const metreLogin = () => {
        setEmail("metre@barcito.com");
        setPassword("123456");
        admin = false;
    }
    const mozoLogin = () => {
        //setEmail("empleado@rus.com");
        setEmail("mozo@barcito.com");
        setPassword("123456");
        admin = false;
    }

    const clienteAnonimoLogin = () => {
        //setEmail("empleado@rus.com");
        setEmail("silviarus.biblio@gmail.com");
        setPassword("123456");
        admin = false;
    }

    const clienteRegistradoLogin = () => {
        //setEmail("empleado@rus.com");
        //setEmail("mozo@barcito.com");
        setEmail("Ttttt@hh.com");
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
                        onPress={cocinaBarLogin}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                        <Text style={styles.buttonOutlineTextRole}>Cocina / Bar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={metreLogin}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                        <Text style={styles.buttonOutlineTextRole}>Metre</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={mozoLogin}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                        <Text style={styles.buttonOutlineTextRole}>Mozo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={clienteRegistradoLogin}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                        <Text style={styles.buttonOutlineTextRole}>Cliente registrado</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={clienteAnonimoLogin}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                        <Text style={styles.buttonOutlineTextRole}>Cliente anónimo</Text>
                    </TouchableOpacity>
                </View>
            </View>
    );
}
export default LoginScreen


