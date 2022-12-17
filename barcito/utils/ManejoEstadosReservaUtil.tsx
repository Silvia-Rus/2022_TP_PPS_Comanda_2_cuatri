import { db } from "../database/firebase";
import { updateDoc, doc } from "firebase/firestore";

const nombreColeccion = "Reservas";

const cambioEstadoReserva = async (id, estado) => {

    const ref = doc(db, nombreColeccion, id);
    await updateDoc(ref, {status:estado});
}

export const cambioReservaAceptada = async (id, idMesa, numeroMesa) => {
    cambioEstadoReserva(id, 'aceptada');
    const ref = doc(db, nombreColeccion, id);
    await updateDoc(ref, {idMesa:idMesa});
    await updateDoc(ref, {numeroMesa:numeroMesa})
}

export const cambioReservaARechazada = (id) => {
    cambioEstadoReserva(id, 'rechazada');
}

export const cambioReservaAInactiva = (id) => {
    cambioEstadoReserva(id, 'inactiva');
}




