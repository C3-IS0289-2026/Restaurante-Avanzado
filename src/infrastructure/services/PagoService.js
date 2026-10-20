import { BaseService } from './BaseService.js';
import defaultPool from '../database/connection.js';

export const METODOS_PAGO = Object.freeze({
  EFECTIVO: 'Efectivo',
  TARJETA: 'Tarjeta',
  OTRO: 'Otro'
});

/**
 * Servicio de infraestructura para la entidad Pago
 */
export class PagoService extends BaseService {
  constructor(db = defaultPool) {
    super('pago', db);
  }

  /**
   * Crea un registro de pago
   * @param {Object} params
   * @param {number} params.cuenta_id
   * @param {'Efectivo'|'Tarjeta'|'Otro'} params.metodo_pago
   * @param {number} params.monto
   * @param {Date|string} [params.fecha_pago=new Date()]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object>}
   */
  async create({
    cuenta_id,
    metodo_pago,
    monto,
    fecha_pago = new Date()
  }, client = null) {
    if (!cuenta_id) throw new Error('cuenta_id es obligatorio');
    const metodosValidos = Object.values(METODOS_PAGO);
    if (!metodosValidos.includes(metodo_pago)) {
      throw new Error(`Método de pago inválido: ${metodo_pago}. Válidos: ${metodosValidos.join(', ')}`);
    }
    const montoNum = Number(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      throw new Error('El monto de pago debe ser un número mayor a 0');
    }

    return super.create({
      cuenta_id: Number(cuenta_id),
      metodo_pago,
      monto: montoNum,
      fecha_pago
    }, client);
  }

  /**
   * Obtiene todos los pagos filtrando opcionalmente por cuenta y método
   * @param {Object} [filters={}]
   * @param {number} [filters.cuenta_id]
   * @param {string} [filters.metodo_pago]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getAll({ cuenta_id, metodo_pago } = {}, client = null) {
    const clauses = [];
    const values = [];
    let paramIndex = 1;

    if (cuenta_id) {
      clauses.push(`p."cuenta_id" = $${paramIndex++}`);
      values.push(cuenta_id);
    }
    if (metodo_pago) {
      clauses.push(`p."metodo_pago" = $${paramIndex++}`);
      values.push(metodo_pago);
    }

    let sql = `
      SELECT 
        p.*,
        c.total AS cuenta_total,
        c.estado AS cuenta_estado,
        m.numero AS mesa_numero
      FROM "pago" p
      JOIN "cuenta" c ON p.cuenta_id = c.id
      JOIN "mesa" m ON c.mesa_id = m.id
    `;

    if (clauses.length > 0) {
      sql += ` WHERE ${clauses.join(' AND ')}`;
    }
    sql += ' ORDER BY p.fecha_pago DESC';

    const { rows } = await this.query(sql, values, client);
    return rows;
  }

  /**
   * Obtiene todos los pagos asociados a una cuenta
   * @param {number|string} cuenta_id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getByCuentaId(cuenta_id, client = null) {
    const sql = `
      SELECT * FROM "pago"
      WHERE "cuenta_id" = $1
      ORDER BY "fecha_pago" ASC
    `;
    const { rows } = await this.query(sql, [cuenta_id], client);
    return rows;
  }

  /**
   * Obtiene la suma total pagada para una cuenta
   * @param {number|string} cuenta_id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<number>}
   */
  async getTotalPagadoPorCuenta(cuenta_id, client = null) {
    const sql = `
      SELECT COALESCE(SUM("monto"), 0) AS total_pagado
      FROM "pago"
      WHERE "cuenta_id" = $1
    `;
    const { rows } = await this.query(sql, [cuenta_id], client);
    return Number(rows[0]?.total_pagado || 0);
  }

  /**
   * Registra un pago y evalúa en una transacción si la cuenta queda completamente saldada
   * para actualizar su estado a 'Pagada' si corresponde.
   * @param {Object} params
   * @param {number} params.cuenta_id
   * @param {'Efectivo'|'Tarjeta'|'Otro'} params.metodo_pago
   * @param {number} params.monto
   * @returns {Promise<{ pago: Object, cuentaPagada: boolean, saldoPendiente: number }>}
   */
  async registrarPagoConValidacion({ cuenta_id, metodo_pago, monto }) {
    return this.transaction(async (client) => {
      // 1. Obtener datos de la cuenta
      const sqlCuenta = 'SELECT * FROM "cuenta" WHERE id = $1 FOR UPDATE';
      const { rows: cuentaRows } = await client.query(sqlCuenta, [cuenta_id]);
      if (cuentaRows.length === 0) {
        throw new Error(`Cuenta con id ${cuenta_id} no encontrada`);
      }
      const cuenta = cuentaRows[0];

      // 2. Registrar el nuevo pago
      const nuevoPago = await this.create({
        cuenta_id,
        metodo_pago,
        monto
      }, client);

      // 3. Calcular acumulado pagado
      const totalPagado = await this.getTotalPagadoPorCuenta(cuenta_id, client);
      const totalCuenta = Number(cuenta.total);
      const cuentaPagada = totalPagado >= totalCuenta;
      const saldoPendiente = Math.max(0, Number((totalCuenta - totalPagado).toFixed(2)));

      // 4. Si el pago cubre el total, actualizar estado a 'Pagada'
      if (cuentaPagada && cuenta.estado === 'Abierta') {
        await client.query('UPDATE "cuenta" SET "estado" = $1 WHERE id = $2', ['Pagada', cuenta_id]);
      }

      return {
        pago: nuevoPago,
        cuentaPagada,
        totalPagado,
        saldoPendiente
      };
    });
  }
}

export default PagoService;
