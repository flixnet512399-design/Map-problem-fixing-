import React, { useState } from 'react';
import {
  Settings,
  Globe2,
  Cpu,
  Layers,
  Trash2,
  ShieldCheck,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useProjects } from '../context/ProjectContext';
import { EditorPreference, Language, ResponseLength } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    language,
    setLanguage,
    editor,
    setEditor,
    responseLength,
    setResponseLength,
  } = useSettings();

  const { resetToDefaults } = useProjects();
  const [resetConfirm, setResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleResetData = () => {
    resetToDefaults();
    setResetConfirm(true);
    setTimeout(() => {
      setResetConfirm(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" />
            <h3 className="font-['Chakra_Petch'] font-bold text-base text-zinc-100">
              Studio Settings & Preferences
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-sm">
            ✕
          </button>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Globe2 className="w-4 h-4 text-amber-500" />
            Assistant Language (Urdu / Roman Urdu / English)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`p-2.5 rounded-xl border text-xs font-medium transition ${
                language === 'en'
                  ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('roman_ur')}
              className={`p-2.5 rounded-xl border text-xs font-medium transition ${
                language === 'roman_ur'
                  ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              Roman Urdu
            </button>
            <button
              onClick={() => setLanguage('ur')}
              className={`p-2.5 rounded-xl border text-xs font-medium font-serif transition ${
                language === 'ur'
                  ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              اردو (Urdu)
            </button>
          </div>
        </div>

        {/* Editor Preference */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Default Map Editor / Engine
          </label>
          <select
            value={editor}
            onChange={(e) => setEditor(e.target.value as EditorPreference)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none"
          >
            <option value="Unreal Engine 5">Unreal Engine 5 (Nanite, Lumen, World Partition)</option>
            <option value="Unreal Engine 4">Unreal Engine 4 (Standard Landscape & Lightmass)</option>
            <option value="PUBG WOW Editor">PUBG World of Wonder (WOW) Custom Map Editor</option>
            <option value="Unity / Generic">Unity / Generic Level Design</option>
          </select>
        </div>

        {/* AI Response Detail Length */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            AI Diagnostic Response Length
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['concise', 'balanced', 'detailed'] as ResponseLength[]).map((len) => (
              <button
                key={len}
                onClick={() => setResponseLength(len)}
                className={`p-2 rounded-xl border text-xs capitalize transition ${
                  responseLength === len
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-semibold'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>

        {/* Strict Anti-Cheat & Ethical Policy Box */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-900/50 space-y-1.5 text-xs text-zinc-400">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Anti-Cheat & Fair Play Compliance</span>
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-400">
            MapForge AI is strictly designed as an educational tool for level designers, map creators, and 3D environment artists. It does not provide cheats, wallhacks, aimbots, memory injection, bypasses, or methods to compromise running game clients.
          </p>
        </div>

        {/* Reset Data */}
        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-red-950/40 border border-zinc-800 hover:border-red-500/40 text-xs text-zinc-400 hover:text-red-400 transition"
          >
            {resetConfirm ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Restored to Defaults</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Sample Projects</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
