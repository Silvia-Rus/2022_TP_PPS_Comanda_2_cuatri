
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "../../styles/Style";
import { Image, Text, TouchableOpacity, View, ScrollView, TextInput} from "react-native";
import Modal from "react-native-modal";

import React, { useCallback,  useState } from 'react'
import Spinner from "../../utils/SpinnerUtil";
import { auth, db, storage } from "../../database/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref } from 'firebase/storage'
import insertarToast from "../../utils/ToastUtil";
import { AddPedido } from "../../utils/AddDocsUtil";
import { cambioPedidoAPagado }  from "../../utils/ManejoEstadosPedidoUtil";
import { cambioClienteMesaAInactivo } from "../../utils/ManejoEstadosClienteMesaUtil";
import { cambioMesaAFree } from "../../utils/ManejoEstadosMesaUtil";
import { cambioClienteAPending } from "../../utils/ManejoEstadosClienteUtil";
import { cambioCuentaAPagada } from "../../utils/ManejoEstadosCuentaUtil";

const GestionCobrarCuentaMozoScreen = () => {

      //CONSTANTES
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [loading, setLoading] = useState(false);
    const [dataCuenta, setDataCuenta] = useState<any>([]);

    const [dataPedidosPagando, setDataPedidosPagando] = useState<any>([]);

    const [isModalCancelVisible, setModalCancelVisible] = useState(false);
    const [idCuenta, setIdCuenta] = useState("");
    const [idMesa, setIdMesa] = useState("");

    const [mailCliente, setMailCliente] = useState("");

     //RETURN
    const handleReturn = () => { 
        navigation.replace("HomeMozo"); 
    }

    //REFRESH DE LA DATA
    useFocusEffect(
        useCallback(() => {
            getCuentasPedidas();
            //getDatos();

    }, []))

 
    const toggleModalCancel = () => {
        setModalCancelVisible(!isModalCancelVisible);
      };
    
    const handleLanzarModal = async (id, mail, mesa) => {
        try{
            setLoading(true);
            setIdCuenta(id);
            setMailCliente(mail);
            setIdMesa(mesa);
            getCuentasPedidas();
            //getDatos();
            toggleModalCancel();                                 
        }
        catch (error) { console.log(error) } 
        finally{ setLoading(false); }
    }

    const handlePagarCuenta = async () => {

        setLoading(true); 
        setDataPedidosPagando([]);
        try {
            //Cambio en Cuenta
            cambioCuentaAPagada(idCuenta); 

            //Cambio en Pedidos
            const q = query(collection(db, "pedidos"), where("mailCliente", "==", mailCliente));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (doc) => {
                    if(doc.data().status == 'Pagando')
                    {
                        console.log("el id de los pedidos: "+doc.id)
                        cambioPedidoAPagado(doc.id);                    }
              
                });
            
              //CienteMesa
              const q2 = query(collection(db, "clienteMesa"), where("mailCliente", "==", mailCliente));
              const querySnapshot2 = await getDocs(q2);
              querySnapshot2.forEach(async (doc) => {
                  if(doc.data().status == 'Asignada')
                  {
                      cambioClienteMesaAInactivo(doc.id);  
                  }
            
              });
            
             //Mesa
             const q3 = query(collection(db, "tableInfo"), where("tableNumber", "==", idMesa));
             const querySnapshot3 = await getDocs(q3);
             querySnapshot3.forEach(async (doc) => {
                 cambioMesaAFree(doc.id); 
             });

             //Cliente
             const q4 = query(collection(db, "userInfo"), where("email", "==", mailCliente));
             const querySnapshot4 = await getDocs(q4);
             querySnapshot4.forEach(async (doc) => {
                 cambioClienteAPending(doc.id);              
             });
                  
            getCuentasPedidas();
            toggleModalCancel(); 
            insertarToast("Cuenta pagada.");                                

        } catch(error){console.log("ERROR GETPEDIDO: "+error)                    
        } finally{ setLoading(false);}
    }
    const getCuentasPedidas = async () => {
        setLoading(true); 
        setDataCuenta([]);
        try {
            const q = query(collection(db, "cuenta"), where("estado", "==", "Pedida"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                const res: any = { ...doc.data(), id: doc.id };
                setDataCuenta((arr: any) => [...arr, { ...res, id: doc.id }]
                                .sort((a, b) => (a.creationDate < b.creationDate ? 1 : a.creationDate > b.creationDate ? -1 : 0)));
            ;
            });
        } catch(error){console.log("ERROR GETPEDIDO: "+error)                    
        } finally{ setLoading(false);}
    }

    return (
        <View style={styles.containerMenu} >
            {loading?
              <View style={styles.spinContainer}><Spinner/></View>
            : null}
            <View style={styles.buttonContainerArriba} >
              <View style={styles.buttonContainer} >
                <Text style={styles.buttonOutlineTextRole}>PEDIDOS</Text>
              </View>
            </View>
            <View style={styles.bodyPedido2}>
            <ScrollView> 
                {dataCuenta.map((item: {idMesa: any;
                                        mailCliente: any;                    
                                        pedido: any;
                                        propina: any;
                                        total: any;
                                        id: string}) => ( 
                        <TouchableOpacity onPress={() => handleLanzarModal(item.id, item.mailCliente, item.idMesa)}> 
                            <View style={styles.cardScrollPedidoStyle}>
                                <View>      
                                    <Text style={styles.tableCellTextCentrado}> Mesa: {item.idMesa} -  Cliente: {item.mailCliente} </Text> 
                                    <Text style={styles.tableCellTextCentrado}>  Precio pedido ${item.pedido} - Propina ${item.propina} - Total ${item.total} </Text> 
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
                            onPress={() => handlePagarCuenta()}
                            style={[styles.buttonRole, styles.buttonOutlineRole]}
                            >
                            <Text style={styles.buttonOutlineTextRole}>Cuenta pagada</Text>
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

}

export default GestionCobrarCuentaMozoScreen;