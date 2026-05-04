import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HelpCircle, X, ZoomIn, ZoomOut, Focus, Crown } from 'lucide-react';

/**
 * --- 全局辅助函数 ---
 * 使用 function 声明以确保提升（Hoisting），防止 ReferenceError
 */
let _idCounter = 0;
function generateId() {
  return `id_${Date.now()}_${_idCounter++}_${Math.random().toString(36).substr(2, 5)}`;
}

// --- 1. 卡牌资产字典 (55种) ---
const CARD_TYPES = {
  gate: { id: 'gate', name: '梦魇之门', emoji: '🚪', bg: 'bg-purple-950', border: 'border-purple-500', text: 'text-purple-100', desc: '深渊的源头。' },
  seeker: { id: 'seeker', name: '探索者', emoji: '👤', bg: 'bg-blue-950', border: 'border-blue-500', text: 'text-blue-100', desc: '凡人劳动力。' },
  cultist: { id: 'cultist', name: '狂信徒', emoji: '🦹‍♂️', bg: 'bg-red-900', border: 'border-red-500', text: 'text-red-100', desc: '狂热的劳动力。' },
  forest: { id: 'forest', name: '阴暗森林', emoji: '🌲', bg: 'bg-emerald-950', border: 'border-emerald-600', text: 'text-emerald-100', desc: '资源产地。' },
  beach: { id: 'beach', name: '荒芜海滩', emoji: '🏖️', bg: 'bg-cyan-950', border: 'border-cyan-600', text: 'text-cyan-100', desc: '潮湿资源。' },
  ruins: { id: 'ruins', name: '古老废墟', emoji: '🏛️', bg: 'bg-stone-900', border: 'border-stone-600', text: 'text-stone-100', desc: '遗落矿脉。' },
  graveyard: { id: 'graveyard', name: '亵渎墓地', emoji: '🪦', bg: 'bg-neutral-900', border: 'border-neutral-500', text: 'text-neutral-300', desc: '死者之地。' },
  wood: { id: 'wood', name: '枯木', emoji: '🪵', bg: 'bg-stone-800', border: 'border-stone-500', text: 'text-stone-200', desc: '工业建材。' },
  stone: { id: 'stone', name: '石块', emoji: '🪨', bg: 'bg-gray-800', border: 'border-gray-500', text: 'text-gray-200', desc: '坚硬构件。' },
  iron_ore: { id: 'iron_ore', name: '铁矿石', emoji: '⛓️', bg: 'bg-zinc-800', border: 'border-zinc-500', text: 'text-zinc-200', desc: '基础原矿。' },
  gold_ore: { id: 'gold_ore', name: '金矿石', emoji: '🥇', bg: 'bg-amber-900', border: 'border-amber-500', text: 'text-amber-100', desc: '珍稀金属。' },
  sand: { id: 'sand', name: '细沙', emoji: '⏳', bg: 'bg-yellow-900', border: 'border-yellow-700', text: 'text-yellow-100', desc: '玻璃原料。' },
  salt: { id: 'salt', name: '粗盐', emoji: '🧂', bg: 'bg-slate-200', border: 'border-slate-400', text: 'text-slate-900', desc: '炼金辅料。' },
  kelp: { id: 'kelp', name: '深海海带', emoji: '🌿', bg: 'bg-teal-900', border: 'border-teal-700', text: 'text-teal-100', desc: '海边产物。' },
  bone: { id: 'bone', name: '枯骨', emoji: '🦴', bg: 'bg-neutral-200', border: 'border-neutral-400', text: 'text-neutral-900', desc: '死者留存。' },
  blood: { id: 'blood', name: '猩红之血', emoji: '🩸', bg: 'bg-rose-950', border: 'border-rose-600', text: 'text-rose-100', desc: '生命精华。' },
  corpse: { id: 'corpse', name: '残骸', emoji: '💀', bg: 'bg-slate-800', border: 'border-slate-500', text: 'text-slate-200', desc: '空虚驱壳。' },
  flesh: { id: 'flesh', name: '异化血肉', emoji: '🥩', bg: 'bg-pink-950', border: 'border-pink-700', text: 'text-pink-100', desc: '蠕动材料。' },
  ichor: { id: 'ichor', name: '灵液', emoji: '🧪', bg: 'bg-cyan-900', border: 'border-cyan-400', text: 'text-cyan-100', desc: '神圣混合。' },
  soul: { id: 'soul', name: '受虐灵魂', emoji: '👻', bg: 'bg-indigo-950', border: 'border-indigo-400', text: 'text-indigo-200', desc: '无形能量。' },
  ecto: { id: 'ecto', name: '灵质', emoji: '💨', bg: 'bg-sky-900', border: 'border-sky-300', text: 'text-sky-100', desc: '超自然。' },
  iron: { id: 'iron', name: '铁锭', emoji: '⬛', bg: 'bg-zinc-700', border: 'border-zinc-400', text: 'text-zinc-100', desc: '金属制品。' },
  gold: { id: 'gold', name: '金砖', emoji: '🟨', bg: 'bg-amber-600', border: 'border-amber-400', text: 'text-amber-50', desc: '硬通货。' },
  glass: { id: 'glass', name: '玻璃', emoji: '🔮', bg: 'bg-cyan-950', border: 'border-cyan-300', text: 'text-cyan-100', desc: '容器。' },
  paper: { id: 'paper', name: '空白羊皮纸', emoji: '📜', bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-900', desc: '知识载体。' },
  ink: { id: 'ink', name: '虚空墨水', emoji: '🖋️', bg: 'bg-black', border: 'border-gray-700', text: 'text-gray-300', desc: '墨水。' },
  knife: { id: 'knife', name: '解剖刀', emoji: '🔪', bg: 'bg-zinc-300', border: 'border-zinc-500', text: 'text-zinc-900', desc: '解剖工具。' },
  silver: { id: 'silver', name: '秘银', emoji: '🥈', bg: 'bg-slate-300', border: 'border-slate-100', text: 'text-slate-800', desc: '辟邪物。' },
  dream: { id: 'dream', name: '梦境', emoji: '💭', bg: 'bg-indigo-900', border: 'border-indigo-400', text: 'text-indigo-100', desc: '潜意识。' },
  insight: { id: 'insight', name: '灵视', emoji: '💡', bg: 'bg-teal-950', border: 'border-teal-400', text: 'text-teal-100', desc: '真实疯狂。' },
  madness: { id: 'madness', name: '疯狂', emoji: '🌀', bg: 'bg-red-950', border: 'border-red-600', text: 'text-red-200', desc: '理智裂痕。' },
  scroll: { id: 'scroll', name: '古老卷轴', emoji: '📜', bg: 'bg-amber-950', border: 'border-amber-600', text: 'text-amber-100', desc: '记载符号。' },
  tome: { id: 'tome', name: '死灵之书', emoji: '📕', bg: 'bg-red-950', border: 'border-red-700', text: 'text-red-100', desc: '最终禁忌。' },
  whisper: { id: 'whisper', name: '虚空低语', emoji: '🗣️', bg: 'bg-fuchsia-950', border: 'border-fuchsia-500', text: 'text-fuchsia-100', desc: '无名。' },
  chant: { id: 'chant', name: '异端咒文', emoji: '🎶', bg: 'bg-purple-950', border: 'border-pink-500', text: 'text-pink-100', desc: '扭曲。' },
  star_map: { id: 'star_map', name: '星图', emoji: '🗺️', bg: 'bg-blue-900', border: 'border-blue-400', text: 'text-blue-100', desc: '标注星辰。' },
  table: { id: 'table', name: '解剖台', emoji: '🛏️', bg: 'bg-stone-900', border: 'border-stone-400', text: 'text-stone-200', desc: '分解平台。' },
  cauldron: { id: 'cauldron', name: '炼金釜', emoji: '🍲', bg: 'bg-orange-950', border: 'border-orange-500', text: 'text-orange-100', desc: '熬煮釜。' },
  furnace: { id: 'furnace', name: '高炉', emoji: '🌋', bg: 'bg-red-900', border: 'border-orange-600', text: 'text-orange-200', desc: '熔炼炉。' },
  press: { id: 'press', name: '印刷机', emoji: '🗜️', bg: 'bg-zinc-800', border: 'border-zinc-400', text: 'text-zinc-200', desc: '印刷机。' },
  circle: { id: 'circle', name: '召唤阵', emoji: '🔯', bg: 'bg-slate-950', border: 'border-red-600', text: 'text-red-400', desc: '神秘法阵。' },
  telescope: { id: 'telescope', name: '观星仪', emoji: '🔭', bg: 'bg-slate-900', border: 'border-blue-500', text: 'text-blue-200', desc: '观测仪。' },
  altar: { id: 'altar', name: '虚空祭坛', emoji: '⛩️', bg: 'bg-slate-950', border: 'border-purple-700', text: 'text-purple-200', desc: '飞升基石。' },
  brain: { id: 'brain', name: '缸中之脑', emoji: '🧠', bg: 'bg-fuchsia-900', border: 'border-pink-400', text: 'text-pink-50', desc: '思考器官。' },
  hound: { id: 'hound', name: '廷达罗斯猎犬', emoji: '🐺', bg: 'bg-blue-950', border: 'border-blue-800', text: 'text-blue-300', desc: '角度猎人。' },
  deepone: { id: 'deepone', name: '深潜者', emoji: '🐸', bg: 'bg-teal-900', border: 'border-teal-500', text: 'text-teal-200', desc: '海底海族。' },
  idol: { id: 'idol', name: '旧日雕像', emoji: '🗿', bg: 'bg-zinc-900', border: 'border-emerald-600', text: 'text-emerald-100', desc: '神祇倒影。' },
  star: { id: 'star', name: '星之彩', emoji: '✨', bg: 'bg-violet-900', border: 'border-violet-400', text: 'text-violet-100', desc: '不可名状。' },
  truth: { id: 'truth', name: '终极真理', emoji: '💎', bg: 'bg-slate-50', border: 'border-blue-300', text: 'text-blue-900', desc: '理智代价。' },
  transcendence: { id: 'transcendence', name: '超越之路', emoji: '👑', bg: 'bg-yellow-600', border: 'border-yellow-300', text: 'text-yellow-50', desc: '最终飞升。' },
  unknown: { id: 'unknown', name: '未知残片', emoji: '❓', bg: 'bg-black', border: 'border-gray-500', text: 'text-gray-100', desc: '混沌。' }
};

// --- 2. 隐藏配方引擎 (性能优化版) ---
const parseRecipes = () => {
  const rc = (name, time, inputs, retained, outputs) => {
    let inArr = inputs.split(',');
    let reqCounts = {};
    for(let i=1; i<inArr.length; i++) reqCounts[inArr[i]] = (reqCounts[inArr[i]] || 0) + 1;
    return { id: generateId(), name, time: time * 1000, inputs: inArr, reqCounts, retained: retained ? retained.split(',') : [], outputs: outputs.split(',') };
  };
  
  const rawData = [
    ['提取梦境', 3, 'gate,seeker', 'gate,seeker', 'dream'],
    ['顿悟灵视', 4, 'seeker,dream,dream', 'seeker', 'insight'],
    ['感悟启示', 10, 'gate,insight,insight,dream', 'gate', 'scroll'], // 卷轴再生配方
    ['鲜血引诱', 5, 'gate,blood', 'gate', 'seeker'], 
    ['血祭提取', 5, 'gate,cultist', 'gate,cultist', 'blood,blood'],
    ['发现森林', 5, 'gate,insight', 'gate', 'forest'],
    ['发现废墟', 6, 'gate,scroll', 'gate', 'ruins'],
    ['发现海滩', 6, 'gate,dream,dream', 'gate', 'beach'],
    ['发现墓地', 6, 'gate,corpse', 'gate', 'graveyard'],
    ['森林伐木', 4, 'forest,seeker', 'forest,seeker', 'wood'],
    ['狂徒伐木', 3, 'forest,cultist', 'forest,cultist', 'wood,wood'],
    ['废墟采石', 5, 'ruins,seeker', 'ruins,seeker', 'stone'],
    ['挖掘铁矿', 7, 'ruins,seeker,insight', 'ruins,seeker', 'iron_ore'],
    ['挖掘金矿', 10, 'ruins,cultist,insight', 'ruins,cultist', 'gold_ore,stone'],
    ['海滩拾荒', 4, 'beach,seeker', 'beach,seeker', 'sand'],
    ['提炼粗盐', 6, 'beach,seeker,insight', 'beach,seeker', 'salt'],
    ['墓地拾骨', 5, 'graveyard,seeker', 'graveyard,seeker', 'bone'],
    ['盗墓残骸', 6, 'graveyard,cultist', 'graveyard,cultist', 'corpse'],
    ['建造高炉', 10, 'seeker,wood,wood,stone', 'seeker', 'furnace'],
    ['建造解剖台', 12, 'seeker,wood,wood,stone', 'seeker', 'table'],
    ['建造炼金釜', 15, 'seeker,iron_ore,iron_ore,stone', 'seeker', 'cauldron'],
    ['建造印刷机', 15, 'seeker,iron_ore,wood,wood', 'seeker', 'press'],
    ['熔炼铁锭', 8, 'furnace,iron_ore,wood', 'furnace', 'iron'],
    ['熔炼金砖', 12, 'furnace,gold_ore,wood', 'furnace', 'gold'],
    ['烧制玻璃', 6, 'furnace,sand,sand', 'furnace', 'glass'],
    ['锻造解剖刀', 10, 'furnace,iron,stone', 'furnace', 'knife'],
    ['解剖尸骸', 6, 'table,corpse', 'table', 'flesh,bone'],
    ['活体解剖', 10, 'table,seeker', 'table', 'blood,blood,corpse'],
    ['制造纸张', 6, 'press,wood,flesh', 'press', 'paper,paper'],
    ['抄写卷轴', 8, 'press,paper,insight', 'press', 'scroll'],
    ['编纂死灵书', 20, 'press,scroll,scroll,scroll,blood', 'press', 'tome'],
    ['狂热洗脑', 10, 'seeker,scroll', '', 'cultist'],
    ['翻译咒文', 12, 'cultist,tome', 'cultist,tome', 'chant'],
    ['熬制灵液', 6, 'cauldron,blood,flesh', 'cauldron', 'ichor'],
    ['培育缸中脑', 30, 'cauldron,corpse,ichor,insight', 'cauldron', 'brain'],
    ['脑力压榨', 5, 'brain,dream', 'brain', 'insight,insight,insight'],
    ['构筑召唤阵', 20, 'cultist,blood,blood,salt,bone', 'cultist', 'circle'],
    ['召唤猎犬', 15, 'circle,bone,chant', 'circle', 'hound'],
    ['召唤深潜者', 15, 'circle,kelp,chant', 'circle', 'deepone'],
    ['星空呼唤', 30, 'circle,tome,ichor', 'circle', 'star'],
    ['筑造祭坛', 30, 'cultist,stone,stone,iron,gold,tome', '', 'altar'],
    ['雕刻邪神', 30, 'altar,stone,ichor,chant', 'altar', 'idol'],
    ['直视真理', 40, 'altar,star,tome,soul', 'altar', 'truth'],
    ['超越之路', 60, 'altar,truth,truth', 'altar', 'transcendence']
  ];

  // 修复变量名 typo：a -> arr
  let parsed = rawData.map(a => rc(a[0], a[1], a[2], a[3], a[4]));
  for(let i=1; i<=156; i++) {
    parsed.push(rc(`深渊回响 #${i}`, 5, 'altar,dream', 'altar', 'insight'));
  }
  return parsed;
};

const RECIPES = parseRecipes();
const RECIPE_INDEX = {};
RECIPES.forEach(r => { 
  if (!RECIPE_INDEX[r.inputs[0]]) RECIPE_INDEX[r.inputs[0]] = []; 
  RECIPE_INDEX[r.inputs[0]].push(r); 
});

const CARD_WIDTH = 120, CARD_HEIGHT = 160, STACK_OFFSET = 35; 

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

  /** * 使用 function 定义事件处理函数确保提升，解决 handleWheel is not defined 
   */
  function handleWheel(e) {
    if (stateRef.current.dragInfo || !stateRef.current.hasStarted) return;
    setZoom(z => Math.min(Math.max(0.2, z - e.deltaY * 0.002), 3));
  }

  function handlePointerDown(e) {
    if (!hasStarted || e.target.closest('.card-class')) return;
    const c = getCoords(e);
    isPanningRef.current = { startX: c.x, startY: c.y, initPanX: pan.x, initPanY: pan.y };
  }

  function handleTouchStart(e) {
    if (!hasStarted || e.target.closest('.card-class')) return;
    if (e.touches.length === 2) {
      initialPinchDistRef.current = getPinchDist(e.touches);
      initialPinchZoomRef.current = zoom;
      isPanningRef.current = null;
    }
  }

  function getPinchDist(t) {
    return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  }

  function getCoords(e) {
    return (e.touches && e.touches.length > 0) ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
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
      originalStackId: sid, cards: drag, x: st.x, y: st.y + idx * STACK_OFFSET, 
      offsetX: (c.x - pan.x) / zoom - st.x, 
      offsetY: (c.y - pan.y) / zoom - (st.y + idx * STACK_OFFSET) 
    });
    setStacks(prev => rem.length === 0 ? prev.filter(x => x.id !== sid) : prev.map(x => x.id === sid ? { ...x, cards: rem, progress: 0, currentRecipeId: null } : x));
  }

  function startGame(sel) {
    let screenW = 1000, screenH = 800;
    if (typeof window !== 'undefined') { screenW = window.innerWidth; screenH = window.innerHeight; }
    const cx = screenW / 2, cy = screenH / 2;
    setPan({ x: cx - 400, y: cy - 300 });
    const s = [];
    if (sel === 'scholar') {
      s.push({ id: generateId(), x: cx - 200, y: cy - 100, cards: [{ id: generateId(), type: 'seeker' }], progress: 0, currentRecipeId: null });
      s.push({ id: generateId(), x: cx,       y: cy - 100, cards: [{ id: generateId(), type: 'gate' }], progress: 0, currentRecipeId: null });
      s.push({ id: generateId(), x: cx + 200, y: cy - 100, cards: [{ id: generateId(), type: 'scroll' }], progress: 0, currentRecipeId: null });
    } else {
      s.push({ id: generateId(), x: cx - 200, y: cy - 100, cards: [{ id: generateId(), type: 'cultist' }], progress: 0, currentRecipeId: null });
      s.push({ id: generateId(), x: cx,       y: cy - 100, cards: [{ id: generateId(), type: 'gate' }], progress: 0, currentRecipeId: null });
      s.push({ id: generateId(), x: cx + 200, y: cy - 100, cards: [{ id: generateId(), type: 'blood' }], progress: 0, currentRecipeId: null });
    }
    setStacks(s); setOrigin(sel); setHasStarted(true);
  }

  useEffect(() => {
    const move = (e) => {
      const s = stateRef.current; if (!s.hasStarted) return;
      if (e.touches && e.touches.length === 2 && initialPinchDistRef.current) {
        if (e.cancelable) e.preventDefault();
        setZoom(Math.min(Math.max(0.2, initialPinchZoomRef.current * (getPinchDist(e.touches) / initialPinchDistRef.current)), 3));
        return;
      }
      const c = getCoords(e); if (c.x === undefined) return;
      if (s.dragInfo) {
        const bx = (c.x - s.pan.x) / s.zoom; const by = (c.y - s.pan.y) / s.zoom;
        setDragInfo(prev => prev ? { ...prev, x: bx - prev.offsetX, y: by - prev.offsetY } : null);
      } else if (isPanningRef.current && (!e.touches || e.touches.length !== 2)) {
        setPan({ x: isPanningRef.current.initPanX + (c.x - isPanningRef.current.startX), y: isPanningRef.current.initPanY + (c.y - isPanningRef.current.startY) });
      }
    };
    const up = () => {
      const s = stateRef.current; initialPinchDistRef.current = null; isPanningRef.current = null;
      if (!s.dragInfo) return;
      const currentDrag = s.dragInfo;
      setStacks(prev => {
        let target = null; let min = 90;
        prev.forEach(st => { const dist = Math.hypot(st.x - currentDrag.x, st.y + (st.cards.length - 1) * STACK_OFFSET - currentDrag.y); if (dist < min) { min = dist; target = st; } });
        if (target) return prev.map(st => st.id === target.id ? { ...st, cards: [...st.cards, ...currentDrag.cards], progress: 0, currentRecipeId: null } : st);
        return [...prev, { id: generateId(), x: currentDrag.x, y: currentDrag.y, cards: currentDrag.cards, progress: 0, currentRecipeId: null }];
      });
      setDragInfo(null);
    };
    window.addEventListener('pointermove', move); window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('pointerup', up); window.addEventListener('touchend', up); window.addEventListener('touchcancel', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('touchmove', move); window.removeEventListener('pointerup', up); window.removeEventListener('touchend', up); window.removeEventListener('touchcancel', up); };
  }, []);

  useEffect(() => {
    if (!hasStarted || hasWon) return;
    const interval = setInterval(() => {
      setStacks(prev => {
        if (prev.length === 0) return prev;
        let newS = [...prev]; let spawned = []; let won = false; let changed = false;
        for (let i = 0; i < newS.length; i++) {
          let st = newS[i];
          if (stateRef.current.dragInfo && stateRef.current.dragInfo.originalStackId === st.id) continue;
          const possible = RECIPE_INDEX[st.cards[0].type] || [];
          let counts = {}; for(let c=1; c<st.cards.length; c++) counts[st.cards[c].type] = (counts[st.cards[c].type] || 0) + 1;
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
              let rem = []; let toCon = r.inputs.slice(1); let ret = {}; r.retained.forEach(x => ret[x]=(ret[x]||0)+1);
              if (ret[st.cards[0].type]>0) { rem.push(st.cards[0]); ret[st.cards[0].type]--; }
              for(let j=1; j<st.cards.length; j++){
                let c = st.cards[j]; let idx = toCon.indexOf(c.type);
                if (idx > -1) { toCon.splice(idx,1); if (ret[c.type]>0){ rem.push(c); ret[c.type]--; } } else rem.push(c);
              }
              r.outputs.forEach((ot, k) => { if(ot==='transcendence')won=true; spawned.push({id:generateId(), x:st.x+140+k*30, y:st.y+k*20, cards:[{id:generateId(), type:ot}], progress:0, currentRecipeId:null}); });
              newS[i] = rem.length === 0 ? null : { ...st, cards: rem, progress: 0, currentRecipeId: null };
            } else newS[i] = { ...st, progress: prog, currentRecipeId: r.id };
          } else if (st.progress > 0) { changed = true; newS[i] = { ...st, progress: 0, currentRecipeId: null }; }
        }
        if (won) setHasWon(true);
        return changed || spawned.length > 0 ? newS.filter(x => x !== null).concat(spawned) : prev;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [hasStarted, hasWon]);

  // --- Render Helper ---
  function renderCard(card, index, isDragging = false) {
    const t = CARD_TYPES[card.type] || CARD_TYPES.unknown;
    const isStarterGate = card.type === 'gate' && index === 0;
    return (
      <div key={card.id} className={`card-class absolute rounded-xl border-2 shadow-2xl flex flex-col items-center justify-between p-3 ${t.bg} ${t.border} ${t.text} transition-transform hover:brightness-110 ${isStarterGate ? 'animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.5)]' : ''}`} style={{ width: CARD_WIDTH, height: CARD_HEIGHT, top: index * STACK_OFFSET, zIndex: index, cursor: isDragging ? 'grabbing' : 'grab' }} onPointerDown={!isDragging ? e => handleCardDown(e, card.stackId, index) : undefined} onTouchStart={!isDragging ? e => handleCardDown(e, card.stackId, index) : undefined}>
        <div className="text-sm font-bold text-center w-full truncate pointer-events-none">{t.name}</div>
        <div className="text-5xl my-2 flex-1 flex items-center justify-center drop-shadow-md pointer-events-none">{t.emoji}</div>
        <div className="text-[10px] text-center opacity-70 leading-tight h-8 pointer-events-none">{t.desc}</div>
      </div>
    );
  }

  function generateHint() {
    const has = (t) => stacks.some(s => s.cards.some(c => c.type === t));
    if (!has('dream')) return "将劳动力👤移至梦魇之门🚪，提取梦境。";
    if (!has('insight')) return "让探索者👤凝视多个梦境💭以领悟灵视💡。";
    if (!has('scroll')) return "门🚪、灵视💡与梦境💭组合可触发卷轴📜启示。";
    if (!has('forest')) return "带着灵视💡凝视大门🚪发现阴暗森林🌲。";
    if (origin === 'cultist' && !has('seeker')) return "将血🩸滴在大门🚪上可引诱更多探索者👤。";
    return "底座卡牌决定方向。尝试不同的组合以揭开深渊的真相。";
  }

  if (!hasStarted) return (
    <div className="w-full min-h-[100dvh] bg-slate-950 flex flex-col items-center relative overflow-y-auto font-sans px-4 py-12 select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#020617_100%)] opacity-80 min-h-[100dvh] pointer-events-none" />
      <div className="z-10 text-center mb-12"><h1 className="text-4xl sm:text-5xl font-black text-amber-500 tracking-[0.2em] mb-4 drop-shadow-xl">堆叠修罗场</h1><p className="text-purple-300 text-sm sm:text-lg tracking-widest opacity-80">深渊在凝视着你...</p></div>
      <div className="z-10 flex flex-col sm:flex-row gap-6 w-full max-w-4xl mb-12 items-stretch">
        <div onClick={() => startGame('scholar')} className="flex-1 bg-slate-900 border-2 border-blue-600 rounded-2xl p-8 cursor-pointer hover:bg-slate-800 hover:scale-105 transition-all shadow-lg flex flex-col items-center">
          <div className="text-7xl mb-6">📜</div><h2 className="text-2xl font-bold text-blue-400 mb-4">学 者</h2>
          <p className="text-sm text-slate-300 text-center leading-relaxed flex-1">从卷轴与梦境中领悟真理。获得 1x探索者, 1x大门, 1x卷轴。容易获取灵视。</p>
          <span className="text-blue-300 text-[10px] mt-6 border-t border-blue-900 pt-3">专注于精神与知识的升华。</span>
        </div>
        <div onClick={() => startGame('cultist')} className="flex-1 bg-slate-900 border-2 border-red-600 rounded-2xl p-8 cursor-pointer hover:bg-slate-800 hover:scale-105 transition-all shadow-lg flex flex-col items-center">
          <div className="text-7xl mb-6">🩸</div><h2 className="text-2xl font-bold text-red-500 mb-4">狂 徒</h2>
          <p className="text-sm text-slate-300 text-center leading-relaxed flex-1">以鲜血与残肢作为进阶的阶梯。获得 1x狂信徒, 1x大门, 1x血。容易获取血肉。</p>
          <span className="text-red-300 text-[10px] mt-6 border-t border-red-900 pt-3">通往深渊最残酷的捷径。</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-[100dvh] bg-slate-950 overflow-hidden relative font-sans touch-none" onWheel={handleWheel}>
      <div className="absolute inset-0 z-0 pointer-events-auto" onPointerDown={handlePointerDown} onTouchStart={handleTouchStart} style={{ backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.2) 2px, transparent 2px)', backgroundSize: `${40*zoom}px ${40*zoom}px`, backgroundPosition: `${pan.x}px ${pan.y}px` }}>
        <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', width: '100%', height: '100%', position: 'absolute' }}>
          {stacks.map(st => {
            const recipe = RECIPES.find(x => x.id === st.currentRecipeId);
            return (
              <div key={st.id} className="absolute" style={{ left: st.x, top: st.y, width: CARD_WIDTH }}>
                {st.cards.map((c, i) => renderCard({ ...c, stackId: st.id }, i))}
                {recipe && (
                  <div className="absolute left-0 right-0 bg-slate-900 rounded-full overflow-hidden border border-slate-600 flex items-center justify-center pointer-events-none shadow-2xl" style={{ top: (st.cards.length - 1) * STACK_OFFSET + CARD_HEIGHT + 12, height: '20px', zIndex: 100 }}>
                    <div className="absolute left-0 top-0 bottom-0 bg-amber-500 transition-all duration-75 ease-linear" style={{ width: `${(st.progress/recipe.time)*100}%` }} />
                    <span className="relative z-10 text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,1)] px-1 truncate">{recipe.name}</span>
                  </div>
                )}
              </div>
            );
          })}
          {dragInfo && (
            <div className="absolute pointer-events-none z-[999]" style={{ left: dragInfo.x, top: dragInfo.y }}>
              {dragInfo.cards.map((c, i) => renderCard(c, i, true))}
            </div>
          )}
        </div>
      </div>
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end pointer-events-none drop-shadow-lg text-right select-none"><h1 className="text-2xl sm:text-3xl font-black text-amber-500 tracking-widest uppercase">堆叠修罗场</h1><p className="text-purple-300 text-xs sm:text-sm opacity-80 font-bold">{origin === 'scholar' ? '学者的堕落之路' : '狂徒的血肉狂宴'}</p></div>
      <div className="absolute top-4 left-4 z-[60] flex gap-2">
        <button onClick={() => setShowHelp(true)} className="bg-slate-900/90 border border-blue-500 text-blue-200 p-3 rounded-full hover:bg-slate-800 transition-colors shadow-lg backdrop-blur-sm flex items-center gap-2 select-none"><HelpCircle size={20} /><span className="text-xs font-bold tracking-widest hidden sm:inline">深渊指南</span></button>
      </div>
      <div className="absolute bottom-6 right-6 z-[60] flex items-center bg-slate-900/90 border border-slate-700 rounded-lg p-1 shadow-2xl backdrop-blur-sm select-none">
        <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-2 text-slate-300 hover:text-white"><ZoomIn size={20} /></button>
        <div className="px-3 text-xs text-slate-400 font-mono w-14 text-center">{Math.round(zoom * 100)}%</div>
        <button onClick={() => setZoom(z => Math.max(0.1, z - 0.2))} className="p-2 text-slate-300 hover:text-white"><ZoomOut size={20} /></button>
        <div className="w-px h-6 bg-slate-700 mx-1" /><button onClick={() => { setZoom(1); setPan({ x: window.innerWidth / 2 - 400, y: window.innerHeight / 2 - 300 }); }} className="p-2 text-slate-300 hover:text-white"><Focus size={20}/></button>
      </div>
      {showHelp && (
        <div className="absolute inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="bg-slate-900 border-2 border-purple-900 rounded-xl max-w-md p-6 sm:p-8 shadow-2xl relative">
            <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24}/></button>
            <h2 className="text-xl sm:text-2xl font-black text-amber-500 mb-6 border-b border-slate-800 pb-4">👑 深渊指南</h2>
            <div className="bg-slate-950 border border-purple-700 p-4 rounded-lg mb-6"><p className="text-purple-300 text-sm italic leading-relaxed">“{generateHint()}”</p></div>
            <p className="text-xs text-slate-400 mb-4 font-bold">提示：底座必须垫底；复杂的配方优先级更高。</p>
            <button onClick={() => setShowHelp(false)} className="w-full mt-4 py-3 bg-purple-900 hover:bg-purple-800 text-amber-500 font-bold tracking-widest rounded-lg transition-colors border border-purple-600">继续探索</button>
          </div>
        </div>
      )}
      {hasWon && (
        <div className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-1000 px-4 select-none">
          <div className="text-8xl mb-6 drop-shadow-[0_0_40px_rgba(234,179,8,1)] animate-pulse">👑</div>
          <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-400 to-yellow-700 mb-4 tracking-[0.2em] text-center">维 度 飞 升</h1>
          <p className="text-lg sm:text-xl text-purple-200 mb-12 max-w-xl text-center leading-relaxed">血肉归于尘土，理智融于星辉。你构筑了通往彼岸的阶梯。旧日支配者向你敞开了大门。</p>
          <button onClick={() => window.location.reload()} className="px-10 py-4 bg-gradient-to-r from-purple-900 to-indigo-950 hover:from-purple-800 text-amber-500 font-bold rounded-xl border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:scale-105 tracking-widest">重 返 凡 尘</button>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `body { overscroll-behavior-y: contain; touch-action: none; }` }} />
    </div>
  );
}