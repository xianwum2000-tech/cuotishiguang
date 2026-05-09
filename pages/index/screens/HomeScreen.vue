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
	import { todayKey } from '@/utils/date.js'
	import { getDueMistakes, getOverdueMistakes, getOverdueDays, sortMistakesByPriority, getStageLabel } from '@/utils/scheduler.js'

	var TICK_INTERVAL = 60000

	export default {
		name: 'HomeScreen',
		props: {
			mistakes: {
				type: Array,
				default: function () { return [] }
			},
			records: {
				type: Array,
				default: function () { return [] }
			},
			preferences: {
				type: Object,
				default: function () { return {} }
			},
			quotesData: {
				type: Object,
				default: function () { return {} }
			},
			progressRings: {
				type: Array,
				default: function () { return [] }
			},
			countdownTarget: {
				type: String,
				default: ''
			},
			countdownLabel: {
				type: String,
				default: ''
			},
			watchlistItems: {
				type: Array,
				default: function () { return [] }
			}
		},
		emits: ['navigate', 'start-review', 'goto-watchlist'],
		data: function () {
			return {
				_tick: Date.now()
			}
		},
		mounted: function () {
			var self = this
			this._timer = setInterval(function () {
				self._tick = Date.now()
			}, TICK_INTERVAL)
		},
		beforeUnmount: function () {
			if (this._timer) {
				clearInterval(this._timer)
				this._timer = null
			}
		},
		computed: {
			currentDate: function () {
				void this._tick
				return todayKey()
			},
			currentQuote: function () {
				void this._tick
				var qd = this.quotesData
				var list = qd && qd.quotes ? qd.quotes : []
				if (list.length === 0) return '每一步都算数，慢慢来比较快。'
				var days = Math.abs(qd.quoteDays || 1)
				var idx = Math.floor(Date.now() / (days * 86400000)) % list.length
				return list[idx]
			},
			activeMistakes: function () {
				return this.mistakes.filter(function (item) { return !item.isArchived })
			},
			totalCount: function () {
				return this.activeMistakes.length
			},
			dueList: function () {
				return getDueMistakes(this.activeMistakes, this.currentDate)
			},
			dueCount: function () {
				return this.dueList.length
			},
			overdueCount: function () {
				return getOverdueMistakes(this.activeMistakes, this.currentDate).length
			},
			watchlistPendingCount: function () {
				return this.watchlistItems.filter(function (item) { return !item.done }).length
			},
			countdownDays: function () {
				void this._tick
				if (!this.countdownTarget) return '--'
				var targetDate = new Date(this.countdownTarget.replace(/-/g, '/'))
				var today = new Date()
				today.setHours(0, 0, 0, 0)
				var diff = Math.ceil((targetDate.getTime() - today.getTime()) / 86400000)
				return diff >= 0 ? diff : 0
			},
			countdownText: function () {
				return this.countdownLabel || '距离考研还剩下'
			},
			priorityList: function () {
				return this.dueList.slice(0, 3)
			}
		},
		methods: {
			ringConic: function (ring) {
				var pct = ring.target > 0 ? Math.min(100, Math.round(ring.current / ring.target * 100)) : 0
				return 'conic-gradient(#F59E0B 0% ' + pct + '%, #E7E5E4 ' + pct + '% 100%)'
			},
			priorityLabel: function (item) {
				var overdue = getOverdueDays(item, this.currentDate)
				var wrong = item.totalWrongCount || 0
				if (overdue > 5 || wrong > 2) return '高'
				if (overdue > 0 || wrong > 0) return '中'
				return '低'
			},
			priorityCardClass: function (item) {
				var label = this.priorityLabel(item)
				if (label === '高') return 'priority-card priority-high'
				if (label === '中') return 'priority-card priority-mid'
				return 'priority-card priority-low'
			},
			priorityIconClass: function (item) {
				var label = this.priorityLabel(item)
				if (label === '高') return 'priority-icon priority-icon-high'
				if (label === '中') return 'priority-icon priority-icon-mid'
				return 'priority-icon priority-icon-low'
			},
			formatDueText: function (item) {
				var overdue = getOverdueDays(item, this.currentDate)
				if (overdue > 0) return '逾期 ' + overdue + ' 天'
				if (overdue === 0) return '今天'
				return Math.abs(overdue) + '天后'
			},
			stageLabel: function (stage) {
				return getStageLabel(stage)
			},
			noteText: function (note) {
				return note || '暂无备注'
			}
		}
	}
</script>

