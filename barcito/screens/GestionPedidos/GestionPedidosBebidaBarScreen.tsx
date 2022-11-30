
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "../../styles/Style";

import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import Modal from "react-native-modal";
import React, { useCallback,  useState } from 'react'
import Spinner from "../../utils/SpinnerUtil";
import { db, storage } from "../../database/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import insertarToast from "../../utils/ToastUtil";
import { cambioPedidoAPreparado } from "../../utils/ManejoEstadosPedidoUtil";


const GestionPedidosBebidaBarScreen = () => {

  //CONSTANTES
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isModalCancelVisible, setModalCancelVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pedido, setPedido] = useState<any>([]);
  const [idPedido, setIdPedido] = useState('');

  //RETURN
  const handleReturn = () => { navigation.replace("HomeCocinaBar"); }

  //REFRESH DE LA DATA
  useFocusEffect(
    useCallback(() => {
        getPedido();
  }, []))

  //TOOGLE CANCEL USER
  const toggleModalCancel = () => {
    setModalCancelVisible(!isModalCancelVisible);
  };

  //GET DATA
  const getPedido = async () => {
    setLoading(true);    
    setPedido([]);    
    try {
      const q = query(collection(db, "pedidos"), where("status", "==", "En Preparación"),
                                                 where("tipoProducto", "==", "Bebida" ));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const res: any = { ...doc.data(), id: doc.id };
        setPedido((arr: any) => [...arr, { ...res, id: doc.id}].sort((a, b) => (a.creationDate < b.creationDate ? 1 : a.creationDate > b.creationDate ? -1 : 0)));
      });
    } catch(error){console.log("ERROR GETPEDIDOS: "+error)                    
    } finally{setLoading(false);}
  }


  const enviarAPreparar= async () => {
    try {
      setLoading(true);
      cambioPedidoAPreparado(idPedido);
      toggleModalCancel();
      getPedido();
      //toggleSpinnerAlert();
      setTimeout(() => { insertarToast("Pedido enviado.")}, 4000);      
    } catch (error) { console.log(error) } 
      finally{ setLoading(false);}
  }

  const handleLanzarModal = (id) => {
    try {
        setLoading(true);
        setIdPedido(id);
        getPedido();
        toggleModalCancel();
      } catch (error) { console.log(error) } 
        finally{ setLoading(false); }
  }

  return (
    <View style={styles.containerMenu} >
        {loading?
        <View style={styles.spinContainer}><Spinner/></View>
        : null}
        <View style={styles.buttonContainerArriba} >
        <View style={styles.buttonContainer} >
            <Text style={styles.buttonOutlineTextRole}>PEDIDOS PARA PREPARAR </Text>
        </View>
        </View>
        <View style={styles.bodyPedido2}>
            <ScrollView>
                {/* <Text style={styles.textHomePequeñoCentrado}>Comida</Text>  */}
                {pedido.map((item: {idMesa: any;
                                  nombreProducto: any;
                                  cantidad: any;                     
                                  precioTotal: any;
                                  status: any;
                                  id: string;}) => (               
                        <TouchableOpacity onPress={() => handleLanzarModal(item.id)}>
                            <View style={styles.cardScrollPedidoStyle}>
                                <View>      
                                    <Text style={styles.tableCellTextCentrado}> Mesa: {item.idMesa} -  Producto: {item.nombreProducto} - Cantidad {item.cantidad}  </Text> 
                                </View>                                           
                            </View> 
                        </TouchableOpacity> 
                ))}      
            </ScrollView>                                
            <Modal backdropOpacity={0.5} isVisible={isModalCancelVisible}>
                <View style={styles.modalContainer}>              
                    <View style={styles.modalBody}>
                        <View style={styles.buttonContainer} >
                            <TouchableOpacity
                            onPress={() => enviarAPreparar()}
                            style={[styles.buttonRole, styles.buttonOutlineRole]}
                            >
                            <Text style={styles.buttonOutlineTextRole}>Está Listo</Text>
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
        <View style={styles.buttonContainer} >
                <TouchableOpacity
                    onPress={handleReturn}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                >
                    <Text style={styles.buttonOutlineTextRole}>Volver</Text>
                </TouchableOpacity>
            </View>  
    </View>            
  );
};

export default  GestionPedidosBebidaBarScreen;

