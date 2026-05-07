# 错题拾光 — 发展路线图

> 基于 v1.0.9 代码库深度分析制定。项目定位：考研数学错题自动复习调度器（离线优先、本地存储、间隔重复）。

---

## 当前项目概况

| 项目 | 说明 |
|------|------|
| 技术栈 | uni-app Vue3 + 本地存储 + 图片持久化 |
| 包名 | `com.cuotishiguang.app` |
| 版本 | v1.0.9 (versionCode: 109) |
| 核心文件 | 单个 `pages/index/index.vue`（3728 行，含 15+ 个屏幕） |
| 数据模型 | 错题 + 复习记录 + 偏好设置 + 名句轮换 |
| 调度规则 | new→2天 → pass1→5天 → pass2→10天 → pass3→20天滚动 |

### 已知 Bug（v1.0.9）

| Bug | 位置 | 影响 |
|-----|------|------|
| 逾期天数始终为 0 | `scheduler.js:72` `daysBetween` 参数顺序颠倒 | 优先级排序失效、逾期提示不显示 |
| Google Fonts 国内加载超时 | `index.vue` style 顶部 `@import` | 首屏白屏数秒 |
| 启动时串行图片迁移阻塞 | `onLoad` 中逐个 `await persistImageFile` | 50+ 错题时启动卡顿 |

---

## 第一阶段：修 Bug（1-2 天）

直接修复影响用户体验的真实 bug。

### 1.1 修复逾期天数始终为 0

- **文件**：`utils/scheduler.js`
- **问题**：`getOverdueDays` 中 `daysBetween(currentDate, nextReviewDate)` 参数顺序错误。`daysBetween(later, earlier)` 要求较晚日期在前，逾期时 `nextReviewDate < currentDate`，应传入 `daysBetween(currentDate, nextReviewDate)` → 但当前 `currentDate` 是较晚的，所以正确写法应为 `daysBetween(currentDate, nextReviewDate)` — 即 `(later - earlier)` 得到正数
- **修正**：确保 `daysBetween` 调用时 late 参数在前。逾期天数 = 今天 - 下次复习日期
- **受益**：主页逾期计数、优先级排序、今日列表排序全部恢复正确

### 1.2 修复字体加载超时

- **文件**：`pages/index/index.vue`
- **问题**：`@import url("https://fonts.googleapis.com/css2?family=Lexend...")` 在中国大陆被屏蔽，DNS 超时导致首屏白屏
- **修正**：移除 Google Fonts 引用，直接依赖 `"PingFang SC", "Microsoft YaHei"` 本地字体
- **受益**：国内用户首屏加载正常

### 1.3 修复启动时图片迁移阻塞

- **文件**：`pages/index/index.vue` — `onLoad()` → `migrateStoredImages()`
- **问题**：每条错题的题图+答案图串行 `await persistImageFile`，50 道题 = 100 次串行 I/O
- **修正**：改为 `Promise.all` 并行执行，单张失败不阻塞其他。完成后统一 `refreshData`
- **受益**：启动速度显著提升

---

## 第二阶段：数据安全（2-3 天）

考研学生数月积累的错题数据一旦丢失无法挽回。这是刚需。

### 2.1 存储写入保护

- **文件**：`utils/storage.js`
- **内容**：
  - 所有 `uni.setStorageSync` 包裹 try/catch
  - 写入失败时记录错误到 `storage_errors` 键（数组，最多 50 条）
  - 新增 `safeSetStorageSync(key, value)` 包装函数
  - 导出 `getStorageErrors()` 供 UI 查询
- **UI**：设置页底部显示"存储异常（N 次）"警告卡片，引导用户导出数据

### 2.2 数据导出

- **文件**：新增 `utils/backup.js`
- **功能**：
  - 将 mistakes + records + preferences + quotes 序列化为 JSON
  - 通过 `uni.saveFile`（或 `plus.io`）保存到下载目录
  - 文件名：`错题拾光_备份_2026-05-06.json`
- **UI**：设置页新增"导出数据"按钮，点击后 toast 告知保存路径

### 2.3 数据导入

