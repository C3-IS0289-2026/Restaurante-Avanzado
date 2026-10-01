export class CheckLowStockUseCase {
  constructor(inventoryRepository, notificationService) {
    this.inventoryRepository = inventoryRepository;
    this.notificationService = notificationService;
  }

  async execute() {
    // 1. Obtener todos los items
    const items = await this.inventoryRepository.getAllItems();
    
    // 2. Filtrar los que tengan stock bajo
    const lowStockItems = items.filter(item => item.isLowStock());
    
    // 3. Notificar (lógica que se desarrollará en próximos sprints)
    if (lowStockItems.length > 0) {
      this.notificationService.notifyLowStock(lowStockItems);
    }

    return lowStockItems;
  }
}
