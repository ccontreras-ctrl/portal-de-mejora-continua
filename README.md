<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Portal de Mejora Continua - Suzuval

Portal web interno para gestionar requerimientos de mejora continua (tickets), con seguimiento de principio a fin, herramientas de análisis y reportes.

## 🚀 Características

- ✅ **Autenticación Google OAuth** - Solo usuarios @suzuval.cl
- 📊 **Gestión de Tickets** - Creación, seguimiento y análisis
- 🔄 **Tiempo Real** - Actualizaciones en vivo con Supabase
- 🤖 **IA Integrada** - Análisis con Google Gemini
- 📈 **Reportes y Analytics** - Visualización de datos
- 🔒 **Seguridad** - Row Level Security (RLS) en Supabase

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **IA**: Google Gemini API
- **Deployment**: Google Cloud Run
- **Styling**: TailwindCSS

## 📋 Prerequisitos

- Node.js 20+
- npm o yarn
- Cuenta de Google Cloud (para despliegue)
- Proyecto de Supabase configurado

## 🏃‍♂️ Ejecución Local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` con:

```env
VITE_GEMINI_API_KEY=tu_api_key_aqui
VITE_SUPABASE_URL=https://dqpxgwsdfclmztslstzh.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
VITE_ALLOWED_DOMAIN=suzuval.cl
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🚢 Despliegue en Cloud Run

### Opción 1: Script Automatizado (Windows)

```powershell
.\deploy.ps1
```

### Opción 2: Manual

Ver la guía completa en [DEPLOYMENT.md](./DEPLOYMENT.md)

## ⚙️ Configuración de Supabase

### 1. Configurar OAuth Redirect URLs

En tu proyecto de Supabase (Authentication > URL Configuration):

- **Redirect URLs**:
  - `https://portal-de-mejora-continua-682575749366.us-west1.run.app`
  - `http://localhost:3000`

- **Site URL**: `https://portal-de-mejora-continua-682575749366.us-west1.run.app`

### 2. Configurar Google OAuth Provider

1. Ve a Authentication > Providers en Supabase
2. Habilita "Google"
3. Configura las credenciales de Google OAuth
4. Agrega la URL de callback de Supabase en Google Cloud Console

## 🔒 Seguridad

- ✅ Solo usuarios con correo @suzuval.cl pueden acceder
- ✅ Variables de entorno para credenciales sensibles
- ✅ Row Level Security (RLS) en todas las tablas
- ✅ HTTPS obligatorio en producción

## 📁 Estructura del Proyecto

```
portal-de-mejora-continua/
├── components/          # Componentes React
│   ├── layout/         # Componentes de layout
│   ├── ticket/         # Componentes de tickets
│   ├── ui/             # Componentes UI reutilizables
│   └── views/          # Vistas principales
├── context/            # Context API de React
├── hooks/              # Custom hooks
├── services/           # Servicios (Supabase, Gemini)
├── supabase/           # Schema SQL
├── types.ts            # Definiciones TypeScript
├── App.tsx             # Componente principal
├── index.tsx           # Punto de entrada
├── Dockerfile          # Configuración Docker
└── vite.config.ts      # Configuración Vite
```

## 🐛 Solución de Problemas

### Error: "Redirect URL not allowed"

**Solución**: Verifica que la URL esté configurada en Supabase > Authentication > URL Configuration

### Error: "Access denied - domain not allowed"

**Solución**: Solo usuarios @suzuval.cl pueden acceder. Verifica la variable `VITE_ALLOWED_DOMAIN`

### La página se cae después del login

**Solución**:

1. Verifica las URLs de redirección en Supabase
2. Revisa los logs: `gcloud run logs read portal-de-mejora-continua --region us-west1`

## 📝 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción
- `npm start` - Servir build de producción

## 🌐 URLs

- **Producción**: <https://portal-de-mejora-continua-682575749366.us-west1.run.app>
- **AI Studio**: <https://ai.studio/apps/drive/1OpmlMvQn2D92pkCT7Q0OIhTWRx18b_r9>
- **Supabase**: <https://dqpxgwsdfclmztslstzh.supabase.co>

## 📄 Licencia

ISC

## 👥 Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.
