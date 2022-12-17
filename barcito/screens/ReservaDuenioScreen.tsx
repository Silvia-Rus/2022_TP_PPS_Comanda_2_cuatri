
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "../styles/Style";

import { Image, Text, TouchableOpacity, View, ScrollView, TextInput} from "react-native";
import Modal from "react-native-modal";
import React, { useCallback,  useState } from 'react'
import Spinner from "../utils/SpinnerUtil";
import { db, storage } from "../database/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref } from 'firebase/storage'
import { format } from 'date-fns'
import emailjs from '@emailjs/browser';
import insertarToast from "../utils/ToastUtil";
import { cambioReservaAceptada, cambioReservaARechazada  } from "../utils/ManejoEstadosReservaUtil";
import { cambioClienteAAccepted, cambioClienteASentado } from "../utils/ManejoEstadosClienteUtil";
import { addClienteMesa } from "../utils/AddDocsUtil";
import { cambioMesaAOcupada, cambioMesaAReservada } from "../utils/ManejoEstadosMesaUtil";



const ClientManagment = () => {

  //CONSTANTES
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isModalCancelVisible, setModalCancelVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [idMesa, setIdMesa] = useState('');
  const [reservaId, setReservaId] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [clienteMail, setClienteMail] = useState('');

  const confirmIcon = require("../assets/confirm.png");
  const cancelIcon = require("../assets/cancel.png");
  

  //RETURN
  const handleReturn = () => { navigation.replace("HomeDuenio"); }

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
      const q = query(collection(db, "Reservas"), where("status", "==", "activa"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const res: any = { ...doc.data(), id: doc.id };
        const imageUrl = await getDownloadURL(ref(storage,res.imageCliente));
        setData((arr: any) => [...arr, { ...res, id: doc.id, imageUrl: imageUrl}].sort((a, b) => (a.creationDate < b.creationDate ? 1 : a.creationDate > b.creationDate ? -1 : 0)));
      });
    } catch(error){console.log("ERROR GETDOCUMENTS: "+error)                    
    } finally{setLoading(false);}
  }

  //MANEJADORES DE ACEPTAR / RECHAZAR USUARIO
  const handleConfirm = async (idReserva, idCliente, mailCliente) => {
    try {
        setLoading(true);
        toggleModalCancel();
        setReservaId(idReserva);
        setClienteId(idCliente);
        setClienteMail(mailCliente);
        getDocuments();
    } catch (error) { console.log(error) } 
      finally{ setLoading(false); }
  } 

  const handleCancel = async (id) => {
    cambioReservaARechazada(id);
    getDocuments();
    insertarToast("Reserva rechazada.");
  }
  
  const completeConfirmacion = async () => {
    try {
      setLoading(true);
      const q4 = query(collection(db, "tableInfo"), where("tableNumber", "==", idMesa));
      const querySnapshot4 = await getDocs(q4);
      querySnapshot4.forEach(async (doc) => {
          
            cambioReservaAceptada(reservaId, doc.id, doc.data().tableNumber); 
            cambioMesaAReservada(doc.id); 
            insertarToast("Reserva aceptada");
            toggleModalCancel();

      });
  
      getDocuments();
      //toggleSpinnerAlert();
    } catch (error) { console.log(error) } 
      finally{ setLoading(false);}
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
            {data.map((item: { apellidoCliente: any;
                               fechaReserva: any;       
                               horaReserva: any; 
                               imageCliente: any; 
                               mailCliente: any;
                               nombreCliente: any;
                               idCliente: any;
                               imageUrl: any,
                               creationDate: {toDate: () => Date; }; votes: string | any[]; voted: any; 
                               id: string;}) => (               
              <View style={styles.cardStyle}>
                <View style={styles.imageIconContainer}>
                  <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl }} />
                  <TouchableOpacity onPress={() => handleConfirm(item.id, item.idCliente, item.mailCliente)}>
                      <Image source={confirmIcon} style={styles.cardIcon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleCancel(item.id)}>
                      <Image source={cancelIcon} style={styles.cardIcon} />
                  </TouchableOpacity>
                </View> 
                <View>      
                  {/* <Text style={styles.tableHeaderText}>-----------------------------------------------------</Text>                       */}
                  <Text style={styles.tableHeaderText}> CORREO: {item.mailCliente}</Text> 
                  <Text style={styles.tableCellText}> {item.nombreCliente} {item.apellidoCliente} </Text>
                  <Text style={styles.tableCellText}> Fecha: {item.fechaReserva}. Hora: {item.horaReserva}</Text>
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
                            onChangeText={(text) => setIdMesa(text)}
                            secureTextEntry = {true}
                          />
                        </View>
                        <View style={styles.buttonContainer} >
                          <TouchableOpacity
                            onPress={() => completeConfirmacion()}
                            style={[styles.buttonRole, styles.buttonOutlineRole]}
                          >
                            <Text style={styles.buttonOutlineTextRole}>Aceptar reserva</Text>
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
        </View> 
  );
};

export default ClientManagment;

