const {moduloGuarda, listaIdModulo} = require('../models/moduloModels');

const guardar=(req, res)=>{
    const id =  req.params.id;

    moduloGuarda(id,req.body)
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

const moduloMenu=(req, res)=>{
    const id=req.params.id;
    const tabla =  req.params.tabla;
    const sesId=req.params.sesId;

    listaIdModulo(id,tabla,sesId)
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
    moduloMenu
}