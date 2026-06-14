import { sql, getDBConnection } from '../config/db.js';
//sql Sirve para definir tipos de datos en los parámetros.

//Esta función va a recibir los datos del cliente y guardarlos en SQL Server.
const crearCliente = async (req, res) => {
    try{
        // Extraemos los datos del cliente del cuerpo de la solicitud (req.body).
        const { Nombre, Apellido, Email, Telefono, Documento } = req.body;
        
        if (!Nombre || !Apellido || !Email) {
            return res.status(400).json({
                mensaje: 'Nombre, Apellido y Email son obligatorios'
            });
        } 
        
        const pool = await getDBConnection();

        const result = await pool.request()
        .input('Nombre', sql.NVarChar(100), Nombre)
        .input('Apellido', sql.NVarChar(100), Apellido)
        .input('Email', sql.NVarChar(150), Email)
        .input('Telefono', sql.NVarChar(50), Telefono || null)
        .input('Documento', sql.NVarChar(50), Documento || null)
        .query(`
            INSERT INTO dbo.Clientes
            (
            Nombre,
            Apellido,
            Email,
            Telefono,
            Documento
            )
            OUTPUT INSERTED.Id,
                INSERTED.Nombre,
                INSERTED.Apellido,
                INSERTED.Email,
                INSERTED.Telefono,
                INSERTED.Documento,
                INSERTED.FechaCreacion
            VALUES
            (
            @Nombre,
            @Apellido,
            @Email,
            @Telefono,
            @Documento
            )
        `); //ejecutamos la consulta SQL para insertar un nuevo cliente en la tabla Clientes

            res.status(201).json({
                mensaje: 'Cliente creado correctamente',
                cliente: result.recordset[0]
            });
    }catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({
            mensaje: 'Error al crear cliente',
            detalle: error.message
        });
    }
}

// Esta función va a obtener la lista de clientes desde SQL Server y devolverla en la respuesta.
const obtenerClientes = async (req, res) => {
  try {
    const pool = await getDBConnection();

    const result = await pool.request().query(`
      SELECT
        Id,
        Nombre,
        Apellido,
        Email,
        Telefono,
        Documento,
        FechaCreacion
      FROM dbo.Clientes
      ORDER BY Id DESC;
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener clientes:', error);

    res.status(500).json({
      mensaje: 'Error al obtener clientes',
      detalle: error.message
    });
  }
};

export {
  crearCliente,
  obtenerClientes
};
