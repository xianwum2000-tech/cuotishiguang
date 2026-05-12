# 功能索引

> 快速查找某个功能/话题对应的文档和代码位置。

---

## 打包与发布

| 功能 | 文档 | 关键文件 |
|------|------|---------|
| Android 云打包流程 | [cloud-pack-guide.md](cloud-pack-guide.md) | `pack-config.json`, `manifest.json` |
| GitHub Releases 更新机制 | [github-release-update.md](github-release-update.md) | `utils/app/updater.js`, `release/update.json` |
| 版本号管理 | [cloud-pack-guide.md](cloud-pack-guide.md) | `manifest.json`, `utils/app/version.js`, `scripts/set-version.ps1` |
| APK 历史版本 | [apk/](apk/) | 21 个版本，v1.0.3 ~ v1.4.6 |

## 产品规划

| 功能 | 文档 | 说明 |
|------|------|------|
| 发展路线图 | [roadmap.md](roadmap.md) | 基于 v1.0.9 制定的分阶段规划 |
| v1.5 新功能设计 | [superpowers/specs/2026-05-12-new-features-design.md](superpowers/specs/2026-05-12-new-features-design.md) | OCR、每日目标、复盘、云同步的设计方案 |
| v1.5 实现计划 | [superpowers/plans/2026-05-12-v1.5-features.md](superpowers/plans/2026-05-12-v1.5-features.md) | 13 个 Task 的详细实现步骤 |

## 核心功能

| 功能 | 代码位置 | 说明 |
|------|---------|------|
| 错题管理（增删改查） | `pages/index/index.vue` (add/edit/detail screen) | 拍照上传、编辑、归档 |
| 复习调度算法 | `utils/review/scheduler.js` | new→pass1→pass2→pass3 间隔重复 |
| 单题复习流程 | `pages/index/index.vue` (review screen) | 不会/模糊/会了 三种结果 |
| 错题库筛选 | `pages/index/index.vue` (library screen) | 按科目/错因/关键词筛选 |
| 数据持久化 | `utils/storage/storage.js` | uni.setStorageSync 本地存储 |
| 图片持久化 | `utils/file.js` | uni.saveFile 避免临时路径过期 |

## AI 功能

| 功能 | 代码位置 | 说明 |
|------|---------|------|
| AI 对话助手 | `utils/ai/ai.js` | DeepSeek API，错题分析+自由问答 |
| OCR 图片识别 | `utils/ai/ocr.js` | 通义千问 VL，印刷体公式识别 |
| AI 设置页 | `pages/index/index.vue` (settings screen) | DeepSeek Key + 通义千问 Key 配置 |

## 辅助功能

| 功能 | 代码位置 | 说明 |
|------|---------|------|
| 每日目标 | `pages/index/index.vue` (home screen) | 动态推荐/固定数量，环形进度 |
| 学习复盘 | `pages/review-report/review-report.vue` | 周/月维度趋势图+文字分析 |
| 错题讲解清单 | `pages/watchlist/watchlist.vue` | 视频链接待看清单 |
| 不足知识点 | `pages/knowledge/knowledge.vue` | 薄弱知识点追踪 |
| 二级结论 | `pages/conclusion/conclusion.vue` | 数学结论/速查手册 |
| 公式参考 | `pages/index/index.vue` (formulas/limits/derivatives/integrals) | 极限/导数/积分公式 |
| 考研倒计时 | `pages/index/index.vue` (home screen) | 可配置目标日期和文字 |
| 学习进度圆环 | `pages/index/index.vue` (home screen) | 3 个自定义进度环 |

## 数据管理

| 功能 | 代码位置 | 说明 |
|------|---------|------|
| 本地备份导出 | `utils/storage/backup.js` | 导出 JSON 到本地 |
| GitHub 云同步 | `utils/sync/sync.js` | Gist 手动备份/恢复 |

## 项目管理

| 功能 | 文档 | 说明 |
|------|------|------|
| 项目上下文 | [../CLAUDE.md](../CLAUDE.md) | AI 助手的项目理解基础 |
| 对话记忆 | [conversation-memory.md](conversation-memory.md) | 历史决策和上下文浓缩 |
| 功能索引 | 本文件 | 快速查找功能对应的文档和代码 |

---

## 文档目录总览

```
docs/
├── apk/                                    # 历史 APK 安装包（21 个版本）
├── cloud-pack-guide.md                     # 云打包流程
├── github-release-update.md                # GitHub Releases 更新机制
├── roadmap.md                              # 发展路线图
├── conversation-memory.md                  # 对话记忆浓缩
├── feature-index.md                        # 功能索引（本文件）
└── superpowers/                            # Superpowers 设计文档
    ├── specs/
    │   └── 2026-05-12-new-features-design.md
    └── plans/
        └── 2026-05-12-v1.5-features.md
```
