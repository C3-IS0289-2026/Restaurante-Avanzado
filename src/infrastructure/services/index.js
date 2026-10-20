/**
 * Exportación centralizada de todos los servicios de infraestructura (CRUD)
 * para las entidades de la base de datos de Restaurante Avanzado.
 */

// Servicio Base
export { BaseService } from './BaseService.js';

// Servicios de Entidades
export { MesaService, ESTADOS_MESA } from './MesaService.js';
export { UsuarioService, ROLES_USUARIO } from './UsuarioService.js';
export { PlatoService, CATEGORIAS_PLATO } from './PlatoService.js';
export { IngredienteService } from './IngredienteService.js';
export { RecetaIngredienteService } from './RecetaIngredienteService.js';
export { CuentaService, ESTADOS_CUENTA } from './CuentaService.js';
export { DetalleCuentaService, ESTADOS_DETALLE_CUENTA } from './DetalleCuentaService.js';
export { PagoService, METODOS_PAGO } from './PagoService.js';
export { MovimientoInventarioService, TIPOS_MOVIMIENTO_INVENTARIO } from './MovimientoInventarioService.js';
export { NotificacionService, TIPOS_NOTIFICACION, ESTADOS_NOTIFICACION } from './NotificacionService.js';

// Instancias por defecto (Singletons convenientes)
import { MesaService } from './MesaService.js';
import { UsuarioService } from './UsuarioService.js';
import { PlatoService } from './PlatoService.js';
import { IngredienteService } from './IngredienteService.js';
import { RecetaIngredienteService } from './RecetaIngredienteService.js';
import { CuentaService } from './CuentaService.js';
import { DetalleCuentaService } from './DetalleCuentaService.js';
import { PagoService } from './PagoService.js';
import { MovimientoInventarioService } from './MovimientoInventarioService.js';
import { NotificacionService } from './NotificacionService.js';

export const mesaService = new MesaService();
export const usuarioService = new UsuarioService();
export const platoService = new PlatoService();
export const ingredienteService = new IngredienteService();
export const recetaIngredienteService = new RecetaIngredienteService();
export const cuentaService = new CuentaService();
export const detalleCuentaService = new DetalleCuentaService();
export const pagoService = new PagoService();
export const movimientoInventarioService = new MovimientoInventarioService();
export const notificacionService = new NotificacionService();

export default {
  mesaService,
  usuarioService,
  platoService,
  ingredienteService,
  recetaIngredienteService,
  cuentaService,
  detalleCuentaService,
  pagoService,
  movimientoInventarioService,
  notificacionService
};
