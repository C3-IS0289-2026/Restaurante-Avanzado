import { BaseService } from './BaseService.js';
import defaultPool from '../database/connection.js';

export const ESTADOS_CUENTA = Object.freeze({
  ABIERTA: 'Abierta',
  PAGADA: 'Pagada',
  CERRADA: 'Cerrada'
});

/**
 * Servicio de infraestructura para la entidad Cuenta.
 * Cumple el contrato ICuentaRepository y LSP con BaseService.
 */
export class CuentaService extends BaseService {
  constructor(db = defaultPool) {
    super('cuenta', db);
  }

  /**
   * Crea una nueva cuenta (apertura de pedido/servicio para una mesa)
   * @param {Object} params
   * @param {number} params.mesa_id
   * @param {number} [params.mesero_id=null]
   * @param {number} params.numero_comensales
   * @param {'Abierta'|'Pagada'|'Cerrada'} [params.estado='Abierta']
   * @param {number} [params.subtotal=0]
   * @param {number} [params.impuestos=0]
   * @param {number} [params.total=0]
   * @param {Date|string} [params.fecha_apertura=new Date()]
   * @param {Date|string} [params.fecha_cierre=null]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object>}
   */
  async create({
    mesa_id,
    mesero_id = null,
    numero_comensales,
    estado = ESTADOS_CUENTA.ABIERTA,
    subtotal = 0,
    impuestos = 0,
    total = 0,
    fecha_apertura = new Date(),
    fecha_cierre = null
  }, client = null) {
    if (!mesa_id) throw new Error('mesa_id es obligatorio para crear una cuenta');
    const comensales = Number(numero_comensales);
    if (!comensales || comensales <= 0) {
      throw new Error('numero_comensales debe ser un número entero mayor a 0');
    }
    const estadosValidos = Object.values(ESTADOS_CUENTA);
    if (!estadosValidos.includes(estado)) {
      throw new Error(`Estado de cuenta inválido: ${estado}. Válidos: ${estadosValidos.join(', ')}`);
    }

    return super.create({
      mesa_id: Number(mesa_id),
      mesero_id: mesero_id ? Number(mesero_id) : null,
      numero_comensales: comensales,
      estado,
      subtotal: Number(subtotal) || 0,
      impuestos: Number(impuestos) || 0,
      total: Number(total) || 0,
      fecha_apertura,
      fecha_cierre
    }, client);
  }

