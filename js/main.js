const tiendaURL = "http://localhost:8080/EmptInfRs_MezaFacundo/webresources/tiendarest";


function mostrarLoader(){
    document.querySelector("#carga").style.display = "block";
}

function ocultarLoader() {

    document.querySelector("#carga").style.display = "none";

}

var tiendas = [];
var metodoElegido = "";

const xhrButton = document.querySelector("#xhr");
xhrButton.addEventListener("click", getTiendasXHR, false);
function getTiendasXHR(){
    metodoElegido = "xhr";

    const client = new XMLHttpRequest();

    client.open("GET", tiendaURL);

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


function getTiendasFetch() {

    metodoElegido = "fetch";

    const options = {
        method: "GET"
    };
    try{

        fetch(tiendaURL, options)
            .then(response => {
                if (response.ok) {
                    console.log("response ok")
                } else {
                    console.log("Error en la peticion")

                    throw new Error(response.status);
                }
            })
            .then(data => {
                    const json = JSON.parse(data);
                    tiendas = JSON.parse(data);
                    //console.log(json);

            })
            .catch(err => {
                console.error("ERROR: ", err.message)
            });
    }catch(Exception){
        console.log("error");

    }
}



// jQuery

const jQueryButton = document.querySelector("#jquery");
jQueryButton.addEventListener("click",getTiendasjQuery,false);

function getTiendasjQuery(){
    
    metodoElegido = "jquery";


    // document.querySelector(".metodo").style.display = "none";
    // document.querySelector("#carga").style.display = "block";

    $.ajax({
        type: "GET",
        dataType: "json",
        url: tiendaURL,
        timeout: 10000,
        beforeSend: () => {
            mostrarLoader();
            console.log("no empezo");
        },
        success: data => {
            console.log("success");
            // en data tenemos lo recibido
            tiendas = data;
        },
        complete: () => {
            console.log("complete");
            ocultarLoader();
            mostrarTiendas(tiendas);
        },
        error: () => {
            
            document.getElementById("carga").style.display = "none";
            document.querySelector(".metodo").style.display = "flex";
            console.log("error en la peticion");
            let error = document.createElement("p");
            error.appendChild(document.createTextNode("Error en la peticion"));
            error.setAttribute("id", "error");
            document.querySelector(".metodo").appendChild(error);
        },
        always: () => {
            ocultarLoader();
            alert("complete");
        }
    });

    return tiendas;
}

function getTiendajQuery(idTienda){

    $.ajax({
        type: "GET",
        dataType: "json",
        url: tiendaURL+"/"+idTienda,
        timeout: 10000,
        beforeSend: () => {
            mostrarLoader();
            console.log("no empezo");
        },
        success: data => {
            console.log("success");
            // en data tenemos lo recibido
            tiendas = [data];
            console.log(tiendas)
        },
        complete: () => {
            console.log("complete");
            ocultarLoader();
            mostrarTiendas(tiendas);
        },
        error: () => {
            document.getElementById("carga").style.display = "none";
        },
        always: () => {
            ocultarLoader();
            alert("complete");
        }
    });

}

function quitarMetodo(){
    if (document.querySelector(".metodo") != null){
        document.querySelector(".metodo").remove();
    }
}
const contenidoContainer = document.querySelector(".contenido");

function mostrarTiendas(tiendas){

    if (document.querySelector(".tiendas") != null) {
        document.querySelector(".tiendas").remove();
    }

    if (tiendas.length == 0) {
        alert("No existe la tienda especificada");

    }else{
        quitarMetodo();
        if(!document.querySelector("#menu").childElementCount > 0){
            mostrarMenu();
        }
        var cajaTiendas = crearNodo("div", "", ["tiendas"], []);

        tiendas.forEach(tienda => {

            let tiendaNodo = crearNodo("div","",[],[{"name":"id","value":"tienda"}]);
            tiendaNodo.appendChild(crearNodo("h2",tienda.nombreTienda,[],[]));
            tiendaNodo.appendChild(crearNodo("p",tienda.direccion+" ("+tienda.localidad+")",[],[]));
            tiendaNodo.appendChild(crearNodo("p",tienda.telefono,[],[]));

            cajaTiendas.appendChild(tiendaNodo);

            contenidoContainer.appendChild(cajaTiendas);
            
        });
        tiendas.splice(0, tiendas.length);
        
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
            getTiendasjQuery();
        }else{
            alert("ID de Tienda inválido");

        }

    }else{
        
        getTiendajQuery(idTiendaInput);
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