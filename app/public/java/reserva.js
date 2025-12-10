//FUNCIONES
$(document).ready(function() {
	try {
		vistaReserva();
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

async function vistaReserva(){
	let tabla="reserva";

	let listado=`

	<div class="row row-sm mg-t-10">
		<div class="col-lg-12">
			<div class="card card-primary">
				<div class="card-body">
					<form class="needs-validation" novalidate>
						<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient"><i class="las la-bell"></i> RESERVA</div>
						<div class="pd-b-0  main-content-calendar pt-0">
							<div class="row">
								<div class="col-md-12">
									<div class="card">
										<div class="card-body">
											<div class="row">
												<div class="col-md-12">
													<div id='calendar'></div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>`;
	$("#cuerpoPrincipal").html(listado);
	let objeto={
		tabla:tabla,
	}

	activarCalendario(objeto);
}

async function formularioCalendario(objeto){
	bloquea();
	const cliente = await axios.get("/api/cliente/listar/0/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});

	const empleado = await axios.get("/api/empleado/listar/0/"+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		} 
	});

	desbloquea();
	const resp=cliente.data.valor.info;
	const resp2=empleado.data.valor.info;

	let listado=`<form id="${objeto.tabla}">
					<span class='oculto muestraId'>0</span>
					<span class='oculto muestraNombre'></span>
					<div class="row pt-3">
						<div class="form-group col-md-4">
							<label>Cliente (*)</label>
							<select name="cliente" class="form-control select2 muestraMensaje">
								<option value="">Select...</option>`;
								for(var i=0;i<resp.length;i++){
									if(resp[i].ES_VIGENTE==1){
								listado+=`<option value="${resp[i].ID_CLIENTE}">${resp[i].APELLIDO_PATERNO+" "+resp[i].APELLIDO_MATERNO+" "+resp[i].NOMBRE}</option>`;
									}
								}
					listado+=`</select>
							<div class="vacio oculto">¡Campo obligatorio!</div>
						</div>
						<div class="form-group col-md-4">
							<label>Colaborador (*)</label>
							<select name="empleado" class="form-control select2">
								<option value="">Select...</option>`;
								for(var i=0;i<resp2.length;i++){
									if(resp2[i].ES_VIGENTE==1){
								listado+=`<option value="${resp2[i].ID_EMPLEADO}">${resp2[i].APELLIDO_PATERNO+" "+resp2[i].APELLIDO_MATERNO+" "+resp2[i].NOMBRE}</option>`;
									}
								}
					listado+=`</select>
							<div class="vacio oculto">¡Campo obligatorio!</div>
						</div>
						<div class="form-group col-md-4">
							<label>Hora reserva (*)</label>
							<input name="horaReserva" maxlength="5" autocomplete="off" type="time" class="form-control" placeholder="Ingrese la hora">
							<input value="" id="fechaReserva" name="fechaReserva" maxlength="10" type="hidden">
							<div class="vacio oculto">¡Campo obligatorio!</div>
						</div>
					</div>
					<div class="row">
						<div class="form-group col-md-12">
							<label>Comentario</label>
							<input name="comentario" autocomplete="off" maxlength="250" type="text" class="form-control p-1" placeholder="Ingrese un comentario">
						</div>
					</div>
					<div class="pt-3 col-md-12 pl-0 pr-0 text-center">
						${limpia()+cancela()+quitar()+guarda()}
					</div>
					<div class="h8 text-center pt-2">(*) Los campos con asteriso son obligatorios.</div>
				</form>`;
			mostrar_general1({titulo:'RESERVA: '+moment(objeto.fecha).format('DD-MM-YYYY'),msg:listado,ancho:600});
			$('#'+objeto.tabla+' #fechaReserva').val(moment(objeto.fecha).format('DD-MM-YYYY'))
			$(".select2").select2({
				placeholder:'Select...',
				dropdownAutoWidth: true,
				width: '100%',
				dropdownParent: $('#general1')
			});
			$('.datepicker').datepicker({
				language: 'es',
				inline: true,
				changeMonth: true,
				changeYear: true,
				todayHighlight: true,
				container: "#general1",
			}).on('changeDate', function(e){
				$(this).datepicker('hide');
			});
		
			objeto.cliente=$('#'+objeto.tabla+' select[name=cliente]');
			objeto.empleado=$('#'+objeto.tabla+' select[name=empleado]');
			objeto.fechaReserva=$('#'+objeto.tabla+' input[name=fechaReserva]');
			objeto.horaReserva=$('#'+objeto.tabla+' input[name=horaReserva]');
			objeto.comentario=$('#'+objeto.tabla+' input[name=comentario]');
			
			eventosReserva(objeto);
}

function activarCalendario(objeto){
	var calendarEl = document.getElementById('calendar');
	var calendar = new FullCalendar.Calendar(calendarEl, {
		locale: 'es',
		timezone: 'America/Lima',
		headerToolbar: {
			left: 'prev,next,today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
		},
		initialView: 'dayGridMonth',
		editable:true,
		dateClick: async function(info){
			objeto.fecha=info.dateStr;
			await formularioCalendario(objeto);
			$("#"+objeto.tabla+" span#botonGuardar").text('Crear');
			$("#"+objeto.tabla+" button[name=btnLimpia]").removeClass('oculto');
			$("#"+objeto.tabla+" button[name=btnQuitar]").addClass('oculto');
		},
		eventClick: async function(info){
			let id=info.event.id;
			let nombre=info.event.extendedProps.clientePaterno+" "+info.event.extendedProps.clienteNombres;
			objeto.id=id;
			objeto.fecha=info.event.startStr
			await formularioCalendario(objeto);
			$("#"+objeto.tabla+" span.muestraId").text(id);
			$("#"+objeto.tabla+" span.muestraNombre").text(nombre);
			$("#"+objeto.tabla+" span#botonGuardar").text('Modificar');
			$("#"+objeto.tabla+" button[name=btnLimpia]").addClass('oculto');
			$("#"+objeto.tabla+" button[name=btnQuitar]").removeClass('oculto');
			reservaEdita(objeto);
		},
		eventDrop: function(info){
			// Validar si ya existe una reserva en la nueva fecha
			if (validarConflictoReserva(info.event, calendar)) {
				error('¡Ya existe un registro con esos datos!');
				
				// Revertir el evento a su posición original
				info.revert();
				return false;
			}
			let id=info.event.id;
			let fecha=info.event.startStr;
			enviaFormularioReservaDD({id:id,fecha:fecha, tabla:objeto.tabla});
		},
		events: async function(info, successCallback, failureCallback) {
			const lista= await axios.get('/api/'+objeto.tabla+'/listar/0/'+verSesion(),{
				headers: 
				{ 
					authorization: `Bearer ${verToken()}`
				} 
			});
			let data=lista.data.valor.info;
			let evento = data.map(function (event){
				let startDate = new Date(event.FECHA_RESERVA);
				let endDate = new Date(startDate);
    			endDate.setHours(23, 59, 59, 999);
				return {
					title:'Reserva',
					start:startDate.toISOString(),
					end:endDate.toISOString(),
					location:event.COMENTARIO,
					id: event.ID_RESERVA,
					backgroundColor: event.COLOR,
					extendedProps: {
						barberoPaterno: event.PATERNO_EMPLEADO,
						barberoMaterno: event.MATERNO_EMPLEADO,
						barberoNombres: event.NOMBRE_EMPLEADO,
						clientePaterno: event.PATERNO_CLIENTE,
						clienteMaterno: event.MATERNO_CLIENTE,
						clienteNombres: event.NOMBRE_CLIENTE,
						color:event.COLOR
					}
				}
			});
			
			successCallback(evento);
		},
		eventContent: function(info){
			let color=getContrastColor(info.event.backgroundColor) 
			return {
				html:`
					<div class="cursor m-auto overflow-hidden" style="background-color: ${info.event.backgroundColor};padding: 5px; border-radius: 5px;color: ${color};width:100%;border:1px solid #000000;">
						<div>${info.event.extendedProps.clientePaterno+" "+info.event.extendedProps.clienteNombres}</div>
						<div>${moment(info.event.start).format('HH:mm')}</div>
					</div>`
			}
		},
		eventMouseEnter: function(mouseEnterInfo){
			let el = mouseEnterInfo.el;
			//el.classList.add("relative");

			//let newEl = document.createElement("div");
            let newElTitulo = mouseEnterInfo.event.title;
            let newElHora = moment(mouseEnterInfo.event.startStr).format('HH:mm');
			let newElComentario = (mouseEnterInfo.event.extendedProps.location===null)?'-':mouseEnterInfo.event.extendedProps.location;
			let newElClienteApellido = mouseEnterInfo.event.extendedProps.clientePaterno+ " "+mouseEnterInfo.event.extendedProps.clienteMaterno;
			let newElClienteNombres = mouseEnterInfo.event.extendedProps.clienteNombres;
			let newElBarberApellido = mouseEnterInfo.event.extendedProps.barberoPaterno+" "+mouseEnterInfo.event.extendedProps.barberoMaterno;
			let newElBarberNombres = mouseEnterInfo.event.extendedProps.barberoNombres;

			//newEl.innerHTML = `
			let tooltipContent = `
                <div style="font-size: 12px;">
                    <div><strong>${newElTitulo}: ${newElHora}</strong></div>
					<div><strong>Cliente:</strong> ${newElClienteApellido+" "+newElClienteNombres}</div>
					<div><strong>Colaborador:</strong> ${newElBarberApellido+" "+newElBarberNombres}</div>
					<div><strong>Comentario:</strong> ${newElComentario}</div>
                </div>`

				tippy(el, {
					content: tooltipContent, // Contenido del tooltip
					allowHTML: true, // Permite contenido HTML
					theme: 'light', // Tema
					placement: 'top', // Posición del tooltip
					animation: 'scale', // Animación
					duration: [200, 150], // Duración de la animación [entrada, salida]
					offset: [0, 10], // Espaciado entre el elemento y el tooltip
				});
            
            //el.after(newEl);
		},
		eventMouseLeave: function(mouseLeaveInfo){
			/*let tooltip = document.querySelector(".fc-hoverable-event");
			if (tooltip) tooltip.remove();*/
			let el = mouseLeaveInfo.el;
			if (el._tippy) {
				el._tippy.destroy(); // Elimina el tooltip asociado al elemento
			}
        }
	  
	});

	calendar.render();
}

// VERSIÓN ALTERNATIVA CON VALIDACIÓN DE HORA (si también necesitas validar hora específica)
function validarConflictoReserva(eventoMovido, calendar) {
	const todosLosEventos = calendar.getEvents();
	
	const inicioMovido = new Date(eventoMovido.start);
	const finMovido = new Date(eventoMovido.end || eventoMovido.start);
	
	for (let evento of todosLosEventos) {
		if (evento.id === eventoMovido.id) {
			continue;
		}
		
		const inicioExistente = new Date(evento.start);
		const finExistente = new Date(evento.end || evento.start);
		
		// Verificar solapamiento de horarios
		if (inicioMovido < finExistente && inicioExistente < finMovido) {
			return true; // Hay conflicto
		}
	}
	
	return false; // No hay conflicto
}

function eventosReserva(objeto){
	$('#'+objeto.tabla+' div').off( 'keyup');
    $('#'+objeto.tabla+' div').on( 'keyup','input[type=text]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='comentario'){
			comentarioRegex(elemento);
		}
	});

	$('#'+objeto.tabla+' div').off( 'change');
    $('#'+objeto.tabla+' div').on( 'change','select',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" select[name="+name+"]");
		validaVacioSelect(elemento);
	});

	$('#'+objeto.tabla+' div').on( 'change','input[type=time]',function(){
		let name=$(this).attr('name');
		let elemento=$("#"+objeto.tabla+" input[name="+name+"]");
		if(name=='horaReserva'){
			validaVacio(elemento);
		}
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnGuarda]',function(){//guarda
		objeto.id= $("#"+objeto.tabla+" span.muestraId").text()
		objeto.nombreMsg= $("#"+objeto.tabla+" span.muestraNombre").text()
		validaFormularioReserva(objeto)
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnLimpia]',function(){//limpia
		limpiaTodo(objeto.tabla);
	});

	$('#'+objeto.tabla+' div').on( 'click','button[name=btnQuitar]',function(){//quitar
		let id= $("#"+objeto.tabla+" span.muestraId").text()
		let nombre= $("#"+objeto.tabla+" span.muestraNombre").text()
		reservaElimina({id:id,nombre:nombre,tabla:objeto.tabla});
	});

	$('#'+objeto.tabla+'Tabla tbody').on( 'click','td a.estado',function(){//estado
		let evento=$(this).parents("tr")
    	let id=evento.attr('id');
		let nombre=evento.find("td div.nombre").text();
		reservaEstado({id:id,nombre:nombre,tabla:objeto.tabla});
	});
}

