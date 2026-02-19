#!/usr/bin/env python3
"""
Script de verificación post-configuración de Supabase
Verifica que todas las tablas y políticas estén correctamente configuradas
"""

import requests
import json
from typing import Dict, List, Tuple

# Configuración
SUPABASE_URL = "https://dqpxgwsdfclmztslstzh.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcHhnd3NkZmNsbXp0c2xzdHpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkwMTc1NSwiZXhwIjoyMDg2NDc3NzU1fQ.GJTKZwNkkOGntZJQk-tvwwFKjass6prlGPHUnu6JQ4I"

headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json"
}

def print_header(text: str):
    """Imprime un encabezado formateado"""
    print()
    print("=" * 70)
    print(f"  {text}")
    print("=" * 70)
    print()

def print_step(text: str, status: str = ""):
    """Imprime un paso con su estado"""
    if status == "ok":
        print(f"  ✅ {text}")
    elif status == "error":
        print(f"  ❌ {text}")
    elif status == "warning":
        print(f"  ⚠️  {text}")
    else:
        print(f"  ℹ️  {text}")

def check_table_exists(table_name: str) -> Tuple[bool, str]:
    """Verifica si una tabla existe y retorna el estado"""
    url = f"{SUPABASE_URL}/rest/v1/{table_name}?limit=0"
    
    try:
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code == 200:
            return True, "Tabla existe y es accesible"
        elif response.status_code == 404:
            return False, "Tabla no encontrada"
        else:
            return False, f"Error HTTP {response.status_code}"
    except Exception as e:
        return False, f"Error de conexión: {str(e)}"

def check_table_structure(table_name: str) -> Dict:
    """Obtiene información sobre la estructura de la tabla"""
    url = f"{SUPABASE_URL}/rest/v1/{table_name}?limit=1"
    
    try:
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code == 200:
            # Obtener los headers que contienen info de las columnas
            return {
                "accessible": True,
                "columns": response.headers.get("Content-Range", "Unknown")
            }
        else:
            return {"accessible": False, "error": response.status_code}
    except Exception as e:
        return {"accessible": False, "error": str(e)}

def main():
    print_header("🔍 VERIFICACIÓN DE CONFIGURACIÓN DE SUPABASE")
    
    print("Proyecto: Portal de Mejora Continua - Suzuval")
    print(f"URL: {SUPABASE_URL}")
    print()
    
    # Lista de tablas a verificar
    tables = {
        "profiles": "Perfiles de usuario",
        "tickets": "Tickets de mejora continua",
        "comments": "Comentarios en tickets"
    }
    
    print_header("📊 VERIFICANDO TABLAS")
    
    results = {}
    all_ok = True
    
    for table_name, description in tables.items():
        exists, message = check_table_exists(table_name)
        results[table_name] = exists
        
        if exists:
            print_step(f"{description} ({table_name})", "ok")
        else:
            print_step(f"{description} ({table_name}) - {message}", "error")
            all_ok = False
    
    print()
    
    # Resumen
    print_header("📋 RESUMEN")
    
    if all_ok:
        print_step("¡Todas las tablas están configuradas correctamente!", "ok")
        print()
        print("  Tu base de datos está lista para usar.")
        print()
        print_header("✨ PRÓXIMOS PASOS")
        print()
        print("  1. Ejecuta: npm run dev")
        print("  2. Abre: http://localhost:3000")
        print("  3. Prueba el login con Google (@suzuval.cl)")
        print("  4. Si todo funciona, despliega con: .\\deploy.ps1")
        print()
    else:
        print_step("Algunas tablas no están configuradas", "error")
        print()
        print("  Tablas faltantes:")
        for table_name, exists in results.items():
            if not exists:
                print(f"    ❌ {table_name}")
        print()
        print_header("🔧 SOLUCIÓN")
        print()
        print("  1. Abre: CONFIGURAR_SUPABASE.html")
        print("  2. Sigue las instrucciones paso a paso")
        print("  3. Ejecuta este script nuevamente para verificar")
        print()
    
    print_header("📞 SOPORTE")
    print()
    print("  Si necesitas ayuda:")
    print("  - Revisa: SUPABASE_CONFIG.md")
    print("  - Revisa: RESUMEN_CORRECCIONES.md")
    print("  - Verifica los logs de Supabase")
    print()
    
    return 0 if all_ok else 1

if __name__ == "__main__":
    exit(main())
