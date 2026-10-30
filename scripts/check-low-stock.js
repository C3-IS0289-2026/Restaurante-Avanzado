import pool from '../src/infrastructure/database/connection.js';
import { PgInventoryRepository } from '../src/infrastructure/repositories/PgInventoryRepository.js';
import { StockNotificationService } from '../src/infrastructure/services/StockNotificationService.js';
import { CheckLowStockUseCase } from '../src/application/use-cases/CheckLowStockUseCase.js';

async function main() {
  const inventoryRepository = new PgInventoryRepository();
  const notificationService = new StockNotificationService();
  const useCase = new CheckLowStockUseCase(inventoryRepository, notificationService);

  const lowStockItems = await useCase.execute();

  console.log(`Insumos con stock bajo: ${lowStockItems.length}`);
  lowStockItems.forEach(item => {
    console.log(` - ${item.name}: ${item.quantity} ${item.unit} (mínimo ${item.minStock})`);
  });
}

main()
  .catch(error => {
    console.error('Error al evaluar el inventario:', error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());