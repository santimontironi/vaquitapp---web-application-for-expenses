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
| Frontend | React + TypeScript + Vite | React 19, TS 5.9, Vite 8.x |
| Estilos | Tailwind CSS | 4.x |
| Cliente HTTP | Axios | 1.x |
| Alertas / formularios | SweetAlert2 + React Hook Form | 11.x / 7.x |
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
│   ├── app.js
│   ├── index.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── expenses/
        │   ├── groups/
        │   ├── layout/
        │   ├── plans/
        │   └── ui/
        ├── context/
        ├── hooks/
        ├── pages/
        ├── services/
        ├── types/
        └── utils/
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
- Ver todos los grupos a los que pertenece el usuario
- Editar nombre, descripción e imagen (solo admin)
- Eliminar grupo de forma suave — `active: false` (solo admin)
- Abandonar grupo — bloqueado si el usuario es el único admin

### Miembros
- Ver todos los miembros con su rol y fecha de ingreso
- Invitar por email: envía enlace firmado con JWT (7 días, incluye rol)
- Aceptar invitación mediante token (requiere sesión activa)
- Promover miembro a admin (solo admin)
- Eliminar miembro (solo admin)

### Planes
- Crear plan con nombre, descripción e imagen opcional; el creador se agrega automáticamente
- Ver planes activos e historial (completados/cancelados) con badge de estado
- Marcar plan como completado (cualquier miembro)
- Agregar miembros del grupo a un plan existente

### Gastos
- Registrar gasto: monto, descripción, quién pagó y entre quiénes se divide
- `paid_by` y cada usuario en `split_among` deben ser miembros del plan
- Ver gastos activos del plan
- Ver todos los gastos sin filtrar (incluye saldados)
- Eliminar gasto permanentemente (solo quien pagó o un admin)
- Saldar todos los gastos activos del plan de una vez (`complete-all`)
- Ver historial de gastos saldados en la página del plan (solo lectura)
- Calcular balance: devuelve la lista mínima de transferencias para saldar todas las deudas

---

## Modelos de datos

> Ver diagrama ERD: https://excalidraw.com/#json=olVvOO9Dz1VEKoHjjlyeW,eFgPh8Lhb2sxh2lJpGRoVA

### User

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `username` | String (único) | Nombre de usuario |
| `email` | String (único) | Correo electrónico |
| `password` | String | Hash bcrypt |
| `isConfirmed` | Boolean | `false` hasta confirmar el email |

### Group

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `name` | String | Nombre del grupo |
| `description` | String | Descripción |
| `image` | String | URL de Cloudinary (opcional) |
| `created_by` | ObjectId → User | Usuario creador |
| `active` | Boolean | `false` = eliminado suavemente |
| `created_at` | Date | Fecha de creación |

### GroupMember

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `group` | ObjectId → Group | Referencia al grupo |
| `user` | ObjectId → User | Referencia al usuario |
| `role` | String | `admin` o `member` (default: `member`) |
| `joined_at` | Date | Fecha de ingreso |

### Plan

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `name` | String | Nombre del plan |
| `description` | String | Descripción (opcional) |
| `image` | String | URL de Cloudinary (opcional) |
| `group` | ObjectId → Group | Grupo al que pertenece |
| `created_by` | ObjectId → User | Usuario creador |
| `members` | [ObjectId → User] | Participantes del plan |
| `state` | String | `active`, `completed` o `cancelled` |
| `created_at` | Date | Fecha de creación |

### Expense

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `description` | String | Etiqueta opcional (ej: "Supermercado") |
| `amount` | Number | Monto total; debe ser > 0 |
| `plan` | ObjectId → Plan | Plan al que pertenece |
| `paid_by` | ObjectId → User | Quién pagó el monto completo |
| `split_among` | [ObjectId → User] | Entre quiénes se divide el costo |
| `state` | String | `active` o `completed` |
| `createdAt` / `updatedAt` | Date | Timestamps automáticos de Mongoose |

---

## Endpoints de la API

