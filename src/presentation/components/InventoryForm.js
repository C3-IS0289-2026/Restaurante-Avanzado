import { BaseComponent } from './BaseComponent.js';

export class InventoryForm extends BaseComponent {
  constructor() {
    super('div', 'inventory-form');
  }

  template() {
    return `
      <h2>Gestionar Ingrediente</h2>
      <form id="invForm">
        <label>Nombre:</label>
        <input type="text" name="name" required>
        
        <label>Unidad de Medida:</label>
        <input type="text" name="unit" placeholder="ej: gramos, kg, unidad" required>
        
        <label>Stock Mínimo de Alerta:</label>
        <input type="number" name="minStock" min="0" required>
        
        <button type="submit" id="btn-submit-inv">Guardar</button>
      </form>
      <div id="invFormFeedback" style="margin-top: 15px; font-weight: bold;"></div>
    `;
  }

  afterRender() {
    if (typeof document === 'undefined') return;

    const form = this.element.querySelector ? this.element.querySelector('#invForm') : null;
    const feedback = this.element.querySelector ? this.element.querySelector('#invFormFeedback') : null;

    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const nombre = formData.get('name')?.toString().trim();
      const unidad_medida = formData.get('unit')?.toString().trim();
      const punto_reorden = Number(formData.get('minStock')) || 0;

      if (!nombre || !unidad_medida) {
        if (feedback) {
          feedback.style.color = '#c0392b';
          feedback.textContent = 'Por favor complete todos los campos obligatorios.';
        }
        return;
      }

      if (feedback) {
        feedback.style.color = '#2980b9';
        feedback.textContent = 'Guardando ingrediente...';
      }

      const submitBtn = form.querySelector('#btn-submit-inv');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch('http://localhost:3001/api/ingredientes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nombre,
            unidad_medida,
            punto_reorden,
            stock_actual: 0
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          if (feedback) {
            feedback.style.color = '#27ae60';
            feedback.textContent = `✓ Ingrediente "${nombre}" guardado con éxito en la base de datos (ID: ${result.data?.id || ''}).`;
          }
          form.reset();
        } else {
          if (feedback) {
            feedback.style.color = '#c0392b';
            feedback.textContent = `✗ Error: ${result.error || 'No se pudo guardar el ingrediente'}`;
          }
        }
      } catch (err) {
        if (feedback) {
          feedback.style.color = '#c0392b';
          feedback.textContent = `✗ Error de conexión con el backend (http://localhost:3001): ${err.message}`;
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
}
