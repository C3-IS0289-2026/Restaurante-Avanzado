import { ValidationError, InvalidStateTransitionError } from '../exceptions/DomainErrors.js';

/**
 * Enumerador de estados del detalle de cuenta en cocina (Lenguaje Ubicuo: estado_detalle_cuenta)
 */
export const ESTADOS_SOLICITUD = Object.freeze({
  ENVIADO_A_COCINA: 'Enviado a Cocina',
  EN_PREPARACION: 'En Preparación',
  LISTO_PARA_SERVIR: 'Listo para Servir',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado'
});

export const ESTADOS_DETALLE_CUENTA = ESTADOS_SOLICITUD;

/**
 * Matriz de transiciones permitidas según las reglas de negocio (Máquina de Estados)
 */
export const TRANSICIONES_PERMITIDAS = Object.freeze({
  [ESTADOS_SOLICITUD.ENVIADO_A_COCINA]: Object.freeze([
    ESTADOS_SOLICITUD.EN_PREPARACION,
    ESTADOS_SOLICITUD.CANCELADO
  ]),
  [ESTADOS_SOLICITUD.EN_PREPARACION]: Object.freeze([
    ESTADOS_SOLICITUD.LISTO_PARA_SERVIR,
    ESTADOS_SOLICITUD.CANCELADO
  ]),
  [ESTADOS_SOLICITUD.LISTO_PARA_SERVIR]: Object.freeze([
    ESTADOS_SOLICITUD.ENTREGADO,
    ESTADOS_SOLICITUD.CANCELADO
  ]),
  [ESTADOS_SOLICITUD.ENTREGADO]: Object.freeze([]),
  [ESTADOS_SOLICITUD.CANCELADO]: Object.freeze([])
});

/**
 * Secuencia ordenada de avance en el paso de solicitudes
 */
export const SECUENCIA_PASO = Object.freeze({
  [ESTADOS_SOLICITUD.ENVIADO_A_COCINA]: ESTADOS_SOLICITUD.EN_PREPARACION,
  [ESTADOS_SOLICITUD.EN_PREPARACION]: ESTADOS_SOLICITUD.LISTO_PARA_SERVIR,
  [ESTADOS_SOLICITUD.LISTO_PARA_SERVIR]: ESTADOS_SOLICITUD.ENTREGADO
});

/**
 * Value Object: EstadoSolicitud
 * Objeto de valor inmutable que encapsula el estado y las políticas de transición de una Solicitud.
 */
export class EstadoSolicitud {
  /**
   * @param {string|EstadoSolicitud} valor
   */
  constructor(valor = ESTADOS_SOLICITUD.ENVIADO_A_COCINA) {
    const rawValue = valor instanceof EstadoSolicitud ? valor.value : valor;
    const estadosValidos = Object.values(ESTADOS_SOLICITUD);

    if (!estadosValidos.includes(rawValue)) {
      throw new ValidationError(
        `Estado inicial inválido: "${rawValue}". Válidos: ${estadosValidos.join(', ')}`
      );
    }

    this._value = rawValue;
    Object.freeze(this);
  }

  /**
   * @returns {string}
   */
  get value() {
    return this._value;
  }

  /**
   * Determina si el estado actual permite avanzar secuencialmente
   * @returns {boolean}
   */
  puedeAvanzar() {
    return Boolean(SECUENCIA_PASO[this._value]);
  }

  /**
   * Determina si es un estado terminal (Entregado o Cancelado)
   * @returns {boolean}
   */
  esTerminal() {
    return (
      this._value === ESTADOS_SOLICITUD.ENTREGADO ||
      this._value === ESTADOS_SOLICITUD.CANCELADO
    );
  }

  /**
   * Verifica si la transición hacia un estado destino es válida
   * @param {string|EstadoSolicitud} nuevoEstado
   * @returns {boolean}
   */
  esTransicionValida(nuevoEstado) {
    const target = nuevoEstado instanceof EstadoSolicitud ? nuevoEstado.value : nuevoEstado;
    const permitidos = TRANSICIONES_PERMITIDAS[this._value] || [];
    return permitidos.includes(target);
  }

  /**
   * Retorna una nueva instancia de EstadoSolicitud tras avanzar secuencialmente
   * @param {number|string} [solicitudId='N/A']
   * @returns {EstadoSolicitud}
   */
  avanzar(solicitudId = 'N/A') {
    const siguiente = SECUENCIA_PASO[this._value];
    if (!siguiente) {
      throw new InvalidStateTransitionError(
        this._value,
        'Siguiente',
        [],
        `La solicitud con ID ${solicitudId || 'N/A'} en estado "${this._value}" no puede avanzar más.`
      );
    }
    return new EstadoSolicitud(siguiente);
  }

  /**
   * Retorna una nueva instancia de EstadoSolicitud validando la transición
   * @param {string|EstadoSolicitud} nuevoEstado
   * @returns {EstadoSolicitud}
   */
  transicionarA(nuevoEstado) {
    const target = nuevoEstado instanceof EstadoSolicitud ? nuevoEstado.value : nuevoEstado;
    if (this._value === target) {
      throw new InvalidStateTransitionError(
        this._value,
        target,
        TRANSICIONES_PERMITIDAS[this._value] || [],
        `La solicitud ya se encuentra en estado "${target}".`
      );
    }
    if (!this.esTransicionValida(target)) {
      const permitidos = TRANSICIONES_PERMITIDAS[this._value] || [];
      throw new InvalidStateTransitionError(this._value, target, permitidos);
    }
    return new EstadoSolicitud(target);
  }

  /**
   * Igualdad por valor (propiedad fundamental de un Value Object en DDD)
   * @param {EstadoSolicitud|string} other
   * @returns {boolean}
   */
  equals(other) {
    if (other instanceof EstadoSolicitud) {
      return this._value === other.value;
    }
    return this._value === other;
  }

  toString() {
    return this._value;
  }

  toJSON() {
    return this._value;
  }
}

export const EstadoDetalleCuenta = EstadoSolicitud;
export default EstadoSolicitud;
