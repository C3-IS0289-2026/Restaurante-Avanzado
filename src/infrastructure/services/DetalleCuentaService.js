import { BaseService } from './BaseService.js';
import defaultPool from '../database/connection.js';

export const ESTADOS_DETALLE_CUENTA = Object.freeze({
  ENVIADO_A_COCINA: 'Enviado a Cocina',
  EN_PREPARACION: 'En Preparación',
  LISTO_PARA_SERVIR: 'Listo para Servir',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado'
});

/**
 * Servicio de infraestructura para la entidad DetalleCuenta (líneas de pedido/comanda)
 */
export class DetalleCuentaService extends BaseService {
  constructor(db = defaultPool) {
    super('detalle_cuenta', db);
  }

  /**
   * Crea una nueva línea de pedido
   * @param {Object} params
   * @param {number} params.cuenta_id
   * @param {number} params.plato_id
   * @param {number} params.cantidad
   * @param {string} [params.notas=null]
   * @param {'Enviado a Cocina'|'En Preparación'|'Listo para Servir'|'Entregado'|'Cancelado'} [params.estado='Enviado a Cocina']
   * @param {Date|string} [params.hora_envio=new Date()]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object>}
   */
  async create({
    cuenta_id,
    plato_id,
    cantidad,
    notas = null,
    estado = ESTADOS_DETALLE_CUENTA.ENVIADO_A_COCINA,
    hora_envio = new Date()
  }, client = null) {
    if (!cuenta_id) throw new Error('cuenta_id es obligatorio');
    if (!plato_id) throw new Error('plato_id es obligatorio');
    const cant = Number(cantidad);
    if (!cant || cant <= 0) {
      throw new Error('cantidad debe ser un número entero mayor a 0');
    }
    const estadosValidos = Object.values(ESTADOS_DETALLE_CUENTA);
    if (!estadosValidos.includes(estado)) {
      throw new Error(`Estado de detalle inválido: ${estado}. Válidos: ${estadosValidos.join(', ')}`);
    }

    return super.create({
      cuenta_id: Number(cuenta_id),
      plato_id: Number(plato_id),
      cantidad: cant,
      notas: notas ? notas.trim() : null,
      estado,
      hora_envio
    }, client);
  }

  /**
   * Obtiene detalles de cuenta filtrados, incluyendo datos del plato
   * @param {Object} [filters={}]
   * @param {number} [filters.cuenta_id]
   * @param {number} [filters.plato_id]
   * @param {string} [filters.estado]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getAll({ cuenta_id, plato_id, estado } = {}, client = null) {
    const clauses = [];
    const values = [];
    let paramIndex = 1;

    if (cuenta_id) {
      clauses.push(`dc."cuenta_id" = $${paramIndex++}`);
      values.push(cuenta_id);
    }
    if (plato_id) {
      clauses.push(`dc."plato_id" = $${paramIndex++}`);
      values.push(plato_id);
    }
    if (estado) {
      clauses.push(`dc."estado" = $${paramIndex++}`);
      values.push(estado);
    }

    let sql = `
      SELECT 
        dc.*,
        p.nombre AS plato_nombre,
        p.precio AS plato_precio,
        p.categoria AS plato_categoria,
        (dc.cantidad * p.precio) AS total_linea
      FROM "detalle_cuenta" dc
      JOIN "plato" p ON dc.plato_id = p.id
    `;

    if (clauses.length > 0) {
      sql += ` WHERE ${clauses.join(' AND ')}`;
    }
    sql += ' ORDER BY dc.hora_envio ASC, dc.id ASC';

    const { rows } = await this.query(sql, values, client);
    return rows;
  }

  /**
   * Obtiene un detalle de cuenta por ID con información del plato
   * @param {number|string} id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async getById(id, client = null) {
    const sql = `
      SELECT 
        dc.*,
        p.nombre AS plato_nombre,
        p.precio AS plato_precio,
        p.categoria AS plato_categoria
      FROM "detalle_cuenta" dc
      JOIN "plato" p ON dc.plato_id = p.id
      WHERE dc.id = $1
    `;
    const { rows } = await this.query(sql, [id], client);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Obtiene todos los detalles de una cuenta específica
   * @param {number|string} cuenta_id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getByCuentaId(cuenta_id, client = null) {
    return this.getAll({ cuenta_id }, client);
  }

  /**
   * Actualiza el estado de preparación de un platillo/pedido
   * @param {number|string} id
   * @param {'Enviado a Cocina'|'En Preparación'|'Listo para Servir'|'Entregado'|'Cancelado'} nuevoEstado
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async updateEstado(id, nuevoEstado, client = null) {
    const estadosValidos = Object.values(ESTADOS_DETALLE_CUENTA);
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado inválido: ${nuevoEstado}. Válidos: ${estadosValidos.join(', ')}`);
    }
    return this.update(id, { estado: nuevoEstado }, client);
  }

  /**
   * Obtiene los platillos pendientes para la pantalla de cocina (KDS)
   * @param {Array<string>} [estados=['Enviado a Cocina', 'En Preparación']]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getKdsItems(estados = [ESTADOS_DETALLE_CUENTA.ENVIADO_A_COCINA, ESTADOS_DETALLE_CUENTA.EN_PREPARACION], client = null) {
    const placeholders = estados.map((_, i) => `$${i + 1}`).join(', ');
    const sql = `
      SELECT 
        dc.id,
        dc.cuenta_id,
        dc.plato_id,
        dc.cantidad,
        dc.notas,
        dc.estado,
        dc.hora_envio,
        p.nombre AS plato_nombre,
        p.categoria AS plato_categoria,
        m.numero AS mesa_numero,
        u.nombre AS mesero_nombre
      FROM "detalle_cuenta" dc
      JOIN "plato" p ON dc.plato_id = p.id
      JOIN "cuenta" c ON dc.cuenta_id = c.id
      JOIN "mesa" m ON c.mesa_id = m.id
      LEFT JOIN "usuario" u ON c.mesero_id = u.id
      WHERE dc.estado IN (${placeholders})
        AND c.estado = 'Abierta'
      ORDER BY dc.hora_envio ASC, dc.id ASC
    `;
    const { rows } = await this.query(sql, estados, client);
    return rows;
  }
}

export default DetalleCuentaService;
