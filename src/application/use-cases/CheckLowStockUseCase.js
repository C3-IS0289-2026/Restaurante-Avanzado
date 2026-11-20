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
    // 1. Obtener todos los items
    const items = await this.inventoryRepository.getAllItems();

    // 2. Filtrar los que tengan stock bajo
    const lowStockItems = items.filter(item => item.isLowStock());

    // 3. Notificar (lógica que se desarrollará en próximos sprints)
    if (lowStockItems.length > 0) {
      await this.notificationService.notifyLowStock(lowStockItems);
    }

    return lowStockItems;
  }
}
