/**
 * Jerarquía de Excepciones de Dominio (DDD + SOLID OCP/LSP)
 * Permite expresar errores semánticos del negocio sin acoplar el dominio a HTTP,
 * facilitando el polimorfismo en capas externas.
 */

export class DomainError extends Error {
  /**
   * @param {string} message - Descripción del error de dominio
   * @param {string} [code='DOMAIN_ERROR'] - Código identificador del error
   * @param {number} [httpStatus=400] - Código de estado sugerido para adaptadores HTTP
   */
  constructor(message, code = 'DOMAIN_ERROR', httpStatus = 400) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.httpStatus = httpStatus;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends DomainError {
  constructor(message) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class InvalidStateTransitionError extends DomainError {
  /**
   * @param {string} currentState
   * @param {string} targetState
   * @param {Array<string>} [allowedStates=[]]
   * @param {string} [customMessage=null]
   */
  constructor(currentState, targetState, allowedStates = [], customMessage = null) {
    const permitidosStr = allowedStates.length > 0 ? allowedStates.join(', ') : 'Ninguno (estado terminal)';
    const msg = customMessage ||
      `Transición de estado inválida: No se puede cambiar de "${currentState}" a "${targetState}". Transiciones válidas: [${permitidosStr}].`;
    super(msg, 'INVALID_STATE_TRANSITION', 400);
    this.currentState = currentState;
    this.targetState = targetState;
    this.allowedStates = allowedStates;
  }
}

export class EntityNotFoundError extends DomainError {
  /**
   * @param {string} entityName
   * @param {number|string} identifier
   * @param {string} [customMessage=null]
   */
  constructor(entityName, identifier, customMessage = null) {
    const msg = customMessage || `${entityName} con ID ${identifier} no encontrada.`;
    super(msg, 'ENTITY_NOT_FOUND', 404);
    this.entityName = entityName;
    this.identifier = identifier;
  }
}

export class BusinessRuleError extends DomainError {
  constructor(message) {
    super(message, 'BUSINESS_RULE_VIOLATION', 400);
  }
}

export default {
  DomainError,
  ValidationError,
  InvalidStateTransitionError,
  EntityNotFoundError,
  BusinessRuleError
};
