import { db } from "../database/firebase";
import { updateDoc, doc } from "firebase/firestore";

const nombreColeccion = "clienteMesa";


const cambioEstadoClienteMesa = async (id, estado) => {

    const ref = doc(db, nombreColeccion, id);
    await updateDoc(ref, {status:estado});
}

const cambioClienteMesaAAsignada = (id) => {
    cambioEstadoClienteMesa(id, 'Asignada');
}


export default cambioClienteMesaAAsignada;