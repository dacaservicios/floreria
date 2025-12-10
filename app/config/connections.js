const sql = require('mariadb/callback');
const {promisify} = require('util');
const config = require('./config');

const pool = sql.createPool({
  "host"      : config.HOST_BD,
  "user"      : config.USER_BD,
  "password"  : config.PASSWORD,
  "database"  : config.DATABASE,
  "port"      : config.PORT_BD,
  "charset"  : 'utf8mb4'
});
pool.getConnection((error, connection)=>{
    if(error){
        throw error;
        //console.log('existe un problema con la conexión '+error.code);
    }else{
      connection.release();
      console.log("conexion correcta");
      return;
    }
});

pool.query = promisify(pool.query);

module.exports = pool;



