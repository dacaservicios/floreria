const pool = require('../config/connections');
const {matchPassword} = require('../libs/helpers');
const config=require('../config/config');
const path = require('path');
const fs = require('fs');



const isLogin = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }else{
        return res.redirect('/');
    }
}

const notLogin = (req, res, next)=>{
    if(!req.isAuthenticated()){
        return next();
    }else{
        return res.redirect('/sistema');
    }
}

/*const sesion = async (req, res, next)=>{
    const sesId=req.session.passport.user.id;
    const body =  req.body;
    const query = `CALL USP_SEL_VERLISTAIDMENU(?, ?, ?, ?)`;
    if(sesId){
        const row = await pool.query(query,
        [
            body.idSubmenu,
            'sesion',
            body.idOpcion,
            sesId
        ]);
        if(row[0][0].sesion=='A'){
            if(body.idOpcion==0){
                res.json({
                    valor:{
                        resultado : true,
                        mensaje : '¡exito!'
                    }
                }); 
                return next();
            }else{
                if(row[0][0].eliminado==0 && row[0][0].vigente==1){
                    res.json({
                        valor:{
                            resultado : true,
                            mensaje : '¡exito!'
                        }
                    }); 
                    return next();
                }else{
                    res.json({
                        valor:{
                            resultado : false,
                            mensaje : '¡No tiene acceso a esta opción!'
                        }
                    }); 
                }
            }
        }else{ 
            res.json({
                valor:{
                    resultado : false,
                    mensaje : '¡No tiene acceso a esta opción!'
                }
            });
            //req.logOut();
            //return res.redirect('/'); 
        }
    }else{
        res.json({
            valor:{
                resultado : false,
                mensaje : '¡No tiene acceso a esta opción!'
            }
        });
        //req.logOut();
        //return res.redirect('/'); 
    }
}*/

const verificarLogin = async (req, res, next)=>{
    const body =  req.body;
    const ip =  req.ip;
    const server =  req.hostname;

    const query = `CALL USP_UPD_INS_REGISTRO(?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        0,
        body.txtCorreo,
        0,
        0,
        2,
        ip,
        server
    ]);
    if(row[0].length==0){
        res.json({
            valor:{
                resultado : false,
                mensaje : '¡El usuario o la contraseña es incorrecto!',
                tipo:1
            }
        });
    /*}else if(row[0][0].SESION=='A'){
        res.json({
            valor:{
                resultado : false,
                mensaje : '¡El usuario ya ha iniciado sesión!',
                tipo:1
            }
        });*/
    }else{
        const validaPassword = matchPassword(body.txtContrasena,row[0][0].CONTRASENA);
        if(validaPassword){
            const row1 = await pool.query(query,
                [
                    0,
                    body.txtCorreo,
                    0, 
                    0,  
                    1,
                    ip,
                    server
                ]);

                if(row1[0][0].MENSAJE=='0'){
                    res.json({
                        valor:{
                            resultado : true,
                            idUser: row[0][0].ID_USUARIO,
                            idNivel: row[0][0].ID_NIVEL
                        }
                    }); 
                }else{
                    res.json({
                        valor:{
                            resultado : false,
                            mensaje : row1[0][0].MENSAJE
                        }
                    }); 
                } 
        }else{
            const row2 = await pool.query(query,
            [
                0,
                body.txtCorreo,
                0,   
                0,
                4,
                ip,
                server
            ]);

            if(row2[0][0].INTENTO>=3){
                res.json({
                    valor:{
                        resultado : false,
                        mensaje : '¡Su sesión esta bloqueada, por superar el número de intentos permitidos (3)!',
                        correo: row2[0][0].EMAIL,
                        tipo:3,
                        url: config.URL_SISTEMA
                    }
                });
            }else{
                res.json({
                    valor:{
                        resultado : false,
                        mensaje : '¡El usuario o la contraseña es incorrecto!',
                        tipo:2
                    }
                });
            }
        }   
    }
}

const verificarDocumento = async (req, res, next)=>{
    const body =  req.body;
    const ip =  req.ip;
    const server =  req.hostname;

    const query = `CALL USP_UPD_INS_REGISTRO(?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        body.tipoDocumento,
        body.numeroDocumento,
        0,
        0,
        11,
        ip,
        server
    ]);

    if(row[0][0].CANTIDAD>0){
        res.json({
            valor:{
                resultado : false,
                mensaje : '¡El tipo y número de documento ya existen, verique los datos ingresados.!'
            }
        });
    }else{
        res.json({
            valor:{
                resultado : true,
                mensaje : '¡No existe usuario, puede seguir!'
            }
        }); 
        //return next(); 
    }

}

