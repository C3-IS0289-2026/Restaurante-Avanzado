/**
 * Entidad de Dominio: Solicitud (Línea de pedido / Comanda en cocina)
 * Representa una solicitud de preparación de platillo y su ciclo de vida en cocina.
 * Implementa DDD (Entidad rica + Value Objects + Excepciones de Dominio) y POO (Herencia, Encapsulamiento).
 */

import { Entity } from './Entity.js';
import { ValidationError } from '../exceptions/DomainErrors.js';
import {
  EstadoSolicitud,
  ESTADOS_SOLICITUD,
  TRANSICIONES_PERMITIDAS,
  SECUENCIA_PASO
} from '../value-objects/EstadoSolicitud.js';
import { Cantidad } from '../value-objects/Cantidad.js';
import { Money } from '../value-objects/Money.js';

export { ESTADOS_SOLICITUD, TRANSICIONES_PERMITIDAS, SECUENCIA_PASO };

export class Solicitud extends Entity {
  /**
   * @param {Object} params
   * @param {number} [params.id]
   * @param {number} params.cuenta_id
   * @param {number} params.plato_id
   * @param {number} [params.cantidad=1]
   * @param {string} [params.notas]
   * @param {string|EstadoSolicitud} [params.estado='Enviado a Cocina']
   * @param {Date|string} [params.hora_envio]
   * @param {string} [params.plato_nombre]
   * @param {number} [params.plato_precio]
   * @param {string} [params.plato_categoria]
   * @param {string} [params.mesa_numero]
   * @param {string} [params.mesero_nombre]
   * @param {number} [params.mesero_id]
   */
  constructor({
    id = null,
    cuenta_id,
    plato_id,
    cantidad = 1,
    notas = null,
    estado = ESTADOS_SOLICITUD.ENVIADO_A_COCINA,
    hora_envio = new Date(),
    plato_nombre = null,
    plato_precio = 0,
    plato_categoria = null,
    mesa_numero = null,
    mesero_nombre = null,
    mesero_id = null
  }) {
    super(id);

    if (!cuenta_id) {
      throw new ValidationError('cuenta_id es obligatorio en la Solicitud');
    }
    if (!plato_id) {
      throw new ValidationError('plato_id es obligatorio en la Solicitud');
    }

    // Uso de Value Objects para validar e inmutabilizar reglas de negocio
    this._cantidadVO = new Cantidad(cantidad, {
      allowZero: false,
      onlyInteger: true,
      fieldName: 'cantidad'
    });
    this._estadoVO = new EstadoSolicitud(estado);
    this._precioVO = new Money(Number(plato_precio) || 0);

    this.cuenta_id = Number(cuenta_id);
    this.plato_id = Number(plato_id);
    this.notas = notas ? String(notas).trim() : null;
    this.hora_envio = hora_envio instanceof Date ? hora_envio : new Date(hora_envio);
    this.plato_nombre = plato_nombre;
    this.plato_categoria = plato_categoria;
    this.mesa_numero = mesa_numero;
    this.mesero_nombre = mesero_nombre;
    this.mesero_id = mesero_id ? Number(mesero_id) : null;
  }

  /**
   * @returns {number}
   */
  get cantidad() {
    return this._cantidadVO.value;
  }

  /**
   * @param {number} valor
   */
  set cantidad(valor) {
    this._cantidadVO = new Cantidad(valor, {
      allowZero: false,
      onlyInteger: true,
      fieldName: 'cantidad'
    });
  }

  /**
   * @returns {string}
   */
  get estado() {
    return this._estadoVO.value;
  }

  /**
   * @param {string|EstadoSolicitud} valor
   */
  set estado(valor) {
    this._estadoVO = new EstadoSolicitud(valor);
  }

  /**
   * @returns {number}
   */
  get plato_precio() {
    return this._precioVO.amount;
  }

