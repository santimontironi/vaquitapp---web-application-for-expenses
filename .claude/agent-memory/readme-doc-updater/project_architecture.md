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

**Estado del Plan:** `active` | `completed` | `cancelled`. Solo se puede marcar como `completed` via endpoint dedicado. No hay endpoint para cancelar todavia.

**Expense:** el modelo esta definido pero NO hay controladores, repositorios ni rutas implementadas aun. Es funcionalidad planificada.

**Why:** el proyecto esta en desarrollo activo. El modelo Expense ya existe en MongoDB pero los endpoints de gastos y el algoritmo de calculo son el siguiente paso.

**How to apply:** al actualizar el README, no documentar endpoints de gastos que no existen. Mencionar el modelo como definido y los endpoints como pendientes.
