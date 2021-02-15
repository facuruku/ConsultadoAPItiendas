const tiendaURL = "http://localhost:8080/EmptInfRs_MezaFacundo/webresources/tiendarest";


function mostrarLoader(){
    document.querySelector("#carga").style.display = "block";
}

function ocultarLoader() {

    document.querySelector("#carga").style.display = "none";

}

var tiendas = [];


const xhrButton = document.querySelector("#xhr");
xhrButton.addEventListener("click", getTiendasXHR, false);
function getTiendasXHR(){

    const client = new XMLHttpRequest();

    client.open("GET", tiendaURL);

    client.addEventListener("readystatechange", () => {
        if (client.readyState == 4 && client.status == 200){
            tiendas = JSON.parse(client.responseText);
            // console.log(tiendas);
        }else{
            console.log("readyState:"+client.readyState);
            console.log("Status:"+client.status);
        }
            
    });

    client.send();
    return console.log(tiendas);

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
                    console.log(json);

            })
            .catch(err => {
                console.error("ERROR: ", err.message)
            });
    }catch(Exception){
        console.log("error mi niño");

    }
}



// jQuery

const jQueryButton = document.querySelector("#jquery");
jQueryButton.addEventListener("click",getTiendasjQuery,false);

function getTiendasjQuery(){

    loading = $("#carga").hide();

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
            mostrarTiendas();
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

function quitarMetodo(){
    document.querySelector(".metodo").remove();
}
function mostrarTiendas(){

    if (tiendas == null) {
        console.log("no hay tiendas");
    }else{
        console.log(tiendas);
        quitarMetodo();

        var cajaTiendas = crearNodo("div", "", ["tiendas"], []);

        tiendas.forEach(tienda => {
            console.log(tienda)
            let tiendaNodo = crearNodo("div","",[],[{"name":"id","value":"tienda"}]);
            tiendaNodo.appendChild(crearNodo("h2",tienda.nombreTienda,[],[]));
            tiendaNodo.appendChild(crearNodo("p",tienda.direccion+" ("+tienda.localidad+")",[],[]));
            tiendaNodo.appendChild(crearNodo("p",tienda.telefono,[],[]));

            cajaTiendas.appendChild(tiendaNodo);

            document.querySelector(".contenido").appendChild(cajaTiendas);

        });
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