> URL base: `http://localhost:3000` (desarrollo)

**Middlewares en rutas protegidas de grupo/plan/gasto:**
```
verifyToken → validateObjectId(...) → verifyRole → controlador
```
`verifyRole` carga `req.group` y `req.member`. Las verificaciones de rol se aplican dentro de cada controlador.

### Autenticación

| Método | Endpoint | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/register` | No | Registrar usuario; envía correo de confirmación |
| POST | `/login` | No | Login con `identifier` + `password`; establece cookie |
| GET | `/confirm/:token` | No | Confirmar email mediante token JWT |
| GET | `/dashboard` | Sí | Devuelve el perfil del usuario autenticado |
| POST | `/logout` | No | Elimina la cookie de sesión |

### Grupos

| Método | Endpoint | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/groups` | Sí | Crear grupo (`multipart/form-data`) |
| GET | `/groups` | Sí | Listar grupos del usuario |
| GET | `/groups/:idGroup` | Sí + miembro | Detalles del grupo |
| PATCH | `/groups/:idGroup` | Sí + admin | Editar grupo |
| DELETE | `/groups/:idGroup` | Sí + admin | Eliminar grupo (soft delete) |
| DELETE | `/groups/:idGroup/leave` | Sí + miembro | Abandonar grupo |

### Miembros

| Método | Endpoint | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/groups/:idGroup/members` | Sí + miembro | Listar miembros con rol y fecha |
| POST | `/groups/:idGroup/invite` | Sí + admin | Enviar invitación por email |
| GET | `/groups/invite/accept/:token` | No | Aceptar invitación |
| PATCH | `/groups/:idGroup/members/:idMember/admin` | Sí + admin | Promover a admin |
| DELETE | `/groups/:idGroup/members/:idMember` | Sí + admin | Eliminar miembro |

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
- El servidor valida al arrancar que `JWT_SECRET` tenga al menos 32 caracteres

### Rate Limiting

Implementado en `middlewares/rate-limit.js` con `express-rate-limit`. El conteo es **por IP**. Al superar el límite se responde con **HTTP 429** y un mensaje en español.

| Scope | Límite | Ventana | Dónde se aplica |
| --- | --- | --- | --- |
| Global | 100 requests | 10 minutos | Todas las rutas (`app.use`) |
| Login | 10 intentos | 15 minutos | `POST /login` |
| Registro | 5 intentos | 1 hora | `POST /register` |

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

---

## Lógica de cálculo de gastos

> Ver diagrama del algoritmo: https://excalidraw.com/#json=qoECKn3HLa9Gni1yvAjYI,ygP05CRQwO31HcxBt1XcgQ

El cálculo ocurre en `expense.controller.js → getBalances` y opera solo sobre gastos `active`.

**Etapa 1 — Balance por usuario**
- El usuario `paid_by` suma el monto total (se le debe ese dinero)
- Cada usuario en `split_among` resta `amount / split_among.length` (su parte)

Resultado: acreedores (balance > 0) y deudores (balance < 0).

**Etapa 2 — Ordenamiento**
Acreedores de mayor a menor; deudores del más negativo al menos negativo.

**Etapa 3 — Emparejamiento greedy**
En cada iteración: el mayor deudor paga al mayor acreedor el mínimo entre lo que debe y lo que le deben. Se repite hasta saldar todo. Garantiza el **número mínimo de transacciones** — O(n log n).

**Redondeo:** `Math.round(value * 100) / 100` en cada paso para evitar errores de punto flotante.

### Ejemplo

| Gasto | Pagó | Dividido entre | Efecto |
| --- | --- | --- | --- |
| $90 | Ana | Ana, Bob, Carol | Ana +60, Bob −30, Carol −30 |
| $60 | Bob | Bob, Carol | Bob +30, Carol −30 |

Balances: Ana **+60**, Bob **+30**, Carol **−90**

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

### Frontend

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo Vite con HMR |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Servir el build localmente |
| `npm run lint` | ESLint sobre todo el código fuente |
