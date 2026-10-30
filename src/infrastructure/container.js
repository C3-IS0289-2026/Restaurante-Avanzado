/**
 * Composition Root / Contenedor de Inyección de Dependencias (DDD + SOLID DIP)
 * Ensambla las implementaciones concretas de Infraestructura con los Casos de Uso de Aplicación.
 * De esta manera, la capa de Aplicación permanece 100% desacoplada de la capa de Infraestructura.
 */

import {
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
} from './services/index.js';

import { PasoSolicitudUseCase } from '../application/use-cases/PasoSolicitudUseCase.js';
import { CrearSolicitudUseCase } from '../application/use-cases/CrearSolicitudUseCase.js';
import { ConsultarKdsSolicitudesUseCase } from '../application/use-cases/ConsultarKdsSolicitudesUseCase.js';
import { CheckLowStockUseCase } from '../application/use-cases/CheckLowStockUseCase.js';

export function createContainer(overrides = {}) {
  const services = {
    mesaService: overrides.mesaService || mesaService,
    usuarioService: overrides.usuarioService || usuarioService,
    platoService: overrides.platoService || platoService,
    ingredienteService: overrides.ingredienteService || ingredienteService,
    recetaIngredienteService: overrides.recetaIngredienteService || recetaIngredienteService,
    cuentaService: overrides.cuentaService || cuentaService,
    detalleCuentaService: overrides.detalleCuentaService || detalleCuentaService,
    pagoService: overrides.pagoService || pagoService,
    movimientoInventarioService: overrides.movimientoInventarioService || movimientoInventarioService,
    notificacionService: overrides.notificacionService || notificacionService
  };

  const useCases = {
    pasoSolicitudUseCase: new PasoSolicitudUseCase({
      detalleCuentaService: services.detalleCuentaService,
      notificacionService: services.notificacionService,
      cuentaService: services.cuentaService
    }),
    crearSolicitudUseCase: new CrearSolicitudUseCase({
      detalleCuentaService: services.detalleCuentaService,
      cuentaService: services.cuentaService,
      platoService: services.platoService
    }),
    consultarKdsUseCase: new ConsultarKdsSolicitudesUseCase({
      detalleCuentaService: services.detalleCuentaService
    }),
    checkLowStockUseCase: new CheckLowStockUseCase(
      services.ingredienteService,
      services.notificacionService
    )
  };

  return {
    ...services,
    ...useCases
  };
}

export const defaultContainer = createContainer();
export default defaultContainer;
