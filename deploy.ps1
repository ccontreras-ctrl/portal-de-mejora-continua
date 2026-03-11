# Script de despliegue para Cloud Run (Windows PowerShell)
# Este script construye y despliega la aplicación en Google Cloud Run

$ErrorActionPreference = "Stop"

Write-Host "🚀 Iniciando despliegue del Portal de Mejora Continua..." -ForegroundColor Green

# Variables
$PROJECT_ID = "gen-lang-client-0536950088"
$SERVICE_NAME = "portal-de-mejora-continua"
$REGION = "us-west1"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Verificar que gcloud esté instalado
if (!(Get-Command gcloud -ErrorAction SilentlyContinue)) {
  Write-Host "❌ Error: gcloud CLI no está instalado" -ForegroundColor Red
  Write-Host "Instálalo desde: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
  exit 1
}

# Autenticarse (si es necesario)
Write-Host "🔐 Verificando autenticación..." -ForegroundColor Cyan
gcloud auth list

# Configurar el proyecto
Write-Host "⚙️  Configurando proyecto: $PROJECT_ID" -ForegroundColor Cyan
gcloud config set project $PROJECT_ID

# Construir la imagen Docker con argumentos de construcción usando cloudbuild.yaml
Write-Host "🔨 Construyendo imagen Docker en Cloud Build..." -ForegroundColor Cyan
gcloud builds submit --config cloudbuild.yaml `
  --substitutions="_VITE_SUPABASE_URL=https://dqpxgwsdfclmztslstzh.supabase.co,_VITE_SUPABASE_ANON_KEY=sb_publishable_o_849Y7sluUJzXRYz8THNw_1Q6FP8nI,_VITE_GEMINI_API_KEY=AIzaSyDbYTpOiQWE4Xza955RVGEY7C-3hBZEE0g,_VITE_ALLOWED_DOMAIN=suzuval.cl"

# Desplegar en Cloud Run (limpiando volúmenes para evitar que GCS sobrescriba el código)
Write-Host "☁️  Desplegando en Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $SERVICE_NAME `
  --image $IMAGE_NAME `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --clear-volumes `
  --set-env-vars "VITE_GEMINI_API_KEY=AIzaSyDbYTpOiQWE4Xza955RVGEY7C-3hBZEE0g,VITE_SUPABASE_URL=https://dqpxgwsdfclmztslstzh.supabase.co,VITE_SUPABASE_ANON_KEY=sb_publishable_o_849Y7sluUJzXRYz8THNw_1Q6FP8nI,VITE_ALLOWED_DOMAIN=suzuval.cl"

Write-Host "✅ Despliegue completado!" -ForegroundColor Green
Write-Host "✅ Despliegue completado! Revisa la URL arriba en el output de gcloud." -ForegroundColor Green
