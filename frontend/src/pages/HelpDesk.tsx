import React, { useState, useRef, useEffect, forwardRef } from 'react';
import axios from 'axios';
import {
  LifeBuoy,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ChevronDown,
  Keyboard as KeyboardIcon,
  X,
  Delete,
  ArrowUp,
  Terminal,
  Layers,
  ShieldCheck,
  Zap,
} from 'lucide-react';

/**
 * Integrated Virtual Keyboard Component
 * Scoped precisely to the component bounds.
 * Designed with physical depth and tactile feedback.
 */
const VirtualKeyboard = forwardRef<
  HTMLDivElement,
  {
    onKeyPress: (key: string) => void;
    onClose: () => void;
    activeInputName: string;
  }
>(({ onKeyPress, onClose, activeInputName }, ref) => {
  const [isShift, setIsShift] = useState(false);

  const layouts = {
    default: [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'BKSP'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '@'],
      ['SHIFT', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '-'],
      ['SPACE', 'DONE'],
    ],
    shift: [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'BKSP'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '_'],
      ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '!', '?'],
      ['SPACE', 'DONE'],
    ],
  };

  const currentLayout = isShift ? layouts.shift : layouts.default;

  const handleKeyClick = (key: string) => {
    if (key === 'SHIFT') {
      setIsShift(!isShift);
    } else if (key === 'DONE') {
      onClose();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div
      ref={ref}
      className="absolute bottom-0 left-0 right-0 z-[60] bg-[#fdfdfd] border-t border-slate-200 p-8 shadow-[0_-30px_80px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom-full duration-500 rounded-b-[60px]"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#002b5c] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <KeyboardIcon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                Hardware Interface
              </p>
              <p className="text-sm font-bold text-[#002b5c] tracking-tight uppercase italic">
                Active Input: {activeInputName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close keyboard"
            className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-red-500 transition-all active:scale-90 shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {currentLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2.5">
              {row.map((key) => {
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKeyClick(key)}
                    className={`
                      h-16 flex items-center justify-center rounded-[20px] font-bold text-xl transition-all active:translate-y-1 shadow-sm border-b-4
                      ${key === 'SPACE' ? 'flex-[4]' : 'flex-1'}
                      ${key === 'DONE' ? 'bg-[#002b5c] text-white border-blue-900 flex-[1.4]' : 'bg-white text-[#002b5c] border-slate-200 hover:bg-slate-50'}
                      ${key === 'SHIFT' && isShift ? 'bg-blue-600 text-white border-blue-800' : ''}
                      ${key === 'BKSP' ? 'text-red-500' : ''}
                    `}
                  >
                    {key === 'BKSP' ? (
                      <Delete size={24} />
                    ) : key === 'SHIFT' ? (
                      <ArrowUp size={24} />
                    ) : key === 'DONE' ? (
                      'CONFIRM'
                    ) : key === 'SPACE' ? (
                      'SPACE'
                    ) : (
                      key
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/**
 * HelpDesk Module
 * Executive Interface for Kiosk Maintenance.
 */
const HelpDesk = () => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'other',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const keyboardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Close keyboard on outside click logic
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        activeInput &&
        keyboardRef.current &&
        !keyboardRef.current.contains(target) &&
        formRef.current &&
        !formRef.current.contains(target)
      ) {
        setActiveInput(null);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [activeInput]);

  const handleVirtualKeyPress = (key: string) => {
    if (!activeInput) return;
    const field = activeInput === 'Heading' ? 'subject' : 'description';

    setFormData((prev) => {
      const current = prev[field];
      if (key === 'BKSP') return { ...prev, [field]: current.slice(0, -1) };
      if (key === 'SPACE') return { ...prev, [field]: current + ' ' };
      return { ...prev, [field]: current + key };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) {
      setError('Incomplete Payload: All mandatory fields must be populated.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setActiveInput(null);

    try {
      await axios.post('/api/help-ticket/create', formData);
      setIsSuccess(true);
      setFormData({ subject: '', description: '', category: 'other' });
    } catch {
      setError('Diagnostic Failure: Remote server rejected transmission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#fff]/80 rounded-[60px] shadow-[inset_0_4px_20px_rgba(0,0,0,0.03)] border border-white flex flex-col font-sans relative overflow-hidden">
      {/* 1. Refined Identity Header */}
      <header className="p-10 pb-8 bg-white border-b border-slate-100 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#002b5c] rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-blue-900/30">
            <LifeBuoy size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Zap size={14} className="text-blue-500 fill-blue-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
                Service Uplink
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#002b5c] tracking-tighter">
              Support Terminal
            </h1>
          </div>
        </div>

        <div className="bg-slate-50/80 backdrop-blur-md px-6 py-4 rounded-[28px] border border-slate-200 flex items-center gap-6">
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-[#002b5c] uppercase tracking-widest leading-none">
                Diagnostic Mode Active
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Environment v4.2.0
            </p>
          </div>
          <ShieldCheck size={32} className="text-[#002b5c] opacity-20" />
        </div>
      </header>

      {/* 2. Main Operational Area */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto px-12 py-10 custom-scrollbar transition-all duration-500 ${activeInput ? 'pb-[400px]' : 'pb-10'}`}
      >
        <div className="max-w-4xl mx-auto">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[50px] border border-slate-100 text-center animate-in zoom-in-95 duration-700 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-inner border border-emerald-100">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-[#002b5c] tracking-tight mb-3 uppercase italic">
                Transmission Confirmed
              </h2>
              <p className="text-lg text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                Report logged in central registry. Administrative review initiated.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-12 px-12 py-4 bg-[#002b5c] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] active:scale-95 transition-all shadow-2xl shadow-blue-900/20"
              >
                End Session
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
              {error && (
                <div className="flex items-center gap-4 p-6 bg-red-50 border border-red-100 rounded-[30px] animate-in slide-in-from-left-2">
                  <AlertCircle className="text-red-500 shrink-0" size={24} />
                  <p className="text-sm font-black text-red-900 uppercase tracking-wide">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Subject Heading */}
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-3">
                    <Terminal size={14} className="text-blue-500" /> Incident Heading
                  </label>
                  <input
                    value={formData.subject}
                    readOnly
                    onFocus={() => setActiveInput('Heading')}
                    placeholder="Short summary of bug..."
                    className={`w-full bg-white border border-slate-200 rounded-[24px] py-5 px-6 text-xl font-bold text-[#002b5c] transition-all outline-none ${activeInput === 'Heading' ? 'border-[#002b5c] shadow-2xl ring-8 ring-[#002b5c]/5' : 'hover:border-slate-300 shadow-sm'}`}
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-3">
                    <Layers size={14} className="text-blue-500" /> System Category
                  </label>
                  <div className="relative group">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                      title="Select system category for the support ticket"
                      className="w-full bg-white border border-slate-200 rounded-[24px] py-5 px-6 text-xl font-bold text-[#002b5c] appearance-none focus:outline-none focus:border-[#002b5c] transition-all cursor-pointer shadow-sm group-hover:border-slate-300"
                    >
                      <option value="software">Software Defect</option>
                      <option value="hardware">Terminal Issue</option>
                      <option value="network">Connectivity Log</option>
                      <option value="other">Other Anomaly</option>
                    </select>
                    <ChevronDown
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-[#002b5c] pointer-events-none transition-transform group-active:translate-y-0"
                      size={24}
                    />
                  </div>
                </div>
              </div>

              {/* Operational Description */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-3">
                  <MessageSquare size={14} className="text-blue-500" /> Root Cause Analysis
                </label>
                <textarea
                  value={formData.description}
                  readOnly
                  onFocus={() => {
                    setActiveInput('Description');
                    setTimeout(
                      () => scrollRef.current?.scrollBy({ top: 300, behavior: 'smooth' }),
                      100
                    );
                  }}
                  rows={5}
                  placeholder="Provide precise details for the engineering team..."
                  className={`w-full bg-white border border-slate-200 rounded-[32px] py-7 px-8 text-xl font-medium text-slate-600 transition-all outline-none leading-relaxed resize-none ${activeInput === 'Description' ? 'border-[#002b5c] shadow-2xl ring-8 ring-[#002b5c]/5' : 'hover:border-slate-300 shadow-sm'}`}
                />
              </div>

              {/* Submit Suite */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#002b5c] text-white py-8 rounded-[36px] font-black text-2xl shadow-2xl shadow-blue-900/30 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-6 group mt-6"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={32} />
                ) : (
                  <>
                    <span className="tracking-[0.1em] uppercase italic">Initiate Broadcast</span>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <Send
                        size={24}
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
                    </div>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 3. Scoped Virtual Keyboard Dock */}
      {activeInput && !isSuccess && (
        <VirtualKeyboard
          ref={keyboardRef}
          activeInputName={activeInput}
          onKeyPress={handleVirtualKeyPress}
          onClose={() => setActiveInput(null)}
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #e2e8f0; 
          border-radius: 20px; 
          border: 2px solid white;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default HelpDesk;
