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

    quitarElegirMetodo();
     if (document.querySelector(".tiendas") != null) {
         document.querySelector(".tiendas").remove();
     }
    mostrarLoader();


    var tiendas = [];
    const client = new XMLHttpRequest();


    client.addEventListener("readystatechange", () => {
        if (client.readyState == 4 && client.status == 200){
            tiendas = JSON.parse(client.responseText);
            ocultarLoader();
            mostrarTiendas(tiendas);
        }else{
            //console.log("readyState:"+client.readyState);
            //console.log("Status:"+client.status);
        } 
    });

    client.open("GET", tiendasURL,true);
    client.send();

}

function getTiendaXHR(idTienda){

    if (document.querySelector(".tiendas") != null) {
        document.querySelector(".tiendas").remove();
    }

    mostrarLoader();

    var tienda = [];
    const client = new XMLHttpRequest();

    client.addEventListener("readystatechange", () => {

        if (client.readyState == 4 && client.status == 200) {
            tienda.push(JSON.parse(client.responseText));
            ocultarLoader();
            mostrarTiendas(tienda);
        } else {
            if(client.status == 204){
                ocultarLoader();
                mostrarTiendas([]);
            }
        }
    });

    client.open("GET", tiendasURL+"/"+idTienda, true);
    client.send();

    return tienda;
}


//FETCH
const fetchButton = document.querySelector("#fetch");
fetchButton.addEventListener("click",getTiendasFetch,false);


function getTiendasFetch() {
    metodoElegido = "fetch";
    quitarElegirMetodo();
    if (document.querySelector(".tiendas") != null) {
        document.querySelector(".tiendas").remove();
    }
    mostrarLoader();

    fetch(tiendasURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            ocultarLoader();
            return response.json();

        })
        .then(function (data) {
            mostrarTiendas(data);
        })
        .catch(function (err) {
            console.error("No se pudo recuperar la tienda:" + err);
            mostrarTiendas([]);
        });
       
}

function getTiendaFetch(idTienda){

    var tienda = [];
     if (document.querySelector(".tiendas") != null) {
         document.querySelector(".tiendas").remove();
     }
    mostrarLoader();

    fetch(tiendasURL+"/"+idTienda, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            ocultarLoader();
            return response.json();
        })
        .then(function (data) {
            tienda.push(data);
            mostrarTiendas(tienda);
        })
        .catch(function (err) {
            console.error("No se pudo recuperar la tienda:"+err);
            mostrarTiendas([]);
        });
    
   
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
            quitarElegirMetodo();
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

     if (document.querySelector(".tiendas") != null) {
         document.querySelector(".tiendas").remove();
     }
    $.ajax({
        type: "GET",
        dataType: "json",
        url: tiendasURL+"/"+idTienda,
        timeout: 10000,
        beforeSend: () => {
            mostrarLoader();
        },
        success: data => {
            // en data tenemos lo recibido
            tienda.push(data);

        }, 
        complete: () => {
            ocultarLoader();
            mostrarTiendas(tienda);
        },
        always: () => {
            alert("complete");
        }
    });


    return tienda;
}


function quitarElegirMetodo(){
    if (document.querySelector(".metodo") != null){
        document.querySelector(".metodo").remove();
    }
}
const contenidoContainer = document.querySelector(".contenido");


function mostrarTiendas(tiendas){

    if (document.querySelector(".tiendas") != null) {
        document.querySelector(".tiendas").remove();
    }
    if (document.querySelector("#noTiendas") != null) {
        document.querySelector("#noTiendas").remove();
    }

    if(tiendas.length == 0 || tiendas[0] == undefined ){

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
                case "xhr": getTiendasXHR();
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
            case "xhr": getTiendaXHR(idTiendaInput);
                break;
            case "fetch": getTiendaFetch(idTiendaInput);
                break;
            case "jquery": getTiendajQuery(idTiendaInput);
                break;
        }
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