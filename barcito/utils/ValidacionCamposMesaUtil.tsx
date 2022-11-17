
import Toast from 'react-native-simple-toast';
import { ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db, storage } from "../database/firebase";


const ValidacionCamposMesa =  (values, image) => {

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
    else if(!hayImagen(image))
    {
        Toast.showWithGravity(
            "Cargue una imagen",
            Toast.LONG, 
            Toast.CENTER);
        console.log("Cargue una imagen");
        return false;
    }
    else if(!capacidadMayorACero(values))
    {
        Toast.showWithGravity(
            "La capacidad debe ser mayor a cero.",
            Toast.LONG, 
            Toast.CENTER);
        console.log("La capacidad debe ser mayor a cero.");
        return false;
    }

}

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