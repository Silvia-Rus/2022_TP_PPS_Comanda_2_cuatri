import { db } from "../database/firebase";
import { updateDoc, doc } from "firebase/firestore";

const nombreColeccion = "Reservas";

const cambioEstadoReserva = async (id, estado) => {

    const ref = doc(db, nombreColeccion, id);
    await updateDoc(ref, {status:estado});
}

export const cambioReservaAceptada= (id) => {
    cambioEstadoReserva(id, 'aceptada');
}

export const cambioReservaARechazada = (id) => {
    cambioEstadoReserva(id, 'rechazada');
}



