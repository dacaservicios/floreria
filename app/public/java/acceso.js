// JavaScript Document
$(document).ready(async function() {
	bloquea();
	let tabla="acceso";
	let tipo="Menu";
	let tipo2="Submenu";

	try {
		const lista = await axios.get("/api/nivel/listar/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		const resp=lista.data.valor.info;
		desbloquea();
		let acceso=`
		<form id="${tabla}">
			<div class="card mg-t-10">
				<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient">
					GESTIONAR ACCESOS
				</div>
				<div class="row  d-flex justify-content-center pt-3 pb-3">
					<div class="col-6 mb-1">
						<select class="form-control select2" name="idNivel">
							<option value="" selected>SELECT NIVEL</option>`;
							for(var i=0; i < resp.length; i++) {
						acceso+=`<option value="${resp[i].ID_NIVEL}">${resp[i].NOMB_NIVEL}</option>`;
							}
				acceso+=`</select>
					</div>
				</div>

				<div class="row match-height">
					<div class="col-xl-6 col-md-6 col-sm-12">
						<div class="card card-primary mg-l-10">
							<h4 class="card-header">MENÚ</h4>
							<div class="card-content">
								<div id="accesoMenu">
									
								</div>
							</div>
						</div>
					</div>
					<div class="col-xl-6 col-md-6 col-sm-12">
						<div class="card card-primary mg-r-10">
							<h4 class="card-header">SUBMENÚ</h4>
							<div class="card-content">
								<div id="accesoSubmenu">
									
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>`
		$("#cuerpoPrincipal").html(acceso);
		$(".select2").select2({
			placeholder:'Select...',
			dropdownAutoWidth: true,
			width: '100%'
		});
		$('#'+tabla).off( 'change');
		$('#'+tabla).on( 'change', 'select', function () {
			
			$("#"+tabla+tipo2+' .acceso').html("");
			$("#"+tabla+tipo2+' .card-footer').html("");
			let idNivel=$(this).val();

			muestraAccesoMenu({idMenu:0,idNivel:idNivel,tabla:tabla,tipo:tipo,tipo2:tipo2});	

		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});


async function muestraAccesoMenu(objeto){
	bloquea();
	try{
		const accesoMenu = await axios.get("/api/"+objeto.tabla+"/menu/accesoMenu/"+objeto.idMenu+"/"+objeto.idNivel+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		const resp=accesoMenu.data.valor.info;
		let menu=`<div class="card-body"></div>
					<ul class="list-group list-group-flush">`;
					for(var i=0; i < resp.length; i++) {
					menu+=`<li class="list-group-item d-flex justify-content-between">
							<span class="btn btn-outline-dark btn-sm cursor" name="menuLista">${resp[i].nomb_menu}</span>
							<span class="badge badge-pill d-flex">
								<input name="idMenu" type="hidden" value="${resp[i].id_menu}"/>
								<input name="menuCheck" type="checkbox" value="${resp[i].id_nime}"`
									if(resp[i].ES_VIGENTE==1){
								menu+=`checked="checked"`;
									}
							menu+=`/>
							</span>
						</li>`;
						}
			menu+=`</ul>
				</div>
				<div class="card-footer text-center">`;
					if(resp.length>0){
				menu+=`<button name='Menu' type="button" class="btn btn-primary btn-min-width mr-1 mb-1"><i class="la la-save"></i>
							<span class='p-1'>GUARDAR CAMBIOS</span>
						</button>`;
					}
		menu+=`</div>`;
				desbloquea();
				$("#"+objeto.tabla+objeto.tipo).html(menu);
				menuEvento(objeto);
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}

function menuEvento(objeto){
	$('#'+objeto.tabla+objeto.tipo+' li').off( 'click');
	$('#'+objeto.tabla+objeto.tipo+' li').on( 'click', 'span[name=menuLista]', function () {
		$('#'+objeto.tabla+objeto.tipo+' li span').removeClass("estiloAcceso"); 
		$(this).addClass("estiloAcceso");
		$("#"+objeto.tabla+objeto.tipo2+' .acceso').html("");
		$("#"+objeto.tabla+objeto.tipo2+' .card-footer').html("");
		let idMenu=$(this).parents("li").find("input[name=idMenu]").val();
		
		muestraAccesoSubmenu({idMenu:idMenu,idNivel:objeto.idNivel,tabla:objeto.tabla,tipo2:objeto.tipo2});
	});

	$('#'+objeto.tabla+objeto.tipo).off( 'click');
	$('#'+objeto.tabla+objeto.tipo).on( 'click', 'button[name='+objeto.tipo+']', function () {
		guardaAcceso({tabla:objeto.tabla,idNivel:objeto.idNivel,tipoGuarda:objeto.tipo.toLowerCase()});
	});	
}

async function muestraAccesoSubmenu(objeto){
	bloquea();
	try{
		const accesoSubmenu = await axios.get("/api/"+objeto.tabla+"/submenu/accesoSubmenu/"+objeto.idMenu+"/"+objeto.idNivel+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		const resp=accesoSubmenu.data.valor.info;
		let submenu=`
		<div class="card-body">
		<ul class="list-group list-group-flush">`;
			for(var i=0; i < resp.length; i++) {
				submenu+=`<li class="list-group-item d-flex justify-content-between">
					<span class="btn btn-outline-dark btn-sm cursor" name="submenuLista">${resp[i].nomb_sume}</span> 
					<span class="badge badge-pill d-flex">
						<input name="idSubmenu" type="hidden" value="${resp[i].id_sume}"/>
						<input name="submenuCheck" type="checkbox" value="${resp[i].id_mesu}"`;
							if(resp[i].ES_VIGENTE==1){
						submenu+=`checked="checked"`;
							}
				submenu+=`/>
					</span>
				</li>`;
			}
submenu+=`</ul>
		</div>
		<div class="card-footer text-center">`;
			if(resp.length>0){
		submenu+=`<button name='Submenu' type="button" class="btn btn-primary btn-min-width mr-1 mb-1"><i class="la la-save"></i>
					<span class='p-1'>GUARDAR CAMBIOS</span>
				</button>`;
			}
submenu+=`</div>`;
		desbloquea();
		$("#"+objeto.tabla+objeto.tipo2).html(submenu);
		$('#'+objeto.tabla+objeto.tipo2).on( 'click');
		$('#'+objeto.tabla+objeto.tipo2).on( 'click', 'button[name='+objeto.tipo2+']', function () {
			guardaAcceso({tabla:objeto.tabla,idNivel:objeto.idNivel,tipoGuarda:objeto.tipo2.toLowerCase()});
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}


function guardaAcceso(objeto){
	confirm("¿Está seguro de actualizar los accesos de "+ objeto.tipoGuarda.toUpperCase() +"?",function(){
		return false;
	},async function(){
		bloquea();
		let activo="";
		let inactivo="";
		let comaActivo="";
		let comaInactivo="";
		
		$("#"+objeto.tabla+" input[name="+objeto.tipoGuarda+"Check]").each(function() {
			if(this.checked){
				activo=activo+comaActivo+$(this).val();
				comaActivo=",";
			}else{
				inactivo=inactivo+comaInactivo+$(this).val();
				comaInactivo=",";
			}
		});

		if(activo==""){
			activo='0';
		}
		if(inactivo==""){
			inactivo='0';
		}

		let body={
			sesId:verSesion(),
			activo: activo,
			inactivo: inactivo,
			idNivel: objeto.idNivel,
			tipo:objeto.tipoGuarda
		}
		try {
			const detalle = await axios.put("/api/acceso/guarda/"+objeto.idNivel,body,{ 
				headers:{authorization: `Bearer ${verToken()}`} 
			});

			desbloquea();
			resp=detalle.data.valor;
			if(resp.resultado){
				socket.emit('actualizaModulo',{
					cargaMenu: true
				});
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
