"use strict";
class Arquero {
    
    constructor(nombre, genero, edad,experiencia,resistencia,suerte) {
        this.nombre = nombre;
        this.genero = genero;
        this.edad = edad;
        this.resistencia = resistencia;
        this.experiencia = experiencia;
        this.suerte = suerte;
        this.puntaje = 0;
        this.experienciaSumada = 0;
        this.precisionMejorada = 0;
        this.contadorExperiencia =0;
    }

    subirExpereciencia(){
        this.experiencia += 2;
        //console.log(`Arquero ${this.nombre} sube experiencia ${this.experiencia}`);
        this.contadorExperiencia += 2;
        //console.log("Contador aumenta ", this.contadorExperiencia);
        if(this.contadorExperiencia === 8){
            this.precisionMejorada += 0.025;
            this.contadorExperiencia = 0;
        }
    }
    
}