// src/view/components/Card.jsx
import React from 'react';
import { CARD_TYPES } from '../../data/cardRegistry.js';
import { CARD_WIDTH, CARD_HEIGHT, STACK_OFFSET } from '../../logic/engine/utils.js';

export function Card({ card, index, isDragging, onPointerDown, onTouchStart }) {
  const t = CARD_TYPES[card.type] || CARD_TYPES.unknown;
  const isStarterGate = card.type === 'gate' && index === 0;

  return (
    <div
      key={card.id}
      className={`card-class absolute rounded-xl border-2 shadow-2xl flex flex-col items-center justify-between p-3 ${t.bg} ${t.border} ${t.text} transition-transform hover:brightness-110 ${isStarterGate ? 'animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.5)]' : ''}`}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        top: index * STACK_OFFSET,
        zIndex: index,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onPointerDown={!isDragging ? onPointerDown : undefined}
      onTouchStart={!isDragging ? onTouchStart : undefined}
    >
      <div className="text-sm font-bold text-center w-full truncate pointer-events-none">{t.name}</div>
      <div className="text-5xl my-2 flex-1 flex items-center justify-center drop-shadow-md pointer-events-none">{t.emoji}</div>
      <div className="text-[10px] text-center opacity-70 leading-tight h-8 pointer-events-none">{t.desc}</div>
    </div>
  );
}