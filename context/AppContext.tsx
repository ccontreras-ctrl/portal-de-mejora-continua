
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { User, Ticket, Role, Comment } from '../types';
import { supabase } from '../services/supabaseClient';
import { AuthError } from '@supabase/supabase-js';

// Helper to map Supabase snake_case to our camelCase
const fromSupabase = (ticketData: any): Ticket => ({
  id: ticketData.id,
  title: ticketData.title,
  createdAt: ticketData.created_at,
  solicitanteId: ticketData.solicitante_id,
  area: ticketData.area,
  sucursal: ticketData.sucursal,
  categoria: ticketData.categoria,
  description: ticketData.description,
  impacto: ticketData.impacto,
  urgencia: ticketData.urgencia,
  prioridad: ticketData.prioridad,
  status: ticketData.status,
  aprobadorEmail: ticketData.aprobador_email,
  asignadoAId: ticketData.asignado_a_id,
  driveFolderUrl: ticketData.drive_folder_url,
  ishikawaData: ticketData.ishikawa_data,
  geminiAnalysis: ticketData.gemini_analysis,
});

const toSupabase = (ticket: Partial<Ticket>) => {
  const data: any = {};
  if (ticket.title !== undefined) data.title = ticket.title;
  if (ticket.createdAt !== undefined) data.created_at = ticket.createdAt;
  if (ticket.solicitanteId !== undefined) data.solicitante_id = ticket.solicitanteId;
  if (ticket.area !== undefined) data.area = ticket.area;
  if (ticket.sucursal !== undefined) data.sucursal = ticket.sucursal;
  if (ticket.categoria !== undefined) data.categoria = ticket.categoria;
  if (ticket.description !== undefined) data.description = ticket.description;
  if (ticket.impacto !== undefined) data.impacto = ticket.impacto;
  if (ticket.urgencia !== undefined) data.urgencia = ticket.urgencia;
  if (ticket.prioridad !== undefined) data.prioridad = ticket.prioridad;
  if (ticket.status !== undefined) data.status = ticket.status;
  if (ticket.aprobadorEmail !== undefined) data.aprobador_email = ticket.aprobadorEmail;
  if (ticket.asignadoAId !== undefined) data.asignado_a_id = ticket.asignadoAId;
  if (ticket.driveFolderUrl !== undefined) data.drive_folder_url = ticket.driveFolderUrl;
  if (ticket.ishikawaData !== undefined) data.ishikawa_data = ticket.ishikawaData;
  if (ticket.geminiAnalysis !== undefined) data.gemini_analysis = ticket.geminiAnalysis;
  return data;
};


