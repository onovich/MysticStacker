// src/view/screens/EndScreen.jsx
import React from 'react';

export function EndScreen() {
  return (
    <div className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-1000 px-4 select-none">
      <div className="text-8xl mb-6 drop-shadow-[0_0_40px_rgba(234,179,8,1)] animate-pulse">👑</div>
      <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-400 to-yellow-700 mb-4 tracking-[0.2em] text-center">维 度 飞 升</h1>
      <p className="text-lg sm:text-xl text-purple-200 mb-12 max-w-xl text-center leading-relaxed">
        血肉归于尘土，理智融于星辉。你构筑了通往彼岸的阶梯。旧日支配者向你敞开了大门。
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-10 py-4 bg-gradient-to-r from-purple-900 to-indigo-950 hover:from-purple-800 text-amber-500 font-bold rounded-xl border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:scale-105 tracking-widest"
      >
        重 返 凡 尘
      </button>
    </div>
  );
}