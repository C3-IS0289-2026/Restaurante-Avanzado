import { BaseService } from './BaseService.js';
import defaultPool from '../database/connection.js';

export const ESTADOS_MESA = Object.freeze({
  LIBRE: 'Libre',
  OCUPADA: 'Ocupada',
  RESERVADA: 'Reservada'
});

/**
 * Servicio de infraestructura para la entidad Mesa
 */
export class MesaService extends BaseService {
  constructor(db = defaultPool) {
    super('mesa', db);
  }

  /**
   * Crea una nueva mesa
   * @param {Object} params
   * @param {string} params.numero - Identificador o número de la mesa
   * @param {number} params.capacidad - Capacidad de personas
   * @param {'Libre'|'Ocupada'|'Reservada'} [params.estado='Libre'] - Estado inicial
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object>}
   */
  async create({ numero, capacidad, estado = ESTADOS_MESA.LIBRE }, client = null) {
    if (!numero || typeof numero !== 'string' || numero.trim() === '') {
      throw new Error('El número de mesa es obligatorio');
    }
    if (!capacidad || Number(capacidad) <= 0) {
      throw new Error('La capacidad de la mesa debe ser un número mayor a 0');
    }
    const estadosValidos = Object.values(ESTADOS_MESA);
    if (!estadosValidos.includes(estado)) {
      throw new Error(`Estado de mesa inválido: ${estado}. Válidos: ${estadosValidos.join(', ')}`);
    }

    return super.create({
      numero: numero.trim(),
      capacidad: Number(capacidad),
      estado
    }, client);
  }

  /**
   * Obtiene todas las mesas con filtro opcional por estado
   * @param {Object} [filters={}]
   * @param {'Libre'|'Ocupada'|'Reservada'} [filters.estado]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getAll({ estado } = {}, client = null) {
    const where = {};
    if (estado) {
      where.estado = estado;
    }
    return super.getAll({ where, orderBy: 'numero ASC' }, client);
  }

  /**
   * Obtiene una mesa por su número identificador
   * @param {string} numero
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async getByNumero(numero, client = null) {
    const sql = 'SELECT * FROM "mesa" WHERE LOWER("numero") = LOWER($1)';
    const { rows } = await this.query(sql, [numero.trim()], client);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Obtiene todas las mesas disponibles ('Libre')
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getMesasLibres(client = null) {
    return this.getAll({ estado: ESTADOS_MESA.LIBRE }, client);
  }

  /**
   * Actualiza el estado de una mesa
   * @param {number|string} id
   * @param {'Libre'|'Ocupada'|'Reservada'} nuevoEstado
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async updateEstado(id, nuevoEstado, client = null) {
    const estadosValidos = Object.values(ESTADOS_MESA);
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado de mesa inválido: ${nuevoEstado}. Válidos: ${estadosValidos.join(', ')}`);
    }
    return this.update(id, { estado: nuevoEstado }, client);
  }
}

export default MesaService;
