# 非 Unity 项目安装 Agents / Skills / Tool 指南

## 适用范围

本指南适用于以下类型的项目：

- React / Vue / Next.js / Vite 等前端项目
- Node.js / Python / Go / Java 等通用应用项目
- 工具脚本仓库、服务端仓库、自动化仓库
- 任何不以 Unity 资源、Unity C# 运行时、Prefab、Animator、ScriptableObject 为核心交付物的项目

本指南不适用于直接把整套 Unity 工作流原样搬进目标仓库。

## 安装目标

在非 Unity 项目中，目标不是完整复制源仓库全部能力，而是安装一套当前技术栈可用、不会误路由到 Unity / C# 工作流的最小可用集合。

安装后，目标仓库应具备以下目录：

- `.github/agents`
- `.github/skills`
- `.github/tool`
- `.github/gists`

## 安装原则

### 1. 源仓库与目标仓库分离

- 建议把 Agents 源仓库存放在目标项目外部，例如目标项目的同级目录。
- 不要把源仓库自身的 `.git` 元数据复制到目标项目内。
- 不要把整个源仓库根目录直接作为目标项目的 `.github/agents`。

### 2. 目标目录必须使用标准落点

目标项目内应使用以下标准目录：

- `.github/agents`
- `.github/skills`
- `.github/tool`
- `.github/gists`

不要依赖大小写不同但名称相近的目录，例如：

- `.github/Agents`
- `.github/agents`

在 macOS 默认大小写不敏感文件系统上，这两者容易被混为同一个目录。

### 3. 只安装当前技术栈可用的对象

非 Unity 项目默认应先排除以下对象：

- 所有 `program.*` agent
- 所有 `unity.*` agent
- 所有 Unity 资源导向的 skill
- 所有会把任务导向 Unity C# / Prefab / Animator / ScriptableObject 的分支

如果后续项目真的迁移到 Unity，再单独补装它们。

## 推荐安装集合

### Agents

对非 Unity 项目，推荐优先安装以下 agent：

- `bootstrap.agent.md`
- `main.agent.md`
- `indie.agent.md`
- `git.agent.md`
- `performance.agent.md`
- `style-review.agent.md`
- `turnover.agent.md`

如果项目仍然需要设计侧支持，可以额外安装：

- `gamedesign.core-experience.agent.md`
- `gamedesign.gameplay.agent.md`
- `gamedesign.system.agent.md`
- `gamedesign.balance.agent.md`

### Skills

对非 Unity 项目，推荐保留以下 skill：

- `bootstrap-agent.skill.md`
- `performance.skill.md`
- `style-review.skill.md`
- `gamedesign/` 下当前项目真正会用到的设计类 skill

### Tool

工具目录通常可以整体保留：

- `GitDeps.cmd`
- `GitDeps.sh`
- `mssh.cmd`
- `mssh.sh`

如果目标项目只在 macOS / Linux 使用，优先使用 `.sh` 脚本；若只在 Windows 使用，优先使用 `.cmd`。

### Gists

建议保留以下通用模板：

- `Milestone.gist.md`
- `project.config.json.gist.md`
- `turnover-log.gist.md`
- `.editorconfig.gist.md`

其他模板是否保留，取决于是否真的会被当前工作流引用。

## 必须做的裁剪

仅复制文件还不够。只要入口 agent 仍然引用未安装对象，运行时就会继续把任务路由到不存在或不适合当前项目的方向。

### 1. 收束 main.agent

在非 Unity 项目中，`main.agent` 至少需要做以下处理：

- 删除对 `program.*` agent 的声明与路由
- 删除对 `unity.*` agent 的声明与路由
- 删除对不存在 skill 的引用，例如 `bootstrap-skill.skill`
- 保留当前项目真实可用的 Git、设计、性能、风格审查、bootstrap、turnover 路线

### 2. 收束 indie.agent

在非 Unity 项目中，`indie.agent` 至少需要做以下处理：

- 删除 Unity Editor、Unity UI、Unity Art、Unity Create Project 相关 skill 引用
- 删除 `program-*` 系列 skill 引用
- 只保留当前项目真的装了的通用 skill
- 把 shell 偏好改成与当前环境一致，例如 macOS 下优先 `zsh`

