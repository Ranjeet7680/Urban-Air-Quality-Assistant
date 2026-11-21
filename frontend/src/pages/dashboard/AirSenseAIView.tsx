import React, { useState, useRef, useEffect } from 'react';
import {
  Brain,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Radio,
  FileText,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAirQuality } from '../../context/AirQualityContext';
import { api } from '../../services/api';
import { AIChatMessage } from '../../types';

export const AirSenseAIView: React.FC = () => {
  const { user } = useAuth();
  const { selectedCity, airQuality } = useAirQuality();

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Hello ${user?.full_name?.split(' ')[0] || 'there'}! I am **AirSense AI**, your grounded environmental intelligence companion.

I have synchronized live physical telemetry for **${selectedCity}** (Current AQI: **${airQuality?.aqi ?? 45}**, Dominant: **${airQuality?.dominant_pollutant ?? 'PM2.5'}**).

You can ask me questions about workout safety, atmospheric dispersion, pollution causes, or pediatric precautions. All my responses are strictly grounded in verified sensor readings and WHO 2021 guidelines.`,
      measured_badge: `${selectedCity}: AQI ${airQuality?.aqi ?? 45} (Live Physical Observation)`,
      forecast_badge: 'Copernicus CAMS 24h Trend Active',
      ai_badge: 'Grounded Gemini AI Reasoning',
      suggested_actions: [
        'Check outdoor cardio workout safety',
        'Review WHO particulate exposure limits',
        'Identify local clean air pockets'
      ],
      citations: [
        'World Health Organization 2021 Global Air Quality Guidelines',
        'US EPA National Ambient Air Quality Standards (NAAQS)',
        'Copernicus Atmosphere Monitoring Service (CAMS)'
      ],
      timestamp: 'Just now'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<number | undefined>(undefined);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const quickQuestions = [
    'Is it safe to exercise outdoors right now?',
    'Why is PM2.5 the dominant pollutant today?',
    'Which nearby areas in the city have cleaner air?',
    'What precautions should people with asthma take today?',
    'Explain today\'s atmospheric dispersion and wind factors.',
    'Should I keep my home windows open or closed?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clean up any audio or speech recognition on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakMessage = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (playingMessageId === id) {
      window.speechSynthesis.cancel();
      setPlayingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown asterisks and hash tags for clearer voice reading
    const cleanSpeech = text.replace(/[*#_`]/g, '').replace(/\[.*?\]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.onend = () => setPlayingMessageId(null);
    utterance.onerror = () => setPlayingMessageId(null);

    window.speechSynthesis.speak(utterance);
    setPlayingMessageId(id);
  };

  const handleToggleVoiceInput = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInputPrompt(transcript);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleResetConversation = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingMessageId(null);
    setConversationId(undefined);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        content: `Conversation reset. I am ready with live atmospheric observations for **${selectedCity}**. Ask me any environmental or health question.`,
        timestamp: 'Just now'
      }
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isSending) return;

    const userMsg: AIChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsSending(true);

    try {
      const res = await api.sendAIChat(query, selectedCity, conversationId, airQuality);
      setConversationId(res.conversation_id);

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: res.reply,
        measured_badge: res.measured_data_badge,
        forecast_badge: res.forecast_badge,
        ai_badge: res.ai_badge,
        suggested_actions: res.suggested_actions,
        citations: res.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: AIChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: `I encountered a momentary connection hiccup while querying atmospheric telemetry: ${err.message || 'Please retry.'}`,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4 animate-fade-in">
      
      {/* Top AI Identity Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-emerald-500/10 border border-blue-200/80 dark:border-blue-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                AirSense AI Environmental Assistant
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                Ground-Truth Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Grounded in live telemetry from {airQuality?.data_source || 'Open-Meteo & Copernicus'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetConversation}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors text-xs flex items-center gap-1 cursor-pointer"
            title="Reset Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Context:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              {selectedCity} (AQI {airQuality?.aqi ?? '--'})
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto space-y-6 shadow-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`space-y-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-tl-none'
                }`}
              >
                {/* Parse Markdown-like lines */}
                <div className="space-y-2 whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Grounding Badges for Assistant */}
                {msg.sender === 'assistant' && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      {msg.measured_badge && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-semibold border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          {msg.measured_badge}
                        </span>
                      )}
                      {msg.forecast_badge && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-cyan-400 font-mono text-[10px] font-semibold border border-blue-500/20">
                          <Sparkles className="w-3 h-3" />
                          {msg.forecast_badge}
                        </span>
                      )}
                    </div>

                    {/* Actionable suggestions checklist */}
                    {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Actionable Recommendations
                        </span>
                        <div className="space-y-1">
                          {msg.suggested_actions.map((act, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scientific Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-2 text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Validated against: </span>
                        {msg.citations.join(' • ')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1">
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSpeakMessage(msg.id, msg.content)}
                      className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                        playingMessageId === msg.id ? 'text-blue-600 font-bold' : 'text-slate-400'
                      }`}
                      title={playingMessageId === msg.id ? 'Stop Voice' : 'Listen to AI Audio'}
                    >
                      {playingMessageId === msg.id ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-slate-400"
                      title="Copy Response"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex gap-3 max-w-md mr-auto">
            <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              AirSense AI is evaluating physical telemetry & CAMS dispersion models...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold uppercase text-[10px] whitespace-nowrap pl-1">
          Suggestions:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer shadow-sm"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm"
      >
        <button
          type="button"
          onClick={handleToggleVoiceInput}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={isListening ? 'Listening... click to stop' : 'Voice input (Dictation)'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={`Ask AirSense AI about ${selectedCity}'s air quality, workout safety, or trends...`}
          className="flex-1 px-3 py-2 text-sm bg-transparent text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
        />

        <button
          type="submit"
          disabled={!inputPrompt.trim() || isSending}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};
