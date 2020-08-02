"use strict";
class Ronda {

    constructor(equipoA, equipoB, escenario) {
        this.equipoA = equipoA;
        this.equipoB = equipoB; 
        this.resultadoA = 0;
        this.resultadoB = 0;
        this.escenario = escenario;
        this.equipoGanadaor = null;
        this.arqueroGanador = null;
        this.tiros = [];
        this.contadorTiros = 0;
        this.arqueroSuerteA = null;
        this.arqueroSuerteB = null;
        this.experenciaAcumulada = 0;
        this.contadorAumentoExperiencia = 0;
        this.listaAumentoExperiencia = []
    }    

    async iniciarRonda() {
        this.tiros = await generarTiros(0,100);
        for (let i = 0; i < this.equipoA.length; i++) {
            //console.log(`Lanza Equipo A   ${this.equipoA[i].nombre}`);
            this.resultadoA += await this.lanzamiento(this.equipoA[i]);
        }

        for (let i = 0; i < this.equipoB.length; i++) {
            //console.log(`Lanza Equipo B ${this.equipoB[i].nombre}`);
            this.resultadoB += await this.lanzamiento(this.equipoB[i]);
        }
        await this.arqueroConMasSuerte();
        await this.verificarGanadores();
        /*console.log("Equipo Equipo A Partida");
        console.log(this.equipoA);
        console.log("Equipo Equipo B Partida");
        console.log(this.equipoB);*/
    }

    async lanzamiento(arq) {
         var arquero = new Arquero()
         arquero = arq;
         var resultado = 0;
         while (arquero.resistencia > 0) {
            var lanzamiento = this.tiros[this.contadorTiros];
            this.contadorTiros += 1
            //console.log(`${arquero.nombre} Lanzamiento ${lanzamiento}`);
            arquero.puntaje += this.verificarEscenario(lanzamiento,arquero.genero, arquero.precisionMejorada);
            arquero.resistencia -= VALOR_LANZAMIENTO
        }
         //console.log(`Puntaje ${arquero.nombre} : ${arquero.puntaje}`);
         resultado += arquero.puntaje;
         return resultado;
    }

    async arqueroConMasSuerte(){
        this.arqueroSuerteA= await this.obtenerMejorArqueroSuerte(this.equipoA); 
        this.arqueroSuerteB = await this.obtenerMejorArqueroSuerte(this.equipoB);
        //console.log(`Arquero Equipo A con mas suerte ${this.arqueroSuerteA.nombre} ${this.arqueroSuerteA.suerte}`);
        //console.log(`Arquero Equipo B con mas suerte ${this.arqueroSuerteB.nombre} ${this.arqueroSuerteB.suerte}`);
        this.resultadoA += await this.lanzamiento(this.arqueroSuerteA);
        this.resultadoB += await this.lanzamiento(this.arqueroSuerteB);
    } 

    verificarEscenario(lanzamiento, genero,aumentoPrecision){
        switch (this.escenario) {
            case ESC_NO_VIENTO_NO_LLUVIA:
                if(genero == MASCULINO){
                    return this.obtenerPuntaje(H_RANGO_PRO,lanzamiento,aumentoPrecision);
                }else {
                    return this.obtenerPuntaje(M_RANGO_PRO,lanzamiento,aumentoPrecision);
                }
            case ESC_VIENTO:
                 if(genero == MASCULINO){
                    return this.obtenerPuntaje(H_RANGO_PRO_VIENTO,lanzamiento,aumentoPrecision);
                }else {
                    return this.obtenerPuntaje(M_RANGO_PRO_LLUVIA,lanzamiento,aumentoPrecision);
                }  
             case ESC_LLUVIA:
                if(genero == MASCULINO){
                    return this.obtenerPuntaje(H_RANGO_PRO_LLUVIA,lanzamiento,aumentoPrecision);
                }else {
                    return this.obtenerPuntaje(M_RANGO_PRO_LLUVIA,lanzamiento,aumentoPrecision);
                }
            default:
                if(genero == MASCULINO){
                    return this.obtenerPuntaje(H_RANGO_PRO_VIENTO_LLUVIA,lanzamiento,aumentoPrecision);
                }else {
                    return this.obtenerPuntaje(M_RANGO_PRO_VIENTO_LLUVIA,lanzamiento,aumentoPrecision);
                }
        } 
     }

     obtenerPuntaje(rangos, lanzamiento,aumentoPrecision){
         var rango = _.cloneDeep(rangos);  
        if(aumentoPrecision > 0){
            //console.log("Ajusta el rango");
            rango = this.ajustarRango(rango,aumentoPrecision);
            //console.log(rangos);
            //console.log(rango);
        }

        if(lanzamiento >= rango[0][0] && lanzamiento <= rango[0][1]){
            return 10;
        }else if(lanzamiento >= rango[1][0] && lanzamiento <= rango[1][1]) {
            return 8;
        }else if(lanzamiento >= rango[2][0] && lanzamiento <= rango[2][1]) {
            return 6;
        }else {
            return 0;
        }
     }

     ajustarRango(rango,aumentoPrecision){
         var ajuste = aumentoPrecision * 2;
         rango[0][1] = rango[0][1]+aumentoPrecision;
         rango[1][0] = rango[1][0]+aumentoPrecision;
         rango[1][1] = rango[1][1]+ajuste;
         rango[2][0] = rango[2][0]+ajuste;
         rango[2][1] = rango[2][1]+ajuste;
         rango[3][0] = rango[3][0]+ajuste;
         return rango;
     }
     
     verificarGanadores = async() =>{
         this.equipoGanadaor = this.resultadoA > this.resultadoB ? EQUIPO_A: EQUIPO_B;
         var arqueroH = await this.obtenerMejorArqueroPuntaje(this.equipoA);
         var arqueroM = await this.obtenerMejorArqueroPuntaje(this.equipoB);
         this.arqueroGanador = arqueroH.puntaje > arqueroM.puntaje? arqueroH:arqueroM;
         this.arqueroGanador.subirExpereciencia();
         this.experenciaAcumulada += 2;
         this.contadorAumentoExperiencia +=1;
         /*console.log(`Resultados : Masculino ${this.resultadoA} Femenino ${this.resultadoB}`);
         console.log(`Ganador ${this.equipoGanadaor}`);
         console.log(`Arquero EQUIPO_A Con mas suerte ${this.arqueroSuerteA.nombre}  ${this.arqueroSuerteA.suerte}`);
         console.log(`Arquero EQUIPO_B  Con mas suerte  ${this.arqueroSuerteB.nombre} ${this.arqueroSuerteB.suerte}`);
         console.log(`Mejor Arquero EQUIPO_A ${arqueroH.nombre}`);
         console.log(`Mejor Arquero EQUIPO_B ${arqueroM.nombre}`);
         console.log(`Arquero Ganador ${this.arqueroGanador.nombre} Con un puntaje de : ${this.arqueroGanador.puntaje}`);
         console.log("=================================================================================================");*/
    }

    obtenerMejorArqueroPuntaje = async(arqueros) =>{
        var arquero  = arqueros[0];
        for (let i = 0; i < arqueros.length; i++) {
            if(arquero.puntaje < arqueros[i].puntaje){
                arquero = arqueros[i]
            } 
        }
        return arquero;
    }

    obtenerMejorArqueroSuerte = async(arqueros) =>{
        var arquero  = arqueros[0];
        for (let i = 0; i < arqueros.length; i++) {
            if(arquero.suerte < arqueros[i].suerte){
                arquero = arqueros[i]
            } 
        }
        return arquero;
    }
}