
import { addDoc, collection, runTransaction } from "firebase/firestore";
import { auth, db, storage } from "../database/firebase";
import Toast from 'react-native-simple-toast';

const coleccionUsers = "userInfo";
const coleccionMesas = "tableInfo";
const coleccionProductos = "productInfo"
const coleccionWaitingList = "waitingList"


export const addDuenioEmpleado = async (imageValue : string, 
                                        values, 
                                        checked : string ) => {
    try
    {
        await addDoc(collection(db, coleccionUsers), {   
            lastName:values.apellido,
            name:values.nombre,
            dni:values.dni,
            cuil:values.cuil,
            email:values.email,
            rol:checked,
            image:imageValue,
            creationDate:new Date()          
          });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO DUEÑO/EMPLEADO EN BD: "+error.code);
        Toast.showWithGravity(
            "ERROR GRABANDO DUEÑO/EMPLEADO EN BD: "+error.code,
            Toast.LONG, 
            Toast.CENTER);
    }
}

export const addClienteRegistrado = async (imageValue : string, 
                                           values, 
                                           checked : string ) => {
    try
    {
        await addDoc(collection(db, coleccionUsers), {   
            lastName:values.apellido,
            name:values.nombre,
            dni:values.dni,
            rol:checked,
            email:values.email,
            image:imageValue,
            clientStatus: "Pending" ,
            rejectedReason: "",
            creationDate:new Date()          
          });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO CLIENTE EN BD: "+error.code);
        Toast.showWithGravity(
            "ERROR GRABANDO CLIENTE EN BD: "+error.code,
            Toast.LONG, 
            Toast.CENTER);
    }
}
export const addClienteAnonimo = async (imageValue : string, 
                                        values, 
                                        checked : string ) => {
    try
    {
        await addDoc(collection(db, coleccionUsers), {   
            name:values.nombre,
            rol:checked,
            image:imageValue,
            clientStatus: "Accepted",
            rejectedReason: "",
            email:values.email,
            creationDate:new Date()          
        });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO CLIENTE EN BD: "+error.code);
        Toast.showWithGravity(
            "ERROR GRABANDO CLIENTE EN BD: "+error.code,
            Toast.LONG, 
            Toast.CENTER);
    }
}

export const addMesa = async (imageValue : string, 
                              values, 
                              checked : string ) => {
    try
    {
        await addDoc(collection(db, coleccionMesas), {   
        tableNumber:values.number,
        tableCapacity:values.capacity,
        tableType:checked,
        image:imageValue,
        status: "free",
        assignedClient: "",
        orderStatus: "waitingOrder",
        survey: "no",
        creationDate:new Date()          
        });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO MESA EN BD: "+error.code);
        Toast.showWithGravity(
        "ERROR GRABANDO MESA EN BD: "+error.code,
        Toast.LONG, 
        Toast.CENTER);
    }
}

export const addProducto = async (imageValue1 : string, 
                                  imageValue2 : string,
                                  imageValue3 : string,
                                  values) => {
    try
    {
        await addDoc(collection(db, coleccionProductos), {   
            name: values.name,
            description: values.description,
            elaborationTime: values.elaborationTime,
            price: values.price,
            type: values.type,
            image1:imageValue1,
            image2:imageValue2,
            image3:imageValue3,
            //jaja wtf
            qString: "producto"+"@"+
                      values.name+"@"+
                      values.description+"@"+
                      values.elaborationTime+"@"+
                      values.price+"@"+
                      values.type+"@"+
                      imageValue1+"@"+
                      imageValue2+"@"+
                      imageValue3,
            creationDate:new Date()         
        });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO PRODUCTO EN BD: "+error.code);
        Toast.showWithGravity(
        "ERROR GRABANDO PRODUCTO EN BD: "+error.code,
        Toast.LONG, 
        Toast.CENTER);
    }
}

export const addListaDeEspera = async (mailCliente : string, 
                                       idMesa) => {
    try
    {
        await addDoc(collection(db, coleccionWaitingList), {   
            mailCliente: mailCliente,
            idMesa: idMesa,
            status: "enEspera" ,
            creationDate:new Date()          
        });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO EN LISTA DE ESPERA: "+error.code);
        Toast.showWithGravity(
        "ERROR GRABANDO CLIENTE EN BD: "+error.code,
        Toast.LONG, 
        Toast.CENTER);
    }
}

    