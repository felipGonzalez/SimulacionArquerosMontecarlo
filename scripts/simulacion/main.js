class Simulacion {
  constructor() {
    this.equipoB = [];
    this.equipoA = [];
    this.listaPartidas = [];
    this.promedioSuerte = 0;
    this.promedioExperiencia = 0;
    this.listaJugadorMasSuerteEscenarios = [];
    this.listaJugadorMasExperienciaEscenarios = [];
    this.listaEquiposMasVictoriasEscenarios = [];
    this.equipoMasVictoriasTotales = [];
    this.generoMasVistoriasEscenarios = [];
    this.generoMasVictoriasTotales = [];
  }

  async crearEquipos() {
    var generosEquipoA = await this.generarGenerosEquipo();
    var generosEquipoB = await this.generarGenerosEquipo();
    
    var resistenciaHombres = await generarNumeroSpseudoaleatorios(
      RESISTENCIA_MINIMA_HOMBRES,RESISTENCIA_MAXIMA_HOMBRES,40);
    
    var resistenciaMujeres = await generarNumeroSpseudoaleatorios(
      RESISTENCIA_MINIMA_MUJERES,RESISTENCIA_MAXIMA_MUJERES,40);
     
    var suerteHombres = await generarNumeroSpseudoaleatorios(
      SUERTE_MINIMA,SUERTE_MAXIMA,40);
      
    var suerteMujeres = await generarNumeroSpseudoaleatorios(
      SUERTE_MINIMA,SUERTE_MAXIMA,40);
      
    var edadesA = await generarNumeroSpseudoaleatorios(
      EDAD_MINIMA,EDAD_MAXIMA,20);
      
    var edadesB = await generarNumeroSpseudoaleatorios(
      EDAD_MINIMA,EDAD_MAXIMA,20);
      

    /*console.log("Resistencia Hombres" , resistenciaHombres);
    console.log("Resistencia Mujeres" , resistenciaMujeres);
    console.log("Suerte Hombres" , suerteHombres);
    console.log("Suerte Mujeres" , suerteMujeres);
    console.log("Edades Equipo A" , edadesA);
    console.log("Edades Equipo B" , edadesB);*/
    for (let i = 0; i < NUMERO_PARTICIPANTE; i++) {
      if (generosEquipoA[i] === MASCULINO) {
        this.equipoA.push(
          new Arquero(
            `A${i}`,
            MASCULINO,
            Math.floor(edadesA[i]),
            10,
            Math.floor(resistenciaHombres[0]),
            suerteHombres[0]
          )
        );
        resistenciaHombres.shift();
        suerteHombres.shift();
      } else {
        this.equipoA.push(
          new Arquero(
            `A${i}`,
            FEMENINO,
            Math.floor(edadesA[i]),
            10,
            Math.floor(resistenciaMujeres[0]),
            suerteMujeres[0]
          )
        );
        resistenciaMujeres.shift();
        suerteMujeres.shift()
      }
      if (generosEquipoB[i] === MASCULINO) {
        this.equipoB.push(
          new Arquero(
            `B${i}`,
            MASCULINO,
            Math.floor(edadesB[i]),
            10,
            Math.floor(resistenciaHombres[0]),
            suerteHombres[0]
          )
        );
        resistenciaHombres.shift();
        suerteHombres.shift();
      } else {
        this.equipoB.push(
          new Arquero(
            `B${i}`,
            FEMENINO,
            Math.floor(edadesB[i]),
            10,
            Math.floor(resistenciaMujeres[0]),
            suerteMujeres[0]
          )
        );
        resistenciaMujeres.shift();
        suerteMujeres.shift()
      }
    }
    console.log(this.equipoA);
    console.log(this.equipoB);
  }

  async generarGenerosEquipo(){
    let generos = []
    let listaNumeros = await generarNumeroSpseudoaleatorios(1,10,20);
    for (let i = 0; i < listaNumeros.length; i++) {
        var entero = Math.floor(listaNumeros[i]); 
        (entero%2)?generos.push(MASCULINO):generos.push(FEMENINO);
    }
    return generos;

}

  async asignarNuevaSuerte() {
    var suerteHombres = await generarNumeroSpseudoaleatorios(
      SUERTE_MINIMA,
      SUERTE_MAXIMA,
      NUMERO_PARTICIPANTE
    );
    var suerteMujeres = await generarNumeroSpseudoaleatorios(
      SUERTE_MINIMA,
      SUERTE_MAXIMA,
      NUMERO_PARTICIPANTE
    );

    for (let i = 0; i < NUMERO_PARTICIPANTE; i++) {
      this.equipoA[i].suerte = suerteHombres[i];
      this.equipoB[i].suerte = suerteMujeres[i];
    }
  }

  verificarEscenario(escenario) {
    console.log(`Escenario`);
    switch (escenario) {
      case ESC_NO_VIENTO_NO_LLUVIA:
        console.log(ESC_NO_VIENTO_NO_LLUVIA, "  Sin viento y sin lluvia");
        break;
      case ESC_VIENTO:
        console.log(ESC_VIENTO, "  Con viento");
        break;
      case ESC_LLUVIA:
        console.log(ESC_LLUVIA, "  Con lluvia");
        break;
      default:
        console.log(ESC_VIENT_LLUVIA, "Con viento y lluvia");
        break;
    }
  }

  iniciarSimualcion = async () => {
    await this.crearEquipos();

    for (let i = 0; i < NUMERO_PARTIDAS; i++) {
      var escenario = Math.floor(generateRandom(0,3));
      this.verificarEscenario(escenario);
      var partida = new Partida(
        escenario,
        this.equipoA,
        this.equipoB
      );
      await partida.inicarPartida();
      var datos = await partida.resultados();
      mostrarDatosPartida(datos,i);
      this.equipoA = partida.equipoA;
      this.equipoB = partida.equipoB;
      await this.asignarNuevaSuerte();
      this.listaPartidas.push(partida);
    }

    console.log(this.equipoA);
    console.log(this.equipoB);
  };

  calcularReportes = async () => {
    //Promedio de puntos de suerte ganados en cada una de las partidas
    //Promedio de puntos de experiencia ganados en cada una de las partidas
    await this.calcularPromedios();
    //Jugador con más suerte en cada uno de los escenarios de juego 
    this.listaJugadorMasSuerteEscenarios.push(
      await this.verificarJugadorMasSuerte(ESC_NO_VIENTO_NO_LLUVIA)
    );
    this.listaJugadorMasSuerteEscenarios.push(
      await this.verificarJugadorMasSuerte(ESC_VIENTO)
    );
    this.listaJugadorMasSuerteEscenarios.push(
      await this.verificarJugadorMasSuerte(ESC_LLUVIA)
    );
    this.listaJugadorMasSuerteEscenarios.push(
      await this.verificarJugadorMasSuerte(ESC_VIENT_LLUVIA)
    );
    //Jugador con más experiencia en cada uno de los escenarios de juego 
    this.listaJugadorMasExperienciaEscenarios.push(
      await this.verificarJugadorMasExperiencia(ESC_NO_VIENTO_NO_LLUVIA)
    );
    this.listaJugadorMasExperienciaEscenarios.push(
      await this.verificarJugadorMasExperiencia(ESC_VIENTO)
    );
    this.listaJugadorMasExperienciaEscenarios.push(
      await this.verificarJugadorMasExperiencia(ESC_LLUVIA)
    );
    this.listaJugadorMasExperienciaEscenarios.push(
      await this.verificarJugadorMasExperiencia(ESC_VIENT_LLUVIA)
    );
    //Equipo con más victorias en cada uno de los escenarios 
    this.listaEquiposMasVictoriasEscenarios.push(
      await this.verificarEquipoMasVictoriaEscenario(ESC_NO_VIENTO_NO_LLUVIA)
    );
    this.listaEquiposMasVictoriasEscenarios.push(
      await this.verificarEquipoMasVictoriaEscenario(ESC_VIENTO)
    );
    this.listaEquiposMasVictoriasEscenarios.push(
      await this.verificarEquipoMasVictoriaEscenario(ESC_LLUVIA)
    );
    this.listaEquiposMasVictoriasEscenarios.push(await this.verificarEquipoMasVictoriaEscenario(ESC_VIENT_LLUVIA));
    //Equipo con más victorias totales 
    this.equipoMasVictoriasTotales = await this.verificarEquipoMasVictoriaTotal();
    //Género con más victorias en cada escenario 
    this.generoMasVistoriasEscenarios.push(await this.verificarGeneroMasVictoriaEscenario(ESC_NO_VIENTO_NO_LLUVIA))
    this.generoMasVistoriasEscenarios.push(await this.verificarGeneroMasVictoriaEscenario(ESC_VIENTO))
    this.generoMasVistoriasEscenarios.push(await this.verificarGeneroMasVictoriaEscenario(ESC_LLUVIA))
    this.generoMasVistoriasEscenarios.push(await this.verificarGeneroMasVictoriaEscenario(ESC_VIENT_LLUVIA))
    //Genero con más victorias totales
    this.generoMasVictoriasTotales = await this.verificarGeneroMasVictoriaTotal();
  };

  calcularPromedios = async () => {
    for (let i = 0; i < this.listaPartidas.length; i++) {
      this.promedioSuerte += this.listaPartidas[i].suerteTotal;
      this.promedioExperiencia += this.listaPartidas[i].experenciaAcumulada;
    }
    this.promedioSuerte /= NUMERO_PARTIDAS;
    this.promedioExperiencia /= NUMERO_PARTIDAS;
  };

  verificarJugadorMasSuerte = async (escenario) => {
    let arquero = null;
    for (let i = 0; i < this.listaPartidas.length; i++) {
      if (this.listaPartidas[i].escenario === escenario) {
        if (
          this.listaPartidas[i].arqueroSuerteA.suerte >
          this.listaPartidas[i].arqueroSuerteB.suerte
        ) {
          if (arquero === null) {
            arquero = this.listaPartidas[i].arqueroSuerteA;
          } else if (
            this.listaPartidas[i].arqueroSuerteA.suerte > arquero.suerte
          ) {
            arquero = this.listaPartidas[i].arqueroSuerteA;
          }
        } else {
          if (arquero === null) {
            arquero = this.listaPartidas[i].arqueroSuerteB;
          } else if (
            this.listaPartidas[i].arqueroSuerteB.suerte > arquero.suerte
          ) {
            arquero = this.listaPartidas[i].arqueroSuerteB;
          }
        }
      }
    }
    return [arquero, escenario];
  };

  verificarJugadorMasExperiencia = async (escenario) => {
    let arquero = null;
    let listaArqueros = [];
    for (let i = 0; i < this.listaPartidas.length; i++) {
      if (this.listaPartidas[i].escenario === escenario) {
        listaArqueros = await this.agregarArqueroGanador(
          listaArqueros,
          this.listaPartidas[i].arqueroMasExperiencia
        );
      }
    }
    arquero = await this.obtenerArqueroMayorExperiencia(listaArqueros);
    if (arquero !== undefined) {
      arquero = await this.buscarArquero(arquero.key)
      return [arquero, escenario];
    }
    return [null, escenario];
    
  };

  buscarArquero = async(nombre) => {
   for (let i = 0; i < NUMERO_PARTICIPANTE; i++) {
     if(this.equipoA[i].nombre === nombre) {
        return this.equipoA[i];
     }else if(this.equipoB[i].nombre === nombre){
       return this.equipoB[i];
     }
     
   }
  }

  agregarArqueroGanador = async (lista, arquero) => {
    if (lista.length !== 0) {
      var indexArquero = lista
        .map(function (e) {
          return e.key;
        })
        .indexOf(arquero.key);
      if (indexArquero !== -1) {
        lista[indexArquero].value += arquero.value;
      } else {
        lista.push(arquero);
      }
    } else {
      lista.push(arquero);
    }
    return lista;
  };

  obtenerArqueroMayorExperiencia = async (lista) => {
    let arquero;
    for (let i = 0; i < lista.length; i++) {
      if (arquero != undefined) {
        if (arquero.value < lista[i].value) {
          arquero = lista[i];
        }
      } else {
        arquero = lista[i];
      }
    }
    return arquero;
  };

  verificarEquipoMasVictoriaEscenario = async (escenario) => {
    let victoriaA = 0;
    let victoriaB = 0;
    let res = [];
    for (let i = 0; i < this.listaPartidas.length; i++) {
      if (this.listaPartidas[i].escenario === escenario) {
        this.listaPartidas[i].equipoGanadaor === EQUIPO_A
          ? (victoriaA += 1)
          : (victoriaB += 1);
      }
    }
    return victoriaA > victoriaB
      ? [EQUIPO_A, victoriaA]
      : [EQUIPO_B, victoriaB];
  };

  verificarEquipoMasVictoriaTotal = async () => {
    let victoriaA = 0;
    let victoriaB = 0;
    for (let i = 0; i < this.listaPartidas.length; i++) {
      this.listaPartidas[i].equipoGanadaor === EQUIPO_A
        ? (victoriaA += 1)
        : (victoriaB += 1);
    }
    return victoriaA > victoriaB
      ? [EQUIPO_A, victoriaA]
      : [EQUIPO_B, victoriaB];
  };

  verificarGeneroMasVictoriaEscenario = async (escenario) => {
    let victoriaHombres = 0;
    let victoriaMujeres = 0;
    let res = [];
    for (let i = 0; i < this.listaPartidas.length; i++) {
      if (this.listaPartidas[i].escenario === escenario) {
        var listaRondas = this.listaPartidas[i].listaRondas
        for (let j = 0; j < listaRondas.length; j++) {
          listaRondas[j].arqueroGanador.genero === MASCULINO ? victoriaHombres += 1 : victoriaHombres += 2
        }
      }
    }
    return victoriaHombres > victoriaMujeres
      ? [MASCULINO, victoriaHombres]
      : [FEMENINO, victoriaMujeres];
  };

  verificarGeneroMasVictoriaTotal = async () => {
    let victoriaHombres = 0;
    let victoriaMujeres = 0;
    for (let i = 0; i < this.listaPartidas.length; i++) {
      var listaRondas = this.listaPartidas[i].listaRondas
      for (let j = 0; j < listaRondas.length; j++) {
        listaRondas[j].arqueroGanador.genero === MASCULINO ? victoriaHombres += 1 : victoriaHombres += 2
      }
    }
    return victoriaHombres > victoriaMujeres
      ? [MASCULINO, victoriaHombres]
      : [FEMENINO, victoriaMujeres];
  };
}

