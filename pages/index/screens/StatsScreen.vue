<template>
	<view class="screen screen-lilac">
		<view class="topbar compact-topbar">
			<view class="brand-row">
				<view class="avatar small-avatar">
					<image class="avatar-img" :src="preferences.homeAvatar" mode="aspectFill"></image>
				</view>
				<text class="brand-title small-brand">{{ preferences.statsName }}</text>
			</view>
			<text class="gear small-gear" @click="$emit('navigate', 'settings')">⚙</text>
		</view>

		<view class="page-content stats-content">
			<view class="user-hero-card soft-card">
				<view class="user-avatar-ring">
					<image class="user-avatar-large" :src="preferences.homeAvatar" mode="aspectFill"></image>
				</view>
				<text class="user-display-name">{{ preferences.statsName }}</text>
				<text class="user-slogan">考研数学 · 错题复习记录</text>
				<view class="user-stat-trio">
					<view class="user-stat-cell">
						<text class="user-stat-num">{{ totalCount }}</text>
						<text class="user-stat-label">总错题</text>
					</view>
					<view class="user-stat-divider"></view>
					<view class="user-stat-cell">
						<text class="user-stat-num">{{ dueCount }}</text>
						<text class="user-stat-label">待复习</text>
					</view>
					<view class="user-stat-divider"></view>
					<view class="user-stat-cell">
						<text class="user-stat-num">{{ masteredCount }}</text>
						<text class="user-stat-label">已掌握</text>
					</view>
				</view>
			</view>

			<view class="insight-card soft-card weekly-card">
				<view class="weekly-head">
					<view>
						<text class="weekly-title">最近7天复习情况</text>
						<text class="weekly-sub">每天完成后会写入本地复习记录。</text>
					</view>
					<view class="weekly-total">
						<text class="weekly-total-number">{{ records.length }}</text>
						<text class="weekly-total-label">累计记录</text>
					</view>
				</view>
				<view class="bars-row">
					<view v-for="bar in weeklyBars" :key="bar.date" class="bar-col">
						<view class="bar-fill" :style="barHeightStyle(bar)"></view>
						<text>{{ bar.label }}</text>
					</view>
				</view>
			</view>

			<view class="insight-card soft-card">
				<text class="section-title">各章节错题分布</text>
				<view v-for="item in chapterStats" :key="item.name" class="dist-line">
					<text class="dist-name">{{ item.name }}</text>
					<view class="dist-track"><view class="dist-fill" :style="distWidthStyle(item)"></view></view>
					<text class="dist-count">{{ item.count }}</text>
				</view>
			</view>

			<view class="insight-card soft-card">
				<text class="section-title">各错因分布</text>
				<view v-for="item in errorStats" :key="item.name" class="dist-line">
					<text class="dist-name">{{ item.name }}</text>
					<view class="dist-track"><view class="dist-fill dist-fill-red" :style="distWidthStyle(item)"></view></view>
					<text class="dist-count">{{ item.count }}</text>
				</view>
			</view>

			<view class="insight-card soft-card version-card">
				<text class="section-title">版本更新</text>
				<text class="profile-line">当前版本 {{ appVersion.name }}（{{ appVersion.code }}）</text>
				<text class="profile-line version-source">更新源：{{ updateSourceText }}</text>
				<view v-if="latestVersion.versionCode > appVersion.code" class="version-update-hint">
					<text class="version-new-label">发现新版 {{ latestVersion.versionName }}</text>
					<text class="version-changelog">{{ latestVersion.changelog || '暂无更新说明' }}</text>
					<view class="secondary-button" @click="$emit('install-update', latestVersion)" v-if="!updateDownloading">
						<text>下载并安装</text>
					</view>
					<view v-if="updateDownloading" class="download-status">
						<view class="progress-track"><view class="progress-fill" :style="updateProgressStyle"></view></view>
						<text class="download-percent">{{ updateProgress }}%</text>
					</view>
				</view>
				<view class="secondary-button" @click="$emit('check-update', false)" v-if="!updateDownloading && latestVersion.versionCode <= appVersion.code">
					<text>{{ updateChecking ? '检查中...' : '检查更新' }}</text>
				</view>
			</view>

			<view class="save-button" @click="$emit('goto-review-report')" style="margin-top: 14px; margin-bottom: 20px;">
				<text>查看复盘报告</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { todayKey, addDays } from '@/utils/date.js'
	import { getDueMistakes } from '@/utils/review/scheduler.js'

	export default {
		props: {
			mistakes: { type: Array, default: () => [] },
			records: { type: Array, default: () => [] },
			preferences: { type: Object, default: () => ({}) },
			appVersion: { type: Object, default: () => ({}) },
			updateConfigured: { type: Boolean, default: false },
			updateChecking: { type: Boolean, default: false },
			updateDownloading: { type: Boolean, default: false },
			updateProgress: { type: Number, default: 0 },
			latestVersion: { type: Object, default: () => ({}) }
		},
		emits: ['navigate', 'check-update', 'install-update', 'goto-review-report'],
		computed: {
			activeMistakes() {
				return this.mistakes.filter((item) => !item.isArchived)
			},
			totalCount() {
				return this.activeMistakes.length
			},
			dueCount() {
				return getDueMistakes(this.activeMistakes, todayKey()).length
			},
			masteredCount() {
				return this.activeMistakes.filter((item) => item.reviewStage === 'pass3' && item.lastReviewResult === 'known').length
			},
			weeklyBars() {
				const bars = []
				const labels = ['一', '二', '三', '四', '五', '六', '日']
				for (let index = 6; index >= 0; index--) {
					const date = addDays(todayKey(), -index)
					const count = this.records.filter((record) => record.reviewDate === date).length
					const day = new Date(date).getDay()
					bars.push({
						date,
						count,
						label: labels[day === 0 ? 6 : day - 1],
						height: Math.max(8, Math.min(96, count * 18))
					})
				}
				return bars
			},
			chapterStats() {
				return this.buildDistribution('chapter')
			},
			errorStats() {
				return this.buildDistribution('errorType')
			},
			updateSourceText() {
				return this.updateConfigured ? 'GitHub Releases' : '未配置 GitHub 仓库'
			},
			updateProgressStyle() {
				return 'width: ' + this.updateProgress + '%'
			}
		},
		methods: {
			buildDistribution(field) {
				const map = {}
				this.activeMistakes.forEach((item) => {
					const key = item[field] || '未分类'
					map[key] = (map[key] || 0) + 1
				})
				const max = Math.max(1, ...Object.keys(map).map((key) => map[key]))
				return Object.keys(map).map((key) => ({
					name: key,
					count: map[key],
					percent: Math.max(8, Math.round((map[key] / max) * 100))
				}))
			},
			barHeightStyle(bar) {
				return 'height: ' + bar.height + 'px'
			},
			distWidthStyle(item) {
				return 'width: ' + item.percent + '%'
			}
		}
	}
</script>
