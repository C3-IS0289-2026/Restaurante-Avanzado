import { BaseComponent } from './BaseComponent.js';

/**
 * Ticket de una comanda en la pantalla de cocina (HU-005.3)
 * Muestra mesa, platillo, cantidad, notas del cliente y tiempo de espera.
 */
export class KdsTicket extends BaseComponent {
  constructor(comanda) {
    super('div', 'kds-ticket');
    this.comanda = comanda;
  }

  /** Texto del botón según el estado actual (HU-006.1) */
  textoBoton() {
    if (this.comanda.estado === 'Enviado a Cocina') return 'Iniciar preparación';
    if (this.comanda.estado === 'En Preparación') return 'Marcar como listo';
    return null; // En "Listo para Servir" ya lo recoge el mesero
  }

  template() {
    const c = this.comanda;
    const boton = this.textoBoton();
    const claseDemora = c.es_demorado ? 'kds-ticket--demorado' : '';

    return `
      <div class="kds-ticket-card ${claseDemora}">
        <div class="kds-ticket-header">
          <span class="kds-mesa">Mesa ${c.mesa_numero ?? '-'}</span>
          <span class="kds-tiempo">${c.tiempo_espera_minutos} min</span>
        </div>

        <p class="kds-plato"><strong>${c.cantidad}x</strong> ${escaparHtml(c.plato_nombre)}</p>

        ${c.notas ? `<p class="kds-notas">📝 ${escaparHtml(c.notas)}</p>` : ''}

        <p class="kds-info">Pedido #${c.id} · ${horaCorta(c.hora_envio)} · ${escaparHtml(c.mesero_nombre || 'Sin mesero')}</p>

        ${boton
          ? `<button class="kds-btn" data-id="${c.id}">${boton}</button>`
          : `<p class="kds-esperando">Esperando al mesero</p>`}
      </div>
    `;
  }
}

/** Evita que un texto con etiquetas HTML (por ejemplo en las notas) rompa la pantalla */
function escaparHtml(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Convierte la fecha ISO en hora corta, por ejemplo 7:45 p. m. */
function horaCorta(fechaIso) {
  return new Date(fechaIso).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
}

export default KdsTicket;
