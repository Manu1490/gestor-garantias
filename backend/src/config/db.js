// db.js 
import sql from 'mssql';

// Cargar environment variables de .env file
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env. Esto permite que podamos usar las variables definidas en ese archivo a lo largo de nuestro código.
dotenv.config();

const dbConfig ={   
    user: process.env.DB_USER, // Usuario de la base de datos
    password: process.env.DB_PASSWORD, // Contraseña de la base de datos
    server: process.env.DB_SERVER, // Servidor de la base de datos
    database: process.env.DB_DATABASE, // Nombre de la base de datos
    options: {
        instanceName: process.env.DB_INSTANCE,
        encrypt: false,
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' // Permitir certificados autofirmados (útil para desarrollo local)
    }
}

const getDBConnection = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('Conexión a la base de datos exitosa');
        return pool;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    }  
};

// Exportamos tanto la función getConnection como el objeto sql para que puedan ser 
// utilizados en otros archivos de nuestro proyecto.
export {
  sql,
  getDBConnection
};