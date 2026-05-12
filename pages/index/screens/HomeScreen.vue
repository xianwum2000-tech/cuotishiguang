<template>
	<view class="screen screen-cream">
		<view class="topbar">
			<view class="brand-row">
				<view class="avatar avatar-ring">
					<image class="avatar-img" :src="preferences.homeAvatar" mode="aspectFill"></image>
				</view>
				<text class="brand-title">{{ preferences.homeTitle }}</text>
			</view>
		</view>

		<view class="page-content home-content">
			<view class="greeting-block">
				<text class="home-title">{{ preferences.greetingTitle }}</text>
				<text class="home-subtitle">{{ currentQuote }}</text>
			</view>

			<view class="daily-goal-card" :class="{ 'daily-goal-done': dailyGoalCompleted }">
				<view class="daily-goal-ring-wrap">
					<view class="daily-goal-ring-fill" :style="{ background: goalConicGradient }"></view>
					<view class="daily-goal-ring-inner">
						<text v-if="!dailyGoalCompleted" class="daily-goal-ring-text">{{ todayCompletedCount }}/{{ dailyGoalTarget }}</text>
						<text v-else class="daily-goal-ring-check">✓</text>
					</view>
				</view>
				<view class="daily-goal-copy">
					<text class="daily-goal-title">今日目标</text>
					<text class="daily-goal-sub">{{ dailyGoalCompleted ? '目标已达成！' : '还差 ' + (dailyGoalTarget - todayCompletedCount) + ' 道' }}</text>
				</view>
			</view>

			<view class="status-grid">
				<view class="stat-card stat-primary">
					<text class="stat-label stat-label-light">今日待复习</text>
					<text class="stat-number stat-number-light">{{ dueCount }}</text>
				</view>
				<view class="stat-card stat-surface stat-middle" @click="$emit('goto-watchlist')">
					<text class="stat-label stat-label-red">错题讲解</text>
					<text class="stat-number stat-number-red">{{ watchlistPendingCount }}</text>
				</view>
				<view class="stat-card stat-surface">
					<text class="stat-label stat-label-muted">错题总数</text>
					<text class="stat-number stat-number-dark">{{ totalCount }}</text>
				</view>
			</view>

			<view class="study-actions">
				<view class="add-mistake-button" @click="$emit('navigate', 'add')">
					<text class="add-symbol">＋</text>
					<text class="add-text">新增错题</text>
				</view>
				<view class="review-start-button" @click="$emit('navigate', 'today')">
					<image class="review-icon-img" src="/static/icons/review.svg" mode="aspectFit"></image>
					<text class="review-start-text">进入复习</text>
				</view>
			</view>

			<view class="progress-ring-row">
				<view class="progress-ring-item" v-for="(ring, idx) in progressRings" :key="idx">
					<view class="progress-ring-wrap">
						<view class="progress-ring-fill" :style="{ background: ringConic(ring) }"></view>
						<view class="progress-ring-inner">
							<text class="progress-ring-value">{{ ring.current }}</text>
							<text class="progress-ring-slash">/</text>
							<text class="progress-ring-target">{{ ring.target }}</text>
						</view>
					</view>
					<text class="progress-ring-name">{{ ring.name }}</text>
				</view>
			</view>

			<view class="watchlist-entry" @click="$emit('goto-watchlist')">
				<text class="watchlist-entry-title">错题讲解清单</text>
				<text v-if="watchlistPendingCount > 0" class="watchlist-entry-badge">{{ watchlistPendingCount }}</text>
			</view>

			<view class="watchlist-entry knowledge-entry" @click="$emit('goto-knowledge')">
				<text class="watchlist-entry-title">不足知识点</text>
				<text v-if="knowledgePendingCount > 0" class="watchlist-entry-badge">{{ knowledgePendingCount }}</text>
			</view>

			<view class="countdown-card">
				<text class="countdown-label">{{ countdownText }}</text>
				<view class="countdown-num-row">
					<text class="countdown-days">{{ countdownDays }}</text>
					<text class="countdown-unit">天</text>
				</view>
			</view>

			<view class="section-head">
				<text class="section-title">建议优先级</text>
				<text class="section-link" @click="$emit('navigate', 'today')">查看全部</text>
			</view>

			<view v-if="priorityList.length === 0" class="empty-card soft-card">
				<text class="empty-title">今天暂无复习任务</text>
				<text class="empty-sub">新增错题后，系统会从 2 天后开始自动安排复习。</text>
			</view>

			<view
				v-for="item in priorityList"
				:key="item.id"
				:class="priorityCardClass(item)"
				@click="$emit('start-review', item)"
			>
				<view :class="priorityIconClass(item)">
					<text>{{ priorityLabel(item) }}</text>
				</view>
				<view class="priority-copy">
					<text class="priority-title">{{ item.subject }} · {{ item.chapter }}</text>
					<text class="priority-meta">错因：{{ item.errorType }}｜{{ stageLabel(item.reviewStage) }}</text>
				</view>
				<view class="priority-pill">
					<text>{{ formatDueText(item) }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { todayKey, daysBetween } from '@/utils/date.js'
	import {
		getDueMistakes,
		getOverdueMistakes,
		getOverdueDays,
		getStageLabel
	} from '@/utils/review/scheduler.js'

	export default {
		props: {
			mistakes: { type: Array, default: () => [] },
			records: { type: Array, default: () => [] },
			preferences: { type: Object, default: () => ({}) },
			quotesData: { type: Object, default: () => ({}) },
			progressRings: { type: Array, default: () => [] },
			countdownTarget: { type: String, default: '' },
			countdownLabel: { type: String, default: '' },
			watchlistItems: { type: Array, default: () => [] },
			knowledgeItems: { type: Array, default: () => [] }
		},
		emits: ['navigate', 'start-review', 'goto-watchlist', 'goto-knowledge'],
		computed: {
			currentQuote() {
				const data = this.quotesData
				if (!data.quotes || data.quotes.length === 0) return ''
				const days = Math.abs(data.quoteDays || 1)
				const idx = Math.floor(Date.now() / (days * 86400000)) % data.quotes.length
				return data.quotes[idx]
			},
			activeMistakes() {
				return this.mistakes.filter((item) => !item.isArchived)
			},
			totalCount() {
				return this.activeMistakes.length
			},
			dueList() {
				return getDueMistakes(this.activeMistakes, todayKey())
			},
			dueCount() {
				return this.dueList.length
			},
			overdueCount() {
				return getOverdueMistakes(this.activeMistakes, todayKey()).length
			},
			watchlistPendingCount() {
				return this.watchlistItems.filter(item => !item.done).length
			},
			knowledgePendingCount() {
				return this.knowledgeItems.filter(item => !item.done).length
			},
			countdownDays() {
				try {
					const target = new Date(this.countdownTarget + 'T00:00:00')
					const today = new Date()
					today.setHours(0, 0, 0, 0)
					const diff = Math.ceil((target - today) / 86400000)
					return diff >= 0 ? diff : 0
				} catch (e) { return 0 }
			},
			countdownText() {
				return this.countdownLabel || '距离考研还剩下'
			},
			masteredCount() {
				return this.activeMistakes.filter((item) => item.reviewStage === 'pass3' && item.lastReviewResult === 'known').length
			},
			todayCompletedCount() {
				const today = todayKey()
				return this.records.filter(function(r) { return r.reviewDate === today }).length
			},
			dailyGoalTarget() {
				var due = this.dueCount
				var overdue = this.overdueCount
				return Math.max(3, Math.min(30, due + Math.ceil(overdue * 0.2)))
			},
			dailyGoalProgress() {
				return Math.min(this.todayCompletedCount, this.dailyGoalTarget)
			},
			dailyGoalCompleted() {
				return this.todayCompletedCount >= this.dailyGoalTarget
			},
			goalConicGradient() {
				var pct = this.dailyGoalTarget > 0 ? Math.min(100, Math.round(this.todayCompletedCount / this.dailyGoalTarget * 100)) : 0
				return 'conic-gradient(#F59E0B 0% ' + pct + '%, #E7E5E4 ' + pct + '% 100%)'
			},
			priorityList() {
				return this.dueList.slice(0, 3)
			}
		},
		methods: {
			ringConic(ring) {
				const pct = ring.target > 0 ? Math.min(ring.current / ring.target, 1) : 0
				const deg = pct * 360
				if (deg === 0) return '#E7E5E4'
				if (deg >= 360) return '#10B981'
				return 'conic-gradient(#10B981 0deg ' + deg + 'deg, #E7E5E4 ' + deg + 'deg 360deg)'
			},
			priorityLabel(item) {
				if (getOverdueDays(item, todayKey()) >= 2 || (item.totalWrongCount || 0) >= 3) return '高'
				if (getOverdueDays(item, todayKey()) >= 1 || (item.totalWrongCount || 0) >= 1) return '中'
				return '低'
			},
			priorityCardClass(item) {
				const label = this.priorityLabel(item)
				if (label === '高') return 'priority-card priority-high soft-card'
				if (label === '中') return 'priority-card priority-mid soft-card'
				return 'priority-card priority-low soft-card'
			},
			priorityIconClass(item) {
				const label = this.priorityLabel(item)
				if (label === '高') return 'priority-icon priority-icon-high'
				if (label === '中') return 'priority-icon priority-icon-mid'
				return 'priority-icon priority-icon-low'
			},
			formatDueText(item) {
				const overdue = getOverdueDays(item, todayKey())
				if (overdue > 0) return '逾期' + overdue + '天'
				if (item.nextReviewDate === todayKey()) return '今日'
				if (!item.nextReviewDate) return '未安排'
				const diff = daysBetween(item.nextReviewDate, todayKey())
				return diff + '天后'
			},
			stageLabel(stage) {
				return getStageLabel(stage)
			},
			noteText(note) {
				return note || '暂无备注'
			}
		}
	}
</script>