### 3. 收束 gamedesign.* agent

如果你保留了 `gamedesign.gameplay.agent`、`gamedesign.system.agent`、`gamedesign.balance.agent`，还要继续检查它们是否包含 Unity 落地分支。

常见需要删除的内容：

- `unity-scriptableobject.skill` 引用
- “当需要 Unity 资源落地时……” 这类分支
- 要求传入 Unity 类型名、GUID、资源路径的描述

## 推荐安装步骤

### 1. 准备源仓库

- 将 Agents 源仓库存放在目标项目外部
- 确保源仓库自身可更新
- 不把源仓库根目录直接提交到目标仓库

### 2. 在目标项目创建标准目录

- `.github/agents`
- `.github/skills`
- `.github/tool`
- `.github/gists`

### 3. 复制最小可用集合

- 复制选中的 agent 到 `.github/agents`
- 复制通用 skill 到 `.github/skills`
- 复制工具脚本到 `.github/tool`
- 复制模板文档到 `.github/gists`

### 4. 清理不该进入目标仓库的内容

至少检查并清理：

- 嵌套 `.git`
- `.DS_Store`
- 源仓库自己的 README、LICENSE、VERSION 等与目标项目运行无关的根级文件

### 5. 修正文档引用与路由

复制完成后，继续检查：

- `main.agent` 是否还引用 `program.*` / `unity.*`
- `indie.agent` 是否还引用未安装的 skill
- `gamedesign.*` 是否还引用 Unity skill
- shell 偏好是否与当前系统一致

### 6. 做一次完整性校验

建议至少检查以下几点：

- `.github/agents` 下不再引用 `program.`
- `.github/agents` 下不再引用 `unity.`
- `.github/agents` 下不再引用未安装 skill
- `.github` 下没有嵌套 `.git`
- 当前项目的 git 状态只包含预期新增文件

## 常见坑

### 1. 直接把整个源仓库塞进 `.github/agents`

这是最常见的安装错误。

后果：

- 目录结构不符合 Copilot 预期
- 混入源仓库根级文件
- 容易带入嵌套 `.git`

### 2. macOS 大小写目录冲突

如果同时出现 `.github/Agents` 和 `.github/agents`，在很多 macOS 环境里会被视为同一目录。

后果：

- 安装目录和源副本目录混套
- 清理时误删或误保留文件

建议始终只保留标准目录：

- `.github/agents`

### 3. 入口 agent 没有收束

即使文件复制成功，只要入口 agent 还在引用 Unity / program 路线，实际使用时仍会发生错误路由。

### 4. 只删文件，不改引用

删除了 `program.*` 和 `unity.*` 文件，但没有同步修改 `main.agent`、`indie.agent`、`gamedesign.*`，结果仍然是不完整安装。

## 非 Unity 项目的最小建议配置

如果希望以最小代价获得一套可用配置，建议从下面这组开始：

### agents

- `main.agent.md`
- `indie.agent.md`
- `git.agent.md`
- `bootstrap.agent.md`
- `performance.agent.md`
- `style-review.agent.md`

### skills

- `bootstrap-agent.skill.md`
- `performance.skill.md`
- `style-review.skill.md`

### tool

- `GitDeps.sh`
- `mssh.sh`

### gists

- `Milestone.gist.md`
- `project.config.json.gist.md`
- `turnover-log.gist.md`

之后再根据项目是否需要设计规划，按需补装 `gamedesign.*`。

## Mystic Stacker 参考落地

当前仓库采用的是“非 Unity 最小可用集合 + 设计侧补充”的安装方式：

- 安装了标准目录 `.github/agents`
- 保留了 `.github/skills`、`.github/tool`、`.github/gists`
- 排除了 `program.*` 与 `unity.*` agent
- 收束了入口 agent 对这些对象的引用
- 去掉了设计 agent 中的 Unity 落地分支

如果后续项目技术栈切换到 Unity，应重新评估并补装对应的 `program.*`、`unity.*` 以及相关 skill，而不是直接恢复整套未裁剪版本。