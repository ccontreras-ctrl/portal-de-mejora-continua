-- Permitir a los administradores actualizar cualquier perfil (para cambiar roles)
CREATE POLICY "Allow admins to update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Administrador'
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Administrador'
);
