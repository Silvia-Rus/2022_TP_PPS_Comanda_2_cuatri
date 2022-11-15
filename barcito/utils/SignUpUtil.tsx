import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useLayoutEffect, useEffect, useState, useCallback  } from "react";
import styles from "../styles/Style";
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, View, StyleSheet, PermissionsAndroid } from "react-native";
import Modal from "react-native-modal";
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-simple-toast';
import { createUserWithEmailAndPassword } from "firebase/auth"; 
import { ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, runTransaction } from "firebase/firestore";
import { auth, db, storage } from "../database/firebase";
import getBlob from "../utils/BlobUtil";
import * as ImagePicker from "expo-image-picker";
import { RadioButton } from 'react-native-paper';
import Spinner from "../utils/SpinnerUtil";
import { RootStackParamList } from "../App";

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
            }
        }
        const [checked, setChecked] = React.useState(check(rol));
        //VARIABLE PARA GUARDAR EL USUARIO ORIGINAL
        let originalUser = auth.currentUser;

        //PERMISOS CAMARA
        // useEffect(() => {
        //     (async () => {
        //         await Camera.requestCameraPermissionsAsync();
        //         await BarCodeScanner.requestPermissionsAsync();
        //     })();
        // }, [])

        useEffect(() => {
            (async () => {
              await Camera.requestCameraPermissionsAsync();
            })();
          }, []);

        //HANDLERS
        //RETURN
        const handleReturn = () => {
            navigation.replace("Home");
        }

        //COMPLETADO DEL FORM A PARTIR DEL QR
        const handleBarCodeScanned = ({ data }) => {
            setScanned(true);
            setOpenQR(false);
            const dataSplit = data.split('@');
            const dni = dataSplit[4].trim();
            const nombre = dataSplit[2].trim();
            const apellido = dataSplit[1].trim();
            setValue("dni",dni);
            setValue("nombre",nombre);
            setValue("apellido",apellido);
            setApellido(apellido);
            setNombre(nombre);
            setDni(dni);
        };
    
        //MANEJADOR DEL QR Y CAMARA
        const handleOpenQR = () => {
            setScanned(false);
            setOpenQR(true);
        }
        const handleCamera = async () => {
            console.log("handlecamera");
            setLoading(true);
            console.log("handlecamera");

            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                //allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })
            console.log("uri");
            if (!result.cancelled) {
                // setImage(result["uri"]);
                console.log(result["uri"]);
            }
            setLoading(false)
        };

        const handlerBack = () => {
            navigation.replace('Index');
        }


        //SUBMIT DEL FORM
        const onSubmit = async () => {
            const values=getValues();
            console.log("values:" + values);
            let error=false;
      
            //VALIDACION CAMPOS
            if(rol === 'duenio' || rol === 'cliente')
            {
                if(!image){
                    Toast.showWithGravity(
                      "Pulse en la cámara para subir una foto.",
                      Toast.LONG, 
                      Toast.CENTER);
                    return;
                  }
            }

           
            if(values.password === undefined ||
               values.confirmPassword === undefined ||
               values.nombre === undefined ||
               values.apellido === undefined ||
               values.dni === undefined ||
               values.cuil === undefined ||
               values.email === undefined ){
                    Toast.showWithGravity(
                        "Todos los campos son obligatorios",
                        Toast.LONG, 
                        Toast.CENTER);
                    return;
               }
          
            if(values.password!==values.confirmPassword){
              Toast.showWithGravity(
                "Las contraseñas no coinciden",
                Toast.LONG, 
                Toast.CENTER);
              return;
            }
            if(values.password.length<6){
              Toast.showWithGravity(
                "La contraseña debe tener al menos 6 caracteres",
                Toast.LONG,
                Toast.CENTER);
              return;
            }
            if(values.dni.length!==8){
              Toast.showWithGravity(
                "El DNI debe tener 8 caracteres",
                Toast.LONG,
                Toast.CENTER);
              return;
            }
            if(values.cuil.length!==11){
            Toast.showWithGravity(
              "El CUIL debe tener 11 caracteres",
              Toast.LONG,
              Toast.CENTER);
            }      
            if(!values.email.includes("@")){
              Toast.showWithGravity(
                "El correo electrónico no es válido",
                Toast.LONG,
                Toast.CENTER);
              return;
            }
            if(!values.email.includes(".")){
              Toast.showWithGravity(
                "El correo electrónico no es válido",
                Toast.LONG,
                Toast.CENTER);
              return;
            }
      
            setLoading(true)
            toggleSpinnerAlert();
            try {
              console.log(auth.currentUser?.email);
              //CREACION DE USUARIO
              await createUserWithEmailAndPassword(auth,values.email,values.password);
              console.log(auth.currentUser?.email);
      
              //DESLOGUEO DEL USUARIO CREADO Y REESTABLECIMIENTO DEL USUARIO ORIGINAL
              await auth.signOut();
              await auth.updateCurrentUser(originalUser);
      
              //UPLOAD IMAGEN

              let imageValue = "";
           
              if(image){
                const blob:any = await getBlob(image);
                const fileName = image.substring(image.lastIndexOf("/") + 1);
                const fileRef = ref(storage, "userInfo/" + fileName);
                await uploadBytes(fileRef, blob);
                imageValue = fileRef.fullPath;
              }
              
                // const blob:any = await getBlob(image);
                // const fileName = image.substring(image.lastIndexOf("/") + 1);
                // const fileRef = ref(storage, "userInfo/" + fileName);
                // await uploadBytes(fileRef, blob);

                // let imageValue = fileRef.fullPath;
              //UPLOAD DATA
              await addDoc(collection(db, "userInfo"), {
                lastName:values.apellido,
                name:values.nombre,
                dni:values.dni,
                cuil:values.cuil,
                email:values.email,
                rol:checked,
                image:imageValue,
                creationDate:new Date()          
              });        
              Toast.showWithGravity(
                "Usuario creado exitosamente",
                Toast.LONG, 
                Toast.CENTER);      
            reset();
            setImage("");
            //VUELTA AL CONTROL PANEL ( VER DE PONER EL QUE CORRESPONDE EN CADA CASO)
            handleReturn();
            } catch (error:any) {
              Toast.showWithGravity(
               "EL CATCH: "+error.code,
                Toast.LONG, 
                Toast.CENTER); 
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

            // switch(checked){
            //     case 'Supervisor':
            //         setValue("rol",checked);
            //         break;
            //     case 'Dueño':
            //         setValue("rol",checked);
            //         break;
            //     case 'Mozo':
            //         setValue("rol",checked);
            //         break;
            // }

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

            <View style={styles.buttonContainer} >
                <TouchableOpacity
                        onPress={handleOpenQR}
                        style={styles.buttonLogin}
                    >
                        <Text style={styles.buttonText}>Escanear DNI</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder={nombreForm}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                    onChangeText={(text) => setValue("nombre",text)}
                />
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
                <TextInput
                    placeholder={cuilForm}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                    keyboardType={'numeric'}
                    onChangeText={(text) => setValue("cuil",text)}
                />
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