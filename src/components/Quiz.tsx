import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain, ChevronRight, ChevronLeft, RotateCcw, Radar, Sparkles,
  GraduationCap, HeartPulse, Cog, Laptop, Calculator, Palette, Wrench,
  TrendingUp, Code2, Scale, Building2, Radio, Download, AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import type { EducationLevel, IntermediateGroup, QuizQuestionV2 } from '@/types';
import { matricQuestions, matricFields } from '@/data/quizMatric';
import { intermediateQuestions, intermediateFields } from '@/data/quizIntermediate';
import { matricFieldInfo, intermediateFieldInfo } from '@/data/quizFields';
import type { FieldInfo } from '@/data/quizFields';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useAssessmentResult } from '@/hooks/useAssessmentResult';

type Phase = 'intro' | 'education' | 'intermediate-group' | 'quiz' | 'results';

type SavedState = {
  phase: Phase;
  educationLevel: EducationLevel | null;
  intermediateGroup: IntermediateGroup | null;
  answers: (number | null)[];
  questionOrder: number[];
};

const STORAGE_KEY = 'pathfinder_quiz_v2';

const iconMap: Record<string, React.ElementType> = {
  HeartPulse, Cog, Laptop, Calculator, Palette, Wrench,
  Brain, TrendingUp, Code2, Scale, Building2, Radio, GraduationCap,
};

const intermediateGroups: IntermediateGroup[] = [
  'Pre-Medical', 'Pre-Engineering', 'ICS/Computer Science', 'Commerce', 'Arts/Humanities', 'Other',
];

function shuffleWithBalance(questions: QuizQuestionV2[]): QuizQuestionV2[] {
  const categories = [...new Set(questions.map(q => q.category))];
  const byCategory: Record<string, QuizQuestionV2[]> = {};
  categories.forEach(c => { byCategory[c] = questions.filter(q => q.category === c); });
  categories.forEach(c => {
    byCategory[c] = [...byCategory[c]].sort(() => Math.random() - 0.5);
  });
  const result: QuizQuestionV2[] = [];
  const maxLen = Math.max(...categories.map(c => byCategory[c].length));
  for (let i = 0; i < maxLen; i++) {
    categories.forEach(c => {
      if (byCategory[c][i]) result.push(byCategory[c][i]);
    });
  }
  return result;
}

