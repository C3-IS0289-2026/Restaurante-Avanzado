# Informe Consolidado: Revisión, Priorización y Calidad INVEST de Historias de Usuario

**Asignatura:** IS0289 - 201 - PROGRAMACIÓN AVANZADA  
**Organización GitHub:** [C3-IS0289-2026](https://github.com/C3-IS0289-2026)  
**Repositorio:** [Restaurante-Avanzado](https://github.com/C3-IS0289-2026/Restaurante-Avanzado)  
**Proyecto Kanban:** [GestionRestauranteKanban (Project #2)](https://github.com/orgs/C3-IS0289-2026/projects/2)  
**Fecha:** Octubre 2026  

---

## 1. Contexto y Objetivos de la Revisión

El presente documento consolida la auditoría, depuración, reasignación y fundamentación técnica con enfoque **INVEST** realizada sobre el repositorio y el tablero de gestión del proyecto *Restaurante Avanzado*.

### Objetivos Clave Ejecutados:
1. **Verificación de Estudiantes y Cuentas GitHub:** Validación de colaboradores activos, aceptación de invitaciones y depuración de notas de asignación.
2. **Corrección de Asignaciones y Actualización de Cuentas:** Migración completa de referencias del usuario anterior `@Bree-zzz` al usuario activo `@Bree-zzz1`, eliminando leyendas de espera donde la asignación ya está en firme.
3. **Resolución de Cruces de Módulos y Diagnóstico del Backlog:** Auditoría de historias base duplicadas y tareas atómicas generadas.
4. **Fundamentación Técnica INVEST:** Análisis y enriquecimiento de los Criterios de Aceptación para garantizar historias independientes, negociables, valiosas, estimables, pequeñas y testeables.
5. **Priorización y Hoja de Ruta (Plan de Sprints):** Estructuración de 5 sprints balanceados con dependencias técnicas claras.

---

## 2. Equipo de Estudiantes y Estado de Asignación

| Estudiante | Código Estudiantil | Usuario GitHub | Estado en Repositorio | Asignación Módulos / HUs |
| :--- | :---: | :---: | :---: | :--- |
| **CRUZ BUITRAGO CRISTIAN DAVID** | 202610009615 | `@DouCiv` | Colaborador Aceptado | **Salón & Mesas:** HU-001 (Mapa de Mesas), HU-002 (Apertura de Mesa) |
| **MURILLO GUERRERO JUAN FELIPPE** | 202610067615 | `@DiaxJF` | Invitación Pendiente (#338583868) | **Cuentas & Caja:** HU-003 (Toma de Pedidos / Detalle de Cuenta), HU-004 (Cierre de Cuenta) |
| **OCAMPO RODRIGUEZ JUAN PABLO** | 202610019615 | `@juanpaocampo45` | Colaborador Aceptado | **Cocina (KDS):** HU-005 (Pantalla KDS), HU-006 (Estado de Preparación) |
| **DÍAZ LÓPEZ JUAN JOSÉ** | 202610018615 | `@juan4298jose` | Colaborador Aceptado | **Notificaciones & Menú:** HU-007 (Notificación Listo), HU-008 (Gestión Menú) |
| **MORALES BOTÍA BRISA JULIANA** | 202610037615 | `@Bree-zzz1` | Colaboradora Aceptada | **Recetas & Stock:** HU-009 (Recetas), HU-010 (Descuento Automático) |
| **BOTIA CONTRERAS LARRY DAVID** | 202617503615 | `@David3560` | Colaborador Aceptado | **Alertas & Apoyo Inventario:** HU-011 (Alerta Stock Mínimo), Apoyo en HU-010.3 |

### Acciones Realizadas sobre Asignaciones:
- Se actualizó la cuenta de GitHub de Brisa Morales de `@Bree-zzz` a `@Bree-zzz1` tanto en los títulos y cuerpos de las issues de GitHub como en los documentos markdown del repositorio.
- Se eliminó el comentario `*(Nota: A la espera de que el estudiante acepte la invitación al repositorio para asignación directa)*` en todas las issues de los estudiantes que ya aceptaron y tienen asignación directa (`@DouCiv`, `@juanpaocampo45`, `@juan4298jose`, `@Bree-zzz1`, `@David3560`).
- Se mantuvo la nota informativa únicamente para `@DiaxJF`, dado que su invitación formal se encuentra pendiente por aceptar.

---

## 3. Arquitectura del Backlog y Diagnóstico de Cruces

### Estructura de Issues en el Repositorio
El repositorio cuenta con 94 issues creados que responden a dos momentos de diseño ágil:
1. **Issues #1 a #30 (Historias Base Originales):** Fueron generadas inicialmente con asignaciones tentativas. Se detectaron duplicidades entre las primeras 30 issues debido a reasignaciones históricas (ej. HU-001 estaba asignada tanto a `@DouCiv`, `@juanpaocampo45` como a `@Bree-zzz`).
2. **Issues #31 a #94 (Historias Atomizadas para Sprints):** Corresponden a las tareas técnicas desglosadas (4 tareas por cada historia madre: 4 x 11 = 44 tareas operativas reales).
3. **Pares Duplicados en Issues Atomizadas (#39-#58 vs #67-#94):** Durante la carga masiva automatizada previa se crearon réplicas exactas de 20 tareas atómicas.
   - En el tablero Kanban se identificaron activas las tareas principales.
   - Se recomienda utilizar la serie **#31 a #38** (HU-001, HU-002) y **#59 a #94** como el flujo oficial de ejecución de sprints, manteniendo cerrado o referenciado el bloque previo.

### Mapeo Canónico de Responsabilidad por Módulo

Para evitar cruces de código en ramas Git y conflictos en pull requests, se estableció la matriz de frontera modular:

```
[ Frontend: Salón / Mesas ]  --> @DouCiv (HU-001, HU-002)
          │ (Mesa Abierta)
          ▼
[ Frontend/API: Pedidos ]    --> @DiaxJF (HU-003, HU-004)
          │ (Detalle de Cuenta Enviado)
          ▼
[ Frontend/Socket: KDS ]     --> @juanpaocampo45 (HU-005, HU-006)
          │ (Platillo Listo)
          ▼
[ Mensajería & Menú CRUD ]   --> @juan4298jose (HU-007, HU-008)
          │ (Descuento de Insumos)
          ▼
[ Backing: Recetas & Stock ] --> @Bree-zzz1 (HU-009, HU-010)
          │ (Control de Umbrales)
          ▼
[ Alertas & Analítica ]      --> @David3560 (HU-011, HU-010.3)
```

---

## 4. Fundamentación INVEST y Criterios de Aceptación

Para que las historias de usuario guíen efectivamente el desarrollo sin ambigüedades técnicas, deben satisfacer las 6 propiedades de la metodología **INVEST**:

1. **I - Independent (Independiente):** La historia puede abordarse y desplegarse sin bloqueos duros entre desarrolladores mediante contratos de interfaz o mocks iniciales.
2. **N - Negotiable (Negociable):** Permite acordar detalles finos de UX/UI durante el sprint refinement sin alterar el objetivo de negocio.
3. **V - Valuable (Valiosa):** Aporta una funcionalidad visible al usuario final (mesero, cocinero, cajero, administrador).
4. **E - Estimable (Estimable):** Tamaño y alcance suficientemente delimitados para que el estudiante evalúe complejidad y tiempo de entrega.
5. **S - Small (Pequeña):** Fragmentada en tareas atómicas con duración máxima de 1 a 2 semanas por sprint.
6. **T - Testable (Testeable):** Cuenta con criterios de aceptación verificables mediante pruebas funcionales, unitarias o flujos de usuario (Dado/Cuando/Entonces).

---

### Detalle de las 11 Historias de Usuario con Criterios INVEST

#### HU-001: Visualización del Mapa de Mesas
* **Asignado a:** `@DouCiv` (CRUZ BUITRAGO CRISTIAN DAVID)
* **Historia:** *Como Mesero, quiero ver un mapa visual del restaurante con el estado actual de cada mesa (Libre, Ocupada, Reservada), para saber de forma rápida dónde puedo ubicar a los nuevos clientes que van llegando.*
* **Criterios de Aceptación (INVEST):**
  - **I:** Desacoplado; consume un endpoint o estado local inicial de mesas (`/api/tables`).
  - **N:** La disposición espacial (rejilla CSS vs. drag-and-drop) es adaptable.
  - **V:** Reduce tiempos de asignación de mesas y previene sobreventas en salón.
  - **E:** Estimación baja (UI estática + reactividad con websockets/polling).
  - **S:** Atomizada en 4 tareas (UI base, sincronización backend, semáforo de colores, responsividad).
  - **T (Pruebas):**
    - *Dado* que el mesero carga la página, *entonces* debe renderizar todas las mesas configuradas en la base de datos con su identificador visible.
    - *Dado* que una mesa cambia de estado en BD a 'Ocupada', *entonces* el color de la tarjeta debe cambiar a rojo en menos de 2 segundos sin recargar manualmente.

#### HU-002: Apertura de Mesa
* **Asignado a:** `@DouCiv` (CRUZ BUITRAGO CRISTIAN DAVID)
* **Historia:** *Como Mesero, quiero seleccionar una mesa libre y abrir una nueva cuenta indicando el número de comensales, para comenzar a tomar el pedido de los clientes y registrar su consumo.*
* **Criterios de Aceptación (INVEST):**
  - **I:** Se conecta al estado de HU-001 pero gestiona su propia transacción en BD.
  - **N:** Los campos del modal (mesero fijo vs. selector de mesero) son configurables.
  - **V:** Registra el inicio formal del servicio en el ciclo de vida del restaurante.
  - **E:** Estimación media (validaciones de concurrencia y mutación de estado).
  - **S:** Dividida en formulario modal, registro de hora/mesero, validación de colisión y actualización reactiva.
  - **T (Pruebas):**
    - *Dado* que una mesa está en verde (Libre), *cuando* el mesero pulsa "Abrir" e ingresa comensales (> 0), *entonces* la mesa pasa a "Ocupada" y se crea un registro de orden activa.
    - *Dado* que dos meseros intentan abrir la misma mesa en paralelo, *entonces* el segundo recibe un error 409 (Conflicto / Mesa ya ocupada).

#### HU-003: Toma de Pedidos (Detalle de Cuenta)
* **Asignado a:** `@DiaxJF` (MURILLO GUERRERO JUAN FELIPPE)
* **Historia:** *Como Mesero, quiero agregar platillos del menú a la cuenta de una mesa abierta, para poder enviar la orden a cocina y registrar el consumo de los clientes.*
* **Criterios de Aceptación (INVEST):**
  - **I:** Se apoya en la mesa abierta generada por HU-002 y el catálogo provisto por HU-008.
  - **N:** La agrupación por pestañas o categorías en el carrito puede adaptarse al diseño.
  - **V:** Núcleo operativo del negocio que comunica salón con cocina.
  - **E:** Estimación media/alta (manejo de estado en carrito y payload complejo).
  - **S:** Atomizada en catálogo por categoría, carrito interactivo, notas/modificadores y emisión al backend.
  - **T (Pruebas):**
    - *Dado* un platillo seleccionado, *cuando* se presiona "+", *entonces* se agrega a la lista temporal de la mesa con subtotal recalculado en tiempo real.
    - *Dado* un ítem con notas especiales ("sin cebolla"), *cuando* se confirma el pedido, *entonces* el detalle de cuenta (`detalle_cuenta`) se persiste con los modificadores intactos y estado "Enviado a Cocina" (`estado_detalle_cuenta`).

#### HU-004: Cierre de Cuenta y Pago
* **Asignado a:** `@DiaxJF` (MURILLO GUERRERO JUAN FELIPPE)
* **Historia:** *Como Cajero / Mesero, quiero visualizar el total consumido por una mesa y procesar su pago, para cobrar correctamente a los clientes y liberar la mesa para nuevos comensales.*
* **Criterios de Aceptación (INVEST):**
  - **I:** Depende únicamente de una cuenta activa existente (`cuenta`).
  - **N:** Los métodos de pago admitidos (Efectivo, Tarjeta, Mixto) se ajustan al MVP.
  - **V:** Cierre financiero del servicio y rotación de mesas.
  - **E:** Estimación media (cálculo de impuestos, propina opcional y división de cuentas).
  - **S:** Segmentada en resumen/desglose, división de cuenta, registro de medio de pago y liberación de mesa.
  - **T (Pruebas):**
    - *Dado* el pedido de la mesa, *entonces* la suma de ítems + IVA coincide exactamente con el monto final.
    - *Dado* un pago confirmado con éxito, *entonces* la cuenta (`cuenta`) pasa a 'Cerrada' (`estado_cuenta`) y la mesa correspondiente cambia inmediatamente a estado 'Libre'.

#### HU-005: Pantalla de Recepción de Pedidos / Detalles de Cuenta (KDS)
* **Asignado a:** `@juanpaocampo45` (OCAMPO RODRIGUEZ JUAN PABLO)
* **Historia:** *Como Cocinero, quiero ver una pantalla con las órdenes entrantes organizadas por tiempo de llegada, para saber qué platillos debo preparar a continuación y optimizar los tiempos.*
* **Criterios de Aceptación (INVEST):**
  - **I:** Escucha eventos de nuevas órdenes sin requerir interacción directa con la UI del mesero.
  - **N:** El layout visual (columnas Kanban vs. cuadrícula de tarjetas) es flexible.
  - **V:** Garantiza la sincronización inmediata del área de cocina, reduciendo tiempos muertos.
  - **E:** Estimación media (diseño de componentes en tiempo real).
  - **S:** Atomizada en columnas KDS, listeners en tiempo real, detalles/notas y ordenamiento por antigüedad.
  - **T (Pruebas):**
    - *Dado* un nuevo pedido enviado por mesero, *entonces* aparece un nuevo ticket en la columna "Pendiente" sin recarga.
    - *Dado* varios tickets activos, *entonces* el ticket más antiguo (mayor tiempo de espera) se ubica en primera posición y cambia a color de advertencia si supera 15 minutos.

#### HU-006: Actualización de Estado de Preparación (`estado_detalle_cuenta`)
* **Asignado a:** `@juanpaocampo45` (OCAMPO RODRIGUEZ JUAN PABLO)
* **Historia:** *Como Cocinero, quiero cambiar el estado de los platillos a "En Preparación" y luego a "Listo para Servir", para notificar al salón que la orden avanza o ya puede ser recogida.*
* **Criterios de Aceptación (INVEST):**
  - **I:** Opera sobre el ticket cargado en la vista KDS.
  - **N:** Botones individuales por platillo vs. botón por cuenta completa.
  - **V:** Visibilidad del flujo de producción para todo el personal.
  - **E:** Estimación media (validación de máquina de estados).
  - **S:** Botones de cambio de estado, endpoints de actualización, reactividad KDS y validaciones de estados prohibidos.
  - **T (Pruebas):**
    - *Dado* un ticket en "Pendiente", *cuando* el cocinero pulsa "Preparar", *entonces* se traslada a "En Preparación".
    - *Dado* un ticket en "Listo para Servir", *entonces* el sistema bloquea cualquier reversión inválida a "Pendiente".

#### HU-007: Notificación de Platillo Listo
* **Asignado a:** `@juan4298jose` (DÍAZ LÓPEZ JUAN JOSÉ)
* **Historia:** *Como Mesero, quiero recibir una alerta cuando la comida de mis mesas esté "Lista para Servir", para recoger los platillos de la cocina y entregarlos calientes a los clientes.*
* **Criterios de Aceptación (INVEST):**
  - **I:** Se activa mediante el evento emitido al finalizar HU-006.
  - **N:** Canal de notificación (Toast en navegador, insignia numérica o alerta sonora).
  - **V:** Evita enfriamiento de la comida y reclamos de clientes.
  - **E:** Estimación media (servicio de eventos pub/sub o polling eficiente).
  - **S:** Servicio base de eventos, UI de badge/campana, acción de marcar como entregado y vínculo con vista de mesas.
  - **T (Pruebas):**
    - *Dado* que cocina marca un platillo como "Listo", *entonces* el mesero asignado a esa mesa recibe un Toast/alerta visual indicando número de mesa y platillos.
    - *Dado* que el mesero pulsa "Entregado", *entonces* la notificación desaparece del listado de pendientes.

#### HU-008: Gestión de Menú (CRUD)
* **Asignado a:** `@juan4298jose` (DÍAZ LÓPEZ JUAN JOSÉ)
* **Historia:** *Como Administrador, quiero crear, editar, leer y eliminar platillos del menú, para mantener la oferta gastronómica y precios del restaurante actualizados.*
* **Criterios de Aceptación (INVEST):**
  - **I:** Completamente autónomo; administra la tabla maestra `menu_items`.
  - **N:** Carga de imágenes (URL externa vs. carga de archivo local).
  - **V:** Permite la parametrización de precios y catálogo del negocio.
  - **E:** Estimación estándar (operaciones CRUD típicas con formularios validados).
  - **S:** Formulario de creación, tabla/listado con filtros, modal de edición y soft delete.
  - **T (Pruebas):**
    - *Dado* un nuevo platillo ingresado con nombre, precio > 0 y categoría, *entonces* se guarda y figura en el menú.
    - *Dado* un platillo eliminado mediante "Soft Delete", *entonces* su bandera `activo` pasa a `false` y ya no se lista para toma de pedidos, pero no corrompe cuentas históricas.

#### HU-009: Receta de Platillos
* **Asignado a:** `@Bree-zzz1` (MORALES BOTÍA BRISA JULIANA)
* **Historia:** *Como Administrador / Chef, quiero asociar una receta con ingredientes y cantidades específicas a cada platillo, para vincular correctamente las ventas con el control de inventario.*
* **Criterios de Aceptación (INVEST):**
  - **I:** Enlace entre `plato` e `ingrediente` mediante tabla intermedia `receta_ingrediente`.
  - **N:** Unidades métricas aceptadas (gramos, mililitros, unidades).
  - **V:** Pilar fundamental para el costeo de platos y reducción automática de inventario.
  - **E:** Estimación media (manejo de relaciones 1:N y conversiones métricas).
  - **S:** Modelo de receta, interfaz de adición de insumos, visor para cocina y cálculo de costo teórico.
  - **T (Pruebas):**
    - *Dado* un platillo, *cuando* se le asocian 3 ingredientes existentes con sus gramos correspondientes, *entonces* la receta se persiste y suma el costo total de los insumos.
    - *Dado* un intento de agregar un ingrediente inexistente, *entonces* la interfaz rechaza la operación con un mensaje de advertencia.

#### HU-010: Descuento Automático de Inventario
* **Asignado a:** `@Bree-zzz1` (MORALES BOTÍA BRISA JULIANA) (con apoyo en HU-010.3 de `@David3560`)
* **Historia:** *Como Sistema, quiero descontar automáticamente los ingredientes del inventario cuando una orden avanza de estado, para mantener las existencias físicas sincronizadas con el software sin intervención manual.*
* **Criterios de Aceptación (INVEST):**
  - **I:** Lógica de backend vinculada a eventos de cuenta / detalle de cuenta (`ORDER_CONFIRMED`).
  - **N:** Momento del descuento (al enviar a cocina vs. al cerrar cuenta).
  - **V:** Elimina descuadres manuales de bodega y mermas no detectadas.
  - **E:** Estimación alta (transaccionalidad ACID para evitar bloqueos y condiciones de carrera).
  - **S:** Enlace cuenta-receta, cálculo deductivo de stock, manejo de quiebres de stock y auditoría de movimientos.
  - **T (Pruebas):**
    - *Dado* un plato vendido que requiere 200g de carne, *cuando* se confirma la orden, *entonces* el stock de carne disminuye exactamente 200g y se genera un registro en `inventory_movements`.
    - *Dado* que el stock disponible es menor al requerido, *entonces* se dispara la excepción de stock insuficiente controlada por HU-010.3.

#### HU-011: Alerta de Stock Mínimo
* **Asignado a:** `@David3560` (BOTIA CONTRERAS LARRY DAVID)
* **Historia:** *Como Administrador / Gerente, quiero ver una alerta visual cuando un ingrediente caiga por debajo de su punto de reorden, para realizar las compras con tiempo y evitar quedarnos sin insumos.*
* **Criterios de Aceptación (INVEST):**
  - **I:** Consulta el estado actual de la tabla de inventario comparando existencias vs. umbral.
  - **N:** Vía de aviso (indicador en dashboard vs. notificación dirigida a compras).
  - **V:** Previene desabastecimiento en cocina durante horas pico.
  - **E:** Estimación media (triggers/consultas de corte y vistas resumen).
  - **S:** Campo stock mínimo, disparador de evaluación, widget de dashboard y alertas al administrador.
  - **T (Pruebas):**
    - *Dado* un ingrediente con stock actual = 1.5 kg y stock mínimo = 2.0 kg, *entonces* se resalta en rojo en la tabla de inventario y se lista en el panel de alertas urgentes.
    - *Dado* un reabastecimiento registrado que eleva el stock a 5.0 kg, *entonces* la alerta se apaga automáticamente.

---

## 5. Plan de Sprints y Distribución Equitativa

Se definió un cronograma de **5 Sprints** iterativos de 8 a 9 tareas atómicas cada uno. La asignación balanceada garantiza que cada estudiante desarrolle entre 1 y 2 tareas por sprint:

```
┌───────────────────────────────────────────────────────────────────────────┐
│ SPRINT 1: Bases, UI Inicial y CRUD (9 tareas)                             │
│ • DouCiv:       HU-001.1 (UI Mesas), HU-002.1 (Modal Apertura)           │
│ • DiaxJF:       HU-003.1 (UI Menú por Categorías)                         │
│ • juanpaocampo: HU-005.1 (UI KDS Columnas)                                │
│ • juan4298jose: HU-008.1 (Form Platillo), HU-008.2 (Listado Platillos)    │
│ • Bree-zzz1:    HU-009.1 (Modelo Receta), HU-009.2 (UI Insumos Receta)    │
│ • David3560:    HU-011.1 (Definición Stock Mínimo)                        │
├───────────────────────────────────────────────────────────────────────────┤
│ SPRINT 2: Lógica Backend Inicial y Conexiones (9 tareas)                  │
│ • DouCiv:       HU-001.2 (Conexión Mesas-BD), HU-002.2 (Lógica Apertura)  │
│ • DiaxJF:       HU-003.2 (Carrito Pedidos), HU-003.3 (Notas/Modificadores)│
│ • juanpaocampo: HU-006.1 (Botones Estado Preparación/Listo)               │
│ • juan4298jose: HU-008.3 (Edición Platillo), HU-008.4 (Soft Delete)       │
│ • Bree-zzz1:    HU-009.3 (Visor de Recetas para Cocina)                   │
│ • David3560:    HU-011.2 (Trigger/Evaluador de Inventario)                │
├───────────────────────────────────────────────────────────────────────────┤
│ SPRINT 3: Tiempo Real, KDS y Cuentas / Pedidos (9 tareas)                 │
│ • DouCiv:       HU-001.3 (Semáforo Mesas), HU-002.3 (Validación Ocupada)  │
│ • DiaxJF:       HU-003.4 (Envío Detalle de Cuenta a KDS)                  │
│ • juanpaocampo: HU-005.2 (Tiempo Real KDS), HU-006.2 (Backend Estados)    │
│ • juan4298jose: HU-007.1 (Servicio Eventos Notificaciones)               │
│ • Bree-zzz1:    HU-009.4 (Cálculo Costos), HU-010.1 (Enlace Cuenta-Stock) │
│ • David3560:    HU-011.3 (Dashboard de Insumos Críticos)                  │
├───────────────────────────────────────────────────────────────────────────┤
│ SPRINT 4: Cierre, Notificaciones e Inventario (9 tareas)                  │
│ • DouCiv:       HU-001.4 (Diseño Responsivo Mesas)                        │
│ • DiaxJF:       HU-004.1 (Resumen Cuenta), HU-004.2 (División Cuenta)     │
│ • juanpaocampo: HU-005.3 (Detalle Ticket), HU-006.3 (Sincronía KDS)       │
│ • juan4298jose: HU-007.2 (UI Notificaciones), HU-007.3 (Acción Entregado)│
│ • Bree-zzz1:    HU-010.2 (Descuento Automático de Stock)                  │
│ • David3560:    HU-010.3 (Manejo de Quiebre de Stock - Apoyo Inventario)  │
├───────────────────────────────────────────────────────────────────────────┤
│ SPRINT 5: Refinamiento Final y Consolidación (8 tareas)                   │
│ • DouCiv:       HU-002.4 (Integración Flujo Mesa Abierta)                 │
│ • DiaxJF:       HU-004.3 (Registro Pago), HU-004.4 (Liberación Mesa)      │
│ • juanpaocampo: HU-005.4 (Orden Cronológico), HU-006.4 (Bloqueo Inválidos)│
│ • juan4298jose: HU-007.4 (Vínculo Notificación-Mesas)                     │
│ • Bree-zzz1:    HU-010.4 (Historial de Movimientos de Inventario)         │
│ • David3560:    HU-011.4 (Alertas y Reportes para Compras)                │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Recomendaciones Técnicas para el Arranque

1. **Aceptación de Invitación Pendiente:** Juan Felippe Murillo Guerrero (`@DiaxJF`) debe ingresar a su correo institucional o a [github.com/C3-IS0289-2026/Restaurante-Avanzado/invitations](https://github.com/C3-IS0289-2026/Restaurante-Avanzado/invitations) para aceptar la invitación como colaborador del repositorio.
2. **Estrategia de Ramas Git (GitFlow):** Cada estudiante debe ramificar a partir de la rama de su sprint correspondiente (ej. `feature/HU-001.1-ui-mesas`), garantizando revisiones cruzadas de código mediante Pull Requests.
3. **Manejo de Base de Datos y Variables de Entorno:**
   - Todo estudiante debe duplicar `.env.example` en un archivo local `.env` configurando las credenciales de PostgreSQL.
   - Ejecutar los scripts de respaldo situados en `Documentos/SQL_Script/setup_database_2026-10-07.sql` para tener la estructura y datos semilla alineados.
4. **Validación Continua en Tablero:** Mover las tarjetas en el tablero de Project #2 conforme avance el ciclo de desarrollo (`Todo` -> `In Progress` -> `In Review` -> `Done`).
