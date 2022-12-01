import { db } from "../database/firebase";
import { updateDoc, doc } from "firebase/firestore";

const nombreColeccion = "cuenta";


const cambioEstadoCuenta = async (id, estado) => {

    const ref = doc(db, nombreColeccion, id);
    await updateDoc(ref, {estado:estado});
}

export const cambioCuentaAPagada = (id) => {
    cambioEstadoCuenta(id, 'Pagada');
}





