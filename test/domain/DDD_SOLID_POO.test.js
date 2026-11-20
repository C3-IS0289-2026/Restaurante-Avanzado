import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { Entity } from '../../src/domain/entities/Entity.js';
import { Ingredient } from '../../src/domain/entities/Ingredient.js';
import { InventoryItem } from '../../src/domain/entities/InventoryItem.js';
import { Recipe } from '../../src/domain/entities/Recipe.js';
import { Cuenta, ESTADOS_CUENTA } from '../../src/domain/entities/Cuenta.js';
import { Solicitud, DetalleCuenta, ESTADOS_SOLICITUD, ESTADOS_DETALLE_CUENTA } from '../../src/domain/entities/Solicitud.js';
import { EstadoSolicitud, EstadoDetalleCuenta, EstadoCuenta, Cantidad, Money } from '../../src/domain/value-objects/index.js';
import {
  DomainError,
  ValidationError,
  InvalidStateTransitionError,
  EntityNotFoundError,
  BusinessRuleError
} from '../../src/domain/exceptions/DomainErrors.js';
import { IRepository, IInventoryRepository, INotificacionPort } from '../../src/domain/repositories/contracts.js';
import { CheckLowStockUseCase } from '../../src/application/use-cases/CheckLowStockUseCase.js';
import { BaseService } from '../../src/infrastructure/services/BaseService.js';
import { UsuarioService } from '../../src/infrastructure/services/UsuarioService.js';
import { CuentaService } from '../../src/infrastructure/services/CuentaService.js';
import { BaseComponent } from '../../src/presentation/components/BaseComponent.js';
import { DishCard } from '../../src/presentation/components/DishCard.js';
import { KdsPage } from '../../src/presentation/pages/KdsPage.js';

test('DDD - Regla de Dependencia: domain y application no importan de infrastructure ni presentation', () => {
  const checkDirImports = (dirPath, forbiddenPatterns) => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        checkDirImports(fullPath, forbiddenPatterns);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        // Ignorar comentarios JSDoc y evaluar sentencias import/from reales
        const importLines = content
          .split('\n')
          .filter(line => /^\s*(import|export)\b/.test(line));
        for (const line of importLines) {
          for (const pattern of forbiddenPatterns) {
            assert.equal(
              pattern.test(line),
              false,
              `Violación de capa DDD en ${fullPath}: "${line.trim()}"`
            );
          }
        }
      }
    }
  };

  checkDirImports(path.resolve('src/domain'), [
    /application/,
    /infrastructure/,
    /presentation/
  ]);

  checkDirImports(path.resolve('src/application'), [
    /infrastructure/,
    /presentation/
  ]);
});

test('DDD & POO - Value Objects son inmutables y comparan por valor', () => {
  const estado1 = new EstadoSolicitud(ESTADOS_SOLICITUD.ENVIADO_A_COCINA);
  const estado2 = new EstadoSolicitud(ESTADOS_SOLICITUD.ENVIADO_A_COCINA);
  assert.ok(Object.isFrozen(estado1));
  assert.equal(estado1.equals(estado2), true);

  const estadoAvanzado = estado1.avanzar(10);
  assert.equal(estado1.value, ESTADOS_SOLICITUD.ENVIADO_A_COCINA); // Inmutable
  assert.equal(estadoAvanzado.value, ESTADOS_SOLICITUD.EN_PREPARACION);

  const cant1 = new Cantidad(3, { onlyInteger: true });
  const cant2 = cant1.sumar(2);
  assert.ok(Object.isFrozen(cant1));
  assert.equal(cant1.value, 3);
  assert.equal(cant2.value, 5);

  const precio = new Money(25000);
  const totalLinea = precio.multiply(2);
  const impuesto = totalLinea.calculateTax(0.08);
  assert.ok(Object.isFrozen(precio));
  assert.equal(totalLinea.amount, 50000);
  assert.equal(impuesto.amount, 4000);
});

