
//PRIMER NIVEL
const ValidacionCamposUsuario = (values, image, rol) => {
    switch(rol){
        case 'clienteRegistrado':
            return ValidacionCamposClienteRegistrado(values,image);
        case 'clienteAnonimo':
            return ValidacionCamposClienteAnonimo(values, image);
        case 'duenio':
            return ValidacionCamposDuenio(values, image); 
        case 'empleado':
            return ValidacionCamposEmpleado(values, image); 
    }
}

//SEGUNDO NIVEL
const ValidacionCamposClienteRegistrado =  (values, image) => {
    let retorno = false;

    // console.log("nombre " + tieneValor(values.nombre));
    // console.log("apellido " + tieneValor(values.apellido));
    // console.log("dni " + tieneValor(values.dni));
    // console.log("mail " + tieneValor(values.mail));
    // console.log("mail " + tieneValor(values.password));

    if(tieneImagen(image)                    &&
       tieneValor(values.nombre)             &&
       tieneValor(values.apellido)           &&
       tieneValor(values.dni)                &&
       tieneValor (values.email)             &&
       tieneValor(values.password)           &&
       estaCorrectoElMail (values.email)     &&
       estaCorrectaLaClave (values.password) &&
       esCorrectoElDni(values.dni)){
        retorno = true;
       }
       return retorno;
}

export const ValidacionCamposClienteAnonimo =  (values, image) => {
    let retorno = false;
    if(tieneImagen(image) && tieneValor(values.nombre)){
        retorno = true;
    }
    return retorno;
}

export const ValidacionCamposDuenio =  (values, image) => {
    //tieneImagen
}

export const ValidacionCamposEmpleado =  (values, image) => {
    //tieneImagen
}

//TERCE NIVEL
const tieneImagen = (image) => {
    let retorno = false; 
    if(image){retorno = true;} 
    return retorno;
}

const tieneValor = (value) => {
    let retorno = false; 
    if(value !== undefined){retorno = true;} 
    return retorno;
}

const estaCorrectoElMail = (mail) => {
    let retorno = false; 
    if(mail.includes("@") && mail.includes(".") ){retorno = true;} 
    return retorno;
}

const estaCorrectaLaClave = (clave) => {
    let retorno = false; 
    if(clave.length > 5){retorno = true;} 
    return retorno;
}

const esCorrectoElDni = (dni) => {
    let retorno = false; 
    if(dni.length == 8){retorno = true;} 
    return retorno;
}

const esCorrectoElCuil = (cuil) => {
    let retorno = false; 
    if(cuil.length ==11){retorno = true;} 
    return retorno;
}

export default ValidacionCamposUsuario;

   



