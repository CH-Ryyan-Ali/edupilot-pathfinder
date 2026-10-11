import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export function useAssessmentResult() {
  const { user } = useAuth();

  const save = useCallback(async (answers: (number | null)[], recommendedFields: unknown[]) => {
    if (!user) return;
    await supabase.from('assessment_results').insert({
      answers: answers,
      recommended_fields: recommendedFields,
    });
  }, [user]);

  return { save };
}