test('DDD & POO - Abstracción e Identidad de Entidades (Entity, Ingredient, InventoryItem, Recipe)', () => {
  // Entity es clase abstracta
  assert.throws(() => new Entity(1), TypeError);
  assert.throws(() => new IRepository(), TypeError);
  assert.throws(() => new IInventoryRepository(), TypeError);
  assert.throws(() => new INotificacionPort(), TypeError);
  assert.throws(() => new BaseComponent(), TypeError);

  // Igualdad por identidad (id) y clase
  const ing1 = new Ingredient({ id: 5, name: 'Tomate', unitOfMeasure: 'gr' });
  const ing2 = new Ingredient({ id: 5, name: 'Tomate Chonto', unitOfMeasure: 'kg' });
  const ing3 = new Ingredient({ id: 6, name: 'Tomate', unitOfMeasure: 'gr' });
  assert.equal(ing1.equals(ing2), true);
  assert.equal(ing1.equals(ing3), false);

  // InventoryItem encapsula reglas de stock
  const item = new InventoryItem({
    id: 1,
    name: 'Queso Mozzarella',
    quantity: 500,
    unit: 'gr',
    minStock: 200,
    cost: 12000
  });
  assert.equal(item.isLowStock(), false);
  item.consume(350);
  assert.equal(item.quantity, 150);
  assert.equal(item.isLowStock(), true);
  assert.throws(() => item.consume(200), BusinessRuleError);

  // Recipe encapsula colección de ingredientes y calcula porciones
  const recipe = new Recipe({ dishId: 10, instructions: 'Hornear por 15 min' });
  recipe.addIngredient(1, 150, 'gr');
  recipe.addIngredient(2, 50, 'ml');
  assert.equal(recipe.isValid(), true);
  assert.equal(recipe.ingredients.length, 2);

  // Copia defensiva (encapsulamiento)
  const copy = recipe.ingredients;
  copy.push({ ingredientId: 99, quantity: 10, unit: 'gr' });
  assert.equal(recipe.ingredients.length, 2);

  const reqs = recipe.calculateRequirementsForPortions(3);
  assert.equal(reqs[0].requiredQuantity, 450);
  assert.equal(reqs[1].requiredQuantity, 150);

  // Entidad Cuenta y Lenguaje Ubicuo (cuenta / detalle_cuenta / estado_detalle_cuenta)
  const cuenta = new Cuenta({ id: 10, mesa_id: 2, numero_comensales: 4 });
  assert.equal(cuenta.estado, ESTADOS_CUENTA.ABIERTA);
  cuenta.marcarPagada();
  assert.equal(cuenta.estado, ESTADOS_CUENTA.PAGADA);
  cuenta.cerrar();
  assert.equal(cuenta.estado, ESTADOS_CUENTA.CERRADA);
  assert.ok(cuenta.fecha_cierre instanceof Date);
  assert.equal(DetalleCuenta, Solicitud);
  assert.equal(EstadoDetalleCuenta, EstadoSolicitud);
  assert.equal(ESTADOS_DETALLE_CUENTA, ESTADOS_SOLICITUD);
});

test('SOLID - Polimorfismo de Excepciones de Dominio (OCP) y Sustitución de Liskov (LSP)', async () => {
  const err1 = new ValidationError('Dato inválido');
  const err2 = new InvalidStateTransitionError('Listo para Servir', 'En Preparación', ['Entregado']);
  const err3 = new EntityNotFoundError('Solicitud', 99);

  assert.ok(err1 instanceof DomainError);
  assert.ok(err2 instanceof DomainError);
  assert.ok(err3 instanceof DomainError);
  assert.equal(err1.httpStatus, 400);
  assert.equal(err2.httpStatus, 400);
  assert.equal(err3.httpStatus, 404);

  // Verificación LSP en UsuarioService.getById(id, client) y CuentaService.getAll({ where, limit })
  let capturedSql = '';
  let capturedParams = [];
  const fakeTxClient = {
    async query(sql, params) {
      capturedSql = sql;
      capturedParams = params;
      return { rows: [{ id: 1, nombre: 'Ana', rol: 'Mesero', credenciales_email: 'ana@test.com', activo: true }] };
    }
  };

  const usuarioService = new UsuarioService(fakeTxClient);
  assert.ok(usuarioService instanceof BaseService);
  assert.ok(usuarioService instanceof IRepository);

  // Llamada polimórfica estándar de BaseService: getById(id, client)
  const user = await usuarioService.getById(1, fakeTxClient);
  assert.equal(user.nombre, 'Ana');
  assert.equal(capturedSql.includes('credenciales_password'), false); // No filtró el cliente como includePassword=true

  // Llamada polimórfica estándar de BaseService: getAll({ where, limit, offset })
  const cuentaService = new CuentaService(fakeTxClient);
  await cuentaService.getAll({ where: { estado: 'Abierta' }, limit: 5, offset: 0 }, fakeTxClient);
  assert.ok(capturedSql.includes('c."estado" = $1'));
  assert.ok(capturedSql.includes('LIMIT $2'));
  assert.deepEqual(capturedParams, ['Abierta', 5, 0]);
});

test('SOLID - CheckLowStockUseCase con Inversión de Dependencias (DIP) y Segregación de Interfaces (ISP)', async () => {
  let notifiedItems = [];
  const mockInventoryRepo = {
    async getAllItems() {
      return [
        new InventoryItem({ id: 1, name: 'Harina', quantity: 5, unit: 'kg', minStock: 10 }),
        new InventoryItem({ id: 2, name: 'Aceite', quantity: 20, unit: 'lt', minStock: 5 })
      ];
    }
  };
  const mockNotificationPort = {
    async notifyLowStock(items) {
      notifiedItems = items;
    }
  };

  const useCase = new CheckLowStockUseCase(mockInventoryRepo, mockNotificationPort);
  const lowStock = await useCase.execute();

  assert.equal(lowStock.length, 1);
  assert.equal(lowStock[0].name, 'Harina');
  assert.equal(notifiedItems.length, 1);
});

test('POO - Herencia y Template Method en Componentes de Presentación', () => {
  const card = new DishCard({ id: 1, name: 'Ceviche', price: 28000, description: 'Pescado fresco' });
  const kdsPage = new KdsPage();

  assert.ok(card instanceof BaseComponent);
  assert.ok(kdsPage instanceof BaseComponent);

  const renderedCard = card.render();
  assert.ok(renderedCard.innerHTML.includes('Ceviche'));
  assert.ok(renderedCard.innerHTML.includes('$28000'));

  const renderedPage = kdsPage.render();
  assert.ok(renderedPage.innerHTML.includes('Pantalla de Cocina (KDS)'));
});
