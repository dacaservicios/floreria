//FUNCIONES
$(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip();
	let tabla="caja";
	$('#'+tabla+'Tabla').DataTable(valoresTabla);

	$('#'+tabla+'Info').off( 'click');
	$('#'+tabla+'Info').on( 'click', 'button', function () {
		let accion=$(this).attr('type');
		let idSubMenu=$(this).siblings('span.muestraSubmenu').text();
		let nombreSubmenu=$(this).siblings('span.muestraModulo').text();
		verificaSesion('O', idSubMenu,1,function( ){//NUEVO
			enviaFormularioCaja({id:0,nombre:0,nombreSubmenu:nombreSubmenu,idSubMenu:idSubMenu,tabla:tabla,accion:accion,orden:0,ancho:600,titulo:'NUEVA CAJA'});
		});
	});
	
	$('#'+tabla+'Tabla tbody').off( 'click');
	$('#'+tabla+'Tabla tbody').on( 'click', rutaElemento, function () {
		let accion=$(this).attr('type');
		let evento=$(this).parents("tr")
    	let idPadre=evento.attr('id');
		let nombre=evento.find("td.muestraMensaje").text();
		let nombreSubmenu=$('#'+tabla+'Info span.muestraModulo').text();
		let idSubMenu=$('#'+tabla+'Info span.muestraSubmenu').text();

		if($(this).hasClass('elimina')){
			verificaSesion('O', idSubMenu,3,function( ){//ELIMINA
				eliminaCaja({idPadre:idPadre,nombre:nombre,nombreSubmenu:nombreSubmenu,orden:idPadre,tabla:tabla,accion:accion});
			});
		}else if($(this).hasClass('estado')){
			verificaSesion('O', idSubMenu,6,function( ){//ESTADO	
				estadoCaja({idPadre:idPadre,nombre:nombre,nombreSubmenu:nombreSubmenu,tabla:tabla,accion:accion,orden:idPadre,ancho:600,titulo:'ESTADO '+tabla.toUpperCase()});
			});
		}else if($(this).hasClass('detalle')){
			verificaSesion('O', idSubMenu,11,function( ){//DETALLE
				modalLinkcajaDetalle({titulo:'INGRESOS x EGRESOS',tabla:'ingresosegresos',idSubMenu:67,ancho:800,idPadre:idPadre})
			});
		}else if($(this).hasClass('edita')){
			verificaSesion('O', idSubMenu,79,function( ){//CUADRE
				modalLinkCuadreCaja({idPadre:idPadre,nombre:nombre,nombreSubmenu:nombreSubmenu,idSubMenu:idSubMenu,tabla:tabla,accion:accion,orden:idPadre,ancho:600,titulo:'CUADRE DE CAJA'});
			});
		}
	});
});

function modalLinkcajaDetalle(objeto){
    bloquea();
    $.ajax({
        type: "POST",
        url: '/vista/'+objeto.tabla,
        data:{
			idPadre:objeto.idPadre,
            idSubMenu:objeto.idSubMenu,
            tabla:objeto.tabla,
            token :verToken()
        },
        success: function(msg) {
            desbloquea();
            mostrar_general1({titulo:objeto.titulo,msg:msg,nombre: objeto.nombre,ancho:objeto.ancho,idPadre:objeto.idPadre});
        },
        error: function(msg) {
            desbloquea();
			mensajeError(msg.responseJSON.error);
        }
    });
}


function modalLinkCuadreCaja(objeto){
    bloquea();
    $.ajax({
        type: "POST",
        url: "/vista/"+objeto.tabla+"/"+objeto.accion.replace(/ /g, "").toLowerCase(),
        data:{
            id:objeto.idPadre,
            tabla:objeto.tabla,
            idSubMenu:objeto.idSubMenu,
            nombre: objeto.nombre,
            token :verToken()
        },
        success: function(msg) {
            desbloquea();
            mostrar_general1({titulo:objeto.titulo,msg:msg,ancho:objeto.ancho});
            procesaFormularioCuadreCaja(objeto);
        },
        error: function(msg) {
			desbloquea();
            resp=msg.responseJSON.error;
			mensajeError(resp);
		}
    });
}

