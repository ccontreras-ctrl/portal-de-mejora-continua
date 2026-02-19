#!/bin/bash

# Script de despliegue para Cloud Run
# Este script construye y despliega la aplicación en Google Cloud Run

set -e

echo "🚀 Iniciando despliegue del Portal de Mejora Continua..."

# Variables
PROJECT_ID="your-project-id"  # Reemplazar con tu Project ID
SERVICE_NAME="portal-de-mejora-continua"
REGION="us-west1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Verificar que gcloud esté instalado
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI no está instalado"
    echo "Instálalo desde: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Autenticarse (si es necesario)
echo "🔐 Verificando autenticación..."
gcloud auth list

# Configurar el proyecto
echo "⚙️  Configurando proyecto: ${PROJECT_ID}"
gcloud config set project ${PROJECT_ID}

# Construir la imagen Docker
echo "🔨 Construyendo imagen Docker..."
gcloud builds submit --tag ${IMAGE_NAME}

# Desplegar en Cloud Run
echo "☁️  Desplegando en Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars VITE_GEMINI_API_KEY=AIzaSyDekvHEDS6dVVeCb0k4liu6mdbLqJVKoAo,VITE_SUPABASE_URL=https://dqpxgwsdfclmztslstzh.supabase.co,VITE_SUPABASE_ANON_KEY=sb_publishable_o_849Y7sluUJzXRYz8THNw_1Q6FP8nI,VITE_ALLOWED_DOMAIN=suzuval.cl

echo "✅ Despliegue completado!"
echo "🌐 URL: https://portal-de-mejora-continua-682575749366.us-west1.run.app"
