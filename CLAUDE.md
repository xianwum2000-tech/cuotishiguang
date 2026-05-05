# 错题拾光 — 项目上下文

## 定位
考研数学错题自动复习调度器。不是题库/搜题/AI解题软件。用户线下做题后拍照上传，App本地保存，按调度规则自动安排每日复习。

## 技术栈
- HBuilderX / uni-app Vue3（普通uni-app，**不是** uni-app x）
- 页面文件：`.vue` + `.js`
- 本地存储：`uni.setStorageSync`
- 图片持久化：`uni.saveFile`

**重要：不要再迁移到 `.uvue` / `.uts`。** 之前尝试 uni-app x / UTS 路线，Android云打包遇到大量Kotlin类型错误，已放弃。当前 `.vue` / `.js` 链路可成功打包APK。

## 关键文件

| 文件 | 用途 |
|------|------|
| `App.vue` | 应用入口 |
| `main.js` | JS入口 |
| `pages/index/index.vue` | 主页面，全部UI/交互 |
| `utils/scheduler.js` | 调度逻辑 |
| `utils/storage.js` | 本地存储 |
| `utils/date.js` | 日期工具 |
| `utils/file.js` | 图片持久化与预览 |
| `utils/version.js` | 版本管理 |
| `utils/updater.js` | App更新（GitHub Releases） |
| `manifest.json` | uni-app配置 |
| `docs/github-release-update.md` | 更新说明 |
| `release/update.example.json` | 更新配置示例 |
| `scripts/set-version.ps1` | 版本号脚本 |

## 核心数据结构

错题对象：`{ id, questionImage, answerImage, subject, chapter, errorType, difficulty, note, createdAt, updatedAt, reviewStage, nextReviewDate, totalReviewCount, totalWrongCount, lastReviewResult, isArchived }`

复习记录：`{ id, questionId, reviewDate, result, stageBefore, stageAfter, nextReviewDate }`

## 调度规则
- 阶段：`new` → `pass1` → `pass2` → `pass3`
- 新错题：2天后复习
- pass1（第一次会了）：5天后
- pass2（第二次会了）：10天后
- pass3（第三次会了）：20天后
- pass3后会了：继续20天滚动
- 不会：回到new，2天后
- 模糊：保守回退，不升级
- 每日任务不消失，逾期累计
- 排序优先级：逾期更久 > 错误次数更多 > 更早到期

## 已实现功能
- 新增错题（题目图+答案图+科目章节错因难度备注）
- 本地持久化（错题/复习记录/用户偏好）
- 自动调度复习
- 首页（今日待复习/逾期/总数/优先级/开始复习）
- 今日复习（筛选→单题复习→不会/模糊/会了）
- 错题库（全部/筛选/详情/历史记录）
- 统计页（总数/待复习/已掌握/7天/章节分布/错因分布）
- 设置页（标题/问候语/姓名/头像）
- 图片预览（点击放大）
- 图片持久化（saveFile避免临时路径过期）
- 失效图片修复（详情页更换图片）
- GitHub Releases更新检查/下载/安装

## 版本信息
- versionName: 1.0.2, versionCode: 102
- packageName: com.cuotishiguang.app
- appid: __UNI__9F74044
- 覆盖安装条件：同包名、同签名证书、versionCode递增、不卸载旧版

## UI风格
卡片、圆角、奶油色/橙色/紫色风格。不要大改视觉风格，新增功能沿用现有风格。
