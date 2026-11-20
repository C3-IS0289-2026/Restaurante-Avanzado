import { BaseService } from './BaseService.js';
import defaultPool from '../database/connection.js';

export const TIPOS_MOVIMIENTO_INVENTARIO = Object.freeze({
  INGRESO: 'Ingreso',
  DEDUCCION_POR_VENTA: 'Deducción por Venta',
  MERMA_AJUSTE: 'Merma/Ajuste'
});

/**
 * Servicio de infraestructura para la entidad MovimientoInventario
 */
export class MovimientoInventarioService extends BaseService {
  constructor(db = defaultPool) {
    super('movimiento_inventario', db);
  }

  /**
   * Crea un registro de movimiento de inventario
   * @param {Object} params
   * @param {number} params.ingrediente_id
   * @param {'Ingreso'|'Deducción por Venta'|'Merma/Ajuste'} params.tipo_movimiento
   * @param {number} params.cantidad
   * @param {number} [params.cuenta_id=null]
   * @param {Date|string} [params.fecha_movimiento=new Date()]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object>}
   */
  async create({
    ingrediente_id,
    tipo_movimiento,
    cantidad,
    cuenta_id = null,
    fecha_movimiento = new Date()
  }, client = null) {
    if (!ingrediente_id) throw new Error('ingrediente_id es obligatorio');
    const tiposValidos = Object.values(TIPOS_MOVIMIENTO_INVENTARIO);
    if (!tiposValidos.includes(tipo_movimiento)) {
      throw new Error(`Tipo de movimiento inválido: ${tipo_movimiento}. Válidos: ${tiposValidos.join(', ')}`);
    }
    const cant = Number(cantidad);
    if (isNaN(cant) || cant <= 0) {
      throw new Error('La cantidad debe ser un número mayor a 0');
    }

    return super.create({
      ingrediente_id: Number(ingrediente_id),
      tipo_movimiento,
      cantidad: cant,
      cuenta_id: cuenta_id ? Number(cuenta_id) : null,
      fecha_movimiento
    }, client);
  }