const verificaLogeo = async (req, res, next)=>{
    const body =  req.body;
    const ip =  req.ip;
    const server =  req.hostname;
 
    const query = `CALL USP_UPD_INS_REGISTRO(?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        0,
        body.txtCorreo,
        0,
        0,
        2,
        ip,
        server
    ]);

    if(row[0][0]=== undefined){
        res.json({
            valor:{
                resultado : false,
                mensaje : '¡El usuario o la contraseña es incorrecto!'
            }
        }); 
    /*}else if(row[0].SESION=='A'){
        res.json({
            valor:{
                resultado : false,
                mensaje : '¡El usuario ya ha iniciado sesión!',
                tipo:1
            }
        });*/
    }else{
        const validaPassword = matchPassword(body.txtContrasena,row[0][0].CONTRASENA);
        if(validaPassword){
            return next();
        }else{
            await pool.query(query,
            [
                0,
                body.txtCorreo,
                0,   
                0,
                4,
                ip,
                server
            ]);
            res.json({
                valor:{
                    resultado : false,
                    mensaje : '¡El usuario o la contraseña es incorrecto!'
                }
            });
        }   
    }

}

const verificarCorreo = async (req, res, next)=>{
    const query = `CALL USP_UPD_INS_REGISTRO(?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        0,
        req.body.correo,
        0,
        0,
        9,
        0,
        0
    ]);
    
    if(row[0].length>0){ 
        /*res.json({
            valor:{
                resultado : true,
                mensaje : '¡Su correo es correcto!'
            }
        }); */
 
        return next();
    }else{
        res.json({
            valor:{
                resultado : false,
                mensaje : '¡Su correo no esta registrado en el sistema!'
            }
        }); 
    }  

}

const caracter = (req, res, next)=>{
    //next();
    let formato=/^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ!¡#$%&()º_*+\-./:;,=¿?@\[\]\{\|\}\\n\\r ]{1,}$/
    var valores="";
    let datos=(Object.keys(req.body).length===0)?req.params:req.body;

    var arrObj= Object.values(datos);
    for(var v=0;v<arrObj.length;v++){
        valores+=arrObj[v].toString().replace(" ","").replace(/(\r\n|\n|\r)/gm,"");
    }

    let resulta=formato.test(valores);
    if(resulta){
        next();
    }else{
        res.json({
            valor : {
                resultado : false,
                mensaje : '¡Existen caracteres que no estan permitidos!',
            }
        });
        return;
    }

}

const verificaAdjunto = (req, res, next)=>{
    var doc=0;
    var mensajeAdjunto='';
    req.archivo=0; 
    if(req.files==null){
        doc=1;
    }else{
        if(typeof req.files.imagen=== 'object'){
            uploadedFile = req.files.imagen;
            let extension = uploadedFile.name.split('.').pop();
            let tamanio = uploadedFile.size;

            if(config.TAMANO_ADJUNTO<tamanio){
                mensajeAdjunto='¡El documento no debe ser mayor a 1MB!, ';
            }else if(!config.FORMATOS_IMAGEN.includes(extension)){
                mensajeAdjunto='¡El documento debe tener formato: jpg, jpeg, png!, ';
            }else{
                doc=1;
                req.archivo=1;
            }
        }
    }

    if(doc>=1){
        return next(); 
    }else{
        res.json({
            valor:{
                resultado : false,
                mensaje : mensajeAdjunto
            }
        });
    }
 
}

