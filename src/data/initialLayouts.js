// src/data/initialLayouts.js
import { generateId } from '../logic/engine/utils.js';

export function getInitialLayout(selection) {
    let screenW = 1000, screenH = 800;
    if (typeof window !== 'undefined') { 
        screenW = window.innerWidth; 
        screenH = window.innerHeight; 
    }
    const cx = screenW / 2, cy = screenH / 2;
    const startPan = { x: cx - 400, y: cy - 300 };

    const stacks = [];
    if (selection === 'scholar') {
        stacks.push({ id: generateId(), x: cx - 200, y: cy - 100, cards: [{ id: generateId(), type: 'seeker' }], progress: 0, currentRecipeId: null });
        stacks.push({ id: generateId(), x: cx,       y: cy - 100, cards: [{ id: generateId(), type: 'gate' }], progress: 0, currentRecipeId: null });
        stacks.push({ id: generateId(), x: cx + 200, y: cy - 100, cards: [{ id: generateId(), type: 'scroll' }], progress: 0, currentRecipeId: null });
    } else {
        stacks.push({ id: generateId(), x: cx - 200, y: cy - 100, cards: [{ id: generateId(), type: 'cultist' }], progress: 0, currentRecipeId: null });
        stacks.push({ id: generateId(), x: cx,       y: cy - 100, cards: [{ id: generateId(), type: 'gate' }], progress: 0, currentRecipeId: null });
        stacks.push({ id: generateId(), x: cx + 200, y: cy - 100, cards: [{ id: generateId(), type: 'blood' }], progress: 0, currentRecipeId: null });
    }

    return { stacks, startPan };
}