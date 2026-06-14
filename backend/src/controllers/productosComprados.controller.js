import { sql, getDBConnection } from '../config/db.js';

const registrarProductoComprado = async (req, res) => {
  try {
    const {
      ClienteId,
      ProductoId,
      NumeroSerie,
      NumeroFactura,
      LugarCompra,
      FechaCompra,
      Observacion
    } = req.body;

    if (!ClienteId || !ProductoId || !NumeroSerie || !FechaCompra) {
      return res.status(400).json({
        mensaje: 'ClienteId, ProductoId, NumeroSerie y FechaCompra son obligatorios'
      });
    }

    const pool = await getDBConnection();

    const result = await pool.request()
      .input('ClienteId', sql.Int, ClienteId)
      .input('ProductoId', sql.Int, ProductoId)
      .input('NumeroSerie', sql.NVarChar(100), NumeroSerie)
      .input('NumeroFactura', sql.NVarChar(100), NumeroFactura || null)
      .input('LugarCompra', sql.NVarChar(150), LugarCompra || null)
      .input('FechaCompra', sql.Date, FechaCompra)
      .input('Observacion', sql.NVarChar(500), Observacion || null)
      .query(`
        INSERT INTO dbo.ProductoCompradoCliente
        (
          ClienteId,
          ProductoId,
          NumeroSerie,
          NumeroFactura,
          LugarCompra,
          FechaCompra,
          Observacion
        )
        OUTPUT INSERTED.Id,
               INSERTED.ClienteId,
               INSERTED.ProductoId,
               INSERTED.NumeroSerie,
               INSERTED.NumeroFactura,
               INSERTED.LugarCompra,
               INSERTED.FechaCompra,
               INSERTED.Observacion
        VALUES
        (
          @ClienteId,
          @ProductoId,
          @NumeroSerie,
          @NumeroFactura,
          @LugarCompra,
          @FechaCompra,
          @Observacion
        );
      `);

    res.status(201).json({
      mensaje: 'Producto comprado registrado correctamente',
      productoComprado: result.recordset[0]
    });
  } catch (error) {
    console.error('Error al registrar producto comprado:', error);

    res.status(500).json({
      mensaje: 'Error al registrar producto comprado',
      detalle: error.message
    });
  }
};


// Función para obtener la lista de productos comprados por los clientes, incluyendo detalles del cliente y del producto. 
// Esta función realiza una consulta SQL que une las tablas ProductoCompradoCliente, Clientes y Productos para obtener toda la información relevante.
const obtenerProductosComprados = async (req, res) => {
  try {
    const pool = await getDBConnection();

    const result = await pool.request().query(`
      SELECT
        pcc.Id AS ProductoCompradoId,
        pcc.ClienteId,
        c.Nombre,
        c.Apellido,
        c.Email,
        pcc.ProductoId,
        p.Marca,
        p.Modelo,
        p.Tipo,
        pcc.NumeroSerie,
        pcc.NumeroFactura,
        pcc.LugarCompra,
        pcc.FechaCompra,
        pcc.Observacion
      FROM dbo.ProductoCompradoCliente pcc
      INNER JOIN dbo.Clientes c
        ON pcc.ClienteId = c.Id
      INNER JOIN dbo.Productos p
        ON pcc.ProductoId = p.Id
      ORDER BY pcc.Id DESC;
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener productos comprados:', error);

    res.status(500).json({
      mensaje: 'Error al obtener productos comprados',
      detalle: error.message
    });
  }
};

export {
  registrarProductoComprado,
  obtenerProductosComprados
};