const config = require('../config/config');
const moment = require('moment');

const mensajeOnosmastico = (objeto)=>{//ok

var personas='';
let onomastico=objeto.onomastico;
for(var o=0; o<onomastico.length;o++){
    personas= personas+`<div style='font-size:20px;'>`
                            +onomastico[o].NOMBRES+' '+onomastico[o].APELLIDO_PATERNO+' '+onomastico[o].APELLIDO_MATERNO+
                        `</div>
                        <div style='font-size:20px;padding-botom:10px;'>
                            manzana `+onomastico[o].MANZANA+` lote `+onomastico[o].LOTE+
                        `</div>`;
}

return `
    <html>
    <body style='color:#ffffff; width:100%;margin:auto;font-family:Lato,Helvetica,Arial,sans-serif;margin-top: 30px;'>
        <div style='background-color:#359C7F;width: 500px;margin-left: auto;margin-right: auto;border-radius: 20px;'>
            <div style='text-align:center; font-weight:700;border-radius: 20px 20px 0 0; background-color:804000; padding-top: -20px;'>
                <h1 style='margin:0;margin-top: -10;padding-bottom: 20px;padding-top: 20px;color:white'>
                    <div>`+objeto.fecha+`</div>
                    <div>¡Feliz Cumpleaños!</div>
                </h1>
            </div>
            <div style="padding: 10px;font-size:16px;">

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>`+personas+`</div>

                <div style='text-align:left;padding-top:10px;font-weight:700;text-align: center;color:white'>
                    <h4 style='margin:0;'>¡Nuestros mejores deseos de salud, bienestar y éxito, te desean todos los pobladores de nuestro hermoso primero de enero!.</h4>
                </div>
            </div>
        </div>
    </body>
</html>`; 
}

const mensajeOlvidaPassword = (objeto)=>{//ok

    return `
    <html>
    <body style='color:#ffffff; width:100%;margin:auto;font-family:Lato,Helvetica,Arial,sans-serif;margin-top: 30px;'>
        <div style='background-color:#359C7F;width: 500px;margin-left: auto;margin-right: auto;border-radius: 20px;'>
            <div style='text-align:center; font-weight:700;border-radius: 20px 20px 0 0; background-color:804000; padding-top: -20px;'>
                <h1 style='margin:0;margin-top: -10;padding-bottom: 20px;padding-top: 20px;color:white'>
                    ¡Tu contraseña se ha actualizado!
                </h1>
            </div>
            <div style="padding: 20px;font-size:16px;">
    
                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Aqui tienes la información de tu cuenta:
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                   <h3 style='margin:0;'><strong>usuario:</strong> (tu email)</h3>
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                    <h3 style='margin:0;'><strong>contraseña:</strong> `+objeto.contrasena+`</h3>
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Por favor, agradeceremos muchísimo que cambie esta contraseña para mayor seguridad de su cuenta.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Te recordamos que si tienes alguna duda háganosla saber, ya que estamos a su disposición.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Puedes iniciar sesión desde aquí.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    <h2><a style='color:white;' href="`+config.URL_SISTEMA+`">Iniciar sesión</a></h2>
                </div>

                <div style='text-align:left;padding-top:10px;font-weight:700;text-align: center;color:white'>
                    <h4 style='margin:0;'>Saludos.</h4>
                </div>
            </div>
        </div>
    </body>
</html>`; 
}

const mensajeCambiaPassword = (objeto)=>{//ok
    return `
    <html>
    <body style='color:#ffffff; width:100%;margin:auto;font-family:Lato,Helvetica,Arial,sans-serif;margin-top: 30px;'>
        <div style='background-color:#359C7F;width: 500px;margin-left: auto;margin-right: auto;border-radius: 20px;'>
            <div style='text-align:center; font-weight:700;border-radius: 20px 20px 0 0; background-color:804000; padding-top: -20px;'>
                <h1 style='margin:0;margin-top: -10;padding-bottom: 20px;padding-top: 20px;color:white'>
                    ¡Has cambiado tu contraseña!
                </h1>
            </div>
            <div style="padding: 20px;font-size:16px;">
    
                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Aqui tienes la información de tu cuenta:
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                   <h3 style='margin:0;'><strong>usuario:</strong> (tu email)</h3>
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                    <h3 style='margin:0;'><strong>contraseña:</strong> `+objeto.contrasena+`</h3>
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Te recordamos que si tienes alguna duda háganosla saber, ya que estamos a su disposición.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Puedes iniciar sesión desde aquí.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    <h2><a style='color:white;' href="`+config.URL_SISTEMA+`">Iniciar sesión</a></h2>
                </div>

                <div style='text-align:left;padding-top:10px;font-weight:700;text-align: center;color:white'>
                    <h4 style='margin:0;'>Saludos.</h4>
                </div>
            </div>
        </div>
    </body>
</html>`; 

}

