// JavaScript Document
$(document).ready(async function() {
	bloquea();
	let tabla="modulo";
	let tipo="Menu";
	let tipo2="Submenu";

	try {
		const lista = await axios.get("/api/modulo/menu/moduloMenu/0/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		const resp=lista.data.valor.info;
		desbloquea();
		let modulo=`<form id="${tabla}">
			<div class="card mg-t-10">
				<div class="card-header tx-medium bd-0 tx-white bg-primary-gradient">
					GESTIONAR MÓDULOS
				</div>
				<div class="row match-height mg-t-10">
					<div class="col-xl-6 col-md-6 col-sm-12">
						<div class="card card-primary mg-l-10">
							<h4 class="card-header">MENÚ</h4>
							<div class="card-content">
								<div id="moduloMenu">
									${moduloMenu({resp:resp})}
								</div>
							</div>
						</div>
					</div>
					<div class="col-xl-6 col-md-6 col-sm-12">
						<div class="card card-primary mg-r-10">
							<h4 class="card-header">SUBMENÚ</h4>
							<div class="card-content">
								<div id="moduloSubmenu">
									
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>`;
		$("#cuerpoPrincipal").html(modulo);

		
		$('#'+tabla+tipo+' li').off( 'click');
		$('#'+tabla+tipo+' li').on( 'click', 'span[name=menuLista]', function () {
			$('#'+tabla+tipo+' li span').removeClass("estiloAcceso"); 
			$(this).addClass("estiloAcceso");
			$("#"+tabla+tipo2+' .modulo').html("");
			$("#"+tabla+tipo2+' .card-footer').html("");
			let idMenu=$(this).parents("li").find("input[name=idMenu]").val();
			
			muestraAccesoSubmenu({idMenu:idMenu,tabla:tabla,tipo2:tipo2});
		});

		$('#'+tabla+tipo).off( 'click');
		$('#'+tabla+tipo).on( 'click', 'button[name='+tipo+']', function () {
			guardaModulo({idSubmenu:0,tabla:tabla,tipoGuarda:tipo.toLowerCase()});
		});

	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
});

function moduloMenu(objeto){
	let menu=`<div class="card-body">
						<ul class="list-group list-group-flush">`;
							for(var i=0; i < objeto.resp.length; i++) {
					menu+=`<li class="list-group-item d-flex justify-content-between">
									<span class="btn btn-outline-dark btn-sm cursor" name="menuLista">${objeto.resp[i].nomb_menu}</span>
									<span class="badge badge-pill d-flex">
										<input name="idMenu" type="hidden" value="${objeto.resp[i].id_menu}"/>
										<input class="cursor" name="menuCheck" type="checkbox" value="${objeto.resp[i].id_menu}"`;
											if(objeto.resp[i].ES_ELIMINADO==0){
												menu+=`checked="checked"`;
											}
							menu+=`/>
									</span>
								</li>`;
							}
			menu+=`</ul>
					</div>
					<div class="card-footer text-center pt-2">
						<button name='Menu' type="button" class="btn btn-primary btn-min-width mr-1 mb-1"><i class="la la-save"></i>
							<span class='p-1'>GUARDAR CAMBIOS</span>
						</button>
					</div>`;
	return menu;
}

async function muestraAccesoSubmenu(objeto){
	bloquea();
	try{
		const moduloSubmenu = await axios.get("/api/modulo/submenu/moduloSubmenu/"+objeto.idMenu+"/"+verSesion(),{ 
			headers:{
				authorization: `Bearer ${verToken()}`
			} 
		});
		const resp=moduloSubmenu.data.valor.info;

		let submenu=`<div class="card-body">
			<ul class="list-group list-group-flush">`;
				for(var i=0; i < resp.length; i++) {
				submenu+=`<li class="list-group-item d-flex justify-content-between">
					<span class="btn btn-outline-dark btn-sm cursor" name="submenuLista">${resp[i].nomb_sume}</span>
						<span class="badge badge-pill d-flex">
							<input name="idSubmenu" type="hidden" value="${resp[i].id_sume}"/>
							<input  class="cursor" name="submenuCheck" type="checkbox" value="${resp[i].id_sume}"`;
								if(resp[i].ES_ELIMINADO==0){
									submenu+=`checked="checked"`;
								}
						submenu+=`/>
						</span>
					</li>`;
				}
		submenu+=`</ul>
		</div>
		<div class="card-footer text-center pt-2">`;
			if(resp.length>0){
			submenu+=`<button name='Submenu' type="button" class="btn btn-primary btn-min-width mr-1 mb-1"><i class="la la-save"></i>
					<span class='p-1'>GUARDAR CAMBIOS</span>
				</button>`;
			}
		submenu+=`</div>`;
		desbloquea();
		$("#"+objeto.tabla+objeto.tipo2).html(submenu);

		$('#'+objeto.tabla+objeto.tipo2).off( 'click');
		$('#'+objeto.tabla+objeto.tipo2).on( 'click', 'button[name='+objeto.tipo2+']', function () {
			guardaModulo({idSubmenu:0,tabla:objeto.tabla,tipoGuarda:objeto.tipo2.toLowerCase()});
		});
	}catch (err) {
		desbloquea();
		message=(err.response)?err.response.data.error:err;
		mensajeError(message);
	}
}


function guardaModulo(objeto){
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
			tipo: objeto.tipoGuarda,
			activo: activo,
			sesId:verSesion(),
			inactivo: inactivo,
			idSubmenu: objeto.idSubmenu,
			token :verToken()

		}
		try{
			const detalle = await axios.put("/api/modulo/guarda/"+objeto.idSubmenu,body,{ 
				headers:{
					authorization: `Bearer ${verToken()}`
				} 
			});
			const resp=detalle.data.valor.info;
			desbloquea();
			socket.emit('actualizaModulo',{
				cargaMenu: true
			})
		}catch (err) {
			desbloquea();
			message=(err.response)?err.response.data.error:err;
			mensajeError(message);
		}
	});
}
