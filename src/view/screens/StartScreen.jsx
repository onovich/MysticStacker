// src/view/screens/StartScreen.jsx
import React from 'react';

export function StartScreen({ onStart }) {
  return (
    <div className="w-full min-h-[100dvh] bg-slate-950 flex flex-col items-center relative overflow-y-auto font-sans px-4 py-12 select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#020617_100%)] opacity-80 min-h-[100dvh] pointer-events-none" />
      <div className="z-10 text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-black text-amber-500 tracking-[0.2em] mb-4 drop-shadow-xl">堆叠修罗场</h1>
        <p className="text-purple-300 text-sm sm:text-lg tracking-widest opacity-80">深渊在凝视着你...</p>
      </div>
      <div className="z-10 flex flex-col sm:flex-row gap-6 w-full max-w-4xl mb-12 items-stretch">
        <div
          onClick={() => onStart('scholar')}
          className="flex-1 bg-slate-900 border-2 border-blue-600 rounded-2xl p-8 cursor-pointer hover:bg-slate-800 hover:scale-105 transition-all shadow-lg flex flex-col items-center"
        >
          <div className="text-7xl mb-6">📜</div>
          <h2 className="text-2xl font-bold text-blue-400 mb-4">学 者</h2>
          <p className="text-sm text-slate-300 text-center leading-relaxed flex-1">
            从卷轴与梦境中领悟真理。获得 1x探索者, 1x大门, 1x卷轴。容易获取灵视。
          </p>
          <span className="text-blue-300 text-[10px] mt-6 border-t border-blue-900 pt-3">专注于精神与知识的升华。</span>
        </div>
        <div
          onClick={() => onStart('cultist')}
          className="flex-1 bg-slate-900 border-2 border-red-600 rounded-2xl p-8 cursor-pointer hover:bg-slate-800 hover:scale-105 transition-all shadow-lg flex flex-col items-center"
        >
          <div className="text-7xl mb-6">🩸</div>
          <h2 className="text-2xl font-bold text-red-500 mb-4">狂 徒</h2>
          <p className="text-sm text-slate-300 text-center leading-relaxed flex-1">
            以鲜血与残肢作为进阶的阶梯。获得 1x狂信徒, 1x大门, 1x血。容易获取血肉。
          </p>
          <span className="text-red-300 text-[10px] mt-6 border-t border-red-900 pt-3">通往深渊最残酷的捷径。</span>
        </div>
      </div>
    </div>
  );
}