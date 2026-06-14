import { getDBConnection } from '../config/db.js';

// Controlador para obtener todos los productos()fucion
const getProductos = async (req, res) => {
    try{
        const pool = await getDBConnection(); // Obtener la conexión a la base de datos

        // Ejecutar la consulta para obtener todos los productos
        const result = await pool.request().query(
        `SELECT
            Id,
            Marca,
            Modelo,
            Tipo,
            Descripcion,
            Proveedor
        FROM dbo.Productos
        ORDER BY Marca, Modelo;
    `); 

    // Enviar los productos obtenidos como respuesta en formato JSON    
    res.status(200).json(result.recordset); 

    }catch(error){
        console.error('Error al obtener los productos:', error);
        res.status(500).json({
            mensaje: 'Error al obtener productos',
            detalle: error.message
        });
    }
};

export {
  getProductos
};