import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, BookOpen, Award, Briefcase, Code, Database, Brain } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type RoadmapStep = { phase: string; title: string; detail: string; icon: typeof BookOpen };
type Message = { role: 'user' | 'bot'; content: string; roadmap?: RoadmapStep[] };

const roadmapResponses: { keywords: string[]; intro: string; steps: RoadmapStep[] }[] = [
  {
    keywords: ['computer science', 'software engineering', 'software path', 'cs roadmap'],
    intro: "Here's a personalized Software Engineering roadmap based on your interest in Computer Science:",
    steps: [
      { phase: 'Foundation', title: 'Master Programming Fundamentals', detail: 'Start with Python or C++. Learn variables, loops, functions, OOP, and data structures (arrays, linked lists, trees).', icon: Code },
      { phase: 'Year 1-2', title: 'Build Core CS Knowledge', detail: 'Study algorithms, databases, operating systems, and computer networks. Practice on LeetCode and HackerRank.', icon: BookOpen },
      { phase: 'Year 2-3', title: 'Specialize & Build Projects', detail: 'Pick a track: Full-Stack (React + Node.js), Mobile (Flutter), or AI/ML (TensorFlow). Build 3-5 portfolio projects.', icon: Briefcase },
      { phase: 'Year 3-4', title: 'Internship & Job Prep', detail: 'Apply for internships at Systems Ltd, NetSol, 10Pearls, or remote startups. Practice system design interviews. Target PKR 80K-200K starting salary.', icon: Award },
    ],
  },
  {
    keywords: ['data science', 'data roadmap', 'ai ml', 'machine learning', 'ai path'],
    intro: "Here's your AI & Data Science learning roadmap:",
    steps: [
      { phase: 'Foundation', title: 'Math + Python', detail: 'Master linear algebra, statistics, and probability. Learn Python with NumPy, Pandas, and Matplotlib.', icon: BookOpen },
      { phase: 'Year 1-2', title: 'ML Fundamentals', detail: 'Study supervised/unsupervised learning, scikit-learn, feature engineering, and model evaluation. Kaggle competitions weekly.', icon: Brain },
      { phase: 'Year 2-3', title: 'Deep Learning', detail: 'Learn TensorFlow or PyTorch. Build CNNs for image classification, RNNs for NLP, and transformers. Read research papers.', icon: Database },
      { phase: 'Year 3-4', title: 'MLOps & Deployment', detail: 'Learn Docker, MLflow, model serving with FastAPI. Apply for ML Engineer roles at Afiniti, Systems Ltd, or remote US companies. Target PKR 150K-400K.', icon: Briefcase },
    ],
  },
  {
    keywords: ['ai ethics', 'ethics'],
    intro: "AI Ethics is a growing and critical field. Here's how to get started:",
    steps: [
      { phase: 'Foundation', title: 'Understand Core Concepts', detail: 'Study algorithmic bias, fairness, transparency, privacy, and the societal impact of AI systems. Read MIT Technology Review and AI Now Institute reports.', icon: BookOpen },
      { phase: 'Intermediate', title: 'Policy & Frameworks', detail: 'Explore EU AI Act, OECD AI Principles, and NIST AI Risk Management Framework. Understand GDPR and data governance implications.', icon: Brain },
      { phase: 'Advanced', title: 'Auditing & Assessment', detail: 'Learn to audit AI systems for bias using tools like IBM AI Fairness 360 and Google What-If Tool. Practice impact assessments.', icon: Database },
      { phase: 'Career', title: 'Roles & Opportunities', detail: 'AI Ethics roles are emerging at Google, Microsoft, OpenAI, and policy think tanks. Look for titles like AI Ethics Researcher, Responsible AI Engineer, or AI Policy Analyst.', icon: Briefcase },
    ],
  },
];

