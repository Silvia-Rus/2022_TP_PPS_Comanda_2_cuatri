
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "../../styles/Style";

import { Image, Text, TouchableOpacity, View, ScrollView, TextInput} from "react-native";
import Modal from "react-native-modal";
import React, { useCallback,  useState } from 'react'
import Spinner from "../../utils/SpinnerUtil";
import { db, storage } from "../../database/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref } from 'firebase/storage'
import { format } from 'date-fns'
import insertarToast from "../../utils/ToastUtil";
import { cambioClienteASentado, cambioClienteARejected, cambioClienteAAccepted, cambioClienteAWaiting } from "../../utils/ManejoEstadosClienteUtil";
import { cambioClienteMesaAAsignada } from "../../utils/ManejoEstadosClienteMesaUtil";
import { addClienteMesa } from "../../utils/AddDocsUtil";
import { cambioMesaAOcupada } from "../../utils/ManejoEstadosMesaUtil";
import { sendPushNotification } from "../../utils/PushNotificationUtil";



const GestionClientesMetreScreen = () => {

  //CONSTANTES
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isModalCancelVisible, setModalCancelVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [rejectMotive, setRejectMotive] = useState('');
  const [idCliente, setIdCliente] = useState('');
  const [mailCliente, setMailCliente] = useState('');
  const [idMesa, setIdMesa] = useState('');
  const [numeroMesa, setNumeroMesa] = useState('');

  const confirmIcon = require("../../assets/confirm.png");
  const cancelIcon = require("../../assets/cancel.png");
  

  //RETURN
  const handleReturn = () => {
    navigation.replace("HomeMetre");
  }

  //REFRESH DE LA DATA
  useFocusEffect(
    useCallback(() => {
        getDocuments();
  }, []))

  //TOOGLE CANCEL USER
  const toggleModalCancel = () => {
    setModalCancelVisible(!isModalCancelVisible);
  };

  //GET DATA
  const getDocuments = async () => {
    setLoading(true);    
    setData([]);    
    try {
      const q = query(collection(db, "userInfo"), where("clientStatus", "==", "Waiting"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const res: any = { ...doc.data(), id: doc.id };
        const imageUrl = await getDownloadURL(ref(storage, res.image));
        setData((arr: any) => [...arr, { ...res, id: doc.id, imageUrl: imageUrl}].sort((a, b) => (a.creationDate < b.creationDate ? 1 : a.creationDate > b.creationDate ? -1 : 0)));
      });
    } catch(error){console.log("ERROR GETDOCUMENTS: "+error)                    
    } finally{setLoading(false);}
  }

  //Asigna la mesa
  const handleConfirm = async (id, mail) => {
    try {
      setLoading(true);
      toggleModalCancel();
      setIdCliente(id);
      setMailCliente(mail);
      getDocuments();

    } catch (error) { console.log(error) } 
      finally{ setLoading(false); }
  } 

  const handleCancel = async (id) => {
    toggleModalCancel();      
  }

  const completeConfirmacion = async () => {
    try{
      setLoading(true);
      const q = query(collection(db, "tableInfo"), where("tableNumber", "==", numeroMesa));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (item) =>{
         const statusMesaAux = item.data().status;
         const q2 = query(collection(db, "userInfo"), where("email", "==", mailCliente));
         const querySnapshot2 = await getDocs(q2);
         querySnapshot2.forEach(async (item2) =>{
            const idClienteAux = item2.id;
            if(statusMesaAux === 'free'){
               //SI ESTÁ LIBRE LA MESA
               //meterlo en la lista de espera
               addClienteMesa(idClienteAux, mailCliente, numeroMesa, "Asignada");
               //cambiar el status de la mesa a ocupada
               cambioMesaAOcupada(item.id);
               //cambiar el status del cliente
               cambioClienteASentado(idClienteAux);
               //toast
               insertarToast("Mesa asignada.")
               getDocuments();
               toggleModalCancel();
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
  

  return (
    <View style={styles.container} >
        {loading?
          <View style={styles.spinContainer}><Spinner/></View>
        : null}
        <View style={styles.buttonContainerArriba} >
          <Text style={styles.textHomePequeño}>Lista de espera</Text> 
          <View style={styles.buttonContainer} >
                      <TouchableOpacity
                          onPress={handleReturn}
                          style={[styles.buttonRole, styles.buttonOutlineRole]}
                      >
                          <Text style={styles.buttonOutlineTextRole}>Volver</Text>
                      </TouchableOpacity>
          </View>
        </View>
        <View style={styles.body}>
          <ScrollView>
            {data.map((item: { imageUrl: any;
                               email: any;       
                               name: any; 
                               lastName: any; 
                               dni: any;
                               creationDate: {toDate: () => Date; }; votes: string | any[]; voted: any; 
                               id: string;}) => (               
              <View style={styles.cardStyle}>
                <View style={styles.imageIconContainer}>
                  <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl }} />
                  <TouchableOpacity onPress={() => handleConfirm(item.id, item.email)}>
                      <Image source={confirmIcon} style={styles.cardIcon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleCancel(item.id)}>
                      <Image source={cancelIcon} style={styles.cardIcon} />
                  </TouchableOpacity>
                </View> 
                <View>      
                  {/* <Text style={styles.tableHeaderText}>-----------------------------------------------------</Text>                       */}
                  {item.email !== undefined ?
                        <Text style={styles.tableHeaderText}> CORREO: {item.email}</Text> 
                  : null}
                  {item.name !== undefined ?
                         <Text style={styles.tableCellText}> NOMBRE: {item.name}</Text>
                  : null}
                  {item.lastName !== undefined ?
                        <Text style={styles.tableCellText}> APELLIDO: {item.lastName}</Text>
                  : null}
                  {item.dni!== undefined ?
                        <Text style={styles.tableCellText}> DNI: {item.dni}</Text>
                  : null}
                  {/* <Text style={styles.tableCellText}> CREACIÓN: {format(item.creationDate.toDate(), 'dd/MM/yyyy HH:mm:ss')} hs</Text> */}
                  {/* <Text style={styles.tableHeaderText}>-----------------------------------------------------</Text>                       */}
                </View>

                <Modal backdropOpacity={0.5} isVisible={isModalCancelVisible}>
                  <View style={styles.modalContainer}>              
                      <View style={styles.modalBody}>
                        <View style={styles.inputField}>
                          <TextInput
                            placeholder= "Mesa"
                            placeholderTextColor="white"
                            multiline
                            numberOfLines={4}
                            keyboardType={'numeric'}
                            style={styles.inputText}
                            onChangeText={(text) => setNumeroMesa(text)}
                            secureTextEntry = {true}
                          />
                        </View>
                        <View style={styles.buttonContainer} >
                          <TouchableOpacity
                            onPress={() => completeConfirmacion()}
                            style={[styles.buttonRole, styles.buttonOutlineRole]}
                          >
                            <Text style={styles.buttonOutlineTextRole}>Asignar mesa</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                              onPress={toggleModalCancel}
                              style={[styles.buttonRole, styles.buttonOutlineRole]}
                          >
                              <Text style={styles.buttonOutlineTextRole}>Volver</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                  </View>
                </Modal>
                
              </View>              
            ))}
          </ScrollView> 
        </View> 
      {/* 
        <View>
          <Modal backdropOpacity={0.5} animationIn="rotate" animationOut="rotate" isVisible={isModalSpinnerVisible}>
          </Modal>
        </View> */}
        </View> 
  );
};

export default GestionClientesMetreScreen;

