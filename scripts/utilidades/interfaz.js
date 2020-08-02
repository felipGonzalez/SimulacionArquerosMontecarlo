window.addEventListener('load', function () {
    document.querySelector("#resultados").style.display = "none";
    document.querySelector("#reporte").style.display = "none";
});


mostrarDiv = () => {
    document.querySelector("#resultados").style.display = "block";
    document.querySelector("#reporte").style.display = "block";
}

var tr_items = [
    "Escenario",
    "Numero de Rondas",
    "Partidas ganadas Equipo A",
    "Partidas ganadas Equipo B",
    "Equipo Ganador",
    "Arquero equipo A con mas suerte",
    "Arquero equipo B con mas suerte",
    "Arquero con mas experiencia",
    "Suerte total Ganada",
    "Experiencia Total Ganada"
];

crearTabla = async (data) => {
   var divResponsivo = document.createElement("div");
   divResponsivo.classList.add("table-responsive");

   var table = document.createElement("table");
   table.classList.add("table");
   table.classList.add("table-sm");
   table.classList.add("table-dark");

    var body = document.createElement("tbody");
    for (let i = 0; i < tr_items.length; i++) {
        tr = document.createElement("tr");
        var td_item = document.createElement("td");
        var td_value = document.createElement("td");
        var value_item = document.createTextNode(tr_items[i]);
        var value = document.createTextNode(data[i]);
        
        td_item.appendChild(value_item)
        td_value.appendChild(value);
        tr.appendChild(td_item);
        tr.appendChild(td_value);
        body.appendChild(tr);
    }
    table.appendChild(body);
    return table;
}

mostrarDatosPartida = async (datos, indice) => {
    var divResultado = document.querySelector("#resultados");
    var divAlerta = document.createElement("div");
    divAlerta.classList.add("alert")
    divAlerta.classList.add("alert-primary")

    var h4 = document.createElement("h4");
    h4.innerText = `Partida ${indice + 1}`;
    divAlerta.appendChild(h4);
    divResultado.appendChild(divAlerta);

    var table = await this.crearTabla(datos);
    divResultado.appendChild(table);
}

mostrarPromedios = async(datos, mensaje) => {
    var divreporte = document.querySelector("#reporte");
    var h4 = document.createElement("h4");
    var p = document.createElement("p")
    h4.innerText = "- " + mensaje;
    p.innerHTML = datos;
    divreporte.appendChild(h4);
    divreporte.appendChild(p);
    
}

mostrarReportesJugadoresSuerte = async(datos, mensaje) => {
    var divreporte = document.querySelector("#reporte");
    var h4 = document.createElement("h4");
    h4.innerText = "- " + mensaje;
    divreporte.appendChild(h4);
    for (let i = 0; i < datos.length; i++) {
        var p = document.createElement("p")
        p.innerHTML = ESCENARIOS[datos[i][1]] + " Arquero "+ (datos[i][0] !== null ? datos[i][0].nombre +  " , " + datos[i][0].suerte: "---")
        divreporte.appendChild(p);
    }    
}

mostrarReportesJugadoresExperiencia = async(datos, mensaje) => {
    var divreporte = document.querySelector("#reporte");
    var h4 = document.createElement("h4");
    h4.innerText = "- " + mensaje;
    divreporte.appendChild(h4);
    for (let i = 0; i < datos.length; i++) {
        var p = document.createElement("p")
        p.innerHTML = ESCENARIOS[datos[i][1]] + " Arquero "+ (datos[i][0] !== null ? datos[i][0].nombre +  " , " + datos[i][0].experiencia: "---")
        divreporte.appendChild(p);
    }    
}

mostrarReportesEquiposVictoriaEscenario = async(datos, mensaje) => {
    var divreporte = document.querySelector("#reporte");
    var h4 = document.createElement("h4");
    h4.innerText = "- " + mensaje;
    divreporte.appendChild(h4);
    for (let i = 0; i < datos.length; i++) {
        var p = document.createElement("p")
        p.innerHTML = ESCENARIOS[i] + " Equipo "+ datos[i][0] + " , Victorias " + datos[i][1];
        divreporte.appendChild(p);
    }    
}

mostrarReportesEquipoVictoria = async(datos, mensaje) => {
    var divreporte = document.querySelector("#reporte");
    var h4 = document.createElement("h4");
    h4.innerText = "- " + mensaje;
    divreporte.appendChild(h4);
    var p = document.createElement("p")
    p.innerHTML = " Equipo "+ datos[0] + " , Victorias " + datos[1];
    divreporte.appendChild(p);
}

mostrarReportesGeneroVictoriaEscenario = async(datos, mensaje) => {
    var divreporte = document.querySelector("#reporte");
    var h4 = document.createElement("h4");
    h4.innerText = "- " + mensaje;
    divreporte.appendChild(h4);
    for (let i = 0; i < datos.length; i++) {
        var p = document.createElement("p")
        p.innerHTML = ESCENARIOS[i] + " Genero "+ (datos[i][0] === MASCULINO ? " Masculino " : " Femenino ") + " , Victorias : " + datos[i][1]  
        divreporte.appendChild(p);
    }    
}

mostrarReportesGeneroVictoriaTotal = async(datos, mensaje) => {
    var divreporte = document.querySelector("#reporte");
    var h4 = document.createElement("h4");
    h4.innerText = "- " + mensaje;
    divreporte.appendChild(h4);
    var p = document.createElement("p")
    p.innerHTML = " Genero "+ (datos[0] === MASCULINO ? " Masculino " : " Femenino ") + " , Victorias : " + datos[1]  
    divreporte.appendChild(p);
}



