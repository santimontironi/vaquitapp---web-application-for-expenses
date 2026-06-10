# VaquitApp

Aplicación web para organizar gastos compartidos entre grupos de personas. Creás un grupo, definís planes (ej: "asado del domingo"), registrás quién pagó qué y entre quiénes se divide, y la app calcula automáticamente el mínimo de transferencias para saldar todas las deudas.

---

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Flujo de uso](#flujo-de-uso)
- [Funcionalidades](#funcionalidades)
- [Modelos de datos](#modelos-de-datos)
- [Endpoints de la API](#endpoints-de-la-api)
- [Seguridad](#seguridad)
- [Roles y permisos](#roles-y-permisos)
- [Lógica de cálculo de gastos](#lógica-de-cálculo-de-gastos)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y configuración](#instalación-y-configuración)
- [Scripts](#scripts)
- [Tests unitarios](#tests-unitarios)

---

## Stack tecnológico

| Capa | Tecnología | Versión |
| --- | --- | --- |
| Runtime backend | Node.js + Express.js | Express 5.x |
| Base de datos | MongoDB + Mongoose | Mongoose 9.x |
| Autenticación | JWT en cookie `httpOnly` | jsonwebtoken 9.x |
| Hash de contraseñas | bcryptjs | 3.x |
| Subida de archivos | Multer (memoria) + Cloudinary | Multer 2.x / Cloudinary 2.x |
| Correo electrónico | Nodemailer (Gmail SMTP) | 8.x |
| Rate limiting | express-rate-limit | 8.x |
| Frontend | React + TypeScript + Vite | React 19, TS 5.9, Vite 8.x |
| Estilos | Tailwind CSS | 4.x |
| Animaciones | Motion (Framer Motion) | 12.x |
| Tipografía | Google Fonts "Outfit" | — |
| Cliente HTTP | Axios | 1.x |
| Alertas / formularios | SweetAlert2 + React Hook Form | 11.x / 7.x |
| Iconos | Bootstrap Icons | 1.x |
| Spinners | react-spinners | 0.17.x |
| Tests backend | Jest + Babel | Jest 30.x |

---

## Estructura del proyecto

```
VaquitApp/
├── backend/
│   ├── __tests__/
│   │   ├── auth.controller.test.js
│   │   ├── expense.controller.test.js
│   │   ├── group.controller.test.js
│   │   └── plan.controller.test.js
│   ├── config/
│   │   ├── cloudinary.config.js
│   │   ├── db.config.js
│   │   └── mail.config.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── expense.controller.js
│   │   ├── group.controller.js
│   │   └── plan.controller.js
│   ├── middlewares/
│   │   ├── multer.js
│   │   ├── rate-limit.js
│   │   ├── validate-object-id.js
│   │   ├── verify-auth.js
│   │   └── verify-role.js
│   ├── models/
│   │   ├── expense.model.js
│   │   ├── group.model.js
│   │   ├── groupMember.model.js
│   │   ├── plan.model.js
│   │   └── user.model.js
│   ├── repository/
│   │   ├── auth.repository.js
│   │   ├── expense.repository.js
│   │   ├── group.repository.js
│   │   └── plan.repository.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── expense.routes.js
│   │   ├── group.routes.js
│   │   └── plan.routes.js
│   ├── babel.config.cjs
│   ├── app.js
│   ├── index.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── expenses/
        │   │   ├── CreateExpense.tsx
        │   │   ├── ExpenseCard.tsx
        │   │   ├── PaidByPicker.tsx
        │   │   └── SplitPicker.tsx
        │   ├── groups/
        │   │   ├── AddMember.tsx
        │   │   ├── AllMembers.tsx
        │   │   ├── EditGroupModal.tsx
        │   │   ├── MemberItem.tsx
        │   │   ├── MyGroupCard.tsx
        │   │   ├── MyGroups.tsx
        │   │   └── SideNavGroup.tsx
        │   ├── layout/
        │   │   ├── HeaderDashboard.tsx
        │   │   └── VerifyAuth.tsx
        │   ├── plans/
        │   │   ├── AllPlans.tsx
        │   │   ├── CreatePlan.tsx
        │   │   ├── MemberOption.tsx
        │   │   ├── PlanHistory.tsx
        │   │   └── PlanItem.tsx
        │   └── ui/
        │       └── Loader.tsx
        ├── context/
        │   ├── AuthContext.tsx
        │   ├── ExpenseContext.tsx
        │   ├── GroupContext.tsx
        │   └── PlanContext.tsx
        ├── hooks/
        │   ├── useAuth.tsx
        │   ├── useExpense.tsx
        │   ├── useGroup.tsx
        │   └── usePlan.tsx
        ├── pages/
        │   ├── AcceptInvitation.tsx
        │   ├── ConfirmUser.tsx
        │   ├── Dashboard.tsx
        │   ├── Group.tsx
        │   ├── Login.tsx
        │   ├── NewGroup.tsx
        │   ├── PlanDetail.tsx
        │   └── Register.tsx
        ├── services/
        │   ├── auth.service.ts
        │   ├── expenses.service.ts
        │   ├── groups.service.ts
        │   └── plans.service.ts
        ├── types/
        │   ├── auth.types.ts
        │   ├── expense.types.ts
        │   ├── groups.types.ts
        │   └── plans.types.ts
        └── utils/
            ├── date.ts
            └── motion.ts
```

---

## Flujo de uso

1. El usuario se registra → recibe un correo con enlace de confirmación
2. Confirma su cuenta y hace login → se establece una cookie de sesión (7 días)
3. Crea un grupo o acepta una invitación a uno existente
4. Dentro del grupo crea un plan (ej: "salida al cine")
5. Agrega gastos al plan: quién pagó, el monto y entre quiénes se divide
6. La app calcula en tiempo real quién le debe a quién y cuánto
7. Una vez que todos saldaron sus deudas en la vida real, se marca el plan como "saldar todos los gastos"

---

## Funcionalidades

### Autenticación
- Registro con nombre de usuario, email y contraseña; envía correo de confirmación (enlace JWT, 24 h)
- Login con username o email + contraseña; sesión en cookie `httpOnly` (7 días)
- La cuenta debe estar confirmada antes de poder iniciar sesión
- Logout elimina la cookie del servidor

### Grupos
- Crear grupo con nombre, descripción e imagen opcional (Cloudinary)
- Ver todos los grupos a los que pertenece el usuario con badge de rol y fecha de ingreso
- Dashboard con empty state: si el usuario no pertenece a ningún grupo, se muestra una tarjeta con CTA para crear el primero
- Editar nombre, descripción e imagen (solo admin)
- Eliminar grupo de forma suave — `active: false` (solo admin)
- Abandonar grupo — bloqueado si el usuario es el único admin

### Miembros
- Ver todos los miembros con su rol y fecha de ingreso
- Invitar por email: envía enlace firmado con JWT (7 días, incluye rol)
- Aceptar invitación mediante token (requiere sesión activa)
- Promover miembro a admin (solo admin); el botón no aparece si el miembro ya es admin
- Eliminar miembro (solo admin)

### Planes
- Crear plan con nombre, descripción e imagen opcional; el creador se agrega automáticamente como miembro
- Ver planes activos del grupo en grid (1-3 columnas según viewport)
- Ver historial de planes (completados/cancelados) en modal con badge de estado
- Marcar plan como completado (cualquier miembro)
- Agregar miembros del grupo a un plan existente

### Gastos
- Registrar gasto: monto, descripción opcional, quién pagó (`paid_by`) y entre quiénes se divide (`split_among`)
- `paid_by` y cada usuario en `split_among` deben ser miembros del plan
- Ver gastos activos del plan con detalle de quién pagó, monto y división
- Eliminar gasto permanentemente con confirmación SweetAlert (solo quien pagó o un admin)
- Saldar todos los gastos activos del plan de una vez (`complete-all`) con confirmación
- Ver historial de gastos saldados en la página del plan (solo lectura, sin opción de eliminar)
- Calcular balance: devuelve la lista mínima de transferencias para saldar todas las deudas

### Diseño visual
- Tema oscuro con paleta `#210B2C` (fondo), `#BC96E6` (acento lavanda) y `#FFD166` (acento dorado), tipografía "Outfit" (Google Fonts) y glassmorphism (`backdrop-blur`)
- Animaciones de entrada y transición con **Motion** (`frontend/src/utils/motion.ts`): `fadeUp`, `fadeIn`, `modalBackdrop`, `modalPanel`; `MotionConfig` en `main.tsx` respeta `prefers-reduced-motion`
- Alertas de SweetAlert2 estilizadas globalmente con clases `va-swal-*` definidas en `index.css`, acordes a la paleta de la app
- Scrollbar personalizada y selección de texto con los colores de la marca

### Navegación del frontend (React Router)
| Ruta | Página | Protegida |
| --- | --- | --- |
| `/` | Login | No |
| `/registro` | Register | No |
| `/confirmar/:token` | ConfirmUser | No |
| `/inicio` | Dashboard | Sí |
| `/nuevo-grupo` | NewGroup | Sí |
| `/grupo/:idGroup` | Group | Sí |
| `/grupo/:idGroup/planes/:idPlan` | PlanDetail | Sí |
| `/invitacion/:token` | AcceptInvitation | Sí |

---

## Modelos de datos

> Ver diagrama ERD: https://excalidraw.com/#json=olVvOO9Dz1VEKoHjjlyeW,eFgPh8Lhb2sxh2lJpGRoVA

### User

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `username` | String (único) | Sí | Nombre de usuario |
| `email` | String (único) | Sí | Correo electrónico |
| `password` | String | Sí | Hash bcrypt |
| `isConfirmed` | Boolean | — | `false` hasta confirmar el email |

### Group

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `name` | String | Sí | Nombre del grupo |
| `description` | String | Sí | Descripción |
| `image` | String | No | URL de Cloudinary |
| `created_by` | ObjectId → User | Sí | Usuario creador |
| `active` | Boolean | — | `false` = eliminado suavemente |
| `created_at` | Date | — | Fecha de creación (default: now) |

### GroupMember

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `group` | ObjectId → Group | Sí | Referencia al grupo |
| `user` | ObjectId → User | Sí | Referencia al usuario |
| `role` | String | — | `admin` o `member` (default: `member`) |
| `joined_at` | Date | — | Fecha de ingreso (default: now) |

### Plan

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `name` | String | Sí | Nombre del plan |
| `description` | String | No | Descripción |
| `image` | String | No | URL de Cloudinary |
| `group` | ObjectId → Group | Sí | Grupo al que pertenece |
| `created_by` | ObjectId → User | Sí | Usuario creador |
| `members` | [ObjectId → User] | — | Participantes del plan |
| `state` | String | — | `active`, `completed` o `cancelled` (default: `active`) |
| `created_at` | Date | — | Fecha de creación (default: now) |

### Expense

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `description` | String | No | Etiqueta opcional (ej: "Supermercado") |
| `amount` | Number (min: 0) | Sí | Monto total; debe ser > 0 |
| `plan` | ObjectId → Plan | Sí | Plan al que pertenece |
| `paid_by` | ObjectId → User | Sí | Quién pagó el monto completo |
| `split_among` | [ObjectId → User] | — | Entre quiénes se divide el costo |
| `state` | String | — | `active` o `completed` (default: `active`) |
| `createdAt` / `updatedAt` | Date | — | Timestamps automáticos de Mongoose |

---

## Endpoints de la API

> URL base: `http://localhost:3000` (desarrollo)

**Cadena de middlewares en rutas protegidas de grupo/plan/gasto:**
```
verifyToken → validateObjectId(...) → verifyRole → controlador
```
`verifyRole` carga `req.group` y `req.member` (el GroupMember del usuario autenticado). Las verificaciones de rol específico se realizan dentro de cada controlador.

### Autenticación

| Método | Endpoint | Auth | Rate limit | Descripción |
| --- | --- | --- | --- | --- |
| POST | `/register` | No | 5 / hora por IP | Registrar usuario; envía correo de confirmación |
| POST | `/login` | No | 10 / 15 min por IP | Login con `identifier` + `password`; establece cookie |
| GET | `/confirm/:token` | No | — | Confirmar email mediante token JWT |
| GET | `/dashboard` | Sí | — | Devuelve el perfil del usuario autenticado |
| POST | `/logout` | No | — | Elimina la cookie de sesión |

### Grupos

| Método | Endpoint | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/groups` | Sí | Crear grupo (`multipart/form-data`) |
| GET | `/groups` | Sí | Listar grupos del usuario |
| GET | `/groups/:idGroup` | Sí + miembro | Detalles del grupo |
| PATCH | `/groups/:idGroup` | Sí + admin | Editar grupo (nombre, descripción, imagen) |
| DELETE | `/groups/:idGroup` | Sí + admin | Eliminar grupo (soft delete: `active: false`) |
| DELETE | `/groups/:idGroup/leave` | Sí + miembro | Abandonar grupo |

### Miembros

| Método | Endpoint | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/groups/:idGroup/members` | Sí + miembro | Listar miembros con rol y fecha de ingreso |
| POST | `/groups/:idGroup/invite` | Sí + admin | Enviar invitación por email (JWT, 7 días) |
| GET | `/groups/invite/accept/:token` | No | Aceptar invitación; agrega al usuario al grupo |
| PATCH | `/groups/:idGroup/members/:idMember/admin` | Sí + admin | Promover miembro a admin |
| DELETE | `/groups/:idGroup/members/:idMember` | Sí + admin | Eliminar miembro del grupo |

### Planes

> Prefijo: `/:idGroup/plans` (no `/groups/:idGroup/plans`)

| Método | Endpoint | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/:idGroup/plans` | Sí + miembro | Planes activos del grupo |
| GET | `/:idGroup/plans/history` | Sí + miembro | Planes completados y cancelados |
| GET | `/:idGroup/plans/:idPlan` | Sí + miembro | Detalle de un plan |
| POST | `/:idGroup/plans` | Sí + miembro | Crear plan (`multipart/form-data`) |
| PATCH | `/:idGroup/plans/:idPlan/complete` | Sí + miembro | Marcar plan como completado |
| PATCH | `/:idGroup/plans/:idPlan/addMembers` | Sí + miembro | Agregar miembros al plan |

### Gastos

| Método | Endpoint | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/groups/:idGroup/plans/:idPlan/expenses` | Sí + miembro | Registrar gasto |
| GET | `/groups/:idGroup/plans/:idPlan/expenses` | Sí + miembro | Gastos activos del plan |
| GET | `/groups/:idGroup/plans/:idPlan/expenses/all` | Sí + miembro | Todos los gastos (cualquier estado) |
| GET | `/groups/:idGroup/plans/:idPlan/expenses/balances` | Sí + miembro | Calcular balance de liquidación |
| PATCH | `/groups/:idGroup/plans/:idPlan/expenses/complete-all` | Sí + miembro | Saldar todos los gastos activos |
| DELETE | `/groups/:idGroup/plans/:idPlan/expenses/:idExpense` | Sí + miembro | Eliminar gasto (solo `paid_by` o admin) |

---

## Seguridad

### JWT
- Los tokens se firman con `JWT_SECRET` y expiran a los 7 días
- Se almacenan en cookie `httpOnly` (no accesible desde JavaScript)
- En producción la cookie es `secure: true` y `sameSite: 'none'`
- En desarrollo es `secure: false` y `sameSite: 'lax'`
- El servidor valida al arrancar que `JWT_SECRET` tenga al menos 32 caracteres

### Rate Limiting

Implementado en `middlewares/rate-limit.js` con `express-rate-limit`. El conteo es **por IP**. Al superar el límite se responde con **HTTP 429** y un mensaje en español. Las respuestas incluyen cabeceras `RateLimit-*` estándar (`standardHeaders: true`).

| Scope | Límite | Ventana | Dónde se aplica |
| --- | --- | --- | --- |
| Global | 100 requests | 10 minutos | Todas las rutas (`app.use`) |
| Login | 10 intentos | 15 minutos | `POST /login` |
| Registro | 5 intentos | 1 hora | `POST /register` |

### Validación de ObjectId

El middleware `validateObjectId(...paramNames)` valida que cada ID de ruta sea un ObjectId válido de MongoDB antes de llegar al controlador. Si algún ID es inválido, responde con **HTTP 400**.

---

## Roles y permisos

| Acción | admin | member |
| --- | --- | --- |
| Ver grupo y miembros | sí | sí |
| Abandonar grupo | sí (bloqueado si es el único admin) | sí |
| Editar / eliminar grupo | sí | no |
| Invitar / eliminar / promover miembros | sí | no |
| Crear y ver planes | sí | sí |
| Marcar plan como completado | sí | sí |
| Agregar miembros a un plan | sí | sí |
| Crear y ver gastos | sí | sí |
| Saldar todos los gastos (`complete-all`) | sí | sí |
| Eliminar cualquier gasto | sí | no |
| Eliminar propio gasto (`paid_by`) | sí | sí |
| Ver balance de liquidación | sí | sí |
| Ver historial de gastos saldados | sí | sí |

---

## Lógica de cálculo de gastos

> Ver diagrama del algoritmo: https://excalidraw.com/#json=qoECKn3HLa9Gni1yvAjYI,ygP05CRQwO31HcxBt1XcgQ

El cálculo ocurre en `expense.controller.js → getBalances` y opera **solo sobre gastos con `state: 'active'`**.

**Etapa 1 — Balance por usuario**
- El usuario `paid_by` suma el monto total (es acreedor)
- Cada usuario en `split_among` resta `amount / split_among.length` (es deudor)

Resultado: acreedores (balance > 0) y deudores (balance < 0).

**Etapa 2 — Ordenamiento**
- Acreedores: de mayor a menor balance
- Deudores: del más negativo al menos negativo

**Etapa 3 — Emparejamiento greedy**
En cada iteración: el mayor deudor paga al mayor acreedor el mínimo entre lo que debe y lo que le deben. Se repite hasta saldar todo. Garantiza el **número mínimo de transacciones** — O(n log n).

**Redondeo:** `Math.round(value * 100) / 100` en cada paso para evitar errores de punto flotante.

**Historial de gastos saldados:** el frontend obtiene todos los gastos via `/expenses/all` y filtra localmente los que tienen `state === 'completed'`. Estos se muestran en la sección "Historial de gastos saldados" dentro de la página del plan (solo lectura).

### Ejemplo

| Gasto | Pagó | Dividido entre | Efecto en balance |
| --- | --- | --- | --- |
| $90 | Ana | Ana, Bob, Carol | Ana +60, Bob −30, Carol −30 |
| $60 | Bob | Bob, Carol | Bob +30, Carol −30 |

Balances finales: Ana **+60**, Bob **+30**, Carol **−90**

Liquidación mínima (2 transacciones):
- Carol → Ana: $60
- Carol → Bob: $30

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del servidor (ej: `3000`) |
| `MONGO_URI` | Cadena de conexión a MongoDB |
| `JWT_SECRET` | Secreto para firmar tokens JWT — **mínimo 32 caracteres** |
| `FRONTEND_URL` | Origen del frontend para CORS y links en emails |
| `NODE_ENV` | `development` o `production` |
| `EMAIL_USER` | Dirección del remitente SMTP (Gmail) |
| `EMAIL_PASS` | Contraseña de aplicación SMTP |
| `CLOUDINARY_CLOUD_NAME` | Nombre de la nube en Cloudinary |
| `CLOUDINARY_API_KEY` | Clave de API de Cloudinary |
| `CLOUDINARY_API_SECRET` | Secreto de API de Cloudinary |

### Frontend (`frontend/.env`)

| Variable | Descripción |
| --- | --- |
| `VITE_API_URL` | URL base del backend para Axios (ej: `http://localhost:3000`) |

---

## Instalación y configuración

**Requisitos previos:** Node.js 18+, MongoDB, cuenta de Cloudinary, cuenta de Gmail con contraseña de aplicación.

### Backend

```bash
cd backend
npm install
# Crear backend/.env con las variables listadas arriba
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# Crear frontend/.env con VITE_API_URL=http://localhost:3000
npm run dev
```

---

## Scripts

### Backend

| Comando | Descripción |
| --- | --- |
| `npm start` | Producción con `node index.js` |
| `npm run dev` | Desarrollo con `nodemon` (hot reload) |
| `npm test` | Ejecutar tests unitarios con Jest |

### Frontend

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo Vite con HMR |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Servir el build localmente |
| `npm run lint` | ESLint sobre todo el código fuente |

---

## Tests unitarios

El backend cuenta con una suite de tests unitarios en `backend/__tests__/` usando **Jest** con **Babel** para soporte de ES Modules.

| Archivo | Controller testeado | Alcance |
| --- | --- | --- |
| `auth.controller.test.js` | `AuthController` | register, login, confirmUser, logout, dashboardUser |
| `expense.controller.test.js` | `ExpenseController` | createExpense, getBalances, deleteExpense, completeAllExpenses |
| `group.controller.test.js` | `GroupController` | createGroup, editGroup, deleteGroup, leaveGroup, miembros, invitaciones |
| `plan.controller.test.js` | `PlanController` | createPlan, checkPlanAsCompleted, addMembersToPlan, getPlanHistory |

Los repositorios y dependencias externas (bcryptjs, jsonwebtoken, nodemailer, cloudinary) se mockean con `jest.mock()`. Los tests validan códigos de estado HTTP y mensajes de error ante inputs inválidos, usuarios inexistentes y violaciones de permisos.

```bash
# Ejecutar desde la carpeta backend/
npm test
```