<style>
	/* ---- Home Content ---- */
	.home-content {
		padding: 14px 16px;
	}

	.greeting-block {
		margin-bottom: 14px;
	}

	.home-title {
		font-size: 22px;
		font-weight: 700;
		color: #292524;
		display: block;
	}

	.home-subtitle {
		font-size: 13px;
		color: #A8A29E;
		margin-top: 4px;
		display: block;
	}

	/* ---- Status Grid ---- */
	.status-grid {
		display: flex;
		gap: 10px;
		margin-bottom: 14px;
	}

	.stat-card {
		flex: 1;
		border-radius: 14px;
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.stat-primary {
		background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);
	}

	.stat-surface {
		background: #FFFFFF;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}

	.stat-middle {
		cursor: pointer;
	}

	.stat-label {
		font-size: 12px;
		font-weight: 500;
	}

	.stat-label-light {
		color: rgba(255, 255, 255, 0.85);
	}

	.stat-label-red {
		color: #EF4444;
	}

	.stat-label-muted {
		color: #A8A29E;
	}

	.stat-number {
		font-size: 24px;
		font-weight: 700;
	}

	.stat-number-light {
		color: #FFFFFF;
	}

	.stat-number-red {
		color: #EF4444;
	}

	.stat-number-dark {
		color: #292524;
	}

	/* ---- Study Actions ---- */
	.study-actions {
		display: flex;
		gap: 12px;
		margin-bottom: 14px;
	}

	.add-mistake-button {
		flex: 1;
		background: #FFFFFF;
		border: 1px dashed #D6D3D1;
		border-radius: 14px;
		padding: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		cursor: pointer;
	}

	.add-symbol {
		font-size: 18px;
		color: #F59E0B;
		font-weight: 600;
		line-height: 1;
	}

	.add-text {
		font-size: 14px;
		color: #57534E;
		font-weight: 500;
	}

	.review-start-button {
		flex: 1;
		background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
		border-radius: 14px;
		padding: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		cursor: pointer;
		box-shadow: 0 2px 6px rgba(245, 158, 11, 0.24);
	}

	.review-icon-img {
		width: 18px;
		height: 18px;
	}

	.review-start-text {
		font-size: 14px;
		color: #FFFFFF;
		font-weight: 600;
	}

	/* ---- Progress Rings ---- */
	.progress-ring-row {
		display: flex;
		justify-content: space-around;
		gap: 10px;
		margin-bottom: 14px;
	}

	.progress-ring-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}

	.progress-ring-wrap {
		position: relative;
		width: 56px;
		height: 56px;
		border-radius: 50%;
	}

	.progress-ring-fill {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.progress-ring-inner {
		position: absolute;
		top: 4px;
		left: 4px;
		right: 4px;
		bottom: 4px;
		border-radius: 50%;
		background: #FEF9F0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1px;
	}

	.progress-ring-value {
		font-size: 14px;
		font-weight: 700;
		color: #292524;
	}

	.progress-ring-slash {
		font-size: 11px;
		color: #A8A29E;
	}

	.progress-ring-target {
		font-size: 12px;
		color: #A8A29E;
	}

	.progress-ring-name {
		font-size: 12px;
		color: #57534E;
		font-weight: 500;
	}

	/* ---- Watchlist Entry ---- */
	.watchlist-entry {
		background: #FFFFFF;
		border-radius: 14px;
		padding: 14px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
		margin-bottom: 10px;
	}

	.watchlist-entry-title {
		font-size: 14px;
		font-weight: 600;
		color: #292524;
	}

	.watchlist-entry-badge {
		background: #FEF2F2;
		color: #EF4444;
		font-size: 12px;
		font-weight: 600;
		padding: 2px 10px;
		border-radius: 10px;
	}

	/* ---- Countdown Card ---- */
	.countdown-card {
		background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
		border-radius: 14px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		margin-bottom: 14px;
	}

	.countdown-label {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.85);
	}

	.countdown-num-row {
		display: flex;
		align-items: baseline;
		gap: 6px;
	}

	.countdown-days {
		font-size: 36px;
		font-weight: 800;
		color: #FFFFFF;
		font-family: 'Lexend', -apple-system, 'PingFang SC', sans-serif;
	}

	.countdown-unit {
		font-size: 16px;
		color: rgba(255, 255, 255, 0.75);
		font-weight: 500;
	}

	/* ---- Priority Cards ---- */
	.priority-card {
		background: #FFFFFF;
		border-radius: 14px;
		padding: 12px;
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
		margin-bottom: 8px;
	}

	.priority-high {
		border-left: 4px solid #EF4444;
	}

	.priority-mid {
		border-left: 4px solid #F59E0B;
	}

	.priority-low {
		border-left: 4px solid #10B981;
	}

	.priority-icon {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.priority-icon-high {
		background: #FEF2F2;
	}

	.priority-icon-high text {
		font-size: 12px;
		font-weight: 700;
		color: #EF4444;
	}

	.priority-icon-mid {
		background: #FFF7ED;
	}

	.priority-icon-mid text {
		font-size: 12px;
		font-weight: 700;
		color: #F59E0B;
	}

	.priority-icon-low {
		background: #ECFDF5;
	}

	.priority-icon-low text {
		font-size: 12px;
		font-weight: 700;
		color: #10B981;
	}

	.priority-copy {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.priority-title {
		font-size: 13px;
		font-weight: 600;
		color: #292524;
	}

	.priority-meta {
		font-size: 11px;
		color: #A8A29E;
	}

	.priority-pill {
		background: #FAFAF9;
		border-radius: 10px;
		padding: 4px 10px;
		flex-shrink: 0;
	}

	.priority-pill text {
		font-size: 11px;
		color: #78716C;
		font-weight: 500;
	}
</style>
