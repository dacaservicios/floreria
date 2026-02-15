const sql = require('mariadb/callback');
const {promisify} = require('util');
const config = require('./config');

const pool = sql.createPool({
  "host"      : config.HOST_BD,
  "user"      : config.USER_BD,
  "password"  : config.PASSWORD,
  "database"  : config.DATABASE,
  "port"      : config.PORT_BD,
  "timezone"  : '+00:00',
  "dateStrings": false,
  "charset"  : 'utf8mb4'
});
pool.getConnection((error, connection)=>{
    if(error){
        console.error('Error en la conexión: ' + error.code);
        throw error;
        //console.log('existe un problema con la conexión '+error.code);
    }else{
      connection.query("SET time_zone = '+00:00'", (err) => {
        connection.release();
        console.log("conexion correcta");
        if (err){
          console.error("Error al setear timezone");
        }else{
          console.log("Conexión correcta en modo UTC");
        }
        return;
      });
    }
});

pool.query = promisify(pool.query);

module.exports = pool;