const upload = (req, res, next)=>{
    var uploadedFile;
    var ruta;
    var imagen=0;
    var pdf=0;
    if(req.files==null){
        req.archivo=0; 
        imagen=1;
        pdf=1;
    }else{
        if(typeof req.files.imagenMarca=== 'object'){
            uploadedFile = req.files.imagenMarca;

            ruta='../public/documentos/cliente/DOC_'+req.body.idUsuario+"_"+uploadedFile.name;
            req.archivo="DOC_"+req.body.idUsuario+"_"+uploadedFile.name;
            uploadedFile.mv(path.join(__dirname,ruta));
        }else{
            req.archivo=0;
        }
        
        if(typeof req.files.pdfIndecopi=== 'object'){
            uploadedFile2 = req.files.pdfIndecopi;

            ruta2='../public/documentos/marca/IND_'+req.body.idMarca+"_"+uploadedFile2.name;
            req.archivo2="IND_"+req.body.idMarca+"_"+uploadedFile2.name;
            uploadedFile2.mv(path.join(__dirname,ruta2));
        }else{
            req.archivo2=0;
        }

        imagen=1;
        pdf=1;
    }

    if(imagen+pdf>=1){
        return next(); 
    }else{
        res.json({
            valor:{
                resultado : false,
                mensaje : 'Hubo un problema al subir los archivos'
            }
        });
    }
 
}


const validaSchema=  (schema)=>{
    return async (req, res, next)=>{
        try {
            await schema.validateAsync(req.body);
            next();
        }catch (error) { 
            res.status(400).json({
                /*error : {
                    message:'Hubo un error en la validación',
                    errno: 'de los',
                    code : 'datos'
                }*/
                error : {
                    message:error.message,
                    errno: error.errno,
                    code : error.code
                }
            });
        }
    }
}

const privilegios2 = async (idSubMenu,sesId)=>{
    const query2 = `CALL USP_SEL_VERLISTAIDMENU(?, ?, ?, ?)`;
    const row2 = await pool.query(query2,
    [
        idSubMenu,
        'opcionNivel',
        0,
        sesId
    ]);

    var arr_botones=[];
    for(var i=0;i<row2[0].length;i++){
        arr_botones.push(row2[0][i].nomb_opci);
    }
    
    return data={ 
        botones : arr_botones
    };
    
}

const eliminaDocumentos = (ruta)=>{
    
    if(fs.existsSync(ruta)){
        fs.unlink(ruta, function (err) {
            if (err){
                console.log(err);
            } 
        });
    }    
}

const passwordAleatorio = async ()=>{
    let aleatorio=[];
    let nuevaPass='';
    let numero=['0','1','2','3','4','5','6','7','8','9'];
	let minuscula=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	let mayuscula=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	let especial=['!','¡','#','$','%','&','(',')','*','+','-','.','/',':',';','=','¿','?','@','[',']','{','|','}'];
    let todo=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','!','¡','#','$','%','&','(',')','*','+','-','.','/',':',';','=','¿','?','@','[',']','{','|','}'];
    
    aleatorio.push(numero[Math.floor(Math.random() * numero.length)]);
    aleatorio.push(minuscula[Math.floor(Math.random() * minuscula.length)]);
    aleatorio.push(mayuscula[Math.floor(Math.random() * mayuscula.length)]);
    aleatorio.push(especial[Math.floor(Math.random() * especial.length)]);
    aleatorio.push(todo[Math.floor(Math.random() * todo.length)]);
    aleatorio.push(todo[Math.floor(Math.random() * todo.length)]);

    for(var i=0;i<6;i++){
        var valor=aleatorio[Math.floor(Math.random() * aleatorio.length)]
        var indice = aleatorio.indexOf(valor);
        aleatorio.splice(indice, 1); 
        nuevaPass =nuevaPass + valor
    }

    return nuevaPass;
}

const claveAleatorio = async ()=>{
    let nuevaClave='';
    let numero=['0','1','2','3','4','5','6','7','8','9'];
    
    for(var i=0;i<6;i++){
        var valor=numero[Math.floor(Math.random() * numero.length)]
        var indice = numero.indexOf(valor);
        numero.splice(indice, 1); 
        nuevaClave =nuevaClave + valor
    }

    return nuevaClave;
}


module.exports = {
    isLogin,
    notLogin,
    //sesion,
    verificarLogin,
    verificaLogeo,
    verificarCorreo,
    verificaAdjunto,
    upload,
    caracter,
    validaSchema,
    privilegios2,
    eliminaDocumentos,
    verificarDocumento,
    passwordAleatorio,
    claveAleatorio
}