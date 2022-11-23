import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Image, TextInput } from 'react-native';
import { RootStackParamList } from './../App';
import styles from "../styles/Style";
import Toast from 'react-native-simple-toast';
import { BarCodeScanner } from "expo-barcode-scanner";



import { auth, db } from "../database/firebase";
import Spinner from "../utils/SpinnerUtil";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { addListaDeEspera } from "../utils/AddDocsUtil";
import { Camera } from "expo-camera";

const HomeClienteScreen = () => {

        const navigation = useNavigation<NativeStackNavigationProp<any>>();
        const [loading, setLoading] = useState(false);
        const [data, setData] = useState<any>([]);
        const [clientStatus, setClientStatus] = useState("Pending");
        const [numeroMesa, setNumeroMesa] = useState("");
        const [mesaStatus, setMesaStatus] = useState("");
        const [motivoRechazo, setMotivoRechazo] = useState("");
        const [scanned, setScanned] = useState(false);
        const [openQR, setOpenQR] = useState(false);

       const backgroundImage = require("../assets/common/background.png");
       const logoutIcon = require("../assets/common/logout.png");
       const userIcon = require("../assets/profiles/client.png");
      const qrIcon = require("../assets/common/qr.png");


        useEffect(() => {
           (async () => {
            await Camera.requestCameraPermissionsAsync();
            await BarCodeScanner.requestPermissionsAsync();
            })();
         }, []);

         const handleOpenQR = () => {
            setScanned(false);
            setOpenQR(true);
          };

      //   const handlerElegirMesa = async () => {
      //    //Chequear si está libre
      //       setLoading(true);
      //       console.log(numeroMesa);
      //       setMesaStatus("");
      //       setData([]);  
      //       try {  
      //       const query1 = query(collection(db, "tableInfo"),where("tableNumber", "==", numeroMesa));
      //       const querySnapshot1 = await getDocs(query1);
      //       querySnapshot1.forEach(async (doc) => {
      //          const res: any = { ...doc.data() };
      //          console.log("res"+res);
      //          console.log ("ahhhhhhh");
      //          const statusAux = doc.data().status;
      //          console.log("mesaEstatusAux "+statusAux);
      //          console.log("numeroMesa "+numeroMesa);

      //                if(statusAux === "free")
      //                {
      //                   addListaDeEspera(auth.currentUser?.email, numeroMesa);
      //                   //EnConstruccionScreen("HomeCliente");
      //                   setTimeout(() => {
      //                      Toast.showWithGravity(
      //                        "MESA RESERVADA. ESTÁS EN LISTA DE ESPERA.",
      //                        Toast.LONG, 
      //                        Toast.CENTER);
      //                    }, 4000); 
      //                }
      //                else{
      
      //                   setTimeout(() => {
      //                      Toast.showWithGravity(
      //                        "MESA OCUPADA. ELIJA OTRA.",
      //                        Toast.LONG, 
      //                        Toast.CENTER);
      //                    }, 4000); 
      //                }
                   
      //            });
      //          }catch (error) {
      //             console.log("ERROR CHEKMESA: "+error)                    
      //         }finally{
      //             setLoading(false);
      //         }

              
                  
      //   }

       //COMPLETADO DEL FORM A PARTIR DEL QR
      const handleBarCodeScanned = ({ data }) => {
      setScanned(true);
      setOpenQR(false);
      const dataSplit = data.split("@");
      const qrType = dataSplit[0];
      console.log(dataSplit);

      // if (qrType === "ingresoLocal") {
      //    addToWaitingList();
      //    //sendPushNotification( {title:"CLIENTE ESPERANDO MESA", description: "Hay un nuevo cliente en la lista de espera"} );
      // } else {
      //    Toast.showWithGravity(
      //       "QR Eroneo. Debe ingresar a la lista de espera",
      //       Toast.LONG,
      //       Toast.CENTER
      //    );
      // }
      };

        async function handlerSignOut() {
         await auth
             .signOut()
             .then(() => {navigation.replace("Index")})
             .catch((error: any) => alert(error.message))
        }  

        useFocusEffect(
            useCallback(() => {
               checkClientStatus();
               //handlerElegirMesa();
         }, []))
      
       const checkClientStatus = async () => {
         const query1 = query(
            collection(db, "userInfo"),
            where("email", "==", auth.currentUser?.email)
            );
         const querySnapshot1 = await getDocs(query1);
         querySnapshot1.forEach(async (doc) => {
            const statusAux = doc.data().clientStatus;
            const motivoRechazoAux = doc.data().rejectedReason;
            setClientStatus(statusAux);
            setMotivoRechazo(motivoRechazoAux);
            if(statusAux === 'Pending')
            {
               navigation.replace("HomeClienteEspera");
               //setClientStatus('Accepted');
               console.log(clientStatus);
               return
            }
            // else if (statusAux === 'Rejected')
            // {
            //    console.log("llega aquíiiiii yyyy?");
            //    navigation.replace("HomeClienteEspera");

            //    return
            // }
        });
       }
         
       
   const handlerElegirMesa = async () => {

         console.log('llega aquí?');
            setLoading(true);    
            setData([]); 
            setMesaStatus("");   
            try {
               if(numeroMesa !== "")
               {
                  console.log(numeroMesa);
               const q = query(collection(db, "tableInfo"), where("tableNumber", "==", numeroMesa));
               console.log(numeroMesa);
               const querySnapshot = await getDocs(q);
               querySnapshot.forEach(async (doc) => {
               const res: any = { ...doc.data()};
               console.log(res);
               
               if(res.status === "free")
                     {
                        addListaDeEspera(auth.currentUser?.email, numeroMesa);
                        setTimeout(() => {
                           Toast.showWithGravity(
                             "MESA RESERVADA. ESTÁS EN LISTA DE ESPERA.",
                             Toast.LONG, 
                             Toast.CENTER);
                         }, 4000); 
                         navigation.replace("Home");
                     }
                     else{
      
                        setTimeout(() => {
                           Toast.showWithGravity(
                             "MESA OCUPADA. ELIJA OTRA.",
                             Toast.LONG, 
                             Toast.CENTER);
                         }, 4000); 
                     }
                  });

               }
               
            } catch (error) {
               console.log("ERROR GETDOCUMENTS: "+error)                    
            }finally{
               setLoading(false);
            }
       }

       return !openQR ?  (
         <View style={styles.container}>
            {loading?
               <View style={styles.spinContainer}><Spinner/></View>
            : null}
            {clientStatus == 'Accepted' ?
               <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleOpenQR}>
                     <Image style={styles.qrIcon} resizeMode="cover" source={qrIcon} />
                  </TouchableOpacity>
                     <View style={styles.inputContainer}> 
                        <TouchableOpacity
                              onPress={handlerElegirMesa}
                              style={styles.button}
                        >
                              <Text style={styles.buttonText}>Elegir Mesa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                           onPress={handlerSignOut}
                           style={styles.button}
                        >
                           <Text style={styles.buttonText}>Salir</Text>
                        </TouchableOpacity>
                     </View>
               </View>            
            :
               <View style={styles.buttonContainer}>
                  <Image style={styles.logoHomeDos} resizeMode="contain" source={require('../assets/logo.png')} />
                  <View style={styles.buttonContainer}>    
                     {clientStatus == 'Pendent'? 
                     <Text style={styles.textEnEspera}>Espere a que lo acepten para poder continuar.</Text> 
                     : 
                     <Text style={styles.textHomeMedianoDos}>Su petición fue rechazada.{"\n"}Motivo: {motivoRechazo}</Text> 
                     } 
                        <TouchableOpacity 
                           onPress={handlerSignOut}
                           style={styles.button}
                        >
                           <Text style={styles.buttonText}>Salir</Text>
                        </TouchableOpacity>
                  </View>
               </View>  
            }                     
         </View> )
         : (
         <View>
            <BarCodeScanner
               onBarCodeScanned={scanned && openQR ? undefined : handleBarCodeScanned}
               style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.textEnEspera}>Espere a que lo acepten para poder continuar.</Text> 
         </View>
         );

      
   
}

export default HomeClienteScreen;


