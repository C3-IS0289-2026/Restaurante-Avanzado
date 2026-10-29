import { NotificacionService } from './NotificacionService.js';

export class StockNotificationService {
  constructor(notificacionService = new NotificacionService()) {
    this.notificacionService = notificacionService;
  }

  async notifyLowStock(items) {
    for (const item of items) {
      await this.notificacionService.crearAlertaStockMinimo(
        item.name,
        item.quantity,
        item.minStock
      );
    }
  }
}