let rutaElemento="td a.crud";
let ancho;


$(document).ready(function() {
    atrazNO();
    init();
    //actualizaDashboard();
    //menu();
    datosUsuario();
    //popup();
    tooltip();
    verificaToken();
    
    $('#salir').off( 'click');
    $('#salir').on( 'click',function () {
        salir();
        $('.main-profile-menu').removeClass('show')
    });
    
    $('#miPerfil').off( 'click');
    $('#miPerfil').on( 'click',function () {
        miPerfil();
        $('.main-profile-menu').removeClass('show')
    });

    $('#verMembresia').off( 'click');
    $('#verMembresia').on( 'click',function () {
        verMembresia();
        $('.main-profile-menu').removeClass('show')
    });

    $('#cambiaPassword').off( 'click');
    $('#cambiaPassword').on( 'click',function () {
        vistaCambiaPassword();
        $('.main-profile-menu').removeClass('show')
    });
});

function tooltip(){
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => {
        new bootstrap.Tooltip(el);
    });
}

function popup(){
    if(localStorage.getItem("popup")){
        return true;
    }else{
        success('Ya puedes probar la nueva funcionalidad de mensajería masiva a clientes!!!','"NUEVA FUNCIONALIDAD"');
        localStorage.setItem("popup",true);
    }
}

async function actualizaDashboard(){
    bloquea('Se está actualizando el dashboard');
    try {
        const recarga= await axios.get("/api/inicio/dashboard/"+verSesion()+"/"+'cron');
        if(recarga.data.valor.resultado){
            dashboard()
        }
        desbloquea();
        
    }catch (err) {
        desbloquea();	
        message=err.response.data.error.message;
        errno=err.response.data.error.errno;
        mensajeError(err.response.data.error);
    }
}


async function actualizaDashboardProd(){
    bloquea('Se está actualizando el dashboard');
    try {
        const recarga= await axios.get("/api/inicio/dashboardProd/"+verSesion()+"/"+'cron');
        if(recarga.data.valor.resultado){
            dashboardProd()
        }
        desbloquea();
        
    }catch (err) {
        desbloquea();	
        message=err.response.data.error.message;
        errno=err.response.data.error.errno;
        mensajeError(err.response.data.error);
    }
}

function atrazNO(){
    if(history.forward(1)){
        location.replace(history.forward(1))
    }
}

function init() {
    var mover= false;
        $("body").off( 'mousemove');
        $("body").on('mousemove',function(){
            mover = true;
        });

        setInterval (function() {
            if (!mover) {
                cerrarSesion();
            } else {
                mover=false;
            }
        },  1800000); // Cada 30 minutos, pon el valor que quieras.
        //}, 5000);
        //1000 = 1s, 60000 = 1m, 
 }

function dashboard(){
    try{
		$('#jsPropio').html("<script src='/java/dashboard.js?"+moment().format('DDMMYYYYHHmmss')+"'></script>");
    }catch (err) {	
		message=err.response.data.error.message;
		errno=err.response.data.error.errno;
		mensajeSistema(message);
	}
}

function dashboardProd(){
    try{
		$('#jsPropio').html("<script src='/java/dashboardProd.js?"+moment().format('DDMMYYYYHHmmss')+"'></script>");
    }catch (err) {	
		message=err.response.data.error.message;
		errno=err.response.data.error.errno;
		mensajeSistema(message);
	}
}

function salir(){
	confirm("¿Está seguro de salir de su sesión?",function(){
		return false;
	},async function(){
        bloquea();
        let body={

        }
        try{
            const salir = await axios.put("/api/acceso/logout/"+verSesion(),body,{ 
                headers:{
                    authorization: `Bearer ${verToken() }`
                } 
            });
            const resp=salir.data.valor.info;
            localStorage.removeItem('popup');
            desbloquea();
            location.reload();  
        }catch (err) {
            desbloquea();	
            message=err.response.data.error.message;
            errno=err.response.data.error.errno;
            mensajeSistema(message);
        }
	});
}


function vistaCambiaPassword(){
    try{
		$('#jsPropio').html("<script src='/java/cambiaPassword.js?"+moment().format('DDMMYYYYHHmmss')+"'></script>");
    }catch (err) {
		desbloquea();	
		message=err.response.data.error.message;
		errno=err.response.data.error.errno;
		mensajeSistema(message);
	}
}

