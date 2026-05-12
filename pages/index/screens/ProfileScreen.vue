<template>
	<view class="screen screen-cream">
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
</template>

<script>
	export default {
		props: {
			preferences: { type: Object, default: () => ({}) },
			appVersion: { type: Object, default: () => ({}) },
			updateConfigured: { type: Boolean, default: false },
			updateChecking: { type: Boolean, default: false },
			updateDownloading: { type: Boolean, default: false },
			updateProgress: { type: Number, default: 0 },
			latestVersion: { type: Object, default: () => ({}) }
		},
		emits: ['navigate', 'check-update'],
		computed: {
			updateSourceText() {
				return this.updateConfigured ? 'GitHub Releases' : '未配置 GitHub 仓库'
			},
			updateProgressStyle() {
				return 'width: ' + this.updateProgress + '%'
			}
		}
	}
</script>
