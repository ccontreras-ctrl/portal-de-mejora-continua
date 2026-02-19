# ⚠️ CONFIGURACIÓN CRÍTICA DE SUPABASE

## 🚨 IMPORTANTE: Debes hacer esto ANTES de desplegar

### Paso 1: Configurar URLs de Redirección OAuth

1. **Accede a tu proyecto de Supabase**:
   - URL: <https://app.supabase.com/project/dqpxgwsdfclmztslstzh>

2. **Ve a Authentication > URL Configuration**

3. **Agrega estas URLs en "Redirect URLs"**:

   ```
   https://portal-de-mejora-continua-682575749366.us-west1.run.app
   http://localhost:3000
   ```

4. **Configura "Site URL"**:

   ```
   https://portal-de-mejora-continua-682575749366.us-west1.run.app
   ```

5. **Guarda los cambios**

---

### Paso 2: Configurar Google OAuth Provider

1. **En Supabase, ve a Authentication > Providers**

2. **Habilita "Google"**

3. **Necesitarás configurar OAuth en Google Cloud Console**:

   a. Ve a: <https://console.cloud.google.com/apis/credentials>

   b. Selecciona tu proyecto

   c. Crea credenciales OAuth 2.0:
      - Tipo: Aplicación web
      - Nombre: Portal Mejora Continua

   d. **Orígenes autorizados de JavaScript**:

      ```
      https://dqpxgwsdfclmztslstzh.supabase.co
      https://portal-de-mejora-continua-682575749366.us-west1.run.app
      http://localhost:3000
      ```

   e. **URIs de redirección autorizados**:

      ```
      https://dqpxgwsdfclmztslstzh.supabase.co/auth/v1/callback
      ```

4. **Copia el Client ID y Client Secret**

5. **Pégalos en Supabase** (Authentication > Providers > Google)

6. **Guarda los cambios**

---

### Paso 3: Restringir Dominio (Opcional pero Recomendado)

Para mayor seguridad, puedes restringir el acceso solo a usuarios @suzuval.cl en Google Cloud Console:

1. Ve a OAuth consent screen
2. En "Authorized domains" agrega: `suzuval.cl`
3. Guarda los cambios

**NOTA**: La aplicación ya valida el dominio en el código, pero esto agrega una capa extra de seguridad.

---

### Paso 4: Verificar la Base de Datos

1. **Asegúrate de que el schema SQL esté aplicado**:
   - Ve a SQL Editor en Supabase
   - Ejecuta el contenido de `supabase/schema.sql` si no lo has hecho

2. **Verifica que las tablas existan**:
   - `profiles`
   - `tickets`
   - `comments`

3. **Verifica que RLS esté habilitado** en todas las tablas

---

## ✅ Checklist de Verificación

Antes de desplegar, asegúrate de que:

- [ ] URLs de redirección configuradas en Supabase
- [ ] Site URL configurada en Supabase
- [ ] Google OAuth Provider habilitado en Supabase
- [ ] Credenciales OAuth configuradas en Google Cloud Console
- [ ] URIs de redirección configurados en Google Cloud Console
- [ ] Schema SQL aplicado en Supabase
- [ ] RLS habilitado en todas las tablas
- [ ] Variables de entorno configuradas en `.env.local`

---

## 🧪 Probar la Configuración

1. **Ejecuta localmente**:

   ```bash
   npm run dev
   ```

2. **Intenta hacer login con Google**:
   - Debe redirigir a Google
   - Debe permitir solo usuarios @suzuval.cl
   - Debe redirigir de vuelta a la aplicación
   - Debe crear el perfil automáticamente

3. **Si algo falla**:
   - Revisa la consola del navegador (F12)
   - Revisa los logs de Supabase
   - Verifica que las URLs coincidan EXACTAMENTE

---

## 🆘 Errores Comunes

### "Redirect URL not allowed"

**Causa**: La URL no está en la lista de Supabase
**Solución**: Agrega la URL exacta en Authentication > URL Configuration

### "Access to XMLHttpRequest has been blocked by CORS"

**Causa**: Dominio no autorizado en Google OAuth
**Solución**: Agrega el dominio en Google Cloud Console > Credentials

### "Invalid login credentials"

**Causa**: Usuario no es @suzuval.cl
**Solución**: Esto es esperado, solo usuarios @suzuval.cl pueden acceder

### La página se queda en blanco después del login

**Causa**: Error en la creación del perfil o RLS mal configurado
**Solución**: Revisa los logs de Supabase y verifica las políticas RLS

---

## 📞 Contacto

Si tienes problemas, revisa:

1. Logs de Cloud Run: `gcloud run logs read portal-de-mejora-continua --region us-west1`
2. Consola del navegador (F12 > Console)
3. Logs de Supabase (Dashboard > Logs)