function enviaFormularioCaja(objeto){
	let dato=(objeto.accion=='Crea')?muestraMensaje({tabla:objeto.tabla}):objeto.nombre;
	let verbo=(objeto.idPadre>0)?'Modificará':'Creará';

	confirm("¡"+verbo+" un nuevo inicio de caja!",function(){
		return false;
	},function(){
        bloquea();
        $.ajax({    
			type: "POST",
			url: '/'+objeto.tabla+'/'+objeto.accion.toLowerCase(),
			data:{
				id: objeto.idPadre,
				sesId:$('#session').val(),
				token :verToken()
			},
			success: function(msg) {
				desbloquea();
				$("#general1").modal("hide");
				resp=msg.valor;
				if(resp.resultado){
					if(objeto.idPadre>0){
						$("#"+objeto.tabla+"Tabla #"+objeto.orden+" .nombre").text(resp.info.NOMBRE);
						$("#"+objeto.tabla+"Tabla #"+objeto.orden+" .descripcion").text(resp.info.DESCRIPCION);
						$('#'+objeto.tabla+'Tabla').DataTable().draw(false);
						success("Modificado","¡Se ha modificado el registro: "+dato+"!");
					}else{
						if(resp.info.EXISTE==1){
							info('¡No deben existir cajas abiertas!');
						}else{
							let t = $('#'+objeto.tabla+'Tabla').DataTable();
							let rowNode =t.row.add( [
								moment(resp.info.FECHA_INICIO).format('DD/MM/YYYY HH:mm'),
								'',
								'0.00',
								'0.00',
								'0.00',
								'0.00',
								`<span class="estado badge badge-primary normal">ABIERTO</span>`,
								`<a type='Detalle' class="crud detalle cursor" data-toggle="tooltip" data-placement="top" title="Detalle">
									<i class='las la-eye la-2x'></i>
								</a>
								<a type='Edita' class="crud edita cursor" data-toggle="tooltip" data-placement="top" title="Cuadre">
									<i class="las la-funnel-dollar la-2x"></i>
								</a>
								<a type='Estado' class="crud estado cursor" data-toggle="tooltip" data-placement="top" title="Cierre">
									<i class='las la-check-circle la-2x'></i>
								</a>
								<a type='Elimina' class="crud elimina cursor" data-toggle="tooltip" data-placement="top" title="Eliminar">
									<i class='las la-trash la-2x'></i>
								</a>`
							] ).draw( false ).node();
							$( rowNode ).find('td').eq(0).addClass('fechaInicio muestraMensaje');
							$( rowNode ).find('td').eq(1).addClass('fechaCierre');
							$( rowNode ).find('td').eq(2).addClass('saldo');
							$( rowNode ).find('td').eq(3).addClass('cierre');
							$( rowNode ).find('td').eq(4).addClass('faltante');
							$( rowNode ).find('td').eq(5).addClass('sobrante');
							$( rowNode ).find('td').eq(6).addClass('cambiaEstado');
							$( rowNode ).find('td').eq(7).addClass('botones');
							$( rowNode ).attr('id',resp.info.ID_CAJA);

							success("Creado","¡Se ha creado el registro: el inicio de caja!");
						}
					}
				}else{
					mensajeSistema(resp.mensaje);
				}
			},
			error: function(msg) {
				desbloquea();
				resp=msg.responseJSON.error;
				mensajeError(resp);
			}
		});
    });
}

