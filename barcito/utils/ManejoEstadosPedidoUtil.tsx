import { db } from "../database/firebase";
import { updateDoc, doc } from "firebase/firestore";

const nombreColeccion = "pedidos";

const cambioEstadoPedido= async (id, estado) => {

    const ref = doc(db, nombreColeccion, id);
    await updateDoc(ref, {status:estado});
}

export const cambioPedidoAEnPreparacion = (id) => {
    cambioEstadoPedido(id, 'En Preparación');
}

export const cambioPedidoAPreparado = (id) => {
    cambioEstadoPedido(id, 'Preparado');
}


export const cambioPedidoAServido = (id) => {
    cambioEstadoPedido(id, 'Servido');
}

export const cambioPedidoAConfirmado = (id) => {
    cambioEstadoPedido(id, 'Confirmado');
}

export const cambioPedidoAInactivo = (id) => {
    cambioEstadoPedido(id, 'Inactivo');
}

export const cambioPedidoAPagando = (id) => {
    cambioEstadoPedido(id, 'Pagando');
}

export const cambioPedidoAPagado = (id) => {
    cambioEstadoPedido(id, 'Pagado');
}
