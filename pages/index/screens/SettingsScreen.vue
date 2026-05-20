<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<view class="brand-row">
				<view class="back-button" @click="$emit('navigate', 'back')"><text>‹</text></view>
				<text class="brand-title small-brand">首页设置</text>
			</view>
			<text class="gear small-gear" @click="saveHomeSettings">保存</text>
		</view>

		<view class="page-content settings-content">
			<view class="page-heading">
				<text class="page-title">自定义首页文案</text>
				<text class="page-subtitle">只影响本机显示，离线保存在本地。</text>
			</view>

			<view class="settings-card soft-card">
				<text class="field-label">首页头像</text>
				<view class="settings-avatar-row" @click="chooseHomeAvatar">
					<view class="settings-avatar avatar-ring">
						<image class="avatar-img" :src="settingsForm.homeAvatar" mode="aspectFill"></image>
					</view>
					<view class="settings-avatar-copy">
						<text class="settings-avatar-title">点击上传头像</text>
						<text class="settings-avatar-sub">支持相册或拍照，保存后首页生效</text>
					</view>
				</view>

				<text class="field-label">顶部标题</text>
				<input class="settings-input" v-model="settingsForm.homeTitle" placeholder="例如：复习达人" />

				<text class="field-label field-space">首页问候语</text>
				<input class="settings-input" v-model="settingsForm.greetingTitle" placeholder="例如：早上好，小明" />

				<text class="field-label field-space">统计页姓名</text>
				<input class="settings-input" v-model="settingsForm.statsName" placeholder="例如：小明" />
			</view>

			<view class="settings-preview soft-card">
				<text class="preview-label">预览</text>
				<view class="preview-brand-row">
					<view class="avatar avatar-ring">
						<image class="avatar-img" :src="settingsForm.homeAvatar" mode="aspectFill"></image>
					</view>
					<text class="brand-title preview-brand">{{ previewHomeTitle }}</text>
				</view>
				<text class="home-title preview-greeting">{{ previewGreetingTitle }}</text>
				<text class="home-subtitle">{{ currentQuote }}</text>
				<text class="preview-stats-title">{{ previewStatsName }}的学习洞察</text>
			</view>

			<view class="save-button" @click="saveHomeSettings">
				<text>保存设置</text>
			</view>
			<view class="secondary-button" @click="$emit('navigate', 'quotes-settings')">
				<text>名句设置</text>
			</view>
			<view class="secondary-button" @click="resetHomeSettings">
				<text>恢复默认</text>
			</view>
			<view class="danger-button" @click="$emit('reset-ai-data')">
				<text>重置 AI 数据</text>
			</view>

			<view class="settings-card soft-card" style="margin-top: 20px;">
				<text class="field-label">每日目标</text>
				<text class="page-subtitle" style="margin-bottom: 14px;">设置每天的复习目标数量。</text>
				<view class="goal-mode-row">
					<view :class="dailyGoalModeLocal === 'dynamic' ? 'goal-mode-btn goal-mode-active' : 'goal-mode-btn'" @click="dailyGoalModeLocal = 'dynamic'">
						<text>动态推荐</text>
					</view>
					<view :class="dailyGoalModeLocal === 'fixed' ? 'goal-mode-btn goal-mode-active' : 'goal-mode-btn'" @click="dailyGoalModeLocal = 'fixed'">
						<text>固定数量</text>
					</view>
				</view>
				<view v-if="dailyGoalModeLocal === 'fixed'" style="margin-top: 12px;">
					<text class="field-label">固定目标数（3-30）</text>
					<input class="settings-input" v-model.number="dailyGoalFixedLocal" type="number" placeholder="10" />
				</view>
				<text v-if="dailyGoalModeLocal === 'dynamic'" class="page-subtitle" style="margin-top: 10px;">
					动态模式：根据今日到期数和逾期数自动计算，当前推荐 {{ dailyGoalTarget }} 道。
				</text>
			</view>

			<view class="settings-card soft-card" style="margin-top: 20px;">
				<text class="field-label">AI 识别配置</text>
				<text class="page-subtitle" style="margin-bottom: 14px;">配置通义千问 VL 用于错题图片识别。</text>
				<text class="field-label">通义千问 API Key</text>
				<input class="settings-input" v-model="ocrApiKeyLocal" placeholder="sk-..." :password="!showOcrKey" />
				<view class="ocr-key-toggle" @click="showOcrKey = !showOcrKey">
					<text>{{ showOcrKey ? '隐藏' : '显示' }}</text>
				</view>
				<text class="field-label field-space">模型</text>
				<view class="chip-row">
					<view :class="ocrModelLocal === 'qwen-vl-plus' ? 'subject-chip subject-active' : 'subject-chip'" @click="ocrModelLocal = 'qwen-vl-plus'">
						<text>Plus（便宜）</text>
					</view>
					<view :class="ocrModelLocal === 'qwen-vl-max' ? 'subject-chip subject-active' : 'subject-chip'" @click="ocrModelLocal = 'qwen-vl-max'">
						<text>Max（精准）</text>
					</view>
				</view>
				<view class="secondary-button" @click="testOcrKey" style="margin-top: 12px;">
					<text>{{ ocrTesting ? '测试中...' : '测试连接' }}</text>
				</view>
				<text v-if="ocrTestResult" class="ocr-test-result" :class="ocrTestOk ? 'ocr-test-ok' : 'ocr-test-fail'">{{ ocrTestResult }}</text>
			</view>

			<view class="settings-card soft-card" style="margin-top: 20px;">
				<text class="field-label">云同步</text>
				<text class="page-subtitle" style="margin-bottom: 14px;">通过 GitHub 仓库备份和恢复数据（Data/backup.json）。</text>
				<text class="field-label">GitHub Token</text>
				<input class="settings-input" v-model="githubTokenLocal" placeholder="ghp_..." :password="!showGithubToken" />
				<view class="ocr-key-toggle" @click="showGithubToken = !showGithubToken">
					<text>{{ showGithubToken ? '隐藏' : '显示' }}</text>
				</view>
				<view class="secondary-button" @click="testGithub" style="margin-top: 6px;">
					<text>{{ githubTesting ? '测试中...' : '测试连接' }}</text>
				</view>
				<text v-if="githubTestResult" class="ocr-test-result" :class="githubTestOk ? 'ocr-test-ok' : 'ocr-test-fail'">{{ githubTestResult }}</text>
				<view style="margin-top: 16px;">
					<view class="save-button" @click="doBackup">
						<text>{{ syncLoading === 'backup' ? '备份中...' : '备份到 GitHub' }}</text>
					</view>
					<text v-if="lastBackupTime" class="sync-last-time">上次备份：{{ lastBackupTime }}</text>
				</view>
				<view style="margin-top: 12px;">
					<view class="secondary-button" @click="doRestore">
						<text>{{ syncLoading === 'restore' ? '恢复中...' : '从 GitHub 恢复' }}</text>
					</view>
				</view>
			</view>

			<view class="settings-card soft-card" style="margin-top: 20px;">
				<text class="field-label">倒计时设置</text>
				<text class="page-subtitle" style="margin-bottom: 14px;">首页倒计时的目标日期和显示文字。</text>
				<text class="field-label field-space">显示文字</text>
				<input class="settings-input" v-model="countdownLabelLocal" placeholder="例如：距离27年考研还剩下" />
				<text class="field-label field-space">目标日期</text>
				<input class="settings-input" v-model="countdownTargetLocal" placeholder="例如：2027-12-25" />
				<text class="field-label field-space" style="font-size: 12px; color: #A8A29E; margin-top: 6px;">格式：YYYY-MM-DD，当前倒计时 {{ countdownDays }} 天</text>
			</view>
			<view class="save-button" @click="saveCountdown" style="margin-top: 12px;">
				<text>保存倒计时</text>
			</view>

			<view class="settings-card soft-card" style="margin-top: 20px;">
				<text class="field-label">学习进度圆环</text>
				<text class="page-subtitle" style="margin-bottom: 14px;">设置三个进度圆环的名称、当前值和目标值。</text>
				<view v-for="(ring, idx) in progressRingsLocal" :key="idx" class="goal-section">
					<text class="field-label field-space">圆环 {{ idx + 1 }}</text>
					<view class="goal-row">
						<text class="goal-label">名称</text>
						<input class="settings-input goal-input" v-model="ring.name" placeholder="例如：高数" />
					</view>
					<view class="goal-row">
						<text class="goal-label">当前值</text>
						<input class="settings-input goal-input" type="number" v-model.number="ring.current" placeholder="0" />
					</view>
					<view class="goal-row">
						<text class="goal-label">目标值</text>
						<input class="settings-input goal-input" type="number" v-model.number="ring.target" placeholder="10" />
					</view>
				</view>
			</view>
			<view class="save-button" @click="saveProgressRings" style="margin-top: 12px;">
				<text>保存学习进度</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { getPreferences, savePreferences, saveQuotes } from '@/utils/storage/storage.js'
	import { persistImageFile } from '@/utils/file.js'
	import { getUpdateRuntimeInfo } from '@/utils/app/updater.js'
	import { testOcrApiKey } from '@/utils/ai/ocr.js'
	import { testGitHubToken, backupToRepo, restoreFromRepo } from '@/utils/sync/sync.js'

	function createDefaultPreferences() {
		return {
			homeTitle: '复习达人',
			greetingTitle: '早上好，小明',
			homeAvatar: '/static/stitch_assets/avatar-home.jpg',
			statsName: '小明'
		}
	}

	export default {
		props: {
			preferences: { type: Object, default: createDefaultPreferences },
			countdownTarget: { type: String, default: '2027-12-25' },
			countdownLabel: { type: String, default: '距离27年考研还剩下' },
			progressRings: {
				type: Array,
				default: function() {
					return [
						{ name: '高数', current: 0, target: 10 },
						{ name: '线代', current: 0, target: 10 },
						{ name: '概率', current: 0, target: 10 }
					]
				}
			},
			dailyGoalMode: { type: String, default: 'dynamic' },
			dailyGoalFixed: { type: Number, default: 10 },
			ocrApiKey: { type: String, default: '' },
			ocrModel: { type: String, default: 'qwen-vl-plus' },
			githubToken: { type: String, default: '' },
			dailyGoalTarget: { type: Number, default: 10 },
			quotesData: {
				type: Object,
				default: function() { return { quotes: [], quoteDays: 1 } }
			}
		},
		emits: [
			'navigate',
			'save-settings',
			'save-countdown',
			'save-progress-rings',
			'reset-settings',
			'test-ocr-key',
			'test-github-token',
			'backup',
			'restore',
			'reset-ai-data'
		],
		data() {
			return {
				settingsForm: {
					homeTitle: this.preferences.homeTitle || '',
					greetingTitle: this.preferences.greetingTitle || '',
					homeAvatar: this.preferences.homeAvatar || '',
					statsName: this.preferences.statsName || ''
				},
				countdownTargetLocal: this.countdownTarget,
				countdownLabelLocal: this.countdownLabel,
				progressRingsLocal: JSON.parse(JSON.stringify(this.progressRings)),
				dailyGoalModeLocal: this.dailyGoalMode,
				dailyGoalFixedLocal: this.dailyGoalFixed,
				ocrApiKeyLocal: this.ocrApiKey,
				ocrModelLocal: this.ocrModel,
				githubTokenLocal: this.githubToken,
				showOcrKey: false,
				ocrTesting: false,
				ocrTestResult: '',
				ocrTestOk: false,
				showGithubToken: false,
				githubTesting: false,
				githubTestResult: '',
				githubTestOk: false,
				lastBackupTime: uni.getStorageSync('mistake_scheduler_last_backup') || '',
				syncLoading: ''
			}
		},
		computed: {
			previewHomeTitle() {
				return this.settingsForm.homeTitle || '复习达人'
			},
			previewGreetingTitle() {
				return this.settingsForm.greetingTitle || '早上好，小明'
			},
			previewStatsName() {
				return this.settingsForm.statsName || '小明'
			},
			currentQuote() {
				const data = this.quotesData
				if (!data.quotes || data.quotes.length === 0) return ''
				const days = Math.abs(data.quoteDays || 1)
				const idx = Math.floor(Date.now() / (days * 86400000)) % data.quotes.length
				return data.quotes[idx]
			},
			countdownDays() {
				try {
					const target = new Date(this.countdownTargetLocal + 'T00:00:00')
					const today = new Date()
					today.setHours(0, 0, 0, 0)
					const diff = Math.ceil((target - today) / 86400000)
					return diff >= 0 ? diff : 0
				} catch (e) { return 0 }
			}
		},
		watch: {
			preferences: {
				handler(val) {
					this.settingsForm = {
						homeTitle: val.homeTitle || '',
						greetingTitle: val.greetingTitle || '',
						homeAvatar: val.homeAvatar || '',
						statsName: val.statsName || ''
					}
				},
				deep: true
			},
			countdownTarget(val) {
				this.countdownTargetLocal = val
			},
			countdownLabel(val) {
				this.countdownLabelLocal = val
			},
			progressRings: {
				handler(val) {
					this.progressRingsLocal = JSON.parse(JSON.stringify(val))
				},
				deep: true
			},
			dailyGoalMode(val) {
				this.dailyGoalModeLocal = val
			},
			dailyGoalFixed(val) {
				this.dailyGoalFixedLocal = val
			},
			ocrApiKey(val) {
				this.ocrApiKeyLocal = val
			},
			ocrModel(val) {
				this.ocrModelLocal = val
			},
			githubToken(val) {
				this.githubTokenLocal = val
			}
		},
		methods: {
			chooseHomeAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async (res) => {
						if (!res.tempFilePaths || res.tempFilePaths.length === 0) return
						const tempFilePath = res.tempFilePaths[0]
						const output = await persistImageFile(tempFilePath)
						this.settingsForm.homeAvatar = output.path
					}
				})
			},
			saveHomeSettings() {
				const homeTitle = this.settingsForm.homeTitle.trim()
				const greetingTitle = this.settingsForm.greetingTitle.trim()
				const statsName = this.settingsForm.statsName.trim()
				if (!homeTitle || !greetingTitle || !statsName) {
					uni.showToast({ title: '标题、问候语和统计页姓名不能为空', icon: 'none' })
					return
				}
				const defaults = createDefaultPreferences()
				this.$emit('save-settings', {
					homeTitle,
					greetingTitle,
					homeAvatar: this.settingsForm.homeAvatar || defaults.homeAvatar,
					statsName,
					dailyGoalMode: this.dailyGoalModeLocal,
					dailyGoalFixed: parseInt(this.dailyGoalFixedLocal) || 10,
					ocrApiKey: this.ocrApiKeyLocal,
					ocrModel: this.ocrModelLocal,
					githubToken: this.githubTokenLocal
				})
			},
			saveCountdown() {
				this.$emit('save-countdown', this.countdownTargetLocal, this.countdownLabelLocal)
			},
			saveProgressRings() {
				this.$emit('save-progress-rings', JSON.parse(JSON.stringify(this.progressRingsLocal)))
			},
			resetHomeSettings() {
				this.$emit('reset-settings')
			},
			async testOcrKey() {
				this.ocrTesting = true
				this.ocrTestResult = ''
				var result = await testOcrApiKey(this.ocrApiKeyLocal)
				this.ocrTesting = false
				this.ocrTestOk = result.success
				this.ocrTestResult = result.success ? '连接成功！' : result.error
				this.$emit('test-ocr-key', this.ocrApiKeyLocal)
			},
			async testGithub() {
				this.githubTesting = true
				this.githubTestResult = ''
				var result = await testGitHubToken(this.githubTokenLocal)
				this.githubTesting = false
				this.githubTestOk = result.success
				this.githubTestResult = result.success ? '连接成功！' : result.error
				this.$emit('test-github-token', this.githubTokenLocal)
			},
			async doBackup() {
				this.syncLoading = 'backup'
				var result = await backupToRepo()
				this.syncLoading = ''
				if (result.success) {
					this.lastBackupTime = result.time
					uni.showToast({ title: '备份成功', icon: 'success' })
				} else {
					uni.showToast({ title: '备份失败：' + result.error, icon: 'none' })
				}
				this.$emit('backup')
			},
			doRestore() {
				var self = this
				uni.showModal({
					title: '确认恢复',
					content: '将从 GitHub 恢复数据，覆盖本地数据。建议先备份当前数据。确定继续？',
					success: async function(res) {
						if (!res.confirm) return
						self.syncLoading = 'restore'
						var result = await restoreFromRepo()
						self.syncLoading = ''
						if (result.success) {
							var storage = require('@/utils/storage/storage.js')
							storage.saveMistakes(result.data.mistakes || [])
							storage.saveReviewRecords(result.data.records || [])
							storage.savePreferences(result.data.preferences || {})
							storage.saveQuotes(result.data.quotes || {})
							if (result.data.customOptions) {
								storage.saveCustomOptions(result.data.customOptions)
							}
							uni.showToast({ title: '恢复成功', icon: 'success' })
						} else {
							uni.showToast({ title: '恢复失败：' + result.error, icon: 'none' })
						}
						self.$emit('restore')
					}
				})
			}
		}
	}
</script>
