// Importa Express, que es la dependencia que usamos para crear la API.
import express from 'express';

// Importa cors, que es la dependencia que usamos para permitir solicitudes desde el frontend.  
import cors from 'cors';

// Importa dotenv, que es la dependencia que usamos para cargar las variables de entorno desde el archivo .env.
import dotenv from 'dotenv';

// Importa la función getDBConnection desde el archivo db.js, que es la función que se encarga de establecer la conexión con la base de datos.
import { getDBConnection } from './config/db.js';

// Importa las rutas de productos desde el archivo productos.routes.js. Estas rutas contienen los endpoints relacionados con los productos.
import productosRoutes from './routes/productos.routes.js';

// Importa las rutas de clientes desde el archivo clientes.routes.js. Estas rutas contienen los endpoints relacionados con los clientes.
import clientesRoutes from './routes/clientes.routes.js';

//Importa las rutas de productos comprados desde el archivo productosComprados.routes.js. Estas rutas contienen los endpoints relacionados 
// con los productos comprados por los clientes.
import productosCompradosRoutes from './routes/productosComprados.routes.js';

//Carga las variables de entorno desde el archivo .env. Esto permite que podamos usar las variables definidas en ese archivo a lo largo de nuestro código.
dotenv.config();

// Crea una instancia de Express.
const app = express();

// Usa express.json() para parsear(para que entienda el formato json) el cuerpo de las solicitudes como JSON.
//express sirve para crear el servidor backend.
app.use(express.json());

// Usa las rutas de productos en la aplicación. Esto significa que cualquier solicitud que comience con '/api' será manejada por las rutas definidas en productosRoutes.
app.use('/api', productosRoutes);

// Usa las rutas de clientes en la aplicación. Esto significa que cualquier solicitud que comience con '/api' será manejada por las rutas definidas en clientesRoutes.
app.use('/api', clientesRoutes);

// Usa las rutas de productos comprados en la aplicación. Esto significa que cualquier solicitud que comience con '/api' 
// será manejada por las rutas definidas en productosCompradosRoutes.
app.use('/api', productosCompradosRoutes);

// Usa cors para permitir solicitudes desde el frontend.
app.use(cors());

//Definimos un puerto para el servidor, que se obtiene de las variables de entorno o se establece en 3000 por defecto.
//Esto define el puerto en el que el servidor escuchará las solicitudes. Si no se especifica un puerto en las variables de entorno, se usará el puerto 3000.
const PORT = process.env.PORT || 3000;

// Definimos una ruta raíz para verificar que el servidor esté funcionando. Cuando se accede a esta ruta, se envía una respuesta con un mensaje 
// indicando que la API de gestión de garantías está funcionando.
app.get('/', (req, res) => {
  res.send('API de Gestión de Garantías funcionando');
});

// Encedemos el servidor y hacemos que escuche en el puerto definido. Cuando el servidor esté listo, se imprimirá un mensaje en la consola indicando que está corriendo.
app.listen(PORT, async () => {
    console.log(`El Servidor escucha en el puerto ${PORT}`) 

    try {
        // Intentamos establecer la conexión con la base de datos al iniciar el servidor.
        await getDBConnection();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}); 

