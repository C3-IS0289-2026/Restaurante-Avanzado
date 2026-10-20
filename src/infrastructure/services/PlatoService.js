import { BaseService } from './BaseService.js';
import defaultPool from '../database/connection.js';

export const CATEGORIAS_PLATO = Object.freeze({
  ENTRADAS: 'Entradas',
  PLATOS_FUERTES: 'Platos Fuertes',
  BEBIDAS: 'Bebidas',
  POSTRES: 'Postres',
  OTROS: 'Otros'
});

/**
 * Servicio de infraestructura para la entidad Plato
 */
export class PlatoService extends BaseService {
  constructor(db = defaultPool) {
    super('plato', db);
  }

  /**
   * Crea un nuevo plato en el menú
   * @param {Object} params
   * @param {string} params.nombre
   * @param {number} params.precio
   * @param {string} [params.descripcion=null]
   * @param {'Entradas'|'Platos Fuertes'|'Bebidas'|'Postres'|'Otros'} params.categoria
   * @param {boolean} [params.activo=true]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object>}
   */
  async create({ nombre, precio, descripcion = null, categoria, activo = true }, client = null) {
    if (!nombre || nombre.trim() === '') {
      throw new Error('El nombre del plato es obligatorio');
    }
    const precioNum = Number(precio);
    if (isNaN(precioNum) || precioNum < 0) {
      throw new Error('El precio debe ser un número mayor o igual a 0');
    }
    const categoriasValidas = Object.values(CATEGORIAS_PLATO);
    if (!categoriasValidas.includes(categoria)) {
      throw new Error(`Categoría inválida: ${categoria}. Válidas: ${categoriasValidas.join(', ')}`);
    }

    return super.create({
      nombre: nombre.trim(),
      precio: precioNum,
      descripcion: descripcion ? descripcion.trim() : null,
      categoria,
      activo: Boolean(activo)
    }, client);
  }

  /**
   * Obtiene todos los platos con filtro opcional por categoría y estado activo
   * @param {Object} [filters={}]
   * @param {string} [filters.categoria]
   * @param {boolean} [filters.activo]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getAll({ categoria, activo } = {}, client = null) {
    const where = {};
    if (categoria) {
      where.categoria = categoria;
    }
    if (activo !== undefined && activo !== null) {
      where.activo = Boolean(activo);
    }
    return super.getAll({ where, orderBy: 'categoria ASC, nombre ASC' }, client);
  }

  /**
   * Obtiene platos filtrados por categoría
   * @param {string} categoria
   * @param {boolean} [soloActivos=true]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getByCategoria(categoria, soloActivos = true, client = null) {
    return this.getAll({
      categoria,
      activo: soloActivos ? true : undefined
    }, client);
  }

  /**
   * Obtiene los ingredientes y cantidades asociados a la receta del plato
   * @param {number|string} id - ID del plato
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getReceta(id, client = null) {
    const sql = `
      SELECT 
        r.id AS receta_id,
        r.plato_id,
        r.ingrediente_id,
        r.cantidad_requerida,
        i.nombre AS ingrediente_nombre,
        i.unidad_medida,
        i.stock_actual,
        i.punto_reorden
      FROM "receta_ingrediente" r
      JOIN "ingrediente" i ON r.ingrediente_id = i.id
      WHERE r.plato_id = $1
      ORDER BY i.nombre ASC
    `;
    const { rows } = await this.query(sql, [id], client);
    return rows;
  }

  /**
   * Desactiva un plato (soft delete)
   * @param {number|string} id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async desactivar(id, client = null) {
    return this.update(id, { activo: false }, client);
  }

  /**
   * Reactiva un plato
   * @param {number|string} id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async reactivar(id, client = null) {
    return this.update(id, { activo: true }, client);
  }
}

export default PlatoService;
