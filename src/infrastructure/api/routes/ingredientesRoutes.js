import { defaultContainer } from '../../container.js';

/**
 * Enrutador de Ingredientes / Inventario
 * Expone endpoints REST para gestionar insumos e inventario
 */
export async function handleIngredientesRoutes(
  req,
  res,
  { path, method, query, body },
  container = defaultContainer
) {
  const ingredienteService = container.services?.ingredienteService || container.ingredienteService;

  if (!ingredienteService) {
    return null;
  }

  // GET /api/ingredientes -> Listar ingredientes
  if (method === 'GET' && (path === '/api/ingredientes' || path === '/api/inventory')) {
    const items = await ingredienteService.getAll();
    return sendJson(res, 200, { success: true, count: items.length, data: items });
  }

  // POST /api/ingredientes -> Crear ingrediente
  if (method === 'POST' && (path === '/api/ingredientes' || path === '/api/inventory')) {
    const { nombre, unidad_medida, stock_actual, punto_reorden } = body || {};

    if (!nombre || !nombre.trim()) {
      return sendJson(res, 400, {
        success: false,
        error: 'El nombre del ingrediente es obligatorio'
      });
    }

    if (!unidad_medida || !unidad_medida.trim()) {
      return sendJson(res, 400, {
        success: false,
        error: 'La unidad de medida es obligatoria'
      });
    }

    const nuevoIngrediente = await ingredienteService.create({
      nombre: nombre.trim(),
      unidad_medida: unidad_medida.trim(),
      stock_actual: stock_actual !== undefined ? Number(stock_actual) : 0,
      punto_reorden: punto_reorden !== undefined ? Number(punto_reorden) : 0
    });

    return sendJson(res, 201, {
      success: true,
      message: 'Ingrediente registrado correctamente',
      data: nuevoIngrediente
    });
  }

  return null;
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
  return true;
}

export default handleIngredientesRoutes;

