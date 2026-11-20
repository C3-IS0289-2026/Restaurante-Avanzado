# Restaurante Avanzado

Proyecto de Clase (**IS0289 - Programación Avanzada**): Sistema de Gestión de Restaurante construido bajo principios de **Domain-Driven Design (DDD)**, **Arquitectura Limpia (Clean Architecture)**, **Principios SOLID** y **Programación Orientada a Objetos (POO)** utilizando Node.js, PostgreSQL, Vite y Vanilla JS.

---

## 📖 Lenguaje Ubicuo (Ubiquitous Language - DDD)

Para mantener una comunicación sin ambigüedades entre los expertos del dominio (personal de salón, cocina, caja y administración), el código fuente y el modelo relacional en PostgreSQL, se ha estandarizado el **Lenguaje Ubicuo** en torno a las entidades de facturación y preparación de pedidos:

| Concepto de Dominio | Entidad / Tipo en BD | Término Deprecado (Inconsistencia Previa) | Definición en el Dominio |
| :--- | :--- | :--- | :--- |
| **Cuenta** | Tabla `cuenta` | ~~`comanda`~~ | Cabecera financiera y operativa que se abre cuando una mesa es ocupada por comensales. Agrupa todos los consumos, calcula subtotal, impuestos y total, y registra apertura y cierre. |
| **Estado de Cuenta** | Enum `estado_cuenta` | ~~`estado_comanda`~~ | Ciclo de vida financiero de la cuenta: `'Abierta'`, `'Pagada'`, `'Cerrada'`. |
| **Detalle de Cuenta (Solicitud)** | Tabla `detalle_cuenta` | ~~`detalle_comanda`~~ | Cada línea de pedido (plato, cantidad y notas del cliente) asociada a una `cuenta` activa y enviada al tablero de cocina (KDS). |
| **Estado del Detalle de Cuenta** | Enum `estado_detalle_cuenta` | ~~`estado_detalle_comanda`~~ | Máquina de estados de preparación de un ítem en cocina: `'Enviado a Cocina'`, `'En Preparación'`, `'Listo para Servir'`, `'Entregado'`, `'Cancelado'`. |
| **Plato** | Tabla `plato` / Enum `categoria_plato` | ~~`platillo`~~ / ~~`categoria_platillo`~~ | Producto gastronómico ofertado en el menú del restaurante con su precio, categoría y receta asociada. |

### Trazabilidad Técnica de las Entidades Refactorizadas

1. **Entidad `cuenta`**:
   - **Llave Primaria:** `cuenta_pkey` (`id`)
   - **Secuencia:** `cuenta_id_seq`
   - **Enumerador de Estado:** `estado_cuenta` (`'Abierta'`, `'Pagada'`, `'Cerrada'`)
   - **Llaves Foráneas Salientes:**
     - `cuenta_mesa_id_fkey`: `mesa_id` → `mesa(id) ON DELETE RESTRICT`
     - `cuenta_mesero_id_fkey`: `mesero_id` → `usuario(id) ON DELETE SET NULL`
   - **Llaves Foráneas Entrantes (Referencias desde otras entidades):**
     - `detalle_cuenta_cuenta_id_fkey` en `detalle_cuenta(cuenta_id) ON DELETE CASCADE`
     - `pago_cuenta_id_fkey` en `pago(cuenta_id) ON DELETE RESTRICT`
     - `movimiento_inventario_cuenta_id_fkey` en `movimiento_inventario(cuenta_id) ON DELETE SET NULL`
   - **Capas de Código:** `Cuenta` ([`src/domain/entities/Cuenta.js`](src/domain/entities/Cuenta.js)), `EstadoCuenta` ([`src/domain/value-objects/EstadoCuenta.js`](src/domain/value-objects/EstadoCuenta.js)), `ICuentaRepository` ([`src/domain/repositories/contracts.js`](src/domain/repositories/contracts.js)), `CuentaService` ([`src/infrastructure/services/CuentaService.js`](src/infrastructure/services/CuentaService.js)).

2. **Entidad `detalle_cuenta` y Enumerador `estado_detalle_cuenta`**:
   - **Llave Primaria:** `detalle_cuenta_pkey` (`id`)
   - **Secuencia:** `detalle_cuenta_id_seq`
   - **Enumerador de Estado:** `estado_detalle_cuenta` (`'Enviado a Cocina'`, `'En Preparación'`, `'Listo para Servir'`, `'Entregado'`, `'Cancelado'`)
   - **Llaves Foráneas Salientes:**
     - `detalle_cuenta_cuenta_id_fkey`: `cuenta_id` → `cuenta(id) ON DELETE CASCADE`
     - `detalle_cuenta_plato_id_fkey`: `plato_id` → `plato(id) ON DELETE RESTRICT`
   - **Capas de Código:** `Solicitud` / `DetalleCuenta` ([`src/domain/entities/Solicitud.js`](src/domain/entities/Solicitud.js)), `EstadoSolicitud` / `EstadoDetalleCuenta` ([`src/domain/value-objects/EstadoSolicitud.js`](src/domain/value-objects/EstadoSolicitud.js)), `ISolicitudRepository` ([`src/domain/repositories/contracts.js`](src/domain/repositories/contracts.js)), `DetalleCuentaService` ([`src/infrastructure/services/DetalleCuentaService.js`](src/infrastructure/services/DetalleCuentaService.js)).

> Para mayor detalle sobre el glosario completo y las reglas de negocio del dominio, consulte [`Documentos/Lenguaje_Ubicuo.md`](Documentos/Lenguaje_Ubicuo.md) y [`src/infrastructure/services/README.md`](src/infrastructure/services/README.md).

---

## ⚙️ Configuración de Base de Datos Local

Cree un archivo `.env` en la raíz del proyecto (o utilice los valores por defecto configurados en [`src/infrastructure/database/connection.js`](src/infrastructure/database/connection.js)):

```env
# Configuración Base de Datos Local (por defecto)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurante-avanzado
DB_USER=postgres
DB_PASSWORD=123456789
```

### Creación e Inicialización de la Base de Datos

```bash
# 1. Crear la base de datos local
psql "postgresql://postgres:123456789@localhost:5432/postgres" -c 'CREATE DATABASE "restaurante-avanzado";'

# 2. Ejecutar el script de creación de enumeradores, tablas, secuencias y llaves
psql "postgresql://postgres:123456789@localhost:5432/restaurante-avanzado" -f Documentos/SQL_Script/Tables.sql
```

---

## 🚀 Scripts Disponibles

```bash
# Ejecutar suite de pruebas unitarias, de dominio (DDD/SOLID) e integración API
npm test

# Iniciar servidor backend HTTP (Puerto 3001 por defecto)
npm run server

# Iniciar entorno de desarrollo frontend con Vite
npm run dev
```