- **文件**：`utils/backup.js`（同上）
- **功能**：
  - 选择 JSON 文件 → 解析 → 验证结构
  - 按 id 去重合并（新数据覆盖旧数据）
  - 返回导入统计：新增 N 道错题，更新 M 道，新增 K 条记录
- **UI**：设置页新增"导入数据"按钮 → 文件选择 → 确认弹窗（告知将导入多少数据）→ 执行合并

### 2.4 图片持久化失败处理

- **文件**：`utils/file.js` + `pages/index/index.vue`
- **内容**：
  - `persistImageFile` 失败时在返回值中标记 `persistenceFailed: true`
  - `chooseImage`、`saveMistake` 检测此标记 → toast 警告用户
  - 详情页/复习页加载带此标记的错题时显示黄色提示条"图片可能已失效"

---

## 第三阶段：架构重构（4-6 天）

当前 3728 行单文件不可维护。这是最重要的改造。

### 3.1 提取屏幕组件

将每个 screen 拆为独立组件，放在 `pages/index/components/` 下：

```
pages/index/
├── index.vue               # 壳：导航栈 + 数据加载 + 底部 Tab
└── components/
    ├── HomeScreen.vue       # 首页仪表盘
    ├── AddScreen.vue        # 新增错题
    ├── TodayScreen.vue      # 今日待复习列表
    ├── ReviewScreen.vue     # 复习流程（看题→揭晓→评价）
    ├── LibraryScreen.vue    # 错题库（搜索+筛选）
    ├── DetailScreen.vue     # 错题详情+历史记录
    ├── StatsScreen.vue      # 统计页
    ├── SettingsScreen.vue   # 设置页
    ├── AppsScreen.vue       # 应用中心
    ├── FormulaCategory.vue  # 公式分类
    └── QuotesSettings.vue   # 名句管理
```

- 每个子组件通过 `props` 接收数据，通过 `emit` 通知父组件
- 子组件内部逻辑留在子组件中
- 共享工具函数提取到 `utils/format.js`

### 3.2 CSS 作用域化

- 每个组件 `<style scoped>`
- 颜色、圆角、间距变量提取到 `styles/variables.scss`
- 通用组件样式（`.soft-card`、`.tab-chip`、`.field-label`）提取到 `styles/common.scss`
- `index.vue` 只保留壳层布局样式

### 3.3 清理遗留文件

- 删除 `App.uvue`、`main.uts`、`utils/*.uts`（已放弃 uni-app x 路线）
- 删除 `参考代码.txt`
- 删除 `pages/index/index.uvue`

---

## 第四阶段：调度算法升级（2-3 天）

现有调度器功能正确，但精细度不够。目标是让间隔重复更贴合考研数学的遗忘规律。

### 4.1 连续正确计数（streak）

- 新增字段：`streak`（当前连续正确次数）、`bestStreak`（历史最佳）
- 逻辑：
  - 会了 → streak + 1，更新 bestStreak
  - 不会 → streak = 0
  - 模糊 → streak 不变
- 间隔加成：`finalInterval = baseInterval × min(1 + streak × 0.2, 2.0)`
- 示例：pass1 连续正确 3 次 → 间隔从 5 天变为 8 天

### 4.2 优化"模糊"处理

- **当前**：pass2 的题选"模糊" → 降级到 pass1 + 5天（惩罚太重）
- **改为**：保持当前阶段不降级 → 按当前阶段间隔重新安排 → 重置 streak
- **理由**：模糊说明"差一点就会"，保持阶段让用户有动力诚实选择

### 4.3 毕业机制

- pass3 阶段连续正确 3 次 → 自动标记 `mastered: true`
- 已毕业的题不出现在待复习列表中
- 错题库中显示"已毕业"徽章
- 详情页可手动"取消毕业"（降回 pass2，streak 重置）

### 4.4 竞态保护

- `completeReview` 中添加乐观锁：操作前拍快照 → 提交前重新读取 → 对比是否被并发修改 → 是则拒绝并提示重试

### 4.5 数据版本迁移

