# VaquitApp

VaquitApp es una aplicación web para organizar gastos compartidos entre grupos de personas. Los usuarios crean grupos, definen planes dentro de esos grupos (por ejemplo, "asado del domingo"), registran gastos por plan especificando quién pagó y entre quiénes se divide el costo, y la app calcula el conjunto mínimo de transferencias necesarias para saldar todas las deudas.

---

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Modelos de datos](#modelos-de-datos)
- [Endpoints de la API](#endpoints-de-la-api)
- [Ejemplos de solicitudes y respuestas](#ejemplos-de-solicitudes-y-respuestas)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y configuración](#instalación-y-configuración)
- [Scripts](#scripts)
- [Roles y permisos](#roles-y-permisos)
- [Lógica de cálculo de gastos](#lógica-de-cálculo-de-gastos)

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Runtime del backend | Node.js + Express.js | Express 5.x |
| Base de datos | MongoDB + Mongoose | Mongoose 9.x |
| Autenticación | JSON Web Tokens (cookie httpOnly) | jsonwebtoken 9.x |
| Hash de contraseñas | bcryptjs | 3.x |
| Subida de archivos | Multer (almacenamiento en memoria) | 2.x |
| Hosting de imágenes | Cloudinary | 2.x |
| Correo electrónico | Nodemailer | 8.x |
| Framework frontend | React + TypeScript | React 19, TS 5.9 |
| Herramienta de build | Vite | 8.x |
| Estilos | Tailwind CSS | 4.x |
| Cliente HTTP | Axios | 1.x |
| Formularios | React Hook Form | 7.x |
| Alertas | SweetAlert2 | 11.x |
| Iconos | Bootstrap Icons | 1.x |

---

## Estructura del proyecto

```
VaquitApp/
├── backend/
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
        │   │   ├── MemberItem.tsx
        │   │   └── SideNavGroup.tsx
        │   ├── layout/
        │   │   └── VerifyAuth.tsx
        │   ├── plans/
        │   │   ├── AllPlans.tsx
        │   │   ├── CreatePlan.tsx
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
            └── date.ts
```

---

## Funcionalidades

### Autenticación
- Registro de usuario con confirmación por correo electrónico (enlace JWT, vencimiento de 24 h)
- Inicio de sesión con nombre de usuario o correo + contraseña; sesión almacenada en cookie `httpOnly` (vencimiento de 7 días)
- La cuenta debe estar confirmada antes de poder iniciar sesión
- El cierre de sesión elimina la cookie de sesión

### Grupos
- Crear un grupo con nombre, descripción e imagen opcional (subida a Cloudinary)
- Ver todos los grupos a los que pertenece el usuario autenticado
- Ver los detalles de un grupo
- Editar nombre, descripción e imagen del grupo (solo admin)
- Eliminar un grupo de forma suave (`active: false`) (solo admin)
- Abandonar un grupo — bloqueado si el usuario es el único admin

### Miembros del grupo
- Ver todos los miembros con su rol y fecha de ingreso
- Invitar a un miembro por correo electrónico; envía un enlace de invitación firmado con JWT (vencimiento de 7 días, incluye el rol)
- Aceptar una invitación mediante token (requiere sesión activa en el frontend)
- Promover a cualquier miembro al rol de admin (solo admin)
- Eliminar a un miembro del grupo (solo admin)

### Planes
- Crear un plan dentro de un grupo con nombre, descripción opcional, imagen opcional y lista inicial de miembros
- El creador del plan siempre se agrega automáticamente a la lista de miembros
- Ver todos los planes activos de un grupo
- Ver el historial de planes (planes completados y cancelados)
- Obtener un plan específico por ID con detalles completos de miembros y creador
- Marcar un plan como completado (cualquier miembro del grupo)
- Agregar nuevos miembros a un plan existente (los miembros deben pertenecer al grupo)

### Gastos
- Registrar un gasto dentro de un plan: monto, descripción opcional, quién pagó y entre quiénes se divide
- Todas las partes (`paid_by`, cada usuario en `split_among`) deben ser miembros del plan
- Listar los gastos activos de un plan (estado = `active`)
- Listar todos los gastos de un plan sin importar el estado
- Marcar un gasto como completado/saldado — permitido únicamente al usuario que pagó o a un admin del grupo
- Calcular los balances de liquidación: devuelve la lista mínima de transferencias para saldar todas las deudas

---

## Modelos de datos

> Ver diagrama ERD en Excalidraw: https://excalidraw.com/#json=GB2u9-cVO38I6sMG-OJ14,ro9xQoW4ZtJdoO9Glr0FqQ

### User (Usuario)

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `_id` | ObjectId | auto | Clave primaria |
| `username` | String | sí | Nombre de usuario único |
| `email` | String | sí | Dirección de correo electrónico única |
| `password` | String | sí | Hash de bcrypt |
| `isConfirmed` | Boolean | — | `false` hasta que se hace clic en el enlace de confirmación |

### Group (Grupo)

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `_id` | ObjectId | auto | Clave primaria |
| `name` | String | sí | Nombre visible del grupo |
| `description` | String | sí | Descripción del grupo |
| `image` | String | — | URL de Cloudinary |
| `created_by` | ObjectId → User | sí | Usuario que creó el grupo |
| `active` | Boolean | — | `false` = eliminado de forma suave (por defecto `true`) |
| `created_at` | Date | — | Fecha y hora de creación |

### GroupMember (Miembro del grupo)

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `_id` | ObjectId | auto | Clave primaria |
| `group` | ObjectId → Group | sí | Referencia al grupo |
| `user` | ObjectId → User | sí | Referencia al usuario |
| `role` | String | — | `admin` o `member` (por defecto `member`) |
| `joined_at` | Date | — | Fecha en que el usuario se unió |

### Plan

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `_id` | ObjectId | auto | Clave primaria |
| `name` | String | sí | Nombre visible del plan |
| `description` | String | — | Descripción opcional |
| `image` | String | — | URL de Cloudinary |
| `group` | ObjectId → Group | sí | Grupo al que pertenece este plan |
| `created_by` | ObjectId → User | sí | Usuario que creó el plan |
| `members` | [ObjectId → User] | — | Usuarios que participan en este plan |
| `state` | String | — | `active`, `completed` o `cancelled` (por defecto `active`) |
| `created_at` | Date | — | Fecha y hora de creación |

### Expense (Gasto)

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `_id` | ObjectId | auto | Clave primaria |
| `description` | String | — | Etiqueta opcional (por ejemplo, "Supermercado") |
| `amount` | Number | sí | Monto total pagado; debe ser > 0 |
| `plan` | ObjectId → Plan | sí | Plan al que pertenece este gasto |
| `paid_by` | ObjectId → User | sí | Usuario que pagó el monto completo |
| `split_among` | [ObjectId → User] | — | Usuarios que comparten el costo |
| `state` | String | — | `active` o `completed` (por defecto `active`) |
| `createdAt` | Date | — | Establecido automáticamente por los timestamps de Mongoose |
| `updatedAt` | Date | — | Establecido automáticamente por los timestamps de Mongoose |

---

## Endpoints de la API

Todos los endpoints se sirven relativos a la URL base del backend (por ejemplo, `http://localhost:3000`).

**Cadena de middlewares para rutas protegidas de grupo/plan/gasto:**
`verifyToken` → `validateObjectId(...)` → `verifyRole` → controlador

`verifyRole` puebla `req.group` y `req.member` (el documento GroupMember del solicitante). Las verificaciones de rol (`admin` vs. `member`) se aplican dentro de cada controlador.

### Autenticación

| Método | Endpoint | Requiere autenticación | Descripción |
|---|---|---|---|
| POST | `/register` | No | Registrar un nuevo usuario; envía correo de confirmación |
| POST | `/login` | No | Iniciar sesión con `identifier` (nombre de usuario o correo) + `password`; establece la cookie de sesión |
| GET | `/confirm/:token` | No | Confirmar la dirección de correo electrónico mediante token JWT |
| GET | `/dashboard` | Sí | Devuelve el perfil del usuario autenticado |
| POST | `/logout` | No | Elimina la cookie de sesión |

### Grupos

| Método | Endpoint | Requiere autenticación | Descripción |
|---|---|---|---|
| POST | `/groups` | Sí | Crear un nuevo grupo (multipart/form-data para imagen opcional) |
| GET | `/groups` | Sí | Listar todos los grupos a los que pertenece el usuario autenticado |
| GET | `/groups/:idGroup` | Sí + miembro | Obtener los detalles del grupo |
| PATCH | `/groups/:idGroup` | Sí + admin | Editar nombre, descripción e imagen del grupo |
| DELETE | `/groups/:idGroup` | Sí + admin | Eliminar el grupo de forma suave |
| DELETE | `/groups/:idGroup/leave` | Sí + miembro | Abandonar el grupo |

### Miembros del grupo

| Método | Endpoint | Requiere autenticación | Descripción |
|---|---|---|---|
| GET | `/groups/:idGroup/members` | Sí + miembro | Listar todos los miembros con rol y fecha de ingreso |
| POST | `/groups/:idGroup/invite` | Sí + admin | Enviar una invitación por correo con token firmado |
| GET | `/groups/invite/accept/:token` | No | Aceptar una invitación y agregar al usuario al grupo |
| PATCH | `/groups/:idGroup/members/:idMember/admin` | Sí + admin | Promover a un miembro al rol de admin |
| DELETE | `/groups/:idGroup/members/:idMember` | Sí + admin | Eliminar a un miembro del grupo |

### Planes

> Nota: las rutas de planes usan el prefijo `/:idGroup/plans`, no `/groups/:idGroup/plans`.

| Método | Endpoint | Requiere autenticación | Descripción |
|---|---|---|---|
| GET | `/:idGroup/plans` | Sí + miembro | Listar todos los planes activos del grupo |
| GET | `/:idGroup/plans/history` | Sí + miembro | Listar planes completados y cancelados |
| GET | `/:idGroup/plans/:idPlan` | Sí + miembro | Obtener un plan activo por ID |
| POST | `/:idGroup/plans` | Sí + miembro | Crear un nuevo plan (multipart/form-data) |
| PATCH | `/:idGroup/plans/:idPlan/complete` | Sí + miembro | Marcar un plan como completado |
| PATCH | `/:idGroup/plans/:idPlan/addMembers` | Sí + miembro | Agregar miembros del grupo a un plan existente |

### Gastos

| Método | Endpoint | Requiere autenticación | Descripción |
|---|---|---|---|
| POST | `/groups/:idGroup/plans/:idPlan/expenses` | Sí + miembro | Registrar un nuevo gasto |
| GET | `/groups/:idGroup/plans/:idPlan/expenses` | Sí + miembro | Listar los gastos activos de un plan |
| GET | `/groups/:idGroup/plans/:idPlan/expenses/all` | Sí + miembro | Listar todos los gastos de un plan (todos los estados) |
| GET | `/groups/:idGroup/plans/:idPlan/expenses/balances` | Sí + miembro | Calcular y devolver la lista de transacciones de liquidación |
| PATCH | `/groups/:idGroup/plans/:idPlan/expenses/:idExpense/complete` | Sí + miembro | Marcar un gasto como completado (solo el usuario que pagó o un admin) |

---

## Ejemplos de solicitudes y respuestas

### POST `/register`

```json
// Cuerpo de la solicitud
{
  "username": "ana",
  "email": "ana@ejemplo.com",
  "password": "secreto123"
}

// Respuesta 201
{ "message": "Usuario registrado exitosamente" }
```

### POST `/login`

```json
// Cuerpo de la solicitud — acepta nombre de usuario o correo en "identifier"
{
  "identifier": "ana",
  "password": "secreto123"
}

// Respuesta 200 — establece la cookie httpOnly "token"
{
  "message": "Login exitoso",
  "user": { "id": "...", "username": "ana", "email": "ana@ejemplo.com" }
}
```

### POST `/groups/:idGroup/invite`

```json
// Cuerpo de la solicitud
{
  "email": "bob@ejemplo.com",
  "role": "member"
}

// Respuesta 200
{ "message": "Invitación enviada exitosamente" }
```

El endpoint de invitación firma un JWT `{ groupId, email, role }` con vencimiento de 7 días y envía por correo un enlace a `FRONTEND_URL/invitacion/<token>`. El frontend requiere una sesión activa antes de mostrar la página de aceptación.

### POST `/groups/:idGroup/plans/:idPlan/expenses`

```json
// Cuerpo de la solicitud
{
  "description": "Compras en el supermercado",
  "amount": 90,
  "paid_by": "<userId-ana>",
  "split_among": ["<userId-ana>", "<userId-bob>", "<userId-carol>"]
}

// Respuesta 201
{
  "message": "Gasto creado exitosamente",
  "expense": { "_id": "...", "amount": 90, "state": "active", "..." : "..." }
}
```

### GET `/groups/:idGroup/plans/:idPlan/expenses/balances`

```json
// Respuesta 200
{
  "message": "Balances calculados exitosamente",
  "transactions": [
    {
      "from": { "_id": "...", "username": "carol" },
      "to":   { "_id": "...", "username": "ana" },
      "amount": 60
    },
    {
      "from": { "_id": "...", "username": "carol" },
      "to":   { "_id": "...", "username": "bob" },
      "amount": 30
    }
  ]
}
```

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto en el que escucha el servidor | `3000` |
| `MONGO_URI` | Cadena de conexión a MongoDB | `mongodb+srv://usuario:pass@cluster/db` |
| `JWT_SECRET` | Secreto utilizado para firmar todos los tokens JWT | `una_cadena_aleatoria_larga` |
| `FRONTEND_URL` | Origen del frontend para CORS y enlaces de correo | `http://localhost:5173` |
| `NODE_ENV` | Entorno (`development` o `production`) | `development` |
| `EMAIL_USER` | Dirección de correo del remitente SMTP | `noreply@vaquitapp.com` |
| `EMAIL_PASS` | Contraseña / contraseña de aplicación del remitente SMTP | `contrasena_smtp_app` |
| `CLOUDINARY_CLOUD_NAME` | Identificador de la nube en Cloudinary | `mi_nube` |
| `CLOUDINARY_API_KEY` | Clave de API de Cloudinary | `123456789` |
| `CLOUDINARY_API_SECRET` | Secreto de API de Cloudinary | `abc123secreto` |

### Frontend (`frontend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base del backend utilizada por Axios | `http://localhost:3000` |

---

## Instalación y configuración

### Requisitos previos

- Node.js 18+
- Una instancia de MongoDB en ejecución (local o Atlas)
- Una cuenta de Cloudinary
- Un proveedor de correo SMTP

### Backend

```bash
cd backend
npm install
```

Crear `backend/.env` usando las variables descritas arriba, luego:

```bash
npm run dev
```

El servidor se inicia en el `PORT` configurado (por defecto `3000`).

### Frontend

```bash
cd frontend
npm install
```

Crear `frontend/.env`:

```
VITE_API_URL=http://localhost:3000
```

Luego:

```bash
npm run dev
```

Vite inicia el servidor de desarrollo, generalmente en `http://localhost:5173`.

---

## Scripts

### Backend

| Comando | Descripción |
|---|---|
| `npm start` | Iniciar el servidor con `node index.js` |
| `npm run dev` | Iniciar con `nodemon` (reinicio automático al cambiar archivos) |

### Frontend

| Comando | Descripción |
|---|---|
| `npm run dev` | Iniciar el servidor de desarrollo de Vite con HMR |
| `npm run build` | Verificar tipos y generar el bundle de producción en `dist/` |
| `npm run preview` | Servir el build de producción de forma local |
| `npm run lint` | Ejecutar ESLint en todo el árbol de fuentes |

---

## Roles y permisos

| Acción | admin | member |
|---|---|---|
| Ver detalles del grupo | sí | sí |
| Ver miembros del grupo | sí | sí |
| Abandonar el grupo | sí (bloqueado si es el único admin) | sí |
| Editar el grupo (nombre, descripción, imagen) | sí | no |
| Eliminar el grupo | sí | no |
| Invitar a un miembro al grupo | sí | no |
| Eliminar a un miembro del grupo | sí | no |
| Promover a un miembro a admin | sí | no |
| Crear plan | sí | sí |
| Ver planes / historial de planes | sí | sí |
| Marcar un plan como completado | sí | sí |
| Agregar miembros a un plan | sí | sí |
| Crear gasto | sí | sí |
| Ver gastos | sí | sí |
| Obtener balance/liquidación | sí | sí |
| Completar (saldar) cualquier gasto | sí | no |
| Completar el propio gasto (`paid_by`) | sí | sí |

---

## Lógica de cálculo de gastos

> Ver diagrama en Excalidraw: https://excalidraw.com/#json=URqLR5kXBbuJ9yStkF76q,-cKpUvem2BcRXDJ8-rv2rw

El algoritmo de balances se ejecuta en el servidor en `expense.controller.js → getBalances` cuando el cliente solicita `GET .../expenses/balances`. Funciona en tres etapas:

**Etapa 1 — Construir el mapa de balances.**
Para cada gasto activo del plan:
- El balance del usuario `paid_by` aumenta en el `amount` total (se le debe ese dinero).
- El balance de cada usuario en `split_among` disminuye en `amount / split_among.length` (su parte proporcional del costo).

Los usuarios con balance final positivo son *acreedores* (otros les deben dinero). Los usuarios con balance negativo son *deudores*.

**Etapa 2 — Emparejamiento voraz.**
Los acreedores se ordenan del balance más alto al más bajo; los deudores se ordenan del más negativo al menos negativo. En cada iteración, el deudor más grande se empareja con el acreedor más grande. El monto de transferencia es `min(balance del acreedor, |balance del deudor|)`. Ambos balances se reducen en ese monto; cualquier parte que llegue a cero se elimina de su lista. Esto continúa hasta que todos los balances estén saldados.

Este enfoque voraz garantiza el **número mínimo de transacciones** necesarias para saldar todas las deudas.

**Etapa 3 — Redondeo.**
Cada monto intermedio y final se redondea a 2 decimales usando `Math.round(value * 100) / 100` para evitar errores de punto flotante.

### Ejemplo

| Gasto | Pagado por | Dividido entre | Efecto neto |
|---|---|---|---|
| $90 | Ana | Ana, Bob, Carol | Ana +60, Bob -30, Carol -30 |
| $60 | Bob | Bob, Carol | Bob +30, Carol -30 |

Balances finales: Ana +60, Bob +30, Carol -90.

Liquidación (2 transacciones — óptimo):
- Carol le paga a Ana $60
- Carol le paga a Bob $30
