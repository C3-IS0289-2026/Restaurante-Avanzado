import test from 'node:test';
import assert from 'node:assert/strict';
import { CrearSolicitudUseCase } from '../../src/application/use-cases/CrearSolicitudUseCase.js';
import { ESTADOS_SOLICITUD } from '../../src/domain/entities/Solicitud.js';

test('CrearSolicitudUseCase - Envío exitoso de pedido para una mesa abierta', async () => {
  let createdDetails = [];
  let totalsRecalculated = false;

  const mockCuentaService = {
    async getByMesaId(mesaId, soloAbiertas) {
      if (mesaId === 2) {
        return {
          id: 50,
          mesa_id: 2,
          mesa_numero: 'Mesa 2',
          mesero_id: 1,
          mesero_nombre: 'Andres Mesero',
          estado: 'Abierta'
        };
      }
      return null;
    },
    async getById(id) {
      return { id, mesa_id: 2, estado: 'Abierta' };
    },
    async recalcularTotales(id, impuesto) {
      totalsRecalculated = true;
      return { id, subtotal: 50000, impuestos: 4000, total: 54000 };
    }
  };

  const mockPlatoService = {
    async getById(id) {
      if (id === 1) return { id: 1, nombre: 'Pizza Margherita', precio: 25000, categoria: 'Platos Fuertes', activo: true };
      if (id === 2) return { id: 2, nombre: 'Limonada Natural', precio: 8000, categoria: 'Bebidas', activo: true };
      return null;
    }
  };

  const mockDetalleService = {
    async create(data) {
      const record = { id: createdDetails.length + 1, ...data };
      createdDetails.push(record);
      return record;
    }
  };

  const useCase = new CrearSolicitudUseCase({
    detalleCuentaService: mockDetalleService,
    cuentaService: mockCuentaService,
    platoService: mockPlatoService,
    mesaService: {}
  });

  const result = await useCase.execute({
    mesa_id: 2,
    items: [
      { plato_id: 1, cantidad: 2, notas: 'Bien tostada' },
      { plato_id: 2, cantidad: 1, notas: 'Con poco hielo' }
    ]
  });

  assert.equal(result.cuenta_id, 50);
  assert.equal(result.solicitudes.length, 2);
  assert.equal(createdDetails.length, 2);
  assert.equal(createdDetails[0].estado, ESTADOS_SOLICITUD.ENVIADO_A_COCINA);
  assert.equal(createdDetails[0].cantidad, 2);
  assert.equal(totalsRecalculated, true);
  assert.equal(result.solicitudes[0].plato_nombre, 'Pizza Margherita');
  assert.equal(result.solicitudes[0].mesa_numero, 'Mesa 2');
});

test('CrearSolicitudUseCase - Error cuando la mesa no tiene cuenta abierta', async () => {
  const mockCuentaService = {
    async getByMesaId() {
      return null;
    }
  };

  const useCase = new CrearSolicitudUseCase({
    detalleCuentaService: {},
    cuentaService: mockCuentaService,
    platoService: {},
    mesaService: {}
  });

  await assert.rejects(
    async () => {
      await useCase.execute({
        mesa_id: 99,
        items: [{ plato_id: 1, cantidad: 1 }]
      });
    },
    {
      message: /No existe una cuenta abierta para la mesa con ID 99/
    }
  );
});
