import { ValidationError } from '../exceptions/DomainErrors.js';

/**
 * Value Object: Cantidad
 * Objeto de valor inmutable que garantiza una cantidad numérica válida mayor a 0 (o >= 0 según configuración).
 */
export class Cantidad {
  /**
   * @param {number|string|Cantidad} valor
   * @param {Object} [options={}]
   * @param {boolean} [options.allowZero=false]
   * @param {boolean} [options.onlyInteger=false]
   * @param {string} [options.fieldName='cantidad']
   */
  constructor(valor, { allowZero = false, onlyInteger = false, fieldName = 'cantidad' } = {}) {
    const raw = valor instanceof Cantidad ? valor.value : Number(valor);

    if (Number.isNaN(raw) || !Number.isFinite(raw)) {
      throw new ValidationError(`${fieldName} debe ser un número válido`);
    }

    if (allowZero ? raw < 0 : raw <= 0) {
      const msg = onlyInteger
        ? `${fieldName} debe ser un número entero mayor a 0`
        : `${fieldName} debe ser un número ${allowZero ? 'mayor o igual' : 'mayor'} a 0`;
      throw new ValidationError(msg);
    }

    if (onlyInteger && !Number.isInteger(raw)) {
      throw new ValidationError(`${fieldName} debe ser un número entero mayor a 0`);
    }

    this._value = raw;
    Object.freeze(this);
  }

  /**
   * @returns {number}
   */
  get value() {
    return this._value;
  }

  /**
   * Suma dos cantidades retornando un nuevo Value Object
   * @param {Cantidad|number} otra
   * @returns {Cantidad}
   */
  sumar(otra) {
    const val = otra instanceof Cantidad ? otra.value : Number(otra);
    return new Cantidad(this._value + val, { allowZero: true });
  }

  /**
   * Multiplica la cantidad por un factor retornando un nuevo Value Object
   * @param {number} factor
   * @returns {Cantidad}
   */
  multiplicar(factor) {
    return new Cantidad(this._value * Number(factor), { allowZero: true });
  }

  equals(other) {
    if (other instanceof Cantidad) {
      return this._value === other.value;
    }
    return this._value === Number(other);
  }

  valueOf() {
    return this._value;
  }

  toJSON() {
    return this._value;
  }
}

export default Cantidad;
