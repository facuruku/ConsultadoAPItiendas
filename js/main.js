var button = document.querySelector("button");


// $("button").click(() => {
//     $.ajax({
//         type: "GET",
//         dataType: "json",
//         url: "http://localhost:8080/EmptInfRs_MezaFacundo/webresources/tiendarest",
//         beforeStart: () => {
//             //oading.show();
//         },
//         success: data => {
//             alert("success");
//             // en data tenemos lo recibido
//             console.info(data);
//             loadData(data);
//         },
//         complete: () => {
//             //loading.hide();
//         },
//         error: () => {
//             alert("error");
//         },
//         always: () => {
//             alert("complete");
//         }
//     });
// });

// function loadData(response) {
//     txt = "";
//     $.each(response.data, (i, item) => {
//         txt += item + " - ";
//     });

// };



$("button").click(() => {
    // Obtiene información en formato JSON desde el servidor
    // eslint-disable-next-line no-undef
    $.getJSON('http://localhost:8080/EmptInfRs_MezaFacundo/webresources/tiendarest/', function (respuesta) {
        // eslint-disable-next-line no-undef
        $.each(respuesta, function (k, v) {
            console.log(k + ' : ' + v);
        });
    });
});