  /**
   * Obtiene movimientos de inventario con filtros y datos del ingrediente (cumple LSP con BaseService)
   * @param {Object} [options={}]
   * @param {number} [options.ingrediente_id]
   * @param {string} [options.tipo_movimiento]
   * @param {number} [options.cuenta_id]
   * @param {Object} [options.where]
   * @param {string} [options.orderBy]
   * @param {number} [options.limit]
   * @param {number} [options.offset]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getAll(options = {}, client = null) {
    const { filters, orderBy, limit, offset } = this.normalizeQueryOptions(
      options,
      'm.fecha_movimiento DESC, m.id DESC'
    );
    const clauses = [];
    const values = [];
    let paramIndex = 1;

    if (filters.ingrediente_id) {
      clauses.push(`m."ingrediente_id" = $${paramIndex++}`);
      values.push(filters.ingrediente_id);
    }
    if (filters.tipo_movimiento) {
      clauses.push(`m."tipo_movimiento" = $${paramIndex++}`);
      values.push(filters.tipo_movimiento);
    }
    if (filters.cuenta_id) {
      clauses.push(`m."cuenta_id" = $${paramIndex++}`);
      values.push(filters.cuenta_id);
    }

    let sql = `
      SELECT 
        m.*,
        i.nombre AS ingrediente_nombre,
        i.unidad_medida AS ingrediente_unidad,
        i.stock_actual AS ingrediente_stock_actual
      FROM "movimiento_inventario" m
      JOIN "ingrediente" i ON m.ingrediente_id = i.id
    `;

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
   * Obtiene un movimiento por ID con datos del ingrediente
   * @param {number|string} id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async getById(id, client = null) {
    const sql = `
      SELECT 
        m.*,
        i.nombre AS ingrediente_nombre,
        i.unidad_medida AS ingrediente_unidad,
        i.stock_actual AS ingrediente_stock_actual
      FROM "movimiento_inventario" m
      JOIN "ingrediente" i ON m.ingrediente_id = i.id
      WHERE m.id = $1
    `;
    const { rows } = await this.query(sql, [id], client);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Obtiene los movimientos asociados a un ingrediente
   * @param {number|string} ingrediente_id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getByIngredienteId(ingrediente_id, client = null) {
    return this.getAll({ ingrediente_id }, client);
  }

  /**
   * Obtiene los movimientos asociados a una cuenta
   * @param {number|string} cuenta_id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getByCuentaId(cuenta_id, client = null) {
    return this.getAll({ cuenta_id }, client);
  }

  /**
   * Registra un movimiento y actualiza de forma atómica el stock_actual del ingrediente
   * @param {Object} params
   * @param {number} params.ingrediente_id
   * @param {'Ingreso'|'Deducción por Venta'|'Merma/Ajuste'} params.tipo_movimiento
   * @param {number} params.cantidad
   * @param {number} [params.cuenta_id=null]
   * @returns {Promise<{ movimiento: Object, stock_actual: number, alertaStockMinimo: boolean }>}
   */
  async registrarMovimientoConAjusteStock({
    ingrediente_id,
    tipo_movimiento,
    cantidad,
    cuenta_id = null
  }) {
    return this.transaction(async (client) => {
      const cant = Number(cantidad);
      const deltaStock = tipo_movimiento === TIPOS_MOVIMIENTO_INVENTARIO.INGRESO ? cant : -cant;

      // 1. Actualizar el stock del ingrediente
      const sqlUpdate = `
        UPDATE "ingrediente"
        SET "stock_actual" = "stock_actual" + $2
        WHERE id = $1
        RETURNING *
      `;
      const { rows: ingRows } = await client.query(sqlUpdate, [ingrediente_id, deltaStock]);
      if (ingRows.length === 0) {
        throw new Error(`Ingrediente con id ${ingrediente_id} no encontrado`);
      }
      const ingredienteActualizado = ingRows[0];

      // 2. Registrar el movimiento en el historial
      const movimiento = await this.create({
        ingrediente_id,
        tipo_movimiento,
        cantidad: cant,
        cuenta_id
      }, client);

      const nuevoStock = Number(ingredienteActualizado.stock_actual);
      const puntoReorden = Number(ingredienteActualizado.punto_reorden);
      const alertaStockMinimo = nuevoStock <= puntoReorden;

      return {
        movimiento,
        stock_actual: nuevoStock,
        punto_reorden: puntoReorden,
        alertaStockMinimo
      };
    });
  }

  /**
   * Descuenta stock de todos los ingredientes requeridos para un plato según su receta
   * @param {number|string} plato_id
   * @param {number} cantidadPlatos
   * @param {number} [cuenta_id=null]
   * @returns {Promise<Array<Object>>} Movimientos generados
   */
  async descontarStockPorPlato(plato_id, cantidadPlatos, cuenta_id = null) {
    return this.transaction(async (client) => {
      const sqlReceta = `
        SELECT r.ingrediente_id, r.cantidad_requerida, i.nombre AS ingrediente_nombre
        FROM "receta_ingrediente" r
        JOIN "ingrediente" i ON r.ingrediente_id = i.id
        WHERE r.plato_id = $1
      `;
      const { rows: receta } = await client.query(sqlReceta, [plato_id]);
      if (receta.length === 0) {
        return [];
      }

      const resultados = [];
      for (const item of receta) {
        const totalADescontar = Number(item.cantidad_requerida) * Number(cantidadPlatos);
        const res = await this.registrarMovimientoConAjusteStock({
          ingrediente_id: item.ingrediente_id,
          tipo_movimiento: TIPOS_MOVIMIENTO_INVENTARIO.DEDUCCION_POR_VENTA,
          cantidad: totalADescontar,
          cuenta_id
        });
        resultados.push(res);
      }
      return resultados;
    });
  }
}

export default MovimientoInventarioService;
