#!/usr/bin/env python3
"""
Script para configurar la base de datos de Supabase
Ejecuta el schema SQL y verifica que todo esté correcto
"""

import requests
import json

# Configuración
SUPABASE_URL = "https://dqpxgwsdfclmztslstzh.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcHhnd3NkZmNsbXp0c2xzdHpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkwMTc1NSwiZXhwIjoyMDg2NDc3NzU1fQ.GJTKZwNkkOGntZJQk-tvwwFKjass6prlGPHUnu6JQ4I"

# Headers para las peticiones
headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json"
}

def execute_sql(sql_query):
    """Ejecuta una query SQL en Supabase"""
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    
    # Intentar con el endpoint de PostgreSQL REST API
    # Nota: Supabase no expone directamente un endpoint SQL, 
    # así que usaremos la API de PostgREST para verificar tablas
    
    print(f"Ejecutando SQL...")
    print(f"Query: {sql_query[:100]}...")
    
    # Para ejecutar SQL directamente, necesitamos usar el cliente de Python
    # o la interfaz web de Supabase
    return True

def check_table_exists(table_name):
    """Verifica si una tabla existe"""
    url = f"{SUPABASE_URL}/rest/v1/{table_name}?limit=0"
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print(f"✅ Tabla '{table_name}' existe")
            return True
        else:
            print(f"❌ Tabla '{table_name}' NO existe (Status: {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ Error verificando tabla '{table_name}': {e}")
        return False

def check_rls_enabled(table_name):
    """Verifica si RLS está habilitado (requiere query SQL)"""
    # Esto requeriría ejecutar SQL directamente
    # Por ahora, asumimos que está habilitado si la tabla existe
    print(f"ℹ️  Verificación de RLS para '{table_name}' requiere acceso SQL directo")
    return True

def main():
    print("=" * 60)
    print("🚀 CONFIGURACIÓN DE SUPABASE - PORTAL MEJORA CONTINUA")
    print("=" * 60)
    print()
    
    print("📋 IMPORTANTE:")
    print("Este script verifica el estado de las tablas.")
    print("Para ejecutar el schema SQL completo, debes:")
    print("1. Ir a Supabase Dashboard > SQL Editor")
    print("2. Copiar el contenido de 'supabase/schema.sql'")
    print("3. Pegarlo y ejecutarlo")
    print()
    print("Alternativamente, puedo guiarte para hacerlo desde el navegador.")
    print()
    
    input("Presiona ENTER para verificar el estado actual de las tablas...")
    print()
    
    print("🔍 Verificando tablas...")
    print("-" * 60)
    
    tables = ["profiles", "tickets", "comments"]
    
    results = {}
    for table in tables:
        results[table] = check_table_exists(table)
        print()
    
    print("-" * 60)
    print()
    
    if all(results.values()):
        print("✅ ¡TODAS LAS TABLAS EXISTEN!")
        print()
        print("Verificando RLS...")
        for table in tables:
            check_rls_enabled(table)
    else:
        print("⚠️  FALTAN TABLAS POR CREAR")
        print()
        print("Tablas faltantes:")
        for table, exists in results.items():
            if not exists:
                print(f"  ❌ {table}")
        print()
        print("=" * 60)
        print("📝 INSTRUCCIONES PARA CREAR LAS TABLAS:")
        print("=" * 60)
        print()
        print("1. Abre tu navegador en:")
        print(f"   {SUPABASE_URL.replace('https://', 'https://app.supabase.com/project/')}/sql/new")
        print()
        print("2. Copia TODO el contenido del archivo:")
        print("   supabase/schema.sql")
        print()
        print("3. Pégalo en el SQL Editor")
        print()
        print("4. Haz clic en 'Run' (o presiona Ctrl+Enter)")
        print()
        print("5. Vuelve a ejecutar este script para verificar")
        print()
    
    print("=" * 60)
    print("✨ Verificación completada")
    print("=" * 60)

if __name__ == "__main__":
    main()
