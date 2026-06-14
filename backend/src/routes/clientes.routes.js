import express from 'express';
import {crearCliente, obtenerClientes} from '../controllers/clientes.controller.js';
const router = express.Router();

// Agregamos una nueva ruta para crear un cliente. Esta ruta se llamará '/clientes' y responderá a solicitudes POST.
router.post('/clientes', crearCliente);

// Agregamos una nueva ruta para obtener la lista de clientes. Esta ruta se llamará '/clientes' y responderá a solicitudes GET.
router.get('/clientes', obtenerClientes);

export default router;