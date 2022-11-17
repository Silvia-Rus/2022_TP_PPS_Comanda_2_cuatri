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
import { addMesa } from "../utils/AddDocsUtil";
import LanzarCamara from "../utils/CameraUtil";
import ValidacionCamposMesa from "../utils/ValidacionCamposMesa";
import CargarImagen from "../utils/CargarImagenUtil";


type NewTable = {
    number:string;
    capacity:string;
    type:string;
  }

const RegistroMesaScreen = () => {

      //CONSTANTES
      const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
      const [numberForm, setNumber] = useState("Numero de Mesa");
      const [capacityForm, setCapacity] = useState("Cantidad de Comensales");
      const {getValues, formState:{}, reset, setValue} = useForm<NewTable>();
      const [image, setImage] = useState("");
      const [loading, setLoading] = useState(false);
      const [placeholderColor, setPlaceholderColor] = useState("white");
      const [isModalSpinnerVisible, setModalSpinnerVisible] = useState(false);
      const [checked, setChecked] = React.useState('Estandar');

      const handleReturn = () => {
        navigation.replace("Home")
      }

      const handlerBack = () => {
        navigation.replace('Index');
      }

      const toggleSpinnerAlert = () => {
        setModalSpinnerVisible(true);
        setTimeout(() => {
            setModalSpinnerVisible(false);
        }, 3000);
        };

      //PERMISOS CAMARA
      useEffect(() => {
        (async () => {
            await Camera.requestCameraPermissionsAsync();
            await BarCodeScanner.requestPermissionsAsync();
        })();
      }, [])  

      const resetForm = () => {
        setCapacity("Numero de Comensales");
        setNumber("Numero de Mesa");
        setValue("number", "");
        setValue("capacity", "");
        setValue("type",'');
        setImage("");
      }

    //MANEJADORES RADIOBUTTONS
     const pressDiscapacitados = () => {
        setChecked('Discapacitados');
      }
  
     const pressVip = () => {
        setChecked('VIP');
      }
  
     const pressEstandar = () => {
        setChecked('Estandar');
      }
    
    //CARGA CAMPOS SEGUN SELECCION RADIO BUTTON
    useFocusEffect(
        useCallback(() => {
          console.log(checked);
          if(checked=='Discapacitados'){
            setValue("type",checked);
          }
          if(checked=='VIP'){
            setValue("type",checked);
          }
          if(checked=='Estandar'){
            setValue("type",checked);
          }
      }, [checked]))  

     const handleCamera = async () => {
        setLoading(true);
        setImage(await LanzarCamara());
        setLoading(false)         
      };

      const onSubmit = async () => {

        const values=getValues();
        console.log(values);
        let error=false;

        setLoading(true)
        toggleSpinnerAlert();

        if(ValidacionCamposMesa(values, image) !== false)
        {
            const q = query(collection(db, "tableInfo"), where("tableNumber", "==", values.number));
            const querySnapshot = await getDocs(q);

            if(querySnapshot.size > 0){
            Toast.showWithGravity(
                "El numero de mesa ya existe",
                Toast.LONG, 
                Toast.CENTER);
            toggleSpinnerAlert();
            setLoading(false);
            resetForm();  
            return;        
            } 
            let imageValue = "";
            if(image){
                imageValue = (await CargarImagen(image));
              }
            addMesa(imageValue, values, checked);
            handleReturn();
        }
        reset();
        setImage("");
        setLoading(false);
        resetForm(); 
     }
    
     return (
        <View style={styles.container}> 
        {loading}
            <View style={styles.buttonContainer}>
                <View style={styles.cameraQrContainer}>
                {!image?
                    <TouchableOpacity onPress={handleCamera}>
                    <Image style={styles.cameraIcon} resizeMode="cover" source={require('../assets/camara.png')} />
                    </TouchableOpacity> 
                    :
                    <View>
                    <Image style={styles.cameraImage} resizeMode="cover" source={{uri:image}}/>
                    </View>
                }
                </View> 
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder={numberForm}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                    onChangeText={(text) => setValue("number",text)}
                />
                <TextInput
                    placeholder={capacityForm}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                    onChangeText={(text) => setValue("capacity",text)}
                />
            </View>
            <View style={styles.buttonContainer} >
                <View style={styles.inputFieldRadioLayout}>
                    <View style={styles.inputFieldRadio}>
                        <RadioButton
                            value="Estándar"
                            status={ checked === 'Estandar' ? 'checked' : 'unchecked' }
                            onPress={ pressEstandar }
                        />
                        <Text style={styles.buttonOutlineText}>Estándar</Text>               
                    </View>
                </View>
                <View style={styles.inputFieldRadioLayout}>
                    <View style={styles.inputFieldRadio}>
                        <RadioButton
                            value="VIP"
                            status={ checked === 'VIP' ? 'checked' : 'unchecked' }
                            onPress={ pressVip }
                        />
                        <Text style={styles.buttonOutlineText}>VIP</Text>               
                    </View>
                </View>
                <View style={styles.inputFieldRadioLayout}>
                    <View style={styles.inputFieldRadio}>
                        <RadioButton
                            value="Discapacitados"
                            status={ checked === 'Discapacitados' ? 'checked' : 'unchecked' }
                            onPress={ pressDiscapacitados }
                        />
                        <Text style={styles.buttonOutlineText}>Discapacitados</Text>               
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

export default RegistroMesaScreen;
