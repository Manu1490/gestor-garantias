import express from 'express';
import { registrarProductoComprado, obtenerProductosComprados } from '../controllers/productosComprados.controller.js';

const router = express.Router();

router.post('/productos-comprados', registrarProductoComprado);
router.get('/productos-comprados', obtenerProductosComprados);

export default router;