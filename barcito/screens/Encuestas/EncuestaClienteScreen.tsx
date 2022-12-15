import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "../../styles/StyleEncuesta";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
} from "react-native";

import Modal from "react-native-modal";
import React, { useCallback, useLayoutEffect, useState } from "react";
//import RotatingLogo from "../../rotatingLogo/RotatingLogo";
import { useForm } from "react-hook-form";
import Toast from "react-native-simple-toast";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../../database/firebase";

//IMPORTS DEL FORM
import Slider from "@react-native-community/slider";
import { RadioButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";

import insertarToast from "../../utils/ToastUtil";
import Spinner from "../../utils/SpinnerUtil";

import { cambioClienteMesaAEncuestada } from "../../utils/ManejoEstadosClienteMesaUtil";
import{ AddEncuestaCliente }from "../../utils/AddDocsUtil";



type NewSurvey = {
  waiterEvaluation: number;
  payMethod: string;
  foodQuality: any;
  clean: boolean;
  dirty: boolean;
  quickDelivery: boolean;
  slowDelivery: boolean;
  happy: boolean;
  sad: boolean;
  personalComments: string;
};

const EncuestaClienteScreen = () => {
  //CONSTANTES
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isModalSpinnerVisible, setModalSpinnerVisible] = useState(false);
  const {
    getValues,
    formState: {},
    reset,
    setValue,
  } = useForm<NewSurvey>();
  const [loading, setLoading] = useState(false);
  const [clean, setClean] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [quickDelivery, setQuickDelivery] = useState(false);
  const [slowDelivery, setSlowDelivery] = useState(false);
  const [happy, setHappy] = useState(false);
  const [sad, setSad] = useState(false);
  const [clientData, setClientData] = useState<any>([]);
  const [idClienteMesa, setIdClienteMesa] = useState("");

  //RETURN
  const handleReturn = () => {
    navigation.replace("HomeCliente");
  };

  useFocusEffect(
    useCallback(() => {
      getIdClienteMesa();
  }, []))

  
  const getIdClienteMesa = async () => {
    setLoading(true);
    const q = query(collection(db, "clienteMesa"), where("mailCliente", "==", auth.currentUser?.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
        setIdClienteMesa(doc.id);
        console.log("en la encuesta "+idClienteMesa);
    });
    setLoading(false);
  }

  //SUBMIT DEL FORM
  const onSubmit = async () => {
    const values = getValues();
    console.log(values);
    let error = false;

    //VALIDACION CAMPOS
    Object.values(values).map((value) => {
      if (!value) {
        console.log("llega a la validacion");

        error = true;
        return;
      }
    });
    setLoading(true);
    try {
      //UPLOAD DATA
      AddEncuestaCliente(values);
      insertarToast("Encuesta cargada.");
      cambioClienteMesaAEncuestada(idClienteMesa);
      reset();
      handleReturn();
    } catch (error: any) {
        insertarToast(error.code);
    } finally {
      setLoading(false);
    }
  };

  //MANEJADORES DE INPUTS

  //SLIDER
  const [sliderState, setSliderState] = useState(0);

  const handleSliderChange = (value: number) => {
    setSliderState(value);
    setValue("waiterEvaluation", value);
  };

  //RADIO BUTTONS
  const [payMethod, setPayMethod] = React.useState("Efectivo");

  const pressEfectivo = () => {
    setPayMethod("Efectivo");
  };

  const pressDebito = () => {
    setPayMethod("Debito");
  };

  const pressCredito = () => {
    setPayMethod("Crédito");
  };

  useFocusEffect(
    useCallback(() => {
      if (payMethod == "Efectivo") {
        setValue("payMethod", payMethod);
      }
      if (payMethod == "Debito") {
        setValue("payMethod", payMethod);
      }
      if (payMethod == "Crédito") {
        setValue("payMethod", payMethod);
      }
    }, [payMethod])
  );

  //SELECT
  const [foodQuality, setFoodQuality] = useState("Bueno");
  useFocusEffect(
    useCallback(() => {
        setValue("foodQuality", foodQuality);
    }, [foodQuality])
  );

  const handlePickerChange = (value, index) => {
    //console.log(value, index);
    setFoodQuality(value);
    setValue("foodQuality", value);
  };

  //CHECKBOX

  useFocusEffect(
    useCallback(() => {
      setValue("clean", clean);
    }, [clean])
  );

  useFocusEffect(
    useCallback(() => {
      setValue("dirty", dirty);
    }, [dirty])
  );

  useFocusEffect(
    useCallback(() => {
      setValue("quickDelivery", quickDelivery);
    }, [quickDelivery])
  );

  useFocusEffect(
    useCallback(() => {
      setValue("slowDelivery", slowDelivery);
    }, [slowDelivery])
  );

  useFocusEffect(
    useCallback(() => {
      setValue("happy", happy);
    }, [happy])
  );

  useFocusEffect(
    useCallback(() => {
      setValue("sad", sad);
    }, [sad])
  );

  return (
    <View style={styles.container}>

        {loading?
            <View style={styles.spinContainer}><Spinner/></View>
        : null}  
          <View style={styles.body}>
            <View style={styles.buttonContainerArriba} >
                <View style={styles.buttonContainer} >
                    <Text style={styles.buttonOutlineTextRole}>Encuesta</Text>
                </View>
            </View>
          <ScrollView>
            <View style={styles.inputContainer}>
              <View style={[styles.buttonRole, styles.buttonOutlineRole]}>
                <Text style={styles.buttonOutlineTextRole}>
                  ATENCIÓN DE LOS MOZOS (0-100) {Math.round(sliderState * 100)}%
                </Text>
              </View>
              <View style={styles.sliderButtonLayout}>
                    <Slider
                    step={0.1}
                    style={styles.inputText}
                    onValueChange={(value) => handleSliderChange(value)}
                    />
              </View>
              <View style={[styles.buttonRole, styles.buttonOutlineRole]}>
                <Text style={styles.buttonOutlineTextRole}>METODO DE PAGO PREFERIDO</Text>
              </View>

                <View style={styles.inputFieldRadio}>
                  <RadioButton
                    value="Efectivo"
                    status={payMethod === "Efectivo" ? "checked" : "unchecked"}
                    onPress={pressEfectivo}
                  />
                  <Text style={styles.inputText}>Efectivo   </Text>
                </View>

                <View style={styles.inputFieldRadio}>
                  <RadioButton
                    value="Debito"
                    status={payMethod === "Debito" ? "checked" : "unchecked"}
                    onPress={pressDebito}
                  />
                  <Text style={styles.inputText}>Débito   </Text>
                </View>

                <View style={styles.inputFieldRadio}>
                  <RadioButton
                    value="Crédito"
                    status={payMethod === "Crédito" ? "checked" : "unchecked"}
                    onPress={pressCredito}
                  />
                  <Text style={styles.inputText}>Crédito    </Text>
                </View>
              <View style={[styles.buttonRole, styles.buttonOutlineRole]}>
                <Text style={styles.buttonOutlineTextRole}>PRESENTACION / CALIDAD DE LA COMIDA</Text>
              </View>
              <View style={styles.pickerButtonLayout}>
                <Picker
                  style={styles.defaultPicker}
                  selectedValue={foodQuality}
                  onValueChange={(itemValue, itemIndex) =>
                    handlePickerChange(itemValue, itemIndex)
                  }
                  mode="dropdown"
                >
                  <Picker.Item
                    style={styles.inputText}
                    label="Buena"
                    value="buena"
                  />
                  <Picker.Item
                    style={styles.inputText}
                    label="Regular"
                    value="regular"
                  />
                  <Picker.Item
                    style={styles.inputText}
                    label="Mala"
                    value="mala"
                  />
                </Picker>
              </View>
              <View style={[styles.buttonRole, styles.buttonOutlineRole]}>
                <Text style={styles.buttonOutlineTextRole}>¿QUÉ REPRESENTA MEJOR SU EXPERIENCIA?</Text>
              </View>

                <View style={styles.buttonCheckBoxLayout}>
                  <View style={styles.inputFieldCheckBoxRowContainer}>
                    <Checkbox
                      style={styles.checkbox}
                      value={clean}
                      onValueChange={setClean}
                    />
                    <Text style={styles.inputTextCheckBox}>Lugar limpio</Text>
                  </View>
                </View>
                <View style={styles.buttonCheckBoxLayout}>
                  <View style={styles.inputFieldCheckBoxRowContainer}>
                    <Checkbox
                      style={styles.checkbox}
                      value={dirty}
                      onValueChange={setDirty}
                    />
                    <Text style={styles.inputTextCheckBox}>Lugar sucio</Text>
                  </View>
                </View>

                <View style={styles.buttonCheckBoxLayout}>
                  <View style={styles.inputFieldCheckBoxRowContainer}>
                    <Checkbox
                      style={styles.checkbox}
                      value={quickDelivery}
                      onValueChange={setQuickDelivery}
                    />
                      <Text style={styles.inputTextCheckBox}>La atención fue rápida</Text>
                  </View>
                </View>
                <View style={styles.buttonCheckBoxLayout}>
                  <View style={styles.inputFieldCheckBoxRowContainer}>
                    <Checkbox
                      style={styles.checkbox}
                      value={slowDelivery}
                      onValueChange={setSlowDelivery}
                    />
                      <Text style={styles.inputTextCheckBox}>La atención fue lenta</Text>
                  </View>
                </View>

                <View style={styles.buttonCheckBoxLayout}>
                  <View style={styles.inputFieldCheckBoxRowContainer}>
                    <Checkbox
                      style={styles.checkbox}
                      value={happy}
                      onValueChange={setHappy}
                    />
                      <Text style={styles.inputTextCheckBox}>La experiencia fue buena</Text>
                  </View>
                </View>
                <View style={styles.buttonCheckBoxLayout}>
                  <View style={styles.inputFieldCheckBoxRowContainer}>
                    <Checkbox
                      style={styles.checkbox}
                      value={sad}
                      onValueChange={setSad}
                    />
                      <Text style={styles.inputTextCheckBox}>La experiencia fue mala</Text>
                  </View>
                </View>

              <View style={styles.inputField}>
                <TextInput
                  placeholder={"Ingrese su opinión personal..."}
                  placeholderTextColor='#4d3e6b'
                  style={styles.inputText2}
                  onChangeText={(text) => setValue("personalComments", text)}
                />
              </View>

              <View style={styles.buttonContainer2}>
                <TouchableOpacity onPress={onSubmit} style={styles.buttonLogin}>
                  <Text style={styles.buttonText2}>CARGAR ENCUESTA</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer2}>
                <TouchableOpacity onPress={handleReturn} style={styles.buttonLogin}>
                  <Text style={styles.buttonText2}>VOLVER</Text>
                </TouchableOpacity>
              </View>
            </View>
            </ScrollView>

          </View>

        <View>
          <Modal
            backdropOpacity={0.5}
            animationIn="rotate"
            animationOut="rotate"
            isVisible={isModalSpinnerVisible}
          >
            {/* <RotatingLogo></RotatingLogo> */}
          </Modal>

        </View>
    </View>
  );
};

export default EncuestaClienteScreen;
