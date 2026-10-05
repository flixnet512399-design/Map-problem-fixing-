import React, { useState, useRef, useEffect } from 'react';
import {
  Map as MapIcon,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Undo2,
  Redo2,
  RefreshCw,
  Award,
  Layers,
  Move,
  Maximize2,
  Shield,
  Plane,
  Radio,
  FileCheck2,
  Eye,
  Check,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { MapElement, MapReviewResult } from '../types';
import { useProjects } from '../context/ProjectContext';
import { apiService } from '../services/api';

export const MapPlannerView: React.FC = () => {
  const { activeProject, updateMapElements, updateProject } = useProjects();

  const [elements, setElements] = useState<MapElement[]>(() => {
    return activeProject?.mapElements || [];
  });

  // History for Undo/Redo
  const [history, setHistory] = useState<MapElement[][]>([elements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Flight Path line state (percentage 0 to 100)
  const [showFlightPath, setShowFlightPath] = useState(true);
  const [flightStart, setFlightStart] = useState<{ x: number; y: number }>({ x: 5, y: 15 });
  const [flightEnd, setFlightEnd] = useState<{ x: number; y: number }>({ x: 95, y: 85 });

  // Safe Zone simulation circle (center X, Y and radius in percentage)
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [safeZone, setSafeZone] = useState<{ x: number; y: number; radius: number }>({
    x: 50,
    y: 50,
    radius: 30,
  });

  // AI Layout Generator Modal state
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [genMapSize, setGenMapSize] = useState('4x4km');
  const [genPlayerCount, setGenPlayerCount] = useState(64);
  const [genIntensity, setGenIntensity] = useState('balanced');
  const [genTheme, setGenTheme] = useState('Desert & Limestone Canyons');
  const [isGenerating, setIsGenerating] = useState(false);

  // Review Modal state
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<MapReviewResult | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync with active project
  useEffect(() => {
    if (activeProject && activeProject.mapElements) {
      setElements(activeProject.mapElements);
    }
  }, [activeProject?.id]);

  const pushHistory = (newElements: MapElement[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newElements);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setElements(newElements);
    if (activeProject) {
      updateMapElements(activeProject.id, newElements);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      const prevEls = history[prevIdx];
      setElements(prevEls);
      if (activeProject) {
        updateMapElements(activeProject.id, prevEls);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      const nextEls = history[nextIdx];
      setElements(nextEls);
      if (activeProject) {
        updateMapElements(activeProject.id, nextEls);
      }
    }
  };

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  const handleAddElement = (type: MapElement['type']) => {
    const defaultLabels: Record<MapElement['type'], string> = {
      town: 'Major City POI',
      military: 'Military Outpost',
      compound: 'Residential Cluster',
      road: 'Highway Corridor',
      river: 'River Channel',
      bridge: 'Suspension Bridge',
      hill: 'Limestone Ridge',
      open_zone: 'Danger Plain',
      spawn: 'Drop Point',
      vehicle: 'Vehicle Garage',
    };

    const newEl: MapElement = {
      id: `el-${Date.now()}`,
      name: defaultLabels[type] || 'New Sector',
      type,
      x: 35 + Math.random() * 30,
      y: 35 + Math.random() * 30,
      width: type === 'town' || type === 'military' ? 14 : type === 'road' ? 24 : 10,
      height: type === 'road' ? 3 : 10,
      lootTier: type === 'military' || type === 'town' ? 'High' : 'Medium',
      notes: 'Tactical layout planning node.',
    };

    const updated = [...elements, newEl];
    pushHistory(updated);
    setSelectedId(newEl.id);
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    const updated = elements.filter((el) => el.id !== selectedId);
    pushHistory(updated);
    setSelectedId(null);
  };

  const handleDuplicateSelected = () => {
    if (!selectedElement) return;
    const clone: MapElement = {
      ...selectedElement,
      id: `el-${Date.now()}`,
      name: `${selectedElement.name} (Copy)`,
      x: Math.min(selectedElement.x + 4, 85),
      y: Math.min(selectedElement.y + 4, 85),
    };
    const updated = [...elements, clone];
    pushHistory(updated);
    setSelectedId(clone.id);
  };

  const handleElementMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDragging(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const el = elements.find((item) => item.id === id);
    if (el) {
      setDragOffset({
        x: clickX - el.x,
        y: clickY - el.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let newX = ((e.clientX - rect.left) / rect.width) * 100 - dragOffset.x;
    let newY = ((e.clientY - rect.top) / rect.height) * 100 - dragOffset.y;

    // Constrain within bounds 0 to 95
    newX = Math.max(2, Math.min(92, newX));
    newY = Math.max(2, Math.min(92, newY));

    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, x: Math.round(newX), y: Math.round(newY) } : el))
    );
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      pushHistory(elements);
    }
  };

  const handleUpdateSelected = (field: keyof MapElement, value: any) => {
    if (!selectedId) return;
    const updated = elements.map((el) => (el.id === selectedId ? { ...el, [field]: value } : el));
    pushHistory(updated);
  };

  // AI Generate Layout Action
  const handleGenerateLayout = async () => {
    setIsGenerating(true);
    try {
      const res = await apiService.generateMapLayout({
        mapSize: genMapSize,
        playerCount: genPlayerCount,
        intensity: genIntensity,
        theme: genTheme,
      });

      if (res && Array.isArray(res.suggestedPois)) {
        const newEls: MapElement[] = res.suggestedPois.map((poi: any, idx: number) => {
          let type: MapElement['type'] = 'town';
          const lower = (poi.type || '').toLowerCase();
          if (lower.includes('military') || lower.includes('base')) type = 'military';
          else if (lower.includes('bridge')) type = 'bridge';
          else if (lower.includes('compound') || lower.includes('village')) type = 'compound';
          else if (lower.includes('hill') || lower.includes('mountain')) type = 'hill';

          return {
            id: `el-gen-${Date.now()}-${idx}`,
            name: poi.name,
            type,
            x: Math.max(5, Math.min(90, poi.x || 20 + idx * 8)),
            y: Math.max(5, Math.min(90, poi.y || 20 + (idx % 4) * 15)),
            width: type === 'town' || type === 'military' ? 14 : 10,
            height: 10,
            lootTier: poi.lootTier || 'Medium',
            notes: `${poi.description} | Combat: ${poi.combatStyle || 'Tactical'}`,
          };
        });

        // Add 1 main highway road and 1 river for realism
        newEls.push({
          id: `el-gen-road-${Date.now()}`,
          name: 'Main Highway 1',
          type: 'road',
          x: 20,
          y: 50,
          width: 60,
          height: 3,
          notes: 'Main arterial rotation route connecting east and west sectors.',
        });

        pushHistory(newEls);
        setShowGenerateModal(false);
      }
    } catch (err: any) {
      console.error('Failed to generate layout:', err);
      alert('Failed to generate layout. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  // AI Review Action
  const handleReviewMap = async () => {
    if (elements.length === 0) return;
    setIsReviewing(true);
    setReviewError(null);
    setReviewResult(null);

    try {
      const res = await apiService.reviewMapLayout({
        mapElements: elements,
        mapSize: activeProject?.mapSize || '4x4km',
        theme: activeProject?.theme || 'Custom BR Map',
        notes: activeProject?.notes,
      });
      setReviewResult(res);
    } catch (err: any) {
      console.error('Review error:', err);
      setReviewError(err.message || 'Map review failed. Please try again.');
    } finally {
      setIsReviewing(false);
    }
  };

  // Color & symbol by element type
  const getElementStyle = (type: MapElement['type']) => {
    switch (type) {
      case 'town':
        return { bg: 'bg-amber-500/30', border: 'border-amber-400', text: 'text-amber-200', label: 'TOWN' };
      case 'military':
        return { bg: 'bg-red-500/30', border: 'border-red-400', text: 'text-red-200', label: 'MILITARY' };
      case 'compound':
        return { bg: 'bg-orange-500/30', border: 'border-orange-400', text: 'text-orange-200', label: 'COMPOUND' };
      case 'road':
        return { bg: 'bg-zinc-700/60', border: 'border-zinc-400', text: 'text-zinc-200', label: 'ROAD' };
      case 'river':
        return { bg: 'bg-blue-600/40', border: 'border-blue-400', text: 'text-blue-200', label: 'RIVER' };
      case 'bridge':
        return { bg: 'bg-yellow-600/40', border: 'border-yellow-400', text: 'text-yellow-200', label: 'BRIDGE' };
      case 'hill':
        return { bg: 'bg-stone-600/50', border: 'border-stone-400', text: 'text-stone-200', label: 'RIDGE' };
      case 'open_zone':
        return { bg: 'bg-rose-950/40', border: 'border-dashed border-rose-500/50', text: 'text-rose-300', label: 'DANGER ZONE' };
      case 'vehicle':
        return { bg: 'bg-emerald-500/30', border: 'border-emerald-400', text: 'text-emerald-200', label: 'VEHICLE' };
      default:
        return { bg: 'bg-zinc-800', border: 'border-zinc-500', text: 'text-zinc-200', label: 'POI' };
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Control Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono mb-1.5">
            <MapIcon className="w-3.5 h-3.5" />
            <span>2D TACTICAL WORKSPACE & AI REVIEWER</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-['Chakra_Petch'] font-bold text-white">
            Map Planner Studio
          </h1>
          <p className="text-xs text-zinc-400">
            Educational 2D tactical layout design. Position cities, roads, sniper ridges, vehicle garages, and evaluate competitive rotation balance.
          </p>
        </div>

        {/* Buttons: AI Generate Layout & Review Map */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 transition"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>AI Generate Layout</span>
          </button>

          <button
            onClick={handleReviewMap}
            disabled={isReviewing || elements.length === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition shadow-lg ${
              elements.length > 0 && !isReviewing
                ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {isReviewing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
            ) : (
              <Award className="w-4 h-4" />
            )}
            <span>Review My Map</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Toolbar: Add Element Tools */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl p-4 bg-zinc-900 border border-zinc-800 space-y-3">
            <span className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider block">
              + Add Tactical Features
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleAddElement('town')}
                className="p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 font-medium text-left transition"
              >
                + Town / City
              </button>
              <button
                onClick={() => handleAddElement('military')}
                className="p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-red-500/40 text-red-300 font-medium text-left transition"
              >
                + Military Base
              </button>
              <button
                onClick={() => handleAddElement('compound')}
                className="p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-orange-500/40 text-orange-300 font-medium text-left transition"
              >
                + Compound
              </button>
              <button
                onClick={() => handleAddElement('hill')}
                className="p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-stone-500/40 text-stone-300 font-medium text-left transition"
              >
                + Hill Ridge
              </button>
              <button
                onClick={() => handleAddElement('road')}
                className="p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-600 text-zinc-200 font-medium text-left transition"
              >
                + Highway Road
              </button>
              <button
                onClick={() => handleAddElement('bridge')}
                className="p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-yellow-500/40 text-yellow-300 font-medium text-left transition"
              >
                + Bridge Choke
              </button>
              <button
                onClick={() => handleAddElement('vehicle')}
                className="p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-emerald-500/40 text-emerald-300 font-medium text-left transition"
              >
                + Vehicle Spawn
              </button>
              <button
                onClick={() => handleAddElement('open_zone')}
                className="p-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-rose-500/40 text-rose-300 font-medium text-left transition"
              >
                + Danger Zone
              </button>
            </div>
          </div>

          {/* Overlays Toggle */}
          <div className="rounded-xl p-4 bg-zinc-900 border border-zinc-800 space-y-2.5 text-xs">
            <span className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider block">
              Tactical Overlays
            </span>

            <label className="flex items-center justify-between text-zinc-300 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-amber-400" />
                Flight Path Vector
              </span>
              <input
                type="checkbox"
                checked={showFlightPath}
                onChange={(e) => setShowFlightPath(e.target.checked)}
                className="rounded accent-amber-500"
              />
            </label>

            <label className="flex items-center justify-between text-zinc-300 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                Safe Zone Circle
              </span>
              <input
                type="checkbox"
                checked={showSafeZone}
                onChange={(e) => setShowSafeZone(e.target.checked)}
                className="rounded accent-cyan-500"
              />
            </label>
          </div>

          {/* Selected Element Property Inspector */}
          {selectedElement ? (
            <div className="rounded-xl p-4 bg-zinc-900 border border-amber-500/40 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-400 font-mono uppercase">
                  Element Inspector
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {selectedElement.type.toUpperCase()}
                </span>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Name</label>
                <input
                  type="text"
                  value={selectedElement.name}
                  onChange={(e) => handleUpdateSelected('name', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Width (%)</label>
                  <input
                    type="number"
                    min={4}
                    max={60}
                    value={selectedElement.width}
                    onChange={(e) => handleUpdateSelected('width', Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-zinc-200 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Height (%)</label>
                  <input
                    type="number"
                    min={2}
                    max={60}
                    value={selectedElement.height}
                    onChange={(e) => handleUpdateSelected('height', Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-zinc-200 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Loot Tier</label>
                <select
                  value={selectedElement.lootTier || 'Medium'}
                  onChange={(e) => handleUpdateSelected('lootTier', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-zinc-200 focus:outline-none"
                >
                  <option value="High">High Tier (Hot Drop)</option>
                  <option value="Medium">Medium Tier</option>
                  <option value="Low">Low / Rural Outpost</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Notes</label>
                <input
                  type="text"
                  value={selectedElement.notes || ''}
                  onChange={(e) => handleUpdateSelected('notes', e.target.value)}
                  placeholder="Tactical purpose..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-zinc-200 focus:outline-none text-[11px]"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-zinc-800">
                <button
                  onClick={handleDuplicateSelected}
                  className="flex-1 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Clone</span>
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="flex-1 py-1.5 rounded bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-300 flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-500 text-center">
              Click any element on the map canvas to inspect and edit its size, loot tier, or notes.
            </div>
          )}
        </div>

        {/* Center / Right 9 Cols: 2D Tactical Map Canvas */}
        <div className="lg:col-span-9 space-y-3">
          {/* Canvas Controls Bar */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-zinc-400">
                Grid: {activeProject?.mapSize || '4x4km'} (1km Grid Tiles)
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-amber-400 font-mono font-semibold">
                {elements.length} Placed Elements
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40 transition"
                title="Undo"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40 transition"
                title="Redo"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  pushHistory([]);
                  setSelectedId(null);
                }}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition"
              >
                Clear Map
              </button>
            </div>
          </div>

          {/* Interactive Tactical 2D Canvas */}
          <div
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={() => setSelectedId(null)}
            className="relative w-full aspect-square max-h-[640px] rounded-2xl bg-zinc-950 border-2 border-zinc-800 overflow-hidden cursor-crosshair select-none shadow-2xl"
            style={{
              backgroundImage: `
                radial-gradient(circle, rgba(245, 158, 11, 0.05) 1px, transparent 1px),
                linear-gradient(to right, #1f1f23 1px, transparent 1px),
                linear-gradient(to bottom, #1f1f23 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px, 12.5% 12.5%, 12.5% 12.5%',
            }}
          >
            {/* 8x8 Grid Coordinates Labels */}
            <div className="absolute top-1 left-2 text-[9px] font-mono text-zinc-600 pointer-events-none">
              A1 [0,0]
            </div>
            <div className="absolute top-1 right-2 text-[9px] font-mono text-zinc-600 pointer-events-none">
              H1 [8,0]
            </div>
            <div className="absolute bottom-1 left-2 text-[9px] font-mono text-zinc-600 pointer-events-none">
              A8 [0,8]
            </div>
            <div className="absolute bottom-1 right-2 text-[9px] font-mono text-zinc-600 pointer-events-none">
              H8 [8,8]
            </div>

            {/* Flight Path SVG Line */}
            {showFlightPath && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <line
                  x1={`${flightStart.x}%`}
                  y1={`${flightStart.y}%`}
                  x2={`${flightEnd.x}%`}
                  y2={`${flightEnd.y}%`}
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                <circle cx={`${flightStart.x}%`} cy={`${flightStart.y}%`} r="5" fill="#f59e0b" />
                <circle cx={`${flightEnd.x}%`} cy={`${flightEnd.y}%`} r="5" fill="#f59e0b" />
                <text
                  x={`${(flightStart.x + flightEnd.x) / 2}%`}
                  y={`${(flightStart.y + flightEnd.y) / 2 - 2}%`}
                  fill="#f59e0b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  FLIGHT VECTOR
                </text>
              </svg>
            )}

            {/* Safe Zone Circle Overlay */}
            {showSafeZone && (
              <div
                className="absolute rounded-full border-2 border-cyan-400 bg-cyan-500/10 pointer-events-none z-10 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                style={{
                  left: `${safeZone.x}%`,
                  top: `${safeZone.y}%`,
                  width: `${safeZone.radius * 2}%`,
                  height: `${safeZone.radius * 2}%`,
                }}
              >
                <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-cyan-300 uppercase bg-zinc-950/80 px-1 rounded">
                  SAFE ZONE PHASE 1
                </span>
              </div>
            )}

            {/* Placed Elements on Canvas */}
            {elements.map((el) => {
              const style = getElementStyle(el.type);
              const isSelected = el.id === selectedId;

              return (
                <div
                  key={el.id}
                  onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                  style={{
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    width: `${el.width}%`,
                    height: `${el.height}%`,
                  }}
                  className={`absolute rounded-lg border-2 ${style.bg} ${style.border} ${
                    isSelected
                      ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-950 shadow-xl z-20 scale-105'
                      : 'hover:border-zinc-300 z-10'
                  } transition-transform flex flex-col items-center justify-center p-1 cursor-grab active:cursor-grabbing text-center`}
                >
                  <span className={`text-[10px] font-bold font-['Chakra_Petch'] truncate w-full ${style.text}`}>
                    {el.name}
                  </span>
                  <div className="flex items-center gap-1 text-[8px] font-mono text-zinc-300">
                    <span>{style.label}</span>
                    {el.lootTier && (
                      <span className="px-1 rounded bg-zinc-950/80 text-amber-400 font-bold">
                        {el.lootTier[0]}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {elements.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-zinc-500 pointer-events-none">
                <MapIcon className="w-12 h-12 mb-2 text-zinc-700" />
                <span className="font-semibold text-sm text-zinc-400">Tactical Canvas Empty</span>
                <p className="text-xs max-w-sm mt-1">
                  Add towns, military bases, road splines, and bridges from the left panel, or click "AI Generate Layout" for an instant balanced setup.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Generate Layout Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="font-['Chakra_Petch'] font-bold text-base text-zinc-100">
                  AI Generate Balanced Map Layout
                </h3>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Map Dimensions</label>
                <select
                  value={genMapSize}
                  onChange={(e) => setGenMapSize(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200"
                >
                  <option value="1x1km">1x1km (Fast CQC Arena, e.g. Karakin/Nusa)</option>
                  <option value="2x2km">2x2km (High Pacing Battleground)</option>
                  <option value="4x4km">4x4km (Balanced Tactical, e.g. Sanhok/Vikendi)</option>
                  <option value="8x8km">8x8km (Grand Classic BR, e.g. Erangel/Miramar)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Target Player Count</label>
                <select
                  value={genPlayerCount}
                  onChange={(e) => setGenPlayerCount(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200"
                >
                  <option value={32}>32 Players (Fast skirmish)</option>
                  <option value={64}>64 Players (Competitive standard)</option>
                  <option value={100}>100 Players (Full battle royale)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Combat Intensity & Philosophy</label>
                <select
                  value={genIntensity}
                  onChange={(e) => setGenIntensity(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200"
                >
                  <option value="balanced">Balanced (High risk hot-drops + steady perimeter rotations)</option>
                  <option value="hot_drop_heavy">Action Heavy (Multiple dense urban hubs close together)</option>
                  <option value="tactical_survival">Tactical Survival (Sprawling terrain, ridges & river chokes)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Biome / Theme</label>
                <input
                  type="text"
                  value={genTheme}
                  onChange={(e) => setGenTheme(e.target.value)}
                  placeholder="e.g. Desert Oasis, Snow Archipelago, Industrial Port"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateLayout}
                disabled={isGenerating}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20"
              >
                {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isGenerating ? 'Synthesizing...' : 'Generate & Place POIs'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Review Result Drawer / Card */}
      {reviewResult && (
        <div className="rounded-2xl p-6 bg-zinc-900 border border-amber-500/40 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-bold">
                MAP DESIGN AUDIT REPORT
              </span>
              <h2 className="text-xl md:text-2xl font-['Chakra_Petch'] font-bold text-white flex items-center gap-2">
                <span>Map Design Score:</span>
                <span className="text-amber-400 font-mono">{reviewResult.overallScore}/100</span>
              </h2>
            </div>

            <button
              onClick={() => setReviewResult(null)}
              className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg bg-zinc-800"
            >
              Close Review
            </button>
          </div>

          {/* 7 Category Scores Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {Object.entries(reviewResult.categoryScores).map(([key, score]) => {
              const labelMap: Record<string, string> = {
                layout: 'Layout',
                gameplayFlow: 'Game Flow',
                variety: 'Variety',
                balance: 'Balance',
                navigation: 'Navigation',
                performance: 'Performance',
                visualDesign: 'Visual Design',
              };

              return (
                <div key={key} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block truncate">
                    {labelMap[key] || key}
                  </span>
                  <span className="text-lg font-bold font-mono text-amber-400">{score}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">/100</span>
                </div>
              );
            })}
          </div>

          {/* Summary Verdict */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider block mb-1">
              Summary Verdict
            </span>
            <p className="text-xs md:text-sm text-zinc-200 leading-relaxed">
              {reviewResult.summaryVerdict}
            </p>
          </div>

          {/* Detailed Findings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Flow Problems */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="font-semibold text-red-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Flow & Rotation Bottlenecks
              </span>
              <ul className="space-y-1 text-zinc-300">
                {reviewResult.flowProblems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-red-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Camping & Sniper Concerns */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="font-semibold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                Camping & Unchecked Vantage Points
              </span>
              <ul className="space-y-1 text-zinc-300">
                {reviewResult.campingAndSniperConcerns.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Too Open / Too Dense Areas */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="font-semibold text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Density Balance (Open vs Clustered)
              </span>
              <ul className="space-y-1 text-zinc-300">
                {reviewResult.tooOpenAreas.concat(reviewResult.tooDenseAreas).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-cyan-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Improvement Suggestions */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 space-y-2">
              <span className="font-semibold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Actionable Fix Recommendations
              </span>
              <ul className="space-y-1 text-zinc-300">
                {reviewResult.improvementSuggestions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
