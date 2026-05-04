// src/logic/hooks/useGameLoop.js
import { useEffect, useRef } from 'react';
import { RECIPE_INDEX, RECIPES } from '../../data/recipeRegistry.js';
import { generateId } from '../engine/utils.js';

export function useGameLoop(hasStarted, hasWon, setStacks, setHasWon, stateRef) {
  useEffect(() => {
    if (!hasStarted || hasWon) return;
    const interval = setInterval(() => {
      setStacks(prev => {
        if (prev.length === 0) return prev;
        let newS = [...prev]; 
        let spawned = []; 
        let won = false; 
        let changed = false;
        
        for (let i = 0; i < newS.length; i++) {
          let st = newS[i];
          if (stateRef.current.dragInfo && stateRef.current.dragInfo.originalStackId === st.id) continue;
          
          const possible = RECIPE_INDEX[st.cards[0].type] || [];
          let counts = {}; 
          for(let c=1; c<st.cards.length; c++) counts[st.cards[c].type] = (counts[st.cards[c].type] || 0) + 1;
          
          let valid = possible.filter(r => {
            if (st.cards.length < r.inputs.length) return false;
            for (let k in r.reqCounts) if ((counts[k] || 0) < r.reqCounts[k]) return false;
            return true;
          }).sort((a,b) => b.inputs.length - a.inputs.length);
          
          const r = valid[0];
          if (r) {
            changed = true;
            const prog = (st.currentRecipeId === r.id) ? st.progress + 50 : 50;
            if (prog >= r.time) {
              let rem = []; 
              let toCon = r.inputs.slice(1); 
              let ret = {}; 
              r.retained.forEach(x => ret[x] = (ret[x] || 0) + 1);
              
              if (ret[st.cards[0].type] > 0) { rem.push(st.cards[0]); ret[st.cards[0].type]--; }
              for(let j=1; j<st.cards.length; j++){
                let c = st.cards[j]; let idx = toCon.indexOf(c.type);
                if (idx > -1) { 
                    toCon.splice(idx,1); 
                    if (ret[c.type]>0){ rem.push(c); ret[c.type]--; } 
                } else rem.push(c);
              }
              
              r.outputs.forEach((ot, k) => { 
                if(ot === 'transcendence') won = true; 
                spawned.push({
                  id: generateId(), 
                  x: st.x + 140 + k*30, 
                  y: st.y + k*20, 
                  cards: [{id: generateId(), type: ot}], 
                  progress: 0, 
                  currentRecipeId: null
                }); 
              });
              
              newS[i] = rem.length === 0 ? null : { ...st, cards: rem, progress: 0, currentRecipeId: null };
            } else {
                newS[i] = { ...st, progress: prog, currentRecipeId: r.id };
            }
          } else if (st.progress > 0) { 
            changed = true; 
            newS[i] = { ...st, progress: 0, currentRecipeId: null }; 
          }
        }
        
        if (won) setHasWon(true);
        return changed || spawned.length > 0 ? newS.filter(x => x !== null).concat(spawned) : prev;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [hasStarted, hasWon, setStacks, setHasWon, stateRef]);
}