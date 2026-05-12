<template>
	<view>
		<!-- ===== Main Settings Screen ===== -->
		<view v-if="subScreen === 'settings'" class="screen screen-cream">
			<view class="topbar compact-topbar">
				<view class="brand-row">
					<view class="back-button" @click="$emit('navigate', 'stats')"><text>‹</text></view>
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
				<view class="save-button" @click="saveHomeSettings"><text>保存设置</text></view>
				<view class="secondary-button" @click="enterQuotesSettings"><text>名句设置</text></view>
				<view class="secondary-button" @click="resetHomeSettings"><text>恢复默认</text></view>
				<view class="settings-card soft-card" style="margin-top: 20px;">
					<text class="field-label">倒计时设置</text>
					<text class="page-subtitle" style="margin-bottom: 14px;">首页倒计时的目标日期和显示文字。</text>
					<text class="field-label field-space">显示文字</text>
					<input class="settings-input" v-model="countdownLabelLocal" placeholder="例如：距离27年考研还剩下" />
					<text class="field-label field-space">目标日期</text>
					<input class="settings-input" v-model="countdownTargetLocal" placeholder="例如：2027-12-25" />
					<text class="field-label field-space" style="font-size: 12px; color: #A8A29E; margin-top: 6px;">格式：YYYY-MM-DD，当前倒计时 {{ countdownDaysLocal }} 天</text>
				</view>
				<view class="save-button" @click="saveCountdown" style="margin-top: 12px;"><text>保存倒计时</text></view>
				<view class="settings-card soft-card" style="margin-top: 20px;">
					<text class="field-label">学习进度圆环</text>
					<text class="page-subtitle" style="margin-bottom: 14px;">设置三个进度圆环的名称、当前值和目标值。</text>
					<view v-for="(ring, idx) in progressRingsLocal" :key="idx" class="goal-section">
						<text class="field-label field-space">圆环 {{ idx + 1 }}</text>
						<view class="goal-row"><text class="goal-label">名称</text><input class="settings-input goal-input" v-model="ring.name" placeholder="例如：高数" /></view>
						<view class="goal-row"><text class="goal-label">当前值</text><input class="settings-input goal-input" type="number" v-model.number="ring.current" placeholder="0" /></view>
						<view class="goal-row"><text class="goal-label">目标值</text><input class="settings-input goal-input" type="number" v-model.number="ring.target" placeholder="10" /></view>
					</view>
				</view>
				<view class="save-button" @click="saveProgressRings" style="margin-top: 12px;"><text>保存学习进度</text></view>
			</view>
		</view>

		<!-- ===== Quotes Settings Sub-screen ===== -->
		<view v-if="subScreen === 'quotes-settings'" class="screen screen-cream">
			<view class="topbar compact-topbar">
				<view class="brand-row">
					<view class="back-button" @click="subScreen = 'settings'"><text>‹</text></view>
					<text class="brand-title small-brand">名句设置</text>
				</view>
				<text class="gear small-gear" @click="saveQuoteSettings">保存</text>
			</view>
			<view class="page-content settings-content">
				<view class="page-heading">
					<text class="page-title">每日名句轮换</text>
					<text class="page-subtitle">设置首页问候语每天轮换的句子。</text>
				</view>
				<view class="settings-card soft-card">
					<text class="field-label">轮换间隔（天）</text>
					<input class="settings-input" v-model="quoteSettingsForm.quoteDays" type="number" placeholder="1" />
					<text class="field-label field-space">名句列表</text>
					<view v-for="(quote, index) in quoteSettingsForm.quotes" :key="index" class="quote-line">
						<input class="quote-input" v-model="quoteSettingsForm.quotes[index]" />
						<text class="quote-delete" @click="removeQuote(index)">×</text>
					</view>
					<view class="secondary-button" @click="addQuote"><text>＋ 添加名句</text></view>
				</view>
			</view>
		</view>

		<!-- ===== Profile Sub-screen ===== -->
		<view v-if="subScreen === 'profile'" class="screen screen-cream">
			<view class="topbar compact-topbar">
				<view class="brand-row">
					<view class="avatar small-avatar">
						<image class="avatar-img" :src="preferences.homeAvatar" mode="aspectFill"></image>
					</view>
					<text class="brand-title small-brand">我的</text>
				</view>
			</view>
			<view class="page-content">
				<view class="profile-card soft-card">
					<text class="page-title">本地错题调度器</text>
					<text class="page-subtitle">离线可用 · 无账号 · 无题库 · 无 AI 识别</text>
				</view>
				<view class="profile-card soft-card">
					<text class="page-title">版本管理</text>
					<text class="page-subtitle">当前版本 {{ appVersion.name }}（{{ appVersion.code }}）</text>
					<text class="profile-line">包名：{{ appVersion.packageName }}</text>
					<text class="profile-line">更新源：{{ updateSourceText }}</text>
					<view v-if="latestVersion.versionCode > 0" class="update-note">
						<text>发现新版 {{ latestVersion.versionName }}：{{ latestVersion.changelog || '暂无更新说明' }}</text>
					</view>
					<view v-if="updateDownloading" class="update-progress">
						<view class="update-progress-fill" :style="updateProgressStyle"></view>
					</view>
					<text v-if="updateDownloading" class="profile-line">正在下载 {{ updateProgress }}%</text>
					<view class="secondary-button" @click="$emit('check-update', false)">
						<text>{{ updateChecking ? '检查中...' : '检查更新' }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { savePreferences, saveQuotes, getPreferences } from '@/utils/storage/storage.js'
	import { persistImageFile } from '@/utils/file.js'
	import { getUpdateRuntimeInfo } from '@/utils/app/updater.js'

	function getTodayQuote(quotesData) {
		var quotes = quotesData.quotes || []
		if (quotes.length === 0) return ''
		var days = Math.max(1, Number(quotesData.quoteDays) || 1)
		var dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * days))
		return quotes[dayIndex % quotes.length]
	}

	function cloneObject(obj) {
		return JSON.parse(JSON.stringify(obj))
	}

	function countDaysToTarget(targetStr) {
		if (!targetStr) return '--'
		var parts = targetStr.split('-')
		if (parts.length !== 3) return '--'
		var target = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
		if (isNaN(target.getTime())) return '--'
		var today = new Date()
		today.setHours(0, 0, 0, 0)
		var diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
		return diff >= 0 ? diff : 0
	}

	export default {
		name: 'SettingsScreen',
		props: {
			initialSubScreen: {
				type: String,
				default: 'settings'
			},
			preferences: {
				type: Object,
				default: function () {
					return {
						homeTitle: '复习达人',
						greetingTitle: '早上好，小明',
						homeAvatar: '/static/stitch_assets/avatar-home.jpg',
						statsName: '小明'
					}
				}
			},
			quotesData: {
				type: Object,
				default: function () {
					return { quotes: [], quoteDays: 1 }
				}
			},
			progressRings: {
				type: Array,
				default: function () {
					return [
						{ name: '高数', current: 0, target: 10 },
						{ name: '线代', current: 0, target: 10 },
						{ name: '概率', current: 0, target: 10 }
					]
				}
			},
			countdownTarget: {
				type: String,
				default: '2027-12-25'
			},
			countdownLabel: {
				type: String,
				default: '距离27年考研还剩下'
			},
			appVersion: {
				type: Object,
				default: function () {
					return { name: '', code: 0, packageName: '' }
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
					return {
						versionName: '',
						versionCode: 0,
						apkUrl: '',
						changelog: '',
						force: false
					}
				}
			}
		},
		data: function () {
			return {
				subScreen: this.initialSubScreen,
				settingsForm: {
					homeTitle: '',
					greetingTitle: '',
					homeAvatar: '',
					statsName: ''
				},
				quoteSettingsForm: {
					quoteDays: 1,
					quotes: []
				},
				progressRingsLocal: [],
				countdownTargetLocal: '',
				countdownLabelLocal: ''
			}
		},
		computed: {
			currentQuote: function () {
				return getTodayQuote(this.quotesData)
			},
			previewHomeTitle: function () {
				return this.settingsForm.homeTitle || '复习达人'
			},
			previewGreetingTitle: function () {
				return this.settingsForm.greetingTitle || '早上好，小明'
			},
			previewStatsName: function () {
				return this.settingsForm.statsName || '小明'
			},
			countdownDaysLocal: function () {
				return countDaysToTarget(this.countdownTargetLocal)
			},
			updateSourceText: function () {
				if (this.updateConfigured) {
					var runtime = getUpdateRuntimeInfo()
					return runtime.manifestUrl || 'GitHub Releases (已配置)'
				}
				return 'GitHub Releases (未配置)'
			},
			updateProgressStyle: function () {
				return 'width: ' + this.updateProgress + '%;'
			}
		},
		watch: {
			preferences: {
				handler: function (val) {
					if (val && typeof val === 'object') {
						this.settingsForm = {
							homeTitle: val.homeTitle || '',
							greetingTitle: val.greetingTitle || '',
							homeAvatar: val.homeAvatar || '',
							statsName: val.statsName || ''
						}
					}
				},
				deep: true
			},
			progressRings: {
				handler: function (val) {
					this.progressRingsLocal = cloneObject(val)
				},
				deep: true
			},
			countdownTarget: {
				handler: function (val) {
					this.countdownTargetLocal = val || '2027-12-25'
				}
			},
			countdownLabel: {
				handler: function (val) {
					this.countdownLabelLocal = val || '距离27年考研还剩下'
				}
			},
			subScreen: function (val) {
				if (val === 'quotes-settings') {
					this.quoteSettingsForm = cloneObject(this.quotesData)
				}
			}
		},
		created: function () {
			this.settingsForm = {
				homeTitle: this.preferences.homeTitle || '',
				greetingTitle: this.preferences.greetingTitle || '',
				homeAvatar: this.preferences.homeAvatar || '',
				statsName: this.preferences.statsName || ''
			}
			this.progressRingsLocal = cloneObject(this.progressRings)
			this.countdownTargetLocal = this.countdownTarget || '2027-12-25'
			this.countdownLabelLocal = this.countdownLabel || '距离27年考研还剩下'
			this.quoteSettingsForm = cloneObject(this.quotesData)
		},
		methods: {
			enterQuotesSettings: function () {
				this.quoteSettingsForm = cloneObject(this.quotesData)
				this.subScreen = 'quotes-settings'
			},
			saveHomeSettings: function () {
				var prefs = getPreferences()
				var next = {
					...prefs,
					homeTitle: this.settingsForm.homeTitle || '复习达人',
					greetingTitle: this.settingsForm.greetingTitle || '早上好，小明',
					homeAvatar: this.settingsForm.homeAvatar || '/static/stitch_assets/avatar-home.jpg',
					statsName: this.settingsForm.statsName || '小明'
				}
				savePreferences(next)
				this.$emit('data-changed')
				this.$emit('navigate', 'stats')
				uni.showToast({ title: '已保存', icon: 'success' })
			},
			resetHomeSettings: function () {
				this.settingsForm = {
					homeTitle: '复习达人',
					greetingTitle: '早上好，小明',
					homeAvatar: '/static/stitch_assets/avatar-home.jpg',
					statsName: '小明'
				}
			},
			saveQuoteSettings: function () {
				var days = Number(this.quoteSettingsForm.quoteDays)
				if (!days || days < 1) {
					this.toast('轮换间隔至少为 1 天')
					return
				}
				var quotes = (this.quoteSettingsForm.quotes || []).filter(function (q) {
					return q && q.trim() !== ''
				})
				if (quotes.length === 0) {
					this.toast('至少需要一句名句')
					return
				}
				saveQuotes({
					quoteDays: days,
					quotes: quotes
				})
				this.$emit('data-changed')
				uni.showToast({ title: '已保存', icon: 'success' })
			},
			addQuote: function () {
				if (!this.quoteSettingsForm.quotes) {
					this.quoteSettingsForm.quotes = []
				}
				this.quoteSettingsForm.quotes.push('')
			},
			removeQuote: function (index) {
				if (!this.quoteSettingsForm.quotes) return
				this.quoteSettingsForm.quotes.splice(index, 1)
			},
			saveProgressRings: function () {
				var rings = cloneObject(this.progressRingsLocal)
				uni.setStorageSync('mistake_scheduler_progress_rings_v1', rings)
				this.$emit('data-changed')
				uni.showToast({ title: '已保存', icon: 'success' })
			},
			saveCountdown: function () {
				var target = (this.countdownTargetLocal || '').trim()
				var label = (this.countdownLabelLocal || '').trim()
				if (!target) {
					this.toast('请输入目标日期')
					return
				}
				var parts = target.split('-')
				if (parts.length !== 3 || isNaN(Number(parts[0])) || isNaN(Number(parts[1])) || isNaN(Number(parts[2]))) {
					this.toast('日期格式错误，请使用 YYYY-MM-DD')
					return
				}
				var parsed = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
				if (isNaN(parsed.getTime())) {
					this.toast('日期格式错误，请使用 YYYY-MM-DD')
					return
				}
				if (!label) {
					this.toast('请输入显示文字')
					return
				}
				uni.setStorageSync('mistake_scheduler_countdown_v1', {
					target: target,
					label: label
				})
				this.$emit('data-changed')
				uni.showToast({ title: '已保存', icon: 'success' })
			},
			chooseHomeAvatar: function () {
				var self = this
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function (res) {
						var tempFilePath = res.tempFilePaths[0]
						persistImageFile(tempFilePath).then(function (result) {
							self.settingsForm.homeAvatar = result.path
						})
					}
				})
			},
			chooseImage: function (field) {
				var self = this
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function (res) {
						var tempFilePath = res.tempFilePaths[0]
						persistImageFile(tempFilePath).then(function (result) {
							self.setImageField(field, result.path)
						})
					}
				})
			},
			setImageField: function (field, filePath) {
				if (field === 'homeAvatar') {
					this.settingsForm.homeAvatar = filePath
				}
			},
			ringConic: function (ring) {
				var current = Number(ring.current) || 0
				var target = Math.max(1, Number(ring.target) || 1)
				var pct = Math.min(1, current / target)
				var deg = Math.round(pct * 360)
				if (deg >= 360) deg = 359
				var next = deg + 1
				return 'conic-gradient(#F59E0B 0deg ' + deg + 'deg, #E7E5E4 ' + deg + 'deg ' + next + 'deg, #E7E5E4 ' + next + 'deg 360deg)'
			},
			toast: function (title) {
				uni.showToast({
					title: title,
					icon: 'none'
				})
			}
		}
	}
