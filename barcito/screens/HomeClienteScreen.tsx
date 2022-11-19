import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Image, TextInput } from 'react-native';
import { RootStackParamList } from './../App';
import styles from "../styles/Style";
import Toast from 'react-native-simple-toast';


import { auth, db } from "../database/firebase";
import Spinner from "../utils/SpinnerUtil";
import { collection, getDocs, query, where } from 'firebase/firestore';
import EnConstruccionScreen from "../utils/EnConstruccionUtil";
import { addListaDeEspera } from "../utils/AddDocsUtil";

const HomeClienteScreen = () => {

        const navigation = useNavigation<NativeStackNavigationProp<any>>();
        const [loading, setLoading] = useState(false);
        const [data, setData] = useState<any>([]);
        const [clientStatus, setClientStatus] = useState(false);
        const [numeroMesa, setNumeroMesa] = useState("");
        const [mesaStatus, setMesaStatus] = useState("");

 

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

        async function handlerSignOut() {
         await auth
             .signOut()
             .then(() => {navigation.replace("Index")})
             .catch((error: any) => alert(error.message))
        }  

        useFocusEffect(
            useCallback(() => {
               checkClientStatus();
               handlerElegirMesa();
               
               }, []))
      
       const checkClientStatus = async () => {
         const query1 = query(
            collection(db, "userInfo"),
            where("email", "==", auth.currentUser?.email)
            );
        const querySnapshot1 = await getDocs(query1);
        querySnapshot1.forEach(async (doc) => {
            const statusAux = doc.data().clientStatus;
            if(statusAux === 'Accepted')
            {
               setClientStatus(true);
               console.log(clientStatus);
            }
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
               console.log("el estatussssssskhe"+res.status)
               
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

       return (
         <View style={styles.container}>
         {loading?
            <View style={styles.spinContainer}><Spinner/></View>
         : null}
         {<Image
            source={require('../assets/logo.png')}
            resizeMode="contain"
            style={styles.logoHome}
         />}

         {clientStatus ?
               <View style={styles.buttonContainer}> 
                     <TextInput placeholder="Número de mesa"
                        value={numeroMesa}
                        onChangeText={text => setNumeroMesa(text)}
                        style={styles.input}
                     />
         
                  <View style={styles.buttonContainer}> 
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
                  <Text style={styles.textEnEspera}>Espere a que lo acepten para poder continuar.</Text> 
                  <View style={styles.buttonContainer} >   
                     <TouchableOpacity 
                        onPress={handlerSignOut}
                        style={styles.button}
                     >
                        <Text style={styles.buttonText}>Salir</Text>
                     </TouchableOpacity>
                  </View>  
               </View>  
            }                      
         </View>
       );

}

export default HomeClienteScreen;

