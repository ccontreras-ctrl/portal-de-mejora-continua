# Guía de Despliegue en Cloud Run

## Prerequisitos

- Google Cloud SDK instalado
- Proyecto de Google Cloud configurado
- Permisos para Cloud Run

## Pasos para Desplegar

### 1. Configurar Supabase OAuth

**IMPORTANTE**: Antes de desplegar, debes configurar las URLs de redirección en Supabase:

1. Ve a tu proyecto en Supabase: <https://app.supabase.com>
2. Ve a Authentication > URL Configuration
3. Agrega estas URLs a "Redirect URLs":
   - `https://portal-de-mejora-continua-biapbgtcja-uw.a.run.app`
   - `http://localhost:3000` (para desarrollo local)
4. En "Site URL" configura: `https://portal-de-mejora-continua-biapbgtcja-uw.a.run.app`

### 2. Configurar Google OAuth Provider en Supabase

1. En Supabase, ve a Authentication > Providers
2. Habilita "Google" como provider
3. Configura las credenciales de Google OAuth:
   - Ve a Google Cloud Console
   - Crea un proyecto OAuth 2.0
   - Agrega estas URLs autorizadas de redirección:
     - `https://dqpxgwsdfclmztslstzh.supabase.co/auth/v1/callback`
   - Copia el Client ID y Client Secret a Supabase

### 3. Construir y Desplegar

```bash
# Autenticarse en Google Cloud
gcloud auth login

# Configurar el proyecto
gcloud config set project YOUR_PROJECT_ID

# Construir la imagen Docker
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/portal-mejora-continua

# Desplegar en Cloud Run
gcloud run deploy portal-de-mejora-continua \
  --image gcr.io/YOUR_PROJECT_ID/portal-mejora-continua \
  --platform managed \
  --region us-west1 \
  --allow-unauthenticated \
  --set-env-vars VITE_GEMINI_API_KEY=AIzaSyDekvHEDS6dVVeCb0k4liu6mdbLqJVKoAo,VITE_SUPABASE_URL=https://dqpxgwsdfclmztslstzh.supabase.co,VITE_SUPABASE_ANON_KEY=sb_publishable_o_849Y7sluUJzXRYz8THNw_1Q6FP8nI,VITE_ALLOWED_DOMAIN=suzuval.cl
```

### 4. Verificar el Despliegue

1. Accede a la URL de Cloud Run
2. Intenta hacer login con una cuenta @suzuval.cl
3. Verifica que la redirección de OAuth funcione correctamente

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## Solución de Problemas

### Error: "Redirect URL not allowed"

- Verifica que la URL esté configurada en Supabase > Authentication > URL Configuration

### Error: "Access denied - domain not allowed"

- Solo usuarios con correo @suzuval.cl pueden acceder
- Verifica que la variable VITE_ALLOWED_DOMAIN esté configurada correctamente

### Error: La página se cae después del login

- Verifica que las URLs de redirección en Supabase coincidan exactamente con tu URL de Cloud Run
- Revisa los logs de Cloud Run: `gcloud run logs read portal-de-mejora-continua --region us-west1`

## Variables de Entorno

Asegúrate de que estas variables estén configuradas:

- `VITE_GEMINI_API_KEY`: Tu API key de Google Gemini
- `VITE_SUPABASE_URL`: URL de tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY`: Clave anónima de Supabase
- `VITE_ALLOWED_DOMAIN`: Dominio permitido (suzuval.cl)
