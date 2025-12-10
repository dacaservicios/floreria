let rutaElemento="td a.crud";
let ancho;
let mesaList;
let deliveryList;

let opcionesToast = {
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "containerId": 'toast-bottom-right',
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "10000",
    "extendedTimeOut": "0",
}


$(document).ready(function() {
    nobackbutton();
    atrazNO();
    //init();
    datosUsuario();
    menu();

    $('#salir').off( 'click');
    $('#salir').on( 'click',function () {
        salir();
    });
    
    $('#cambiaPassword').off( 'click');
    $('#cambiaPassword').on( 'click',function () {
        vistaCambiaPassword();
    });

    $('.vuelveMenu').off( 'click');
    $('.vuelveMenu').on( 'click',function () {
        portada();
    });

});
