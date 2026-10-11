import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { CVData } from '@/components/CVBuilder';

const LS_KEY = 'pathfinder_cv_draft';

function lsLoad(): CVData | null {
  try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function useCVDraft(currentData: CVData, setData: (d: CVData) => void) {
  const { user } = useAuth();
  const draftId = useRef<string | null>(null);
  const loaded = useRef(false);

  // Load draft on mount
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    if (!user) {
      const saved = lsLoad();
      if (saved) setData(saved);
      return;
    }
    supabase
      .from('cv_drafts')
      .select('id, content')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) {
          draftId.current = data.id;
          setData(data.content as CVData);
        }
      });
  }, [user, setData]);

  // Save draft (debounced by callers)
  const save = useCallback(async (data: CVData) => {
    if (!user) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch { /* ignore */ }
      return;
    }
    if (draftId.current) {
      await supabase.from('cv_drafts').update({ content: data }).eq('id', draftId.current);
    } else {
      const { data: row } = await supabase.from('cv_drafts').insert({ content: data, title: 'My CV' }).select('id').maybeSingle();
      if (row) draftId.current = row.id;
    }
  }, [user]);

  return { save };
}