const mensajeCreaUsuario = (objeto)=>{//ok

return `
<html>
    <body style='width:100%;margin:auto;font-family:Lato,Helvetica,Arial,sans-serif;margin-top: 30px;'>
        <div style='background-color:#359C7F;width: 500px;margin-left: auto;margin-right: auto;border-radius: 20px;'>
            <div style='text-align:center; font-weight:700;border-radius: 20px 20px 0 0; background-color:804000; padding-top: -20px;'>
                <h1 style='margin:0;margin-top: -10;padding-bottom: 20px;padding-top: 20px;color:white'>¡Registro exitoso!</h1>
            </div>
            <div style="padding: 20px;font-size:16px;">
                <div style='text-align:left; padding-top:10px;text-align: center;color:white'>
                    Bienvenido al sistema `+objeto.sucursal+`, tu nueva herramienta para la gestion de tus procesos.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Te damos una calurosa bienvenida y nos llena de alegría tú elección de estar a la vanguardía con la tecnoñogía.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Aqui tienes la información de tu cuenta:
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                   <h3 style='margin:0;'><strong>usuario:</strong> (tu email)</h3>
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                    <h3 style='margin:0;'><strong>contraseña:</strong> `+objeto.contrasena+`</h3>
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                    <h3 style='margin:0;'><strong>clave:</strong> `+objeto.clave+`</h3>
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Por favor, agradeceremos muchísimo que cambie esta contraseña para mayor seguridad de su cuenta.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Nuevamante te damos la bienvenida y te recordamos que si tienes alguna duda háganosla saber, ya que estamos a tu disposición.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Puedes iniciar sesión desde aquí.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    <h2><a style='color:white;' href="`+config.URL_SISTEMA+`">Iniciar sesión</a></h2>
                </div>

                <div style='text-align:left;padding-top:10px;font-weight:700;text-align: center;color:white'>
                    <h4 style='margin:0;'>Saludos.</h4>
                </div>
            </div>
        </div>
    </body>
</html>`; 
}

const mensajeCorreoMasivo = (objeto)=>{
    return `
    <html>
    <body style='color:#ffffff; width:100%;margin:auto;font-family:Lato,Helvetica,Arial,sans-serif;margin-top: 30px;'>
        <div style='background-color:#359C7F;width: 500px;margin-left: auto;margin-right: auto;border-radius: 20px;'>
            <div style='text-align:center; font-weight:700;border-radius: 20px 20px 0 0; background-color:804000;'>
                <h1 style='margin:0;margin-top: -10;padding-top: 20px;color:white'>
                    Aviso Importante
                </h1>
            </div>
            <div style="padding: 10px;font-size:16px;">
                <div style='text-align:left;text-align: center;color:white'>
                    Estimado `+objeto.cliente+` le hacemos llegar el siguiente aviso:
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                    <img style="width: 450px;" src="`+config.URL_SISTEMA+objeto.rutaImagen+`" />
                </div>

                <div style='text-align:left;padding-top:10px;font-weight:700;text-align: center;color:white'>
                    <h4 style='margin:0;'>Saludos.</h4>
                </div>
            </div>
        </div>
    </body>
</html>`; 
}


const mensajeOperacionPagada = (objeto)=>{//ok
    let monedaMonto='';
    let monedaImporte='';
    let importe='';
    let monto='';
    if(objeto.tipoOperacion==2618){//COMPRAR DOLARES
        monedaMonto='S/.';
        monedaImporte='USD';
        importe=objeto.importe;
        monto=objeto.monto;
    }else if(objeto.tipoOperacion==2619){//VENDER DOLARES
        monedaMonto='USD';
        monedaImporte='S/.';
        importe=objeto.monto;
        monto=objeto.importe;
    }
    return `
    <html>
    <body style='color:#ffffff; width:100%;margin:auto;font-family:Lato,Helvetica,Arial,sans-serif;margin-top: 30px;'>
        <div style='background-color:#359C7F;width: 500px;margin-left: auto;margin-right: auto;border-radius: 20px;'>
            <div style='text-align:center; font-weight:700;border-radius: 20px 20px 0 0; background-color:804000; padding-top: -20px;'>
                <h1 style='margin:0;margin-top: -10;padding-bottom: 20px;padding-top: 20px;color:white'>
                    ¡Transferencia realizada con éxito!
                </h1>
            </div>
            <div style="padding: 20px;font-size:16px;">
    
                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Estimado `+objeto.titular+`
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                    Tu operación con código 
                    <h3 style='margin:0;'><strong>nro: </strong>`+objeto.codigo+`</h3>.
                    ha sido atendida el día `+moment().format('DD-MM-YYYY HH:mm:ss')+`
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                    <h3>Detalle de la operación</h3>
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                    <h4 style='margin:0;'><strong>Tipo de cambio:</strong> `+objeto.tipoCambio+`</h4>
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                    <h4 style='margin:0;'><strong>Envio del cliente:</strong> `+monedaMonto+' '+importe+`</h4>
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                    <h4 style='margin:0;'><strong>Recepción del cliente:</strong> `+monedaImporte+' '+monto+`</h4>
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                    <h4 style='margin:0;'><strong>Beneficiario:</strong> `+objeto.beneficiario+`</h4>
                </div>

                <div style='text-align:left;padding-top:10px;font-weight:700;text-align: center;color:white'>
                    <h4 style='margin:0;'>Saludos.</h4>
                </div>
            </div>
        </div>
    </body>
</html>`; 
}

