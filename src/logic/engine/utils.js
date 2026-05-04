// src/logic/engine/utils.js
let _idCounter = 0;
export function generateId() {
  return `id_${Date.now()}_${_idCounter++}_${Math.random().toString(36).substr(2, 5)}`;
}

export const CARD_WIDTH = 120;
export const CARD_HEIGHT = 160;
export const STACK_OFFSET = 35;