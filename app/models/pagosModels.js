const pool = require('../config/connections');

const crearPagos = async (body)=>{

    const query = `CALL USP_UPD_INS_PAGO_MEMBRESIA(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        0,
        0,
        body.medioPago, 
        0, 
        (body.observacion=='')?null:body.observacion,
        body.imagen,
        body.estado,
        'crea',
        body.sesId
    ]);
    
    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarPagos = async (id,body)=>{

    const query = `CALL USP_UPD_INS_PAGO_MEMBRESIA(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        0,
        body.medioPago, 
        0, 
        (body.observacion=='')?null:body.observacion,
        body.imagen,
        body.estado,
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarPagos = async(id,tabla,sesId)=>{
    if(id==0){
        return { 
            resultado : true,
            info : [],
            mensaje : '¡Exito!'
        }; 
    }
    const query = `CALL USP_SEL_VERLISTAID(?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        tabla,
        sesId
    ]);
        
    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Exito!'
    }; 
    
}

const listarPagos = async (id, tabla,sesId)=>{
    const query = `CALL USP_SEL_VERLISTA(?, ?, ?)`;
    const row =  await pool.query(query,
    [
        id,
        tabla,
        sesId
    ]);

    return { 
        resultado : true,
        info : row[0],
        mensaje : '¡Exito!'
    }; 
}


const eliminarPagos = async(id,tabla)=>{
    const query = `CALL USP_DEL_ELIMINA(?, ?)`;
    const row =  await pool.query(query,
    [
        id,
        tabla
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro eliminado!'
    }; 
    
}

const estadoPagos = async(id,tabla)=>{
    const query = `CALL USP_UPD_ESTADO(?, ?)`;
    const row =  await pool.query(query,
    [
        id,
        tabla
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro eliminado!'
    }; 
    
}

module.exports = {
    crearPagos,
    editarPagos,
    buscarPagos,
    listarPagos,
    estadoPagos,
    eliminarPagos
}

