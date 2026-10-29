import { InventoryItem } from '../../domain/entities/InventoryItem.js';
import { ValidationError } from '../../domain/exceptions/DomainErrors.js';

/**
 * Caso de Uso: Verificar Ítems con Stock Bajo (HU-011.2)
 * Evalúa los insumos del inventario mediante la lógica de la entidad InventoryItem
 * y dispara notificaciones si existen insumos en o por debajo del punto de reorden.
 */
export class CheckLowStockUseCase {
  /**
   * @param {import('../../domain/repositories/contracts.js').IInventoryRepository} inventoryRepository
   * @param {import('../../domain/repositories/contracts.js').INotificacionPort} notificationService
   */
  constructor(inventoryRepository, notificationService = null) {
    if (!inventoryRepository || typeof inventoryRepository.getAllItems !== 'function') {
      throw new ValidationError('CheckLowStockUseCase requiere un inventoryRepository con getAllItems().');
    }
    this.inventoryRepository = inventoryRepository;
    this.notificationService = notificationService;
  }

  /**
   * @returns {Promise<Array<InventoryItem>>}
   */
  async execute() {
    // 1. Obtener todos los items desde el puerto de repositorio
    const rawItems = await this.inventoryRepository.getAllItems();

    // 2. Asegurar que cada elemento sea una instancia de la entidad de dominio InventoryItem
    const domainItems = rawItems.map(item =>
      item instanceof InventoryItem
        ? item
        : new InventoryItem({
            id: item.id,
            name: item.name || item.nombre,
            quantity: item.quantity ?? item.stock_actual ?? 0,
            unit: item.unit || item.unidad_medida || 'unidad',
            minStock: item.minStock ?? item.punto_reorden ?? 0,
            cost: item.cost ?? 0
          })
    );

    // 3. Filtrar los que tengan stock bajo según la regla de negocio de la entidad
    const lowStockItems = domainItems.filter(item => item.isLowStock());

    // 4. Notificar a través del puerto de notificaciones si existen alertas
    if (
      lowStockItems.length > 0 &&
      this.notificationService &&
      typeof this.notificationService.notifyLowStock === 'function'
    ) {
      await this.notificationService.notifyLowStock(lowStockItems);
    }

    return lowStockItems;
  }
}

export default CheckLowStockUseCase;
