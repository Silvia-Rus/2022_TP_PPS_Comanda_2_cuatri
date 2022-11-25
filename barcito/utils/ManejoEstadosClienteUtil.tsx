import { db } from "../database/firebase";
import { updateDoc, doc } from "firebase/firestore";

const nombreColeccion = "userInfo";


const cambioEstadoCliente = async (id, estado) => {

    const ref = doc(db, nombreColeccion, id);
    await updateDoc(ref, {clientStatus:estado});
}

export const cambioClienteAPending = (id) => {
    cambioEstadoCliente(id, 'Pending');
}

export const cambioClienteAAccepted = (id) => {
    cambioEstadoCliente(id, 'Accepted');
}

export const cambioClienteAWaiting = (id) => {
    cambioEstadoCliente(id, 'Waiting');
}

export const cambioClienteASentado = (id) => {
    cambioEstadoCliente(id, 'Sentado');
}

export const cambioClienteARejected = async (id, motivo) => {
    const ref = doc(db, nombreColeccion, id);
    await updateDoc(ref, {clientStatus:"Rejected"});
    await updateDoc(ref, {rejectedReason:motivo});
}

