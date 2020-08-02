class Partida {
  constructor(escenario, equipoA, equipoB) {
    this.listaRondas = [];
    this.rondaActual;
    this.arqueroSuerteA;
    this.arqueroSuerteB;
    this.suerteTotal = 0;
    this.contadorAumentoSuerte = 0;
    this.contadorSuerteA = 0;
    this.contadorSuerteB = 0;
    this.escenario = escenario;
    this.equipoA = equipoA;
    this.equipoB = equipoB;
    this.rondaGandaA = 0;
    this.rondaGandaB = 0;
    this.equipoGanadaor = null;
    this.experenciaAcumulada = 0;
    this.contadorAumentoExperiencia = 0;
    this.listaGanadoresRonda = [];
    this.arqueroMasExperiencia;
  }

  inicarPartida = async () => {
    while (
      this.rondaGandaA != NUMERO_RONDAS &&
      this.rondaGandaB != NUMERO_RONDAS
    ) {
      this.rondaActual = new Ronda(
        _.cloneDeep(this.equipoA),
        _.cloneDeep(this.equipoB),
        this.escenario
      );

      await this.rondaActual.iniciarRonda();

      this.rondaActual.equipoGanadaor == EQUIPO_A
        ? (this.rondaGandaA += 1)
        : (this.rondaGandaB += 1);

      this.listaRondas.push(_.cloneDeep(this.rondaActual));
      var valuesA = await this.verificarSuerte(
        this.arqueroSuerteA,
        this.rondaActual.arqueroSuerteA,
        this.contadorSuerteA
      );
      this.arqueroSuerteA = valuesA[0];
      this.contadorSuerteA = valuesA[1];

      var valuesB = await this.verificarSuerte(
        this.arqueroSuerteB,
        this.rondaActual.arqueroSuerteB,
        this.contadorSuerteB
      );
      this.arqueroSuerteB = valuesB[0];
      this.contadorSuerteB = valuesB[1];
      this.contadorAumentoExperiencia += this.rondaActual.contadorAumentoExperiencia;
      this.experenciaAcumulada += this.rondaActual.experenciaAcumulada;
      await this.agregarArqueroGanador(this.rondaActual.arqueroGanador);
      await this.restaurarValores();
    }
  };

  async verificarSuerte(arqueroPartida, arqueroRonda, contador) {
    if (arqueroPartida !== undefined) {
      if (arqueroPartida.nombre === arqueroRonda.nombre) {
        contador += 1;
        if (contador == 3) {
          contador = 0;
          this.suerteTotal += 0.05;
          this.contadorAumentoSuerte += 1;
          arqueroPartida = arqueroRonda;
        }
      } else {
        contador = 0;
        arqueroPartida = arqueroRonda;
      }
    } else {
      arqueroPartida = arqueroRonda;
      contador += 1;
    }
    return [arqueroPartida, contador];
  }

  agregarArqueroGanador = async (arquero) => {
    if (this.listaGanadoresRonda.length !== 0) {
      var indexArquero = this.listaGanadoresRonda
        .map(function (e) {
          return e.key;
        })
        .indexOf(arquero.nombre);
      if (indexArquero !== -1) {
        this.listaGanadoresRonda[indexArquero].value += 0.2;
      } else {
        this.listaGanadoresRonda.push({
          key: arquero.nombre,
          value: 0.2,
        });
      }
    } else {
      this.listaGanadoresRonda.push({
        key: arquero.nombre,
        value: 0.2,
      });
    }
  };

  restaurarValores = async () => {
    let equipoA = _.cloneDeep(this.rondaActual.equipoA);
    let equipoB = _.cloneDeep(this.rondaActual.equipoB);
    for (let i = 0; i < NUMERO_PARTICIPANTE; i++) {
      this.equipoA[i].experiencia = equipoA[i].experiencia;
      this.equipoB[i].experiencia = equipoB[i].experiencia;
      this.equipoA[i].suerte = equipoA[i].suerte;
      this.equipoB[i].suerte = equipoB[i].suerte;
      this.equipoA[i].contadorExperiencia = equipoA[i].contadorExperiencia;
      this.equipoB[i].contadorExperiencia = equipoB[i].contadorExperiencia;
      this.equipoA[i].precisionMejorada = equipoA[i].precisionMejorada;
      this.equipoB[i].precisionMejorada = equipoB[i].precisionMejorada;
    }
  };

  obtenerArqueroMayorExperiencia = async () => {
    let arquero;
    for (let i = 0; i < this.listaGanadoresRonda.length; i++) {
      if (arquero != undefined) {
        if (arquero.value < this.listaGanadoresRonda[i].value) {
          arquero = this.listaGanadoresRonda[i];
        }
      } else {
        arquero = this.listaGanadoresRonda[i];
      }
    }
    return arquero;
  };

  resultados = async () => {
    console.log("Numero de Rondas ", this.listaRondas.length);
    console.log(this.listaRondas);
    this.rondaGandaA > this.rondaGandaB
      ? (this.equipoGanadaor = EQUIPO_A)
      : (this.equipoGanadaor = EQUIPO_B);
    console.log(`Partidas Ganadas EQUIPO_A ${this.rondaGandaA}`);
    console.log(`Partidas Ganadas EQUIPO_B ${this.rondaGandaB}`);
    console.log(
      `El equipo ganador es ${
        this.equipoGanadaor == EQUIPO_A ? "EQUIPO_A" : "EQUIPO_B"
      }`
    );
    console.log(
      "Arquero EQUIPO_A con mas suerte en la partido ",
      this.arqueroSuerteA
    );
    console.log(
      "Arquero EQUIPO_B con mas suerte en la partido ",
      this.arqueroSuerteB
    );
    console.log("Suerte total ", this.suerteTotal);
    console.log("Experiencia Toltal ", this.experenciaAcumulada);
    this.arqueroMasExperiencia = await this.obtenerArqueroMayorExperiencia();
    console.log("Arquero con mas experiencia  ", this.arqueroMasExperiencia);



    return [
      ESCENARIOS[this.escenario],
      this.listaRondas.length,
      this.rondaGandaA,
      this.rondaGandaB,
      this.equipoGanadaor,
      `${this.arqueroSuerteA.nombre} , ${this.arqueroSuerteA.suerte}`,
      `${this.arqueroSuerteB.nombre} ,   ${this.arqueroSuerteB.suerte}`,
      `${this.arqueroSuerteA.nombre} ,  ${this.arqueroSuerteA.experiencia}`,
      this.suerteTotal,
      this.experenciaAcumulada,
    ];
  };
}
