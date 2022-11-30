import { StyleSheet } from 'react-native';

const primaryColor = '#ffffff';
const secondaryColor = '#3176bb';
const tertiaryColor = '#b9b9b9';
const fourthColor = '#3176bb';
const buttonBorderRadius = 30;
const buttonBorderRadiusImput = 20;
const lilaClarito = '#81749c';
const vainilla = '#fcfce2';
const morado = '#4d3e6b';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-around',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: "center"
    },
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    headerIcon: {
        height: 45,
        width: 45,
        resizeMode: 'contain',
        marginRight: 10,
    },
    headerText: {
        color: 'white',
        fontSize: 15,
        //fontFamily: 'Oswald_500Medium',
        textAlign: 'center',
        alignContent: 'center',
    },    
    cardStyle: {
        backgroundColor: '#DCDCE1',
        borderColor: '#DCDCE1',
        margin: 10,
        borderRadius: 10,
        borderWidth: 2,
        width: '90%',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flexDirection: 'row', 
        marginBottom: 5,
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',

    },
    cardImage: {
        flex: 1, 
        borderRadius: 10,
        height:120, 
        width:120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardIcon: {
        padding: 10,
        margin: 5,
        height: 50,
        width: 50,
        resizeMode: 'contain',
    },
    tableHeaderText: {
        color: '#3D4544',
        fontSize: 14,
        //fontFamily: 'Oswald_500Medium',
    },
    tableCellText: {
        color: 'black',
        fontSize: 25,
        //fontFamily: 'Oswald_500Medium',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    modalBody: {
        borderColor: 'white',
        backgroundColor: '#3D4544',
        borderWidth: 2,
        padding: 15,
        borderRadius: 25,
    },
    modalIconContainer: {
        flexDirection: 'row', 
        marginBottom: 5,
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
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
    inputText: {
        color: 'black',
        //fontFamily: 'Oswald_300Light',
        fontSize: 16,
        width: '100%',
        alignSelf: 'center',
        textAlign: 'center',
    },

    buttonLayout: {
        backgroundColor: '#A4C3B2',
        borderColor: '#A4C3B2',
        marginTop: 15,
        marginBottom: 15,
        width: "90%",
        height: 60,
        padding: 15,
        borderRadius: 5,
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonLayoutAmarillo: {
        backgroundColor: vainilla,
        borderColor: '#A4C3B2',
        marginTop: 15,
        marginBottom: 15,
        width: "90%",
        height: 60,
        padding: 15,
        borderRadius: 5,
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
      buttonText: {
        color: 'black',
        fontSize: 15,
        //fontFamily: 'Oswald_500Medium',
        textAlign: 'center',
        alignSelf: 'center',
    },
    chartConfig:{
        backgroundColor: vainilla,
        backgroundGradientFrom: vainilla,
        backgroundGradientTo: vainilla,
        decimalPlaces: 1, // optional, defaults to 2dp
        //color: () => vainilla,
        color: () => `rgba(0, 0, 0, 0.5)`,
        labelColor: () => `black`,        
    },
    buttonContainerArriba: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10%',
    },
    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2%',
    },
    buttonOutlineTextRole: {
        color: '#4d3e6b',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonRole: {
        backgroundColor: tertiaryColor,
        width: '100%',
        padding: 5,
        borderRadius: buttonBorderRadius,
        alignItems: 'center',
    },
    buttonOutlineRole: {
        backgroundColor: '#81749c',
        marginTop: 2,
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
    inputContainer: {
        width: '100%', 
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,             
    },
    buttonContainer2: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2%',
    },
    buttonLogin: {
        backgroundColor: '#4d3e6b',
        width: '100%',
        padding: 20,
        borderRadius: buttonBorderRadiusImput,
        alignItems: 'center',
        
    },
    buttonText2: {
        color: '#fcfce2',
        fontWeight: '700',
        fontSize: 16,
    },


});