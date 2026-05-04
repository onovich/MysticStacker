// src/data/recipeRegistry.js
import { generateId } from '../logic/engine/utils.js';

const parseRecipes = () => {
  const rc = (name, time, inputs, retained, outputs) => {
    let inArr = inputs.split(',');
    let reqCounts = {};
    for(let i=1; i<inArr.length; i++) reqCounts[inArr[i]] = (reqCounts[inArr[i]] || 0) + 1;
    return { 
        id: generateId(), 
        name, 
        time: time * 1000, 
        inputs: inArr, 
        reqCounts, 
        retained: retained ? retained.split(',') : [], 
        outputs: outputs.split(',') 
    };
  };
  
  const rawData = [
    ['提取梦境', 3, 'gate,seeker', 'gate,seeker', 'dream'],
    ['顿悟灵视', 4, 'seeker,dream,dream', 'seeker', 'insight'],
    ['感悟启示', 10, 'gate,insight,insight,dream', 'gate', 'scroll'],
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

  let parsed = rawData.map(arr => rc(arr[0], arr[1], arr[2], arr[3], arr[4]));
  for(let i=1; i<=156; i++) {
    parsed.push(rc(`深渊回响 #${i}`, 5, 'altar,dream', 'altar', 'insight'));
  }
  return parsed;
};

export const RECIPES = parseRecipes();

export const RECIPE_INDEX = {};
RECIPES.forEach(r => { 
  if (!RECIPE_INDEX[r.inputs[0]]) RECIPE_INDEX[r.inputs[0]] = []; 
  RECIPE_INDEX[r.inputs[0]].push(r); 
});