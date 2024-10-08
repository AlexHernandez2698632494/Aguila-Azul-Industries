import { Router } from "express";
import {
  getOrdenes,
  getOrdenById,
  getOrdenesByUsuario,
  createOrden,
  updateOrden,
  deleteOrden,
  getDetallesOrdenes,
  createDetalleOrden,
  createDetallesOrden,
  updateDetalleOrden,
  deleteDetalleOrden,
} from "../controllers/sales.controllers.js";
const router = Router();

// Rutas para Ordenes
router.get("/ordenes", getOrdenes);
router.get("/ordenes/:id", getOrdenById);
router.get("/ordenes/usuario/:usuario", getOrdenesByUsuario);
router.post("/ordenes", createOrden);
router.put("/ordenes/:id", updateOrden);
router.delete("/ordenes/:id", deleteOrden);

// Rutas para DetallesOrdenes
router.get("/ordenes/:ordenId/detalles", getDetallesOrdenes);
router.post("/ordenes/detalles", createDetalleOrden);
router.put("/ordenes/detalles/:id", updateDetalleOrden);
router.post('/detallesOrdenes', createDetallesOrden);
router.delete("/ordenes/detalles/:id", deleteDetalleOrden);

export default router;
