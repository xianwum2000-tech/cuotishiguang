# 错题拾光 v1.5 新功能设计

日期：2026-05-12
状态：已确认

## 概述

四个新功能 + 一个架构修复，按优先级排序：

1. **OCR 题目识别** — 通义千问 VL 识别印刷体错题图片
2. **每日目标** — 首页内嵌目标卡片，动态推荐 + 固定值
3. **周期复盘** — 独立复盘页，周/月维度图表 + 文字分析
4. **云同步** — GitHub Gist 手动备份/恢复
5. **导航修复** — 组件级屏幕历史栈，修复返回键行为

---

## 1. OCR 题目识别

### 目标

用户拍照上传错题后，AI 自动识别图片中的文字和数学公式，转为可编辑文本，与原图共存展示。

### API 选择

- 通义千问 VL（阿里云百炼平台）
- 模型：`qwen-vl-plus`（性价比高，印刷体识别准确）
- 成本：约 ¥0.02-0.04/张图
- 接口：DashScope API，兼容 OpenAI 格式

### 数据结构变更

错题对象新增字段：

```js
{
  questionText: '',   // AI 识别的题目文本（含 LaTeX）
  answerText: '',     // AI 识别的答案文本（含 LaTeX）
  ocrStatus: ''       // '' | 'pending' | 'done' | 'failed'
}
```

### 新增文件

- `utils/ocr.js` — 封装通义千问 VL API 调用
  - `recognizeImage(imagePath)` → 返回识别文本
  - 图片转 base64，构造多模态请求
  - 系统 prompt 引导输出 LaTeX 格式公式
  - 错误处理（网络失败、API 限流、识别失败）

### UI 变更

**AddScreen（新增错题）：**
- 拍照上传后自动触发 OCR
- 若图片包含多道题，弹出输入框让用户指定"第几题"（如输入"5"表示第5题）
- 识别中显示 loading 状态（"正在识别题目..."）
- 识别完成后，图片下方显示识别文本预览
- 用户可点击"编辑识别结果"进行修正
- 识别失败不阻塞保存，降级为纯图片模式

**DetailScreen（错题详情）：**
- 若有识别文本，默认展示文本（带公式渲染）
- 可切换到"原图"tab 查看原始照片
- 新增"重新识别"按钮（针对已有图片手动触发）
- 新增"编辑识别结果"入口

### OCR Prompt 设计

```
你是一个数学公式识别助手。请识别图片中的数学题目内容。
要求：
1. 数学公式用 $...$ 包裹（行内）或 $$...$$ 包裹（独立成行）
2. 保持原文的题目编号和格式
3. 如果图片中有多个题目，只识别用户指定的那道题
4. 输出纯文本，不要添加解题步骤或分析
```

### 设置页变更

- 新增"AI 识别配置"区域
- 通义千问 API Key 输入框
- 模型选择（qwen-vl-plus / qwen-vl-max）
- 测试识别按钮（验证 API Key 是否有效）

---

## 2. 每日目标

### 目标

在首页展示今日复习目标进度，完成后给予正向反馈，增强学习动力。

### 数据结构变更

preferences 新增字段：

```js
{
  dailyGoalMode: 'dynamic',  // 'dynamic' | 'fixed'
  dailyGoalFixed: 10          // fixed 模式下的固定目标数
}
```

### 目标计算逻辑

- **动态模式（默认）：**
  - 基准 = 今日到期数（dueCount）
  - 若有逾期，额外加 20% 逾期量（向上取整）
  - 最低目标 = 3，最高目标 = 30
  - 公式：`max(3, min(30, dueCount + ceil(overdueCount * 0.2)))`
- **固定模式：** 用户设定的固定值

### UI 设计

**HomeScreen 变更：**
- 在 greeting-block 和 status-grid 之间插入目标卡片
- 卡片内容：
  - 左侧：环形进度（复用现有 progress-ring 样式）
  - 中间：`"今日目标 3/8"` 文字
  - 右侧：完成时显示 ✓ 动画
- 今日复习数 = 当天完成的 reviewRecord 数量
- 目标完成时显示 toast："今日目标已达成！"

**SettingsScreen 变更：**
- 新增"每日目标"配置区
- 模式切换：动态推荐 / 固定数量
- 固定模式下显示数字选择器（3-30）

---

## 3. 周期复盘

### 目标

以周/月为维度生成学习报告，包含趋势图表和文字分析，帮助用户回顾学习进展。

### 新增文件

- `pages/review-report/review-report.vue` — 独立复盘页

### pages.json 变更

```json
{
  "path": "pages/review-report/review-report",
  "style": { "navigationBarTitleText": "学习复盘" }
}
```

