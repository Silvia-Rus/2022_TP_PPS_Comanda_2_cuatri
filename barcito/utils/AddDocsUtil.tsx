
import { addDoc, collection, runTransaction } from "firebase/firestore";
import { auth, db, storage } from "../database/firebase";
import Toast from 'react-native-simple-toast';

const coleccionUsers = "userInfo";
const coleccionMesas = "tableInfo";

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
            image:imageValue,
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