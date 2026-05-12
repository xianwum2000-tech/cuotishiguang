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
		</view>
	</view>
</template>

<script>
	import { todayKey, addDays } from '@/utils/date.js'
	import { getDueMistakes } from '@/utils/review/scheduler.js'

	export default {
		name: 'StatsScreen',
		props: {
			mistakes: {
				type: Array,
				default: function () {
					return []
				}
			},
			records: {
				type: Array,
				default: function () {
					return []
				}
			},
			preferences: {
				type: Object,
				default: function () {
					return {}
				}
			},
			appVersion: {
				type: Object,
				default: function () {
					return { name: '', code: 0 }
				}
			},
			updateConfigured: {
				type: Boolean,
				default: false
			},
			updateChecking: {
				type: Boolean,
				default: false
			},
			updateDownloading: {
				type: Boolean,
				default: false
			},
			updateProgress: {
				type: Number,
				default: 0
			},
			latestVersion: {
				type: Object,
				default: function () {
					return { versionName: '', versionCode: 0, apkUrl: '', changelog: '', force: false }
				}
			}
		},
		emits: ['navigate', 'check-update', 'install-update'],
		computed: {
			currentDate: function () {
				return todayKey()
			},
			activeMistakes: function () {
				return this.mistakes.filter(function (item) {
					return !item.isArchived
				})
			},
			totalCount: function () {
				return this.activeMistakes.length
			},
			dueCount: function () {
				return getDueMistakes(this.activeMistakes, this.currentDate).length
			},
			masteredCount: function () {
				return this.activeMistakes.filter(function (item) {
					return item.reviewStage === 'pass3' && item.lastReviewResult === 'known'
				}).length
			},
			weeklyBars: function () {
				var self = this
				var today = todayKey()
				var bars = []
				for (var i = 6; i >= 0; i--) {
					var dateKey = addDays(today, -i)
					var parts = dateKey.split('-')
					var label = parseInt(parts[1], 10) + '/' + parseInt(parts[2], 10)
					var count = self.records.filter(function (r) {
						return r.reviewDate === dateKey
					}).length
					bars.push({ date: dateKey, label: label, count: count })
				}
				return bars
			},
			chapterStats: function () {
				return this.buildDistribution('chapter')
			},
			errorStats: function () {
				return this.buildDistribution('errorType')
			},
			updateSourceText: function () {
				return this.updateConfigured ? 'GitHub Releases' : '未配置 GitHub 仓库'
			},
			updateProgressStyle: function () {
				return 'width: ' + this.updateProgress + '%'
			}
		},
		methods: {
			buildDistribution: function (field) {
				var self = this
				var tally = {}
				self.activeMistakes.forEach(function (item) {
					var key = item[field] || '未分类'
					if (!tally[key]) {
						tally[key] = 0
					}
					tally[key]++
				})
				var result = Object.keys(tally).map(function (name) {
					return { name: name, count: tally[name] }
				})
				result.sort(function (a, b) {
					return b.count - a.count
				})
				return result
			},
			barHeightStyle: function (bar) {
				var maxCount = 0
				var bars = this.weeklyBars
				for (var i = 0; i < bars.length; i++) {
					if (bars[i].count > maxCount) {
						maxCount = bars[i].count
					}
				}
				if (maxCount === 0) {
					return 'height: 4px'
				}
				var h = Math.max(4, (bar.count / maxCount) * 60)
				return 'height: ' + Math.round(h) + 'px'
			},
			distWidthStyle: function (item) {
				var maxCount = 1
				var allStats = this.chapterStats.concat(this.errorStats)
				for (var i = 0; i < allStats.length; i++) {
					if (allStats[i].count > maxCount) {
						maxCount = allStats[i].count
					}
				}
				return 'width: ' + Math.round((item.count / maxCount) * 100) + '%'
			}
		}
	}
</script>

<style>
	.stats-content {
		padding: 14px 16px;
	}

	.user-hero-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 24px 14px 18px;
	}

	.user-avatar-ring {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 3px solid #E8DFD2;
		padding: 3px;
		background: #FFFFFF;
		margin-bottom: 12px;
	}

	.user-avatar-large {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
	}

	.user-display-name {
		font-size: 17px;
		font-weight: 700;
		color: #292524;
		margin-bottom: 4px;
	}

	.user-slogan {
		font-size: 12px;
		color: #A8A29E;
		margin-bottom: 16px;
	}

	.user-stat-trio {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		width: 100%;
	}

	.user-stat-cell {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}

	.user-stat-divider {
		width: 1px;
		height: 32px;
		background: #E7E5E4;
	}

	.user-stat-num {
		font-size: 20px;
		font-weight: 700;
		color: #292524;
	}

	.user-stat-label {
		font-size: 11px;
		color: #A8A29E;
	}

	.insight-card {
		margin-bottom: 10px;
	}

	.weekly-card {
		padding: 14px;
	}

	.weekly-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 14px;
	}

	.weekly-title {
		font-size: 14px;
		font-weight: 600;
		color: #44403C;
	}

	.weekly-sub {
		font-size: 11px;
		color: #A8A29E;
		margin-top: 2px;
	}

	.weekly-total {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.weekly-total-number {
		font-size: 22px;
		font-weight: 700;
		color: #292524;
	}

	.weekly-total-label {
		font-size: 11px;
		color: #A8A29E;
	}

	.bars-row {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 4px;
		height: 100px;
	}

	.bar-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		gap: 6px;
	}

	.bar-col text {
		font-size: 10px;
		color: #A8A29E;
	}

	.bar-fill {
		width: 100%;
		max-width: 32px;
		background: linear-gradient(180deg, #F59E0B 0%, #F97316 100%);
		border-radius: 6px 6px 2px 2px;
		min-height: 4px;
	}

	.dist-line {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 8px;
	}

	.dist-name {
		font-size: 12px;
		color: #57534E;
		width: 56px;
		flex-shrink: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.dist-track {
		flex: 1;
		height: 8px;
		background: #F5F0EB;
		border-radius: 4px;
		overflow: hidden;
	}

	.dist-fill {
		height: 100%;
		background: linear-gradient(90deg, #F59E0B, #F97316);
		border-radius: 4px;
	}

	.dist-fill-red {
		background: linear-gradient(90deg, #EF4444, #DC2626);
	}

	.dist-count {
		font-size: 12px;
		font-weight: 600;
		color: #44403C;
		width: 24px;
		text-align: right;
		flex-shrink: 0;
	}

	.version-card {
		padding: 14px;
	}

	.version-source {
		font-size: 11px;
		color: #A8A29E;
		margin-top: 2px;
	}

	.version-update-hint {
		margin-top: 10px;
		padding: 12px;
		background: #FFFBEB;
		border-radius: 10px;
		border: 1px solid #FDE68A;
	}

	.version-new-label {
		font-size: 14px;
		font-weight: 600;
		color: #D97706;
	}

	.version-changelog {
		font-size: 12px;
		color: #78716C;
		margin-top: 4px;
		display: block;
	}

	.download-status {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 8px;
	}

	.download-percent {
		font-size: 13px;
		font-weight: 600;
		color: #D97706;
	}

	.profile-line {
		font-size: 13px;
		color: #57534E;
		display: block;
		margin-top: 2px;
	}
</style>
