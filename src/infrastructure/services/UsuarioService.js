import { BaseService } from './BaseService.js';
import defaultPool from '../database/connection.js';

export const ROLES_USUARIO = Object.freeze({
  MESERO: 'Mesero',
  COCINERO: 'Cocinero',
  CAJERO: 'Cajero',
  ADMINISTRADOR: 'Administrador'
});

/**
 * Servicio de infraestructura para la entidad Usuario
 */
export class UsuarioService extends BaseService {
  constructor(db = defaultPool) {
    super('usuario', db);
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} params
   * @param {string} params.nombre
   * @param {'Mesero'|'Cocinero'|'Cajero'|'Administrador'} params.rol
   * @param {string} params.credenciales_email
   * @param {string} params.credenciales_password
   * @param {boolean} [params.activo=true]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object>}
   */
  async create({ nombre, rol, credenciales_email, credenciales_password, activo = true }, client = null) {
    if (!nombre || nombre.trim() === '') {
      throw new Error('El nombre de usuario es obligatorio');
    }
    const rolesValidos = Object.values(ROLES_USUARIO);
    if (!rolesValidos.includes(rol)) {
      throw new Error(`Rol inválido: ${rol}. Válidos: ${rolesValidos.join(', ')}`);
    }
    if (!credenciales_email || !credenciales_email.includes('@')) {
      throw new Error('El correo electrónico no es válido');
    }
    if (!credenciales_password || credenciales_password.trim() === '') {
      throw new Error('La contraseña es obligatoria');
    }

    const created = await super.create({
      nombre: nombre.trim(),
      rol,
      credenciales_email: credenciales_email.trim().toLowerCase(),
      credenciales_password,
      activo: Boolean(activo)
    }, client);

    const { credenciales_password: _, ...safeUser } = created;
    return safeUser;
  }

  /**
   * Obtiene todos los usuarios filtrando opcionalmente por rol y estado activo
   * @param {Object} [filters={}]
   * @param {string} [filters.rol]
   * @param {boolean} [filters.activo]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Array<Object>>}
   */
  async getAll({ rol, activo } = {}, client = null) {
    const clauses = [];
    const values = [];
    let paramIndex = 1;

    if (rol) {
      clauses.push(`"rol" = $${paramIndex++}`);
      values.push(rol);
    }
    if (activo !== undefined && activo !== null) {
      clauses.push(`"activo" = $${paramIndex++}`);
      values.push(Boolean(activo));
    }

    let sql = 'SELECT id, nombre, rol, credenciales_email, activo FROM "usuario"';
    if (clauses.length > 0) {
      sql += ` WHERE ${clauses.join(' AND ')}`;
    }
    sql += ' ORDER BY id ASC';

    const { rows } = await this.query(sql, values, client);
    return rows;
  }

  /**
   * Obtiene un usuario por ID
   * @param {number|string} id
   * @param {boolean} [includePassword=false]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async getById(id, includePassword = false, client = null) {
    const fields = includePassword
      ? '*'
      : 'id, nombre, rol, credenciales_email, activo';
    const sql = `SELECT ${fields} FROM "usuario" WHERE id = $1`;
    const { rows } = await this.query(sql, [id], client);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Obtiene un usuario por su email
   * @param {string} email
   * @param {boolean} [includePassword=false]
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async getByEmail(email, includePassword = false, client = null) {
    const fields = includePassword
      ? '*'
      : 'id, nombre, rol, credenciales_email, activo';
    const sql = `SELECT ${fields} FROM "usuario" WHERE LOWER("credenciales_email") = LOWER($1)`;
    const { rows } = await this.query(sql, [email.trim()], client);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Actualiza los datos de un usuario
   * @param {number|string} id
   * @param {Object} data
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async update(id, data, client = null) {
    const updateData = { ...data };
    if (updateData.credenciales_email) {
      updateData.credenciales_email = updateData.credenciales_email.trim().toLowerCase();
    }
    if (updateData.nombre) {
      updateData.nombre = updateData.nombre.trim();
    }
    const updated = await super.update(id, updateData, client);
    if (!updated) return null;
    const { credenciales_password: _, ...safeUser } = updated;
    return safeUser;
  }

  /**
   * Cambia la contraseña de un usuario
   * @param {number|string} id
   * @param {string} nuevaPasswordHash
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<boolean>}
   */
  async cambiarPassword(id, nuevaPasswordHash, client = null) {
    const sql = 'UPDATE "usuario" SET "credenciales_password" = $2 WHERE id = $1';
    const { rowCount } = await this.query(sql, [id, nuevaPasswordHash], client);
    return rowCount > 0;
  }

  /**
   * Desactiva un usuario (soft delete)
   * @param {number|string} id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async desactivar(id, client = null) {
    return this.update(id, { activo: false }, client);
  }

  /**
   * Reactiva un usuario previamente desactivado
   * @param {number|string} id
   * @param {import('pg').PoolClient} [client=null]
   * @returns {Promise<Object|null>}
   */
  async reactivar(id, client = null) {
    return this.update(id, { activo: true }, client);
  }
}

export default UsuarioService;
