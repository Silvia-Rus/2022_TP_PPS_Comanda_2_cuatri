
import Toast from 'react-native-simple-toast';
import { ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db, storage } from "../database/firebase";

//PRIMER NIVEL
const ValidacionCamposMesa =  (values, image) => {

    let retorno = false;

    if(estanTodosLosObligatorios(values) &&
       hayImagen(image)                  &&
       capacidadMayorACero(values))
    {
        retorno = true;
    }
    return retorno;
}

//SEGUNDO NIVEL
const estanTodosLosObligatorios = (values) => {
    let retorno = true;
    console.log(values);
    if((values.number === undefined || values.number === "") ||
       (values.capacity === undefined || values.capacity === "")||
       (values.type === undefined || values.type === "" )){
       retorno = false;
       }
    return retorno;
}

const hayImagen = (image) => {
    
    let retorno = true;
    if(!image){
        retorno = false;
    }
    return retorno;
}

const capacidadMayorACero = (values) => {

    let retorno = true;
    if(values.tableCapacity < 1){
        retorno = false;
    }
    return retorno;

}

export default ValidacionCamposMesa;