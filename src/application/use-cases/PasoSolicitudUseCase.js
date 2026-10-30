import { Solicitud, ESTADOS_SOLICITUD } from '../../domain/entities/Solicitud.js';
import { ValidationError, EntityNotFoundError } from '../../domain/exceptions/DomainErrors.js';

/**
 * Caso de Uso: Paso de Solicitud (Avance / Transición de Estado)
 * Orquesta la validación de la máquina de estados en el dominio y la actualización persistente del pedido,
 * disparando notificaciones al personal de sala cuando el platillo queda listo para servir.
 *
 * Cumple SOLID:
 * - SRP: Coordina únicamente el flujo de transición de estado de una solicitud.
 * - DIP: Depende de abstracciones inyectadas por constructor, sin acoplarse a infraestructura.
 * - ISP: Requiere únicamente los métodos necesarios de cada colaborador.
 */
export class PasoSolicitudUseCase {
  /**
   * @param {Object} dependencies - Dependencias inyectadas (Puertos / Repositorios)
   * @param {import('../../domain/repositories/contracts.js').ISolicitudRepository} dependencies.detalleCuentaService
   * @param {import('../../domain/repositories/contracts.js').INotificacionPort} [dependencies.notificacionService=null]
   * @param {import('../../domain/repositories/contracts.js').ICuentaRepository} [dependencies.cuentaService=null]
   */
  constructor({
    detalleCuentaService,
    notificacionService = null,
    cuentaService = null
  } = {}) {
    if (!detalleCuentaService || typeof detalleCuentaService.getById !== 'function') {
      throw new ValidationError('PasoSolicitudUseCase requiere un repositorio detalleCuentaService válido.');
    }
    this.detalleCuentaService = detalleCuentaService;
    this.notificacionService = notificacionService;
    this.cuentaService = cuentaService;
  }

  /**
   * Ejecuta el paso de la solicitud hacia el siguiente estado natural o hacia un estado indicado
   * @param {Object} params
   * @param {number|string} params.solicitudId - ID de la solicitud (detalle_cuenta)
   * @param {string} [params.nuevoEstado=null] - Si se omite, avanza automáticamente al siguiente estado secuencial
   * @param {string} [params.motivoCancelacion=null] - Motivo opcional si el nuevo estado es 'Cancelado'
   * @returns {Promise<{ solicitud: Solicitud, estadoAnterior: string, nuevoEstado: string, notificacionGenerada: Object|null }>}
   */
  async execute({ solicitudId, nuevoEstado = null, motivoCancelacion = null } = {}) {
    if (!solicitudId) {
      throw new ValidationError('El ID de la solicitud es obligatorio para realizar el paso de estado.');
    }

    // 1. Obtener el registro actual desde el repositorio
    const detalleExistente = await this.detalleCuentaService.getById(solicitudId);
    if (!detalleExistente) {
      throw new EntityNotFoundError('Solicitud', solicitudId);
    }

    // 2. Reconstruir la entidad de dominio para validar las reglas de negocio primero
    const solicitud = new Solicitud({
      id: detalleExistente.id,
      cuenta_id: detalleExistente.cuenta_id,
      plato_id: detalleExistente.plato_id,
      cantidad: detalleExistente.cantidad,
      notas: detalleExistente.notas,
      estado: detalleExistente.estado,
      hora_envio: detalleExistente.hora_envio,
      plato_nombre: detalleExistente.plato_nombre,
      plato_precio: detalleExistente.plato_precio,
      plato_categoria: detalleExistente.plato_categoria,
      mesa_numero: detalleExistente.mesa_numero,
      mesero_nombre: detalleExistente.mesero_nombre,
      mesero_id: detalleExistente.mesero_id
    });

    const estadoAnterior = solicitud.estado;
    let estadoDestino;

    // 3. Ejecutar la transición mediante los métodos de la entidad (falla rápido si la transición es inválida)
    if (nuevoEstado) {
      if (nuevoEstado === ESTADOS_SOLICITUD.CANCELADO) {
        solicitud.cancelar(motivoCancelacion);
      } else {
        solicitud.cambiarEstado(nuevoEstado);
      }
      estadoDestino = solicitud.estado;
    } else {
      estadoDestino = solicitud.avanzar();
    }

    // 4. Persistir el cambio de estado
    await this.detalleCuentaService.update(solicitud.id, {
      estado: estadoDestino,
      notas: solicitud.notas
    });

    // 5. Enriquecer datos de mesa/mesero solo si faltan y se dispone del repositorio de cuentas
    if ((!solicitud.mesa_numero || !solicitud.mesero_id) && this.cuentaService && typeof this.cuentaService.getById === 'function') {
      const cuenta = await this.cuentaService.getById(solicitud.cuenta_id);
      if (cuenta) {
        solicitud.mesa_numero = cuenta.mesa_numero || `Mesa #${cuenta.mesa_id}`;
        solicitud.mesero_id = cuenta.mesero_id ? Number(cuenta.mesero_id) : null;
        solicitud.mesero_nombre = cuenta.mesero_nombre;
      }
    }

    // 6. Si el nuevo estado es 'Listo para Servir', generar notificación para el mesero
    let notificacionGenerada = null;
    if (
      estadoDestino === ESTADOS_SOLICITUD.LISTO_PARA_SERVIR &&
      this.notificacionService &&
      typeof this.notificacionService.crearNotificacionPlatilloListo === 'function'
    ) {
      try {
        notificacionGenerada = await this.notificacionService.crearNotificacionPlatilloListo(
          solicitud.plato_nombre || `Platillo #${solicitud.plato_id}`,
          solicitud.mesa_numero || 'Sin asignar',
          solicitud.mesero_id
        );
      } catch (notifErr) {
        console.warn('Aviso: No se pudo registrar la notificación automática:', notifErr.message);
      }
    }

    return {
      solicitud,
      estadoAnterior,
      nuevoEstado: estadoDestino,
      notificacionGenerada
    };
  }
}

export default PasoSolicitudUseCase;
