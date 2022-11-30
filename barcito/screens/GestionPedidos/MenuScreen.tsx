
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

const MenuScreen = () => {

      //CONSTANTES
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isModalCancelVisible, setModalCancelVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataComida, setDataComida] = useState<any>([]);
    const [dataBebida, setDataBebida] = useState<any>([]);
    const [dataPostre, setDataPostre] = useState<any>([]);
    const [precioTotal, setPrecioTotal] = useState(0);
    const [tiempoElaboracion, setTiempoElaboracion] = useState(0);
    const [mesa, setMesa] = useState("");
    const [productoPedidoNombre, setProductoPedidoNombre] = useState('');
    const [productoPedidoPrecio, setProductoPedidoPrecio] = useState<any>();
    const [productoPedidoTiempo, setProductoPedidoTiempo] = useState<any>();
    const [productoPedidoTipo, setProductoPedidoTipo] = useState('');
    const [cliente, setCliente] = useState("");


    const [cantidad, setCantidad] = useState('');

    const confirmIcon = require("../assets/confirm.png");
    const cancelIcon = require("../assets/cancel.png");

     //RETURN
    const handleReturn = () => { 
        //insertarToast("Holi");
        console.log("al salir: ")
        console.log(productoPedidoNombre);
        console.log(productoPedidoTiempo);
        console.log(productoPedidoPrecio);
        navigation.replace("HomeCliente"); 
    }

    const handlePedido = () => { 
        navigation.replace("GestionPedidosCliente");
        //navigation.replace("HomeCliente"); 
    }

    const toggleModalCancel = () => {
        setModalCancelVisible(!isModalCancelVisible);
      };
    
    const handleLanzarElModal = async (nombre, tiempo, precio, tipo) => {

        try{
            setLoading(true)
            setProductoPedidoNombre(nombre);
            setProductoPedidoTiempo(tiempo);
            setProductoPedidoPrecio(precio);
            setProductoPedidoTipo(tipo);
            toggleModalCancel();                                 
        }
        catch (error) { console.log(error) } 
        finally{ setLoading(false); }
    }

    const handleCompletarPedido = async (cantidad) => {
        try{
            setLoading(true);
            const precioTotal = productoPedidoPrecio * cantidad;
            const tiempoElaboracionTotal = productoPedidoTiempo * cantidad;
            AddPedido(auth.currentUser?.email, 
                      mesa, 
                      productoPedidoNombre, 
                      cantidad,
                      productoPedidoTipo, 
                      tiempoElaboracionTotal,
                      precioTotal)
            getTiempoElaboracion();
            getPrecioTotal();
            insertarToast(productoPedidoNombre+" añadido.");
            toggleModalCancel();
        }
        catch (error) { console.log(error) } 
        finally{ setLoading(false); }
    }

    //REFRESH DE LA DATA
    useFocusEffect(
        useCallback(() => {
            getCliente();
            getComida();
            getBebida();
            getPostre();
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
                console.log("nuevoTiempo "+ acumulador);
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
               if(statusPedido != "Inactivo")
               {
                acumulador = acumulador+item.data().precioTotal;
                console.log("nuevoPrecio "+ acumulador);
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
               setMesa(item.data().idMesa);       
            });
         }catch(error){console.log("ERROR CHEQUEANDO EL ID DE LA MESA: "+error)                    
         }finally{setLoading(false);}

    }

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

    const getPostre = async () => {
        setLoading(true);    
        setDataPostre([]);    
        try {
        const q = query(collection(db, "productInfo"), where("type", "==", "Postre"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            const res: any = { ...doc.data(), id: doc.id };
            const imageUrl1 = await getDownloadURL(ref(storage, res.image1));
            const imageUrl2 = await getDownloadURL(ref(storage, res.image2));
            const imageUrl3 = await getDownloadURL(ref(storage, res.image3));
            setDataPostre((arr: any) => [...arr, { ...res, id: doc.id, imageUrl1: imageUrl1, imageUrl2: imageUrl2, imageUrl3: imageUrl3 }]
                        .sort((a, b) => (a.creationDate < b.creationDate ? 1 : a.creationDate > b.creationDate ? -1 : 0)));
        });
        } catch(error){console.log("ERROR GETBEBIDA: "+error)                    
        } finally{setLoading(false);}
    }

    return (
        <View style={styles.containerMenu} >
            {loading?
              <View style={styles.spinContainer}><Spinner/></View>
            : null}
            <View style={styles.buttonContainerArriba} >
              <View style={styles.buttonContainer} >
                <Text style={styles.buttonOutlineTextRole}>MENÚ</Text>
              </View>
            </View>
            {/* <View style={styles.bodyPedido}> */}
                <View style={styles.pedidoStyle}>
                    <Text style={styles.textHomePequeñoCentrado}>Cuenta:</Text>
                    <Text style={styles.textCuenta}>{precioTotal}$</Text>
                </View>
            {/* </View> */}
                <View style={styles.tiempoElaboracionStyle}>
                    <Text style={styles.textHomePequeñoCentrado}>Tiempo de elaboración: {tiempoElaboracion} min.</Text>
                </View>
           
            <View style={styles.bodyMenu}>
            {/* <View style={styles.containerMenu} > */}
                <Text style={styles.textHomePequeñoCentrado}>Comida</Text> 
                <ScrollView horizontal={true}>
                {dataComida.map((item: { imageUrl1: any;
                                         imageUrl2: any;
                                         imageUrl3: any;                                      
                                         name: any; 
                                         price: any; 
                                         elaborationTime: any;
                                         description: any;
                                         type: any;
                                         creationDate: {toDate: () => Date; }; 
                                         id: string;}) => (               
                    <TouchableOpacity onPress={() => handleLanzarElModal(item.name, item.elaborationTime, item.price, item.type)}>
                        <View style={styles.cardScrollHorizontalStyle}>
                            <View>      
                                <Text style={styles.tableCellTextCentrado}> {item.name} -  ${item.price} - Elaboración: {item.elaborationTime} min. </Text> 
                            </View>
                            <View style={styles.imageIconContainer2}>
                                <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl1 }} />
                                <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl2 }} />
                                <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl3 }} />
                            </View> 
                            <View>      
                                <Text style={styles.tableCellTextCentrado2}> {item.description} </Text> 
                            </View>                                             
                        </View>  
                    </TouchableOpacity>

                ))}
                </ScrollView>
            </View>
            <View style={styles.bodyMenu}>
                <Text style={styles.textHomePequeñoCentrado}>Bebida</Text> 
                <ScrollView horizontal={true}>
                    {dataBebida.map((item: { imageUrl1: any;
                                            imageUrl2: any;
                                            imageUrl3: any;                                      
                                            name: any; 
                                            price: any; 
                                            elaborationTime: any;
                                            description: any;
                                            type: any;
                                            creationDate: {toDate: () => Date; }; 
                                            id: string;}) => ( 
                    <TouchableOpacity onPress={() => handleLanzarElModal(item.name, item.elaborationTime, item.price, item.type)}>
                        <View style={styles.cardScrollHorizontalStyle}>
                            <View>      
                                <Text style={styles.tableCellTextCentrado}> {item.name} -  ${item.price} - Elaboración: {item.elaborationTime} min. </Text> 
                            </View>
                            <View style={styles.imageIconContainer}>
                                <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl1 }} />
                                <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl2 }} />
                                <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl3 }} />
                            </View>                     
                        </View> 
                    </TouchableOpacity>             
                    ))}
                </ScrollView> 
            </View>
            <View style={styles.bodyMenu}>
                <Text style={styles.textHomePequeñoCentrado}>Postres</Text> 
                <ScrollView horizontal={true}>
                    {dataPostre.map((item: { imageUrl1: any;
                                            imageUrl2: any;
                                            imageUrl3: any;                                      
                                            name: any; 
                                            price: any; 
                                            elaborationTime: any;
                                            description: any;
                                            type: any;
                                            creationDate: {toDate: () => Date; }; 
                                            id: string;}) => (  
                     <TouchableOpacity onPress={() => handleLanzarElModal(item.name, item.elaborationTime, item.price, item.type)}>
                        <View style={styles.cardScrollHorizontalStyle}>
                            <View>      
                                <Text style={styles.tableCellTextCentrado}> {item.name} -  ${item.price} - Elaboración: {item.elaborationTime} min. </Text> 
                            </View>
                            <View style={styles.imageIconContainer}>
                                <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl1 }} />
                                <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl2 }} />
                                <Image style={styles.cardImage} resizeMode="cover" source={{ uri: item.imageUrl3 }} />
                            </View>                     
                        </View> 
                    </TouchableOpacity>             
                    ))}
                </ScrollView> 
                <Modal backdropOpacity={0.5} isVisible={isModalCancelVisible}>
                  <View style={styles.modalContainer}>              
                      <View style={styles.modalBody}>
                        <View style={styles.inputField}>
                          <TextInput
                            placeholder= "Cantidad"
                            placeholderTextColor="white"
                            multiline
                            numberOfLines={4}
                            keyboardType={'numeric'}
                            style={styles.inputText}
                            onChangeText={(text) => setCantidad(text)}
                            secureTextEntry = {true}
                          />
                        </View>
                        <View style={styles.buttonContainer} >
                          <TouchableOpacity
                            onPress={() => handleCompletarPedido(cantidad)}
                            style={[styles.buttonRole, styles.buttonOutlineRole]}
                          >
                            <Text style={styles.buttonOutlineTextRole}>Pedir</Text>
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
                    onPress={handlePedido}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                >
                    <Text style={styles.buttonOutlineTextRole}>Ir al pedido</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer} >
                <TouchableOpacity
                    onPress={handleReturn}
                    style={[styles.buttonRole, styles.buttonOutlineRole]}
                >
                    <Text style={styles.buttonOutlineTextRole}>Volver</Text>
                </TouchableOpacity>
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