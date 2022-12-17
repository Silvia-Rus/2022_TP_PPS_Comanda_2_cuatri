
import { addDoc, collection, runTransaction } from "firebase/firestore";
import { ProgressViewIOSComponent } from "react-native";
import { auth, db, storage } from "../database/firebase";
import insertarToast from "../utils/ToastUtil";

const coleccionUsers = "userInfo";
const coleccionMesas = "tableInfo";
const coleccionProductos = "productInfo";
const coleccionClienteMesa = "clienteMesa";
const coleccionPedido = "pedidos";
const coleccionEncuestasCliente = "encuestaCliente";

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
            email:values.email.trim(),
            rol:checked,
            image:imageValue,
            creationDate:new Date()          
          });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO DUEÑO/EMPLEADO EN BD: "+error.code);
        insertarToast("ERROR GRABANDO DUEÑO/EMPLEADO EN BD: "+error.code);
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
            email:values.email.trim(),
            image:imageValue,
            clientStatus: "Pending" ,
            rejectedReason: "",
            creationDate:new Date()          
          });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO CLIENTE EN BD: "+error.code);
        insertarToast("ERROR GRABANDO CLIENTE EN BD: "+error.code);
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
            email: "anonimo@anonimo.com",
            image:imageValue,
            clientStatus: "Accepted",
            rejectedReason: "",
            creationDate:new Date()          
        });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO CLIENTE EN BD: "+error.code);
        insertarToast("ERROR GRABANDO CLIENTE EN BD: "+error.code);
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
            qString: "mesa"+"@"+values.number,
            creationDate:new Date()          
        });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO MESA EN BD: "+error.code);
        insertarToast("ERROR GRABANDO MESA EN BD: "+error.code);
    }
}

export const addProducto = async (imageValue1 : string, 
                                  imageValue2 : string,
                                  imageValue3 : string,
                                  values,
                                  tipo) => {
    try
    {
        await addDoc(collection(db, coleccionProductos), {   
            name: values.name,
            description: values.description,
            elaborationTime: values.elaborationTime,
            price: values.price,
            type: tipo,
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
        insertarToast("ERROR GRABANDO PRODUCTO EN BD: "+error.code);
    }
}

export const addClienteMesa = async (idCliente : string, 
                                    mailCliente: string,
                                    idMesa,
                                    estado) => {
    try
    {
        await addDoc(collection(db, coleccionClienteMesa), {   
            idCliente: idCliente,
            mailCliente: mailCliente,
            idMesa: idMesa,
            status: estado,
            creationDate:new Date()          
        });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO EN LISTA DE ESPERA: "+error.code);
        insertarToast("ERROR GRABANDO EN LISTA DE ESPERA: "+error.code);
    }
}

export const addCuenta = async (mailCliente: string,
                                idMesa,
                                propina,
                                pedido,
                                total) => {
    try
    {
        await addDoc(collection(db, "cuenta"), {   
            mailCliente: mailCliente,
            idMesa: idMesa,
            propina: propina,
            pedido: pedido,
            total: total,
            estado: "Pedida",
            creationDate:new Date()          
        });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO EN LISTA DE ESPERA: "+error.code);
        insertarToast("ERROR GRABANDO EN LISTA DE ESPERA: "+error.code);
    }
}

export const AddPedido = async (mailCliente, 
                                idMesa, 
                                nombreProducto, 
                                cantidad, 
                                tipo,
                                tiempoElaboracionTotal,
                                precioUnitario, 
                                precioTotal) => {
    try
    {
        await addDoc(collection(db, coleccionPedido), {   
            mailCliente: mailCliente,
            idMesa: idMesa,
            nombreProducto: nombreProducto,
            cantidad: cantidad,
            tiempoElaboracionTotal: tiempoElaboracionTotal,
            tipoProducto: tipo,
            precioUnitario: precioUnitario,
            precioTotal: precioTotal,
            status: "Pedido" ,
            creationDate:new Date()  
        });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO EL PEDIDO: "+error.code);
        insertarToast("ERROR GRABANDO EL PEDIDO: "+error.code);
    }

}

export const AddEncuestaCliente = async (values) => {
    try
    {
        await addDoc(collection(db, coleccionEncuestasCliente), {   
            waiterEvaluation: Math.round(values.waiterEvaluation * 100),
            payMethod: values.payMethod,
            foodQuality: values.foodQuality,
            clean: values.clean,
            dirty: values.dirty,
            quickDelivery: values.quickDelivery,
            slowDelivery: values.slowDelivery,
            happy: values.happy,
            sad: values.sad,
            personalComments: values.personalComments,
            creationDate: new Date(),
        });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO LA ENCUESTA DE CLIENTE: "+error.code);
        insertarToast("ERROR GRABANDO LA ENCUESTA DE CLIENTE: "+error.code);
    }

}

export const AddReserva = async (idCliente, mailCliente, nombreCliente, apellidoCliente, imageCliente, fechaReserva, horaReserva) => {
    try
    {
        await addDoc(collection(db, "Reservas"), { 
            idCliente: idCliente, 
            mailCliente: mailCliente,
            nombreCliente: nombreCliente, 
            apellidoCliente: apellidoCliente,
            fechaReserva: fechaReserva,
            imageCliente: imageCliente,
            horaReserva: horaReserva,
            idMesa: "",
            numeroMesa: "",
            status: "activa",
            creationDate: new Date(),
        });  
    }
    catch (error:any) 
    {
        console.log("ERROR GRABANDO LA RESERVA: "+error.code);
        insertarToast("ERROR GRABANDO LA RESERVA: "+error.code);
    }

}

    