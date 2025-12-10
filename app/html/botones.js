const botones = (opcion,titulo) =>{
    if(opcion==1){
        return `<button type='Crea' name='btnNuevo' class=btn btn-primary btn-md mt-1 mb-1 crea'>
                    <span class='p-1'>CREAR `+titulo.toUpperCase()+`</span>
                </button>`
    }else if(opcion==2){
        return `<a type='Edita' class="dropdown-item crud edita cursor">
                    <i class='la la-edit'></i>MODIFICAR
                </a>`;
    }else if(opcion==3){
        return `<a type='elimina' class="dropdown-item crud elimina cursor">
                    <i class='las la-trash la-2x'></i>ELIMINAR
                </a>`;
    }else if(opcion==4){
        return `<span class="mr-auto d-flex align-items-center text-danger"><strong>(*) Campos Obligatorios</strong></span>
                <button name='btnCrea' class='ml-auto crud btn btn-primary btn-md mt-1 mb-1'>
                    <i class='la la-plus-circle'></i>
                    <span class='p-1' >CREAR</span>
                </button>`;
    }else if(opcion==5){
        return `<span class="mr-auto d-flex align-items-center text-danger"><strong>(*) Campos Obligatorios</strong></span>
                <button name='btnEdita' class='ml-auto crud btn btn-primary btn-md mt-1 mb-1'>
                    <i class='la la-save'></i>
                    <span class='p-1'>EDITAR</span>
                </button>`;
    }else if(opcion==6){
        return `<a type='Estado' class="dropdown-item crud estado cursor">
                    <span><i class='las la-check-circle la-2x'></i> ESTADO</span>
                </a>`;
    }else if(opcion==7){
        return `<a type='Descarga' class="dropdown-item crud cursor descarga">
                    <span><i class='fas fa-file-download'></i> DESCARGA</span>
                </a>`;
    }else if(opcion==8){
        return `<a type='Sesion' class="dropdown-item crud sesion cursor">
                    <span><i class='fas fa-user-clock'></i> SESIÓN</span>
                </a>`;
    }else if(opcion==9){
        return `<a type='ContrasenaSuper' class="dropdown-item crud contrasenaSuper cursor">
                    <span><i class='la la-key'></i> CONTRASEÑA</span>
                </a>`;
    }else if(opcion==10){
        return `<a type='Bloquea' class="dropdown-item crud bloqueo cursor">
                    <span><i class='la la-times-circle'></i> DESBLOQUEAR</span>
                </a>`;
    }else if(opcion==11){
        return `<a type='Detalle' class="dropdown-item crud detalle cursor">
                    <span><i class='la la-eye'></i> DETALLE</span>
                </a>`;
    }else if(opcion==12){
        return `<button name='btnBuscar' class='crud btn btn-primary btn-md mt-1 mb-1'>
                    <i class='fas fa-search-plus'></i>
                    <span class='p-1' >BUSCAR</span>
                </button>`;
    }else if(opcion==13){
        return `<a type='Agrega' class="dropdown-item crud agrega cursor text-center">
                    <span><i class='fas fa-plus-circle fa-2x'></i></span>
                </a>`;
    }else if(opcion==14){
        return `<a type='Elimina' class="dropdown-item crud elimina cursor">
                    <span><i class='las la-trash la-2x'></i> ELIMINAR</span>
                </a>`;
    }else if(opcion==15){
        return `<a type='Finaliza' class="dropdown-item crud finaliza cursor">
                    <span><i class='fas fa-book'></i> ARCHIVAR PROCESO</span>
                </a>`;
    }else if(opcion==16){
        return `<a type='Expediente' class='dropdown-item crud expediente cursor'>
                    <span><i class="la la-book"></i> EXPEDIENTE VIRTUAL</span>
                </a>`;
    }else if(opcion==17){
        return `<a type='Imagen' class="dropdown-item imagen cursor crud">
                    <span><i class='fas fa-camera'></i> IMAGEN</span>
                </a>`;
    }else if(opcion==18){
        return `<a type='Pago' class="dropdown-item pago cursor crud ">
                    <span><i class='far fa-thumbs-up'></i> PAGAR</span>
                </a>`;
    }else if(opcion==19){
        return  `
                <span class="mr-auto d-flex align-items-center text-danger"><strong>(*) Campos Obligatorios</strong></span>
                <button name='btnGuarda' class='ml-auto crud btn btn-primary btn-md mt-1 mb-1'>
                    <i class='fas fa-edit'></i>
                    <span class='p-1'>GUARDAR</span>
                </button>
                `;
    }else if(opcion==20){
        return `<a type='Edita' class="dropdown-item edita cursor crud ">
                    <span><i class='la la-eye'></i> VER INFORMACION</span>
                </a>`;
    }else if(opcion==21){
        return `<a type="Estado" class="dropdown-item crud estado cursor">
                    <span><i class='las la-check-circle la-2x'></i> ESTADO</span>
                </a>`;
    }else if(opcion==22){
        return `<button name='btnCorreo' class='crud btn btn-primary btn-md mt-1 mb-1'>
                    <i class='fas fa-envelope-open-text'></i>
                    <span class='p-1' >ENVIAR</span>
                </button><br>
                <span><strong>(*) Campos Obligatorios</strong></span>`;
    }else if(opcion==23){
        return `<button name='btnContable' class='crud btn btn-primary btn-md mt-1 mb-1'>
                    <i class='fas fa-money-check-alt'></i>
                    <span class='p-1' >VER PAGOS</span>
                </button>`;
    }else if(opcion==24){
        return `<a type="Agente" class="dropdown-item crud agente cursor">
                    <span><i class="la la-user"></i> AGENTE</span>
                </a>`;
    }else if(opcion==25){
        return `<a type="Ficha" class="dropdown-item crud ficha cursor">
                    <span><i class='fas fa-address-card'></i> FICHA</span>
                </a>`;
    }else if(opcion==26){
        return `<a type="Documento" class="dropdown-item crud documento cursor">
                    <span><i class='fas fa-file-alt'></i> DOCUMENTO</span>
                </a>`;
    }else if(opcion==27){
        return `<a type="Aviso" class="dropdown-item crud aviso cursor">
                    <span><i class='fas fa-bullhorn'></i> AVISO</span>
                </a>`;
    }else if(opcion==28){
        return `<button name='btnSubida' class='crud btn btn-primary btn-md mt-1 mb-1'>
                    <i class='fas fa-upload'></i>
                    <span class='p-1' >SUBIDA</span>
                </button>`;
    }else if(opcion==29){
        if(titulo==42){
            return `<a type="Asigna" class="dropdown-item crud asigna cursor">
                        <span><i class='fas fa-hand-point-up'></i> ASIGNAR</span>
                    </a>`;
        }else if(titulo==43){
            return `<a type="Asigna" class="dropdown-item crud asigna cursor">
                        <span><i class='fas fa-hand-point-down'></i> DESASIGNAR</span>
                    </a>`;
        }
    }else if(opcion==30){
        if(titulo==43){
            return `<a type="Atiende" class="dropdown-item crud atiende cursor">
                        <span><i class='fas fa-handshake'></i> ATENDER</span>
                    </a>`;
        }else if(titulo==44){
            return `<a type="Atiende" class="dropdown-item crud atiende cursor">
                        <span><i class='fas fa-handshake-slash'></i> DESATENDER</span>
                    </a>`;
        }
    }else if(opcion==31){
        if(titulo!=45){
            return `<a type="Cancela" class="dropdown-item crud cancela cursor">
                        <span><i class='fas fa-ban'></i> CANCELAR</span>
                    </a>`;
        }
    }else if(opcion==32){
        return `<a type="Asigna" class="dropdown-item crud asigna cursor">
                    <span><i class="fas fa-store"></i> ASIGNAR</span>
                </a>`;
    }else if(opcion==35){
        return `<a type="Quita" class="list-group crud quita cursor">
                    <span><i class='fas fa-trash-alt fa-2x'></i></span>
                </a>`;
    }
    
}

module.exports={
    botones
}