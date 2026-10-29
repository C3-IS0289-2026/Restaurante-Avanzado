import { Solicitud, ESTADOS_SOLICITUD } from '../../domain/entities/Solicitud.js';
import {
  ValidationError,
  EntityNotFoundError,
  BusinessRuleError
} from '../../domain/exceptions/DomainErrors.js';

/**
 * Caso de Uso: Crear y Enviar Solicitud a Cocina (HU-003.4)
 * Registra nuevos platillos solicitados para una mesa/cuenta y los pone en cola de cocina con estado inicial.
 *
 * Cumple SOLID:
 * - SRP: Coordina únicamente el alta de nuevas solicitudes de pedido en una cuenta activa.
 * - ISP: Solo requiere los repositorios que realmente utiliza (detalleCuenta, cuenta, plato).
 * - DIP: Depende de abstracciones inyectadas por constructor, sin importar infraestructura.
 */
export class CrearSolicitudUseCase {
  /**
   * @param {Object} dependencies - Repositorios/Puertos inyectados
   * @param {import('../../domain/repositories/contracts.js').ISolicitudRepository} dependencies.detalleCuentaService
   * @param {import('../../domain/repositories/contracts.js').ICuentaRepository} dependencies.cuentaService
   * @param {import('../../domain/repositories/contracts.js').IPlatoRepository} dependencies.platoService
   */
  constructor({
    detalleCuentaService,
    cuentaService,
    platoService
  } = {}) {
    if (!detalleCuentaService || !cuentaService || !platoService) {
      throw new ValidationError(
        'CrearSolicitudUseCase requiere detalleCuentaService, cuentaService y platoService.'
      );
    }
    this.detalleCuentaService = detalleCuentaService;
    this.cuentaService = cuentaService;
    this.platoService = platoService;
  }

  /**
   * Registra una o varias solicitudes de platos para una mesa/cuenta
   * @param {Object} params
   * @param {number} [params.cuenta_id] - ID de la cuenta activa
   * @param {number} [params.mesa_id] - Alternativa: ID de mesa para buscar su cuenta abierta
   * @param {Array<{ plato_id: number, cantidad: number, notas?: string }>} params.items - Platillos a enviar
   * @returns {Promise<{ cuenta_id: number, solicitudes: Array<Solicitud>, cuentaActualizada: Object }>}
   */
  async execute({ cuenta_id = null, mesa_id = null, items = [] } = {}) {
    if (!cuenta_id && !mesa_id) {
      throw new ValidationError('Debe proporcionar cuenta_id o mesa_id para crear una solicitud de pedido.');
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Debe incluir al menos un platillo en la solicitud.');
    }

    // 1. Determinar y validar la cuenta activa
    let targetCuentaId = cuenta_id;
    let cuentaObj = null;

    if (!targetCuentaId) {
      cuentaObj = await this.cuentaService.getByMesaId(mesa_id, true);
      if (!cuentaObj) {
        throw new BusinessRuleError(
          `No existe una cuenta abierta para la mesa con ID ${mesa_id}. Debe abrir la mesa primero.`
        );
      }
      targetCuentaId = cuentaObj.id;
    } else {
      cuentaObj = await this.cuentaService.getById(targetCuentaId);
      if (!cuentaObj) {
        throw new EntityNotFoundError('Cuenta', targetCuentaId);
      }
      if (cuentaObj.estado !== 'Abierta') {
        throw new BusinessRuleError(
          `La cuenta con ID ${targetCuentaId} no está abierta (Estado: ${cuentaObj.estado}).`
        );
      }
    }

    // 2. Insertar cada línea de solicitud validando con la entidad de dominio
    const solicitudesCreadas = [];

    for (const item of items) {
      const platoId = Number(item.plato_id);
      const cantidad = item.cantidad !== undefined ? Number(item.cantidad) : 1;
      const notas = item.notas || null;

      if (!platoId) {
        throw new ValidationError('plato_id es requerido para cada ítem de la solicitud.');
      }
      if (cantidad <= 0 || Number.isNaN(cantidad)) {
        throw new ValidationError('cantidad debe ser mayor a 0 para cada ítem.');
      }

      // Validar plato y obtener datos para la entidad de dominio
      const plato = await this.platoService.getById(platoId);
      if (!plato) {
        throw new EntityNotFoundError('Platillo', platoId, `El platillo con ID ${platoId} no existe.`);
      }
      if (plato.activo === false) {
        throw new BusinessRuleError(
          `El platillo "${plato.nombre}" se encuentra inactivo y no puede ordenarse.`
        );
      }

      // Instanciar primero la entidad de dominio para garantizar invariantes antes de persistir
      const borradorSolicitud = new Solicitud({
        cuenta_id: targetCuentaId,
        plato_id: platoId,
        cantidad,
        notas,
        estado: ESTADOS_SOLICITUD.ENVIADO_A_COCINA,
        hora_envio: new Date(),
        plato_nombre: plato.nombre,
        plato_precio: plato.precio,
        plato_categoria: plato.categoria,
        mesa_numero: cuentaObj.mesa_numero,
        mesero_nombre: cuentaObj.mesero_nombre,
        mesero_id: cuentaObj.mesero_id
      });

      // Guardar detalle en el repositorio
      const detalleCreado = await this.detalleCuentaService.create({
        cuenta_id: borradorSolicitud.cuenta_id,
        plato_id: borradorSolicitud.plato_id,
        cantidad: borradorSolicitud.cantidad,
        notas: borradorSolicitud.notas,
        estado: borradorSolicitud.estado,
        hora_envio: borradorSolicitud.hora_envio
      });

      // Asignar ID e instante persistido a la entidad
      borradorSolicitud.id = detalleCreado.id;
      if (detalleCreado.hora_envio) {
        borradorSolicitud.hora_envio =
          detalleCreado.hora_envio instanceof Date
            ? detalleCreado.hora_envio
            : new Date(detalleCreado.hora_envio);
      }

      solicitudesCreadas.push(borradorSolicitud);
    }

    // 3. Recalcular subtotal y total de la cuenta
    const cuentaActualizada = await this.cuentaService.recalcularTotales(targetCuentaId, 0.08);

    return {
      cuenta_id: targetCuentaId,
      solicitudes: solicitudesCreadas,
      cuentaActualizada
    };
  }
}

export default CrearSolicitudUseCase;
