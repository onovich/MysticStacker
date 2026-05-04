# 堆叠修罗场 / Mystic Stacker

一款基于 React 构建的克苏鲁风卡牌堆叠自动化模拟游戏原型。

## 当前内容
- `origin/App.jsx`：当前游戏原型主入口
- `origin/design.md`：完整设计交接文档
- `.github/copilot-instructions.md`：项目级 GitHub Copilot 协作指令

## 核心设计
- 底座决定配方搜索范围
- 多配方命中时优先执行更复杂的配方
- 堆叠变化导致配方变化时，进度立即清零
- 使用 `stateRef` 解决高频交互下的闭包陈旧状态问题
- 使用 `RECIPE_INDEX` 保证 50ms Tick 下的配方匹配性能

## 当前状态
- 这是一个单文件 React 原型，重点在玩法循环与交互稳定性
- 美术资源以 Emoji 为主，避免外部资源失败造成白屏
- 适合后续继续演化为正式前端项目结构

## 后续建议
- 补齐正式运行脚手架，例如 Vite + React
- 将数据定义与 UI 渲染逐步拆分
- 为关键合成逻辑补充自动化测试