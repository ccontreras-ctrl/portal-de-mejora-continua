#!/usr/bin/env python3
"""
Script para ejecutar el schema SQL en Supabase usando psycopg2
"""

import sys

try:
    import psycopg2
    from psycopg2 import sql
except ImportError:
    print("❌ Error: psycopg2 no está instalado")
    print("Instalando psycopg2...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "psycopg2-binary"])
    import psycopg2
    from psycopg2 import sql

# Leer el schema SQL
with open('supabase/schema.sql', 'r', encoding='utf-8') as f:
    schema_sql = f.read()

# Configuración de conexión
# Nota: Supabase no expone directamente PostgreSQL, necesitamos usar la API REST
# o el SQL Editor de la interfaz web

print("=" * 60)
print("🚀 EJECUTANDO SCHEMA SQL EN SUPABASE")
print("=" * 60)
print()

print("⚠️  IMPORTANTE:")
print("Supabase no permite conexiones directas a PostgreSQL desde scripts externos")
print("por razones de seguridad.")
print()
print("Para ejecutar el schema SQL, sigue estos pasos:")
print()
print("1. Abre tu navegador y ve a:")
print("   https://app.supabase.com/project/dqpxgwsdfclmztslstzh/sql/new")
print()
print("2. Copia TODO el contenido que se muestra a continuación")
print()
print("3. Pégalo en el SQL Editor de Supabase")
print()
print("4. Haz clic en 'Run' (o presiona Ctrl+Enter)")
print()
print("=" * 60)
print("📋 SCHEMA SQL PARA COPIAR:")
print("=" * 60)
print()
print(schema_sql)
print()
print("=" * 60)
print("✅ Copia el SQL de arriba y ejecútalo en Supabase")
print("=" * 60)