function miPerfil(){
    try{
		$('#jsPropio').html("<script src='/java/usuarioPerfil.js?"+moment().format('DDMMYYYYHHmmss')+"'></script>");
    }catch (err) {
		desbloquea();	
		message=err.response.data.error.message;
		errno=err.response.data.error.errno;
		mensajeSistema(message);
	}
}

function verMembresia(){
    try{
		$('#jsPropio').html("<script src='/java/pagos.js?"+moment().format('DDMMYYYYHHmmss')+"'></script>");
    }catch (err) {
		desbloquea();	
		message=err.response.data.error.message;
		errno=err.response.data.error.errno;
		mensajeSistema(message);
	}
}

async function datosUsuario(){
    bloquea('Cargando datos de usuario...');
    try {
        const datosUsuario=await axios.get('/api/inicio/datos/'+verSesion(),{ 
            headers: 
            { 
                authorization: 'Bearer '+verToken()
            } 
        });
        let resp=datosUsuario.data.valor;
        desbloquea();

        if(resp.resultado){
            $("#userNivel").val(resp.info.ID_NIVEL);
            $("#userSucursal").val(resp.info.ID_SUCURSAL);
            $("span#nivelMenu, span#nivelMenu2").text(resp.info.NOMB_NIVEL);
            $("h4#usuarioMenu,h6#usuarioMenu2").html(resp.info.NOMBRE+" "+resp.info.APELLIDO_PATERNO);

            if(resp.info.ID_NIVEL==5){
                $('.ocultaMenu').remove();
                //$('.ocultaHeader').remove();
                $('.app-sidebar__toggle').remove();
                $('.ocultaHeader').css('padding-left','unset');
                $('.ocultaHeader').css('height','50px');
                $('.anchoCompleto').css('margin-left','unset');
                $('.jumps-prevent').css('padding-top',0);
                $('#cuerpoPrincipal').css('padding-top','50px');
                $('#miPerfil').remove();
                $('#verMembresia').remove();
                $('#cambiaPassword').remove();

                vistaMenuSubMenu({ruta:'venta',idSubMenu:64});
            }else{ 
                menu();
                actualizaDashboardProd();

                if(resp.info.IMAGEN_SUCURSAL!='' && resp.info.IMAGEN_SUCURSAL!==null){
                    $("img.imagenSucursalInicio").attr('src','/imagenes/sucursal/SUC_'+resp.info.ID_SUCURSAL+'_'+resp.info.IMAGEN_SUCURSAL);
                }else if(resp.info.IMAGEN_EMPRESA!='' && resp.info.IMAGEN_EMPRESA!==null){
                    $("img.imagenSucursalInicio").attr('src','/imagenes/empresa/EMP_'+resp.info.ID_EMPRESA+'_'+resp.info.IMAGEN_EMPRESA);
                }else{
                    $("img.imagenSucursalInicio").attr('src','/imagenes/vacio.jpg');
                }
                if(resp.info.IMAGEN=='' || resp.info.IMAGEN===null){
                    $("img.imagenUsuarioInicio").attr('src','/imagenes/vacio.jpg');
                }else{
                    $("img.imagenUsuarioInicio").attr('src','/imagenes/usuario/USU_'+resp.info.ID_USUARIO+'_'+resp.info.IMAGEN); 
                }

                $("#sucursalVentas").text(resp.info.NOMB_SUCURSAL);
            }
            
            socket.emit('joinUsuario',{
                usuario : "U"+$("#userSesion").val()
            });

            socket.emit('joinNivel',{
                nivel : "N"+$("#userNivel").val()
            });

            socket.emit('joinSucursal',{
                sucursal: 'S'+$('#userSucursal').val()
            });
        }else{
            mensajeSistema(resp.info.mensaje);
        }
    }catch (err) {
        console.log(err)
        desbloquea();	
        message=err.response.data.error.message;
        errno=err.response.data.error.errno;
        mensajeError(err.response.data.error);
    }
}
async function menu(){
    bloquea('Cargando el menú...');
    try {
        const menuNivel= await axios.get('/api/inicio/menu/'+verSesion()+'/menuNivel/submenuNivel',{
            headers: 
            { 
                authorization: 'Bearer '+verToken()
            } 
        });
        let resp=menuNivel.data.valor;
        desbloquea();
        if(resp.resultado){
            $("#menuSubMenu").html(resp.info);
            menuClick();
            $('.inicioServicio').off( 'click');
            $('.inicioServicio').on( 'click',function () {
                actualizaDashboard();
            });
            $('.inicioProducto').off( 'click');
            $('.inicioProducto').on( 'click',function () {
                actualizaDashboardProd();
            });
            eventoSubMenu();
        }else{
            mensajeSistema(resp.info.mensaje);
        }
    }catch (err) {
        desbloquea();	
        message=err.response.data.error.message;
        errno=err.response.data.error.errno;
        mensajeError(err.response.data.error);
    }
}

