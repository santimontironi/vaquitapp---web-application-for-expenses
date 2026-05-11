---
name: VaquitApp Architecture Patterns
description: Key architectural decisions, endpoint patterns, and business logic in VaquitApp — use before updating documentation.
type: project
---

VaquitApp usa un patron Repository entre controllers y modelos de Mongoose. Nunca se llama a Mongoose directamente desde los controllers.

**Patron de middlewares en rutas protegidas:** `verifyToken` -> `validateObjectId(...)` -> `verifyRole` -> controller. `verifyRole` carga `req.group` y `req.member` (el GroupMember del usuario autenticado) para que los controllers puedan verificar roles sin hacer una query adicional.

**Roles:** se verifican en cada controller con `if (member.role !== 'admin')`, no en middleware separado. El middleware `verifyRole` solo verifica pertenencia al grupo, no el rol especifico.

**Soft delete de grupos:** se usa `active: false` en lugar de eliminar el documento. Las queries filtran por `{ active: true }`.

**Imagenes:** se suben con Multer en memoria (`memoryStorage`), se convierten a base64 y se suben a Cloudinary. La URL resultante se guarda en el modelo.

**Invitaciones:** JWT firmado con `{ groupId, email, role }`, expiracion 7 dias. El endpoint de aceptacion NO requiere autenticacion JWT de sesion, pero el frontend exige sesion activa via `VerifyAuth` antes de mostrar la pagina.

**Cookie de sesion:** `httpOnly: true`, `secure: true` en produccion, `sameSite: 'none'` en produccion y `'lax'` en desarrollo.

**Rutas de planes:** usan prefijo `/:idGroup/plans` (no `/groups/:idGroup/plans`). Esto es diferente al patron de los grupos.

**Rutas de gastos:** usan prefijo `/groups/:idGroup/plans/:idPlan/expenses`. Esto SI usa el prefijo /groups, a diferencia de planes.

**Estado del Plan:** `active` | `completed` | `cancelled`. Solo se puede marcar como `completed` via endpoint dedicado. No hay endpoint para cancelar todavia.

**Expense — COMPLETAMENTE IMPLEMENTADO (actualizado 2026-05-11):**
- Modelo: `description`, `amount`, `plan`, `paid_by`, `split_among`, `state` (active|completed), timestamps automaticos.
- Controladores, repositorios y rutas completos: createExpense, getExpensesByPlan, getAllExpensesByPlan, getBalances, completeExpense.
- Algoritmo de balance: greedy, O(n log n), minimiza cantidad de transacciones. Implementado en `expense.controller.js → getBalances`.
- Solo el `paid_by` o un admin puede marcar un gasto como `completed`. Los gastos completados son excluidos del calculo de balances (`state: 'active'` filter).

**Frontend — features recientes (2026-05-11):**
- `SideNavGroup` incluye boton "Abandonar grupo" con validacion: si el usuario es el unico admin, bloquea la accion con SweetAlert.
- `AllMembers` + `MemberItem`: admin puede dar rol de admin a un miembro (boton shield-plus) y eliminar miembros. El boton de dar admin NO aparece si el miembro ya es admin.
- `PlanHistory`: modal que muestra planes completados/cancelados con badge de estado.
- `ExpenseContext`: maneja `createExpense`, `getExpenses`, `completeExpense`.
- Componentes de gastos: `CreateExpense` (modal con form), `ExpenseCard`, `PaidByPicker`, `SplitPicker`.
- `PlanDetail`: muestra gastos activos del plan, boton "Agregar gasto" abre modal CreateExpense.

**Why:** el proyecto esta en desarrollo activo. La feature de gastos fue completada en la iteracion actual.

**How to apply:** al actualizar el README, documentar todos los endpoints de gastos como implementados y funcionales. El algoritmo de balance es el core de la aplicacion y merece documentacion detallada.