  /**
   * Obtiene todas las cuentas con información de la mesa y el mesero (cumple LSP con BaseService)
   * @param {Object} [options={}]
   * @param {string} [options.estado]
   * @param {number} [options.mesa_id]
   * @param {number} [options.mesero_id]
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
      'c.fecha_apertura DESC'
    );
    const clauses = [];
    const values = [];
    let paramIndex = 1;

    if (filters.estado) {
      clauses.push(`c."estado" = $${paramIndex++}`);
      values.push(filters.estado);
    }
    if (filters.mesa_id) {
      clauses.push(`c."mesa_id" = $${paramIndex++}`);
      values.push(filters.mesa_id);
    }
    if (filters.mesero_id) {
      clauses.push(`c."mesero_id" = $${paramIndex++}`);
      values.push(filters.mesero_id);
    }

    let sql = `
      SELECT 
        c.*,
        m.numero AS mesa_numero,
        m.capacidad AS mesa_capacidad,
        u.nombre AS mesero_nombre
      FROM "cuenta" c
      JOIN "mesa" m ON c.mesa_id = m.id
      LEFT JOIN "usuario" u ON c.mesero_id = u.id
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
   * Obtiene una cuenta por su ID con datos relacionados de mesa y mesero
   * @param {number|string} id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async getById(id, client = null) {
    const sql = `
      SELECT 
        c.*,
        m.numero AS mesa_numero,
        m.capacidad AS mesa_capacidad,
        u.nombre AS mesero_nombre
      FROM "cuenta" c
      JOIN "mesa" m ON c.mesa_id = m.id
      LEFT JOIN "usuario" u ON c.mesero_id = u.id
      WHERE c.id = $1
    `;
    const { rows } = await this.query(sql, [id], client);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Obtiene la cuenta abierta de una mesa específica
   * @param {number|string} mesa_id
   * @param {boolean} [soloAbiertas=true]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async getByMesaId(mesa_id, soloAbiertas = true, client = null) {
    let sql = `
      SELECT 
        c.*,
        m.numero AS mesa_numero,
        u.nombre AS mesero_nombre
      FROM "cuenta" c
      JOIN "mesa" m ON c.mesa_id = m.id
      LEFT JOIN "usuario" u ON c.mesero_id = u.id
      WHERE c.mesa_id = $1
    `;
    const values = [mesa_id];
    if (soloAbiertas) {
      sql += " AND c.estado = 'Abierta'";
    }
    sql += ' ORDER BY c.fecha_apertura DESC LIMIT 1';

    const { rows } = await this.query(sql, values, client);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Actualiza el estado de una cuenta y maneja fecha_cierre si aplica
   * @param {number|string} id
   * @param {'Abierta'|'Pagada'|'Cerrada'} nuevoEstado
   * @param {Date|string} [fecha_cierre=null]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async updateEstado(id, nuevoEstado, fecha_cierre = null, client = null) {
    const estadosValidos = Object.values(ESTADOS_CUENTA);
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado inválido: ${nuevoEstado}. Válidos: ${estadosValidos.join(', ')}`);
    }

    const updateFields = { estado: nuevoEstado };
    if (nuevoEstado === ESTADOS_CUENTA.CERRADA) {
      updateFields.fecha_cierre = fecha_cierre || new Date();
    } else if (fecha_cierre !== null) {
      updateFields.fecha_cierre = fecha_cierre;
    }

    return this.update(id, updateFields, client);
  }

  /**
   * Recalcula automáticamente el subtotal, impuestos y total de una cuenta
   * sumando los detalles activos (no cancelados) y sus precios de plato
   * @param {number|string} id - ID de la cuenta
   * @param {number} [porcentajeImpuesto=0] - Porcentaje de impuesto (ej: 0.19 para 19%)
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object>} Cuenta actualizada
   */
  async recalcularTotales(id, porcentajeImpuesto = 0, client = null) {
    const sqlSubtotal = `
      SELECT COALESCE(SUM(dc.cantidad * p.precio), 0) AS subtotal
      FROM "detalle_cuenta" dc
      JOIN "plato" p ON dc.plato_id = p.id
      WHERE dc.cuenta_id = $1 AND dc.estado != 'Cancelado'
    `;
    const { rows } = await this.query(sqlSubtotal, [id], client);
    const subtotal = Number(rows[0]?.subtotal || 0);
    const impuestos = Number((subtotal * porcentajeImpuesto).toFixed(2));
    const total = Number((subtotal + impuestos).toFixed(2));

    return this.update(id, { subtotal, impuestos, total }, client);
  }

  /**
   * Cierra formalmente la cuenta y libera la mesa en una transacción
   * @param {number|string} id - ID de la cuenta
   * @returns {Promise<{ cuenta: Object, mesa: Object }>}
   */
  async cerrarCuenta(id) {
    return this.transaction(async (client) => {
      const cuenta = await this.getById(id, client);
      if (!cuenta) {
        throw new Error(`Cuenta con id ${id} no encontrada`);
      }

      // 1. Actualizar cuenta a 'Cerrada' con fecha actual
      const cuentaCerrada = await this.updateEstado(id, ESTADOS_CUENTA.CERRADA, new Date(), client);

      // 2. Liberar la mesa asociada
      const sqlMesa = `
        UPDATE "mesa" 
        SET "estado" = 'Libre' 
        WHERE id = $1 
        RETURNING *
      `;
      const { rows: mesaRows } = await this.query(sqlMesa, [cuenta.mesa_id], client);

      return {
        cuenta: cuentaCerrada,
        mesa: mesaRows[0]
      };
    });
  }

  /**
   * Obtiene la estructura completa de una cuenta: cabecera + detalles con platos + pagos
   * @param {number|string} id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async getCuentaCompleta(id, client = null) {
    const cuenta = await this.getById(id, client);
    if (!cuenta) return null;

    const sqlDetalles = `
      SELECT 
        dc.*,
        p.nombre AS plato_nombre,
        p.precio AS plato_precio,
        p.categoria AS plato_categoria,
        (dc.cantidad * p.precio) AS total_linea
      FROM "detalle_cuenta" dc
      JOIN "plato" p ON dc.plato_id = p.id
      WHERE dc.cuenta_id = $1
      ORDER BY dc.hora_envio ASC, dc.id ASC
    `;
    const { rows: detalles } = await this.query(sqlDetalles, [id], client);

    const sqlPagos = `
      SELECT * FROM "pago"
      WHERE "cuenta_id" = $1
      ORDER BY "fecha_pago" ASC
    `;
    const { rows: pagos } = await this.query(sqlPagos, [id], client);

    return {
      ...cuenta,
      detalles,
      pagos
    };
  }
}

export default CuentaService;
