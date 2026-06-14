import express from 'express';

// Importa la función getProductos desde el controlador de productos. Esta función se encargará de manejar las solicitudes relacionadas con los productos.
import {getProductos} from '../controllers/producto.controller.js';

// Crea un router de Express, que es un objeto que nos permite definir 
// rutas para nuestra API de manera modular.
const router = express.Router();

// Define una ruta GET para '/productos' que utiliza la función getProductos como controlador.
router.get('/productos', getProductos);

// Exporta el router para que pueda ser utilizado en otros archivos de nuestro proyecto, como en el archivo server.js donde se configuran las rutas de la API.
export default router;
