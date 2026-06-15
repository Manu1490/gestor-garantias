import {sql, getDBConnection} from '../config/db.js';

// Crear una nueva garantía
const crearGarantia = async (req, res) => {
    try {
        // Extraer los datos necesarios del cuerpo de la solicitud (req.body). Estos datos se esperan que sean enviados por el 
        // cliente al hacer una solicitud POST para crear una nueva garantía.
        const {
            ProductoCompradoClienteId,
            MotivoSolicitud,
            DescripcionProblema,
            ObservacionSolicitud
        } = req.body;

        const pool = await getDBConnection();

        // Ejecutar una consulta SQL para insertar una nueva garantía en la base de datos. Se utilizan parámetros para evitar inyecciones SQL 
        // y asegurar que los datos se manejen de manera segura.
        const result = await pool.request()
            .input('ProductoCompradoClienteId', sql.Int, ProductoCompradoClienteId)
            .input('Estado', sql.NVarChar(50), 'Pendiente')
            .input('MotivoSolicitud', sql.NVarChar(500), MotivoSolicitud)
            .input('DescripcionProblema', sql.NVarChar(1000), DescripcionProblema)
            .input('ObservacionSolicitud', sql.NVarChar(1000), ObservacionSolicitud || null)
            .query(`
                INSERT INTO dbo.GarantiasSolicitadas
                (
                    ProductoCompradoClienteId,
                    Estado,
                    MotivoSolicitud,
                    DescripcionProblema,
                    ObservacionSolicitud,
                    FechaSolicitud
                )
                OUTPUT INSERTED.Id,
                    INSERTED.ProductoCompradoClienteId,
                    INSERTED.Estado,
                    INSERTED.MotivoSolicitud,
                    INSERTED.DescripcionProblema,
                    INSERTED.ObservacionSolicitud,
                    INSERTED.FechaSolicitud,
                    INSERTED.FechaActualizacion,
                    INSERTED.FechaCierre
                VALUES
                (
                    @ProductoCompradoClienteId,
                    @Estado,
                    @MotivoSolicitud,
                    @DescripcionProblema,
                    @ObservacionSolicitud,
                    SYSDATETIME()
                );
            `);

            res.status(201).json({
                mensaje: 'Solicitud de garantía creada correctamente',
                garantia: result.recordset[0]
            });
    } catch (error) {
        console.error('Error al crear solicitud de garantía:', error);

        res.status(500).json({
            mensaje: 'Error al crear solicitud de garantía',
            detalle: error.message
        });
    }
}

// Obtener todas las garantías
const obtenerGarantias = async (req, res) => {
  try {
    const pool = await getDBConnection();

    const result = await pool.request().query(`
      SELECT
        gs.Id AS GarantiaId,
        gs.ProductoCompradoClienteId,
        gs.Estado,
        gs.MotivoSolicitud,
        gs.DescripcionProblema,
        gs.ObservacionSolicitud,
        gs.FechaSolicitud,
        gs.FechaActualizacion,
        gs.FechaCierre,

        c.Id AS ClienteId,
        c.Nombre,
        c.Apellido,
        c.Email,
        c.Telefono,
        c.Documento,

        pcc.NumeroSerie,
        pcc.NumeroFactura,
        pcc.LugarCompra,
        pcc.FechaCompra,

        p.Id AS ProductoId,
        p.Marca,
        p.Modelo,
        p.Tipo,
        p.Descripcion AS ProductoDescripcion,
        p.Proveedor
      FROM dbo.GarantiasSolicitadas gs
      INNER JOIN dbo.ProductoCompradoCliente pcc
        ON gs.ProductoCompradoClienteId = pcc.Id
      INNER JOIN dbo.Clientes c
        ON pcc.ClienteId = c.Id
      INNER JOIN dbo.Productos p
        ON pcc.ProductoId = p.Id
      ORDER BY gs.Id DESC;
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener garantías:', error);

    res.status(500).json({
      mensaje: 'Error al obtener garantías',
      detalle: error.message
    });
  }
};

// Actualizar el estado de una garantía
const actualizarEstadoGarantia = async (req, res) => {
  try {
    const { id } = req.params;
    const { Estado } = req.body;

    if (!Estado) {
      return res.status(400).json({
        mensaje: 'El Estado es obligatorio'
      });
    }

    const estadosPermitidos = [
      'Pendiente',
      'En revisión',
      'Aprobada',
      'Rechazada',
      'Cerrada'
    ];

    if (!estadosPermitidos.includes(Estado)) {
      return res.status(400).json({
        mensaje: 'Estado no válido',
        estadosPermitidos
      });
    }

    const pool = await getDBConnection();

    const result = await pool.request()
      .input('Id', sql.Int, id)
      .input('Estado', sql.NVarChar(50), Estado)
      .query(`
        UPDATE dbo.GarantiasSolicitadas
        SET
          Estado = @Estado,
          FechaActualizacion = SYSDATETIME(),
          FechaCierre = CASE
            WHEN @Estado = 'Cerrada' THEN SYSDATETIME()
            ELSE FechaCierre
          END
        OUTPUT INSERTED.Id,
               INSERTED.ProductoCompradoClienteId,
               INSERTED.Estado,
               INSERTED.MotivoSolicitud,
               INSERTED.DescripcionProblema,
               INSERTED.ObservacionSolicitud,
               INSERTED.FechaSolicitud,
               INSERTED.FechaActualizacion,
               INSERTED.FechaCierre
        WHERE Id = @Id;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontró la garantía solicitada'
      });
    }

    res.status(200).json({
      mensaje: 'Estado de garantía actualizado correctamente',
      garantia: result.recordset[0]
    });
  } catch (error) {
    console.error('Error al actualizar estado de garantía:', error);

    res.status(500).json({
      mensaje: 'Error al actualizar estado de garantía',
      detalle: error.message
    });
  }
};

export {
    crearGarantia,
    obtenerGarantias,
    actualizarEstadoGarantia
}