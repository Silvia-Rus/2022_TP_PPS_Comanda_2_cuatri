
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
//import styles from "../styles/StylePrueba";
import styles from "../styles/Style";

import { Image, ImageBackground, Text, TouchableOpacity, View, ScrollView, TextInput, Alert } from "react-native";
// import { returnIcon, backgroundImage, confirmIcon, cancelIcon } from "./AssetsClientManagmentScreen";
import Modal from "react-native-modal";
import React, { useCallback, useLayoutEffect, useState } from 'react'
import Spinner from "../utils/SpinnerUtil";
import { db, storage } from "../database/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref } from 'firebase/storage'
import { format } from 'date-fns'
import Toast from 'react-native-simple-toast';
import emailjs from '@emailjs/browser';

const ClientManagment = () => {

  //CONSTANTES
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isModalSpinnerVisible, setModalSpinnerVisible] = useState(false);
  const [isModalCancelVisible, setModalCancelVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [rejectMotive, setRejectMotive] = useState('');
  const [rejectId, setRejectId] = useState('');

  const backgroundImage = require("../assets/common/background.png");
  const returnIcon = require("../assets/common/return.png");
  const confirmIcon = require("../assets/common/confirm.png");
  const cancelIcon = require("../assets/common/cancel.png");
  

  //RETURN
  const handleReturn = () => {
    navigation.replace("HomeDuenio");
  }

  //REFRESH DE LA DATA
  useFocusEffect(
    useCallback(() => {
        getDocuments();
        toggleSpinnerAlert();
  }, []))

  //TOOGLE SPINNER
  const toggleSpinnerAlert = () => {
    setModalSpinnerVisible(true);
    setTimeout(() => {
      setModalSpinnerVisible(false);
    }, 3000);
  };

  //TOOGLE CANCEL USER
  const toggleModalCancel = () => {
    setModalCancelVisible(!isModalCancelVisible);
  };

  //GET DATA
  const getDocuments = async () => {
    console.log('llega aquí?');
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
    } catch (error) {
        console.log("ERROR GETDOCUMENTS: "+error)                    
    }finally{
        setLoading(false);
    }
  }

  //MANEJADORES DE ACEPTAR / RECHAZAR USUARIO
  const handleConfirm = async (id, mail) => {
    try {
      const ref = doc(db, "userInfo", id);
      const data =  'Accepted';
      await updateDoc(ref, {clientStatus:data});
      handleAcceptEmail(mail);
      getDocuments();
      toggleSpinnerAlert();
      setTimeout(() => {
        Toast.showWithGravity(
          "CLIENTE APROBADO",
          Toast.LONG, 
          Toast.CENTER);
      }, 4000);      
    } catch (error) {
      console.log(error)
    } finally{
        setLoading(false);        
    }
  } 

  const handleCancel = async (id) => {
    setRejectId(id);
    toggleModalCancel();      
  }
  
  const completeReject = async (mail) => {
    try {
      const ref = doc(db, "userInfo", rejectId);
      const data =  'Rejected';
      await updateDoc(ref, {clientStatus:data});
      await updateDoc(ref, {rejectedReason:rejectMotive});
      toggleModalCancel();
      handleRejectEmail(mail,rejectMotive);      
      getDocuments();
      toggleSpinnerAlert();
      setTimeout(() => {
        Toast.showWithGravity(
          "CLIENTE RECHAZADO",
          Toast.LONG, 
          Toast.CENTER);
      }, 4000);      
    } catch (error) {
      console.log(error)
    } finally{
        setLoading(false);        
    }
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

  //HEADER
//   useLayoutEffect(() => {
//       navigation.setOptions({
//         headerLeft: () => (
//           <TouchableOpacity onPress={handleReturn}>
//               <Image source={returnIcon} style={styles.headerIcon}/>
//           </TouchableOpacity>
//         ),
//         headerTitle: () => (
//           <Text style={styles.headerText}>ALTA NUEVOS CLIENTES</Text>
//         ),
//         headerTintColor: "transparent",
//         headerBackButtonMenuEnabled: false,
//         headerStyle: {
//           backgroundColor: 'rgba(61, 69, 68, 0.4);',
//         },         
//       });
//     }, []);

  return (
    <View style={styles.container} >
        {/* <View style={styles.container}> */}
          {loading && <View style={styles.spinContainer}>
              <Spinner/>
          </View>}
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
                  <Text style={styles.tableHeaderText}>-----------------------------------------------------</Text>                      
                  <Text style={styles.tableHeaderText}> CORREO: {item.email}</Text> 
                  <Text style={styles.tableCellText}> NOMBRE: {item.name}</Text>
                  <Text style={styles.tableCellText}> APELLIDO: {item.lastName}</Text>
                  <Text style={styles.tableCellText}> DNI: {item.dni}</Text>
                  <Text style={styles.tableCellText}> CREACIÓN: {format(item.creationDate.toDate(), 'dd/MM/yyyy HH:mm:ss')} hs</Text>
                  <Text style={styles.tableHeaderText}>-----------------------------------------------------</Text>                      
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
                        <View style={styles.modalIconContainer}>
                          <TouchableOpacity onPress={() => completeReject(item.email)} >
                          <Image source={confirmIcon} style={styles.cardIcon} />
                          </TouchableOpacity>
                          <TouchableOpacity  onPress={toggleModalCancel} >
                          <Image source={cancelIcon} style={styles.cardIcon} />
                          </TouchableOpacity>
                        </View>
                      </View>
                  </View>
                </Modal>
                
              </View>              
            ))}
          </ScrollView> 
        </View> 

        <View>
          <Modal backdropOpacity={0.5} animationIn="rotate" animationOut="rotate" isVisible={isModalSpinnerVisible}>
          </Modal>
        </View>
        </View> 
  );
};

export default ClientManagment;

