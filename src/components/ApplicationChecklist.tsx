import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, CheckCircle2, Circle, Plus, Trash2, Loader2 } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

type ChecklistItem = {
  id: string;
  label: string;
  category: string;
  done: boolean;
  sort_order: number;
};

const DEFAULT_ITEMS: Omit<ChecklistItem, 'id'>[] = [
  { label: 'Valid Passport', category: 'Essential Documents', done: false, sort_order: 0 },
  { label: 'Academic Transcripts (attested)', category: 'Essential Documents', done: false, sort_order: 1 },
  { label: 'Degree/Certificate copies', category: 'Essential Documents', done: false, sort_order: 2 },
  { label: 'Personal Statement / Statement of Purpose', category: 'Application Materials', done: false, sort_order: 3 },
  { label: 'CV / Resume', category: 'Application Materials', done: false, sort_order: 4 },
  { label: 'Recommendation Letters (2-3)', category: 'Application Materials', done: false, sort_order: 5 },
  { label: 'English Proficiency Test (IELTS/TOEFL)', category: 'Tests & Certifications', done: false, sort_order: 6 },
  { label: 'Portfolio (if required by program)', category: 'Application Materials', done: false, sort_order: 7 },
  { label: 'Scholarship Application', category: 'Financial', done: false, sort_order: 8 },
  { label: 'University Application Submitted', category: 'Application Materials', done: false, sort_order: 9 },
  { label: 'Visa Documentation', category: 'Travel & Visa', done: false, sort_order: 10 },
  { label: 'Health Insurance', category: 'Travel & Visa', done: false, sort_order: 11 },
];

const LS_KEY = 'pathfinder_checklist_v2';

function lsLoad(): ChecklistItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return DEFAULT_ITEMS.map((item, i) => ({ ...item, id: `default-${i}` }));
}
function lsSave(items: ChecklistItem[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch { /* ignore */ }
}

export default function ApplicationChecklist() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const { user } = useAuth();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('Custom');
  const [loading, setLoading] = useState(true);

  // Load items
  useEffect(() => {
    if (!user) {
      setItems(lsLoad());
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('checklist_items')
      .select('id, label, category, done, sort_order')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true })
      .then(async ({ data, error }) => {
        if (error || !data) { setLoading(false); return; }
        if (data.length === 0) {
          // Seed defaults for new user
          const rows = DEFAULT_ITEMS.map(item => ({ ...item }));
          const { data: inserted } = await supabase
            .from('checklist_items')
            .insert(rows)
            .select('id, label, category, done, sort_order');
          setItems(inserted ?? []);
        } else {
          setItems(data);
        }
        setLoading(false);
      });
  }, [user]);

  const toggle = useCallback(async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newDone = !item.done;
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: newDone } : i));
    if (!user) {
      lsSave(items.map(i => i.id === id ? { ...i, done: newDone } : i));
      return;
    }
    await supabase.from('checklist_items').update({ done: newDone }).eq('id', id);
  }, [items, user]);

  const remove = useCallback(async (id: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id);
      if (!user) lsSave(next);
      return next;
    });
    if (user) {
      await supabase.from('checklist_items').delete().eq('id', id);
    }
  }, [user]);

  const add = useCallback(async () => {
    if (!newItem.trim()) return;
    const maxOrder = items.reduce((m, i) => Math.max(m, i.sort_order), -1);
    if (!user) {
      const newEntry: ChecklistItem = {
        id: `custom-${Date.now()}`,
        label: newItem.trim(),
        category: newCategory || 'Custom',
        done: false,
        sort_order: maxOrder + 1,
      };
      setItems(prev => { const next = [...prev, newEntry]; lsSave(next); return next; });
    } else {
      const row = { label: newItem.trim(), category: newCategory || 'Custom', done: false, sort_order: maxOrder + 1 };
      const { data } = await supabase.from('checklist_items').insert(row).select('id, label, category, done, sort_order').maybeSingle();
      if (data) setItems(prev => [...prev, data]);
    }
    setNewItem('');
  }, [newItem, newCategory, items, user]);

  const completed = items.filter(i => i.done).length;
  const progress = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;
  const allCats = [...new Set(items.map(i => i.category))];

  return (
    <section id="checklist" className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className={`max-w-4xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <ClipboardList className="w-4 h-4 text-success-600" />
            <span className="text-sm text-success-600 font-medium">Stay Organized</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            My Application <span className="text-gradient-primary">Checklist</span>
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">
            Track everything you need for your university and scholarship applications. Add your own items too.
            {!user && <span className="block text-sm text-primary-300 mt-1">Sign in to sync across devices.</span>}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-dark-200">Progress</span>
                <span className="text-2xl font-display font-bold text-gradient-primary">{progress}%</span>
              </div>
              <div className="h-3 bg-dark-900/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-dark-400 mt-2">{completed} of {items.length} items completed</div>
            </div>

            {/* Checklist by category */}
            <div className="space-y-6">
              {allCats.map(cat => (
                <div key={cat}>
                  <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">{cat}</h3>
                  <div className="space-y-2">
                    {items.filter(i => i.category === cat).map(item => (
                      <div key={item.id} className="flex items-center gap-3 glass-light rounded-xl px-4 py-3 group">
                        <button onClick={() => toggle(item.id)} className="shrink-0">
                          {item.done
                            ? <CheckCircle2 className="w-5 h-5 text-success-600" />
                            : <Circle className="w-5 h-5 text-dark-400 hover:text-primary-300 transition-colors" />}
                        </button>
                        <span className={`text-sm flex-1 ${item.done ? 'text-dark-400 line-through' : 'text-white'}`}>
                          {item.label}
                        </span>
                        <button
                          onClick={() => remove(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-dark-400 hover:text-error-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add custom item */}
            <div className="mt-6 glass-card rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Add custom item..."
                  value={newItem}
                  onChange={e => setNewItem(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && add()}
                  className="flex-1 px-4 py-3 bg-dark-900/50 border border-white/10 rounded-xl text-white placeholder-dark-400 text-sm focus:outline-none focus:border-success-600/50 transition-all"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="px-4 py-3 bg-dark-900/50 border border-white/10 rounded-xl text-white placeholder-dark-400 text-sm focus:outline-none focus:border-success-600/50 transition-all sm:w-40"
                />
                <button
                  onClick={add}
                  className="px-6 py-3 bg-gradient-to-r from-success-600 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