interface AppContextType {
  user: User | null;
  users: User[]; // All users in the system
  tickets: Ticket[];
  page: string;
  selectedTicketId: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setPage: (page: string) => void;
  selectTicket: (ticketId: string | null) => void;
  updateTicket: (updatedTicket: Partial<Ticket>) => Promise<void>;
  addTicket: (newTicket: Omit<Ticket, 'id' | 'createdAt'>, file?: File | null) => Promise<void>;
  getComments: (ticketId: string) => Promise<Comment[]>;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
  updateUserProfile: (userId: string, updates: Partial<User>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [page, setPage] = useState<string>('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Set up auth listener to handle session changes and profile creation
  useEffect(() => {
    console.log("🛠️ AppContext: Inicializando listener de autenticación...");

    if (!supabase) {
      console.warn("⚠️ AppContext: Supabase no está configurado.");
      setLoading(false);
      return;
    }

    // Timeout de seguridad: Si en 10 segundos no ha terminado de cargar, forzamos el fin
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn("⏱️ AppContext: El tiempo de carga excedió los 10s. Forzando fin de carga.");
        setLoading(false);
      }
    }, 10000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔐 AppContext: Evento de Auth: ${event}`, { hasSession: !!session });

        try {
          if (session) {
            const userEmail = session.user.email!;
            const allowedDomain = import.meta.env.VITE_ALLOWED_DOMAIN || 'suzuval.cl';

            console.log(`📧 AppContext: Usuario autenticado: ${userEmail}. Validando dominio @${allowedDomain}`);

            // Validate domain
            if (!userEmail.endsWith(`@${allowedDomain}`)) {
              console.error(`❌ Acceso denegado: el correo ${userEmail} no pertenece al dominio @${allowedDomain}`);
              alert(`Acceso denegado: Solo usuarios con correo @${allowedDomain} pueden acceder a este portal. Tu correo actual es: ${userEmail}`);
              await supabase.auth.signOut();
              setUser(null);
              return;
            }
            console.log(`✅ Dominio validado para: ${userEmail}`);

            console.log("👤 AppContext: Buscando perfil en base de datos...");
            const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();

            if (profileError && profileError.code !== 'PGRST116') {
              console.error("❌ Error al buscar perfil:", profileError);
            }

            if (profile) {
              console.log("✅ AppContext: Perfil encontrado.");
              setUser(profile as User);
            } else {
              // Profile doesn't exist, create it for the new user (e.g., first Google sign-in)
              console.log('📝 AppContext: No se encontró perfil, creando uno nuevo...');
              const { error: insertError } = await supabase.from('profiles').insert({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.full_name || session.user.email!,
              });

              if (insertError) {
                console.error("❌ Error al crear perfil:", insertError);
                setUser(null);
              } else {
                console.log("✅ AppContext: Perfil creado exitosamente.");
                const { data: newProfile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                setUser(newProfile as User);
              }
            }
          } else {
            console.log("ℹ️ AppContext: No hay sesión activa.");
            setUser(null);
          }
        } catch (error) {
          console.error("🚨 AppContext: Error crítico en el manejo de autenticación:", error);
        } finally {
          console.log("🏁 AppContext: Finalizando estado de carga.");
          setLoading(false);
          clearTimeout(loadingTimeout);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  // Fetch app data when user is logged in
  useEffect(() => {
    const fetchData = async () => {
      if (user && supabase) {
        const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('*');
        if (profilesError) console.error("Error fetching profiles:", profilesError);
        else setUsers(profilesData as User[]);

        const { data: ticketsData, error: ticketsError } = await supabase.from('tickets').select('*');
        if (ticketsError) console.error("Error fetching tickets:", ticketsError);
        else setTickets(ticketsData.map(fromSupabase));
      }
    };
    fetchData();
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user || !supabase) return;

    const ticketSubscription = supabase.channel('public:tickets')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tickets' },
        (payload) => setTickets(current => [...current, fromSupabase(payload.new)]))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets' },
        (payload) => setTickets(current => current.map(t => t.id === payload.new.id ? fromSupabase(payload.new) : t)))
      .subscribe();

    return () => {
      supabase.removeChannel(ticketSubscription);
    };

  }, [user]);


  const login = async (email: string, password: string) => {
    if (!supabase) return { error: new AuthError('Supabase no está configurado.') };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const loginWithGoogle = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setTickets([]);
    setUsers([]);
    setPage('dashboard');
    setSelectedTicketId(null);
  };

  const selectTicket = (ticketId: string | null) => {
    if (ticketId === null) setPage('dashboard');
    setSelectedTicketId(ticketId);
  }

  const updateTicket = useCallback(async (updatedTicket: Partial<Ticket>) => {
    if (!supabase || !updatedTicket.id) return;
    const { error } = await supabase.from('tickets').update(toSupabase(updatedTicket)).eq('id', updatedTicket.id);
    if (error) console.error("Error updating ticket:", error);
  }, []);

  const addTicket = useCallback(async (newTicketData: Omit<Ticket, 'id' | 'createdAt'>, file?: File | null) => {
    if (!supabase) return;
    const newTicketId = `MC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    let driveUrl = '#';

    // 1. Upload to Drive if file exists
    if (file) {
      console.log('📤 AppContext: Subiendo archivo a Drive...');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ticketId', newTicketId);

      try {
        const response = await fetch(`${window.location.origin}/api/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.url) {
          console.log('✅ AppContext: Archivo subido con éxito:', data.url);
          driveUrl = data.url;
        }
      } catch (err) {
        console.error("❌ AppContext: Error subiendo archivo:", err);
      }
    }

    // 2. Insert into Supabase
    const ticketToInsert = { ...newTicketData, id: newTicketId, driveFolderUrl: driveUrl };
    const { error } = await supabase.from('tickets').insert(toSupabase(ticketToInsert));

    if (error) {
      console.error("❌ AppContext: Error añadiendo ticket:", error);
    } else {
      console.log('✅ AppContext: Ticket creado en base de datos.');

      // 3. Trigger Email Notification
      try {
        console.log('📧 AppContext: Disparando notificación por correo...');
        await fetch(`${window.location.origin}/api/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticket: { ...ticketToInsert, createdAt: new Date().toISOString() },
            type: 'created',
            recipientEmail: newTicketData.aprobadorEmail || 'ccontreras@suzuval.cl'
          })
        });
      } catch (notifyErr) {
        console.error("❌ AppContext: Error enviando notificación:", notifyErr);
      }
    }
  }, [user]);

  const getComments = useCallback(async (ticketId: string): Promise<Comment[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('comments').select('*').eq('ticket_id', ticketId).order('created_at');
    if (error) {
      console.error("Error fetching comments", error);
      return [];
    }
    return data.map((c: any) => ({
      id: c.id,
      content: c.content,
      createdAt: c.created_at,
      ticketId: c.ticket_id,
      authorId: c.author_id
    }));
  }, []);

  const addComment = useCallback(async (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    if (!supabase) return;
    const { error } = await supabase.from('comments').insert({
      content: comment.content,
      ticket_id: comment.ticketId,
      author_id: comment.authorId
    });

    if (error) {
      console.error("Error adding comment", error);
    } else {
      // Notify via email
      try {
        const ticket = tickets.find(t => t.id === comment.ticketId);
        if (ticket) {
          const author = users.find(u => u.id === comment.authorId);
          console.log('📧 AppContext: Notificando nuevo comentario...');
          await fetch(`${window.location.origin}/api/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ticket,
              commentContent: comment.content,
              authorName: author?.name || 'Un usuario',
              type: 'comment',
              recipientEmail: user?.id === ticket.solicitanteId ? ticket.aprobadorEmail : (users.find(u => u.id === ticket.solicitanteId)?.email || ticket.aprobadorEmail)
            })
          });
        }
      } catch (err) {
        console.error("Error sending comment notification:", err);
      }
    }
  }, [tickets, users, user]);


  const updateUserProfile = async (userId: string, updates: Partial<User>) => {
    if (!supabase) return;

    // Map camelCase to snake_case if necessary (though profiles table uses same names mostly)
    // The only one is 'manager' which is already the same.
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);

    if (error) {
      console.error("Error updating user profile:", error);
      alert("Error al actualizar el perfil: " + error.message);
    } else {
      // Optimistically update local state
      setUsers(currentUsers => currentUsers.map(u => u.id === userId ? { ...u, ...updates } : u));

      // Update current user if it's the same person
      if (user && user.id === userId) {
        setUser({ ...user, ...updates });
      }
    }
  };

  return (
    <AppContext.Provider value={{ user, users, tickets, page, selectedTicketId, loading, login, loginWithGoogle, logout, setPage, selectTicket, updateTicket, addTicket, getComments, addComment, updateUserProfile }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