  /**
   * @param {number} valor
   */
  set plato_precio(valor) {
    this._precioVO = new Money(Number(valor) || 0);
  }

  /**
   * Calcula el subtotal monetario de esta línea de solicitud
   * @returns {number}
   */
  calcularSubtotal() {
    return this._precioVO.multiply(this.cantidad).amount;
  }

  /**
   * Determina si la solicitud puede avanzar al siguiente paso secuencial
   * @returns {boolean}
   */
  puedeAvanzar() {
    return this._estadoVO.puedeAvanzar();
  }

  /**
   * Obtiene el siguiente estado natural según la máquina de estados
   * @returns {string}
   */
  obtenerSiguienteEstado() {
    return this._estadoVO.avanzar(this.id).value;
  }

  /**
   * Valida si una transición hacia nuevoEstado es permitida
   * @param {string} nuevoEstado
   * @returns {boolean}
   */
  esTransicionValida(nuevoEstado) {
    return this._estadoVO.esTransicionValida(nuevoEstado);
  }

  /**
   * Valida y lanza excepción de dominio detallada si la transición no es válida
   * @param {string} nuevoEstado
   */
  validarTransicion(nuevoEstado) {
    this._estadoVO.transicionarA(nuevoEstado);
  }

  /**
   * Avanza la solicitud al siguiente estado secuencial
   * @returns {string} El nuevo estado alcanzado
   */
  avanzar() {
    this._estadoVO = this._estadoVO.avanzar(this.id);
    return this.estado;
  }

  /**
   * Transiciona la solicitud a un estado específico tras validación
   * @param {string} nuevoEstado
   * @returns {string}
   */
  cambiarEstado(nuevoEstado) {
    this._estadoVO = this._estadoVO.transicionarA(nuevoEstado);
    return this.estado;
  }

  /**
   * Cancela la solicitud con una justificación
   * @param {string} [motivo=null]
   * @returns {string}
   */
  cancelar(motivo = null) {
    this._estadoVO = this._estadoVO.transicionarA(ESTADOS_SOLICITUD.CANCELADO);
    if (motivo && String(motivo).trim() !== '') {
      const motivoLimpio = String(motivo).trim();
      this.notas = this.notas
        ? `${this.notas} | [Cancelado: ${motivoLimpio}]`
        : `[Cancelado: ${motivoLimpio}]`;
    }
    return this.estado;
  }

  /**
   * Calcula los minutos transcurridos desde que se envió la solicitud a cocina
   * @param {Date} [fechaReferencia=new Date()]
   * @returns {number}
   */
  calcularTiempoEsperaMinutos(fechaReferencia = new Date()) {
    const diffMs = fechaReferencia.getTime() - this.hora_envio.getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  }

  /**
   * Determina si la solicitud tiene retraso (más de umbralMinutos en preparación)
   * @param {number} [umbralMinutos=15]
   * @param {Date} [fechaReferencia=new Date()]
   * @returns {boolean}
   */
  esDemorado(umbralMinutos = 15, fechaReferencia = new Date()) {
    if (this._estadoVO.esTerminal()) {
      return false;
    }
    return this.calcularTiempoEsperaMinutos(fechaReferencia) >= umbralMinutos;
  }

  /**
   * Serializa la entidad para respuestas JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      cuenta_id: this.cuenta_id,
      plato_id: this.plato_id,
      cantidad: this.cantidad,
      notas: this.notas,
      estado: this.estado,
      hora_envio: this.hora_envio.toISOString(),
      plato_nombre: this.plato_nombre,
      plato_precio: this.plato_precio,
      plato_categoria: this.plato_categoria,
      mesa_numero: this.mesa_numero,
      mesero_nombre: this.mesero_nombre,
      mesero_id: this.mesero_id,
      tiempo_espera_minutos: this.calcularTiempoEsperaMinutos(),
      es_demorado: this.esDemorado()
    };
  }
}

export default Solicitud;
