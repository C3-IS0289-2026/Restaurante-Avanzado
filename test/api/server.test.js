import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../../src/infrastructure/api/server.js';

test('Servidor API - Health Check y Metadatos de Estados', async (t) => {
  const server = createServer();

  await new Promise((resolve) => {
    server.listen(0, resolve);
  });

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  t.after(() => {
    server.close();
  });

  // 1. Health check
  const healthRes = await fetch(`${baseUrl}/health`);
  assert.equal(healthRes.status, 200);
  const healthData = await healthRes.json();
  assert.equal(healthData.status, 'ok');
  assert.equal(healthData.module, 'Paso de Solicitudes y KDS');

  // 2. Metadatos de Estados y transiciones permitidas
  const estadosRes = await fetch(`${baseUrl}/api/solicitudes/estados`);
  assert.equal(estadosRes.status, 200);
  const estadosData = await estadosRes.json();
  assert.equal(estadosData.success, true);
  assert.ok(estadosData.estados.includes('Enviado a Cocina'));
  assert.ok(estadosData.estados.includes('En Preparación'));
  assert.ok(estadosData.estados.includes('Listo para Servir'));
  assert.ok(estadosData.estados.includes('Entregado'));
  assert.ok(estadosData.estados.includes('Cancelado'));
  assert.equal(estadosData.secuenciaPaso['Enviado a Cocina'], 'En Preparación');
  assert.equal(estadosData.secuenciaPaso['En Preparación'], 'Listo para Servir');
  assert.equal(estadosData.secuenciaPaso['Listo para Servir'], 'Entregado');

  // 3. Endpoint Ingredientes / Inventario (GET y POST)
  const mockCreatedIng = { id: 99, nombre: 'Pimentón', unidad_medida: 'gramos', stock_actual: 0, punto_reorden: 250 };
  const mockIngredienteService = {
    async getAll() {
      return [mockCreatedIng];
    },
    async create(data) {
      return { id: 100, ...data };
    }
  };

  const customContainer = {
    ...server.container,
    services: {
      ingredienteService: mockIngredienteService
    },
    ingredienteService: mockIngredienteService
  };

  const customServer = createServer({ container: customContainer });
  await new Promise((resolve) => customServer.listen(0, resolve));
  const customUrl = `http://127.0.0.1:${customServer.address().port}`;

  t.after(() => {
    customServer.close();
  });

  const getIngRes = await fetch(`${customUrl}/api/ingredientes`);
  assert.equal(getIngRes.status, 200);
  const getIngData = await getIngRes.json();
  assert.equal(getIngData.success, true);
  assert.equal(getIngData.count, 1);

  const postIngRes = await fetch(`${customUrl}/api/ingredientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: 'Pimentón',
      unidad_medida: 'gramos',
      punto_reorden: 250
    })
  });
  assert.equal(postIngRes.status, 201);
  const postIngData = await postIngRes.json();
  assert.equal(postIngData.success, true);
  assert.equal(postIngData.data.nombre, 'Pimentón');
  assert.equal(postIngData.data.punto_reorden, 250);

  // 4. Ruta no encontrada 404
  const notFoundRes = await fetch(`${baseUrl}/api/ruta-inexistente`);
  assert.equal(notFoundRes.status, 404);
});
