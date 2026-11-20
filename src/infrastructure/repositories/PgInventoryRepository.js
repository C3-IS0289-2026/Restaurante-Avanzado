import { InventoryItem } from '../../domain/entities/InventoryItem.js';
import { IngredienteService } from '../services/IngredienteService.js';

export class PgInventoryRepository {
  constructor(ingredienteService = new IngredienteService()) {
    this.ingredienteService = ingredienteService;
  }

  async getAllItems() {
    const rows = await this.ingredienteService.getAll();

    return rows.map(row => new InventoryItem({
      id: row.id,
      name: row.nombre,
      quantity: Number(row.stock_actual),
      unit: row.unidad_medida,
      minStock: Number(row.punto_reorden),
      cost: null
    }));
  }
}