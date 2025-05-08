# CakePlan静态网页计划网站

一个用于管理个人目标、计划和进度的网站应用。支持使用TOML格式导入目标和计划，并可视化展示进度。

## 功能特点

- 📝 目标管理：展示所有目标的完成情况和进度
- ✅ 计划跟踪：管理每个目标下的具体计划，标记完成状态
- 📈 进度展示：自动计算并显示目标的完成进度和剩余天数
- 📔 日志记录：以时间线形式记录与目标相关的进展日志
- 📤 TOML导入：支持通过TOML文件或文本导入新的目标和计划
- 🇨🇳 中文界面：完全中文化的用户界面和提示信息

## 技术栈

- React + TypeScript
- Vite 构建工具
- Ant Design 组件库
- React Router 路由管理
- Day.js 日期处理
- TOML 配置解析

## 部署到GitHub Pages

这个项目可以轻松部署到GitHub Pages上，只需要以下几个步骤：

1. 在GitHub上创建或fork该仓库，命名为`cakeplan`
3. 在`package.json`中，确认`homepage`字段设置为：`https://你的用户名.github.io/cakeplan`
2. 将项目代码推送到该仓库：
   ```bash
   git init
   git add .
   git commit -m "初始提交"
   git branch -M main
   git remote add origin https://github.com/你的用户名/cakeplan.git
   git push -u origin main
   ```
4. 使用以下命令部署网站：
   ```bash
   npm run deploy
   ```
5. 部署完成后，在GitHub仓库设置中启用GitHub Pages，选择`gh-pages`分支作为源

完成以上步骤后，您的计划网站将会在`https://你的用户名.github.io/cakeplan`上线。

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 使用TOML导入目标

本应用支持通过TOML格式导入目标和计划。TOML格式示例：

```toml
[goal]
title = "学习React"
description = "掌握React基础知识和常用库"
start_date = "2025-05-01"
end_date = "2025-06-30"

[[plans]]
title = "学习React基础"
description = "学习React组件、Props、State等概念"
start_date = "2025-05-01"
end_date = "2025-05-15"

[[plans]]
title = "学习React Router"
description = "学习路由配置和页面跳转"
start_date = "2025-05-16"
end_date = "2025-05-30"

[[logs]]
date = "2025-05-01"
content = "开始学习React，安装了开发环境"
related_plans = ["学习React基础"]
```

更多信息请查看应用内的"帮助"页面。

## TODO

- [ ] UI太简陋，计划卡片没有固定的大小，页面宽度也没有固定
- [ ] 完善除了导入toml文件之外的其他添加任务的方式，以及导出任务toml的功能
- [ ] 考虑一个办法能够更友好地同步不同平台的学习记录，而不是依赖于cookies或者每次加载上次下载地toml。但是对于一个静态网页来说这是难以避免的吧。如果不用静态网页的话，消耗又会比较大了。
