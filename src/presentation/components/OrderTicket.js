import { BaseComponent } from './BaseComponent.js';

export class OrderTicket extends BaseComponent {
  constructor({ orderId, table, time, items } = {}) {
    super('div', 'order-ticket');
    this.orderId = orderId;
    this.table = table;
    this.time = time;
    this.items = items || [];
  }

  template() {
    const itemsHtml = this.items.map(item => `<li>${item.quantity}x ${item.name}</li>`).join('');

    return `
      <div class="ticket-header">
        <span>Mesa ${this.table}</span>
        <span>${this.time}</span>
      </div>
      <ul class="ticket-items">
        ${itemsHtml}
      </ul>
      <div class="ticket-actions">
        <button>Avanzar</button>
      </div>
    `;
  }
}