export default function Quiz() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const navigate = useNavigate();
  const { save: saveResult } = useAssessmentResult();

  const [phase, setPhase] = useState<Phase>('intro');
  const [educationLevel, setEducationLevel] = useState<EducationLevel | null>(null);
  const [intermediateGroup, setIntermediateGroup] = useState<IntermediateGroup | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Restore saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state: SavedState = JSON.parse(saved);
        if (state.phase && state.answers.length > 0 && state.questionOrder.length > 0) {
          setPhase(state.phase);
          setEducationLevel(state.educationLevel);
          setIntermediateGroup(state.intermediateGroup);
          setAnswers(state.answers);
          setQuestionOrder(state.questionOrder);
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (phase === 'intro') return;
    const state: SavedState = { phase, educationLevel, intermediateGroup, answers, questionOrder };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [phase, educationLevel, intermediateGroup, answers, questionOrder]);

  const fields = educationLevel === 'matric' ? matricFields : intermediateFields;
  const fieldInfoMap = educationLevel === 'matric' ? matricFieldInfo : intermediateFieldInfo;
  const baseQuestions = educationLevel === 'matric' ? matricQuestions : intermediateQuestions;

  const orderedQuestions = useMemo(() => {
    if (questionOrder.length === 0 || questionOrder.length !== baseQuestions.length) return baseQuestions;
    return questionOrder.map(idx => baseQuestions[idx]).filter(Boolean);
  }, [baseQuestions, questionOrder]);

  const questions = orderedQuestions;

  const startQuiz = (level: EducationLevel) => {
    const baseQs = level === 'matric' ? matricQuestions : intermediateQuestions;
    const shuffled = shuffleWithBalance(baseQs);
    const order = shuffled.map(q => q.id - 1);
    setEducationLevel(level);
    setQuestionOrder(order);
    setAnswers(new Array(50).fill(null));
    setCurrentQ(0);
    setPhase('quiz');
  };

  const handleSelectAnswer = (optionIdx: number) => {
    setAnswers(prev => {
      const next = [...prev];
      next[currentQ] = optionIdx;
      return next;
    });
  };

  const goNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
    else {
      setPhase('results');
      const res = calculateResults();
      saveResult(answers, res);
    }
  };

  const goPrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const retake = () => {
    setPhase('intro');
    setEducationLevel(null);
    setIntermediateGroup(null);
    setAnswers([]);
    setQuestionOrder([]);
    setCurrentQ(0);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  const calculateResults = (): { field: string; matchPercent: number; info: FieldInfo }[] => {
    const scores: Record<string, number> = {};
    fields.forEach(f => { scores[f] = 0; });

    questions.forEach((q, i) => {
      const ans = answers[i];
      if (ans === null || ans === undefined) return;
      const optionFieldScores = q.fieldScores;
      Object.entries(optionFieldScores).forEach(([field, scoresArr]) => {
        if (scoresArr[ans] && scores[field] !== undefined) {
          scores[field] += scoresArr[ans];
        }
      });
    });

    const maxPossible = questions.length * 3;
    const sorted = fields
      .map(f => ({
        field: f,
        score: scores[f],
        matchPercent: Math.min(Math.round((scores[f] / maxPossible) * 100), 100),
        info: fieldInfoMap[f],
      }))
      .sort((a, b) => b.score - a.score);

    return sorted.slice(0, 3).map(r => ({ field: r.field, matchPercent: r.matchPercent, info: r.info }));
  };

  const results = phase === 'results' ? calculateResults() : [];
  const answeredCount = answers.filter(a => a !== null).length;

  // Scroll to results when entering results phase
  useEffect(() => {
    if (phase === 'results' && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [phase]);

  return (
    <section id="quiz" className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div ref={ref} className={`relative max-w-4xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <Brain className="w-4 h-4 text-primary-300" />
            <span className="text-sm text-primary-300 font-medium">Diagnostic Assessment</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            <span className="text-gradient-primary">50-Question</span> Career Diagnostic
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">
            Answer 50 questions about your interests, skills, and preferences. Get personalized field recommendations with study paths and career options.
          </p>
        </div>

        {phase === 'intro' && (
          <div className="glass-card rounded-3xl p-10 text-center animate-fade-in-up">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center mx-auto mb-6 glow-primary">
              <Radar className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-display font-bold text-2xl text-white mb-3">Ready to find your path?</h3>
            <p className="text-dark-200 max-w-md mx-auto mb-8 text-sm leading-relaxed">
              Answer 50 questions that map your interests, skills, and personality to the best fields for you. Your progress is saved automatically.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {['Interest', 'Personality', 'Logic', 'Career'].map((trait, i) => (
                <div key={trait} className="glass-light rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mx-auto mb-2 text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="text-xs text-dark-200 font-medium">{trait}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPhase('education')}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              Start Diagnostic
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {phase === 'education' && (
          <div className="glass-card rounded-3xl p-8 sm:p-10 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-display font-bold text-2xl text-white mb-3">What is your current education level?</h3>
            <p className="text-dark-200 max-w-md mx-auto mb-8 text-sm">This helps us tailor the questions to your stage.</p>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => startQuiz('matric')}
                className="glass-light rounded-2xl p-6 hover:border-primary-400/40 hover:scale-[1.02] transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-3">
                  <GraduationCap className="w-6 h-6 text-primary-300" />
                </div>
                <h4 className="font-display font-bold text-lg text-white mb-1">Matric Pass</h4>
                <p className="text-xs text-dark-300">Questions about interests and subjects to help choose your intermediate group.</p>
              </button>
              <button
                onClick={() => { setEducationLevel('intermediate'); setPhase('intermediate-group'); }}
                className="glass-light rounded-2xl p-6 hover:border-primary-400/40 hover:scale-[1.02] transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary-500/20 flex items-center justify-center mb-3">
                  <Brain className="w-6 h-6 text-secondary-300" />
                </div>
                <h4 className="font-display font-bold text-lg text-white mb-1">Intermediate Pass</h4>
                <p className="text-xs text-dark-300">Questions about interests, personality, and career preferences to help choose a university degree.</p>
              </button>
            </div>
          </div>
        )}

        {phase === 'intermediate-group' && (
          <div className="glass-card rounded-3xl p-8 sm:p-10 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-display font-bold text-2xl text-white mb-3">Which intermediate group did you study?</h3>
            <p className="text-dark-200 max-w-md mx-auto mb-8 text-sm">This helps us fine-tune your recommendations.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-6">
              {intermediateGroups.map(g => (
                <button
                  key={g}
                  onClick={() => { setIntermediateGroup(g); startQuiz('intermediate'); }}
                  className="glass-light rounded-xl p-4 hover:border-primary-400/40 hover:scale-[1.02] transition-all text-center"
                >
                  <div className="text-sm font-medium text-white">{g}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setPhase('education')}
              className="text-sm text-dark-300 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          </div>
        )}

        {phase === 'quiz' && questions.length > 0 && currentQ < questions.length && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-dark-300">Question {currentQ + 1} of {questions.length}</span>
              <span className="text-xs px-3 py-1 glass-light rounded-full text-primary-300 font-medium">{questions[currentQ].category}</span>
            </div>
            <div className="h-2 bg-dark-800 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              />
            </div>
            <div className="text-xs text-dark-400 mb-6">{answeredCount} of {questions.length} answered</div>

            <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-6">{questions[currentQ].question}</h3>

            <div className="space-y-3 mb-6">
              {questions[currentQ].options.map((opt, idx) => {
                const isSelected = answers[currentQ] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary-500/15 border-primary-500/40 text-white'
                        : 'glass-light text-dark-100 hover:bg-white/10 hover:border-primary-400/30'
                    }`}
                  >
                    <span className="text-sm font-medium">{opt}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={goPrev}
                disabled={currentQ === 0}
                className="px-5 py-2.5 glass-light text-white text-sm rounded-xl hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={goNext}
                disabled={answers[currentQ] === null || answers[currentQ] === undefined}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQ < questions.length - 1 ? 'Next' : 'See Results'}
                {currentQ < questions.length - 1 ? <ChevronRight className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {phase === 'results' && results.length > 0 && (
          <div ref={resultsRef}>
            <QuizResults
              results={results}
              educationLevel={educationLevel}
              intermediateGroup={intermediateGroup}
              onRetake={retake}
              navigate={navigate}
            />
          </div>
        )}
      </div>
    </section>
  );
}

type ResultItem = { field: string; matchPercent: number; info: FieldInfo };

function QuizResults({
  results, educationLevel, intermediateGroup, onRetake, navigate,
}: {
  results: ResultItem[];
  educationLevel: EducationLevel | null;
  intermediateGroup: IntermediateGroup | null;
  onRetake: () => void;
  navigate: (path: string) => void;
}) {
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="glass-card rounded-3xl p-8" id="quiz-print-area">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center mx-auto mb-4 glow-primary">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-display font-bold text-2xl text-white mb-2">Your Diagnostic Results</h3>
          <p className="text-dark-200 text-sm">
            Based on your {educationLevel === 'matric' ? 'Matric' : `Intermediate (${intermediateGroup})`} responses, here are your top 3 recommended fields:
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {results.map((r, i) => {
            const Icon = iconMap[r.info.icon] || Sparkles;
            return (
              <div key={r.field} className={`glass-light rounded-2xl p-6 ${i === 0 ? 'border-primary-400/30' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-gradient-to-br from-primary-500 to-secondary-600' : 'glass-light'}`}>
                      <Icon className={`w-6 h-6 ${i === 0 ? 'text-white' : 'text-primary-300'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">#{i + 1}</span>
                        <h4 className="font-display font-bold text-lg text-white">{r.field}</h4>
                      </div>
                      <p className="text-xs text-dark-300 mt-0.5">{r.matchPercent}% match</p>
                    </div>
                  </div>
                  <div className="text-3xl font-display font-bold text-gradient-primary">{r.matchPercent}%</div>
                </div>

                <div className="h-2 bg-dark-800 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.max(r.matchPercent, 3)}%` }}
                  />
                </div>

                <p className="text-sm text-dark-100 leading-relaxed mb-3">{r.info.studyNext}</p>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-xs text-dark-400 font-medium uppercase tracking-wider mb-2">Suggested Degrees</div>
                    <div className="flex flex-wrap gap-1.5">
                      {r.info.suggestedDegrees.map(d => (
                        <span key={d} className="px-2.5 py-1 text-xs bg-primary-500/15 text-primary-200 rounded-lg">{d}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-dark-400 font-medium uppercase tracking-wider mb-2">Example Careers</div>
                    <div className="flex flex-wrap gap-1.5">
                      {r.info.exampleCareers.map(c => (
                        <span key={c} className="px-2.5 py-1 text-xs bg-secondary-500/15 text-secondary-300 rounded-lg">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => navigate('/careers')}
                    className="px-4 py-2 text-xs glass-light text-white rounded-lg hover:bg-white/10 transition-all flex items-center gap-1.5"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-secondary-300" /> Career Roadmaps
                  </button>
                  <button
                    onClick={() => navigate('/universities')}
                    className="px-4 py-2 text-xs glass-light text-white rounded-lg hover:bg-white/10 transition-all flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-primary-300" /> Universities
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass-light rounded-xl p-4 flex items-start gap-3 border border-warning-500/20 mb-6">
          <AlertCircle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
          <p className="text-xs text-dark-200 leading-relaxed">
            This diagnostic provides guidance based on your responses, not a final decision. Consider your personal circumstances, talk to mentors and family, and research further before making your choice.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRetake}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 glass-light text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Retake Test
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" /> Download Result as PDF
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #quiz-print-area, #quiz-print-area * { visibility: visible; }
          #quiz-print-area {
            position: absolute;
            left: 0; top: 0;
            width: 100%;
            max-height: none;
            overflow: visible;
            border-radius: 0;
            padding: 1in;
            background: white;
          }
          #quiz-print-area * {
            color: #1a2138 !important;
          }
          #quiz-print-area .text-gradient-primary,
          #quiz-print-area .bg-gradient-to-r {
            background: none !important;
            -webkit-text-fill-color: #16bfa0 !important;
            color: #16bfa0 !important;
          }
          @page { size: A4; margin: 0.5in; }
        }
      `}</style>
    </div>
  );
}
