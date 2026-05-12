# 对话记忆浓缩

> 记录开发者与 AI 助手在「错题拾光」项目中的关键决策和上下文，供后续对话快速恢复背景。

---

## 项目定位

考研数学错题自动复习调度器。不是题库/搜题/AI解题软件。用户线下做题后拍照上传，App 本地保存，按调度规则自动安排每日复习。**个人自用**。

## 技术栈约束

- **必须用** uni-app Vue3（普通 uni-app，不是 uni-app x）
- **不要迁移** 到 `.uvue` / `.uts` — 之前尝试过，Android 云打包遇到大量 Kotlin 类型错误，已放弃
- 本地存储：`uni.setStorageSync`，图片用 `uni.saveFile` 持久化
- 打包方式：HBuilderX 云打包

## 版本历史关键节点

| 版本 | 里程碑 |
|------|--------|
| v1.0.9 | 基础功能完善，修复逾期天数 bug |
| v1.1.x | 自定义选项、题目来源、编辑错题 |
| v1.2.0 | 错题讲解清单 |
| v1.3.x | 首页考研倒计时、学习进度圆环、泰勒展开扩充 |
| v1.4.0 | 新增 AI 助手（DeepSeek 对话） |
| v1.4.4 | AI 对话优化 + 重置功能 |
| v1.5.0 | 导航修复、每日目标、OCR 识别、周期复盘、云同步 |

## 架构决策记录

### 单页 + 组件切换架构

`pages/index/index.vue` 作为主容器，内部通过 `screen` 变量切换 15+ 个子组件（home、add、detail、review、today、library、stats、settings、formulas 等）。部分功能（knowledge、conclusion、watchlist、review-report）是独立页面，用 `uni.navigateTo` 跳转。

**已知问题：** index.vue 超过 6000 行，维护困难。`pages/index/screens/` 下有 8 个 Screen 组件文件，但 index.vue 仍包含大量内联模板和逻辑。

### 导航栈管理

`navigateTo()` 方法将当前 screen 压入 `screenHistory` 数组，`handleBackPress()` 弹栈返回。v1.5 修复了 `showLibrary/showStats/showApps` 重置 history 的 bug。

### AI 能力分两条线

- **对话 AI：** DeepSeek API（纯文本），用于错题分析和自由问答
- **视觉 AI：** 通义千问 VL（DashScope API），用于 OCR 识别印刷体错题图片

两条线独立配置 API Key，在设置页分别管理。

### 数据同步方案

选择 GitHub Gist 而非自建后端，原因：个人自用、零成本、免服务器。手动备份/恢复，不自动同步。

## UI 风格

奶油色/橙色/紫色卡片风格。圆角、阴影、渐变按钮。新增功能必须沿用现有风格，不要大改视觉。

## 开发者偏好

- 优先使用中文交流
- 希望 AI 助手主动提出技术方案，而不是等指令
- 重视代码整洁，愿意做目录重组
- 对 Superpowers 框架感兴趣，已安装使用
