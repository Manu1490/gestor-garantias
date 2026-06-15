import express from 'express';

import { crearGarantia, obtenerGarantias, actualizarEstadoGarantia } from '../controllers/garantias.controller.js';
const router = express.Router();
router.post('/garantias', crearGarantia);
router.get('/garantias', obtenerGarantias);
router.put('/garantias/:id/estado', actualizarEstadoGarantia);
export default router;