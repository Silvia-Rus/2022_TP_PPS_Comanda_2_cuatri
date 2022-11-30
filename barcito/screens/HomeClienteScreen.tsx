import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Image, TextInput } from 'react-native';
import { RootStackParamList } from './../App';
import styles from "../styles/Style";
import { BarCodeScanner } from "expo-barcode-scanner";
import { auth, db } from "../database/firebase";
import Spinner from "../utils/SpinnerUtil";
import { doc, collection, getDocs, query, where, updateDoc, QuerySnapshot } from 'firebase/firestore';
import { addClienteMesa } from "../utils/AddDocsUtil";
import { Camera } from "expo-camera";
import insertarToast from "../utils/ToastUtil";
import cambioMesaAOcupada from "../utils/ManejoEstadosMesaUtil";
import { cambioClienteAWaiting, cambioClienteARejected, cambioClienteAAccepted } from "../utils/ManejoEstadosClienteUtil";



const HomeClienteScreen = () => {

      const navigation = useNavigation<NativeStackNavigationProp<any>>();
      const [loading, setLoading] = useState(false);
      const [data, setData] = useState<any>([]);
      const [clientStatus, setClientStatus] = useState("");
      const [numeroMesa, setNumeroMesa] = useState("");
      const [mesaStatus, setMesaStatus] = useState("");
      const [motivoRechazo, setMotivoRechazo] = useState("");
      const [scanned, setScanned] = useState(false);
      const [openQR, setOpenQR] = useState(false);
      const [tienePedidos, setTienePedidos] = useState(false);
      const [dataNumeroConfirmados, setDataNumeroConfirmados] = useState(0);

      const qrIcon = require("../assets/common/qr.png");

      useEffect(() => {
         (async () => {
            await Camera.requestCameraPermissionsAsync();
            await BarCodeScanner.requestPermissionsAsync();
            })();
         }, []);
      
      useFocusEffect(
            useCallback(() => {
               getTienePedidos();
               getPedidoConfirmado();
        }, []))

      const handleOpenQR = () => {
         setScanned(false);
         setOpenQR(true);
         };
      
      const handleChat = () => {
        navigation.replace("Chat");
      }

      const handleMenu = () => {
         navigation.replace("Menu");
      }

      const handleJuegos = () => {
         insertarToast("ir a juegos");
      }

      const handleEstadisticas = () => {
         navigation.replace("EstadisticasEncuestaCliente");
      }

      const handleEncuesta = async () => {
         setLoading(true);
         const q = query(collection(db, "clienteMesa"), where("mailCliente", "==", auth.currentUser?.email));
         const querySnapshot = await getDocs(q);
         querySnapshot.forEach(async (doc) => {
            if(doc.data().status == "Encuestada")
            {
               insertarToast("Ya ha realizado la encuesta.");
            }
            else if(doc.data().status == "Asignada")
            {
               navigation.replace("EncuestaCliente");
            }
         });
         setLoading(false);
      }
      const handlePedido = () => {
            navigation.replace("GestionPedidosCliente");
      }

      const handlePedirCuenta = () => {
         insertarToast("Pedir cuenta");
      }

      const getTienePedidos = async () => {
         try{
            const q = query(collection(db, "pedidos"), where("mailCliente", "==", auth.currentUser?.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (item) =>{
               if(item.data().status != "Inactivo")
               {
                  setTienePedidos(true);
                  return
               }
            });
         }catch(error){console.log("ERROR CHEQUEANDO SI HAY PEDIDOS: "+error)                    
         }finally{setLoading(false);}

      }

      const getPedidoConfirmado = async () => {
         setLoading(true); 
         setDataNumeroConfirmados(0);   
         try {
         const q = query(collection(db, "pedidos"), where("mailCliente", "==", auth.currentUser?.email));
         const querySnapshot = await getDocs(q);
         querySnapshot.forEach(async (doc) => {
             if(doc.data().status == "Confirmado")
             {
                 setDataNumeroConfirmados(querySnapshot.size);     
             }
         });
         } catch(error){console.log("ERROR GETPEDIDOCONFIRMADO: "+error)                    
         } finally{setLoading(false);}
     }

      const handleBarCodeScanned = async ({ data }) => {
         setScanned(true);
         setOpenQR(false);
         const dataSplit = data.split("@");
         const qrType = dataSplit[0];
         const numeroMesa = dataSplit[1];
         console.log(qrType);
         console.log(numeroMesa);
         if(qrType === 'mesa'){
            try{
               setLoading(true);
               const q = query(collection(db, "tableInfo"), where("tableNumber", "==", numeroMesa));
               const querySnapshot = await getDocs(q);
               querySnapshot.forEach(async (item) =>{
                  const statusMesaAux = item.data().status;
                  const q2 = query(collection(db, "userInfo"), where("email", "==", auth.currentUser?.email));
                  const querySnapshot2 = await getDocs(q2);
                  querySnapshot2.forEach(async (item2) =>{
                     const idClienteAux = item2.id;
                     if(statusMesaAux === 'free'){
                        //SI ESTÁ LIBRE LA MESA
                        //meterlo en la lista de espera
                        addClienteMesa(idClienteAux, auth.currentUser?.email, numeroMesa, "enEspera");
                        //cambiar el status de la mesa a ocupada
                        cambioMesaAOcupada(item.id);
                        //cambiar el status del cliente
                        cambioClienteAWaiting(idClienteAux);
                        //toast
                        insertarToast("Estás en lista de espera. Espera a que te asignen la mesa.")
                        //va a la botonera pero solo algunos botones
                        checkClientStatus();

                     }
                     else{
                        //NO ESTÁ LIBRE LA MESA
                        insertarToast("Esta mesa no está libre. Elija otra.")
                     }
                  
                  })
               });
        
            }catch(error){console.log("ERROR CHEQUEANDO ESTATUS DE LA MESA: "+error)                    
            }finally{setLoading(false);}
         }
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
         }, []))
      
      const checkClientStatus = async () => {
         setLoading(true);
         if(auth.currentUser?.email === undefined)
         {
            setClientStatus("Accepted");
            setLoading(false);
         }
         else
         {
            const query1 = query(collection(db, "userInfo"),where("email", "==", auth.currentUser?.email));
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
                  setLoading(false);
                  return
               }
           });
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
                  <Text style={styles.textHomeMedianoDos}>Escanee el QR de la mesa</Text> 
                  <TouchableOpacity onPress={handleOpenQR}>
                     <Image style={styles.qrIcon} resizeMode="cover" source={qrIcon} />
                  </TouchableOpacity>
                     <View style={styles.inputContainer}> 
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
                  <View style={styles.inputContainer}>    

                     {clientStatus == 'Pendent'? 
                     <Text style={styles.textEnEspera}>Espere a que lo acepten para poder continuar.</Text> 
                     : 
                     <View>
                        {clientStatus == 'Rejected'? 
                        <Text style={styles.textHomeMedianoDos}>Su petición fue rechazada.{"\n"}Motivo: {motivoRechazo}</Text>
                        :
                           <View>
                              <TouchableOpacity
                              onPress={handleMenu}
                              style={[styles.buttonRole, styles.buttonOutlineRole]}
                              >
                                 <Text style={styles.buttonOutlineTextRole}>Menú</Text>
                              </TouchableOpacity> 
                              {tienePedidos ?  
                              <TouchableOpacity
                              onPress={handlePedido}
                              style={[styles.buttonRole, styles.buttonOutlineRole]}
                              >
                                 <Text style={styles.buttonOutlineTextRole}>Ver estado del pedido</Text>
                              </TouchableOpacity> 
                              :null}
                               {dataNumeroConfirmados > 0 ?  
                              <TouchableOpacity
                              onPress={handlePedirCuenta}
                              style={[styles.buttonRole, styles.buttonOutlineRole]}
                              >
                                 <Text style={styles.buttonOutlineTextRole}>Pedir la cuenta</Text>
                              </TouchableOpacity> 
                              :null}
                           </View>                      
                        }
                        {clientStatus == 'Sentado'? 
                           <TouchableOpacity
                           onPress={handleChat}
                           style={[styles.buttonRole, styles.buttonOutlineRole]}
                           >
                              <Text style={styles.buttonOutlineTextRole}>Hablar con el mozo</Text>
                           </TouchableOpacity>
                        :null}
                        {tienePedidos ? 
                           <View>
                              <TouchableOpacity
                              onPress={handleJuegos}
                              style={[styles.buttonRole, styles.buttonOutlineRole]}
                              >
                                 <Text style={styles.buttonOutlineTextRole}>Jugar</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                              onPress={handleEncuesta}
                              style={[styles.buttonRole, styles.buttonOutlineRole]}
                              >
                                 <Text style={styles.buttonOutlineTextRole}>Hacer encuesta</Text>
                              </TouchableOpacity> 
                            </View>  
                        :null}
                           <TouchableOpacity
                              onPress={handleEstadisticas}
                              style={[styles.buttonRole, styles.buttonOutlineRole]}
                              >
                                 <Text style={styles.buttonOutlineTextRole}>Estadísticas</Text>
                           </TouchableOpacity>
                          
                     </View> 
                     } 
                        {/* <View style={styles.inputContainer}> */}

                        <TouchableOpacity 
                           onPress={handlerSignOut}
                           style={styles.button}
                        >
                           <Text style={styles.buttonText}>Salir</Text>
                        </TouchableOpacity>
                        {/* </View> */}
                  </View>
               </View>  
            }                     
         </View> )
         : (
         <View style={styles.container}>
            <BarCodeScanner
               onBarCodeScanned={scanned && openQR ? undefined : handleBarCodeScanned}
               style={StyleSheet.absoluteFillObject}
            />
         </View>
         );
}

export default HomeClienteScreen;