function eliminaCaja(objeto){
	confirm("¡Eliminará el registro: "+objeto.nombre+"!",function(){
		return false;
	},function(){
        bloquea();
		$.ajax({
			type: "POST",
			url: '/'+objeto.tabla+'/elimina',
            data:{
                id: objeto.idPadre,
                token :verToken()
            },
			success: function(msg) {
                desbloquea();
                resp=msg.valor;
				if(resp.resultado){
                    let  elimina=$('#'+objeto.tabla+'Tabla').DataTable();
                    $('#'+objeto.tabla+'Tabla #'+objeto.orden).closest('tr');
                    elimina.row($('#'+objeto.tabla+'Tabla #'+objeto.orden)).remove().draw(false); 
					success("Eliminado","¡Se ha eliminado el registro: "+objeto.nombre+"¡");

				}else{
					mensajeSistema(resp.mensaje);
				}
			},
			error: function(msg) {
				desbloquea();
                resp=msg.responseJSON.error;
                mensajeError(resp);
			}
		});
	})
}

function estadoCaja(objeto){
	confirm("¡Esta seguro de cerrar la caja: "+objeto.nombre+"!",function(){
		return false;
	},function(){
		bloquea();
		$.ajax({
			type: "post",
			url: '/'+objeto.tabla+'/estado/',
			data:{
                id: objeto.idPadre,
				token :verToken()
            },
			success: function(msg) {
                desbloquea();
			    resp=msg.valor;
				if(resp.resultado){
					let estado=(resp.info.ESTADO==0)?'CERRADO':'ABIERTO';
					let claseEstado=(resp.info.ESTADO==0)?'badge badge-danger':'badge badge-primary';

                    $("#"+objeto.tabla+"Tabla #"+objeto.orden+" .cambiaEstado").children('span').text(estado);
                    $("#"+objeto.tabla+"Tabla #"+objeto.orden+" .cambiaEstado").children('span').removeClass();
                    $("#"+objeto.tabla+"Tabla #"+objeto.orden+" .cambiaEstado").children('span').addClass(claseEstado);

					$("#"+objeto.tabla+"Tabla #"+objeto.orden+" .botones").addClass('oculto');

					success("Estado","¡Se cerró la caja: "+objeto.nombre+"!");

				}else{
                    mensajeSistema(resp.mensaje);
                }
			},
			error: function(msg) {
				desbloquea();
                resp=msg.responseJSON.error;
                mensajeError(resp);
			}
		});
	})
}


function procesaFormularioCuadreCaja(objeto){
	let billete200=$("#"+objeto.tabla+" input[name=billete200]");
	let billete100=$("#"+objeto.tabla+" input[name=billete100]");
	let billete50=$("#"+objeto.tabla+" input[name=billete50]");
	let billete20=$("#"+objeto.tabla+" input[name=billete20]");
	let billete10=$("#"+objeto.tabla+" input[name=billete10]");
	let moneda5=$("#"+objeto.tabla+" input[name=moneda5]");
	let moneda2=$("#"+objeto.tabla+" input[name=moneda2]");
	let moneda1=$("#"+objeto.tabla+" input[name=moneda1]");
	let moneda05=$("#"+objeto.tabla+" input[name=moneda05]");
	let moneda02=$("#"+objeto.tabla+" input[name=moneda02]");
	let moneda01=$("#"+objeto.tabla+" input[name=moneda01]");
	let session=$("#session");
	let elementos={
		billete200:billete200,
		billete100:billete100,
		billete50:billete50,
		billete20:billete20,
		billete10:billete10,
		moneda5:moneda5,
		moneda2:moneda2,
		moneda1:moneda1,
		moneda05:moneda05,
		moneda02:moneda02,
		moneda01:moneda01,
		session:session
	}

	numeroRegex(billete200);
	numeroRegex(billete100);
	numeroRegex(billete50);
	numeroRegex(billete20);
	numeroRegex(billete10);
	numeroRegex(moneda5);
	numeroRegex(moneda2);
	numeroRegex(moneda1);
	numeroRegex(moneda05);
	numeroRegex(moneda02);
	numeroRegex(moneda01);

	$('#'+objeto.tabla).off( 'keyup');
    $('#'+objeto.tabla).on( 'keyup','input[type=tel]',function(){
		let tipo='tel';
		enviaEventoCaja({tabla:objeto.tabla,tipo:tipo});
	});


	$('#'+objeto.tabla).off( 'click');
	$('#'+objeto.tabla).on( 'click','button.crud',function () {
		verificaSesion('O',objeto.idSubMenu,5,function( ){
			validaFormularioCuadreCaja({objeto:objeto,elementos:elementos});
		});
	});
}

