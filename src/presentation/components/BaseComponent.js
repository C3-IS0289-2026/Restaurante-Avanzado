/**
 * Clase Base Abstracta para Componentes y Páginas de Presentación (POO + Patrón Template Method)
 * Aplica Herencia, Polimorfismo, Abstracción y Principio Abierto/Cerrado (OCP) en la capa UI.
 */
export class BaseComponent {
  /**
   * @param {string} [tagName='div'] - Etiqueta HTML raíz del componente
   * @param {string} [className=''] - Clases CSS iniciales
   */
  constructor(tagName = 'div', className = '') {
    if (new.target === BaseComponent) {
      throw new TypeError('BaseComponent es una clase abstracta y no puede instanciarse directamente.');
    }
    this.tagName = tagName;
    this.className = className;
    this.element = this._createRootElement(tagName, className);
    this.container = this.element; // Alias retrocompatible para páginas (KdsPage, TableMapPage, etc.)
  }

  /**
   * Crea el nodo DOM (o un objeto ligero compatible cuando se prueba fuera del navegador)
   * @private
   */
  _createRootElement(tagName, className) {
    if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
      const el = document.createElement(tagName);
      if (className) el.className = className;
      return el;
    }
    return {
      tagName: tagName.toUpperCase(),
      className: className || '',
      innerHTML: '',
      children: [],
      appendChild(child) {
        this.children.push(child);
        return child;
      }
    };
  }

  /**
   * Método abstracto/sobreescribible que retorna el marcado HTML del componente
   * @returns {string}
   */
  template() {
    return '';
  }

  /**
   * Hook opcional del ciclo de vida tras renderizar el HTML (Template Method)
   */
  afterRender() {}

  /**
   * Renderiza el componente aplicando el patrón Template Method
   * @returns {HTMLElement|Object}
   */
  render() {
    if (this.className) {
      this.element.className = this.className;
    }
    this.element.innerHTML = this.template();
    this.afterRender();
    return this.element;
  }
}

export default BaseComponent;
