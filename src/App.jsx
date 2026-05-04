// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, ZoomIn, ZoomOut, Focus } from 'lucide-react';
import { RECIPES } from './data/recipeRegistry.js';
import { getInitialLayout } from './data/initialLayouts.js';
import { CARD_WIDTH, CARD_HEIGHT, STACK_OFFSET } from './logic/engine/utils.js';
import { useGameLoop } from './logic/hooks/useGameLoop.js';
import { useInputHandlers } from './logic/hooks/useInputHandlers.js';
import { StartScreen } from './view/screens/StartScreen.jsx';
import { EndScreen } from './view/screens/EndScreen.jsx';
import { HelpModal } from './view/components/HelpModal.jsx';
import { Card } from './view/components/Card.jsx';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [stacks, setStacks] = useState([]);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragInfo, setDragInfo] = useState(null);
  const [hasWon, setHasWon] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [zoom, setZoom] = useState(1);

  const stateRef = useRef({ dragInfo, pan, zoom, hasStarted, stacks });
  const initialPinchDistRef = useRef(null);
  const initialPinchZoomRef = useRef(null);
  const isPanningRef = useRef(null);

  useEffect(() => { 
    stateRef.current = { dragInfo, pan, zoom, hasStarted, stacks }; 
  });

  useInputHandlers({
    stateRef,
    setDragInfo,
    setPan,
    setZoom,
    setStacks,
    initialPinchDistRef,
    initialPinchZoomRef,
    isPanningRef
  });

  useGameLoop(hasStarted, hasWon, setStacks, setHasWon, stateRef);

  function handleWheel(e) {
    if (stateRef.current.dragInfo || !stateRef.current.hasStarted) return;
    setZoom(z => Math.min(Math.max(0.2, z - e.deltaY * 0.002), 3));
  }

  function getCoords(e) {
    return (e.touches && e.touches.length > 0) ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
  }

  function handlePointerDown(e) {
    if (!hasStarted || e.target.closest('.card-class')) return;
    const c = getCoords(e);
    isPanningRef.current = { startX: c.x, startY: c.y, initPanX: pan.x, initPanY: pan.y };
  }

  function handleTouchStart(e) {
    if (!hasStarted || e.target.closest('.card-class')) return;
    if (e.touches.length === 2) {
      initialPinchDistRef.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      initialPinchZoomRef.current = zoom;
      isPanningRef.current = null;
    }
  }

  function handleCardDown(e, sid, idx) {
    if (!hasStarted || (e.button !== 0 && (!e.type || e.type.indexOf('touch') === -1))) return;
    e.stopPropagation();
    const st = stacks.find(x => x.id === sid);
    if (!st) return;
    
    const drag = st.cards.slice(idx);
    const rem = st.cards.slice(0, idx);
    const c = getCoords(e);
    
    setDragInfo({ 
      originalStackId: sid, 
      cards: drag, 
      x: st.x, 
      y: st.y + idx * STACK_OFFSET, 
      offsetX: (c.x - pan.x) / zoom - st.x, 
      offsetY: (c.y - pan.y) / zoom - (st.y + idx * STACK_OFFSET) 
    });
    
    setStacks(prev => rem.length === 0 
        ? prev.filter(x => x.id !== sid) 
        : prev.map(x => x.id === sid ? { ...x, cards: rem, progress: 0, currentRecipeId: null } : x)
    );
  }

  function startGame(selection) {
    const { stacks: initStacks, startPan } = getInitialLayout(selection);
    setPan(startPan);
    setStacks(initStacks);
    setOrigin(selection);
    setHasStarted(true);
  }

  if (!hasStarted) return <StartScreen onStart={startGame} />;

  return (
    <div className="w-full h-[100dvh] bg-slate-950 overflow-hidden relative font-sans touch-none" onWheel={handleWheel}>
      
      <div 
        className="absolute inset-0 z-0 pointer-events-auto" 
        onPointerDown={handlePointerDown} 
        onTouchStart={handleTouchStart} 
        style={{ 
            backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.2) 2px, transparent 2px)', 
            backgroundSize: `${40*zoom}px ${40*zoom}px`, 
            backgroundPosition: `${pan.x}px ${pan.y}px` 
        }}
      >
        <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', width: '100%', height: '100%', position: 'absolute' }}>
          {stacks.map(st => {
            const recipe = RECIPES.find(x => x.id === st.currentRecipeId);
            return (
              <div key={st.id} className="absolute" style={{ left: st.x, top: st.y, width: CARD_WIDTH }}>
                {st.cards.map((c, i) => (
                  <Card 
                    key={c.id} 
                    card={{ ...c, stackId: st.id }} 
                    index={i} 
                    onPointerDown={e => handleCardDown(e, st.id, i)}
                    onTouchStart={e => handleCardDown(e, st.id, i)}
                  />
                ))}
                {recipe && (
                  <div 
                    className="absolute left-0 right-0 bg-slate-900 rounded-full overflow-hidden border border-slate-600 flex items-center justify-center pointer-events-none shadow-2xl" 
                    style={{ top: (st.cards.length - 1) * STACK_OFFSET + CARD_HEIGHT + 12, height: '20px', zIndex: 100 }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 bg-amber-500 transition-all duration-75 ease-linear" style={{ width: `${(st.progress/recipe.time)*100}%` }} />
                    <span className="relative z-10 text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,1)] px-1 truncate">{recipe.name}</span>
                  </div>
                )}
              </div>
            );
          })}
          {dragInfo && (
            <div className="absolute pointer-events-none z-[999]" style={{ left: dragInfo.x, top: dragInfo.y }}>
              {dragInfo.cards.map((c, i) => <Card key={c.id} card={c} index={i} isDragging={true} />)}
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex flex-col items-end pointer-events-none drop-shadow-lg text-right select-none">
        <h1 className="text-2xl sm:text-3xl font-black text-amber-500 tracking-widest uppercase">堆叠修罗场</h1>
        <p className="text-purple-300 text-xs sm:text-sm opacity-80 font-bold">
            {origin === 'scholar' ? '学者的堕落之路' : '狂徒的血肉狂宴'}
        </p>
      </div>
      
      <div className="absolute top-4 left-4 z-[60] flex gap-2">
        <button onClick={() => setShowHelp(true)} className="bg-slate-900/90 border border-blue-500 text-blue-200 p-3 rounded-full hover:bg-slate-800 transition-colors shadow-lg backdrop-blur-sm flex items-center gap-2 select-none">
            <HelpCircle size={20} />
            <span className="text-xs font-bold tracking-widest hidden sm:inline">深渊指南</span>
        </button>
      </div>

      <div className="absolute bottom-6 right-6 z-[60] flex items-center bg-slate-900/90 border border-slate-700 rounded-lg p-1 shadow-2xl backdrop-blur-sm select-none">
        <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-2 text-slate-300 hover:text-white"><ZoomIn size={20} /></button>
        <div className="px-3 text-xs text-slate-400 font-mono w-14 text-center">{Math.round(zoom * 100)}%</div>
        <button onClick={() => setZoom(z => Math.max(0.1, z - 0.2))} className="p-2 text-slate-300 hover:text-white"><ZoomOut size={20} /></button>
        <div className="w-px h-6 bg-slate-700 mx-1" />
        <button onClick={() => { setZoom(1); setPan({ x: window.innerWidth / 2 - 400, y: window.innerHeight / 2 - 300 }); }} className="p-2 text-slate-300 hover:text-white"><Focus size={20}/></button>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} origin={origin} stacks={stacks} />}
      {hasWon && <EndScreen />}
    </div>
  );
}