function eventoSubMenu(){
    $('.eventoSubmenu').on( 'click', 'a', function () {
        let idSubMenu =$(this).attr("id");
        let ruta=$(this).attr("ruta");
		vistaMenuSubMenu({ruta:ruta.toLowerCase(),idSubMenu:idSubMenu});
    });
}

function vistaMenuSubMenu(objeto){
    try{
        $('#jsPropio').html("<script src='/java/"+objeto.ruta+".js?"+moment().format('DDMMYYYYHHmmss')+"'></script>");
    }catch (err) {
        desbloquea();	
        message=err.response.data.error.message;
        errno=err.response.data.error.errno;
        mensajeSistema(message);
    }
}


function subMenuAccesoDirecto(objeto){
    eventoSubMenu();
    $('#menuSubMenu li.menu a.active').removeClass("active");
    $('#menuSubMenu li.subMenu a.active').removeClass("active");
    let activaMenu=$('#menuSubMenu').find('li.menu'+objeto.idMenu);
    activaMenu.addClass("menu-open");
    activaMenu.find('a.menu').addClass("active");
    activaMenu.find('li.subMenu'+objeto.idSubMenu).find('a.subMenu').addClass("active");
    
}


async function guardaImpresion(impresion){
    bloquea();
    try {
        let body={
            idSucursal:$('#sucursal').val(),
			impresion:impresion,
			sesId:verSesion()
		}
        const imprime= await axios.put('/api/acceso/impresion/'+verSesion(),body,{
            headers: 
            { 
                authorization: 'Bearer '+verToken()
            } 
        });
        let resp=imprime.data.valor;
        desbloquea();
        $('#activaImpresion').val(impresion);
    }catch (err) {
        desbloquea();	message=err.response.data.error.message;
        errno=err.response.data.error.errno;
        mensajeSistema(message);
    }

}

//BOTONES
function guarda(){
    let boton=`
        <button type='Guardar' name='btnGuarda' class='crud btn btn-primary-gradient btn-md guardar'>
            <i class='la la-save'></i>
            <span id="botonGuardar" class='p-1'>Guardar</span>
        </button>`;
    return boton;
}
function crea(){
    let boton=`
        <button type='Crea' name='btnGuarda' class='crud btn btn-primary-gradient btn-md crea'>
            <i class='la la-save'></i>
            <span class='p-1'>Crear</span>
        </button>`;
    return boton;
}
function edita(){
    let boton=`
    <button type='Edita' name='btnGuarda' class='crud btn btn-primary-gradient btn-md edita'>
        <i class='la la-save'></i>
        <span class='p-1'>Modificar</span>
    </button>`;
    return boton;
}
function cancela(){
    let boton=`
    <button type='Cancela' name='btnCancela' class='mr-1 btn btn-secondary-gradient btn-md cancela'>
        <i class='la la-times'></i>
        <span class='p-1'>Cancelar</span>
    </button>`;
    return boton;
}


function limpia(){
    let boton=`
    <button type='Limpia' name='btnLimpia' class='mr-1 btn btn-info-gradient btn-md limpia'>
        <i class="las la-broom"></i>
        <span class='p-1'>Limpiar</span>
    </button>`;
    return boton;
}

function regresa(){
    let boton=`
    <button type='Regresa' name='btnRegresa' class='mr-1 btn btn-danger-gradient btn-md regresa'>
        <i class="las la-hand-point-left"></i>
        <span class='p-1'>Regresar</span>
    </button>`;
    return boton;
}

function venta(){
    let boton=`
    <button type='Venta' name='btnVenta' class='mr-1 btn btn-primary-gradient btn-md venta w-100'>
        <i class="las la-file-invoice-dollar"></i>
        <span class='p-1'>Pagar</span>
    </button>`;
    return boton;
}

function atender(){
    let boton=`
    <button type='Atencion' name='btnAtencion' class='mr-1 btn btn-primary-gradient btn-md atencion'>
        <i class="las la-file-invoice-dollar"></i>
        <span class='p-1'>Pagar</span>
    </button>`;
    return boton;
}