- 新增 `DATA_VERSION` 常量和 `migrateData()` 函数
- 每次数据结构变更递增版本号
- `getMistakes()` 自动检测版本号，执行迁移，补全新字段默认值

---

## 第五阶段：UX 改进（3-5 天）

降低日常使用摩擦，让每天处理 10-20 道错题不觉得负担。

### 5.1 快速添加模式

- 添加页顶部切换按钮："标准模式" / "快速模式"
- **快速模式**：
  - 只显示两个图片上传 + 保存按钮
  - 科目、章节、错因、难度、备注全部使用上次的值
  - 保存后停留在添加页，方便连续添加
  - 底部显示"本次已添加 N 题"计数器
  - 点"完成"回到首页

### 5.2 批量操作

- 错题库长按卡片 → 多选模式
- 标题切换为"已选择 N 项"，显示全选/取消
- 底部出现批量操作栏：归档、删除（二次确认）

### 5.3 统计页增强

- **正确率趋势**：最近 30 天每日正确率折线图
- **章节薄弱点分析**：按章节统计错题数、平均复习次数、当前正确率，按正确率从低到高排序
- **新增/掌握趋势**：最近 30 天每天新增 vs 掌握数量对比

### 5.4 复习体验优化

- **复习计时器**：显示本题已用时间
- **复习摘要**：完成后弹窗"本次复习 N 题：会了 X、模糊 Y、不会 Z，用时 M 分钟"
- **进度条**：显示今日复习进度百分比

### 5.5 本地通知

- 错题到期时推送本地提醒（`plus.push` 或 uni-app 本地通知 API）
- 设置页可配置提醒时间（默认每天 9:00）
- 通知内容："今天有 N 道错题需要复习"

---

## 第六阶段：可扩展性（3-5 天）

让 App 适配不同用户需求，不再为特定用户硬编码。

### 6.1 科目/章节可配置

- 改为存储驱动：`storage` 中新增 `subjects_config` 键
- 设置页新增"科目管理"入口
- 功能：增删改科目、增删改章节
- 删除前检查是否有错题引用该科目/章节 → 提示 → 确认后标记为"未分类"

### 6.2 错因标签可配置

- 改为存储驱动：`storage` 中新增 `error_types_config` 键
- 设置页新增"错因标签管理"
- 功能：增删改错因标签
- 显示每个标签被多少道题使用

### 6.3 公式手册数据化

- 新增 `utils/formulas.js`，将极限/导数/积分公式改为 JSON 数据
- 公式列表组件接收 `category` prop，从数据源渲染
- 支持用户添加自定义公式卡片（存入 storage）

### 6.4 底部导航重新设计

- 底部 Tab 从 3 个改为 4 个：
  - 首页（🏠）
  - 错题库（📚）
  - 工具箱（🔧）— 整合公式手册、定理、等价无穷小、函数性质
  - 我的（👤）— 整合统计、设置、版本管理
- 隐藏"coming soon"占位页面

---

## 时间预估汇总

| 阶段 | 时间 | 关键产出 |
|------|------|----------|
| 一：修 Bug | 1-2 天 | 逾期天数、字体加载、启动性能 |
| 二：数据安全 | 2-3 天 | 导出/导入、存储保护、图片失败处理 |
| 三：架构重构 | 4-6 天 | 组件拆分、CSS 作用域、清理冗余 |
| 四：调度升级 | 2-3 天 | streak、模糊优化、毕业机制、数据迁移 |
| 五：UX 改进 | 3-5 天 | 快速添加、批量操作、统计增强、本地通知 |
| 六：可扩展性 | 3-5 天 | 科目/错因可配置、公式数据化、导航重构 |

**总计预估：15-24 天**

---

## 实施建议

1. **按阶段顺序执行**，每阶段完成后确保 App 可正常编译运行
2. **保持向后兼容**：新字段用默认值补全，旧数据不能报错
3. **不要引入 npm 依赖**：纯 HBuilderX 项目，无 package.json
4. **不要改用 .uvue / .uts**：已确认放弃 uni-app x 路线
5. **每阶段核心路径手动测试**：添加错题 → 今日复习 → 提交结果 → 错题库查看 → 统计查看
