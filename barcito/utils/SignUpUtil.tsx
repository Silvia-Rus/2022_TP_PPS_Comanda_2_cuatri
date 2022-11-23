import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useLayoutEffect, useEffect, useState, useCallback  } from "react";
import styles from "../styles/Style";
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, View, StyleSheet, PermissionsAndroid } from "react-native";
import Modal from "react-native-modal";
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useForm } from 'react-hook-form';
import insertarToast from "./ToastUtil";
import { createUserWithEmailAndPassword } from "firebase/auth"; 
import { auth, db, storage } from "../database/firebase";
import { RadioButton } from 'react-native-paper';
import Spinner from "../utils/SpinnerUtil";
import { RootStackParamList } from "../App";
import { addClienteRegistrado, addDuenioEmpleado, addClienteAnonimo } from "./AddDocsUtil";
import LanzarCamara from "./CameraUtil";
import CargarImagen from "./CargarImagenUtil";
import ValidacionCamposUsuario from "./ValidacionCamposUsuariosUtil"


const SignUp = (rol : string) => {

    // console.log("estoy en el útil!!");
    type NewUser = {
        apellido:string;
        nombre:string;
        dni:string;
        cuil:string;
        email:string;
        password:string;
        confirmPassword:string
        rol:string;
      }

    //const RegistroDuenioScreen = () => {
        //CONSTANTES
        //const navigation = useNavigation<NativeStackNavigationProp<any>>();
        const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
        const [apellidoForm, setApellido] = useState("Apellido");
        const [nombreForm, setNombre] = useState("Nombre");
        const [dniForm, setDni] = useState("DNI");
        const [cuilForm, setCuil] = useState("CUIL");
        const [emailForm, setEmail] = useState("Correo Electrónico");
        const [passwordForm, setPassword] = useState("Contraseña");
        const [confirmPasswordForm, setConfirmPassword] = useState("Confirmar Contraseña");
        const [scanned, setScanned] = useState(false);
        const [openQR, setOpenQR] = useState(false);
        const {getValues, formState:{}, reset, setValue} = useForm<NewUser>();
        const [image, setImage] = useState("");
        const [loading, setLoading] = useState(false);
        //const [placeholderColor, setPlaceholderColor] = useState("white");
        const [isModalSpinnerVisible, setModalSpinnerVisible] = useState(false);
        const check = (value) => {
            switch(value){
                case 'duenio':
                    return 'Dueño';
                    break;
                case 'empleado':
                    return 'Mozo';
                    break;
                case 'clienteRegistrado':
                    return 'clienteRegistrado';
                    break;
                case 'clienteAnonimo':
                    return 'clienteRegistrado';
                    break;
            }
        }
        const [checked, setChecked] = React.useState(check(rol));
        //VARIABLE PARA GUARDAR EL USUARIO ORIGINAL
        let originalUser = auth.currentUser;

        //PERMISOS CAMARA
        useEffect(() => {
            (async () => {
                await Camera.requestCameraPermissionsAsync();
                await BarCodeScanner.requestPermissionsAsync();
            })();
        }, [])


        //HANDLERS
        //RETURN
        const handleReturn = () => {
            if(rol === 'clienteAnonimo')        {navigation.replace('HomeCliente');}
            else if(rol === 'clienteRegistrado'){navigation.replace('HomeClienteEspera');}
            else                                {navigation.replace('HomeDuenio');}
        }

        //COMPLETADO DEL FORM A PARTIR DEL QR
        const handleBarCodeScanned = ({ data }) => {
            setScanned(true);
            setOpenQR(false);
            //console.log(data);
            const dataSplit = data.split('@');
            console.log(dataSplit);
            if(dataSplit.length === 9)
            {
                setValue("dni",dataSplit[4].trim());
                setValue("nombre",dataSplit[2].trim());
                setValue("apellido", dataSplit[1].trim());
                setApellido(dataSplit[1].trim());
                setNombre(dataSplit[2].trim());
                setDni(dataSplit[4].trim());
            }
            else
            {
                setValue("dni",dataSplit[1].trim());
                setValue("nombre",dataSplit[5].trim());
                setValue("apellido", dataSplit[4].trim());
                setApellido(dataSplit[4].trim());
                setNombre(dataSplit[5].trim());
                setDni(dataSplit[1].trim());
            }              
        };
    
        //MANEJADOR DEL QR Y CAMARA
        const handleOpenQR = () => {
            setScanned(false);
            setOpenQR(true);
        }
        const handleCamera = async () => {
            setLoading(true);
            setImage(await LanzarCamara());
            setLoading(false)         
        };

        const handlerBack = () => {

            if(rol === 'clienteAnonimo' || rol === 'clienteRegistrado')
            {
                navigation.replace('Index');
            }
            else
            {
                navigation.replace('HomeDuenio');
            }
        }
        //SUBMIT DEL FORM
        const onSubmit = async () => {
            const values=getValues();
            console.log("values:" + values);
            let error=false;
      
            //VALIDACION CAMPOS
            let validacion = ValidacionCamposUsuario(values, image, rol);
            console.log("la validacion "+validacion);
            if(validacion === false)
            {
                console.log("entra a campos obligatorios");
                insertarToast("Todos los campos y la imagen son requeridos.")
                insertarToast("Compruebe que todos los campos son correctis.")

                return;
            }          
            
            setLoading(true)
            toggleSpinnerAlert();
            try {
              console.log(auth.currentUser?.email);
              //CREACION DE USUARIO

                if(rol !== 'clienteAnonimo')
                {   
                    await createUserWithEmailAndPassword(auth,values.email,values.password);
                    console.log(auth.currentUser?.email);
                }

                if(rol === 'duenio' || rol === 'empleado'){
                   //DESLOGUEO DEL USUARIO CREADO Y REESTABLECIMIENTO DEL USUARIO ORIGINAL
                    await auth.signOut();
                    await auth.updateCurrentUser(originalUser);
                }
    
                //UPLOAD IMAGEN
                let imageValue = "";
                if(image){
                imageValue = (await CargarImagen(image));
                }

                if(rol === 'duenio' || rol === 'empleado'){
                    addDuenioEmpleado(imageValue, values, checked);
                }
                else if(rol === 'clienteRegistrado'){
                    console.log("en el add: "+values);
                    addClienteRegistrado(imageValue, values, checked)
                }
                else if(rol === 'clienteAnonimo'){
                    addClienteAnonimo(imageValue, values, checked)
                }
                insertarToast("Usuario creado exitosamente");    
                reset();
                setImage("");

                //ENTRAR
                handleReturn();
            }catch (error:any) {
                insertarToast(error.code);
            }finally{
              setLoading(false);
              resetForm();  
              console.log(auth.currentUser?.email);
            }
          }

        //RESET DEL FORM
        const resetForm = () => {
        setApellido("Apellido");
        setNombre("Nombre");
        setDni("DNI");
        setCuil("CUIL");
        setEmail('Correo Electrónico');
        setPassword('Contraseña');
        setConfirmPassword('Confirmar Contraseña');
        setValue("dni",'');
        setValue("nombre",'');
        setValue("apellido",'');
        setValue("email",'');
        setValue("password",'');
        setValue("confirmPassword",'');
        setValue("cuil",'');
        setValue("rol",'');
        setImage("");
        }

        //SPINNER
        const toggleSpinnerAlert = () => {
        setModalSpinnerVisible(true);
        setTimeout(() => {
            setModalSpinnerVisible(false);
        }, 3000);
        };

        //HEADER
        // useLayoutEffect(() => {
        //     navigation.setOptions({
        //     headerLeft: () => (
        //         <TouchableOpacity onPress={handleReturn}>
        //             <Image source={returnIcon} style={styles.headerIcon}/>
        //         </TouchableOpacity>
        //     ),
        //     headerTitle: () => (
        //         <Text style={styles.headerText}>ALTA DE DUEÑO / SUPERVISOR</Text>
        //     ),
        //     headerTintColor: "transparent",
        //     headerBackButtonMenuEnabled: false,
        //     headerStyle: {
        //         backgroundColor: 'rgba(61, 69, 68, 0.4);',
        //     },         
        //     });
        // }, []);

        //MANEJADORES RADIOBUTTONS
        const pressDueño = () => {
            setChecked('Dueño');
        }

        const pressSupervisor = () => {
            setChecked('Supervisor');
        }

        const pressMozo = () => {
            setChecked('Mozo');
        }

        const pressMetre = () => {
            setChecked('Metre');
        }

        const pressCocinero = () => {
            setChecked('Cocinero');
        }

        const pressBartender = () => {
            setChecked('Bartender');
        }

        //CARGA CAMPOS SEGUN SELECCION RADIO BUTTON
        useFocusEffect(
        useCallback(() => {
            console.log("el callback: "+checked);
            if(checked=='Supervisor'){
            setValue("rol",checked);
            }
            if(checked=='Dueño'){
            setValue("rol",checked);
            }
            if(checked=='Mozo'){
                setValue("rol",checked);
                }
        }, [checked]))


        return (
        !openQR ?
        <View style={styles.container}>  
            {loading}
            <View style={styles.buttonContainer}>
                <View style={styles.cameraQrContainer}>
                {!image?
                <TouchableOpacity onPress={handleCamera}>
                  <Image style={styles.cameraIcon} resizeMode="cover" source={require('../assets/camara.png')} />
                </TouchableOpacity> :
                <View>
                  <Image style={styles.cameraImage} resizeMode="cover" source={{uri:image}}/>
                </View>
                }
            </View>
            { rol != 'clienteAnonimo' ?
            <View style={styles.buttonContainer} >
                <TouchableOpacity
                        onPress={handleOpenQR}
                        style={styles.buttonLogin}
                    >
                        <Text style={styles.buttonText}>Escanear DNI</Text>
                </TouchableOpacity>
            </View>
            : null}

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder={nombreForm}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                    onChangeText={(text) => setValue("nombre",text)}
                />
            </View>

            { rol != 'clienteAnonimo' ?
                <View style={styles.inputContainer}>
                <TextInput
                    placeholder= {apellidoForm}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                    onChangeText={(text) => setValue("apellido",text)}
                />
                <TextInput
                    placeholder={dniForm}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                    keyboardType={'numeric'}
                    onChangeText={(text) => setValue("dni",text)}
                />
                </View>
                :null
            }
          
            {rol == 'duenio' || rol == 'empleado' ?
                <View style={styles.inputContainer}>
                   <TextInput
                   placeholder={cuilForm}
                   style={[styles.buttonRole, styles.buttonOutlineRole]}
                   keyboardType={'numeric'}
                   onChangeText={(text) => setValue("cuil",text)}
                   />
                </View>
            : null}
            {rol != 'clienteAnonimo' ?
                <View style={styles.inputContainer}>
                            
                    <TextInput
                        placeholder= {emailForm}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                        onChangeText={(text) => setValue("email",text)}
                    />
                    <TextInput
                        placeholder= {passwordForm}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                        onChangeText={(text) => setValue("password",text)}
                        secureTextEntry = {true}             
                    />
                    <TextInput
                        placeholder= {confirmPasswordForm}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                        onChangeText={(text) => setValue("confirmPassword",text)}
                        secureTextEntry = {true}
                    />              
                </View>
            :null} 
        </View>  

         {rol == 'duenio' ?
            <View style={styles.buttonContainer} >
                <View style={styles.inputFieldRadioLayout}>
                    <View style={styles.inputFieldRadio}>
                        <RadioButton
                            value="Dueño"
                            status={ checked === 'Dueño' ? 'checked' : 'unchecked' }
                            onPress={ pressDueño }
                        />
                        <Text style={styles.buttonOutlineText}>Dueño</Text>               
                    </View>

                    <View style={styles.inputFieldRadio}>
                        <RadioButton
                            value="Supervisor"
                            status={ checked === 'Supervisor' ? 'checked' : 'unchecked' }
                            onPress={ pressSupervisor }
                        />
                        <Text style={styles.buttonOutlineText}>Supervisor</Text>
                    </View>  
                </View>
            </View>
        : null
        }   

        
         {rol == 'empleado' ?
            <View style={styles.buttonContainer} >
                <View style={styles.inputFieldRadioLayout}>
                    <View style={styles.inputFieldRadio}>
                        <RadioButton
                            value="Dueño"
                            status={ checked === 'Mozo' ? 'checked' : 'unchecked' }
                            onPress={ pressMozo }
                        />
                        <Text style={styles.buttonOutlineText}>Mozo</Text>               
                    </View>

                    <View style={styles.inputFieldRadio}>
                        <RadioButton
                            value="Supervisor"
                            status={ checked === 'Metre' ? 'checked' : 'unchecked' }
                            onPress={ pressMetre }
                        />
                        <Text style={styles.buttonOutlineText}>Metre</Text>
                    </View>  
                </View>
                <View style={styles.inputFieldRadioLayout}>
                    <View style={styles.inputFieldRadio}>
                        <RadioButton
                            value="Dueño"
                            status={ checked === 'Cocinero' ? 'checked' : 'unchecked' }
                            onPress={ pressCocinero }
                        />
                        <Text style={styles.buttonOutlineText}>Cocinero</Text>               
                    </View>

                    <View style={styles.inputFieldRadio}>
                        <RadioButton
                            value="Supervisor"
                            status={ checked === 'Bartender' ? 'checked' : 'unchecked' }
                            onPress={ pressBartender }
                        />
                        <Text style={styles.buttonOutlineText}>Bartender</Text>
                    </View>  
                </View>
            </View>
            
        : null
        }     
            <View style={styles.buttonContainer} >
                <View style={styles.buttonContainer} >
                        <TouchableOpacity
                            onPress={onSubmit}
                            style={styles.buttonLogin}
                        >
                            <Text style={styles.buttonText}>Registro</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handlerBack}
                            style={[styles.buttonLogin, styles.buttonOutlineLogin]}
                        >
                            <Text style={styles.buttonOutlineText}>Volver</Text>
                        </TouchableOpacity>
                </View>
            </View>          
            <View>
                <Modal backdropOpacity={0.5} animationIn="rotate" animationOut="rotate" isVisible={isModalSpinnerVisible}>
                <Spinner></Spinner>
                </Modal>
            </View> 

        </View> : <BarCodeScanner
                    onBarCodeScanned={scanned && openQR ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject} />
        );
    //};

}

export default SignUp;


