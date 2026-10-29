import { Solicitud, ESTADOS_SOLICITUD } from '../../domain/entities/Solicitud.js';
import { ValidationError } from '../../domain/exceptions/DomainErrors.js';

/**
 * Caso de Uso: Consultar Solicitudes para el KDS (Kitchen Display System)
 * Obtiene las órdenes activas de cocina ordenadas por antigüedad (FIFO), agrupadas por estado o en lista plana.
 *
 * Cumple SOLID:
 * - SRP: Se encarga exclusivamente de consultar, ordenar y estructurar el tablero KDS.
 * - DIP: Depende de la abstracción inyectada detalleCuentaService sin importar infraestructura.
 */
export class ConsultarKdsSolicitudesUseCase {
  /**
   * @param {Object} dependencies
   * @param {import('../../domain/repositories/contracts.js').ISolicitudRepository} dependencies.detalleCuentaService
   */
  constructor({ detalleCuentaService } = {}) {
    if (!detalleCuentaService || typeof detalleCuentaService.getKdsItems !== 'function') {
      throw new ValidationError(
        'ConsultarKdsSolicitudesUseCase requiere un repositorio detalleCuentaService con getKdsItems().'
      );
    }
    this.detalleCuentaService = detalleCuentaService;
  }

  /**
   * Consulta las solicitudes de cocina
   * @param {Object} [options={}]
   * @param {Array<string>} [options.estados] - Estados a incluir (por defecto cocina: Enviado a Cocina, En Preparación, Listo para Servir)
   * @param {boolean} [options.agruparPorColumnas=false] - Si es true, retorna { recibidos, preparacion, listos }
   * @param {number} [options.umbralDemoraMinutos=15] - Minutos a partir de los cuales se marca con alerta
   * @returns {Promise<Array<Solicitud> | { recibidos: Array<Solicitud>, preparacion: Array<Solicitud>, listos: Array<Solicitud>, totalActivas: number, demoradasCount: number }>}
   */
  async execute({
    estados = [
      ESTADOS_SOLICITUD.ENVIADO_A_COCINA,
      ESTADOS_SOLICITUD.EN_PREPARACION,
      ESTADOS_SOLICITUD.LISTO_PARA_SERVIR
    ],
    agruparPorColumnas = false,
    umbralDemoraMinutos = 15
  } = {}) {
    const rows = await this.detalleCuentaService.getKdsItems(estados);

    const solicitudes = rows.map(
      row =>
        new Solicitud({
          id: row.id,
          cuenta_id: row.cuenta_id,
          plato_id: row.plato_id,
          cantidad: row.cantidad,
          notas: row.notas,
          estado: row.estado,
          hora_envio: row.hora_envio,
          plato_nombre: row.plato_nombre,
          plato_precio: row.plato_precio,
          plato_categoria: row.plato_categoria,
          mesa_numero: row.mesa_numero,
          mesero_nombre: row.mesero_nombre,
          mesero_id: row.mesero_id
        })
    );

    // Ordenar de mayor a menor antigüedad (FIFO)
    solicitudes.sort((a, b) => a.hora_envio.getTime() - b.hora_envio.getTime());

    if (!agruparPorColumnas) {
      return solicitudes;
    }

    const recibidos = [];
    const preparacion = [];
    const listos = [];

    for (const sol of solicitudes) {
      if (sol.estado === ESTADOS_SOLICITUD.ENVIADO_A_COCINA) {
        recibidos.push(sol);
      } else if (sol.estado === ESTADOS_SOLICITUD.EN_PREPARACION) {
        preparacion.push(sol);
      } else if (sol.estado === ESTADOS_SOLICITUD.LISTO_PARA_SERVIR) {
        listos.push(sol);
      }
    }

    return {
      recibidos,
      preparacion,
      listos,
      totalActivas: solicitudes.length,
      demoradasCount: solicitudes.filter(s => s.esDemorado(umbralDemoraMinutos)).length
    };
  }
}

export default ConsultarKdsSolicitudesUseCase;
