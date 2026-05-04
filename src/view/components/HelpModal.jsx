// src/view/components/HelpModal.jsx
import React from 'react';
import { X } from 'lucide-react';

export function HelpModal({ onClose, origin, stacks }) {
  function generateHint() {
    const has = (t) => stacks.some(s => s.cards.some(c => c.type === t));
    if (!has('dream')) return "将劳动力👤移至梦魇之门🚪，提取梦境。";
    if (!has('insight')) return "让探索者👤凝视多个梦境💭以领悟灵视💡。";
    if (!has('scroll')) return "门🚪、灵视💡与梦境💭组合可触发卷轴📜启示。";
    if (!has('forest')) return "带着灵视💡凝视大门🚪发现阴暗森林🌲。";
    if (origin === 'cultist' && !has('seeker')) return "将血🩸滴在大门🚪上可引诱更多探索者👤。";
    return "底座卡牌决定方向。尝试不同的组合以揭开深渊的真相。";
  }

  return (
    <div className="absolute inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border-2 border-purple-900 rounded-xl max-w-md p-6 sm:p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={24}/>
        </button>
        <h2 className="text-xl sm:text-2xl font-black text-amber-500 mb-6 border-b border-slate-800 pb-4">👑 深渊指南</h2>
        <div className="bg-slate-950 border border-purple-700 p-4 rounded-lg mb-6">
          <p className="text-purple-300 text-sm italic leading-relaxed">“{generateHint()}”</p>
        </div>
        <p className="text-xs text-slate-400 mb-4 font-bold">提示：底座必须垫底；复杂的配方优先级更高。</p>
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-purple-900 hover:bg-purple-800 text-amber-500 font-bold tracking-widest rounded-lg transition-colors border border-purple-600"
        >
          继续探索
        </button>
      </div>
    </div>
  );
}