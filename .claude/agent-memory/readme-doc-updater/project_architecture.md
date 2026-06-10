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

**Frontend — componentes actuales (2026-06-06):**
- `SideNavGroup` incluye boton "Abandonar grupo" con validacion: si el usuario es el unico admin, bloquea la accion con SweetAlert. Tiene version mobile (horizontal scrollable) y desktop (sidebar vertical sticky).
- `AllMembers` + `MemberItem`: admin puede dar rol de admin a un miembro y eliminar miembros. El boton de dar admin NO aparece si el miembro ya es admin.
- `MyGroupCard`: muestra la card del grupo con badge de rol, fecha de ingreso, imagen, y boton de edicion (solo si admin). Navega a `/grupo/:id`.
- `MyGroups`: grid responsivo de cards de grupos (1-3 columnas).
- `EditGroupModal`: modal para editar nombre, descripcion e imagen del grupo (solo admin).
- `PlanHistory`: modal que muestra planes completados/cancelados con badge de estado.
- `MemberOption`: componente de seleccion de miembros dentro del formulario de planes.
- `ExpenseContext`: maneja `createExpense`, `getExpenses`, `getCompletedExpenses`, `completeAllExpenses`, `deleteExpense`, `getBalanceData`. Estado separado: `expenses` (activos), `completedExpenses` (saldados), `balances` (transacciones).
- `getCompletedExpenses`: llama a `/expenses/all` y filtra localmente por `state === 'completed'`. Se muestra en seccion "Historial de gastos saldados" en PlanDetail.
- Componentes de gastos: `CreateExpense` (modal con form), `ExpenseCard` (con boton eliminar), `PaidByPicker`, `SplitPicker`.
- `PlanDetail`: muestra imagen del plan, detalles, miembros, gastos activos, seccion de balances, boton "Saldar todos los gastos" (con confirm SweetAlert), e historial de gastos saldados (solo lectura).
- `Dashboard`: muestra grupos si existen; si no, muestra empty state card con CTA "Crear un grupo" y descripcion de features.
- `HeaderDashboard`: header sticky del dashboard con logo, username del usuario y boton logout.
- `VerifyAuth`: wrapper de rutas protegidas.
- Todos los componentes usan dark theme (#0A1020 / #0F172A) con radial gradients y glassmorphism (backdrop-blur).

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

**Tests unitarios (agregados 2026-06-06):** backend/__tests__/ tiene 4 archivos de test con Jest + Babel (babel.config.cjs). Testean los 4 controllers: auth, expense, group, plan. Usan jest.mock() para repositorios y dependencias externas. Script: `npm test` desde backend/. Dependencias de dev: jest, babel-jest, @babel/core, @babel/preset-env.

**react-spinners:** agregado como dependencia frontend (0.17.x). Se usa via componente `Loader.tsx` en `components/ui/`.

**Rediseño visual (2026-06-10):** paleta cambio de dark theme `#0A1020`/`#0F172A` (font Manrope) a paleta `#210B2C` (fondo), `#BC96E6` (acento lavanda), `#FFD166` (acento dorado/amarillo), font "Outfit" (Google Fonts, cargada en `index.html`). Se agrego la libreria `motion` (Framer Motion, 12.x) con helpers en `frontend/src/utils/motion.ts` (`fadeUp`, `fadeIn`, `modalBackdrop`, `modalPanel`) y `MotionConfig reducedMotion="user"` en `main.tsx`. SweetAlert2 ahora usa clases globales `va-swal-*` definidas en `index.css` para alinearse con la paleta. Esto afecto practicamente todos los componentes/paginas del frontend (cambios masivos de clases Tailwind, sin cambios funcionales).

**Carpetas frontend ya no vacias:** `hooks/` (useAuth, useExpense, useGroup, usePlan), `services/` (auth/expenses/groups/plans .service.ts), `types/` (auth/expense/groups/plans .types.ts), `utils/` (date.ts, motion.ts). Actualizar el arbol de estructura del README si se agregan archivos nuevos.

**Mongoose `findOneAndUpdate`/`findByIdAndUpdate`:** los repos (`auth.repository.js`, `group.repository.js`, `plan.repository.js`) migraron la opcion `{ new: true }` a `{ returnDocument: 'after' }` (Mongoose 9.x). Es un cambio interno, no afecta la API ni la documentacion.

**Why:** el proyecto esta en desarrollo activo. La feature de gastos fue completada en una iteracion anterior. El README fue actualizado el 2026-06-10 para reflejar el rediseño visual (paleta, fuente, animaciones Motion) y la estructura completa de carpetas frontend (hooks/services/types/utils ya no estan vacias).

**How to apply:** al actualizar el README, documentar todos los endpoints de gastos como implementados y funcionales. El algoritmo de balance es el core de la aplicacion y merece documentacion detallada. Verificar siempre el arbol de componentes ya que se agregan componentes nuevos frecuentemente. Si el usuario menciona "mejoras de diseño" o cambios masivos de clases Tailwind sin nuevos endpoints, generalmente es solo refactor visual — verificar diffs de index.css, main.tsx e index.html para detectar cambios de paleta/fuente/libs de animacion.
