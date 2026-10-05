import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Cpu,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  BookmarkPlus,
  HelpCircle,
  AlertCircle,
  FileQuestion,
  ChevronDown,
  Info,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useProjects } from '../context/ProjectContext';
import { apiService } from '../services/api';

export const AIAssistantView: React.FC = () => {
  const { language, setLanguage, t } = useSettings();
  const { activeProject, addSavedProblem } = useProjects();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text:
        language === 'ur'
          ? 'السلام علیکم! میں ہوں MapForge AI – پب جی اور کسٹم گیم میپ بنانے اور لیول ڈیزائن کا اسسٹنٹ۔ آپ اپنے میپ کے ٹیرین، روڈز، بلڈنگ کولیشن، لائٹنگ، ایف پی ایس آپٹیمائزیشن یا کسی بھی ایرر کے بارے میں پوچھ سکتے ہیں۔'
          : language === 'roman_ur'
          ? 'Salam! Main hoon MapForge AI – PUBG aur custom game maps level design assistant. Aap terrain sculpting, road splines, building collision, lighting bake, draw call optimization ya kisi bhi editor bug ke baray mein sawal pooch saktay hain.'
          : "Hello! I am MapForge AI – your dedicated PUBG-style map creation and level design assistant. Ask me about terrain heightmaps, road splines, building collision, sightline balance, loot distribution, lighting, or troubleshooting editor errors.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeepThink, setIsDeepThink] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isLoading) return;

    setErrorStatus(null);
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDeepThink,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const projectContext = activeProject
        ? {
            name: activeProject.name,
            theme: activeProject.theme,
            size: activeProject.mapSize,
            notes: activeProject.notes,
            recentProblems: activeProject.savedProblems.slice(0, 3),
          }
        : undefined;

      const res = await apiService.sendChat({
        messages: newMessages.map((m) => ({ role: m.role, text: m.text })),
        language,
        isDeepThink,
        projectContext,
      });

      const modelMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDeepThink: res.isDeepThink,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorStatus(err.message || 'Something went wrong. Please check your connection or retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToProject = (id: string, text: string) => {
    if (!activeProject) return;
    // Extract first line as problem
    const lines = text.split('\n').filter((l) => l.trim().length > 0);
    const problem = lines[0]?.replace(/^#+\s*/, '') || 'AI Level Design Solution';
    addSavedProblem(activeProject.id, problem, text);
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2500);
  };

  const samplePrompts = [
    { label: 'Bridge Collision Bug', prompt: 'Why do players fall through my bridge mesh in PIE?' },
    { label: 'Landscape Texture Stretch', prompt: 'My terrain texture is stretching vertically on cliffs. How do I fix it?' },
    { label: 'Town Draw Call Lag', prompt: 'FPS drops severely when looking towards my main town. How do I optimize draw calls?' },
    { label: 'Roman Urdu Question', prompt: 'Roman Urdu: Mere custom map mein player building ke andar stuck ho raha hai, collision kaisy theek karun?' },
    { label: 'اردو سوال', prompt: 'اردو: کسٹم میپ میں روڈ اور برج کا کولیشن کیسے سیٹ کریں؟' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto p-4 md:p-6 select-text">
      {/* Top Bar with Deep Think toggle & active project indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Chakra_Petch'] font-bold text-sm text-zinc-100">
                MapForge AI Assistant
              </span>
              {activeProject && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  Memory Active: {activeProject.name}
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400">
              8-Step Structured Level Design & Troubleshooting Engine
            </p>
          </div>
        </div>

        {/* Deep Think toggle button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDeepThink(!isDeepThink)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition border ${
              isDeepThink
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-950/50'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200 hover:bg-zinc-700'
            }`}
            title="Perform deeper root-cause diagnosis, ranked causes, and backup methods"
          >
            <Cpu className={`w-3.5 h-3.5 ${isDeepThink ? 'text-cyan-400 animate-spin-slow' : ''}`} />
            <span>Deep Problem Solve</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isDeepThink ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-zinc-600'
              }`}
            />
          </button>

          <button
            onClick={() =>
              setMessages([
                {
                  id: 'reset-msg',
                  role: 'model',
                  text: 'Chat history reset. How can I help you with your map today?',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] md:max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed border ${
                  isUser
                    ? 'bg-amber-500/10 border-amber-500/30 text-zinc-100 rounded-br-xs'
                    : msg.isDeepThink
                    ? 'bg-zinc-900 border-cyan-500/30 text-zinc-200 rounded-bl-xs shadow-lg shadow-cyan-950/20'
                    : 'bg-zinc-900/90 border-zinc-800 text-zinc-200 rounded-bl-xs'
                }`}
              >
                {/* Header inside assistant message */}
                {!isUser && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-amber-400">MapForge AI</span>
                      {msg.isDeepThink && (
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-semibold">
                          DEEP REASONING
                        </span>
                      )}
                    </div>
                    <span className="text-zinc-400 text-[10px]">{msg.timestamp}</span>
                  </div>
                )}

                {/* Message Content */}
                <div
                  className={`whitespace-pre-wrap font-sans ${
                    language === 'ur' ? 'font-serif text-right leading-loose' : ''
                  }`}
                >
                  {msg.text}
                </div>

                {/* Action buttons on assistant message */}
                {!isUser && (
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800/60 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center gap-1 hover:text-amber-400 transition"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {activeProject && (
                        <button
                          onClick={() => handleSaveToProject(msg.id, msg.text)}
                          className="flex items-center gap-1 hover:text-amber-400 transition"
                        >
                          {savedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Saved to Project</span>
                            </>
                          ) : (
                            <>
                              <BookmarkPlus className="w-3.5 h-3.5" />
                              <span>Save to Project Notes</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-zinc-400">
                      Educational Map Studio
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading state indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl p-4 bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 border-t-transparent animate-spin ${
                  isDeepThink ? 'border-cyan-400' : 'border-amber-400'
                }`}
              />
              <span className="font-mono text-zinc-300">
                {isDeepThink ? t('analyzing') : 'Formulating 8-step solution...'}
              </span>
            </div>
          </div>
        )}

        {/* Error notification banner with retry */}
        {errorStatus && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorStatus}</span>
            </div>
            <button
              onClick={() => handleSend()}
              className="px-2.5 py-1 rounded bg-red-900/60 hover:bg-red-800/60 text-white font-medium text-xs transition"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono uppercase text-zinc-400 shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-amber-500" /> Prompts:
        </span>
        {samplePrompts.map((sp) => (
          <button
            key={sp.label}
            onClick={() => handleSend(sp.prompt)}
            disabled={isLoading}
            className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 border border-zinc-800 transition shrink-0 disabled:opacity-50"
          >
            {sp.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="pt-2">
        <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800 focus-within:border-amber-500/50 transition p-2 flex items-end gap-2 shadow-xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              language === 'ur'
                ? 'اپنے میپ کے مسئلے یا لیول ڈیزائن کے بارے میں سوال لکھیں...'
                : language === 'roman_ur'
                ? 'Apne map creation ya level design ke baray mein sawal likhein...'
                : 'Describe your map problem (e.g. collision, LOD lag, lighting seam, terrain texture)...'
            }
            rows={2}
            className={`w-full bg-transparent text-xs md:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none px-2 py-1 ${
              language === 'ur' ? 'font-serif text-right' : ''
            }`}
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl transition shrink-0 ${
              input.trim() && !isLoading
                ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 px-2 pt-2">
          <span>Enter sends • Shift + Enter new line</span>
          <span>Educational & Level Design Assistance Only</span>
        </div>
      </div>
    </div>
  );
};