</script>

<style>
	.settings-content {
		padding: 14px 16px;
	}

	.settings-card {
		margin-bottom: 10px;
	}

	.settings-preview {
		background: #FFFBEB;
		border: 1px solid #FDE68A;
		border-radius: 14px;
		padding: 14px;
		margin-bottom: 10px;
	}

	.settings-avatar-row {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 14px;
		cursor: pointer;
	}

	.settings-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
	}

	.settings-avatar-copy {
		flex: 1;
		min-width: 0;
	}

	.settings-avatar-title {
		font-size: 14px;
		font-weight: 600;
		color: #292524;
	}

	.settings-avatar-sub {
		font-size: 12px;
		color: #A8A29E;
		margin-top: 2px;
		display: block;
	}

	.preview-label {
		font-size: 11px;
		font-weight: 600;
		color: #D97706;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin-bottom: 8px;
		display: block;
	}

	.preview-brand {
		font-size: 16px;
		font-weight: 600;
		color: #292524;
	}

	.preview-brand-row {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 8px;
	}

	.preview-greeting {
		font-size: 20px;
		font-weight: 700;
		color: #292524;
		margin-bottom: 6px;
	}

	.preview-stats-title {
		font-size: 14px;
		font-weight: 600;
		color: #78716C;
		margin-top: 8px;
		display: block;
	}

	.goal-section {
		margin-bottom: 8px;
		padding: 10px;
		background: #FAFAF9;
		border-radius: 10px;
		border: 1px solid #E7E5E4;
	}

	.goal-row {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 6px;
	}

	.goal-label {
		font-size: 12px;
		font-weight: 600;
		color: #78716C;
		width: 44px;
		flex-shrink: 0;
	}

	.goal-input {
		flex: 1;
		margin-bottom: 0;
	}

	.profile-card {
		background: #FFFFFF;
		border-radius: 14px;
		padding: 14px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
		margin-bottom: 10px;
	}

	.profile-line {
		font-size: 12px;
		color: #78716C;
		margin-top: 4px;
		display: block;
	}

	.update-note {
		background: #FFF7ED;
		border-radius: 10px;
		padding: 10px;
		margin-top: 10px;
		border: 1px solid #FED7AA;
	}

	.update-note text {
		font-size: 13px;
		color: #C2410C;
	}

	.update-progress {
		width: 100%;
		height: 6px;
		background: #E7E5E4;
		border-radius: 3px;
		overflow: hidden;
		margin-top: 10px;
	}

	.update-progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #F59E0B, #F97316);
		border-radius: 3px;
	}

	.quote-line {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
	}

	.quote-input {
		flex: 1;
		height: 42px;
		background: #FAFAF9;
		border: 1px solid #E7E5E4;
		border-radius: 10px;
		padding: 0 12px;
		font-size: 14px;
		color: #292524;
	}

	.quote-delete {
		font-size: 20px;
		color: #EF4444;
		padding: 4px 8px;
		cursor: pointer;
		font-weight: 700;
	}

	.home-title {
		font-size: 20px;
		font-weight: 700;
		color: #292524;
		margin-bottom: 4px;
	}

	.home-subtitle {
		font-size: 13px;
		color: #78716C;
	}
</style>
