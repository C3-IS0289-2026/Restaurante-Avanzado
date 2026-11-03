import { Entity } from './Entity.js';
import { ValidationError } from '../exceptions/DomainErrors.js';

export const CATEGORIAS_PLATO = Object.freeze({
  ENTRADAS: 'Entradas',
  PLATOS_FUERTES: 'Platos Fuertes',
  BEBIDAS: 'Bebidas',
  POSTRES: 'Postres',
  OTROS: 'Otros'
});

const NOMBRE_MAX = 100;            // VARCHAR(100) en la tabla plato
const PRECIO_MAX = 99999999.99;    // límite de DECIMAL(10, 2)

/**
 * Entidad de Dominio: Plato (platillo del menú)
 */
export class Plato extends Entity {
  constructor({ id = null, nombre, precio, descripcion = null, categoria, activo = true } = {}) {
    super(id);
    this._nombre = Plato.validarNombre(nombre);
    this._precio = Plato.validarPrecio(precio);
    this._descripcion = Plato.normalizarDescripcion(descripcion);
    this._categoria = Plato.validarCategoria(categoria);
    this._activo = Boolean(activo);
  }

  static validarNombre(nombre) {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      throw new ValidationError('El nombre del plato es obligatorio');
    }
    const limpio = nombre.trim();
    if (limpio.length > NOMBRE_MAX) {
      throw new ValidationError(`El nombre no puede superar ${NOMBRE_MAX} caracteres`);
    }
    return limpio;
  }

  static validarPrecio(precio) {
    if (precio === null || precio === undefined || (typeof precio === 'string' && precio.trim() === '')) {
      throw new ValidationError('El precio del plato es obligatorio');
    }
    const valor = Number(precio);
    if (!Number.isFinite(valor) || valor < 0 || valor > PRECIO_MAX) {
      throw new ValidationError(`El precio debe ser un número entre 0 y ${PRECIO_MAX}`);
    }
    return Math.round(valor * 100) / 100;
  }

  static normalizarDescripcion(descripcion) {
    if (descripcion === null || descripcion === undefined) return null;
    if (typeof descripcion !== 'string') {
      throw new ValidationError('La descripción debe ser texto');
    }
    const limpia = descripcion.trim();
    return limpia === '' ? null : limpia;
  }

  static validarCategoria(categoria) {
    const validas = Object.values(CATEGORIAS_PLATO);
    if (!validas.includes(categoria)) {
      throw new ValidationError(`Categoría inválida: ${categoria}. Válidas: ${validas.join(', ')}`);
    }
    return categoria;
  }

  get nombre() { return this._nombre; }
  get precio() { return this._precio; }
  get descripcion() { return this._descripcion; }
  get categoria() { return this._categoria; }
  get activo() { return this._activo; }

  /** Datos listos para insertar en la tabla plato (sin id) */
  toPersistence() {
    return {
      nombre: this.nombre,
      precio: this.precio,
      descripcion: this.descripcion,
      categoria: this.categoria,
      activo: this.activo
    };
  }

  toJSON() {
    return { id: this.id, ...this.toPersistence() };
  }
}