import { useFocusEffect, useNavigation } from "@react-navigation/core";
import React, { useCallback, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground } from "react-native";
import { auth, db } from "../database/firebase";
import styles from "../styles/Style";
import { getAuth, GoogleAuthProvider, signInWithCredential, signInWithCustomToken, signInWithEmailAndPassword, signInWithEmailLink } from "firebase/auth";
import { RootStackParamList } from "../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
//import Spinner from "react-native-loading-spinner-overlay/lib";
import Spinner from "../utils/SpinnerUtil";
import { collection, getDocs, query, where } from "firebase/firestore";
import Toast from 'react-native-simple-toast';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'
import insertarToast from "../utils/ToastUtil";
import { parseJSON } from "date-fns/esm";


export let admin = false;
WebBrowser.maybeCompleteAuthSession(); 

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [rol, setRol] = useState("");

    const [isModalSpinnerVisible, setModalSpinnerVisible] = useState(false);

    //para el login con google
    const [accessToken, setAccessToken] = React.useState(null);
    const [user, setUser] = React.useState(null);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '702272886849-l91u4b3g9sthcv1gthst5o5bna49l5p6.apps.googleusercontent.com',
        expoClientId: '702272886849-l91u4b3g9sthcv1gthst5o5bna49l5p6.apps.googleusercontent.com',
        androidClientId: '702272886849-adkk8p6p358gjfca0k9mbaukm3unssuc.apps.googleusercontent.com',
        iosClientId: '702272886849-mvhaktfjh38nh5rp9elrc56m0raa2p8d.apps.googleusercontent.com'
  });

  React.useEffect(() => {
        if(response?.type === "success") {
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
        await signInWithEmailAndPassword(auth, useInfo.email, "123456")
            .then((userCredential: { user: any; }) => {
                const user = userCredential.user;
                loginManager(auth.currentUser?.email) 
                Redireccionador(rol);
                setLoading(false)      
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

    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const loginManager = async (userMail) => {
        setLoading(true);
        const q = query(collection(db, "userInfo"), where("email", "==", userMail));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setRol(doc.data().rol);
        });
                
        if(querySnapshot.size  == 0){
           insertarToast("USUARIO NO ENCONTRADO");
        } 
        setLoading(false);
    }; 

    useFocusEffect(
        useCallback(() => {
            console.log(rol);
            Redireccionador(rol);
    }, [rol]));
    
    const Redireccionador = (rol) => {

       
        if(rol === 'Dueño' || rol === 'Supervisor')
        {
            setLoading(true);
            navigation.replace("HomeDuenio");
            setLoading(false);
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
                console.log(password);
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

    const barLogin = () => {
        //setEmail("cocinero@barcito.com");
        setEmail("bartender@barcito.com");
        setPassword("123456"); 
        admin = false;
    }

    const cocinaLogin = () => {
        setEmail("cocinero@barcito.com");
        //setEmail("bartender@barcito.com");
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
        setEmail("anonimo@anonimo.com");
        setPassword("123456");
        admin = false;
    }

    const clienteRegistradoLogin = () => {
        setEmail("silrusma@gmail.com");
        //setEmail("mozo@barcito.com");
        setPassword("123456");
        admin = false;
    }
    const handlerBack = () => {
        navigation.replace('Index');
    }

    const ShowUserInfo =  () => {
        if(user) {
          setLoading(true);
        //   loginManager(user.email);      
          return(
            <View>
            </View>
          )
        }
      }  
    return (
        
            <View style={styles.container}>
                {loading && <View style={styles.spinContainer}>
                    <Spinner/>
                </View>}
             
               {user ? <ShowUserInfo/> : 
               
               <View style={styles.buttonContainer}>
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
                            style={styles.input2}
                        />

                        <TextInput placeholder="Contraseña"
                            value={password}
                            onChangeText={text => setPassword(text)}
                            style={styles.input2}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.buttonContainer} >
                        <TouchableOpacity
                            onPress={handlerLogin}
                            style={styles.buttonLogin2}
                        >
                            <Text style={styles.buttonText}>Iniciar Sesión</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handlerBack}
                            style={[styles.buttonLogin2, styles.buttonOutlineLogin]}
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
                            onPress={barLogin}
                            style={[styles.buttonRole, styles.buttonOutlineRole]}
                        >
                            <Text style={styles.buttonOutlineTextRole}>Bar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={cocinaLogin}
                            style={[styles.buttonRole, styles.buttonOutlineRole]}
                        >
                            <Text style={styles.buttonOutlineTextRole}>Cocina</Text>
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
                    
                        <TouchableOpacity
                            disabled={!request}
                            onPress={() => {
                            promptAsync();
                            }} 
                        >
                            <Image
                                source={require('../assets/googlelogin2.png')}
                                resizeMode="contain"
                                style={styles.logoGoogle}
                                />
                        </TouchableOpacity>
                     </View>
                </View>
               }   
            </View>
    );
}
export default LoginScreen


