import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "../styles/StyleEstadistica";
import { Image, ImageBackground, Text, TouchableOpacity, View, ScrollView, Dimensions } from "react-native";
import Modal from "react-native-modal";
import React, { useCallback, useLayoutEffect, useState } from 'react'
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../database/firebase";
import { Badge } from "react-native-paper";
import Spinner from "../utils/SpinnerUtil";




const EstadisticasEncuestaCliente = () => {

  //CONSTANTES
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isModalSpinnerVisible, setModalSpinnerVisible] = useState(false);
  const [data, setData] = useState<any>([]);
  const [clean, setClean] = useState(0);
  const [dirty, setDirty] = useState(0);
  const [happy, setHappy] = useState(0);
  const [sad, setSad] = useState(0);
  const [quickDelivery, setQuickDelivery] = useState(0);
  const [slowDelivery, setSlowDelivery] = useState(0);
  const [averageWaiterEvaluation, setAverageWaiterEvaluation] = useState(0);
  const [foodQualityBuena, setFoodQualityBuena] = useState(0);
  const [foodQualityMala, setFoodQualityMala] = useState(0);
  const [foodQualityRegular, setFoodQualityRegular] = useState(0);
  const [paymentMethodEfectivo, setPaymentMethodEfectivo] = useState(0);
  const [paymentMethodDebito, setPaymentMethodDebito] = useState(0);
  const [paymentMethodCredito, setPaymentMethodCredito] = useState(0);
  const win = Dimensions.get("window");
  const [loading, setLoading] = useState(false);
  


  const backgroundImage = require("../assets/common/background.png");
  const returnIcon = require("../assets/common/return.png");
 

  //CONFIG DE GRAFICOS

  const fill = 'rgb(134, 65, 244)'
  const barData = [paymentMethodEfectivo, paymentMethodDebito, paymentMethodCredito]
  

  const paymentMethodsBarChartData = {
    labels: ["Efectivo", "Debito", "Credito"],
    datasets: [
      {
        data: [paymentMethodEfectivo, paymentMethodDebito, paymentMethodCredito]
      }
    ]    
  };

  const foodQualityPieChartData = [
    {
      name: "Buena",
      amount: foodQualityBuena,
      color: "green",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Regular",
      amount: foodQualityRegular,
      color: "yellow",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Mala",
      amount: foodQualityMala,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
  ]

  const clientsOpinionsProggressRingData = [
    {
      name: "Lugar Limpio",
      amount: clean,
      color: "green",
      legendFontColor: "#7F7F7F",
      legendFontSize: 13
    },
    {
      name: "Lugar Sucio",
      amount: dirty,
      color: "yellow",
      legendFontColor: "#7F7F7F",
      legendFontSize: 13
    },
    {
      name: "Atención Rapida",
      amount: quickDelivery,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 13
    },
    {
      name: "Atencón Lenta",
      amount: slowDelivery,
      color: "blue",
      legendFontColor: "#7F7F7F",
      legendFontSize: 13
    },
    {
      name: "Estadia Agradable",
      amount: happy,
      color: "brown",
      legendFontColor: "#7F7F7F",
      legendFontSize: 13
    },
    {
      name: "Estadia Mala",
      amount: sad,
      color: "orange",
      legendFontColor: "#7F7F7F",
      legendFontSize: 13
    }
  ]

  //RETURN
  const handleReturn = () => {
    navigation.replace("HomeCliente")
  }

  //TOOGLE SPINNER
  const toggleSpinnerAlert = () => {
    setModalSpinnerVisible(true);
    setTimeout(() => {
      setModalSpinnerVisible(false);
    }, 3000);
  };
  
  //REFRESH DE LA DATA
  useFocusEffect(
    useCallback(() => {
        getData();
        toggleSpinnerAlert();
  }, []))

  useFocusEffect(
    useCallback(() => {
        getGraphsData();
        toggleSpinnerAlert();
  }, [data]))

  //GET DATA USUARIOS
  const getData = async () => {
    setData([]);    
    try {
      const q = query(collection(db, "encuestaCliente"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const res: any = { ...doc.data(), id: doc.id };
        setData((arr: any) => [...arr, { ...res, id: doc.id}]);
      });
    } catch (error) {
        console.log(error)                    
    }
  }

  //GET DATA GRAFICOS
  const getGraphsData = async () => {

    let countWaiterEvaulations = 0;
    let sumWaiterEvaluations = 0;

    data.map((item: any) => {
      if(item.clean == true)
        setClean(clean + item.clean);
      
      if(item.dirty == true)
        setDirty(dirty + item.dirty);
      
      if(item.happy == true)
        setHappy(happy + item.happy);

      if(item.sad == true)
        setSad(sad + item.sad);
      
      if(item.quickDelivery == true)
        setQuickDelivery(quickDelivery + item.quickDelivery);
      
      if(item.slowDelivery == true)
        setSlowDelivery(slowDelivery + item.slowDelivery);

      countWaiterEvaulations++;
      sumWaiterEvaluations += item.waiterEvaluation;

      if(item.foodQuality == "buena"){
        setFoodQualityBuena(foodQualityBuena + 1);
      }
      if(item.foodQuality == "mala"){
        setFoodQualityMala(foodQualityMala + 1);
      }
      if(item.foodQuality == "regular"){
        setFoodQualityRegular(foodQualityRegular + 1);
      }
      if(item.payMethod == "Efectivo"){
        setPaymentMethodEfectivo(paymentMethodEfectivo + 1);
      }
      if(item.payMethod == "Debito"){
        setPaymentMethodDebito(paymentMethodDebito + 1);
      }
      if(item.payMethod == "Credito"){
        setPaymentMethodCredito(paymentMethodCredito + 1);
      }     
    })
    setAverageWaiterEvaluation(sumWaiterEvaluations / countWaiterEvaulations);
 }

  return (
    <View style={styles.container}>
        {loading?
            <View style={styles.spinContainer}><Spinner/></View>
        : null} 
         <View style={styles.body}>
            <View style={styles.buttonContainerArriba} >
                <View style={styles.buttonContainer} >
                    <Text style={styles.buttonOutlineTextRole}>ESTADÍSTICAS</Text>
                </View>
            </View>
            <ScrollView>
                <View style={styles.inputContainer}>
                    <View style={[styles.buttonRole, styles.buttonOutlineRole]}>
                    <Text style={styles.inputText}>CALIDAD DE LA COMIDA</Text>
                    </View>

                    <PieChart
                        data={foodQualityPieChartData}
                        width={win.width * 0.8}
                        height={win.width / 2}
                        chartConfig={styles.chartConfig}
                        accessor={"amount"}
                        backgroundColor={"#fcfce2"}
                        paddingLeft={"0"}
                        center={[10, 0]}
                        absolute
                    />
                    <View style={[styles.buttonRole, styles.buttonOutlineRole]}>
                        <Text style={styles.inputText}>MEDIOS DE PAGO PREFERIDOS</Text>
                    </View>

                    <BarChart
                    data={paymentMethodsBarChartData}
                    yAxisLabel=""
                    yAxisSuffix=""
                    width={win.width * 0.8}
                    height={win.width / 2}
                    chartConfig={styles.chartConfig}
                    />
                    <View style={[styles.buttonRole, styles.buttonOutlineRole]}>
                        <Text style={styles.inputText}>PROMEDIO CALIDAD ATENCION DE MOZOS</Text>
                    </View>
                    <View style={styles.buttonLayoutAmarillo}>
                        <Text style={styles.inputText}>{Math.round(averageWaiterEvaluation)} %</Text>
                    </View>

                    <View style={[styles.buttonRole, styles.buttonOutlineRole]}>
                        <Text style={styles.inputText}>OPINIONES VARIAS</Text>
                    </View>

                    <PieChart
                        data={clientsOpinionsProggressRingData}
                        width={win.width * 0.9}
                        height={win.width / 2}
                        chartConfig={styles.chartConfig}
                        accessor={"amount"}
                        backgroundColor={'#fcfce2'}
                        paddingLeft={"0"}
                        center={[10, 0]}
                        absolute
                    />          
                    <View style={styles.buttonContainer2}>
                        <TouchableOpacity onPress={handleReturn} style={styles.buttonLogin}>
                            <Text style={styles.buttonText2}>VOLVER</Text>
                        </TouchableOpacity>
                    </View>
                </View> 
            </ScrollView>
      </View>
    </View> 
  );
};

export default EstadisticasEncuestaCliente;