### 页面设计

**顶部切换：** 本周 / 本月 tab 切换

**数据概览卡片：**
- 复习总数
- 正确率（known 占比）
- 与上期对比（↑/↓ 箭头 + 百分比）

**趋势折线图：**
- X 轴：日期（本周=7天，本月=30天）
- Y 轴：每日复习数量
- 双线：总数 + 正确数
- 使用 canvas 绘制（uni-app 兼容性好）

**分布分析：**
- 本周/本月错因分布（柱状图）
- 本周/本月章节分布（柱状图）

**文字摘要：**
- 自动生成一段文字总结
- 模板：`"本周复习了 X 道题，正确率 X%。薄弱环节是 XXX，建议重点复习 XXX 章节。"`
- 如果有进步：`"比上周提升了 X%，继续保持！"`

**入口：**
- StatsScreen 新增"查看复盘报告"按钮
- HomeScreen 首页底部可选入口

---

## 4. 云同步（GitHub Gist）

### 目标

通过 GitHub Gist 实现数据的手动备份和恢复，保护学习数据不丢失。

### 新增文件

- `utils/sync.js` — GitHub Gist 同步逻辑
  - `backupToGist(token, data)` → 创建/更新 Gist
  - `restoreFromGist(token)` → 读取 Gist 数据
  - `testGistToken(token)` → 验证 token 有效性

### Gist 格式

- 文件名：`cuotishiguang-backup.json`
- 内容：与现有 `exportAllData()` 格式一致
- 描述：`"错题拾光备份 - 2026-05-12"`
- 使用固定的 Gist ID（首次创建后保存，后续更新同一 Gist）

### 设置页 UI

新增"云同步"配置区：
- GitHub Personal Access Token 输入框（带说明：如何获取 token）
- "测试连接"按钮
- "备份到 GitHub"按钮（显示上次备份时间）
- "从 GitHub 恢复"按钮（带确认弹窗：将覆盖本地数据）
- 同步状态指示（上次同步时间、同步结果）

### 安全考虑

- Token 存储在本地 preferences 中（`uni.setStorageSync`）
- 仅申请 `gist` scope 的 token
- 备份前提示用户确认
- 恢复前提示"将覆盖本地数据，建议先备份当前数据"

---

## 5. 导航修复

### 问题

index.vue 内的组件级屏幕（Home、Add、Detail、Review、TodayList、Library、Stats、Settings）不走 uni-app 页面栈，导致按返回键直接退出 app。

### 方案

在 index.vue 内维护 `screenHistory` 数组：

```js
data() {
  return {
    currentScreen: 'home',
    screenHistory: ['home']
  }
}
```

**navigate 方法改造：**

```js
navigate(screen) {
  if (screen !== this.currentScreen) {
    this.screenHistory.push(screen)
    this.currentScreen = screen
  }
}
```

**onBackPress 拦截：**

```js
onBackPress() {
  if (this.screenHistory.length > 1) {
    this.screenHistory.pop()
    this.currentScreen = this.screenHistory[this.screenHistory.length - 1]
    return true // 阻止默认退出行为
  }
  // 回到首页后再按一次才退出
  if (this.currentScreen !== 'home') {
    this.currentScreen = 'home'
    this.screenHistory = ['home']
    return true
  }
  return false // 允许退出
}
```

**goBack 方法统一：**

```js
goBack() {
  if (this.screenHistory.length > 1) {
    this.screenHistory.pop()
    this.currentScreen = this.screenHistory[this.screenHistory.length - 1]
  }
}
```

### 影响范围

- index.vue 的 `navigate`、`goBack` 方法
- 各 Screen 组件的 `$emit('navigate', ...)` 调用无需修改
- knowledge/conclusion/watchlist 等真页面不受影响

---

## 实施顺序

按优先级分批实施：

### 第一批：导航修复 + 每日目标
- 导航修复：改动小，立竿见影
- 每日目标：纯前端，不依赖外部 API

### 第二批：OCR 识别
- 需要注册阿里云百炼账号
- 需要新增 API 调用模块
- 涉及 AddScreen 和 DetailScreen 改造

### 第三批：周期复盘
- 新增独立页面
- 需要 canvas 图表绘制

### 第四批：云同步
- 需要用户配置 GitHub token
- 与现有数据导出逻辑复用

---

## 技术约束

- uni-app Vue3（非 uni-app x）
- 不引入新依赖（图表用 canvas 手绘）
- 保持现有 UI 风格（奶油色/橙色/紫色卡片）
- 所有数据仍以 `uni.setStorageSync` 为主存储
- 通义千问 VL API 走 HTTPS，需在 manifest.json 配置域名白名单
