import defaultPool from '../database/connection.js';
import { IRepository } from '../../domain/repositories/contracts.js';
import { ValidationError } from '../../domain/exceptions/DomainErrors.js';

/**
 * Servicio Base para operaciones CRUD genéricas contra PostgreSQL.
 * Implementa el contrato IRepository (DDD + SOLID LSP / DIP).
 */
export class BaseService extends IRepository {
  /**
   * @param {string} tableName - Nombre de la tabla en PostgreSQL
   * @param {import('pg').Pool} [db=defaultPool] - Instancia del pool de PostgreSQL
   */
  constructor(tableName, db = defaultPool) {
    super();
    if (!tableName) {
      throw new ValidationError('El nombre de la tabla es obligatorio para BaseService');
    }
    this.tableName = tableName;
    this.db = db;
  }

  /**
   * Normaliza opciones de consulta para garantizar el Principio de Sustitución de Liskov (LSP)
   * entre BaseService.getAll({ where, orderBy, limit, offset }) y los filtros directos de las subclases.
   * @param {Object} [options={}]
   * @param {string} [defaultOrderBy='id ASC']
   * @returns {{ filters: Object, orderBy: string, limit: number|null, offset: number|null }}
   */
  normalizeQueryOptions(options = {}, defaultOrderBy = 'id ASC') {
    const {
      where = {},
      orderBy = defaultOrderBy,
      limit = null,
      offset = null,
      ...directFilters
    } = options || {};

    return {
      filters: { ...directFilters, ...(where || {}) },
      orderBy,
      limit: limit !== null && limit !== undefined ? Number(limit) : null,
      offset: offset !== null && offset !== undefined ? Number(offset) : null
    };
  }

  /**
   * Ejecuta una consulta SQL parametrizada usando el cliente proporcionado o el pool por defecto
   * @param {string} text - Consulta SQL
   * @param {Array<any>} [params=[]] - Parámetros de la consulta
   * @param {import('pg').PoolClient} [client=null] - Cliente de transacción opcional
   * @returns {Promise<import('pg').QueryResult>}
   */
  async query(text, params = [], client = null) {
    const executor = client || this.db;
    return executor.query(text, params);
  }

  /**
   * Ejecuta una serie de operaciones dentro de una transacción gestionada
   * @template T
   * @param {(client: import('pg').PoolClient) => Promise<T>} callback - Función con la lógica transaccional
   * @returns {Promise<T>}
   */
  async transaction(callback) {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Obtiene todos los registros con filtros opcionales
   * @param {Object} [options={}] - Opciones de consulta
   * @param {Object} [options.where={}] - Condiciones campo: valor
   * @param {string} [options.orderBy='id ASC'] - Cláusula ORDER BY
   * @param {number} [options.limit=null] - Límite de registros
   * @param {number} [options.offset=null] - Desplazamiento
   * @param {import('pg').PoolClient} [client=null] - Cliente opcional
   * @returns {Promise<Array<Object>>}
   */
  async getAll(options = {}, client = null) {
    const { filters, orderBy, limit, offset } = this.normalizeQueryOptions(options, 'id ASC');
    const clauses = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        clauses.push(`"${key}" = $${paramIndex++}`);
        values.push(value);
      }
    }

    let sql = `SELECT * FROM "${this.tableName}"`;
    if (clauses.length > 0) {
      sql += ` WHERE ${clauses.join(' AND ')}`;
    }

    if (orderBy) {
      sql += ` ORDER BY ${orderBy}`;
    }

    if (limit !== null) {
      sql += ` LIMIT $${paramIndex++}`;
      values.push(limit);
    }

    if (offset !== null) {
      sql += ` OFFSET $${paramIndex++}`;
      values.push(offset);
    }

    const { rows } = await this.query(sql, values, client);
    return rows;
  }

  /**
   * Obtiene un registro por su clave primaria ID
   * @param {number|string} id - ID del registro
   * @param {import('pg').PoolClient} [client=null] - Cliente opcional
   * @returns {Promise<Object|null>}
   */
  async getById(id, client = null) {
    const sql = `SELECT * FROM "${this.tableName}" WHERE id = $1`;
    const { rows } = await this.query(sql, [id], client);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Inserta un nuevo registro en la tabla
   * @param {Object} data - Datos a insertar
   * @param {import('pg').PoolClient} [client=null] - Cliente opcional
   * @returns {Promise<Object>}
   */
  async create(data, client = null) {
    const entries = Object.entries(data).filter(([key, val]) => key !== 'id' && val !== undefined);
    if (entries.length === 0) {
      throw new ValidationError(`No se proporcionaron datos para crear registro en ${this.tableName}`);
    }

    const columns = entries.map(([key]) => `"${key}"`).join(', ');
    const placeholders = entries.map((_, idx) => `$${idx + 1}`).join(', ');
    const values = entries.map(([, val]) => val);

    const sql = `INSERT INTO "${this.tableName}" (${columns}) VALUES (${placeholders}) RETURNING *`;
    const { rows } = await this.query(sql, values, client);
    return rows[0];
  }

  /**
   * Actualiza un registro por su ID
   * @param {number|string} id - ID del registro a actualizar
   * @param {Object} data - Campos a modificar
   * @param {import('pg').PoolClient} [client=null] - Cliente opcional
   * @returns {Promise<Object|null>}
   */
  async update(id, data, client = null) {
    const entries = Object.entries(data).filter(([key, val]) => key !== 'id' && val !== undefined);
    if (entries.length === 0) {
      return this.getById(id, client);
    }

    const setClauses = entries.map(([key], idx) => `"${key}" = $${idx + 1}`).join(', ');
    const values = entries.map(([, val]) => val);
    values.push(id);

    const sql = `UPDATE "${this.tableName}" SET ${setClauses} WHERE id = $${values.length} RETURNING *`;
    const { rows } = await this.query(sql, values, client);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Elimina un registro por su ID
   * @param {number|string} id - ID del registro a eliminar
   * @param {import('pg').PoolClient} [client=null] - Cliente opcional
   * @returns {Promise<Object|null>}
   */
  async delete(id, client = null) {
    const sql = `DELETE FROM "${this.tableName}" WHERE id = $1 RETURNING *`;
    const { rows } = await this.query(sql, [id], client);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Verifica si existe un registro por su ID
   * @param {number|string} id - ID a verificar
   * @param {import('pg').PoolClient} [client=null] - Cliente opcional
   * @returns {Promise<boolean>}
   */
  async exists(id, client = null) {
    const sql = `SELECT 1 FROM "${this.tableName}" WHERE id = $1 LIMIT 1`;
    const { rows } = await this.query(sql, [id], client);
    return rows.length > 0;
  }
}

export default BaseService;
