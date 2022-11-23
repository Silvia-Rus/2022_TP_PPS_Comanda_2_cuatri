import * as ImagePicker from "expo-image-picker";

const LanzarCamara = async () => {

        //let result = await ImagePicker.launchCameraAsync({
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            //allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })
        if (!result.cancelled) {
            return result["uri"]
            //setImage(result["uri"]);
        }
}





export default LanzarCamara;