const tiendasURL = "https://webapp-210130211157.azurewebsites.net/webresources/mitienda/";


function mostrarLoader(){
    document.querySelector("#carga").style.display = "block";
}

function ocultarLoader() {

    document.querySelector("#carga").style.display = "none";

}

var metodoElegido = "";

const xhrButton = document.querySelector("#xhr");
xhrButton.addEventListener("click", getTiendasXHR, false);

function getTiendasXHR(){
    metodoElegido = "xhr";
    var tiendas = [];
    const client = new XMLHttpRequest();

    client.open("GET", tiendasURL);

    client.addEventListener("readystatechange", () => {
        if (client.readyState == 4 && client.status == 200){
            tiendas = JSON.parse(client.responseText);
            // console.log(tiendas);
        }else{
            //console.log("readyState:"+client.readyState);
            //console.log("Status:"+client.status);
        }
            
    });

    client.send();
    return tiendas;

}

function loadData(response) {
    let txt = "";
    $.each(response.data, (i, item) => {
        txt += item + " - ";
        console.log(txt);
    });

};




const fetchButton = document.querySelector("#fetch");
fetchButton.addEventListener("click",getTiendasFetch,false);


async function getTiendasFetch() {
    metodoElegido = "fetch";
    quitarMetodo();
    mostrarLoader();
    const response = await fetch(tiendasURL);
    ocultarLoader();
    if(response.ok){
        response.json()
        .then(data => mostrarTiendas(data));
    }else{
        console.log("error fetch");
    }
       
}

async function getTiendaFetch(idTienda){
    var tienda = [];
    mostrarLoader();
    const response = await fetch(tiendasURL+"/"+idTienda);
    ocultarLoader();
    if(response.ok){
        response.json()
        .then(data => {
            tienda.push(data);
            mostrarTiendas(tienda);
        });
    }else{
        console.log("error fetch")
    }
    return tienda;
}



// jQuery

const jQueryButton = document.querySelector("#jquery");
jQueryButton.addEventListener("click",getTiendasjQuery,false);

function getTiendasjQuery(){
    
    metodoElegido = "jquery";
    var tiendas = null;

    $.ajax({
        type: "GET",
        dataType: "json",
        url: tiendasURL,
        timeout: 10000,
        beforeSend: () => {
            quitarMetodo();
            mostrarLoader();
        },
        success: data => {
            // en data tenemos lo recibido
            tiendas = data;
        },
        complete: () => {
            ocultarLoader();
            mostrarTiendas(tiendas);
        },
        error: () => {
            
            ocultarLoader();
            document.querySelector(".metodo").style.display = "flex";
            console.log("error en la peticion");

            // let error = document.createElement("p");
            // error.appendChild(document.createTextNode("Error en la peticion"));
            // error.setAttribute("id", "error");
            // document.querySelector(".metodo").appendChild(error);
        },
        always: () => {
            ocultarLoader();
            alert("complete");
        }
    });

    return tiendas;
}

function getTiendajQuery(idTienda){

    var tienda=[];
    $.ajax({
        type: "GET",
        dataType: "json",
        url: tiendasURL+"/"+idTienda,
        timeout: 10000,
        success: data => {
            // en data tenemos lo recibido
            tienda.push(data);
            mostrarTiendas(tienda);

        },
        always: () => {
            alert("complete");
        }
    });


    return tienda;
}


function quitarMetodo(){
    if (document.querySelector(".metodo") != null){
        document.querySelector(".metodo").remove();
    }
}
const contenidoContainer = document.querySelector(".contenido");


function mostrarTiendas(tiendas){
console.log(tiendas);
    if (document.querySelector(".tiendas") != null) {
        document.querySelector(".tiendas").remove();
    }
    if (document.querySelector("#noTiendas") != null) {
        document.querySelector("#noTiendas").remove();
    }

    if(tiendas.length == 0 ){
        if(document.querySelector("#noTiendas") == null){
            contenidoContainer.appendChild(crearNodo("p", "No hay tiendas", [], [{
                "name": "id",
                "value": "noTiendas"
            }]));
        }

    }else{

        if (!document.querySelector("#menu").childElementCount > 0) {
            mostrarMenu();
        }

        var cajaTiendas = crearNodo("div", "", ["tiendas"], []);

        tiendas.forEach(tienda => {

            let tiendaNodo = crearNodo("div", "", [], [{
                "name": "id",
                "value": "tienda"
            }]);
            tiendaNodo.appendChild(crearNodo("h2", tienda.nombreTienda, [], []));
            tiendaNodo.appendChild(crearNodo("p", tienda.direccion + " (" + tienda.localidad + ")", [], []));
            tiendaNodo.appendChild(crearNodo("p", tienda.telefono, [], []));

            cajaTiendas.appendChild(tiendaNodo);

            contenidoContainer.appendChild(cajaTiendas);

        });

    }
        
    
}
function mostrarMenu(){

    let newTiendaButton = crearNodo("p", "Nueva Tienda", [], [{
        "name": "id",
        "value": "nuevaTiendaButton"
    }]);
    newTiendaButton.addEventListener("click", mostrarFormulario, false);
    document.querySelector("#menu").appendChild(newTiendaButton);

    let buscadorContainer = crearNodo("div","",["buscador"],[]);

    let buscadorInput = crearNodo("input", "", [], [{
        "name": "id",
        "value": "buscadorInput"
    }]);
    buscadorInput.setAttribute("placeholder","ID de Tienda");
    buscadorInput.setAttribute("value","");
    let buscadorButton = crearNodo("img","",[],[{
        "name":"src",
        "value":"./img/buscar.png"
    }]);
    buscadorButton.addEventListener("click",buscarTienda,false);
    buscadorContainer.appendChild(buscadorInput);
    buscadorContainer.appendChild(buscadorButton);
    document.querySelector("#menu").appendChild(buscadorContainer);

}

function nuevaTienda(){

    
}

function mostrarFormulario(){

}

function buscarTienda(){

    let idTiendaInput = document.getElementById("buscadorInput").value
    let numValidos = new RegExp("^[0-9]+$");

    if(!numValidos.test(idTiendaInput)){

        if (idTiendaInput == "") {
            switch(metodoElegido){
                case "xhr":
                    break;
                case "fetch": getTiendasFetch();
                    break;
                case "jquery": getTiendasjQuery();
            }
            
        }else{
            alert("ID de Tienda inválido");

        }

    }else{

        switch (metodoElegido) {
            case "xhr":
                break;
            case "fetch": getTiendaFetch(idTiendaInput);
                break;
            case "jquery": mostrarTiendas(getTiendajQuery(idTiendaInput));
                break;
        }
        //buscar tienda
    }
}



function vaciarNodo(nodo) {

    while (nodo.hasChildNodes()) {

        nodo.removeChild(nodo.firstChild);
    }
}

function crearNodo(tipoElemento, textoNodo, clasesNodo, atributosNodo) {
    var nodo = document.createElement(tipoElemento);

    if (textoNodo != "") {
        var nodoTexto = document.createTextNode(textoNodo);
        nodo.appendChild(nodoTexto);
    }

    if (clasesNodo.length > 0) {
        clasesNodo.forEach(clase => {
            nodo.classList.add(clase);
        });
    }

    if (atributosNodo.length > 0) {
        atributosNodo.forEach(atributo => {
            nodo.setAttribute(atributo.name, atributo.value);
        });
    }

    return nodo;
}