async function reservaEdita(objeto){
	quitaValidacionTodo(objeto.tabla)
	bloquea();
	const busca= await axios.get('/api/'+objeto.tabla+'/buscar/'+objeto.id+'/'+verSesion(),{ 
		headers:{
			authorization: `Bearer ${verToken()}`
		}
	});
	desbloquea();
	const resp=busca.data.valor.info;
	objeto.cliente.val(resp.ID_CLIENTE).trigger('change.select2');
	objeto.empleado.val(resp.ID_EMPLEADO).trigger('change.select2');
	objeto.comentario.val(resp.COMENTARIO);
	objeto.fechaReserva.val(moment(resp.FECHA_RESERVA).format('DD-MM-YYYY'));
	objeto.horaReserva.val(moment(resp.FECHA_RESERVA).format('HH:mm'));
}

function validaFormularioReserva(objeto){	
	validaVacio(objeto.horaReserva);
	validaVacioSelect(objeto.cliente);
	validaVacioSelect(objeto.empleado);

	if(objeto.horaReserva.val()=="" || objeto.cliente.val()=="" || objeto.empleado.val()==""){
		return false;
	}else{
		enviaFormularioReserva(objeto);
	}
}

function enviaFormularioReserva(objeto){
	let dato=(objeto.id==0)?muestraMensaje({tabla:objeto.tabla}):objeto.nombreMsg;
	let verbo=(objeto.id==0)?'Creará':'Modificará';
	var fd = new FormData(document.getElementById(objeto.tabla));
	fd.append("id", objeto.id);
	fd.append("sesId", verSesion());
	
	confirm("¡"+verbo+" la reserva para: "+dato+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body=fd;
		try {
			let creaEdita;
			if(objeto.id==0){
				creaEdita = await axios.post("/api/"+objeto.tabla+"/crear",body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			}else{
				creaEdita = await axios.put("/api/"+objeto.tabla+"/editar/"+objeto.id,body,{ 
					headers:{
						authorization: `Bearer ${verToken()}`
					} 
				});
			}
			desbloquea();
			$("#general1").modal("hide");
			resp=creaEdita.data.valor;
			if(resp.resultado){
				activarCalendario(objeto);
			}else{
				mensajeSistema(resp.mensaje);
			}	
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
    });
}

async function enviaFormularioReservaDD(objeto){
	bloquea();
	let body={
		id:objeto.id,
		fecha:objeto.fecha,
		token:verToken(),
		sesId:verSesion()
	};
	try {
		edita = await axios.put("/api/"+objeto.tabla+"/editarDD/"+objeto.id,body,{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		desbloquea();
		resp=edita.data.valor;
		if(resp.resultado){
			activarCalendario(objeto);
		}else{
			mensajeSistema(resp.mensaje);
		}	
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function reservaElimina(objeto){
	confirm("¡Eliminará la reserva de: "+objeto.nombre+"!",function(){
		return false;
	},async function(){
        bloquea();
		try {
			const eliminar = await axios.delete("/api/"+objeto.tabla+"/eliminar/"+objeto.id,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});
			
			desbloquea();
			$("#general1").modal("hide");
			resp=eliminar.data.valor;
			if(resp.resultado){
				activarCalendario(objeto);
			}else{
				mensajeSistema(resp.mensaje);
			}
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	});
}

function reservaEstado(objeto){
	confirm("¡Cambiará el estado del registro: "+objeto.nombre+"!",function(){
		return false;
	},async function(){
		bloquea();
		let body={
		}
		try {
			const estado = await axios.put("/api/"+objeto.tabla+"/estado/"+objeto.id,body,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});
			desbloquea();
			resp=estado.data.valor;
			if(resp.resultado){
				let estado=(resp.info.ESTADO==0)?'tachado':'';

				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadoTachado ").removeClass('tachado');

				$("#"+objeto.tabla+"Tabla #"+objeto.id+" .estadoTachado ").addClass(estado);

				//success("Estado","¡Se ha cambiado el estado del registro: "+objeto.nombre+"!");
				activarCalendario(objeto);
			}else{
				mensajeSistema(resp.mensaje);
			}
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	});
}

