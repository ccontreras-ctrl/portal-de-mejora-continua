#!/usr/bin/env python3
"""
Script para configurar Supabase usando la API de Management
"""

import requests
import json
import time

# Configuración
SUPABASE_URL = "https://dqpxgwsdfclmztslstzh.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcHhnd3NkZmNsbXp0c2xzdHpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkwMTc1NSwiZXhwIjoyMDg2NDc3NzU1fQ.GJTKZwNkkOGntZJQk-tvwwFKjass6prlGPHUnu6JQ4I"

headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

print("=" * 70)
print("🚀 CONFIGURACIÓN AUTOMÁTICA DE SUPABASE")
print("=" * 70)
print()

# Leer el schema SQL
print("📖 Leyendo schema SQL...")
with open('supabase/schema.sql', 'r', encoding='utf-8') as f:
    schema_sql = f.read()

print("✅ Schema SQL cargado")
print()

print("⚠️  MÉTODO RECOMENDADO:")
print()
print("Debido a las limitaciones de la API de Supabase, la forma más")
print("confiable de ejecutar el schema es a través del SQL Editor web.")
print()
print("🌐 Abre esta URL en tu navegador:")
print()
print("   https://app.supabase.com/project/dqpxgwsdfclmztslstzh/sql/new")
print()
print("=" * 70)
print("📋 SQL PARA COPIAR Y PEGAR:")
print("=" * 70)
print()
print(schema_sql)
print()
print("=" * 70)
print()

# Intentar verificar si las tablas ya existen
print("🔍 Verificando estado actual de las tablas...")
print()

tables_to_check = ["profiles", "tickets", "comments"]
tables_exist = {}

for table in tables_to_check:
    url = f"{SUPABASE_URL}/rest/v1/{table}?limit=0"
    try:
        response = requests.get(url, headers=headers, timeout=5)
        exists = response.status_code == 200
        tables_exist[table] = exists
        
        if exists:
            print(f"  ✅ Tabla '{table}' existe")
        else:
            print(f"  ❌ Tabla '{table}' NO existe")
    except Exception as e:
        print(f"  ⚠️  Error verificando '{table}': {e}")
        tables_exist[table] = False

print()

if all(tables_exist.values()):
    print("=" * 70)
    print("✅ ¡TODAS LAS TABLAS YA EXISTEN!")
    print("=" * 70)
    print()
    print("Tu base de datos está configurada correctamente.")
    print()
else:
    print("=" * 70)
    print("⚠️  ACCIÓN REQUERIDA")
    print("=" * 70)
    print()
    print("Tablas faltantes:")
    for table, exists in tables_exist.items():
        if not exists:
            print(f"  ❌ {table}")
    print()
    print("Por favor, ejecuta el SQL mostrado arriba en el SQL Editor de Supabase.")
    print()

print("=" * 70)
print("📝 PASOS SIGUIENTES:")
print("=" * 70)
print()
print("1. Copia el SQL mostrado arriba")
print("2. Abre: https://app.supabase.com/project/dqpxgwsdfclmztslstzh/sql/new")
print("3. Pega el SQL en el editor")
print("4. Haz clic en 'Run' o presiona Ctrl+Enter")
print("5. Ejecuta este script nuevamente para verificar")
print()
print("=" * 70)