const mensajeReseteaPassword = (objeto)=>{//ok
    return `
    <html>
    <body style='color:#ffffff; width:100%;margin:auto;font-family:Lato,Helvetica,Arial,sans-serif;margin-top: 30px;'>
        <div style='background-color:#359C7F;width: 500px;margin-left: auto;margin-right: auto;border-radius: 20px;'>
            <div style='text-align:center; font-weight:700;border-radius: 20px 20px 0 0; background-color:804000; padding-top: -20px;'>
                <h1 style='margin:0;margin-top: -10;padding-bottom: 20px;padding-top: 20px;color:white'>
                    ¡El administrador reseteó tu contraseña!
                </h1>
            </div>
            <div style="padding: 20px;font-size:16px;">
    
                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Aqui tienes la información de tu cuenta:
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                   <h3 style='margin:0;'><strong>usuario:</strong>(tu email)</h3>
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                    <h3 style='margin:0;'><strong>contraseña:</strong> `+objeto.contrasena+`</h3>
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Por favor, agradeceremos muchísimo que cambie esta contraseña para mayor seguridad de su cuenta.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Te recordamos que si tienes alguna duda háganosla saber, ya que estamos a su disposición.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Puedes iniciar sesión desde aquí.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    <h2><a style='color:white;' href="`+config.URL_SISTEMA+`">Iniciar sesión</a></h2>
                </div>

                <div style='text-align:left;padding-top:10px;font-weight:700;text-align: center;color:white'>
                    <h4 style='margin:0;'>Saludos.</h4>
                </div>
            </div>
        </div>
    </body>
</html>`; 

}

const mensajeReseteaClave = (objeto)=>{//ok
    return `
    <html>
    <body style='color:#ffffff; width:100%;margin:auto;font-family:Lato,Helvetica,Arial,sans-serif;margin-top: 30px;'>
        <div style='background-color:#359C7F;width: 500px;margin-left: auto;margin-right: auto;border-radius: 20px;'>
            <div style='text-align:center; font-weight:700;border-radius: 20px 20px 0 0; background-color:804000; padding-top: -20px;'>
                <h1 style='margin:0;margin-top: -10;padding-bottom: 20px;padding-top: 20px;color:white'>
                    ¡El administrador reseteó tu clave!
                </h1>
            </div>
            <div style="padding: 20px;font-size:16px;">
    
                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Aqui tienes la información de tu cuenta:
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                   <h3 style='margin:0;'><strong>usuario:</strong>(tu email)</h3>
                </div>

                <div style='text-align:left;padding-top:10px;text-align: center;color:white'>
                    <h3 style='margin:0;'><strong>clave:</strong> `+objeto.clave+`</h3>
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Esta clave es para otorgar permisos a los colaboradores, en caso necesiten eliminar registros de sus ventas.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Te recordamos que si tienes alguna duda háganosla saber, ya que estamos a su disposición.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    Puedes iniciar sesión desde aquí.
                </div>

                <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                    <h2><a style='color:white;' href="`+config.URL_SISTEMA+`">Iniciar sesión</a></h2>
                </div>

                <div style='text-align:left;padding-top:10px;font-weight:700;text-align: center;color:white'>
                    <h4 style='margin:0;'>Saludos.</h4>
                </div>
            </div>
        </div>
    </body>
</html>`; 

}

const mensajeEnvioCorreoTicket = (objeto)=>{//ok
    return `
        <html>
        <body style='color:#ffffff; width:100%;margin:auto;font-family:Lato,Helvetica,Arial,sans-serif;margin-top: 30px;'>
            <div style='background-color:#359C7F;width: 500px;margin-left: auto;margin-right: auto;border-radius: 20px;'>
                <div style='text-align:center; font-weight:700;border-radius: 20px 20px 0 0; background-color:804000; padding-top: -20px;'>
                    <h1 style='margin:0;margin-top: -10;padding-bottom: 20px;padding-top: 20px;color:white'>
                        ¡Envio ticket de atención!
                    </h1>
                </div>
                <div style="padding: 20px;font-size:16px;">
        
                    <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                        Estimado(a) cliente: `+objeto.cliente+`
                    </div>
    
                    <div style='text-align:left;padding-top:20px;text-align: center;color:white'>
                        Gracias por elegir nuestra barbería. Su visita es muy apreciada. Hemos enviado su ticket de atención. Si necesita algo más, estamos aquí para ayudarlo.
                    </div>
    
                    <div style='text-align:left;padding-top:10px;font-weight:700;text-align: center;color:white'>
                        <h4 style='margin:0;'>Saludos.</h4>
                    </div>
                </div>
            </div>
        </body>
    </html>`; 
    }
module.exports = {
    mensajeOnosmastico,
    mensajeOlvidaPassword,
    mensajeCambiaPassword,
    mensajeCreaUsuario,
    mensajeOperacionPagada,
    mensajeCorreoMasivo,
    mensajeReseteaPassword,
    mensajeEnvioCorreoTicket,
    mensajeReseteaClave
}