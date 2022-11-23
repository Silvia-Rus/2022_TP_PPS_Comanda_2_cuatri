import Toast from 'react-native-simple-toast';

const insertarToast = (texto : string) =>
{
    Toast.showWithGravity(
        texto,
        Toast.LONG, 
        Toast.CENTER);
}

export default insertarToast;