import Toast from 'react-native-simple-toast';
import { ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db, storage } from "../database/firebase";

const ValidacionCamposProducto =  (values, image1, image2, image3) => {

    if(!estanTodosLosObligatorios(values))
    {
        console.log("entra a campos obligatorios");
        Toast.showWithGravity(
            "Todos los campos son requeridos",
            Toast.LONG, 
            Toast.CENTER);
        console.log("Todos los campos son requeridos");
        return false;
    }
    else if(!hayImagenes(image1, image2, image3))
    {
        Toast.showWithGravity(
            "Las 3 imágenes son obligatorias",
            Toast.LONG, 
            Toast.CENTER);
        console.log("Las 3 imágenes son obligatorias");
        return false;
    }

}

const estanTodosLosObligatorios = (values) => {
    let retorno = true;
    console.log(values);
    if(values.name              === undefined ||
       values.description       === undefined ||
       values.elaborationTime   === undefined ||
       values.price             === undefined ){
       retorno = false;
       }
    return retorno;
}

const hayImagenes = (image1, image2, image3) => {
    
    let retorno = true;
    if(!image1 || !image2 || !image3){
        retorno = false;
    }
    return retorno;
}

export default ValidacionCamposProducto;



