
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
import { cambioClienteAPending, cambioClienteARejected, cambioClienteAAccepted } from "../utils/ManejoEstadosClienteUtil";

const MenuScreen = () => {

      //CONSTANTES
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isModalCancelVisible, setModalCancelVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataComida, setDataComida] = useState<any>([]);
    const [dataBebida, setDataBebida] = useState<any>([]);
    const [dataPostre, setDataPostre] = useState<any>([]);

    const [rejectMotive, setRejectMotive] = useState('');
    const [rejectId, setRejectId] = useState('');

    const confirmIcon = require("../assets/confirm.png");
    const cancelIcon = require("../assets/cancel.png");

     //RETURN
    const handleReturn = () => { 
        //insertarToast("Holi");
        navigation.replace("HomeCliente"); 
    }

    //REFRESH DE LA DATA
    useFocusEffect(
        useCallback(() => {
            getComida();
            getBebida();

    }, []))

    //GET DATA
    const getComida = async () => {
        setLoading(true);    
        setDataComida([]);    
        try {
        const q = query(collection(db, "productInfo"), where("type", "==", "Comida"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            const res: any = { ...doc.data(), id: doc.id };
            const imageUrl1 = await getDownloadURL(ref(storage, res.image1));
            const imageUrl2 = await getDownloadURL(ref(storage, res.image2));
            const imageUrl3 = await getDownloadURL(ref(storage, res.image3));
            setDataComida((arr: any) => [...arr, { ...res, id: doc.id, imageUrl1: imageUrl1, imageUrl2: imageUrl2, imageUrl3: imageUrl3 }]
                        .sort((a, b) => (a.creationDate < b.creationDate ? 1 : a.creationDate > b.creationDate ? -1 : 0)));
        });
        } catch(error){console.log("ERROR GETCOMIDA: "+error)                    
        } finally{setLoading(false);}
    }

    const getBebida = async () => {
        setLoading(true);    
        setDataComida([]);    
        try {
        const q = query(collection(db, "productInfo"), where("type", "==", "Bebida"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            const res: any = { ...doc.data(), id: doc.id };
            const imageUrl1 = await getDownloadURL(ref(storage, res.image1));
            const imageUrl2 = await getDownloadURL(ref(storage, res.image2));
            const imageUrl3 = await getDownloadURL(ref(storage, res.image3));
            setDataBebida((arr: any) => [...arr, { ...res, id: doc.id, imageUrl1: imageUrl1, imageUrl2: imageUrl2, imageUrl3: imageUrl3 }]
                        .sort((a, b) => (a.creationDate < b.creationDate ? 1 : a.creationDate > b.creationDate ? -1 : 0)));
        });
        } catch(error){console.log("ERROR GETBEBIDA: "+error)                    
        } finally{setLoading(false);}
    }

  



    return (
        <View style={styles.container} >
            {loading?
              <View style={styles.spinContainer}><Spinner/></View>
            : null}
            <View style={styles.buttonContainerArriba} >
              <View style={styles.buttonContainer} >
                          <TouchableOpacity
                            //onPress={handleReturn}
                            style={[styles.buttonRole, styles.buttonOutlineRole]}
                          >
                              <Text style={styles.buttonOutlineTextRole}>MENÚ</Text>
                          </TouchableOpacity>
              </View>
            </View>
           
            <View style={styles.body}>
              <ScrollView>
                <Text style={styles.textHomePequeñoCentrado}>Comida</Text> 
                {dataComida.map((item: { imageUrl1: any;
                                         imageUrl2: any;
                                         imageUrl3: any;                                      
                                         name: any; 
                                         price: any; 
                                         elaborationTime: any;
                                         creationDate: {toDate: () => Date; }; 
                                         id: string;}) => (               
                <View style={styles.cardStyle}>
                    <View>      
                      <Text style={styles.tableCellTextCentrado}> {item.name} -  ${item.price} - Elaboración: {item.elaborationTime} min. </Text> 
                    </View>
                    <View style={styles.imageIconContainer}>
                      <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl1 }} />
                      <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl2 }} />
                      <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl3 }} />
                    </View>                     
                  </View>              
                ))}

            <Text style={styles.textHomePequeñoCentrado}>Bebida</Text> 
                {dataBebida.map((item: { imageUrl1: any;
                                         imageUrl2: any;
                                         imageUrl3: any;                                      
                                         name: any; 
                                         price: any; 
                                         elaborationTime: any;
                                         creationDate: {toDate: () => Date; }; 
                                         id: string;}) => (               
                <View style={styles.cardStyle}>
                    <View>      
                      <Text style={styles.tableCellTextCentrado}> {item.name} -  ${item.price} - Elaboración: {item.elaborationTime} min. </Text> 
                    </View>
                    <View style={styles.imageIconContainer}>
                      <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl1 }} />
                      <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl2 }} />
                      <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl3 }} />
                    </View>                     
                  </View>              
                ))}

                
                  {/* <View style={styles.buttonContainerArriba} > */}
                    <View style={styles.buttonContainer} >
                        <TouchableOpacity
                            onPress={handleReturn}
                            style={[styles.buttonRole, styles.buttonOutlineRole]}
                        >
                            <Text style={styles.buttonOutlineTextRole}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                  {/* </View> */}
              </ScrollView> 
              
            </View> 
          {/* 
            <View>
              <Modal backdropOpacity={0.5} animationIn="rotate" animationOut="rotate" isVisible={isModalSpinnerVisible}>
              </Modal>
            </View> */}
        </View> 
      );

}

export default MenuScreen;