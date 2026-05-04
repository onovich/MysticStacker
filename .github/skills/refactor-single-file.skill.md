---
name: refactor-single-file
description: 处理单文件原型的分离重构任务。在严格不改动UI、UX的情况下，完成像素级还原，并执行逻辑、数据、表现分离架构设计。
---

# Refactor Single-File Prototype Skill

此 skill 专注于将早期庞大的单文件原型（例如单体 `App.jsx`）重构为符合现代工程标准、高可维护性的分层架构。其核心理念是“**先像素级还原，再做分层解耦**”，确保体验无损的基础上完成组件与数据的分离。

## 适用场景
- 复杂的前端单文件原型项目需要结构化重构。
- 需要梳理出数据配置(Data)、逻辑控制器(Logic/Hooks)以及纯UI展示(View)。
- 有严格的 UI 和全局事件交互（如复杂的触摸、拖拽、手势）无损继承要求。

## 目标与约束
1. **严格像素级还原**：不可擅自改变原项目的 UI 布局、CSS 类名组合、交互手势（Pan/Zoom）、渲染自适应表现。避免自行添加非必要的动画库或替换静态资源。
2. **逻辑-表现-数据分离 (MVC/架构解耦)**：
   - **Data (数据层)**：将散落在文件中的静态配置字典、配方、工厂函数、默认初始状态剥离。
   - **Logic (逻辑层)**：将核心游戏引擎/业务循环（如心跳 interval、递归遍历）、复杂的状态钩子与引用同步器（如 `stateRef` 避刷闭包）、输入手势监听器抽离为自定义 Hooks 或纯 JS utils。
   - **View (表现层)**：将庞大的渲染 DOM 拆解成页面 (Screens)、核心组件 (Components)，保持展示层尽可能状态无关。
3. **保持原文件比对**：默认不要删除/覆盖 `origin` 源文件，保证始终能够比对重构前后的逻辑一致性。

## 处理步骤

1. **工程基建初始化**：
   引入标准的脚手架工具（例如 Vite + React + TailwindCSS）。确保依赖版本（如 Vite / Node engine）对齐当前开发环境。
   *命令参考：* `npm init -y`, `npm i react react-dom ...`, `npm install -D vite @vitejs/plugin-react tailwindcss ...`，随后补充 `vite.config.js` 和 `tailwind.config.js`。

2. **分析与提取数据源 (Data)**：
   将硬编码在组件外部的变量（`CARD_TYPES`、`RECIPES` 组装、初始变量工厂等）抽取到 `src/data/` 目录下。

3. **抽取无状态核心引擎 (Logic/Engine)**：
   提取纯函数、ID 生成器、常量尺寸等工具至 `src/logic/engine/utils.js`。

4. **抽象有状态逻辑钩子 (Logic/Hooks)**：
   针对挂载在 `useEffect` 和 Window 下的全局时间监听器、以及负责心跳轮询的核心 interval（如 50ms tick 等），根据职责封装到对应的 `src/logic/hooks/xxxx.js` 内。**关键：遇到因为高频更新导致的闭包落后问题时，必须原样保留或抽象其 `stateRef` 同步引用方案**。

5. **展示层封装 (View)**：
   将页面级切分，如 StartScreen（主菜单）、GameBoard、EndScreen，以及被遍历渲染的可复用元素（如 Card 组件、弹窗 Modal）放入 `src/view/components/`。将包含底层坐标依赖或鼠标跟随样式的纯粹样式保留，杜绝二次艺术加工。

6. **核心组装并验证**：
   在新的入口 `src/App.jsx` 中组装 View 和 hooks，确保仅起到“粘合剂”作用。然后编译/本地跑通（`vite build / vite dev`），并提醒开发者进行本地检验。

## 典型输入
- 源单文件路径（如 `origin/App.jsx`）。
- 设计/需求说明文档。
- 用户指定的构建技术栈与环境（如 Node 18, React, Vite, Tailwind）。

## 输出结果
- 已构建完毕的最佳实践分发目录结构（Data / Logic / View）。
- 组装后的干净、简练的主项目入口。
- 确保应用依然能按原始状态跑通。