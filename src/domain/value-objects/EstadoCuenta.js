import { ValidationError, InvalidStateTransitionError } from '../exceptions/DomainErrors.js';

/**
 * Enumerador de estados de la entidad Cuenta (Lenguaje Ubicuo: estado_cuenta)
 */
export const ESTADOS_CUENTA = Object.freeze({
  ABIERTA: 'Abierta',
  PAGADA: 'Pagada',
  CERRADA: 'Cerrada'
});

/**
 * Transiciones válidas para el ciclo de vida de una Cuenta
 */
export const TRANSICIONES_ESTADO_CUENTA = Object.freeze({
  [ESTADOS_CUENTA.ABIERTA]: Object.freeze([ESTADOS_CUENTA.PAGADA, ESTADOS_CUENTA.CERRADA]),
  [ESTADOS_CUENTA.PAGADA]: Object.freeze([ESTADOS_CUENTA.CERRADA]),
  [ESTADOS_CUENTA.CERRADA]: Object.freeze([])
});

/**
 * Value Object: EstadoCuenta
 * Representa de forma inmutable el tipo enumerado `estado_cuenta` de la entidad `cuenta`.
 */
export class EstadoCuenta {
  /**
   * @param {string|EstadoCuenta} valor
   */
  constructor(valor = ESTADOS_CUENTA.ABIERTA) {
    const rawValue = valor instanceof EstadoCuenta ? valor.value : valor;
    const estadosValidos = Object.values(ESTADOS_CUENTA);

    if (!estadosValidos.includes(rawValue)) {
      throw new ValidationError(
        `Estado de cuenta inválido: "${rawValue}". Válidos: ${estadosValidos.join(', ')}`
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
   * @returns {boolean}
   */
  esAbierta() {
    return this._value === ESTADOS_CUENTA.ABIERTA;
  }

  /**
   * @returns {boolean}
   */
  esCerrada() {
    return this._value === ESTADOS_CUENTA.CERRADA;
  }

  /**
   * @param {string|EstadoCuenta} nuevoEstado
   * @returns {boolean}
   */
  esTransicionValida(nuevoEstado) {
    const target = nuevoEstado instanceof EstadoCuenta ? nuevoEstado.value : nuevoEstado;
    const permitidos = TRANSICIONES_ESTADO_CUENTA[this._value] || [];
    return permitidos.includes(target);
  }

  /**
   * @param {string|EstadoCuenta} nuevoEstado
   * @returns {EstadoCuenta}
   */
  transicionarA(nuevoEstado) {
    const target = nuevoEstado instanceof EstadoCuenta ? nuevoEstado.value : nuevoEstado;
    if (!this.esTransicionValida(target)) {
      const permitidos = TRANSICIONES_ESTADO_CUENTA[this._value] || [];
      throw new InvalidStateTransitionError(this._value, target, permitidos);
    }
    return new EstadoCuenta(target);
  }

  /**
   * @param {EstadoCuenta|string} other
   * @returns {boolean}
   */
  equals(other) {
    if (other instanceof EstadoCuenta) {
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

export default EstadoCuenta;
