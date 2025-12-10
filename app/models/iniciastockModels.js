const pool = require('../config/connections');

const crearIniciastock = async (body)=>{
    /*console.log('CALL USP_UPD_INS_TABLA_DINAMICA (',null,",",
        null,",",
        null,",",
         null,",",
         (Array.isArray(body.productoSucursal))?body.productoSucursal.join():body.productoSucursal, 
         (Array.isArray(body.cantidadStock))?body.cantidadStock.join():body.cantidadStock,
       null,",",
       null,",",
       null,",",
       null,",",
       null,",",
       null,",",
        'actualizaStock',",", 
        body.sesId,')')
        return*/

    const query = `CALL USP_UPD_INS_TABLA_DINAMICA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const row= await pool.query(query,
    [
        null,
        null,
        null,
        null,
        (Array.isArray(body.productoSucursal))?body.productoSucursal.join():body.productoSucursal, 
        (Array.isArray(body.cantidadStock))?body.cantidadStock.join():body.cantidadStock,
        null,
        null,
        null,
        null,
        null,
        null,
        'actualizaStock',
        body.sesId
    ]);

    return { 
        resultado : true,
        //info : row[0][0],
        mensaje : '¡Registro creado!'
    }; 
}

const editarIniciastock = async (id,body)=>{

    const query = `CALL USP_UPD_INS_INICIASTOCK(?, ?, ?, ?, ?)`;
    const row = await pool.query(query,
    [
        id,
        body.nombre,
        body.descripcion, 
        'edita',
        body.sesId
    ]);

    return { 
        resultado : true,
        info : row[0][0],
        mensaje : '¡Registro editado!'
    }; 
    
}

const buscarIniciastock = async(id,tabla,sesId)=>{
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

const listarIniciastock = async (id, tabla,sesId)=>{
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


const eliminarIniciastock = async(id,tabla)=>{
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

const estadoIniciastock = async(id,tabla)=>{
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
    crearIniciastock,
    editarIniciastock,
    buscarIniciastock,
    listarIniciastock,
    estadoIniciastock,
    eliminarIniciastock
}

