import { BaseComponent } from '../components/BaseComponent.js';
import { KdsBoard } from '../components/KdsBoard.js';
import { KdsApiClient } from '../components/KdsApiClient.js';

const SEGUNDOS_ACTUALIZACION = 5;

/**
 * Pantalla de Cocina (KDS)
 * - HU-005.2: se actualiza sola cada 5 segundos para mostrar pedidos nuevos.
 * - HU-006.1 / HU-006.3: botones para cambiar el estado y refrescar la pantalla.
 */
export class KdsPage extends BaseComponent {
  constructor(apiClient = new KdsApiClient()) {
    super('div', 'kds-page');
    this.api = apiClient;
    this.intervalo = null;
  }

  template() {
    return `
      <header class="kds-header">
        <h1>Pantalla de Cocina (KDS)</h1>
        <div class="kds-resumen">
          <span id="kdsActivas">Activas: -</span>
          <span id="kdsDemoradas" class="kds-resumen-demoradas">Demoradas: -</span>
          <span id="kdsActualizado" class="kds-actualizado">Cargando...</span>
        </div>
      </header>
      <p id="kdsMensaje" class="kds-mensaje" hidden></p>
      <div id="kdsBoardContainer" class="kds-board"></div>
    `;
  }

  afterRender() {
    // Un solo listener para todos los botones de los tickets
    this.element.addEventListener('click', evento => {
      const boton = evento.target.closest('.kds-btn');
      if (boton) this.avanzar(boton.dataset.id, boton);
    });

    this.cargarComandas();
    this.intervalo = setInterval(() => this.cargarComandas(), SEGUNDOS_ACTUALIZACION * 1000);
  }

  /** Pide las comandas al backend y dibuja el tablero */
  async cargarComandas() {
    // Si el usuario cambió de pantalla, dejamos de actualizar
    if (this.intervalo && !this.element.isConnected) {
      clearInterval(this.intervalo);
      return;
    }

    try {
      const tablero = await this.api.obtenerTablero();
      this.element.querySelector('#kdsBoardContainer').innerHTML = new KdsBoard(tablero).template();
      this.element.querySelector('#kdsActivas').textContent = `Activas: ${tablero.totalActivas}`;
      this.element.querySelector('#kdsDemoradas').textContent = `Demoradas: ${tablero.demoradasCount}`;
      this.element.querySelector('#kdsActualizado').textContent =
        `Actualizado ${new Date().toLocaleTimeString('es-CO')}`;
    } catch (error) {
      this.mostrarMensaje(`No se pudieron cargar los pedidos: ${error.message}`, 'error');
    }
  }

  /** Cambia la comanda al siguiente estado y vuelve a cargar el tablero */
  async avanzar(id, boton) {
    boton.disabled = true;
    try {
      const resultado = await this.api.avanzarComanda(id);
      this.mostrarMensaje(`Pedido #${id}: ${resultado.estadoAnterior} → ${resultado.nuevoEstado}`, 'ok');
      await this.cargarComandas();
    } catch (error) {
      // Aquí llegan los errores de validación del dominio (HU-006.4)
      this.mostrarMensaje(error.message, 'error');
      boton.disabled = false;
      await this.cargarComandas(); // por si el pedido cambió desde otro lado
    }
  }

  mostrarMensaje(texto, tipo) {
    const mensaje = this.element.querySelector('#kdsMensaje');
    mensaje.textContent = texto;
    mensaje.className = `kds-mensaje kds-mensaje--${tipo}`;
    mensaje.hidden = false;
    clearTimeout(this.timeoutMensaje);
    this.timeoutMensaje = setTimeout(() => { mensaje.hidden = true; }, 4000);
  }
}

export default KdsPage;
