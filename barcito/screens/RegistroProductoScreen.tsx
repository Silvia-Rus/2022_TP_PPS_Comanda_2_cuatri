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
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db, storage } from "../database/firebase";
import getBlob from "../utils/BlobUtil";
import * as ImagePicker from "expo-image-picker";
import { RadioButton } from 'react-native-paper';
import Spinner from "../utils/SpinnerUtil";
import { RootStackParamList } from "../App";
//import { launchCamera } from "react-native-image-picker";
//import * as ImagePicker from "react-native-image-picker";
// import ImagePicker from 'react-native-image-crop-picker';
import { addProducto } from "../utils/AddDocsUtil";
import LanzarCamara from "../utils/CameraUtil";
import ValidacionCamposProducto from "../utils/ValidacionCamposProductoUtil";
import CargarImagen from "../utils/CargarImagenUtil";


type NewProduct = {
    name:string;
    description:string;
    elaborationTime:string;
    price:string;
    type:string;
  }

const RegistroProducto = () => {

        //CONSTANTES
        const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
        const [nameForm, setName] = useState("Nombre del Producto");
        const [descriptionForm, setDescription] = useState("Descripción del Producto");
        const [elaborationTimeForm, setElaborationTime] = useState("Tiempo de Elaboración (en minutos)");
        const [priceForm, setPrice] = useState("Precio");
        const {getValues, formState:{}, reset, setValue} = useForm<NewProduct>();
        const [image1, setImage1] = useState("");
        const [image2, setImage2] = useState("");
        const [image3, setImage3] = useState("");
        const [loading, setLoading] = useState(false);
        const [placeholderColor, setPlaceholderColor] = useState("white");
        const [isModalSpinnerVisible, setModalSpinnerVisible] = useState(false);
        const [checked, setChecked] = React.useState('Comida');
        const [employeeType, setEmployeeType] = React.useState('');

        const handleReturn = () => {
            navigation.replace("Home")
          }
    
        const handlerBack = () => {
            navigation.replace('HomeCocinaBar');
            }

        const pressComida = () => {
            setChecked('Comida');
            }
        
        const pressBebida = () => {
            setChecked('Bebida');
            }

          //NAVEGACIÓN
        ///VER PORQUE NO FUNCIONA EL RETURN POR CUALQUIER mail

    //   useFocusEffect(
    //     useCallback(() => {
    //       async () => {
    //         const q = query(collection(db, "userInfo"), where("email", "==", auth.currentUser?.email));
    //         const querySnapshot = await getDocs(q);
    //         console.log(querySnapshot.size);
    //         querySnapshot.forEach((doc) => {
    //           setEmployeeType(doc.data().employeeType); 
    //           console.log(doc.data().employeeType);          
    //         });        
    //       };
    //   }, [checked]))


    //   const handleReturn = () => {
        
    //     if(auth.currentUser?.email == "cincotenedorescocina@gmail.com"){
    //       navigation.replace("ControlPanelCocina")
    //     }
    //     if(auth.currentUser?.email == "cincotenedoresbar@gmail.com"){
    //       navigation.replace("ControlPanelBar")
    //     }
    //   }

    useFocusEffect(
        useCallback(() => {
          console.log(checked);
          if(checked=='Comida'){
            setValue("type",checked);
          }
          if(checked=='Bebida'){
            setValue("type",checked);
          }
      }, [checked]))

      //PERMISOS CAMARA
    useEffect(() => {
        (async () => {
            await Camera.requestCameraPermissionsAsync();
            await BarCodeScanner.requestPermissionsAsync();
        })();
    }, [])

    const handleCamera1 = async () => {
        setLoading(true);
        setImage1(await LanzarCamara());
        setLoading(false)         
      };
    
    const handleCamera2 = async () => {
        setLoading(true);
        setImage2(await LanzarCamara());
        setLoading(false)         
      };
    
    const handleCamera3 = async () => {
        setLoading(true);
        setImage3(await LanzarCamara());
        setLoading(false)         
      };

    const toggleSpinnerAlert = () => {
    setModalSpinnerVisible(true);
    setTimeout(() => {
        setModalSpinnerVisible(false);
    }, 3000);
    };

    const onSubmit = async () => {
        const values=getValues();
        console.log(values);
        let error=false;

        setLoading(true)
        toggleSpinnerAlert();

        if(ValidacionCamposProducto(values, image1, image2, image3) !== false){

            let imageValue1 = "";
            let imageValue2 = "";
            let imageValue3 = "";

            if(image1 && image2 && image3){
                imageValue1 = (await CargarImagen(image1));
                imageValue2 = (await CargarImagen(image2));
                imageValue3 = (await CargarImagen(image3));
            }

            addProducto(imageValue1, imageValue2, imageValue3, values);

            Toast.showWithGravity(
                "Producto creado con éxito",
                Toast.LONG, 
                Toast.CENTER); 

            reset();
            setImage1("");
            setImage2("");
            setImage3("");
            handleReturn();
        }
    }

    const resetForm = () => {
        setName("Nombre del producto");
        setDescription("Descripción del producto");
        setElaborationTime("Tiempo de Elaboración (en minutos)");
        setPrice("Precio");
        setValue("name",'');
        setValue("description",'');
        setValue("elaborationTime",'');
        setValue("price",'');
        setValue("type",'');
        setImage1("");
        setImage2("");
        setImage3("");
      }
    
    return(
        <View style={styles.container}> 
        {loading}
            <View style={styles.cameraQrContainer}>
                {!image1?
                <TouchableOpacity onPress={handleCamera1}>
                    <Image style={styles.cameraIconRow} resizeMode="cover" source={require('../assets/camara.png')} />
                </TouchableOpacity>
                :
                <View>
                    <Image style={styles.cameraImageRow} resizeMode="cover" source={{uri:image1}}/>
                </View>
                }
                {!image2?
                <TouchableOpacity onPress={handleCamera2}>
                    <Image style={styles.cameraIconRow} resizeMode="cover" source={require('../assets/camara.png')} />
                </TouchableOpacity>
                :
                <View>
                    <Image style={styles.cameraImageRow} resizeMode="cover" source={{uri:image2}}/>
                </View>
                }
                {!image3?
                <TouchableOpacity onPress={handleCamera3}>
                    <Image style={styles.cameraIconRow} resizeMode="cover" source={require('../assets/camara.png')} />
                </TouchableOpacity>
                :
                <View>
                    <Image style={styles.cameraImageRow} resizeMode="cover" source={{uri:image3}}/>
                </View>
                }
            </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder={nameForm}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                        onChangeText={(text) => setValue("name",text)}
                    />
                     <TextInput
                        placeholder={descriptionForm}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                        onChangeText={(text) => setValue("description",text)}
                    />
                     <TextInput
                        placeholder={elaborationTimeForm}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                        keyboardType={'numeric'}
                        onChangeText={(text) => setValue("elaborationTime",text)}
                    />
                     <TextInput
                        placeholder={priceForm}
                        style={[styles.buttonRole, styles.buttonOutlineRole]}
                        keyboardType={'numeric'}
                        onChangeText={(text) => setValue("price",text)}
                    />
            </View>
            <View style={styles.buttonContainer} >
                <View style={styles.inputFieldRadioLayout}>
                    <View style={styles.inputFieldRadio}>
                        <RadioButton
                            value="Comida"
                            status={ checked === 'Comida' ? 'checked' : 'unchecked' }
                            onPress={ pressComida }
                        />
                        <Text style={styles.buttonOutlineText}>Comida</Text>               
                    </View>
                    <View style={styles.inputFieldRadio}>
                        <RadioButton
                            value="Bebida"
                            status={ checked === 'Bebida' ? 'checked' : 'unchecked' }
                            onPress={ pressBebida }
                        />
                        <Text style={styles.buttonOutlineText}>Estándar</Text>               
                    </View>
                </View>
            </View>
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
        </View>

    )

}
export default RegistroProducto;
