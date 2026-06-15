import express from 'express';
import { getEsadoApi } from '../controllers/health.controller.js';
const router = express.Router();

// Ruta para verificar el estado de la API y la conexión a la base de datos
router.get('/', getEsadoApi);

export default router;