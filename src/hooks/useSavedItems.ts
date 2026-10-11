import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const LS_UNIS = 'pathfinder_saved_universities';
const LS_SCHOLARSHIPS = 'pathfinder_saved_scholarships';

function lsGet(key: string): string[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function lsSet(key: string, val: string[]) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
}

export function useSavedItems() {
  const { user } = useAuth();
  const [savedUniIds, setSavedUniIds] = useState<string[]>([]);
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>([]);

  // Load on mount / user change
  useEffect(() => {
    if (!user) {
      setSavedUniIds(lsGet(LS_UNIS));
      setSavedScholarshipIds(lsGet(LS_SCHOLARSHIPS));
      return;
    }
    // Load from Supabase
    Promise.all([
      supabase.from('saved_universities').select('university_id').eq('user_id', user.id),
      supabase.from('saved_scholarships').select('scholarship_id').eq('user_id', user.id),
    ]).then(([uRes, sRes]) => {
      if (!uRes.error) setSavedUniIds(uRes.data.map(r => r.university_id));
      if (!sRes.error) setSavedScholarshipIds(sRes.data.map(r => r.scholarship_id));
    });
  }, [user]);

  const saveUni = useCallback(async (id: string) => {
    if (!user) {
      setSavedUniIds(prev => {
        const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
        lsSet(LS_UNIS, next);
        return next;
      });
      return;
    }
    const isSaved = savedUniIds.includes(id);
    if (isSaved) {
      await supabase.from('saved_universities').delete().eq('user_id', user.id).eq('university_id', id);
      setSavedUniIds(prev => prev.filter(x => x !== id));
    } else {
      await supabase.from('saved_universities').insert({ university_id: id });
      setSavedUniIds(prev => [...prev, id]);
    }
  }, [user, savedUniIds]);

  const saveScholarship = useCallback(async (id: string) => {
    if (!user) {
      setSavedScholarshipIds(prev => {
        const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
        lsSet(LS_SCHOLARSHIPS, next);
        return next;
      });
      return;
    }
    const isSaved = savedScholarshipIds.includes(id);
    if (isSaved) {
      await supabase.from('saved_scholarships').delete().eq('user_id', user.id).eq('scholarship_id', id);
      setSavedScholarshipIds(prev => prev.filter(x => x !== id));
    } else {
      await supabase.from('saved_scholarships').insert({ scholarship_id: id });
      setSavedScholarshipIds(prev => [...prev, id]);
    }
  }, [user, savedScholarshipIds]);

  const isUniSaved = useCallback((id: string) => savedUniIds.includes(id), [savedUniIds]);
  const isScholarshipSaved = useCallback((id: string) => savedScholarshipIds.includes(id), [savedScholarshipIds]);

  const removeUni = useCallback(async (id: string) => {
    if (!user) {
      setSavedUniIds(prev => { const next = prev.filter(x => x !== id); lsSet(LS_UNIS, next); return next; });
      return;
    }
    await supabase.from('saved_universities').delete().eq('user_id', user.id).eq('university_id', id);
    setSavedUniIds(prev => prev.filter(x => x !== id));
  }, [user]);

  const removeScholarship = useCallback(async (id: string) => {
    if (!user) {
      setSavedScholarshipIds(prev => { const next = prev.filter(x => x !== id); lsSet(LS_SCHOLARSHIPS, next); return next; });
      return;
    }
    await supabase.from('saved_scholarships').delete().eq('user_id', user.id).eq('scholarship_id', id);
    setSavedScholarshipIds(prev => prev.filter(x => x !== id));
  }, [user]);

  return { savedUniIds, savedScholarshipIds, saveUni, saveScholarship, isUniSaved, isScholarshipSaved, removeUni, removeScholarship };
}
