import {getDBConnection} from '../config/db.js';

const getEsadoApi = async (req, res) => {
    try {
        const pool = await getDBConnection(); // Obtener la conexión a la base de datos
        await pool.request().query('SELECT 1 AS EstadoBaseDatos'); // Ejecutar una consulta simple para verificar la conexión

        // Si la consulta se ejecuta correctamente, respondemos con un estado 200 y un mensaje indicando que la API está funcionando 
        // y la base de datos está conectada.
        res.status(200).json({
            status: 'ok',
            api: 'Gestor de Garantías API',
            database: 'connected'
        });
    } catch (error) {
        // Si ocurre un error al conectar a la base de datos, respondemos con un estado 500 y un mensaje indicando 
        // que la API está funcionando pero la base de datos no está conectada, junto con el mensaje de error.
        res.status(500).json({
            status: 'error',
            api: 'Gestor de Garantías API',
            database: 'disconnected',
            detalle: error.message
        });
    }
}


export {
  getEsadoApi
};