import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AdminRole = 'super_admin' | 'admin' | null;

type AdminAuthContextType = {
  user: User | null;
  session: Session | null;
  role: AdminRole;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null; needsBootstrap: boolean }>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  session: null,
  role: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, needsBootstrap: false }),
  signOut: async () => {},
  refreshRole: async () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AdminRole>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = useCallback(async () => {
    const { data, error } = await supabase.rpc('get_my_role');
    if (error) {
      setRole(null);
      return;
    }
    setRole(data as AdminRole);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        fetchRole().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) {
        setRole(null);
        setLoading(false);
      } else {
        fetchRole().finally(() => setLoading(false));
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchRole]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message, needsBootstrap: false };

    // upsert profile name
    if (name.trim() && data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, full_name: name.trim() });
    }

    return { error: null, needsBootstrap: true };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setRole(null);
  }, []);

  const refreshRole = useCallback(async () => {
    await fetchRole();
  }, [fetchRole]);

  return (
    <AdminAuthContext.Provider
      value={{ user: session?.user ?? null, session, role, loading, signIn, signUp, signOut, refreshRole }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
