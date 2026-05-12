# 架构重构设计

日期：2026-05-12
状态：已确认

## 目标

将 index.vue 从 6261 行拆分为可维护的模块结构，不改变任何业务逻辑和用户体验。

## 当前状态

| 文件 | 行数 | 问题 |
|------|------|------|
| pages/index/index.vue | 6261 | 21 个屏幕内联，3400 行 CSS |
| pages/index/screens/*.vue | 3484 | 死代码，未被引用 |

## 目标结构

```
pages/
├── index/
│   ├── index.vue              ← 壳：screen 切换 + bottom-nav + 状态管理
│   ├── screens/               ← 21 个屏幕组件
│   │   ├── HomeScreen.vue
│   │   ├── AddScreen.vue
│   │   ├── ReviewScreen.vue
│   │   ├── LibraryScreen.vue
│   │   ├── DetailScreen.vue
│   │   ├── StatsScreen.vue
│   │   ├── SettingsScreen.vue
│   │   ├── TodayListScreen.vue
│   │   ├── AiChatScreen.vue
│   │   ├── EditScreen.vue
│   │   ├── AppsScreen.vue
│   │   ├── FormulasScreen.vue
│   │   ├── LimitsScreen.vue
│   │   ├── DerivativesScreen.vue
│   │   ├── IntegralsScreen.vue
│   │   ├── TheoremsScreen.vue
│   │   ├── ScalingScreen.vue
│   │   ├── PropertiesScreen.vue
│   │   ├── ProfileScreen.vue
│   │   ├── QuotesSettingsScreen.vue
│   │   └── AiSettingsScreen.vue
│   └── components/            ← 公共组件
│       ├── TopBar.vue
│       ├── SoftCard.vue
│       └── BottomNav.vue
├── styles/
│   └── global.css             ← 全局样式
└── ...
```

## 实施策略

### 分批提取

每批提取 3-5 个屏幕，验证无误后再提取下一批。

| 批次 | 屏幕 | 风险 |
|------|------|------|
| 1 | HomeScreen, AddScreen, TodayListScreen | 低 |
| 2 | ReviewScreen, LibraryScreen, DetailScreen | 低 |
| 3 | StatsScreen, SettingsScreen, ProfileScreen | 低 |
| 4 | AppsScreen, FormulasScreen, LimitsScreen, DerivativesScreen, IntegralsScreen | 中 |
| 5 | TheoremsScreen, ScalingScreen, PropertiesScreen | 低 |
| 6 | AiChatScreen, AiSettingsScreen, EditScreen, QuotesSettingsScreen | 中 |
| 7 | TopBar, SoftCard, BottomNav, global.css | 低 |

### 状态传递方式

保持现有 props/emit 模式，不引入新依赖：

```vue
<!-- index.vue -->
<HomeScreen
  v-if="screen === 'home'"
  :mistakes="mistakes"
  :records="records"
  :preferences="preferences"
  @navigate="navigateTo"
  @start-review="startReview"
/>
```

### 公共组件

| 组件 | 职责 | Props |
|------|------|-------|
| TopBar | 顶部导航栏 | title, showBack, showGear |
| SoftCard | 通用卡片容器 | 无（slot） |
| BottomNav | 底部导航栏 | activeScreen |

## 验证

每批提取后：
1. HBuilderX 编译无报错
2. 所有屏幕正常显示
3. 导航切换正常
4. 数据读写正常
5. 动画效果正常
