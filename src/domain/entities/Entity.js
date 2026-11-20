/**
 * Clase Base Abstracta para Entidades de Dominio (DDD + POO)
 * En DDD, una Entidad se define por su continuidad e identidad única (id),
 * a diferencia de un Value Object que se define por sus atributos.
 */
export class Entity {
  /**
   * @param {number|string|null} [id=null]
   */
  constructor(id = null) {
    if (new.target === Entity) {
      throw new TypeError('No se puede instanciar la clase abstracta Entity directamente.');
    }
    this._id = id !== undefined && id !== null && id !== '' ? (Number.isNaN(Number(id)) ? id : Number(id)) : null;
  }

  /**
   * @returns {number|string|null}
   */
  get id() {
    return this._id;
  }

  /**
   * @param {number|string|null} val
   */
  set id(val) {
    this._id = val !== undefined && val !== null && val !== '' ? (Number.isNaN(Number(val)) ? val : Number(val)) : null;
  }

  /**
   * Compara si dos entidades son equivalentes por su identidad y tipo
   * @param {Entity} other
   * @returns {boolean}
   */
  equals(other) {
    if (!other || !(other instanceof Entity)) {
      return false;
    }
    if (this.constructor !== other.constructor) {
      return false;
    }
    if (this._id === null || other.id === null) {
      return this === other;
    }
    return this._id === other.id;
  }
}

export default Entity;
