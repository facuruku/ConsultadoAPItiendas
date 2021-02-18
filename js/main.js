const tiendasURL = "https://webapp-210130211157.azurewebsites.net/webresources/mitienda/";


function mostrarLoader(){
    document.querySelector("#carga").style.display = "block";
}

function ocultarLoader() {
    document.querySelector("#carga").style.display = "none";
}

function quitarElegirMetodo() {
    if (document.querySelector(".metodo") != null) {
        document.querySelector(".metodo").remove();
    }
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

function postTiendaXHR(tiendaJSON) {

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

function postTiendaFetch(tiendaJSON){

}

// jQuery

const jQueryButton = document.querySelector("#jquery");
jQueryButton.addEventListener("click",getTiendasjQuery,false);

function getTiendasjQuery(){
    
    metodoElegido = "jquery";
    var tiendas = [];
    if (document.querySelector(".tiendas") != null) {
        document.querySelector(".tiendas").remove();
    }

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
        }
    });
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
        }
    });
}

function postTiendajQuery(tienda){

    var request = $.ajax({
        url: tiendasURL,
        type: "post",
        data: JSON.stringify(tienda),
        dataType: "json"
    });

    request.done(function (msg) {
        console.log(msg);
    });

    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });

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


function mostrarFormulario(){
    let formTemplate = document.querySelector("#form-template");
    let form = document.importNode(formTemplate.content, true);
    if(document.querySelector(".form") == null){

        document.querySelector(".contenido").insertBefore(form, document.querySelector(".tiendas"));
        document.querySelector(".form").style.webkitAnimationPlayState = "running";
        document.querySelector(".form button").addEventListener("click",addTienda,false);
        
        const nombre = document.getElementById("nombre");
        nombre.addEventListener("input", function () {
            validarCampo(nombre, "");

        }, false);

        const direccion = document.getElementById("direccion");
        direccion.addEventListener("input", function () {
        validarCampo(direccion,"");
        }, false);

        const telefono = document.getElementById("telefono");
        telefono.addEventListener("input", function () {
            validarCampo(telefono,"El teléfono ha de tener 9 cifras y empezar por 6, 8 o 9")
        }, false);

        const localidad = document.getElementById("localidad");
        localidad.addEventListener("input", function () {
            validarCampo(localidad, "");
        },false);

    }
}

function validarForm(){
    var esValido = true;
    
    if(!validarCampo(document.getElementById("nombre"),"")){
        esValido = false;
    }
    if(!validarCampo(document.getElementById("direccion"),"")){
        esValido = false;
    }
    if(!validarCampo(document.getElementById("localidad"),"")){
        esValido = false;
    }
    if (!validarCampo(document.getElementById("telefono"),"El teléfono ha de tener 9 cifras y empezar por 6, 8 o 9")) {
        esValido = false;
    }
 
    return esValido;
}

function validarCampo(campo,msgError){

    var esValido = true;
    var validStyle = "solid 1px green";
    var invalidStyle = "solid 1px red";

    if (campo.checkValidity()) {
        campo.style.border = validStyle;
        if (campo.nextElementSibling.childElementCount > 0) {
            campo.nextElementSibling.firstElementChild.remove();
        }
    } else {
        esValido = false;
        campo.style.border = invalidStyle;
        mostrarError(campo, msgError);
    }
    return esValido;
}

function mostrarError(element,msgError){

    if (element.nextElementSibling.childElementCount > 0) {
        element.nextElementSibling.firstElementChild.remove();
    }
    var error = document.createElement("p");

    if (element.value == "") {
        error.appendChild(document.createTextNode("Campo requerido."));
    } else {
        error.appendChild(document.createTextNode(msgError));
    }
    element.nextElementSibling.appendChild(error);
}


function addTienda(){

    if(validarForm()){
        var tienda = {
            id:1,
            nombre : document.getElementById("nombre").value,
            direccion : document.getElementById("direccion").value,
            localidad : document.getElementById("localidad").value,
            telefono : document.getElementById("telefono").value
        }
        document.querySelector(".form").remove();
        console.log(JSON.stringify(tienda));
        switch(metodoElegido){
            case "xhr": //postTiendaXHR()
                break;
            case "fetch": //postTiendaFetch()
                break;
            case "jquery": postTiendajQuery(tienda)
                break;
        }

    }
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