import { useState } from 'react';
import { Scissors, Copy, Check, Loader2, FileText, Zap, AlignLeft, List, Sparkles } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type SummaryMode = 'concise' | 'medium' | 'detailed';

const modeConfig: Record<SummaryMode, { label: string; icon: typeof Zap; desc: string; maxSentences: number; color: string }> = {
  concise: { label: 'Concise', icon: Zap, desc: '2-3 key bullet points', maxSentences: 3, color: 'from-primary-500 to-primary-600' },
  medium: { label: 'Medium', icon: AlignLeft, desc: '4-6 bullet points with context', maxSentences: 6, color: 'from-secondary-500 to-secondary-600' },
  detailed: { label: 'Detailed', icon: List, desc: 'Full structured summary', maxSentences: 10, color: 'from-accent-500 to-accent-600' },
};

function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map(s => s.trim())
    .filter(s => s.length > 10);
}

function scoreSentence(sentence: string): number {
  let score = 0;
  // Numbers and metrics are important
  const numbers = sentence.match(/\d+%|\d+x|\d+,\d+|\$\d+|\d{4}/g);
  if (numbers) score += numbers.length * 5;
  // Action verbs boost score
  const actionVerbs = /\b(led|built|improved|increased|decreased|launched|managed|created|developed|achieved|delivered|optimized|reduced|designed|implemented|established|coordinated|analyzed|generated|automated|streamlined)\b/i;
  if (actionVerbs.test(sentence)) score += 10;
  // Longer sentences have more context
  const wordCount = sentence.split(/\s+/).length;
  if (wordCount > 8 && wordCount < 30) score += 5;
  // Dates and time references
  if (/\b(20\d{2}|year|month|quarter|annual|recently|currently|previously)\b/i.test(sentence)) score += 3;
  // Avoid questions or very short fragments
  if (sentence.endsWith('?')) score -= 5;
  if (wordCount < 5) score -= 10;
  return score;
}

function formatAsActionBullet(sentence: string): string {
  let s = sentence.trim();
  // Capitalize first letter
  s = s.charAt(0).toUpperCase() + s.slice(1);
  // Remove trailing period for bullet format
  if (s.endsWith('.')) s = s.slice(0, -1);
  return s;
}

function generateSummary(text: string, mode: SummaryMode): string[] {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return [];

  const config = modeConfig[mode];
  const maxCount = config.maxSentences;

  // Score and sort sentences
  const scored = sentences.map((s, i) => ({ sentence: s, score: scoreSentence(s), index: i }));
  const sorted = [...scored].sort((a, b) => b.score - a.score);

  // Take top N, but preserve original order for readability
  const topIndices = sorted.slice(0, maxCount).map(s => s.index).sort((a, b) => a - b);
  const selected = topIndices.map(i => sentences[i]);

  // Format as action-oriented bullets
  return selected.map(formatAsActionBullet);
}

export default function TextSummarizer() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<SummaryMode>('medium');
  const [summary, setSummary] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;

  const handleSummarize = () => {
    if (!input.trim() || wordCount < 20) return;
    setLoading(true);
    setSummary([]);
    setTimeout(() => {
      const result = generateSummary(input, mode);
      setSummary(result);
      setLoading(false);
    }, 600 + Math.random() * 400);
  };

  const handleCopy = () => {
    const text = summary.map(s => `- ${s}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reductionPercent = summary.length > 0 && wordCount > 0
    ? Math.round((1 - summary.join(' ').split(/\s+/).length / wordCount) * 100)
    : 0;

  return (
    <section id="text-summarizer" className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className={`max-w-5xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <Scissors className="w-4 h-4 text-secondary-300" />
            <span className="text-sm text-secondary-300 font-medium">AI Text Summarizer</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            Shorten Any <span className="text-gradient-primary">Paragraph</span>
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">
            Paste any text and get an action-oriented summary that preserves key metrics, numbers, and dates. Perfect for CV descriptions, cover letters, and project reports.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-300" /> Input Text
              </h3>
              <span className="text-xs text-dark-400">{wordCount} words</span>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your paragraph here (min 20 words)..."
              rows={10}
              className="w-full p-4 bg-dark-900/50 border border-white/10 rounded-xl text-white text-sm leading-relaxed placeholder-dark-400 focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20 transition-all resize-none scrollbar-thin"
            />

            {/* Mode selector */}
            <div>
              <label className="block text-xs text-dark-400 font-medium uppercase tracking-wider mb-2">Summary Style</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(modeConfig) as SummaryMode[]).map((m) => {
                  const cfg = modeConfig[m];
                  return (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`px-3 py-3 rounded-xl text-center transition-all ${
                        mode === m ? `bg-gradient-to-br ${cfg.color} text-white shadow-lg` : 'glass-light text-dark-200 hover:text-white'
                      }`}
                    >
                      <cfg.icon className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-xs font-bold">{cfg.label}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{cfg.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSummarize}
              disabled={!input.trim() || wordCount < 20 || loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? 'Summarizing...' : 'Summarize Text'}
            </button>
            {wordCount > 0 && wordCount < 20 && (
              <p className="text-xs text-warning-600 text-center">Add at least 20 words for a meaningful summary</p>
            )}
          </div>

          {/* Output */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-secondary-300" /> Summary
              </h3>
              {summary.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-success-600 font-medium">{reductionPercent}% shorter</span>
                  <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 glass-light text-white text-xs rounded-lg hover:bg-white/10 transition-all">
                    {copied ? <Check className="w-3.5 h-3.5 text-success-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>

            <div className="min-h-[280px] bg-dark-900/30 rounded-xl p-4 border border-white/5">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-[260px]">
                  <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-3" />
                  <p className="text-dark-200 text-sm">Analyzing and summarizing...</p>
                </div>
              ) : summary.length > 0 ? (
                <ul className="space-y-3">
                  {summary.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-dark-100 leading-relaxed animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                      <span className="w-6 h-6 rounded-lg bg-secondary-500/20 text-secondary-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-[260px] text-center">
                  <Scissors className="w-12 h-12 text-dark-600 mb-3" />
                  <p className="text-dark-400 text-sm max-w-xs">Your summarized text will appear here. The AI preserves key numbers, metrics, and dates while making it concise and action-oriented.</p>
                </div>
              )}
            </div>

            {summary.length > 0 && (
              <div className="glass-light rounded-xl p-3 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-primary-300 shrink-0 mt-0.5" />
                <p className="text-xs text-dark-200 leading-relaxed">
                  Summary preserves key metrics and uses action verbs. Always review and edit for your specific context before using in applications.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
