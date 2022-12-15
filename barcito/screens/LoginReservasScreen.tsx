import { useFocusEffect, useNavigation } from "@react-navigation/core";
import React, { useCallback, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground } from "react-native";
import { auth, db } from "../database/firebase";
import styles from "../styles/Style";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { RootStackParamList } from "./../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Spinner from "../utils/SpinnerUtil";
import { collection, getDocs, query, where } from "firebase/firestore";
import Toast from 'react-native-simple-toast';
import insertarToast from "../utils/ToastUtil";
import DatePicker from 'react-native-date-picker';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'

//WEB
//CLIENTE ID: 702272886849-4tn7shnlqgbe1qfi9t47svgoo33ibhpl.apps.googleusercontent.com
//SECRETO: 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

//ANDROID
//CLIENTE ID702272886849-ecq78tge7483m978udokb94548dr7j5a.apps.googleusercontent.com

export let admin = false;

WebBrowser.maybeCompleteAuthSession(); 

const LoginReservasScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [rol, setRol] = useState("");
    const [accessToken, setAccessToken] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        expoClientId: '702272886849-l91u4b3g9sthcv1gthst5o5bna49l5p6.apps.googleusercontent.com',
        androidClientId: '702272886849-adkk8p6p358gjfca0k9mbaukm3unssuc.apps.googleusercontent.com',
        iosClientId: '702272886849-mvhaktfjh38nh5rp9elrc56m0raa2p8d.apps.googleusercontent.com'
    });

    React.useEffect(() => {
        if(response?.type === "success") {
          console.log(response);
          setAccessToken(response.authentication.accessToken);
          accessToken && fetchUserInfo();
        }
      }, [response, accessToken])

    async function fetchUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const useInfo = await response.json();
    setUser(useInfo);
    }

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const clienteRegistradoLogin = () => {
        setEmail("silrusma@gmail.com");
        //setEmail("mozo@barcito.com");
        setPassword("123456");
        admin = false;
    }

    const loginManager = async (userMail) => {
        setLoading(true);
        try{
            const q = query(collection(db, "userInfo"), where("email", "==", userMail));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setRol(doc.data().rol);
                if(doc.data().rol === 'clienteRegistrado')
                {
                    //insertarToast("cliente registrado");
                    navigation.replace("ReservaClientes");
                }
                else
                {
                    insertarToast("Debe ser cliente registrado para reservar.");

                }
        });
        } catch(error){console.log("ERROR GETPEDIDO: "+error)                    
        } finally{ setLoading(false);}
                
        // if(querySnapshot.size  == 0){
        //     insertarToast("USUARIO NO ENCONTRADO");
        // } 
        }; 

    useFocusEffect(
        useCallback(() => {
            console.log(rol);
            //Redireccionador(rol);
    }, [rol]));
    

    const handlerLogin = async () => {
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential: { user: any; }) => {
                const user = userCredential.user;
                console.log("Logged in with", user.email);
                loginManager(email);
                //Redireccionador(rol);
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

    const handlerLoginGoogle = async () => {
        
    }

    const ShowUserInfo = () => {
        if(user) {
          return(
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 35, fontWeight: 'bold', marginBottom: 20}}>Welcome</Text>
              <Image source={{uri: user.picture}} style={{width: 100, height: 100, borderRadius: 50}} />
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>{user.name}</Text>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>{user.email}</Text>
            </View>
          )
        }
      }  

    const setMessageError = (message: string) => {
        setMessage(message);
        setTimeout(() => {
            setMessage("");
        }, 3000);
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
                 <ShowUserInfo />

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
                        <Text style={styles.buttonText}>Iniciar Reserva</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handlerBack}
                        style={[styles.buttonLogin, styles.buttonOutlineLogin]}
                    >
                        <Text style={styles.buttonOutlineText}>Volver</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={clienteRegistradoLogin}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                        <Text style={styles.buttonOutlineTextRole}>Cliente registrado</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        onPress={()=> (
                            promptAsync()
                        )}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                    >
                        <Text style={styles.buttonOutlineTextRole}>Acceso con google</Text>
                    </TouchableOpacity> */}
                </View>
        </View>
    );
}
export default LoginReservasScreen


