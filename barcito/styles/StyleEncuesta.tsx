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
        // fontFamily: 'Oswald_500Medium',
        textAlign: 'center',
        alignContent: 'center',
    },
    inputContainer: {
        width: '100%', 
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,             
    },
    submitContainer: {
        marginTop: 20,
        marginBottom: 20,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonLayout: {

        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        width: "70%",
        height: 60,
        padding: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    sliderButtonLayout: {
        backgroundColor: ' rgba(220, 220, 225, 0.5);',
        marginTop: 0,
        marginBottom: 0,
        width: "90%",
        height: 55,
        padding: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    pickerButtonLayout: {
        backgroundColor: ' rgba(220, 220, 225, 0.5);',

        color: morado,
        fontWeight: 'bold',
        
        
        marginTop: 10,
        marginBottom: 10,
        width: "90%",
        height: 55,
        padding: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    submitButtonLayout: {
        backgroundColor: '#A4C3B2',
        marginTop: 5,
        margin: 5,
        width: "80%",
        height: 55,
        padding: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    buttonCheckBoxLayout: {
        backgroundColor: ' rgba(220, 220, 225, 0.5);',
        marginTop: 5,
        margin: 5,
        width: "100%",
        height: 60,
        padding: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    buttonText: {
        color: '#545454',
        fontSize: 16,
        // fontFamily: 'Oswald_500Medium',
    },
    inputText: {
        color: morado,
        fontWeight: 'bold',
        fontSize: 16,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    inputText2: {
        color: morado,
        fontSize: 16,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    inputCheckBoxTitleText: {
        color: 'black',
        // fontFamily: 'Oswald_300Light',
        fontSize: 18,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    inputTextCheckBox: {
        color: morado,
        fontWeight: 'bold',
        //fontFamily: 'Oswald_300Light',
        fontSize: 16,
        height: '50%',
        width: '60%',
        textAlign: 'center',
    },
    inputFieldRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    inputFieldCheckBoxRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        alignSelf: 'center',
    },
    inputFieldRadio: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: ' rgba(220, 220, 225, 0.5);',
        height: '4%',
        width: '60%',
        padding: 10,
        margin: 5,
        borderRadius: 10,
    },
    defaultPicker: {

        width: "90%",
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#DDDDDD",
        marginBottom: 20,
        paddingLeft: 15,
    },
    checkbox: {
        margin: 4,

        alignSelf: "center",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,

    },
    inputField: {
        flexDirection: 'row',
        alignItems: 'center',
        color: morado,
        //fontWeight: 'bold',
        justifyContent: 'center',
        backgroundColor: vainilla,
        //backgroundColor: ' rgba(220, 220, 225, 0.5);',
        borderBottomColor: '#F7AD3B',
        borderBottomWidth: 0,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 10,
        borderRadius: 10,
        width: '93%',
        height: 70,

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

    buttonContainer2: {
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