function borrar(){
    let boton=`
    <button type='Borrar' name='btnBorrar' class='mr-1 btn btn-danger-gradient btn-md borrar w-100'>
        <i class='las la-trash'></i>
        <span class='p-1'>Eliminar</span>
    </button>`;
    return boton;
}

function borrar2(){
    let boton=`
    <button type='Borrar' name='btnBorrar' class='mr-1 btn btn-danger-gradient btn-md borrar'>
        <i class='las la-trash'></i>
        <span class='p-1'>Eliminar</span>
    </button>`;
    return boton;
}

function compra(){
    let boton=`
    <button type='Compra' name='btnCompra' class='mr-1 btn btn-primary-gradient btn-md compra'>
        <i class="las la-file-invoice-dollar"></i>
        <span class='p-1'>Pagar</span>
    </button>`;
    return boton;
}

function pedido(){
    let boton=`
    <button type='Pedido' name='btnPedido' class='mr-1 btn btn-primary-gradient btn-md pedido'>
        <i class="las la-clipboard-list"></i>
        <span class='p-1'>Pedir</span>
    </button>`;
    return boton;
}

function buscar(){
    let boton=`
    <button type='Buscar' name='btnBuscar' class='mr-1 btn btn-primary-gradient btn-md buscar'>
        <i class="las la-search"></i>
        <span class='p-1'>Buscar</span>
    </button>`;
    return boton;
}

function descarga(){
    let boton=`
    <button type='Descarga' name='btnDescarga' class='mr-1 btn btn-secondary-gradient btn-md descarga'>
        <i class="las la-file-excel"></i>
        <span class='p-1'>Descargar</span>
    </button>`;
    return boton;
}

function quitar(){
    let boton=`
    <button type='Quitar' name='btnQuitar' class='mr-1 btn btn-danger-gradient btn-md quitar'>
        <i class='las la-trash'></i>
        <span class='p-1'>Eliminar</span>
    </button>`;
    return boton;
}
//ICONOS
function estado(){
    let boton=`
    <a type='Estado' class="crud estado cursor btn btn-sm btn-info-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Estado">
        <i class='las la-check-circle'></i>
    </a>`;
    return boton;
}
function visible(){
    let boton=`
    <a type='Visible' class="crud visible cursor btn btn-sm btn-dark-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Visible">
        <i class="las la-eye"></i></i>
    </button>`;
    return boton;
}
function modifica(){
    let boton=`
    <a type='Edita' class="crud edita cursor btn btn-sm btn-success-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar">
        <i class='las la-edit'></i>
    </a>`;
    return boton;
}
function decide(){
    let boton=`
    <a type='Decide' class="crud decide cursor btn btn-sm btn-primary-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Decidir">
        <i class="las la-search-dollar"></i>
    </a>`;
    return boton;
}
function elimina(){
    let boton=`
    <a type='Elimina' class="crud elimina cursor btn btn-sm btn-danger-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar">
        <i class='las la-trash'></i>
    </a>`;
    return boton;
}
function detalle(){
    let boton=`<a type='Detalle' class="crud detalle cursor btn btn-sm btn-secondary-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Detalle">
        <i class="las la-list-ol"></i>
    </a>`;
    return boton;
}
function contrasena(){
    let boton=`<a type='Contrasena' class="crud contrasena cursor btn btn-sm btn-warning-gradient" data-toggle="tooltip" data-placement="top" title="Contraseña">
				<i class='las la-key'></i>
			</a>`;
    return boton;
}

function clave(){
    let boton=`<a type='Clave' class="crud clave cursor btn btn-sm btn-warning-gradient" data-toggle="tooltip" data-placement="top" title="Clave">
				<i class="las la-shield-alt"></i>
			</a>`;
    return boton;
}

function bloqueo(){
    let boton=`<a type='Bloqueo' class="crud bloqueo cursor btn btn-sm btn-light-gradient" data-toggle="tooltip" data-placement="top" title="Bloqueo">
            <i class='las la-times-circle'></i>
        </a>`;
        return boton;
}
function sucursal(){
    let boton=`<a type='Sucursal' class="crud sucursal cursor btn btn-sm btn-primary-gradient" data-toggle="tooltip" data-placement="top" title="Sucursal">
            <i class="las la-store-alt"></i>
        </a>`;
    return boton;
}
function empresa(){
    let boton=`<a type='Empresa' class="crud empresa cursor btn btn-sm btn-dark-gradient" data-toggle="tooltip" data-placement="top" title="Empresa">
            <i class="las la-clipboard-check"></i>
        </a>`;
    return boton;
}

