# UI 动画优化设计

日期：2026-05-12
状态：待确认

## 概述

在不改变代码逻辑的前提下，为错题拾光 App 添加三类动画效果，提升用户体验。

## 设计原则

- 纯 CSS 动画，不引入新依赖
- 不改变任何业务逻辑和数据流
- 动画服务于体验，不影响性能
- 保持现有 UI 风格（奶油色/橙色/紫色）

---

## 一、微交互动画

### 1.1 卡片淡入

所有 `.soft-card` 卡片在进入视口时淡入上移：

```css
.soft-card {
  opacity: 0;
  transform: translateY(20px);
  animation: cardFadeIn 0.5s ease forwards;
}

@keyframes cardFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 1.2 数字滚动

首页统计数字（待复习、错题总数）使用计数动画：

```js
// 在 HomeScreen mounted 中添加
animateNumber(target) {
  let current = 0
  const step = Math.ceil(target / 20)
  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    this.displayCount = current
  }, 50)
}
```

### 1.3 进度环动画

进度环填充使用 `conic-gradient` 动画：

```css
.progress-ring-fill {
  transition: background 1s ease;
}
```

### 1.4 按钮反馈增强

按钮点击时添加波纹效果：

```css
.save-button::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.save-button:active::after {
  opacity: 1;
}
```

---

## 二、页面过渡动画

### 2.1 屏幕切换

使用 CSS transition 实现淡入淡出：

```css
.screen {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.screen-enter {
  opacity: 0;
  transform: translateX(30px);
}

.screen-enter-active {
  opacity: 1;
  transform: translateX(0);
}
```

### 2.2 底部导航切换

导航栏图标切换时添加弹跳效果：

```css
.nav-active .nav-icon-img {
  animation: navBounce 0.4s ease;
}

@keyframes navBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
```

---

## 三、3D 效果

### 3.1 复习卡片翻转

复习时点击"查看答案"，卡片 3D 翻转：

```css
.review-card {
  perspective: 1000px;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.review-card.flipped {
  transform: rotateY(180deg);
}
```

### 3.2 立体按钮

按钮添加阴影和按下深度效果：

```css
.review-start-button {
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  transition: all 0.2s ease;
}

.review-start-button:active {
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
  transform: translateY(2px);
}
```

---

## 文件变更

| 文件 | 变更内容 |
|------|---------|
| `pages/index/index.vue` | 添加 CSS 动画、修改模板结构（仅动画相关 class） |

## 不变内容

- 所有业务逻辑不变
- 数据流不变
- 页面路由不变
- 组件结构不变

---

## 验证

- 所有页面正常加载
- 动画流畅不卡顿
- 按钮功能正常
- 复习流程正常
