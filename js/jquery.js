export var jqueryAJAX ={
    
    getTiendasjQuery(tiendaURL) {


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
    },

    getTienda(id){

    },

    newTienda(tienda){

    }
}