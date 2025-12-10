//FUNCIONES
$(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip();
	let tabla="ingresosegresos";
	$('#'+tabla+'Tabla').DataTable(valoresTabla);

	$('#'+tabla+'Info').off( 'click');
	$('#'+tabla+'Info').on( 'click', 'button', function () {
		let accion=$(this).attr('type');
		let idSubMenu=$(this).siblings('span.muestraSubmenu').text();
		let nombreSubmenu=$(this).siblings('span.muestraModulo').text();
		let padreId=$('#general1 span#padreId').text();
		modalLinkIngresosegresos({id:0,padreId:padreId,nombre:0,nombreSubmenu:nombreSubmenu,idSubMenu:idSubMenu,tabla:tabla,accion:accion,orden:0,ancho:600,titulo:'NUEVO INGRESO / EGRESO'});
	});
	
	$('#'+tabla+'Tabla tbody').off( 'click');
	$('#'+tabla+'Tabla tbody').on( 'click', rutaElemento, function () {
		let accion=$(this).attr('type');
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td.muestraMensaje").text();
		let nombreSubmenu=$('#'+tabla+'Info span.muestraModulo').text();
		let idSubMenu=$('#'+tabla+'Info span.muestraSubmenu').text();

		if($(this).hasClass('elimina')){
			verificaSesion('O', idSubMenu,3,function( ){//ELIMINA
				eliminaIngresosegresos({id:id,nombre:nombre,nombreSubmenu:nombreSubmenu,orden:id,tabla:tabla,accion:accion});
			});
		}else if($(this).hasClass('edita')){
			verificaSesion('O', idSubMenu,2,function( ){//EDITA
				modalLinkIngresosegresos({id:id,padreId:padreId,nombre:nombre,nombreSubmenu:nombreSubmenu,idSubMenu:idSubMenu,tabla:tabla,accion:accion,orden:id,ancho:600,titulo:'EDITAR INGRESO / EGRESO'});
			});
		}else if($(this).hasClass('estado')){
			verificaSesion('O', idSubMenu,6,function( ){//ESTADO	
				estadoIngresosegresos({id:id,nombre:nombre,nombreSubmenu:nombreSubmenu,tabla:tabla,accion:accion,orden:id,ancho:600,titulo:'ESTADO '+tabla.toUpperCase()});
			});
		}
	});
});

function modalLinkIngresosegresos(objeto){
    bloquea();
    $.ajax({
        type: "POST",
        url: "/vista/"+objeto.tabla+"/"+objeto.accion.replace(/ /g, "").toLowerCase(),
        data:{
            id:objeto.id,
            tabla:objeto.tabla,
            idSubMenu:objeto.idSubMenu,
            nombre: objeto.nombre,
            token :verToken()
        },
        success: function(msg) {
            desbloquea();
            mostrar_general2({titulo:objeto.titulo,msg:msg,ancho:objeto.ancho});
            procesaFormularioIngresosegresos(objeto);
        },
        error: function(msg) {
			desbloquea();
            resp=msg.responseJSON.error;
			mensajeError(resp);
		}
    });
}

function procesaFormularioIngresosegresos(objeto){
	let movimiento=$("#"+objeto.tabla+" select[name=movimiento]");
	let usuario=$("#"+objeto.tabla+" select[name=usuario]");
	let descripcion=$("#"+objeto.tabla+" textarea[name=descripcion]");
	let moneda=$("#"+objeto.tabla+" select[name=moneda]");
	let monto=$("#"+objeto.tabla+" input[name=monto]");
	let session=$("#session");
	let elementos={
		movimiento:movimiento,
		usuario:usuario,
		descripcion:descripcion,
		moneda:moneda,
		monto:monto,
		session:session
	}

	comentarioRegex(descripcion);
	decimalRegex(monto);

	verificaElementoIngresosegresos({objeto:objeto,elementos:elementos});
}

