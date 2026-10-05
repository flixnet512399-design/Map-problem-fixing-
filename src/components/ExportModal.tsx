import React, { useState } from 'react';
import {
  Download,
  FileText,
  FileJson,
  Printer,
  Check,
  FolderOpen,
  Sparkles,
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { activeProject, projects, calculateProgress } = useProjects();
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen || !activeProject) return null;

  const progress = calculateProgress(activeProject);

  const generateTxtReport = () => {
    return `=====================================================
MAPFORGE AI – LEVEL DESIGN & TROUBLESHOOTING REPORT
=====================================================
Project Name: ${activeProject.name}
Scale: ${activeProject.mapSize}
Theme: ${activeProject.theme}
Target Players: ${activeProject.targetPlayers}
QA Progress: ${progress}%
Generated: ${new Date().toLocaleString()}

LEVEL DESIGN BIBLE & SPECIFICATIONS:
-----------------------------------------------------
${activeProject.notes || 'No notes specified.'}

TACTICAL POIS & PLANNED MAP ELEMENTS (${activeProject.mapElements.length}):
-----------------------------------------------------
${activeProject.mapElements
  .map(
    (el, i) =>
      `${i + 1}. [${el.type.toUpperCase()}] "${el.name}" at coords (${el.x}%, ${el.y}%) - Tier: ${
        el.lootTier || 'N/A'
      }\n   Notes: ${el.notes || 'None'}`
  )
  .join('\n')}

PRODUCTION CHECKLIST STATUS:
-----------------------------------------------------
${activeProject.checklist
  .map((item) => `[${item.completed ? 'X' : ' '}] ${item.label} (${item.category})`)
  .join('\n')}

SAVED PROBLEMS & AI SOLUTIONS (${activeProject.savedProblems.length}):
-----------------------------------------------------
${activeProject.savedProblems
  .map(
    (sp, i) =>
      `#${i + 1}: ${sp.problem} (Logged: ${sp.date})\nSolution:\n${sp.solution}\n---------------------`
  )
  .join('\n\n')}

=====================================================
MapForge AI – Educational Level Design Assistant
`;
  };

  const handleDownloadTxt = () => {
    const text = generateTxtReport();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeProject.name.replace(/\s+/g, '_')}_Design_Doc.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(activeProject, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeProject.name.replace(/\s+/g, '_')}_Backup.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-500" />
            <h3 className="font-['Chakra_Petch'] font-bold text-base text-zinc-100">
              Export Project & Documentation
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-sm">
            ✕
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex items-center justify-between">
          <div>
            <span className="font-semibold text-zinc-200 block">{activeProject.name}</span>
            <span className="text-[11px] text-zinc-500">
              {activeProject.mapSize} • {progress}% Checklist Completed • {activeProject.savedProblems.length} Logged Fixes
            </span>
          </div>
          <span className="text-amber-400 font-mono font-bold text-xs">{activeProject.mapSize}</span>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-semibold text-zinc-400 font-mono uppercase block">
            Select Export Format:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* TXT Format */}
            <button
              onClick={handleDownloadTxt}
              className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition text-center flex flex-col items-center justify-center gap-2 group"
            >
              <FileText className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">TXT Report</span>
                <span className="text-[10px] text-zinc-500">Design Doc</span>
              </div>
            </button>

            {/* JSON Backup */}
            <button
              onClick={handleDownloadJson}
              className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition text-center flex flex-col items-center justify-center gap-2 group"
            >
              <FileJson className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">JSON Data</span>
                <span className="text-[10px] text-zinc-500">Raw Data Backup</span>
              </div>
            </button>

            {/* Print / PDF View */}
            <button
              onClick={handlePrint}
              className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 transition text-center flex flex-col items-center justify-center gap-2 group"
            >
              <Printer className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Print / PDF</span>
                <span className="text-[10px] text-zinc-500">Browser Print</span>
              </div>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-zinc-400 p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
          Exports include full level design bible notes, tactical POI coordinates, checklist audit status, and saved AI diagnostic resolutions.
        </div>

        <div className="flex justify-end pt-2 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
