import { BaseService } from './BaseService.js';
import { InventoryItem } from '../../domain/entities/InventoryItem.js';
import defaultPool from '../database/connection.js';

/**
 * Servicio de infraestructura para la entidad Ingrediente.
 * Implementa tanto las operaciones CRUD de BaseService (IRepository)
 * como el contrato IInventoryRepository para CheckLowStockUseCase.
 */
export class IngredienteService extends BaseService {
  constructor(db = defaultPool) {
    super('ingrediente', db);
  }

  /**
   * Crea un nuevo ingrediente
   * @param {Object} params
   * @param {string} params.nombre - Nombre del insumo/ingrediente
   * @param {string} params.unidad_medida - Ej: 'kg', 'gr', 'lt', 'ml', 'unidad'
   * @param {number} [params.stock_actual=0] - Cantidad disponible inicial
   * @param {number} [params.punto_reorden=0] - Umbral para alerta de stock mínimo
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object>}
   */
  async create({ nombre, unidad_medida, stock_actual = 0, punto_reorden = 0 }, client = null) {
    if (!nombre || nombre.trim() === '') {
      throw new Error('El nombre del ingrediente es obligatorio');
    }
    if (!unidad_medida || unidad_medida.trim() === '') {
      throw new Error('La unidad de medida es obligatoria');
    }

    return super.create({
      nombre: nombre.trim(),
      unidad_medida: unidad_medida.trim(),
      stock_actual: Number(stock_actual) || 0,
      punto_reorden: Number(punto_reorden) || 0
    }, client);
  }

  /**
   * Obtiene todos los ingredientes ordenados por nombre
   * @param {Object} [options={}]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getAll(options = {}, client = null) {
    return super.getAll({ orderBy: 'nombre ASC', ...options }, client);
  }

  /**
   * Implementación del contrato IInventoryRepository:
   * Retorna todos los ingredientes mapeados a la entidad de dominio InventoryItem
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<InventoryItem>>}
   */
  async getAllItems(client = null) {
    const rows = await this.getAll({}, client);
    return rows.map(
      row =>
        new InventoryItem({
          id: row.id,
          name: row.nombre,
          quantity: Number(row.stock_actual),
          unit: row.unidad_medida,
          minStock: Number(row.punto_reorden),
          cost: 0
        })
    );
  }

  /**
   * Obtiene todos los ingredientes cuyo stock está en o por debajo del punto de reorden
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getLowStock(client = null) {
    const sql = `
      SELECT * FROM "ingrediente"
      WHERE "stock_actual" <= "punto_reorden"
      ORDER BY ("stock_actual" - "punto_reorden") ASC, "nombre" ASC
    `;
    const { rows } = await this.query(sql, [], client);
    return rows;
  }

  /**
   * Actualiza el stock de forma atómica (suma o resta cantidad)
   * @param {number|string} id - ID del ingrediente
   * @param {number} cantidadCambio - Valor positivo (incremento) o negativo (decremento)
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async actualizarStock(id, cantidadCambio, client = null) {
    const sql = `
      UPDATE "ingrediente"
      SET "stock_actual" = "stock_actual" + $2
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await this.query(sql, [id, Number(cantidadCambio)], client);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Verifica si un ingrediente cuenta con suficiente stock
   * @param {number|string} id
   * @param {number} cantidadRequerida
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<{ suficiente: boolean, stock_actual: number, faltante: number }>}
   */
  async verificarDisponibilidad(id, cantidadRequerida, client = null) {
    const ingrediente = await this.getById(id, client);
    if (!ingrediente) {
      throw new Error(`Ingrediente con id ${id} no encontrado`);
    }
    const stock = Number(ingrediente.stock_actual);
    const requerida = Number(cantidadRequerida);
    const suficiente = stock >= requerida;
    return {
      suficiente,
      stock_actual: stock,
      faltante: suficiente ? 0 : requerida - stock
    };
  }
}

export default IngredienteService;