function verificaElementoIngresosegresos(objeto){
	$('#'+objeto.objeto.tabla).off( 'keyup');
    $('#'+objeto.objeto.tabla).on( 'keyup','textarea',function(){
		let name=$(this).attr("name");
		let tipo='textarea';
		enviaEventoIngresosegresos({tabla:objeto.objeto.tabla,tipo:tipo,name:name,elementos:objeto.elementos});
	});

	$('#'+objeto.objeto.tabla).off( 'change');
    $('#'+objeto.objeto.tabla).on( 'change','select',function(){
		let name=$(this).attr("name");
		let tipo='select';
		enviaEventoIngresosegresos({tabla:objeto.objeto.tabla,tipo:tipo,name:name,elementos:objeto.elementos});
	});

	$('#'+objeto.objeto.tabla).off( 'keyup');
    $('#'+objeto.objeto.tabla).on( 'keyup','input[type=tel]',function(){
		let name=$(this).attr("name");
		let tipo='tel';
		enviaEventoIngresosegresos({tabla:objeto.objeto.tabla,tipo:tipo,name:name,elementos:objeto.elementos});
	});

	$('#'+objeto.objeto.tabla).off( 'click');
	$('#'+objeto.objeto.tabla).on( 'click','button.crud',function () {
		let idOpcion=(objeto.objeto.accion=='Crea')?4:5;
		verificaSesion('O', objeto.objeto.idSubMenu,idOpcion,function( ){//CREA  O MODIFICA
			validaFormularioIngresosegresos(objeto);
		});
	});
}

function enviaEventoIngresosegresos(objeto){
	if(objeto.tipo=='textarea'){
		if(objeto.name=='descripcion'){
			let elementoInput=$("#"+objeto.tabla+" textarea[name="+objeto.name+"]");
			validaVacio(elementoInput);
		}
	}else if(objeto.tipo=='tel'){
		if(objeto.name=='monto'){
			let elementoInput=$("#"+objeto.tabla+" input[name="+objeto.name+"]");
			validaVacio(elementoInput);
		}
	}else if(objeto.tipo=='select'){
		if(objeto.name=='movimiento'|| objeto.name=='moneda'){
			let elementoInput=$("#"+objeto.tabla+" select[name="+objeto.name+"]");
			validaVacioSelect(elementoInput);
		}
	}
}

