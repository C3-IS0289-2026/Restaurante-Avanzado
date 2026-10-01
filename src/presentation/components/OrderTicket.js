export class OrderTicket {
  constructor({ orderId, table, time, items }) {
    this.orderId = orderId;
    this.table = table;
    this.time = time;
    this.items = items || [];
    this.element = document.createElement('div');
  }

  render() {
    this.element.className = 'order-ticket';
    
    const itemsHtml = this.items.map(item => `<li>${item.quantity}x ${item.name}</li>`).join('');

    this.element.innerHTML = `
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
    return this.element;
  }
}