const textResponses: { keywords: string[]; response: string }[] = [
  {
    keywords: ['nust', 'admission', 'test', 'net'],
    response: "NUST admissions require the NUST Entry Test (NET). The merit formula is: Matric 15% + HSSC 25% + NET 60%. NET is conducted in three series (Dec, Mar, Jun/Jul) and the best score counts. For CS and Engineering, aim for 150+ marks out of 200 in NET. Tuition is PKR 180,000-250,000 per semester. Would you like details about specific programs?",
  },
  {
    keywords: ['lums', 'financial', 'aid', 'scholarship'],
    response: "LUMS offers extensive financial aid! Over 50% of students receive some form of assistance. The LUMS Financial Aid program covers up to 100% of tuition based on need. There's also the National Outreach Programme (NOP) for students from underprivileged backgrounds. Application fee is PKR 11,500 and LCAT fee is PKR 6,500. Visit lums.edu.pk/financial-aid for details.",
  },
  {
    keywords: ['fast', 'computer', 'cs', 'software'],
    response: "FAST-NUCES is excellent for CS and Software Engineering! With 6 campuses across Pakistan, it's known for strong industry placement. Admission merit: Matric 20% + HSSC 30% + Entry Test 50%. Tuition is PKR 150,000-200,000/semester. They also offer BS AI and BS Data Science now. The FAST PhD Fellowship pays PKR 60,000/month for doctoral students.",
  },
  {
    keywords: ['career', 'best', 'field', 'future', 'demand'],
    response: "Based on current market trends in Pakistan: AI/ML Engineering (+45% growth), Cybersecurity (+35%), and Cloud Engineering (+30%) are the fastest-growing fields. Software Engineering remains strong at +22%. For non-tech, Chartered Accountancy and Digital Marketing are also growing. I'd recommend taking our diagnostic quiz to see which field fits your strengths!",
  },
  {
    keywords: ['merit', 'calculate', 'aggregate', 'formula'],
    response: "Merit calculation varies by university:\n\n• NUST: Matric 15% + HSSC 25% + NET 60%\n• FAST: Matric 20% + HSSC 30% + Entry Test 50%\n• UET Lahore: Matric 10% + HSSC 40% + ECAT 50%\n• GIKI: HSSC 40% + Entry Test 60%\n• QAU: HSSC 100% (no entry test!)\n• COMSATS: Matric 20% + HSSC 40% + NTS 40%\n\nWhich university's merit do you want to calculate?",
  },
  {
    keywords: ['scholarship', 'hec', 'funded', 'need'],
    response: "Great question! Here are top scholarship options:\n\n1. HEC Need-Based Scholarship — Full tuition + PKR 6,000/month stipend for public university students\n2. Honhar Scholarship (Punjab HEC) — Full coverage, family income under PKR 350K/month\n3. PEEF Scholarships — For Punjab domicile students\n4. Stipendium Hungaricum — Fully funded study in Hungary\n5. Chevening — Fully funded Masters in UK\n\nCheck the Scholarships section below for more details and application links!",
  },
  {
    keywords: ['engineering', 'best university'],
    response: "Top engineering universities in Pakistan (by QS ranking):\n\n1. NUST (#353 world) — Best overall\n2. PIEAS (#398) — Nuclear & applied sciences\n3. GIKI — Private, excellent faculty\n4. UET Lahore — Oldest, affordable public\n5. NED UET Karachi — Sindh's top engineering\n\nFor CS specifically: NUST, FAST, LUMS, and GIKI lead the pack. Want details on any of these?",
  },
  {
    keywords: ['medical', 'mbbs', 'doctor'],
    response: "For MBBS in Pakistan:\n\nTop medical universities:\n• Aga Khan University (AKU)\n• King Edward Medical University (KEMU)\n• Allama Iqbal Medical College\n• Shifa Tameer-e-Millat University\n\nAdmission is through MDCAT (Medical & Dental College Admission Test). Merit: HSSC 40% + MDCAT 50% + Matric 10%. MBBS is a 5-year program followed by 1-year house job.",
  },
];

const defaultResponse = "I'm EduPilot AI, your guide for university admissions, career planning, and scholarships! You can ask me about:\n\n• University admission requirements and merit formulas\n• Scholarship opportunities (HEC, PEEF, international)\n• Career recommendations based on your interests\n• Learning roadmaps for CS, Data Science, AI Ethics, and more\n• Fee structures and comparisons\n\nTry one of the quick examples below, or type your own question!";

function getResponse(input: string): { content: string; roadmap?: RoadmapStep[] } {
  const lower = input.toLowerCase();

  for (const r of roadmapResponses) {
    if (r.keywords.some((k) => lower.includes(k))) {
      return { content: r.intro, roadmap: r.steps };
    }
  }

  for (const r of textResponses) {
    if (r.keywords.some((k) => lower.includes(k))) {
      return { content: r.response };
    }
  }

  return { content: defaultResponse };
}

