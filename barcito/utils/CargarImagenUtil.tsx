
import { auth, db, storage } from "../database/firebase";
import { ref, uploadBytes } from 'firebase/storage';
import getBlob from "../utils/BlobUtil";
import Toast from 'react-native-simple-toast';

const CargarImagen = async (image) => {

    try
    {
        const blob:any = await getBlob(image);
        const fileName = image.substring(image.lastIndexOf("/") + 1);
        const fileRef = ref(storage, "userInfo/" + fileName);
        await uploadBytes(fileRef, blob);
        return fileRef.fullPath;
    }
    catch (error:any) 
    {
        console.log("ERROR CARGANDO LA IMAGEN EN LA BD: "+error.code);
        Toast.showWithGravity(
            "ERROR CARGANDO LA IMAGEN EN LA BD: "+error.code,
            Toast.LONG, 
            Toast.CENTER);
    }
  

}
export default CargarImagen;

