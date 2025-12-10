const {accesoGuarda,cambiaPassword,salirLogin, listaIdMenu,verificaPassword,accesoImpresion, accesoPrivilegio, accesoSesion} = require('../models/accesoModels');

const guardar=(req, res)=>{
    const id =  req.params.id;

    accesoGuarda(id,req.body)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    });
}

const password=(req, res)=>{
    const sesId =  req.params.sesId;
    cambiaPassword(sesId, req.body)
    .then(valor => {
        //req.logOut();
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    });
}

const verificaPass=(req, res)=>{
    const sesId =  req.params.sesId;
    verificaPassword(sesId,req.body)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    });
}


const accesoMenu=(req, res)=>{
    const id=req.params.id;
    const nivel=req.params.nivel;
    const sesId=req.params.sesId;
    const tabla=req.params.tabla;

    listaIdMenu(id,tabla,nivel,sesId)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    }); 
}

const logout=(req, res)=>{
    const sesId =  req.params.sesId;
    const ip =  req.ip;  
    const server =  req.hostname;
    salirLogin(sesId,ip,server)
    .then(valor => {
        req.logOut();
        res.json({
            valor : valor
        }); 
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    });
}

const impresion=(req, res)=>{
    const sesId =  req.params.sesId;
    accesoImpresion(sesId,req.body)
    .then(valor => {
        res.json({
            valor : valor
        }); 
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    });
}

const privilegio=(req, res)=>{
    const sesId=req.params.sesId;
    const idSubMenu=req.params.idSubMenu;
    accesoPrivilegio(idSubMenu,sesId)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    });
}

const sesion=(req, res)=>{
    accesoSesion(req.body)
    .then(valor => {
        res.json({
            valor : valor
        });
    })
    .catch(error => {
        res.status(400).json({
            error : {
                message:error.message,
                errno: error.errno,
                code : error.code
            }
        });
    });
}

module.exports = {
    guardar,
    password,
    verificaPass,
    logout,
    accesoMenu,
    impresion,
    privilegio,
    sesion
}