iniciarSimualcion = async () => {
  await mostrarDiv();
  var simulacion = new Simulacion();
  await simulacion.iniciarSimualcion();
  await simulacion.calcularReportes();
  console.log(
    "Promedio de puntos de suerte ganados en cada una de las partidas "
  );
  console.log(simulacion.promedioSuerte);
  mostrarPromedios(simulacion.promedioSuerte,"Promedio de puntos de suerte ganados en cada una de las partidas ");
  console.log(
    "Promedio de puntos de experiencia ganados en cada una de las partidas "
  );
  console.log(simulacion.promedioExperiencia);
  mostrarPromedios(simulacion.promedioExperiencia,"Promedio de puntos de experiencia ganados en cada una de las partidas ");
  console.log("Jugadores con mas suerte en cada escenario");
  console.log(simulacion.listaJugadorMasSuerteEscenarios);
  mostrarReportesJugadoresSuerte(simulacion.listaJugadorMasSuerteEscenarios,"Jugadores con mas suerte en cada escenario");
  console.log("Jugadores con mas experiencia en cada escenario");
  console.log(simulacion.listaJugadorMasExperienciaEscenarios);
  mostrarReportesJugadoresExperiencia(simulacion.listaJugadorMasExperienciaEscenarios,"Jugadores con mas experiencia en cada escenario");
  console.log("Equipos con mas victorias en cada escenario");
  console.log(simulacion.listaEquiposMasVictoriasEscenarios);
  mostrarReportesEquiposVictoriaEscenario(simulacion.listaEquiposMasVictoriasEscenarios,"Equipos con mas victorias en cada escenario");
  console.log("Equipo con mas victorias totales");
  console.log(simulacion.equipoMasVictoriasTotales);
  mostrarReportesEquipoVictoria(simulacion.equipoMasVictoriasTotales,"Equipo con mas victorias totales");
  console.log("Genero con mas victorias por escenario");
  console.log(simulacion.generoMasVistoriasEscenarios);
  mostrarReportesGeneroVictoriaEscenario(simulacion.generoMasVistoriasEscenarios,"Genero con mas victorias por escenario");
  console.log("Genero con mas victorias totales" );
  console.log(simulacion.generoMasVictoriasTotales);
  mostrarReportesGeneroVictoriaTotal(simulacion.generoMasVictoriasTotales,"Genero con mas victorias totales");
};
