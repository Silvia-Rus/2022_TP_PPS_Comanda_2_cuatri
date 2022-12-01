
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
import { cambioPedidoAConfirmado, cambioPedidoAServido } from "../../utils/ManejoEstadosPedidoUtil";


const GestionPedidosClienteScreen = () => {

      //CONSTANTES
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [loading, setLoading] = useState(false);
    const [dataPedido, setDataPedido] = useState<any>([]);
    const [dataServidos, setDataServidos] = useState<any>([]);
    const [dataConfirmados, setDataConfirmados] = useState<any>([]);
    const [dataNumeroPedidos, setDataNumeroPedidos] = useState(0);
    const [dataNumeroConfirmados, setDataNumeroConfirmados] = useState(0);
    const [dataNumeroServidos, setDataNumeroServidos] = useState(0);
    const [precioTotal, setPrecioTotal] = useState(0);
    const [tiempoElaboracion, setTiempoElaboracion] = useState(0);
    const [mesa, setMesa] = useState("");
    const [cliente, setCliente] = useState("");
    const [isModalCancelVisible, setModalCancelVisible] = useState(false);
    const [idPedido, setIdPedido] = useState("");

    

     //RETURN
    const handleReturn = () => { 
        navigation.replace("Menu"); 
    }
    const handleReturn2 = () => { 
        navigation.replace("HomeCliente"); 
    }

    const handlePedirLaCuenta = () => {
        navigation.replace("PedirCuenta"); 
    }

    //REFRESH DE LA DATA
    useFocusEffect(
        useCallback(() => {
            getCliente();
            getPedido();
            getPedidoConfirmado();
            getPedidoServido();
            getTiempoElaboracion();
            getPrecioTotal()                                                                                                                                                                                                                                                                                                    
            getMesa();
            getTiempoElaboracion();
    }, []))

    const getCliente = async () => {
        try{
            setLoading(true);
            setCliente(auth.currentUser?.email);
         }catch(error){console.log("ERROR CHEQUEANDO EL CLIENTE: "+error)                    
         }finally{setLoading(false);}

    }
    
    const toggleModalCancel = () => {
        setModalCancelVisible(!isModalCancelVisible);
      };
    
      const handleLanzarModal = async (id) => {

        try{
            setLoading(true);
            setIdPedido(id);
            getPedido();
            getPedidoConfirmado();
            getPedidoServido();
            toggleModalCancel();                                 
        }
        catch (error) { console.log(error) } 
        finally{ setLoading(false); }
    }

    const handleConfirmarPedido = async () => {

        try{
            setLoading(true)
            cambioPedidoAConfirmado(idPedido);
            getPedido();
            getPedidoConfirmado();
            getPedidoServido();
            toggleModalCancel(); 
            insertarToast("Pedido confirmado.");                                
        }
        catch (error) { console.log(error) } 
        finally{ setLoading(false); }
    }
 
 

    const getTiempoElaboracion = async () => {
        try{
            setLoading(true);
            //setTiempoElaboracion(0);
            let acumulador = 0;
            const q = query(collection(db, "pedidos"), where("mailCliente", "==", auth.currentUser?.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (item) =>{
               const statusPedido = item.data().status;
               if(statusPedido != "Inactivo" || statusPedido != "Pagando" || statusPedido != "EnMesa")
               {
                acumulador = acumulador+item.data().tiempoElaboracionTotal;
                //console.log("nuevoTiempo "+ acumulador);
                setTiempoElaboracion(acumulador);  
               }
            });
         }catch(error){console.log("ERROR CHEQUEANDO EL TIEMPO DE ELABORACIÓN: "+error)                    
         }finally{setLoading(false);}

    }

    const getPrecioTotal = async () => {
        try{
            setLoading(true);
            //setTiempoElaboracion(0);
            let acumulador = 0;
            const q = query(collection(db, "pedidos"), where("mailCliente", "==", auth.currentUser?.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (item) =>{
               const statusPedido = item.data().status;
               if(statusPedido != "Inactivo" && statusPedido != "Pagando")
               {
                acumulador = acumulador+item.data().precioTotal;
                //console.log("nuevoPrecio "+ acumulador);
                setPrecioTotal(acumulador);  
               }
            });
         }catch(error){console.log("ERROR CHEQUEANDO EL TIEMPO DE ELABORACIÓN: "+error)                    
         }finally{setLoading(false);} 
    }

    const getMesa = async () => {
        try{
            setLoading(true);
            const q = query(collection(db, "clienteMesa"), where("mailCliente", "==", auth.currentUser?.email), where("status", "==", "Asignada"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (item) =>{
                const statusClienteMesa = item.data().status;
                if(statusClienteMesa != "Inactivo")
                {
                    setMesa(item.data().idMesa);       
                }           
            });
         }catch(error){console.log("ERROR CHEQUEANDO EL ID DE LA MESA: "+error)                    
         }finally{setLoading(false);}

    }

    //GET DATA
    const getPedido = async () => {
        setLoading(true); 
        setDataPedido([]);
        setDataNumeroPedidos(0);    
        try {
            const q = query(collection(db, "pedidos"), where("mailCliente", "==", auth.currentUser?.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                if(doc.data().status != "Inactivo" && doc.data().status != "Servido" && doc.data().status != "Confirmado" && doc.data().status != "Pagando"){            
                    const res: any = { ...doc.data(), id: doc.id };
                    setDataPedido((arr: any) => [...arr, { ...res, id: doc.id }]
                            .sort((a, b) => (a.status < b.status ? 1 : a.status > b.status ? -1 : 0))) 
                    setDataNumeroPedidos(querySnapshot.size);             
                }
            ;
            });
        } catch(error){console.log("ERROR GETPEDIDO: "+error)                    
        } finally{ setLoading(false);}
    }

    const getPedidoConfirmado = async () => {
        setLoading(true); 
        setDataConfirmados([]); 
        setDataNumeroConfirmados(0);   
        try {
        const q = query(collection(db, "pedidos"), where("mailCliente", "==", auth.currentUser?.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            if(doc.data().status == "Confirmado" || doc.data().status == "Pagando" )
            {
                const res: any = { ...doc.data(), id: doc.id };
                setDataConfirmados((arr: any) => [...arr, { ...res, id: doc.id }]
                        .sort((a, b) => (a.status < b.status ? 1 : a.status > b.status ? -1 : 0)))  
                setDataNumeroConfirmados(querySnapshot.size);     
            }
        });
        } catch(error){console.log("ERROR GETPEDIDO: "+error)                    
        } finally{setLoading(false);}
    }

    const getPedidoServido = async () => {
        setLoading(true); 
        setDataServidos([]); 
        setDataNumeroServidos(0);  
        try {
            const q = query(collection(db, "pedidos"), where("mailCliente", "==", auth.currentUser?.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {         
                if(doc.data().status == "Servido")
                {                   
                    const res: any = { ...doc.data(), id: doc.id };
                    setDataServidos((arr: any) => [...arr, { ...res, id: doc.id }]
                            .sort((a, b) => (a.status < b.status ? 1 : a.status > b.status ? -1 : 0))) 
                    setDataNumeroServidos(querySnapshot.size);  
                } 
                                            
        });
        } catch(error){console.log("ERROR GETSERVIDOS: "+error)                    
        } finally{setLoading(false);}
    }

    return (
        <View style={styles.containerMenu} >
            {loading?
              <View style={styles.spinContainer}><Spinner/></View>
            : null}
            <View style={styles.buttonContainerArriba} >
              <View style={styles.buttonContainer} >
                <Text style={styles.buttonOutlineTextRole}>PEDIDO</Text>
              </View>
            </View>
            <View style={styles.pedidoStyle}>
                <Text style={styles.textHomePequeñoCentrado}>Cuenta:</Text>
                <Text style={styles.textCuenta}>{precioTotal}$</Text>
            </View>
            <View style={styles.tiempoElaboracionStyle}>
                <Text style={styles.textHomePequeñoCentrado}>Tiempo de elaboración: {tiempoElaboracion} min.</Text>
            </View>
            <View style={styles.bodyPedido2}>

            {dataNumeroServidos > 0 ?
                <Text style={styles.textHomePequeñoCentrado}>Servidos (pulse para confirmar)</Text> 
            :null}
            <ScrollView> 
                {dataServidos.map((item: {nombreProducto: any;
                                        cantidad: any;                    
                                        precioTotal: any;
                                        status: any;
                                        id: string}) => ( 
                        <TouchableOpacity onPress={() => handleLanzarModal(item.id)}> 
                        <View style={styles.cardScrollPedidoStyle}>
                            <View>      
                                <Text style={styles.tableCellTextCentrado}> {item.nombreProducto} -  Cantidad: {item.cantidad} - ${item.precioTotal}. </Text> 
                                <Text style={styles.tableCellTextCentrado}>  Estado: {item.status} </Text> 
                            </View>                                           
                        </View>
                        </TouchableOpacity> 
                       
                ))} 
                {dataNumeroPedidos > 0 ?
                    <Text style={styles.textHomePequeñoCentrado}>En proceso </Text> 
                :null}
                {dataPedido.map((item: {nombreProducto: any;
                                        cantidad: any;  º                   
                                        precioTotal: any;
                                        status: any;}) => (               
                        <View style={styles.cardScrollPedidoStyle}>
                            <View>      
                                <Text style={styles.tableCellTextCentrado}> {item.nombreProducto} -  Cantidad: {item.cantidad} - ${item.precioTotal}. </Text> 
                                <Text style={styles.tableCellTextCentrado}>  Estado: {item.status} </Text> 
                            </View>                                           
                        </View>  
                ))}
                {dataNumeroConfirmados > 0 ?
                    <Text style={styles.textHomePequeñoCentrado}>Confirmados</Text> 
                :null}
                {dataConfirmados.map((item: {nombreProducto: any;
                                        cantidad: any;                    
                                        precioTotal: any;
                                        status: any;}) => (  
                        <View style={styles.cardScrollPedidoStyle}>
                            <View>      
                                <Text style={styles.tableCellTextCentrado}> {item.nombreProducto} -  Cantidad: {item.cantidad} - ${item.precioTotal}. </Text> 
                                <Text style={styles.tableCellTextCentrado}>  Estado: {item.status} </Text> 
                            </View>                                           
                        </View> 
                       
                ))}
            </ScrollView>
            <Modal backdropOpacity={0.5} isVisible={isModalCancelVisible}>
                <View style={styles.modalContainer}>              
                    <View style={styles.modalBody}>
                        <View style={styles.buttonContainer} >
                            <TouchableOpacity
                            onPress={() => handleConfirmarPedido()}
                            style={[styles.buttonRole, styles.buttonOutlineRole]}
                            >
                            <Text style={styles.buttonOutlineTextRole}>Confirmar Pedido</Text>
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
            {dataNumeroConfirmados > 0 ?
                <TouchableOpacity
                onPress={handlePedirLaCuenta}
                style={[styles.buttonRole, styles.buttonOutlineRole]}
                >
                    <Text style={styles.buttonOutlineTextRole}>Pedir la cuenta</Text>

                </TouchableOpacity>
            :null}
                <TouchableOpacity
                    onPress={handleReturn}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                >
                    <Text style={styles.buttonOutlineTextRole}>Ir al menú</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleReturn2}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                >
                    <Text style={styles.buttonOutlineTextRole}>Ir a la pantalla principal</Text>
                </TouchableOpacity>
            </View>
        </View> 
      );

}

export default GestionPedidosClienteScreen;