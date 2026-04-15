# VaquitApp

VaquitApp es una aplicacion web para organizar los gastos de salidas y planes grupales. Los usuarios pueden crear grupos, invitar miembros, crear planes dentro de cada grupo y registrar gastos, con el objetivo de calcular automaticamente cuanto debe pagar cada persona y a quien le debe dinero.

---

## Tabla de Contenidos

- [Stack Tecnologico](#stack-tecnologico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Modelos de Datos](#modelos-de-datos)
- [Endpoints de la API](#endpoints-de-la-api)
- [Ejemplos de Request y Response](#ejemplos-de-request-y-response)
- [Variables de Entorno](#variables-de-entorno)
- [Instalacion y Configuracion](#instalacion-y-configuracion)
- [Scripts](#scripts)
- [Roles y Permisos](#roles-y-permisos)
- [Sistema de Autenticacion](#sistema-de-autenticacion)
- [Contextos del Frontend](#contextos-del-frontend)
- [Paginas y Componentes](#paginas-y-componentes)
- [Servicios del Frontend](#servicios-del-frontend)
- [Logica de Calculo de Gastos](#logica-de-calculo-de-gastos)

---

## Stack Tecnologico

| Capa | Tecnologia | Version |
|---|---|---|
| Runtime backend | Node.js | - |
| Framework backend | Express.js | ^5.2.1 |
| Base de datos | MongoDB (Mongoose ODM) | ^9.3.3 |
| Autenticacion | JSON Web Token (jsonwebtoken) | ^9.0.3 |
| Hash de contrasenas | bcryptjs | ^3.0.3 |
| Almacenamiento de imagenes | Cloudinary SDK v2 | ^2.9.0 |
| Envio de emails | Nodemailer (Gmail SMTP) | ^8.0.4 |
| Subida de archivos | Multer (memoria) | ^2.1.1 |
| CORS / Cookies | cors + cookie-parser | ^2.8.6 / ^1.4.7 |
| Runtime frontend | React | ^19.2.4 |
| Lenguaje frontend | TypeScript | ~5.9.3 |
| Estilos | Tailwind CSS | ^4.2.2 |
| Build tool | Vite | ^8.0.1 |
| HTTP Client | Axios | ^1.14.0 |
| Formularios | React Hook Form | ^7.72.0 |
| Routing | React Router DOM | ^7.13.2 |
| Alertas | SweetAlert2 | ^11.26.24 |
| Iconos | Bootstrap Icons | ^1.13.1 |

---

## Estructura del Proyecto

```
VaquitApp/
├── backend/
│   ├── config/
│   │   ├── cloudinary.config.js   # Configuracion de Cloudinary
│   │   ├── db.config.js           # Conexion a MongoDB
│   │   └── mail.config.js         # Transporter de Nodemailer (Gmail)
│   ├── controllers/
│   │   ├── auth.controller.js     # Registro, login, confirmacion, logout
│   │   ├── group.controller.js    # CRUD grupos, miembros e invitaciones
│   │   └── plan.controller.js     # CRUD planes
│   ├── middlewares/
│   │   ├── multer.js              # Almacenamiento en memoria para uploads
│   │   ├── validate-object-id.js  # Validacion de IDs de MongoDB
│   │   ├── verify-auth.js         # Verificacion de JWT en cookie
│   │   └── verify-role.js         # Verificacion de pertenencia al grupo
│   ├── models/
│   │   ├── expense.model.js       # Modelo de Gasto
│   │   ├── group.model.js         # Modelo de Grupo
│   │   ├── groupMember.model.js   # Modelo de Miembro del Grupo
│   │   ├── plan.model.js          # Modelo de Plan
│   │   └── user.model.js          # Modelo de Usuario
│   ├── repository/
│   │   ├── auth.repository.js     # Operaciones de DB para User
│   │   ├── group.repository.js    # Operaciones de DB para Group + GroupMember
│   │   └── plan.repository.js     # Operaciones de DB para Plan
│   ├── routes/
│   │   ├── auth.routes.js         # Rutas de autenticacion
│   │   ├── group.routes.js        # Rutas de grupos y miembros
│   │   └── plan.routes.js         # Rutas de planes
│   ├── app.js                     # Configuracion de Express (middlewares globales, CORS)
│   ├── index.js                   # Punto de entrada
│   ├── server.js                  # Inicializacion del servidor
│   └── package.json
│
└── frontend/
    └── src/
        ├── components/
        │   ├── groups/            # AddMember, AllMembers, MemberItem,
        │   │                      # MyGroupCard, MyGroups, SideNavGroup
        │   ├── layout/            # HeaderDashboard, VerifyAuth
        │   ├── plans/             # AllPlans, PlanItem
        │   └── ui/                # Loader
        ├── context/
        │   ├── AuthContext.tsx    # Estado global de autenticacion
        │   ├── GroupContext.tsx   # Estado global de grupos y miembros
        │   └── PlanContext.tsx    # Estado global de planes
        ├── hooks/
        │   ├── useAuth.tsx        # Hook para AuthContext
        │   ├── useGroup.tsx       # Hook para GroupContext
        │   └── usePlan.tsx        # Hook para PlanContext
        ├── pages/
        │   ├── AcceptInvitation.tsx
        │   ├── ConfirmUser.tsx
        │   ├── Dashboard.tsx
        │   ├── Group.tsx
        │   ├── Login.tsx
        │   ├── NewGroup.tsx
        │   └── Register.tsx
        ├── services/
        │   ├── auth.service.ts    # Llamadas HTTP de autenticacion
        │   ├── groups.service.ts  # Llamadas HTTP de grupos
        │   └── plans.service.ts   # Llamadas HTTP de planes
        ├── types/
        │   ├── auth.types.ts      # Interfaces de autenticacion
        │   ├── groups.types.ts    # Interfaces de grupos y miembros
        │   └── plans.types.ts     # Interfaces de planes
        ├── utils/
        │   └── date.ts            # Utilidades de formato de fechas
        ├── App.tsx                # Definicion de rutas y providers
        └── main.tsx
```

---

## Funcionalidades

### Autenticacion
- Registro de usuario con nombre de usuario, email y contrasena
- Confirmacion de cuenta por email (enlace con JWT de 24 horas)
- Login con email o nombre de usuario (JWT almacenado en cookie httpOnly de 7 dias)
- Logout con limpieza de cookie
- Proteccion de rutas: las paginas privadas verifican sesion activa antes de renderizar

### Grupos
- Crear grupos con nombre, descripcion e imagen opcional (almacenada en Cloudinary)
- Listar todos los grupos a los que pertenece el usuario autenticado
- Ver detalle de un grupo (solo miembros)
- Editar nombre, descripcion e imagen del grupo (solo admins)
- Eliminar grupo de forma logica (campo `active: false`, solo admins)

### Miembros y Roles
- Listar miembros de un grupo con su rol
- Invitar usuarios por email con rol asignado (admin o member) mediante enlace JWT de 7 dias
- Aceptar invitacion desde el enlace del email
- Eliminar miembros del grupo (solo admins)
- Otorgar rol de admin a un miembro (solo admins)

### Planes
- Listar todos los planes activos de un grupo
- Crear planes con nombre, descripcion, imagen opcional y lista de miembros participantes
- Validacion de que los miembros del plan pertenecen al grupo
- Marcar plan como completado
- Agregar miembros adicionales a un plan existente

### Gastos (modelo definido, endpoints pendientes)
- El modelo `Expense` registra monto, quien pago, el plan al que pertenece y entre quienes se divide

---

## Modelos de Datos

> Ver diagrama ERD: [![Ver en Excalidraw](https://img.shields.io/badge/Excalidraw-Ver%20diagrama%20ERD-6965db?style=flat)](https://excalidraw.com/#json=eD5PED0cEl7YkqjAES21n,4AX3_inJAucEtvPSnbTBig)

### User

| Campo | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `_id` | ObjectId | auto | Identificador unico generado por MongoDB |
| `username` | String | Si | Nombre de usuario, debe ser unico |
| `email` | String | Si | Email del usuario, debe ser unico |
| `password` | String | Si | Contrasena hasheada con bcryptjs (salt 10) |
| `isConfirmed` | Boolean | No | Indica si el email fue confirmado. Default: `false` |

### Group

| Campo | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `_id` | ObjectId | auto | Identificador unico |
| `name` | String | Si | Nombre del grupo |
| `description` | String | Si | Descripcion del grupo |
| `image` | String | No | URL de imagen almacenada en Cloudinary |
| `created_by` | ObjectId (ref User) | Si | Usuario que creo el grupo |
| `active` | Boolean | No | Soft delete: `false` indica grupo eliminado. Default: `true` |
| `created_at` | Date | No | Fecha de creacion. Default: `Date.now` |

### GroupMember

| Campo | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `_id` | ObjectId | auto | Identificador unico |
| `group` | ObjectId (ref Group) | Si | Grupo al que pertenece el miembro |
| `user` | ObjectId (ref User) | Si | Usuario miembro |
| `role` | String (enum) | No | Rol dentro del grupo: `admin` o `member`. Default: `member` |
| `joined_at` | Date | No | Fecha en que se unio. Default: `Date.now` |

### Plan

| Campo | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `_id` | ObjectId | auto | Identificador unico |
| `name` | String | Si | Nombre del plan |
| `description` | String | No | Descripcion del plan |
| `image` | String | No | URL de imagen almacenada en Cloudinary |
| `group` | ObjectId (ref Group) | Si | Grupo al que pertenece el plan |
| `created_by` | ObjectId (ref User) | Si | Usuario que creo el plan |
| `members` | [ObjectId (ref User)] | No | Lista de usuarios participantes del plan |
| `state` | String (enum) | No | Estado: `active`, `completed`, `cancelled`. Default: `active` |
| `created_at` | Date | No | Fecha de creacion. Default: `Date.now` |

### Expense

| Campo | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `_id` | ObjectId | auto | Identificador unico |
| `description` | String | No | Descripcion del gasto |
| `amount` | Number | Si | Monto del gasto (min: 0) |
| `plan` | ObjectId (ref Plan) | Si | Plan al que pertenece el gasto |
| `paid_by` | ObjectId (ref User) | Si | Usuario que realizo el pago |
| `split_among` | [ObjectId (ref User)] | No | Usuarios entre quienes se divide el gasto |
| `createdAt` | Date | auto | Timestamp automatico (Mongoose timestamps) |
| `updatedAt` | Date | auto | Timestamp automatico (Mongoose timestamps) |

---

## Endpoints de la API

> Ver diagrama de flujo de auth e invitaciones: [![Ver en Excalidraw](https://img.shields.io/badge/Excalidraw-Ver%20flujo%20de%20auth%20e%20invitaciones-6965db?style=flat)](https://excalidraw.com/#json=qGLfcb9lJoyk7863fVerV,6x8Z-8kOMHa31nTPPT8izg)

**Base URL:** configurada mediante `VITE_API_URL` en el frontend y servida por Express en el puerto `PORT` del backend.

**Autenticacion:** las rutas protegidas requieren un JWT valido en la cookie `token` (httpOnly), enviado automaticamente por el navegador con cada request gracias a `credentials: true` en Axios.

### Autenticacion

| Metodo | Endpoint | Auth | Descripcion |
|---|---|---|---|
| POST | `/register` | No | Registra un nuevo usuario y envia email de confirmacion |
| POST | `/login` | No | Autentica al usuario y devuelve JWT en cookie httpOnly |
| GET | `/confirm/:token` | No | Confirma la cuenta del usuario mediante el token del email |
| GET | `/dashboard` | Si | Retorna los datos del usuario autenticado |
| POST | `/logout` | No | Limpia la cookie de sesion |

### Grupos

| Metodo | Endpoint | Auth | Rol Requerido | Descripcion |
|---|---|---|---|---|
| GET | `/groups` | Si | Cualquier miembro | Lista todos los grupos activos del usuario autenticado |
| POST | `/groups` | Si | - | Crea un nuevo grupo (el creador queda como admin automaticamente) |
| GET | `/groups/:idGroup` | Si | Miembro del grupo | Retorna los datos de un grupo especifico |
| PATCH | `/groups/:idGroup` | Si | Admin | Edita nombre, descripcion e imagen del grupo |
| DELETE | `/groups/:idGroup` | Si | Admin | Elimina el grupo de forma logica (`active: false`) |

### Miembros del Grupo

| Metodo | Endpoint | Auth | Rol Requerido | Descripcion |
|---|---|---|---|---|
| GET | `/groups/:idGroup/members` | Si | Miembro del grupo | Lista todos los miembros y sus roles |
| DELETE | `/groups/:idGroup/members/:idMember` | Si | Admin | Elimina a un miembro del grupo |
| PATCH | `/groups/:idGroup/members/:idMember/admin` | Si | Admin | Otorga el rol de admin a un miembro |

### Invitaciones

| Metodo | Endpoint | Auth | Descripcion |
|---|---|---|---|
| POST | `/groups/:idGroup/invite` | Si (Admin) | Envia una invitacion por email con rol asignado (JWT de 7 dias) |
| GET | `/groups/invite/accept/:token` | No | Acepta la invitacion y agrega al usuario como miembro del grupo |

### Planes

| Metodo | Endpoint | Auth | Rol Requerido | Descripcion |
|---|---|---|---|---|
| GET | `/:idGroup/plans` | Si | Miembro del grupo | Lista todos los planes activos del grupo |
| POST | `/:idGroup/plans` | Si | Miembro del grupo | Crea un nuevo plan con imagen opcional y lista de miembros |
| PATCH | `/:idGroup/plans/:idPlan/complete` | Si | Miembro del grupo | Marca un plan como completado (`state: 'completed'`) |
| PATCH | `/:idGroup/plans/:idPlan/addMembers` | Si | Miembro del grupo | Agrega miembros adicionales a un plan existente |

---

## Ejemplos de Request y Response

### POST /register

**Request body:**
```json
{
  "username": "juan123",
  "email": "juan@example.com",
  "password": "miContrasena"
}
```

**Response 201:**
```json
{
  "message": "Usuario registrado exitosamente"
}
```

### POST /login

**Request body:**
```json
{
  "identifier": "juan123",
  "password": "miContrasena"
}
```

**Response 200:**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": "664f1a...",
    "username": "juan123",
    "email": "juan@example.com"
  }
}
```
La cookie `token` (httpOnly, SameSite, maxAge 7 dias) se establece automaticamente en la respuesta.

### POST /groups

**Request:** `multipart/form-data`

| Campo | Tipo | Descripcion |
|---|---|---|
| `name` | string | Nombre del grupo (requerido) |
| `description` | string | Descripcion del grupo (requerido) |
| `image` | file | Imagen del grupo (opcional, se sube a Cloudinary) |

**Response 201:**
```json
{
  "message": "Grupo creado exitosamente",
  "groupCreated": {
    "_id": "665a2b...",
    "name": "Los del asado",
    "description": "Asados de los domingos",
    "image": "https://res.cloudinary.com/...",
    "created_by": "664f1a...",
    "active": true,
    "created_at": "2026-04-12T10:00:00.000Z"
  }
}
```

### POST /groups/:idGroup/invite

**Request body:**
```json
{
  "email": "amigo@example.com",
  "role": "member"
}
```

**Response 200:**
```json
{
  "message": "Invitacion enviada exitosamente"
}
```
Se envia un email al destinatario con un enlace que contiene un JWT firmado con `{ groupId, email, role }` con expiracion de 7 dias.

### POST /:idGroup/plans

**Request:** `multipart/form-data`

| Campo | Tipo | Descripcion |
|---|---|---|
| `name` | string | Nombre del plan (requerido) |
| `description` | string | Descripcion del plan (requerido) |
| `members` | string[] | Array de IDs de usuarios del grupo (requerido, min 1) |
| `image` | file | Imagen del plan (opcional) |

---

## Variables de Entorno

### Backend (`backend/.env`)

| Variable | Descripcion | Ejemplo |
|---|---|---|
| `PORT` | Puerto en el que corre el servidor | `4000` |
| `MONGO_URI` | URI de conexion a MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/vaquitapp` |
| `JWT_SECRET` | Clave secreta para firmar y verificar tokens JWT | `mi_clave_super_secreta` |
| `FRONTEND_URL` | URL base del frontend (para CORS y enlaces en emails) | `http://localhost:5173` |
| `EMAIL_USER` | Cuenta de Gmail usada para enviar emails | `app@gmail.com` |
| `EMAIL_PASS` | Contrasena de aplicacion de Gmail (no la contrasena normal) | `abcd efgh ijkl mnop` |
| `CLOUDINARY_CLOUD_NAME` | Nombre del cloud en Cloudinary | `mi_cloud` |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary | `123456789012345` |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary | `aBcDeFgHiJkLmNoP` |
| `NODE_ENV` | Entorno de ejecucion (afecta configuracion de cookies) | `development` o `production` |

### Frontend (`frontend/.env`)

| Variable | Descripcion | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:4000` |

---

## Instalacion y Configuracion

### Requisitos previos

- Node.js >= 18
- Una base de datos MongoDB (local o Atlas)
- Una cuenta de Cloudinary (plan gratuito suficiente)
- Una cuenta de Gmail con contrasena de aplicacion habilitada

### Backend

```bash
# 1. Ingresar a la carpeta del backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
cp .env.example .env
# Editar .env con los valores reales

# 4. Iniciar en modo desarrollo
npm run dev

# O en modo produccion
npm start
```

### Frontend

```bash
# 1. Ingresar a la carpeta del frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
# Crear frontend/.env con:
# VITE_API_URL=http://localhost:4000

# 4. Iniciar en modo desarrollo
npm run dev

# Construir para produccion
npm run build
```

---

## Scripts

### Backend

| Comando | Descripcion |
|---|---|
| `npm start` | Inicia el servidor con Node.js (`node index.js`) |
| `npm run dev` | Inicia el servidor con Nodemon (recarga automatica al detectar cambios) |

### Frontend

| Comando | Descripcion |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo de Vite |
| `npm run build` | Compila TypeScript y genera el build de produccion |
| `npm run preview` | Previsualiza el build de produccion localmente |
| `npm run lint` | Ejecuta ESLint sobre el codigo fuente |

---

## Roles y Permisos

> Ver diagrama de arquitectura del sistema: [![Ver en Excalidraw](https://img.shields.io/badge/Excalidraw-Ver%20arquitectura%20del%20sistema-6965db?style=flat)](https://excalidraw.com/#json=76iZRa1G1VEyvA4miaiN7,3oHSGacV76a0u4OtDBlUmA)

Los roles se aplican **por grupo**: un mismo usuario puede ser admin en un grupo y member en otro.

| Accion | admin | member |
|---|---|---|
| Ver datos del grupo | Si | Si |
| Ver miembros del grupo | Si | Si |
| Ver planes del grupo | Si | Si |
| Crear planes | Si | Si |
| Marcar plan como completado | Si | Si |
| Agregar miembros a un plan | Si | Si |
| Invitar usuarios al grupo | Si | No |
| Eliminar miembros del grupo | Si | No |
| Otorgar rol de admin | Si | No |
| Editar nombre/descripcion/imagen del grupo | Si | No |
| Eliminar el grupo | Si | No |

**Implementacion:** el middleware `verifyRole` carga el grupo y la relacion `GroupMember` del usuario en `req.group` y `req.member`. Los controladores consultan `req.member.role` para verificar si es `admin` antes de ejecutar operaciones restringidas.

---

## Sistema de Autenticacion

> Ver diagrama de flujos: [![Ver en Excalidraw](https://img.shields.io/badge/Excalidraw-Ver%20flujo%20de%20auth%20e%20invitaciones-6965db?style=flat)](https://excalidraw.com/#json=qGLfcb9lJoyk7863fVerV,6x8Z-8kOMHa31nTPPT8izg)

### Flujo de registro y confirmacion

1. El usuario envia `POST /register` con `{ username, email, password }`.
2. El backend valida unicidad de email y username, hashea la contrasena con bcryptjs (salt 10) y crea el documento `User` con `isConfirmed: false`.
3. Se genera un JWT firmado con `{ id }` y expiracion de 24 horas. Se envia un email con el enlace `{FRONTEND_URL}/confirmar/:token`.
4. El usuario hace click en el enlace. El frontend llama a `GET /confirm/:token`.
5. El backend verifica el JWT, encuentra el usuario y actualiza `isConfirmed: true`.

### Flujo de login

1. El usuario envia `POST /login` con `{ identifier, password }` (identifier puede ser email o username).
2. El backend busca el usuario por email o username, verifica que `isConfirmed: true` y compara la contrasena con bcryptjs.
3. Si las credenciales son validas, genera un JWT con `{ id }` y expiracion de 7 dias. Lo almacena en una cookie `httpOnly`, `SameSite: lax` (dev) / `none` (prod), `secure` en produccion.

### Proteccion de rutas

**Backend:** el middleware `verifyToken` lee la cookie `token`, verifica el JWT con `process.env.JWT_SECRET` y almacena el payload decodificado en `req.user`.

**Frontend:** el componente `VerifyAuth` envuelve las rutas privadas. Llama a `GET /dashboard` al iniciar la app. Si la cookie es valida, el usuario queda en el estado global de `AuthContext`. Si no hay sesion, redirige a `/`.

### Flujo de invitacion

1. Un admin envia `POST /groups/:idGroup/invite` con `{ email, role }`.
2. El backend verifica que el solicitante sea admin, genera un JWT con `{ groupId, email, role }` de 7 dias de duracion y envia un email con el enlace `{FRONTEND_URL}/invitacion/:token`.
3. El invitado (que debe estar registrado en la app) hace click en el enlace. La pagina `AcceptInvitation` llama a `GET /groups/invite/accept/:token`.
4. El backend decodifica el token, verifica que el grupo este activo y que exista un usuario con ese email, y crea un documento `GroupMember`.

---

## Contextos del Frontend

El estado global se gestiona mediante tres contextos de React, cada uno con su hook correspondiente.

### AuthContext (`useAuth`)

Maneja el ciclo de vida de la sesion del usuario.

| Estado / Funcion | Tipo | Descripcion |
|---|---|---|
| `user` | `User \| null` | Datos del usuario autenticado (`_id`, `username`, `email`) |
| `loadingAuth` | `LoadingAuth` | Flags de carga para login, registro, dashboard y confirmacion |
| `registerUser(data)` | `async` | Registra un nuevo usuario |
| `loginUser(data)` | `async` | Autentica al usuario y actualiza `user` en el estado |
| `logoutUser()` | `async` | Llama a `/logout` y limpia `user` del estado |
| `confirmUser(token)` | `async` | Confirma la cuenta del usuario con el token del email |

Al montar la app, `AuthContext` ejecuta automaticamente `GET /dashboard` para restaurar la sesion si existe una cookie valida.

### GroupContext (`useGroup`)

Maneja grupos, detalles de grupo y miembros.

| Estado / Funcion | Tipo | Descripcion |
|---|---|---|
| `groups` | `GroupMember[] \| null` | Lista de grupos del usuario (incluye rol) |
| `groupById` | `Group \| null` | Datos del grupo actualmente visualizado |
| `members` | `Members[] \| null` | Lista de miembros del grupo actualmente visualizado |
| `loading` | `LoadingGroups` | Flags: `fetchLoading`, `createLoading`, `invitationLoading` |
| `getMyGroups()` | `async` | Carga los grupos del usuario |
| `createGroup(formData)` | `async` | Crea un grupo y recarga la lista |
| `getGroupById(id)` | `async` | Carga los datos de un grupo especifico |
| `getMembersByGroup(id)` | `async` | Carga los miembros de un grupo |
| `inviteMember(id, data)` | `async` | Envia invitacion por email |
| `acceptInvitation(token)` | `async` | Acepta la invitacion |
| `deleteMember(idGroup, idUser)` | `async` | Elimina un miembro y actualiza el estado local |

### PlanContext (`usePlan`)

Maneja los planes del grupo actualmente visualizado.

| Estado / Funcion | Tipo | Descripcion |
|---|---|---|
| `plans` | `Plans[]` | Lista de planes del grupo |
| `loading` | `LoadingPlans` | Flags: `fetchLoading`, `createLoading` |
| `getPlans(idGroup)` | `async` | Carga los planes del grupo |
| `createPlan(data, idGroup)` | `async` | Crea un plan y lo agrega al estado local |

---

## Paginas y Componentes

### Rutas del Frontend

| Ruta | Componente | Autenticacion | Descripcion |
|---|---|---|---|
| `/` | `Login` | Publica | Formulario de inicio de sesion |
| `/registro` | `Register` | Publica | Formulario de registro de cuenta |
| `/confirmar/:token` | `ConfirmUser` | Publica | Confirma la cuenta mediante el token del email |
| `/inicio` | `Dashboard` | Privada | Panel principal con lista de grupos del usuario |
| `/nuevo-grupo` | `NewGroup` | Privada | Formulario de creacion de nuevo grupo |
| `/grupo/:idGroup` | `Group` | Privada | Vista detallada de un grupo (miembros y planes) |
| `/invitacion/:token` | `AcceptInvitation` | Privada | Acepta la invitacion a un grupo |

Las rutas privadas son envueltas por el componente `VerifyAuth`, que bloquea el acceso si no hay sesion activa.

### Componentes

#### Layout
| Componente | Descripcion |
|---|---|
| `VerifyAuth` | Guard de rutas privadas. Muestra un loader mientras verifica la sesion y redirige a `/` si no hay usuario |
| `HeaderDashboard` | Barra superior fija con logo, nombre de usuario y boton de cerrar sesion |

#### Grupos (`components/groups/`)
| Componente | Descripcion |
|---|---|
| `MyGroups` | Grid de tarjetas de grupos del usuario |
| `MyGroupCard` | Tarjeta individual de grupo con imagen, nombre y descripcion |
| `SideNavGroup` | Navegacion lateral dentro de la vista de grupo (Miembros, Agregar miembro, Planes) |
| `AllMembers` | Lista de miembros del grupo con contador |
| `MemberItem` | Fila de un miembro con avatar, nombre, rol y boton de eliminar |
| `AddMember` | Formulario para invitar a un usuario por email con seleccion de rol |

#### Planes (`components/plans/`)
| Componente | Descripcion |
|---|---|
| `AllPlans` | Grid de tarjetas de planes del grupo |
| `PlanItem` | Tarjeta de plan con imagen, nombre, descripcion, estado, avatares de miembros y fecha |

#### UI (`components/ui/`)
| Componente | Descripcion |
|---|---|
| `Loader` | Spinner de carga generico |

---

## Servicios del Frontend

Todos los servicios usan una instancia de Axios configurada con `baseURL: VITE_API_URL` y `withCredentials: true` para enviar la cookie de sesion automaticamente.

### auth.service.ts

| Funcion | Metodo | Endpoint | Descripcion |
|---|---|---|---|
| `registerUserService(data)` | POST | `/register` | Registra un nuevo usuario |
| `loginUserService(data)` | POST | `/login` | Autentica al usuario |
| `dashboardService()` | GET | `/dashboard` | Verifica sesion activa |
| `confirmUserService(token)` | GET | `/confirm/:token` | Confirma la cuenta |
| `logoutService()` | POST | `/logout` | Cierra la sesion |

### groups.service.ts

| Funcion | Metodo | Endpoint | Descripcion |
|---|---|---|---|
| `getUserGroupsService()` | GET | `/groups` | Obtiene los grupos del usuario |
| `createGroupService(formData)` | POST | `/groups` | Crea un grupo (multipart/form-data) |
| `getGroupDetailsService(id)` | GET | `/groups/:id` | Obtiene datos de un grupo |
| `getGroupMembersService(id)` | GET | `/groups/:id/members` | Obtiene miembros del grupo |
| `inviteMemberService(id, data)` | POST | `/groups/:id/invite` | Envia invitacion |
| `acceptInvitationService(token)` | GET | `/groups/invite/accept/:token` | Acepta la invitacion |
| `deleteMemberService(idGroup, idUser)` | DELETE | `/groups/:id/members/:idUser` | Elimina un miembro |

### plans.service.ts

| Funcion | Metodo | Endpoint | Descripcion |
|---|---|---|---|
| `getAllPlansService(idGroup)` | GET | `/:idGroup/plans` | Obtiene los planes del grupo |
| `createPlanService(data, idGroup)` | POST | `/:idGroup/plans` | Crea un plan (multipart/form-data) |

---

## Logica de Calculo de Gastos

> Esta funcionalidad esta parcialmente implementada (el modelo `Expense` esta definido; los endpoints y el algoritmo de calculo estan pendientes).

### Estructura del gasto

Cada `Expense` registra:
- `amount`: el monto total del gasto
- `paid_by`: quien realizo el pago completo
- `split_among`: lista de usuarios entre quienes se divide el costo

### Algoritmo de division (planificado)

Para un gasto de monto `M` pagado por el usuario `P` y dividido entre `N` usuarios (incluyendo a `P`):

```
cuota_individual = M / N

Por cada usuario U en split_among:
  si U != P:
    U le debe (cuota_individual) a P
```

Para calcular el balance total de un plan, se suman todos los gastos. Si un usuario tiene saldo negativo, debe dinero. Si tiene saldo positivo, se le debe dinero. Se aplica un algoritmo de simplificacion de deudas para minimizar la cantidad de transferencias necesarias entre los participantes.