function validaFormularioIngresosegresos(objeto){
	validaVacioSelect(objeto.elementos.movimiento);
	validaVacioSelect(objeto.elementos.moneda);
	validaVacio(objeto.elementos.descripcion);
	validaVacio(objeto.elementos.monto);

	if(objeto.elementos.movimiento.val()=="" || objeto.elementos.descripcion.val()=="" || objeto.elementos.monto.val()=="" || objeto.elementos.moneda.val()==""){
		mensajeSistema(0);
	}else{
		enviaFormularioIngresosegresos(objeto);
	}
}
function enviaFormularioIngresosegresos(objeto){
	let dato=(objeto.objeto.accion=='Crea')?muestraMensaje({tabla:objeto.objeto.tabla}):objeto.objeto.nombre;
	let verbo=(objeto.objeto.id>0)?'Modificará':'Creará';

	var fd = new FormData(document.getElementById(objeto.objeto.tabla));
	fd.append("id", objeto.objeto.id);
	fd.append("padreId", objeto.objeto.padreId);
	fd.append("sesId", objeto.elementos.session.val());
	fd.append("token", verToken());
	
	confirm("¡"+verbo+" el registro: "+dato+"!",function(){
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
				$("#general2").modal("hide");
				resp=msg.valor;
				if(resp.resultado){
					if(objeto.objeto.id>0){
						$("#"+objeto.objeto.tabla+"Tabla #"+objeto.objeto.orden+" .movimiento").text(resp.info.TIPO_MOVIMIENTO);
						$("#"+objeto.objeto.tabla+"Tabla #"+objeto.objeto.orden+" .fecha").text(moment(resp.info.FECHA_CREA).format('DD/MM/YYYY'));
						$("#"+objeto.objeto.tabla+"Tabla #"+objeto.objeto.orden+" .usuario").text((resp.info.USUARIO===null)?'':resp.info.USUARIO);
						$("#"+objeto.objeto.tabla+"Tabla #"+objeto.objeto.orden+" .descripcion").text((resp.info.DESCRIPCION===null)?'':resp.info.DESCRIPCION);
						$("#"+objeto.objeto.tabla+"Tabla #"+objeto.objeto.orden+" .monto").text(resp.info.ABREVIATURA_MONEDA+" "+parseFloat(resp.info.MONTO).toFixed(2));

						success("Modificado","¡Se ha modificado el registro: "+dato+"!");
					}else{
						let t = $('#'+objeto.objeto.tabla+'Tabla').DataTable();
						let rowNode =t.row.add( [
							resp.info.TIPO_MOVIMIENTO,
							moment(resp.info.FECHA_CREA).format('DD/MM/YYYY'),
							(resp.info.USUARIO===null)?'':resp.info.USUARIO,
							resp.info.DESCRIPCION,
							resp.info.ABREVIATURA_MONEDA+" "+parseFloat(resp.info.MONTO).toFixed(2),
							`<span class="estado badge badge-primary">ACTIVO</span>`,
							`<a type='Estado' class="crud estado cursor" data-toggle="tooltip" data-placement="top" title="Estado">
								<i class='las la-check-circle la-2x'></i>
							</a>
							<a type='Edita' class="crud edita cursor" data-toggle="tooltip" data-placement="top" title="Editar">
								<i class='las la-edit la-2x'></i>
							</a>
							<a type='Elimina' class="crud elimina cursor" data-toggle="tooltip" data-placement="top" title="Eliminar">
								<i class='las la-trash la-2x'></i>
							</a>`
						] ).draw( false ).node();
						$( rowNode ).find('td').eq(0).addClass('movimiento muestraMensaje');
						$( rowNode ).find('td').eq(1).addClass('fecha');
						$( rowNode ).find('td').eq(2).addClass('usuario');
						$( rowNode ).find('td').eq(3).addClass('descripcion');
						$( rowNode ).find('td').eq(4).addClass('monto');
						$( rowNode ).find('td').eq(5).addClass('cambiaEstado');
						$( rowNode ).attr('id',resp.info.ID_INGRESO_EGRESO);


						success("Creado","¡Se ha creado el registro: "+dato+"!");
						socket.emit('actualizaCaja',{
							idCaja:resp.info.PADRE_ID,
							tabla:'caja',
							tipo:'saldo',
							saldo:resp.info.TOTAL_INGRESO_EGRESO,
							faltante:resp.info.FALTANTE,
							sobrante:resp.info.SOBRANTE,
							sucursal:'S'+$("#sucursal").val()
						});
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

function eliminaIngresosegresos(objeto){
	confirm("¡Eliminará el registro: "+objeto.nombre+"!",function(){
		return false;
	},function(){
        bloquea();
		$.ajax({
			type: "POST",
			url: '/'+objeto.tabla+'/elimina',
            data:{
                id: objeto.id,
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

					socket.emit('actualizaCaja',{
						idCaja:resp.info.PADRE_ID,
						tabla:'caja',
						saldo:resp.info.TOTAL_INGRESO_EGRESO,
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
	})
}

function estadoIngresosegresos(objeto){
	confirm("¡Cambiará el estado del registro: "+objeto.nombre+"!",function(){
		return false;
	},function(){
		bloquea();
		$.ajax({
			type: "post",
			url: '/'+objeto.tabla+'/estado/',
			data:{
                id: objeto.id,
				token :verToken()
            },
			success: function(msg) {
                desbloquea();
			    resp=msg.valor;
				if(resp.resultado){
					let estado=(resp.info.ESTADO==0)?'INACTIVO':'ACTIVO';
					let claseEstado=(resp.info.ESTADO==0)?'badge badge-danger':'badge badge-primary';

                    $("#"+objeto.tabla+"Tabla #"+objeto.orden+" .cambiaEstado").children('span').text(estado);
                    $("#"+objeto.tabla+"Tabla #"+objeto.orden+" .cambiaEstado").children('span').removeClass();
                    $("#"+objeto.tabla+"Tabla #"+objeto.orden+" .cambiaEstado").children('span').addClass(claseEstado);

					success("Estado","¡Se ha cambiado el estado del registro: "+objeto.nombre+"!");
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