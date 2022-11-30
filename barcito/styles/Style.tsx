import { StyleSheet } from "react-native";

const primaryColor = '#ffffff';
const secondaryColor = '#3176bb';
const tertiaryColor = '#b9b9b9';
const fourthColor = '#3176bb';
const buttonBorderRadius = 30;
const buttonBorderRadiusImput = 20;
const lilaClarito = '#81749c';
const vainilla = '#fcfce2';

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerMenu: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container2: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        justifyContent: "center"
    }, 
    logo: {
        width: '70%',
        height: '40%',
    },
    logoHome: {
        width: '100%',
        height: '15%',
        marginTop: '3%',
    },
    logoIndex: {
        width: '100%',
        height: '40%',
        marginTop: '3%',
    },
    inputContainer: {
        width: '80%',
        marginTop: 10,
    },
    input: {
        backgroundColor: primaryColor,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: buttonBorderRadiusImput,
        borderColor: '#4d3e6b',
        borderWidth: 5,
        marginTop: '5%',
    },
    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2%',
    },

    button: {
        backgroundColor: '#4d3e6b',
        width: '100%',
        padding: 20,
        borderRadius: buttonBorderRadius,
        alignItems: 'center',
        marginTop: '6%',

        marginBottom: '8%',
    },
    buttonHome: {
        backgroundColor: '#6e9987',
        width: '80%',
        padding: 10,
        borderRadius: buttonBorderRadius,
        alignItems: 'center',
        marginBottom: '8%',
    },
    buttonLogin: {
        backgroundColor: '#4d3e6b',
        width: '100%',
        padding: 20,
        borderRadius: buttonBorderRadiusImput,
        alignItems: 'center',
        
    },
    buttonRole: {
        backgroundColor: tertiaryColor,
        width: '100%',
        padding: 5,
        borderRadius: buttonBorderRadius,
        alignItems: 'center',
    },
    buttonError: {
        backgroundColor: 'red',
        width: '100%',
        padding: 15,
        borderRadius: buttonBorderRadiusImput,
        alignItems: 'center',
        marginBottom: 5,
    },
    buttonOutline: {
        
        backgroundColor: primaryColor,
        marginTop: 5,
        borderColor: '#4d3e6b',
        borderWidth: 10,
    },
    buttonOutlinehome: {
        backgroundColor: primaryColor,
        marginTop: 5,
        borderColor: '#6e9987',
        borderWidth: 5,
    },
    buttonOutlineLogin: {
        backgroundColor: primaryColor,
        marginTop: 5,
        borderColor: '#4d3e6b',
        borderWidth: 5,
    },
    buttonOutlineRole: {
        backgroundColor: '#81749c',
        marginTop: 2,
    },
    buttonText: {
        color: '#fcfce2',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color:'#2d3839',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineTextRole: {
        color: '#4d3e6b',
        fontWeight: '700',
        fontSize: 16,
    },
  
    spinnerTextStyle: {
        color: 'white',
    },
    spinContainer: {
        position: 'absolute',
        display: 'flex',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        height: '100%',
        width: '100%',
        zIndex: 100,
    },
    textHome:{
        fontSize: 150,
        marginTop: 5, 
        color: '#27191c',
        fontWeight: 'bold',        
    },
    textEnEspera:{
        textAlign: 'center',
        fontSize: 50,
        marginTop: 5, 
        color: '#27191c',
        fontWeight: 'bold',        
    },
    textHomeMediano:{
        fontSize: 75,
        marginTop: 5, 
        color: '#4d3e6b',
        fontWeight: 'bold',        
    },
    textCuenta:{
        fontSize: 30,
        marginTop: 0, 
        color: '#4d3e6b',
        fontWeight: 'bold',        
    },
    textHomeMedianoDos:{
        fontSize: 25,
        marginTop: 5, 
        textAlign: 'center',
        color: '#4d3e6b',
        fontWeight: 'bold',        
    },
    textHomePequeño:{
        fontSize:15,
        marginTop: 5, 
        color: '#4d3e6b',
        fontWeight: 'bold',        
    },
    textHomePequeñoCentrado:{
        fontSize:15,
        textAlign: "center",
        marginTop: 5, 
        color: '#4d3e6b',
        fontWeight: 'bold',        
    },
    textPreTitleHome:{
        fontSize: 20,
        marginTop: 5, 
        color: '#114d4d',
        fontWeight: 'bold',
        marginBottom:80,        
    },
    textTitleHome:{
        fontSize: 30,
        marginTop: 5, 
        color: '#2d3839',
        fontWeight: 'bold', 
         
    },
    textDescription:{
        fontSize: 20,
        marginTop: '10%', 
        color: 'secondaryColor',
        fontWeight: 'bold',  
        textAlign: 'center',
        margin: 5,
    }, 
    qrArea:{
        width: 200,
        height: 200,
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 30,
    } ,
    cameraQrContainer: {
        flexDirection: 'row', 
        alignContent: 'center', 
        justifyContent: 'center', 
        marginBottom: 5
    }, 
    qrIcon: {
        height:180, 
        width:180, 
        borderRadius:20, 
        margin:10,
        backgroundColor: 'white',
    },
    inputText: {
        color: 'black',
        fontSize: 16,
        width: '100%',
    },
    tagText: {
        color: 'white',
        fontFamily: 'Oswald_300Light',
        fontSize: 16,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    inputFieldRadioLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 0,
        marginBottom: 0,
    },
    inputFieldRadio: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: ' rgba(220, 220, 225, 0.5);',
        borderBottomColor: '#F7AD3B',
        width: '48%',
        borderBottomWidth: 0,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 0,
        marginBottom: 0,
        borderRadius: 10,
    },
    submitContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 15,
      
        textAlign: 'center',
        alignContent: 'center',
    },
    headerIcon: {
        height: 45,
        width: 45,
        resizeMode: 'contain',
        marginRight: 10,
    },
    cameraIcon: {
        height:120, 
        width:120, 
        borderRadius:20, 
        margin:10
    },
    cameraImage: {
        height:120, 
        width:120, 
        borderRadius:20, 
        margin:10
    },
    cameraIconRow: {
        height:100, 
        width:100, 
        borderRadius:20, 
        margin:10
    },
    cameraImageRow: {
        height:100, 
        width:100, 
        borderRadius:20, 
        margin:10
    },

    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    bodyMenu: {
       
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        flexDirection: 'column',
        height: 10,
        
    },
    bodyPedido2: {
       
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        flexDirection: 'column',
        height: 3,
        
    },
    bodyPedido: {
       
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        flexDirection: 'column',
        height: 5,
        
    },
    cardStyle: {
        backgroundColor: '#81749c',
        borderColor: '#DCDCE1',
        margin: 10,
        borderRadius: 10,
        borderWidth: 2,
    },
    cardScrollHorizontalStyle: {
        backgroundColor: '#81749c',
        borderColor: '#DCDCE1',
        height: 150,
        margin: 10,
        marginBottom: 2,
        borderRadius: 10,
        borderWidth: 2,
    },
    cardScrollPedidoStyle: {
        backgroundColor: '#81749c',
        borderColor: '#DCDCE1',
        height: 45,
        margin: 10,
        marginBottom: 2,
        borderRadius: 10,
        borderWidth: 2,
    },
    pedidoStyle: {
        backgroundColor: '#fcfce2',
        borderColor: '#DCDCE1',
        height: 70,
        margin: 10,
        marginBottom: 2,
        borderRadius: 10,
        borderWidth: 2,
    },
    tiempoElaboracionStyle: {
        backgroundColor: '#fcfce2',
        borderColor: '#DCDCE1',
        height: 30,
        margin: 10,
        marginBottom: 2,
        borderRadius: 10,
        borderWidth: 2,
    },
    imageIconContainer: {
        flexDirection: 'row', 
        alignContent: 'center', 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5
    },
    imageIconContainer2: {
        flexDirection: 'row', 
        alignContent: 'center', 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0
    },

    cardImage: {
        // flex: 1, 
        padding: 10,
        margin: 5,
        borderRadius: 10,
        height:90, 
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },

    cardImagePequenia: {
        // flex: 1, 
        padding: 10,
        margin: 5,
        borderRadius: 10,
        height:60, 
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardIcon: {
        padding: 10,
        margin: 5,
        height: 100,
        width: 100,
        resizeMode: 'contain',
    },
    tableHeaderText: {
        color: '#4d3e6b',
        fontSize: 20,
    },

    tableCellText: {
        color: '#4d3e6b',
        fontSize: 15,
    },
    tableCellTextCentrado: {
        color: '#4d3e6b',
        fontSize: 15,
        textAlign: "center",
        fontWeight: "bold"
    },
    tableCellTextCentrado2: {
        color: '#4d3e6b',
        fontSize: 15,
        textAlign: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    modalBody: {
        borderColor: '#4d3e6b',
        backgroundColor: '#4d3e6b',
        borderWidth: 2,
        width: '100%',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
    },

    modalIconContainer: {
        flexDirection: 'row', 
        alignContent: 'center', 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },

    inputField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(220, 220, 225, 0.5);',
        borderBottomColor: '#F7AD3B',
        borderBottomWidth: 0,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 5,
        borderRadius: 10,
    },

    buttonLayout: {
        backgroundColor: '#A4C3B2',
        borderColor: '#A4C3B2',
        marginTop: 20,
        margin: 5,
        width: "80%",
        height: 60,
        padding: 15,
        borderRadius: 30,
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
    }, 

    logoHomeDos: {
        height:130, 
        width:130, 
        // width: '100%',
        // height: '15%',
        borderRadius:20, 
        margin:10,
        backgroundColor: 'white',
    },


    
})