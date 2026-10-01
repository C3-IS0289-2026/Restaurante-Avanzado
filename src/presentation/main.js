import './style.css'
// Importación de las páginas principales creadas
import { TableMapPage } from './pages/TableMapPage.js';
import { OrderTakingPage } from './pages/OrderTakingPage.js';
import { KdsPage } from './pages/KdsPage.js';
import { MenuManagementPage } from './pages/MenuManagementPage.js';

// Importación de componentes para las otras vistas
import { RecipeBuilder } from './components/RecipeBuilder.js';
import { InventoryForm } from './components/InventoryForm.js';

// Importación de estilos
import './styles/tables.css';
import './styles/order.css';
import './styles/kds.css';
import './styles/management.css';
import './styles/recipe.css';

document.querySelector('#app').innerHTML = `
  <div style="padding: 1rem; background: #eee; margin-bottom: 1rem;">
    <h2>Navegación de Desarrollo</h2>
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
      <button id="btn-tables">Mapa de Mesas (DouCiv)</button>
      <button id="btn-orders">Toma de Pedidos (DiaxJF)</button>
      <button id="btn-kds">KDS Cocina (juanpaocampo45)</button>
      <button id="btn-menu">Gestión Menú (juan4298jose)</button>
      <button id="btn-recipe">Constructor de Recetas (Bree-zzz)</button>
      <button id="btn-inventory">Inventario / Stock (David3560)</button>
    </div>
  </div>
  <div id="view-container">
    <div>
      <h1>Sistema de Gestión de Restaurante</h1>
      <p>Selecciona una opción en la barra superior para ver las plantillas iniciales.</p>
    </div>
  </div>
`

const viewContainer = document.getElementById('view-container');

function renderView(pageInstance) {
  viewContainer.innerHTML = '';
  viewContainer.appendChild(pageInstance.render());
}

document.getElementById('btn-tables').addEventListener('click', () => {
  renderView(new TableMapPage());
});

document.getElementById('btn-orders').addEventListener('click', () => {
  renderView(new OrderTakingPage());
});

document.getElementById('btn-kds').addEventListener('click', () => {
  renderView(new KdsPage());
});

document.getElementById('btn-menu').addEventListener('click', () => {
  renderView(new MenuManagementPage());
});

document.getElementById('btn-recipe').addEventListener('click', () => {
  renderView(new RecipeBuilder());
});

document.getElementById('btn-inventory').addEventListener('click', () => {
  renderView(new InventoryForm());
});