function enviaEventoCaja(objeto){
	let totalBilletes;
	let totalMonedas;
	if(objeto.tipo=='tel'){

		totalBilletes=200*$("#"+objeto.tabla+" input[name=billete200]").val()+100*$("#"+objeto.tabla+" input[name=billete100]").val()+50*$("#"+objeto.tabla+" input[name=billete50]").val()+20*$("#"+objeto.tabla+" input[name=billete20]").val()+10*$("#"+objeto.tabla+" input[name=billete10]").val();
		$('#totalBilletes').text(parseFloat(totalBilletes).toFixed(2));

		totalMonedas=5*$("#"+objeto.tabla+" input[name=moneda5]").val()+2*$("#"+objeto.tabla+" input[name=moneda2]").val()+1*$("#"+objeto.tabla+" input[name=moneda1]").val()+0.5*$("#"+objeto.tabla+" input[name=moneda05]").val()+0.2*$("#"+objeto.tabla+" input[name=moneda02]").val()+0.1*$("#"+objeto.tabla+" input[name=moneda01]").val();
		$('#totalMonedas').text(parseFloat(totalMonedas).toFixed(2));

		$('#totalEfectivo').text(parseFloat(totalBilletes+totalMonedas).toFixed(2));
	}
}

function validaFormularioCuadreCaja(objeto){
	if(objeto.elementos.billete200.val()=="" && objeto.elementos.billete100.val()=="" && objeto.elementos.billete50.val()=="" && objeto.elementos.billete20.val()=="" && objeto.elementos.billete10.val()=="" && objeto.elementos.moneda5.val()=="" && objeto.elementos.moneda2.val()=="" && objeto.elementos.moneda1.val()=="" && objeto.elementos.moneda05.val()=="" && objeto.elementos.moneda02.val()=="" && objeto.elementos.moneda01.val()==""){
		info('¡Debe ingresar al menos un billete o una moneda!')		
	}else{
		enviaFormularioCuadreCaja(objeto);
	}
}
function enviaFormularioCuadreCaja(objeto){
	var fd = new FormData(document.getElementById(objeto.objeto.tabla));
	fd.append("id", objeto.objeto.idPadre);
	fd.append("sesId", objeto.elementos.session.val());
	fd.append("token", verToken());

	confirm("¡Está seguro de realizar el cuadre de caja!",function(){
		return false;
	},function(){
        bloquea();
        $.ajax({    
			type: "POST",
			url: '/'+objeto.objeto.tabla+'/'+objeto.objeto.accion.toLowerCase(),
			data: fd,
			dataType: 'json',
			processData: false,
        	contentType: false,
			success: function(msg) {
				desbloquea();
				$("#general1").modal("hide");
				resp=msg.valor;
				if(resp.resultado){
					socket.emit('actualizaCaja',{
						idCaja:resp.info.ID_CAJA,
						tabla:'caja',
						tipo:'cierre',
						cierre:resp.info.TOTAL_EFECTIVO,
						faltante:resp.info.FALTANTE,
						sobrante:resp.info.SOBRANTE,
						sucursal:'S'+$("#sucursal").val()
					});
				}else{
					mensajeSistema(resp.mensaje);
				}
			},
			error: function(msg) {
				desbloquea();
				resp=msg.responseJSON.error;
				mensajeError(resp);
			}
		});
    });
}