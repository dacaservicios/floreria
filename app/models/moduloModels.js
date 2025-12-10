const pool = require('../config/connections');


const moduloGuarda = async (id,body)=>{ 

    const query = `CALL USP_UPD_CAMBIAMODULO(?, ?, ?, ?, ?)`;
    await pool.query(query,
    [
        id,
        body.activo,
        body.inactivo,
        body.tipo,
        body.sesId
    ]);
    return { 
        resultado : true,
        mensaje : '¡Se actualizó el módulo!'
    };         
}

const listaIdModulo  = async (id,tabla,sesId)=>{
    const query = `CALL USP_SEL_VERLISTAIDMENU(?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        tabla,
        0,
        0,
        sesId
    ]);

    return { 
        resultado : true,
        info:row[0],
        mensaje : '!Se ejecutó correctamente¡'
    };      
}

module.exports = {
    moduloGuarda,
    listaIdModulo
};

