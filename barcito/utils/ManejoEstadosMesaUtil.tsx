import { db } from "../database/firebase";
import { updateDoc, doc } from "firebase/firestore";

const nombreColeccion = "tableInfo";


const cambioEstadoMesa = async (id, estado) => {

    const ref = doc(db, nombreColeccion, id);
    await updateDoc(ref, {status:estado});
}

const cambioMesaAOcupada = (id) => {
    cambioEstadoMesa(id, 'ocupada');
}

export default cambioMesaAOcupada;