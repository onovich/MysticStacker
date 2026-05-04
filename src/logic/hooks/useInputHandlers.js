// src/logic/hooks/useInputHandlers.js
import { useEffect } from 'react';
import { generateId, STACK_OFFSET } from '../engine/utils.js';

export function getCoords(e) {
  return (e.touches && e.touches.length > 0) 
    ? { x: e.touches[0].clientX, y: e.touches[0].clientY } 
    : { x: e.clientX, y: e.clientY };
}

export function getPinchDist(t) {
  return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
}

export function useInputHandlers({
    stateRef, 
    setDragInfo, 
    setPan, 
    setZoom, 
    setStacks,
    initialPinchDistRef,
    initialPinchZoomRef,
    isPanningRef
}) {
  useEffect(() => {
    const move = (e) => {
      const s = stateRef.current; 
      if (!s.hasStarted) return;

      if (e.touches && e.touches.length === 2 && initialPinchDistRef.current) {
        if (e.cancelable) e.preventDefault();
        setZoom(Math.min(Math.max(0.2, initialPinchZoomRef.current * (getPinchDist(e.touches) / initialPinchDistRef.current)), 3));
        return;
      }

      const c = getCoords(e); 
      if (c.x === undefined) return;

      if (s.dragInfo) {
        const bx = (c.x - s.pan.x) / s.zoom; 
        const by = (c.y - s.pan.y) / s.zoom;
        setDragInfo(prev => prev ? { ...prev, x: bx - prev.offsetX, y: by - prev.offsetY } : null);
      } else if (isPanningRef.current && (!e.touches || e.touches.length !== 2)) {
        setPan({ 
            x: isPanningRef.current.initPanX + (c.x - isPanningRef.current.startX), 
            y: isPanningRef.current.initPanY + (c.y - isPanningRef.current.startY) 
        });
      }
    };

    const up = () => {
      const s = stateRef.current; 
      initialPinchDistRef.current = null; 
      isPanningRef.current = null;
      
      if (!s.dragInfo) return;
      const currentDrag = s.dragInfo;
      
      setStacks(prev => {
        let target = null; 
        let min = 90;
        prev.forEach(st => { 
            const dist = Math.hypot(st.x - currentDrag.x, st.y + (st.cards.length - 1) * STACK_OFFSET - currentDrag.y); 
            if (dist < min) { min = dist; target = st; } 
        });
        
        if (target) {
            return prev.map(st => st.id === target.id ? { ...st, cards: [...st.cards, ...currentDrag.cards], progress: 0, currentRecipeId: null } : st);
        }
        return [...prev, { id: generateId(), x: currentDrag.x, y: currentDrag.y, cards: currentDrag.cards, progress: 0, currentRecipeId: null }];
      });
      setDragInfo(null);
    };

    window.addEventListener('pointermove', move); 
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('pointerup', up); 
    window.addEventListener('touchend', up); 
    window.addEventListener('touchcancel', up);
    
    return () => { 
        window.removeEventListener('pointermove', move); 
        window.removeEventListener('touchmove', move); 
        window.removeEventListener('pointerup', up); 
        window.removeEventListener('touchend', up); 
        window.removeEventListener('touchcancel', up); 
    };
  }, [setDragInfo, setPan, setZoom, setStacks, stateRef, initialPinchDistRef, initialPinchZoomRef, isPanningRef]);
}