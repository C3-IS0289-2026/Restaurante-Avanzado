import { BaseService } from './BaseService.js';
import defaultPool from '../database/connection.js';

/**
 * Servicio de infraestructura para la relación Receta - Ingrediente
 */
export class RecetaIngredienteService extends BaseService {
  constructor(db = defaultPool) {
    super('receta_ingrediente', db);
  }

  /**
   * Asocia un ingrediente a un plato con la cantidad requerida
   * @param {Object} params
   * @param {number} params.plato_id
   * @param {number} params.ingrediente_id
   * @param {number} params.cantidad_requerida
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object>}
   */
  async create({ plato_id, ingrediente_id, cantidad_requerida }, client = null) {
    if (!plato_id) throw new Error('plato_id es obligatorio');
    if (!ingrediente_id) throw new Error('ingrediente_id es obligatorio');
    const cantidad = Number(cantidad_requerida);
    if (isNaN(cantidad) || cantidad <= 0) {
      throw new Error('cantidad_requerida debe ser un número mayor a 0');
    }

    return super.create({
      plato_id: Number(plato_id),
      ingrediente_id: Number(ingrediente_id),
      cantidad_requerida: cantidad
    }, client);
  }

  /**
   * Obtiene asociaciones de recetas con información detallada de plato e ingrediente
   * @param {Object} [filters={}]
   * @param {number} [filters.plato_id]
   * @param {number} [filters.ingrediente_id]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getAll({ plato_id, ingrediente_id } = {}, client = null) {
    const clauses = [];
    const values = [];
    let paramIndex = 1;

    if (plato_id) {
      clauses.push(`r."plato_id" = $${paramIndex++}`);
      values.push(plato_id);
    }
    if (ingrediente_id) {
      clauses.push(`r."ingrediente_id" = $${paramIndex++}`);
      values.push(ingrediente_id);
    }

    let sql = `
      SELECT 
        r.id,
        r.plato_id,
        r.ingrediente_id,
        r.cantidad_requerida,
        p.nombre AS plato_nombre,
        p.categoria AS plato_categoria,
        i.nombre AS ingrediente_nombre,
        i.unidad_medida AS ingrediente_unidad,
        i.stock_actual AS ingrediente_stock,
        i.punto_reorden AS ingrediente_reorden
      FROM "receta_ingrediente" r
      JOIN "plato" p ON r.plato_id = p.id
      JOIN "ingrediente" i ON r.ingrediente_id = i.id
    `;

    if (clauses.length > 0) {
      sql += ` WHERE ${clauses.join(' AND ')}`;
    }
    sql += ' ORDER BY p.nombre ASC, i.nombre ASC';

    const { rows } = await this.query(sql, values, client);
    return rows;
  }

  /**
   * Obtiene una receta por su ID con datos relacionados
   * @param {number|string} id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async getById(id, client = null) {
    const sql = `
      SELECT 
        r.id,
        r.plato_id,
        r.ingrediente_id,
        r.cantidad_requerida,
        p.nombre AS plato_nombre,
        i.nombre AS ingrediente_nombre,
        i.unidad_medida AS ingrediente_unidad,
        i.stock_actual AS ingrediente_stock
      FROM "receta_ingrediente" r
      JOIN "plato" p ON r.plato_id = p.id
      JOIN "ingrediente" i ON r.ingrediente_id = i.id
      WHERE r.id = $1
    `;
    const { rows } = await this.query(sql, [id], client);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Obtiene todos los ingredientes que componen un plato
   * @param {number|string} plato_id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getByPlatoId(plato_id, client = null) {
    return this.getAll({ plato_id }, client);
  }

  /**
   * Obtiene todos los platos que usan un ingrediente específico
   * @param {number|string} ingrediente_id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getByIngredienteId(ingrediente_id, client = null) {
    return this.getAll({ ingrediente_id }, client);
  }

  /**
   * Elimina todos los ingredientes de la receta de un plato
   * @param {number|string} plato_id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<number>} - Número de filas eliminadas
   */
  async deleteByPlatoId(plato_id, client = null) {
    const sql = 'DELETE FROM "receta_ingrediente" WHERE "plato_id" = $1';
    const { rowCount } = await this.query(sql, [plato_id], client);
    return rowCount;
  }

  /**
   * Reemplaza por completo la receta de un plato dentro de una transacción
   * @param {number|string} plato_id
   * @param {Array<{ ingrediente_id: number, cantidad_requerida: number }>} items
   * @returns {Promise<Array<Object>>}
   */
  async guardarRecetaCompleta(plato_id, items) {
    return this.transaction(async (client) => {
      await this.deleteByPlatoId(plato_id, client);
      const insertados = [];
      for (const item of items) {
        const row = await this.create({
          plato_id,
          ingrediente_id: item.ingrediente_id,
          cantidad_requerida: item.cantidad_requerida
        }, client);
        insertados.push(row);
      }
      return insertados;
    });
  }
}

export default RecetaIngredienteService;