export default function AIAssistant() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hi! I'm EduPilot AI, your personal guide for university admissions, career planning, and scholarships. Ask me about universities, careers, or funding — or try one of the quick examples below!" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, displayedText]);

  const sendMessage = (msgText?: string) => {
    const text = msgText || input;
    if (!text.trim() || sending) return;
    const userMsg = text.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setSending(true);
    setTyping(true);
    setDisplayedText('');

    setTimeout(() => {
      const result = getResponse(userMsg);
      setTyping(false);
      setSending(false);

      if (result.roadmap) {
        setMessages((prev) => [...prev, { role: 'bot', content: result.content, roadmap: result.roadmap }]);
      } else {
        setMessages((prev) => [...prev, { role: 'bot', content: '' }]);
        let i = 0;
        const fullText = result.content;
        const interval = setInterval(() => {
          if (i <= fullText.length) {
            setDisplayedText(fullText.slice(0, i));
            i += 2;
          } else {
            clearInterval(interval);
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'bot', content: fullText };
              return updated;
            });
            setDisplayedText('');
          }
        }, 15);
      }
    }, 800 + Math.random() * 500);
  };

  const isLastMessageTyping = displayedText.length > 0;

  const suggestions = [
    'Software Engineering Path',
    'Data Science Roadmap',
    'How do I calculate NUST merit?',
    'Best engineering universities?',
    'Tell me about LUMS financial aid',
    'AI Ethics',
  ];

  return (
    <section id="ai-assistant" className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div ref={ref} className={`relative max-w-4xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <MessageSquare className="w-4 h-4 text-primary-300" />
            <span className="text-sm text-primary-300 font-medium">AI Pathfinder Assistant</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            Chat with <span className="text-gradient-primary">EduPilot AI</span>
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">
            Your 24/7 guide for admissions, merit calculations, course selection, and career roadmaps. Ask anything — or try a quick example below.
          </p>
        </div>

        <div className="glass rounded-3xl overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 glass-light">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 rounded-full border-2 border-dark-900" />
            </div>
            <div>
              <div className="font-display font-semibold text-white text-sm">EduPilot AI</div>
              <div className="text-xs text-success-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse" /> Online — typically replies instantly
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[450px] overflow-y-auto scrollbar-thin px-6 py-5 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === 'bot' ? 'bg-gradient-to-br from-primary-400 to-secondary-600' : 'bg-dark-600'
                }`}>
                  {msg.role === 'bot' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'bot'
                    ? 'glass-light text-dark-100 rounded-tl-sm'
                    : 'bg-gradient-to-br from-primary-500 to-secondary-600 text-white rounded-tr-sm'
                }`}>
                  {i === messages.length - 1 && isLastMessageTyping && msg.role === 'bot' ? (
                    <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed">
                      {displayedText}
                      <span className="inline-block w-2 h-4 bg-primary-400 ml-0.5 animate-pulse align-middle" />
                    </pre>
                  ) : (
                    <>
                      <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed">{msg.content}</pre>
                      {msg.roadmap && (
                        <div className="mt-4 space-y-3">
                          {msg.roadmap.map((step, si) => (
                            <div key={si} className="flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: `${si * 0.15}s` }}>
                              <div className="flex flex-col items-center shrink-0">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
                                  <step.icon className="w-4 h-4 text-white" />
                                </div>
                                {si < msg.roadmap!.length - 1 && <div className="w-0.5 h-8 bg-gradient-to-b from-primary-500/50 to-transparent mt-1" />}
                              </div>
                              <div className="flex-1 pb-2">
                                <div className="text-[10px] font-bold text-primary-300 uppercase tracking-wider mb-0.5">{step.phase}</div>
                                <div className="text-sm font-semibold text-white mb-1">{step.title}</div>
                                <div className="text-xs text-dark-200 leading-relaxed">{step.detail}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="glass-light rounded-2xl rounded-tl-sm px-4 py-4 flex gap-1.5">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Quick example chips — always visible */}
          <div className="px-6 pb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); sendMessage(s); }}
                disabled={sending}
                className="px-3 py-1.5 text-xs glass-light text-dark-100 rounded-full hover:bg-primary-500/15 hover:text-primary-200 transition-all flex items-center gap-1 disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" /> {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-t border-white/5">
            <input
              type="text"
              placeholder="Ask about universities, careers, scholarships, or learning paths..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={sending}
              className="flex-1 px-4 py-3 bg-dark-900/50 border border-white/10 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20 transition-all text-sm disabled:opacity-60"
            />
            <button
              onClick={() => sendMessage()}
              disabled={sending || !input.trim()}
              className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-primary-500/30 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
