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

**Expense — COMPLETAMENTE IMPLEMENTADO:**
- Modelo: `description`, `amount`, `plan`, `paid_by`, `split_among`, `state` (active|completed), timestamps automaticos.
- Controladores, repositorios y rutas completos: createExpense, getExpensesByPlan, getAllExpensesByPlan, getBalances, deleteExpense, completeAllExpenses.
- El endpoint `PATCH .../expenses/:idExpense/complete` fue ELIMINADO. Ya no existe la funcionalidad de completar un gasto individual.
- `DELETE /groups/:idGroup/plans/:idPlan/expenses/:idExpense`: elimina un gasto permanentemente. Solo el `paid_by` o un admin del grupo puede hacerlo.
- `PATCH /groups/:idGroup/plans/:idPlan/expenses/complete-all`: marca todos los gastos con `state: 'active'` del plan como `completed` de una vez. Cualquier miembro del grupo puede ejecutarlo.
- Algoritmo de balance: greedy, O(n log n), minimiza cantidad de transacciones. Implementado en `expense.controller.js → getBalances`. Opera solo sobre gastos con `state: 'active'`.

**leaveGroup — validacion de unico admin:**
- Si el usuario que quiere salir tiene `role === 'admin'`, se cuenta cuantos admins tiene el grupo con `groupRepository.countAdminsByGroup(idGroup)`.
- Si solo hay 1 admin, retorna 400 con mensaje "Sos el único administrador. Promové otro miembro antes de salir."
- La validacion esta en el controller, no en el frontend (aunque el frontend tambien lo bloquea con SweetAlert).

**Frontend — componentes actuales (2026-05-27):**
- `SideNavGroup` incluye boton "Abandonar grupo" con validacion: si el usuario es el unico admin, bloquea la accion con SweetAlert.
- `AllMembers` + `MemberItem`: admin puede dar rol de admin a un miembro (boton shield-plus) y eliminar miembros. El boton de dar admin NO aparece si el miembro ya es admin.
- `MyGroupCard`: muestra la card del grupo con badge de rol, fecha de ingreso, imagen, y boton de edicion (solo si admin). Navega a `/grupo/:id`.
- `EditGroupModal`: modal para editar nombre, descripcion e imagen del grupo (solo admin).
- `PlanHistory`: modal que muestra planes completados/cancelados con badge de estado.
- `MemberOption`: componente de seleccion de miembros dentro del formulario de planes.
- `ExpenseContext`: maneja `createExpense`, `getExpenses`, `completeExpense`, `getBalanceData`.
- Componentes de gastos: `CreateExpense` (modal con form), `ExpenseCard`, `PaidByPicker`, `SplitPicker`.
- `PlanDetail`: muestra gastos activos del plan, sección de balances (transacciones), boton "Agregar gasto" abre modal CreateExpense.
- `HeaderDashboard`: header del dashboard con info del usuario.
- `VerifyAuth`: wrapper de rutas protegidas.

**Rutas del frontend (React Router):**
- `/` → Login
- `/registro` → Register
- `/confirmar/:token` → ConfirmUser
- `/inicio` → Dashboard (protegida)
- `/nuevo-grupo` → NewGroup (protegida)
- `/grupo/:idGroup` → Group (protegida)
- `/grupo/:idGroup/planes/:idPlan` → PlanDetail (protegida)
- `/invitacion/:token` → AcceptInvitation (protegida)

**Diagrama ERD:** https://excalidraw.com/#json=olVvOO9Dz1VEKoHjjlyeW,eFgPh8Lhb2sxh2lJpGRoVA
**Diagrama algoritmo de balances:** https://excalidraw.com/#json=qoECKn3HLa9Gni1yvAjYI,ygP05CRQwO31HcxBt1XcgQ

**Why:** el proyecto esta en desarrollo activo. La feature de gastos fue completada en una iteracion anterior. El README fue reescrito el 2026-05-27 con la estructura de componentes completa y los diagramas actualizados.

**How to apply:** al actualizar el README, documentar todos los endpoints de gastos como implementados y funcionales. El algoritmo de balance es el core de la aplicacion y merece documentacion detallada. Verificar siempre el arbol de componentes ya que se agregan componentes nuevos frecuentemente.
