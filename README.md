# 错题拾光

考研数学错题自动复习调度器。线下做题 → 拍照上传 → 自动安排每日复习。

**不是题库、搜题或 AI 解题软件。**

## 核心功能

- **错题录入**：上传题目图 + 答案图，选择科目、章节、错因、难度、备注
- **自动调度**：基于间隔重复算法，新题 2 天后复习，会了按 5/10/20 天推进，不会重置，模糊保守回退
- **每日复习**：今日待复习列表，按优先级排序，先看题再对答案
- **错题库**：全部错题浏览、筛选、详情、历史复习记录
- **统计洞察**：总览、待复习、已掌握、7 天趋势、章节分布、错因分布
- **离线可用**：全部数据本地存储，无需账号，无需网络
- **版本更新**：应用内检查 GitHub Releases 更新

## 调度规则

| 阶段 | 触发 | 间隔 |
|------|------|------|
| `new` | 新错题 | 2 天后 |
| `pass1` | 第一次答对 | 5 天后 |
| `pass2` | 第二次答对 | 10 天后 |
| `pass3` | 第三次答对 | 20 天后 |
| 答错 | 任意阶段 | 回到 `new`，2 天后 |

逾期任务不会消失，会累计并优先展示。

## 技术栈

- **框架**：uni-app Vue3（普通 uni-app，非 uni-app x）
- **存储**：uni.setStorageSync + uni.saveFile（图片持久化）
- **打包**：HBuilderX 云打包
- **更新**：GitHub Releases

## 项目结构

```
├── App.vue                    # 应用入口
├── main.js                    # JS 入口
├── manifest.json              # uni-app 配置
├── pages/index/index.vue      # 主页面（全部 UI）
├── utils/
│   ├── scheduler.js           # 复习调度逻辑
│   ├── storage.js             # 本地存储
│   ├── date.js                # 日期工具
│   ├── file.js                # 图片持久化与预览
│   ├── version.js             # 版本管理
│   └── updater.js             # 应用更新
├── release/
│   ├── update.json            # 更新清单
│   └── update.example.json   # 更新清单模板
├── scripts/
│   └── set-version.ps1        # 版本号脚本
└── docs/
    └── github-release-update.md  # 更新流程说明
```

## 开发

用 HBuilderX 打开项目，运行到手机或打包 APK。

### 命令行打包

```bash
cli pack --platform android --project . --android.androidpacktype 3 --android.packagename com.cuotishiguang.app
```

### 发布新版

1. 修改 `manifest.json` 和 `utils/version.js` 中的版本号
2. 打包 APK
3. 修改 `release/update.json`
4. 上传 APK 和 `update.json` 到 GitHub Release

详见 `docs/github-release-update.md`。

## 版本

当前版本：**1.0.9** (versionCode 109)