//========ESTADOS==============
function recibido(){
    let boton=`<a type='Recibido' abrev="RECB" verbo="RECIBIR" class="verbo crud recibido cursor btn btn-sm btn-primary-gradient" data-toggle="tooltip" data-placement="top" title="Recibido">
            <i class="las la-thumbs-up"></i>
        </a>`;
    return boton;
}

function rechazado(){
    let boton=`<a type='Rechazado' abrev="RCHA" verbo="RECHAZAR" class="verbo crud rechazado cursor btn btn-sm btn-danger-gradient" data-toggle="tooltip" data-placement="top" title="Rechazado">
            <i class="las la-thumbs-down"></i>
        </a>`;
    return boton;
}

function atendido(){
    let boton=`<a type='Atencion' abrev="ENAT" verbo="ATENDER"class="verbo crud atencion cursor btn btn-sm btn-secondary-gradient" data-toggle="tooltip" data-placement="top" title="Atencion">
            <i class="las la-hard-hat"></i>
        </a>`;
    return boton;
}

function enviado(){
    let boton=`<a type='Enviado' abrev="EVIA" verbo="ENVIAR" class="verbo crud enviado cursor btn btn-sm btn-info-gradient" data-toggle="tooltip" data-placement="top" title="Enviado">
            <i class="lab la-telegram"></i>
        </a>`;
    return boton;
}

function entregado(){
    let boton=`<a type='Entregado' abrev="ENGO" verbo="ENTREGAR" class="verbo crud entregado cursor btn btn-sm btn-success-gradient" data-toggle="tooltip" data-placement="top" title="Entregado">
            <i class="las la-thumbs-up"></i>
        </a>`;
    return boton;
}

function devuelto(){
    let boton=`<a type='Devuelto' abrev="DETO" verbo="DEVOLVER" class="verbo crud devuelto cursor btn btn-sm btn-danger-gradient" data-toggle="tooltip" data-placement="top" title="Devuelto">
            <i class="las la-thumbs-down"></i>
        </a>`;
    return boton;
}

function ingresado(){
    let boton=`<a type='Ingresado' abrev="IGSD" verbo="INGRESAR" class="verbo crud ingresado cursor btn btn-sm btn-success-gradient" data-toggle="tooltip" data-placement="top" title="Ingresado">
            <i class="lab la-telegram"></i>
        </a>`;
    return boton;
}
//========ESTADOS==============

function enviar(){
    let boton=`<a type='Enviar' class="crud enviar cursor btn btn-sm btn-success-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Enviar">
            <i class="las la-envelope-open-text"></i>
        </a>`;
    return boton;
}
function ver(){
    let boton=`<a type='Ver' class="crud ver cursor btn btn-sm btn-primary-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Ver">
                <i class="las la-eye"></i>
        </a>`;
    return boton;
}
function asignar(){
    let boton=`<a type='Asignar' class="crud asignar cursor btn btn-sm btn-success-gradient" data-bs-toggle="tooltip" data-bs-placement="top" title="Asignar">
                <i class="las la-list-alt"></i>
        </a>`;
    return boton;
}

function cambiar(){
    let boton=`
    <a type='Cambiar' class="crud cambiar cursor btn btn-sm btn-info-gradient" data-toggle="tooltip" data-placement="top" title="Cambiar">
        <i class='las la-check-circle'></i>
    </a>`;
    return boton;
}

function historial(){
    let boton=`
    <a type='Historial' class="crud historial cursor btn btn-sm btn-info-gradient" data-toggle="tooltip" data-placement="top" title="Historial">
        <i class="las la-history"></i>
    </a>`;
    return boton;
}

function identificarTipoDocumento(texto) {
    // 1. Limpiar el texto (eliminar espacios en blanco)
    const documento = String(texto).trim();
    
    // 2. Verificar que solo contenga dígitos
    if (!/^\d+$/.test(documento)) {
        return 'INVALIDO';
    }

    // 3. Evaluar por longitud
    if (documento.length === 8) {
        return 'DNI';
    } else if (documento.length === 11) {
        return 'RUC'; 
    } else {
        return 'INVALIDO';
    }
}


async function consultarReniecSunat(objeto) {
    bloquea();
    let consulta = await axios.post("/consulta/documento",objeto,{ 
        headers:{authorization: 'Bearer '+verToken()} 
    });
    desbloquea();
    let resp=consulta.data.valor;
    return resp;


}



