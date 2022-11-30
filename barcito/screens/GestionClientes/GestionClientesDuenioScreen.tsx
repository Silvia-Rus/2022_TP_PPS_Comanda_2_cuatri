
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
import emailjs from '@emailjs/browser';
import insertarToast from "../../utils/ToastUtil";
import { cambioClienteAPending, cambioClienteARejected, cambioClienteAAccepted } from "../../utils/ManejoEstadosClienteUtil";



const ClientManagment = () => {

  //CONSTANTES
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isModalCancelVisible, setModalCancelVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [rejectMotive, setRejectMotive] = useState('');
  const [rejectId, setRejectId] = useState('');

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
      const q = query(collection(db, "userInfo"), where("clientStatus", "==", "Pending"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const res: any = { ...doc.data(), id: doc.id };
        const imageUrl = await getDownloadURL(ref(storage, res.image));
        setData((arr: any) => [...arr, { ...res, id: doc.id, imageUrl: imageUrl}].sort((a, b) => (a.creationDate < b.creationDate ? 1 : a.creationDate > b.creationDate ? -1 : 0)));
      });
    } catch(error){console.log("ERROR GETDOCUMENTS: "+error)                    
    } finally{setLoading(false);}
  }

  //MANEJADORES DE ACEPTAR / RECHAZAR USUARIO
  const handleConfirm = async (id, mail) => {
    try {
      setLoading(true);
      cambioClienteAAccepted(id);
      handleAcceptEmail(mail);
      getDocuments();
      insertarToast("Cliente aprobado.");
    } catch (error) { console.log(error) } 
      finally{ setLoading(false); }
  } 

  const handleCancel = async (id) => {
    setRejectId(id);
    toggleModalCancel();      
  }
  
  const completeReject = async (mail) => {
    try {
      setLoading(true);
      cambioClienteARejected(rejectId, rejectMotive);
      toggleModalCancel();
      handleRejectEmail(mail,rejectMotive);      
      getDocuments();
      //toggleSpinnerAlert();
      setTimeout(() => { insertarToast("Cliente rechazado.")}, 4000);      
    } catch (error) { console.log(error) } 
      finally{ setLoading(false);}
  }

  //MANEJADORES DE ENVIAR CORREO
  const handleAcceptEmail = (mail) => {
    emailjs.send("service_agvubrf","template_9207la9",{
      to_name: mail,
      }, 'B503gv6hA_xtZPpgT');
  }

  const handleRejectEmail = (mail, reason) => {
    emailjs.send("service_agvubrf","template_628y1sz",{
      to_name: mail,
      motive: reason,
      }, 'B503gv6hA_xtZPpgT');
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
                  <Text style={styles.tableHeaderText}> CORREO: {item.email}</Text> 
                  <Text style={styles.tableCellText}> NOMBRE: {item.name}</Text>
                  <Text style={styles.tableCellText}> APELLIDO: {item.lastName}</Text>
                  <Text style={styles.tableCellText}> DNI: {item.dni}</Text>
                  {/* <Text style={styles.tableCellText}> CREACIÓN: {format(item.creationDate.toDate(), 'dd/MM/yyyy HH:mm:ss')} hs</Text> */}
                  {/* <Text style={styles.tableHeaderText}>-----------------------------------------------------</Text>                       */}
                </View>

                <Modal backdropOpacity={0.5} isVisible={isModalCancelVisible}>
                  <View style={styles.modalContainer}>              
                      <View style={styles.modalBody}>
                        <View style={styles.inputField}>
                          <TextInput
                            placeholder= "Motivo de Rechazo"
                            placeholderTextColor="white"
                            multiline
                            numberOfLines={4}
                            style={styles.inputText}
                            onChangeText={(text) => setRejectMotive(text)}
                            secureTextEntry = {true}
                          />
                        </View>
                        <View style={styles.buttonContainer} >
                          <TouchableOpacity
                            onPress={() => completeReject(item.email)}
                            style={[styles.buttonRole, styles.buttonOutlineRole]}
                          >
                            <Text style={styles.buttonOutlineTextRole}>Rechazar</Text>
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

