# 🎯 GUÍA RÁPIDA - CONFIGURACIÓN DE SUPABASE

## ✅ LO QUE YA ESTÁ HECHO

- ✅ Código completamente corregido
- ✅ Variables de entorno configuradas
- ✅ Dockerfile creado
- ✅ Scripts de despliegue listos
- ✅ Validación de dominio @suzuval.cl implementada
- ✅ OAuth redirect URLs configurados en el código

---

## 🚨 LO QUE DEBES HACER AHORA (5 MINUTOS)

### Paso 1: Configurar la Base de Datos (2 minutos)

**Opción A: Usando el archivo HTML (MÁS FÁCIL)**

1. Abre el archivo que acabo de abrir en tu navegador:

   ```
   CONFIGURAR_SUPABASE.html
   ```

2. Haz clic en "Abrir SQL Editor" (te llevará a Supabase)

3. Haz clic en "Copiar SQL" en la página HTML

4. Pega el SQL en el editor de Supabase

5. Haz clic en "Run" (o Ctrl+Enter)

6. ¡Listo! Las tablas se crearán automáticamente

**Opción B: Manual**

1. Abre: <https://app.supabase.com/project/dqpxgwsdfclmztslstzh/sql/new>

2. Copia TODO el contenido de `supabase/schema.sql`

3. Pégalo en el SQL Editor

4. Haz clic en "Run"

---

### Paso 2: Verificar que Todo Esté Bien (30 segundos)

Ejecuta este comando:

```bash
python verificar_supabase.py
```

Deberías ver:

```
✅ Perfiles de usuario (profiles)
✅ Tickets de mejora continua (tickets)
✅ Comentarios en tickets (comments)
```

---

### Paso 3: Probar Localmente (1 minuto)

```bash
npm run dev
```

Abre: <http://localhost:3000>

Prueba el login con Google usando una cuenta @suzuval.cl

---

### Paso 4: Desplegar a Cloud Run (2 minutos)

1. Edita `deploy.ps1` y reemplaza:

   ```powershell
   $PROJECT_ID = "your-project-id"
   ```

   Con tu Project ID de Google Cloud

2. Ejecuta:

   ```powershell
   .\deploy.ps1
   ```

3. Espera a que termine el despliegue

4. Abre: <https://portal-de-mejora-continua-682575749366.us-west1.run.app>

---

## 📁 ARCHIVOS ÚTILES QUE CREÉ

| Archivo | Descripción |
|---------|-------------|
| `CONFIGURAR_SUPABASE.html` | **ABRE ESTE** - Guía interactiva con botón de copiar SQL |
| `verificar_supabase.py` | Script para verificar que todo esté configurado |
| `configure_supabase.py` | Script alternativo de configuración |
| `SUPABASE_CONFIG.md` | Guía detallada de configuración |
| `RESUMEN_CORRECCIONES.md` | Lista completa de todos los cambios |
| `DEPLOYMENT.md` | Guía de despliegue en Cloud Run |
| `deploy.ps1` | Script de despliegue para Windows |

---

## 🎯 CHECKLIST COMPLETO

### Configuración de Supabase

- [ ] Ejecutar schema SQL en Supabase
- [ ] Verificar tablas con `python verificar_supabase.py`
- [ ] Confirmar que RLS esté habilitado

### Configuración OAuth (Ya hecho por ti)

- [✅] URLs de redirección configuradas en Supabase
- [✅] Site URL configurada en Supabase
- [✅] Google OAuth Provider habilitado
- [✅] Credenciales OAuth en Google Cloud Console

### Pruebas

- [ ] Probar localmente con `npm run dev`
- [ ] Verificar login con Google
- [ ] Confirmar que solo @suzuval.cl puede acceder

### Despliegue

- [ ] Editar PROJECT_ID en deploy.ps1
- [ ] Ejecutar `.\deploy.ps1`
- [ ] Verificar que funcione en producción

---

## 🆘 SI ALGO FALLA

### Error: "Tablas no existen"

**Solución**: Abre `CONFIGURAR_SUPABASE.html` y sigue los pasos

### Error: "Redirect URL not allowed"

**Solución**: Ya está configurado en el código, solo asegúrate de que en Supabase > Authentication > URL Configuration tengas:

- `https://portal-de-mejora-continua-682575749366.us-west1.run.app`
- `http://localhost:3000`

### Error: "Access denied - domain not allowed"

**Solución**: Esto es correcto! Solo usuarios @suzuval.cl pueden acceder

### Error en el despliegue

**Solución**: Verifica que hayas editado el PROJECT_ID en deploy.ps1

---

## 🚀 RESUMEN DE 30 SEGUNDOS

1. **Abre**: `CONFIGURAR_SUPABASE.html` (ya está abierto en tu navegador)
2. **Copia**: Haz clic en "Copiar SQL"
3. **Pega**: En el SQL Editor de Supabase
4. **Ejecuta**: Haz clic en "Run"
5. **Verifica**: `python verificar_supabase.py`
6. **Prueba**: `npm run dev`
7. **Despliega**: `.\deploy.ps1`

---

## ✨ RESULTADO FINAL

Cuando termines, tendrás:

✅ Base de datos completamente configurada  
✅ Tablas con Row Level Security  
✅ Login con Google OAuth funcionando  
✅ Solo usuarios @suzuval.cl pueden acceder  
✅ Aplicación desplegada en Cloud Run  
✅ Portal de Mejora Continua 100% funcional  

---

## 📞 ¿NECESITAS AYUDA?

Si tienes algún problema:

1. Ejecuta `python verificar_supabase.py` para ver el estado
2. Revisa `SUPABASE_CONFIG.md` para detalles
3. Revisa los logs: `gcloud run logs read portal-de-mejora-continua --region us-west1`

---

**¡Estás a solo 5 minutos de tener todo funcionando! 🎉**

El archivo `CONFIGURAR_SUPABASE.html` ya está abierto en tu navegador.
Solo sigue los pasos y estarás listo.
