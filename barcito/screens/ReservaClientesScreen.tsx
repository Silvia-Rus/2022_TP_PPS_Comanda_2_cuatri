import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Image, TextInput } from 'react-native';
import { RootStackParamList } from '../App';
import styles from "../styles/Style";
import { auth, db } from "../database/firebase";
import Spinner from "../utils/SpinnerUtil";
import { doc, collection, getDocs, query, where, updateDoc, QuerySnapshot } from 'firebase/firestore';
import { AddReserva } from "../utils/AddDocsUtil";
import { Camera } from "expo-camera";
import insertarToast from "../utils/ToastUtil";
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker'
import { format } from "date-fns";
import { sendPushNotification } from "../utils/PushNotificationUtil";



const ReservaClientesScreen = () => {

      const navigation = useNavigation<NativeStackNavigationProp<any>>();
      const [loading, setLoading] = useState(false);
      const [idCliente, setIdCliente] = useState("");
      const [nombreCliente, setNombreCliente] = useState("");
      const [apellidoCliente, setApellidoCliente] = useState("");
      const [mailCliente, setMailCliente] = useState("");
      const [imageCliente, setImageCliente] = useState("");

      const [dateString, setDateString] = useState("");
      const [date, setDate] = useState(new Date(1598051730000));
      const [hora, setHora] = useState(new Date(1598051730000));
      const [horaString, setHoraString] = useState("");


      const [mode, setMode] = useState('date');
      const [showCal, setShowCal] = useState(false);
      const [showHora, setShowHora] = useState(false);

    const onChangeCal = (event, selectedDate) => {
            const currentDate = selectedDate;
            //console.log(currentDate);
            var formattedDate = format(currentDate, "dd-MM-yyyy");
            console.log(formattedDate);
            setDate(currentDate);
            setDateString(formattedDate);
            setShowCal(false);
            setShowHora(false);
       
    };

    const onChangeHora = (event, selectedDate) => {
        const currentHora = selectedDate;
        console.log("currenthora" + currentHora);
        var formattedHora = format(currentHora, "H:mma");
        console.log(formattedHora);
        // setDate(currentDate);
        setHoraString(formattedHora);
        setShowCal(false);
        setShowHora(false);
    };

    const showDatepicker = () => {
        setShowCal(true);
    };

    const showTimepicker = () => {
        setShowHora(true);
      };
    
    useFocusEffect(
            useCallback(() => {
               getDatosCliente();
        }, []))

    const getDatosCliente = async () => {
        try{
        setLoading(true);
        const q = query(collection(db, "userInfo"), where("email", "==", auth.currentUser?.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (item) =>{
            setIdCliente(item.id);
            setMailCliente(item.data().email);
            setNombreCliente(item.data().name);
            setApellidoCliente(item.data().lastName);
            setImageCliente(item.data().image);
        });
        }catch(error){console.log("ERROR CHEQUEANDO LOS DATOS DEL CLIENTE: "+error)                    
        }finally{setLoading(false);}
    }

    const handlerConfirmarReserva = async () => { 
        //addReserva
        AddReserva(idCliente, mailCliente, nombreCliente, apellidoCliente,imageCliente, dateString, horaString);
        insertarToast("Reserva el día: "+dateString+" a las "+horaString);
        sendPushNotification( {title:"NUEVA RESERVA", description:"Hay una nueva reserva "});
      }

      async function handlerSignOut() {
         await auth
             .signOut()
             .then(() => {navigation.replace("Index")})
             .catch((error: any) => alert(error.message))
        }  

       return (
         <View style={styles.container}>
            {loading?
               <View style={styles.spinContainer}><Spinner/></View>
            : null}
               <View style={styles.buttonContainer}>
               <Text style={styles.textHomeMedianoDos}>Haga su reserva</Text> 

               {<Image
                    source={require('../assets/LOGOS/cubiertos_cuadrado.png')}
                    resizeMode="contain"
                    style={styles.logoHome}
                />}
                
                <View style={styles.inputContainer}> 
                    <TouchableOpacity 
                        onPress={showDatepicker}
                        style={styles.button}
                        >
                        <Text style={styles.buttonText}>Elegir fecha</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={showTimepicker}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Elegir hora</Text>
                    </TouchableOpacity>
                </View>
                {showCal ? 
                    <View>
                        <DateTimePicker
                        mode = 'date'
                        themeVariant="dark"
                        value={date}
                        minimumDate={new Date()}
                        onChange={onChangeCal}
                        />
                    </View>
                :null}

                {showHora ? 
                    <View>
                        <DateTimePicker
                        mode = 'time'
                        value={hora}
                        minuteInterval={30}
                        onChange={onChangeHora}
                        />
                     </View>
                :null}
                 {dateString ?
                  <Text style={styles.textHomePequeñoCentrado}>Fecha Elegida: {dateString}</Text> 
                  : null}
                  {horaString ?
                  <Text style={styles.textHomePequeñoCentrado}>Hora: {horaString}</Text> 
                  : null} 
                     <View style={styles.inputContainer}> 
                        <TouchableOpacity 
                           onPress={handlerConfirmarReserva}
                           style={[styles.buttonRole, styles.buttonOutlineRole]}
                        >
                           <Text style={styles.buttonText}>Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                           onPress={handlerSignOut}
                           style={[styles.buttonRole, styles.buttonOutlineRole]}
                        >
                           <Text style={styles.buttonText}>Salir</Text>
                        </TouchableOpacity>
                     </View>
               </View> 
        </View>);
}         
                           
export default ReservaClientesScreen;


