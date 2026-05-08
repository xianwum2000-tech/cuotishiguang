<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<view class="brand-row">
				<view class="back-button" @click="goBack"><text>‹</text></view>
				<text class="brand-title small-brand">错题讲解清单</text>
			</view>
			<text class="gear small-gear" @click="showCompleted = !showCompleted">{{ showCompleted ? '待看' : '已完成' }}</text>
		</view>

		<view class="page-content watchlist-content">
			<!-- 圆环进度图 -->
			<view class="progress-ring-row">
				<view class="progress-ring-item" v-for="(ring, idx) in rings" :key="idx">
					<view class="progress-ring-wrap">
						<view class="progress-ring-bg"></view>
						<view class="progress-ring-fill" :style="{ background: ringConic(ring) }"></view>
						<view class="progress-ring-inner">
							<text class="progress-ring-value">{{ ring.current }}</text>
							<text class="progress-ring-label">/{{ ring.target }}</text>
						</view>
					</view>
					<text class="progress-ring-name">{{ ring.name }}</text>
				</view>
			</view>

			<!-- 添加区域 -->
			<view class="add-card soft-card">
				<input class="watchlist-input" v-model="newName" placeholder="错题名称或简要描述" />
				<input class="watchlist-input watchlist-input-space" v-model="newLink" placeholder="视频链接（可选）" />
				<view class="watchlist-add-btn" @click="addItem">
					<text>添加到清单</text>
				</view>
			</view>

			<!-- 待看清单 -->
			<view v-if="!showCompleted">
				<view class="section-head">
					<text class="section-title">待看清单</text>
					<text class="section-count">{{ pendingItems.length }} 项</text>
				</view>

				<view v-if="pendingItems.length === 0" class="empty-card soft-card">
					<text class="empty-title">暂无待看任务</text>
					<text class="empty-sub">添加错题名称和视频链接，快速记录需要复习的讲解。</text>
				</view>

				<view v-for="item in pendingItems" :key="item.id" class="watchlist-card soft-card">
					<view class="watchlist-card-body">
						<text class="watchlist-name">{{ item.name }}</text>
						<text class="watchlist-time">{{ formatTime(item.createdAt) }}</text>
						<text v-if="item.link" class="watchlist-link" @click="openLink(item.link)">{{ item.link }}</text>
					</view>
					<view class="watchlist-card-actions">
						<view class="watchlist-done-btn" @click="completeItem(item.id)">
							<text>已看完</text>
						</view>
						<view class="watchlist-delete-btn" @click="deleteItem(item.id)">
							<text>删除</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 已完成清单 -->
			<view v-if="showCompleted">
				<view class="section-head">
					<text class="section-title">已完成</text>
					<view v-if="completedItems.length > 0" class="section-clear" @click="clearCompleted">
						<text>清空</text>
					</view>
				</view>

				<view v-if="completedItems.length === 0" class="empty-card soft-card">
					<text class="empty-title">暂无已完成任务</text>
					<text class="empty-sub">看完讲解视频后点击"已看完"，记录会出现在这里。</text>
				</view>

				<view v-for="item in completedItems" :key="item.id" class="watchlist-card soft-card watchlist-card-done">
					<view class="watchlist-card-body">
						<text class="watchlist-name watchlist-name-done">{{ item.name }}</text>
						<text class="watchlist-time">{{ formatTime(item.completedAt) }} 完成</text>
					</view>
					<view class="watchlist-card-actions">
						<view class="watchlist-delete-btn" @click="deleteCompletedItem(item.id)">
							<text>删除</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const STORAGE_KEY = 'mistake_scheduler_watchlist_v1'
const GOALS_KEY = 'mistake_scheduler_watchlist_goals_v1'

const items = ref([])
const newName = ref('')
const newLink = ref('')
const showCompleted = ref(false)

const goals = ref({
	ring1: { name: '本周', current: 0, target: 10 },
	ring2: { name: '本月', current: 0, target: 40 },
	ring3: { name: '总计', current: 0, target: 100 }
})

function loadItems() {
	try {
		const raw = uni.getStorageSync(STORAGE_KEY)
		items.value = Array.isArray(raw) ? raw : []
	} catch (e) {
		items.value = []
	}
}

function loadGoals() {
	try {
		const raw = uni.getStorageSync(GOALS_KEY)
		if (raw && typeof raw === 'object') {
			goals.value.ring1 = { ...goals.value.ring1, ...raw.ring1 }
			goals.value.ring2 = { ...goals.value.ring2, ...raw.ring2 }
			goals.value.ring3 = { ...goals.value.ring3, ...raw.ring3 }
		}
	} catch (e) {}
}

function saveItems() {
	uni.setStorageSync(STORAGE_KEY, items.value)
}

function updateCurrentValues() {
	const now = new Date()
	const completed = items.value.filter(i => i.done)
	const weekAgo = new Date(now)
	weekAgo.setDate(weekAgo.getDate() - 7)
	const monthAgo = new Date(now)
	monthAgo.setDate(monthAgo.getDate() - 30)

	goals.value.ring1.current = completed.filter(i => i.completedAt && new Date(i.completedAt) >= weekAgo).length
	goals.value.ring2.current = completed.filter(i => i.completedAt && new Date(i.completedAt) >= monthAgo).length
	goals.value.ring3.current = completed.length
}

const rings = computed(() => [goals.value.ring1, goals.value.ring2, goals.value.ring3])

function ringConic(ring) {
	const pct = ring.target > 0 ? Math.min(ring.current / ring.target, 1) : 0
	const deg = pct * 360
	if (deg === 0) return '#E7E5E4'
	if (deg >= 360) return '#10B981'
	return `conic-gradient(#10B981 0deg ${deg}deg, #E7E5E4 ${deg}deg 360deg)`
}

const pendingItems = computed(() => {
	return items.value.filter(item => !item.done).sort((a, b) => {
		return new Date(b.createdAt) - new Date(a.createdAt)
	})
})

const completedItems = computed(() => {
	return items.value.filter(item => item.done).sort((a, b) => {
		return new Date(b.completedAt || 0) - new Date(a.completedAt || 0)
	})
})

function addItem() {
	const name = newName.value.trim()
	if (!name) {
		uni.showToast({ title: '请输入错题名称', icon: 'none' })
		return
	}
	items.value.push({
		id: 'watch_' + Date.now() + '_' + Math.floor(Math.random() * 100000),
		name,
		link: newLink.value.trim(),
		done: false,
		createdAt: new Date().toISOString(),
		completedAt: null
	})
	saveItems()
	newName.value = ''
	newLink.value = ''
	uni.showToast({ title: '已添加', icon: 'success' })
}

function completeItem(id) {
	const item = items.value.find(i => i.id === id)
	if (item) {
		item.done = true
		item.completedAt = new Date().toISOString()
		saveItems()
		updateCurrentValues()
	}
}

function deleteItem(id) {
	uni.showModal({
		title: '确认删除',
		content: '确定删除这条任务？',
		success(res) {
			if (res.confirm) {
				items.value = items.value.filter(i => i.id !== id)
				saveItems()
				updateCurrentValues()
			}
		}
	})
}

function deleteCompletedItem(id) {
	items.value = items.value.filter(i => i.id !== id)
	saveItems()
	updateCurrentValues()
}

function clearCompleted() {
	uni.showModal({
		title: '确认清空',
		content: '确定清空所有已完成任务？',
		success(res) {
			if (res.confirm) {
				items.value = items.value.filter(i => !i.done)
				saveItems()
				updateCurrentValues()
			}
		}
	})
}

function openLink(link) {
	if (link) {
		uni.setClipboardData({
			data: link,
			success() {
				uni.showToast({ title: '链接已复制', icon: 'success' })
			}
		})
	}
}

function formatTime(iso) {
	if (!iso) return ''
	const d = new Date(iso)
	const m = d.getMonth() + 1
	const day = d.getDate()
	const h = d.getHours().toString().padStart(2, '0')
	const min = d.getMinutes().toString().padStart(2, '0')
	return m + '/' + day + ' ' + h + ':' + min
}

function goBack() {
	uni.navigateBack()
}

onMounted(() => {
	loadItems()
	loadGoals()
	updateCurrentValues()
})
</script>

<style>
.screen {
	min-height: 100vh;
}

.screen-cream {
	background-color: #FEF9F0;
}

.topbar {
	width: 100%;
	height: 96px;
	padding: 45px 20px 10px;
	background: linear-gradient(180deg, #FEF3E2 0%, #FEF9F0 100%);
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}

.compact-topbar {
	height: 100px;
	padding-top: 40px;
}

.brand-row {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.back-button {
	width: 36px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 8px;
}

.back-button text {
	font-size: 24px;
	font-weight: 300;
	color: #6750A4;
}

.brand-title {
	font-size: 19px;
	font-weight: 900;
	color: #1C1917;
}

.small-brand {
	font-size: 16px;
	font-weight: 800;
}

.gear {
	color: #6750A4;
	font-size: 14px;
	font-weight: 700;
	padding: 6px 12px;
}

.small-gear {
	font-size: 13px;
}

.page-content {
	padding: 0 20px 24px;
}

.watchlist-content {
	padding-top: 12px;
}

.progress-ring-row {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	margin-bottom: 20px;
	padding: 16px 0;
	background: linear-gradient(145deg, #FFFFFF 0%, #FFFBF5 100%);
	border-radius: 20px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
	border: 1px solid rgba(241, 226, 216, 0.5);
}

.progress-ring-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.progress-ring-wrap {
	width: 72px;
	height: 72px;
	border-radius: 999px;
	position: relative;
}

.progress-ring-bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 999px;
	background-color: #E7E5E4;
}

.progress-ring-fill {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 999px;
}

.progress-ring-inner {
	position: absolute;
	top: 6px;
	left: 6px;
	width: 60px;
	height: 60px;
	border-radius: 999px;
	background-color: #FFFFFF;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 1px;
}

.progress-ring-value {
	font-size: 18px;
	font-weight: 800;
	color: #1C1917;
}

.progress-ring-label {
	font-size: 11px;
	font-weight: 600;
	color: #A8A29E;
}

.progress-ring-name {
	font-size: 13px;
	font-weight: 700;
	color: #6B6370;
}

.soft-card {
	background-color: #FFFFFF;
	border-radius: 20px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.add-card {
	padding: 18px;
	margin-bottom: 20px;
}

.watchlist-input {
	width: 100%;
	height: 42px;
	border-radius: 12px;
	background-color: #FEF9F0;
	padding: 0 14px;
	font-size: 14px;
	color: #1C1917;
	border: 1px solid #F1E2D8;
	box-sizing: border-box;
}

.watchlist-input-space {
	margin-top: 10px;
}

.watchlist-add-btn {
	width: 100%;
	height: 42px;
	border-radius: 12px;
	background: linear-gradient(145deg, #F97316 0%, #EC8358 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 12px;
	box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
}

.watchlist-add-btn text {
	font-size: 15px;
	font-weight: 700;
	color: #FFFFFF;
}

.section-head {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 14px;
}

.section-title {
	font-size: 18px;
	font-weight: 700;
	color: #1C1917;
}

.section-count {
	font-size: 13px;
	font-weight: 600;
	color: #A8A29E;
}

.section-clear {
	padding: 4px 12px;
	border-radius: 8px;
	background-color: #FEE2E2;
}

.section-clear text {
	font-size: 12px;
	font-weight: 700;
	color: #EF4444;
}

.empty-card {
	padding: 28px 22px;
	text-align: center;
	margin-bottom: 14px;
}

.empty-title {
	display: block;
	font-size: 16px;
	font-weight: 800;
	color: #292524;
}

.empty-sub {
	display: block;
	margin-top: 8px;
	font-size: 13px;
	color: #A8A29E;
}

.watchlist-card {
	padding: 16px 18px;
	margin-bottom: 10px;
	display: flex;
	flex-direction: column;
}

.watchlist-card-done {
	opacity: 0.7;
}

.watchlist-card-body {
	flex: 1;
}

.watchlist-name {
	display: block;
	font-size: 15px;
	font-weight: 700;
	color: #1C1917;
	line-height: 22px;
}

.watchlist-name-done {
	text-decoration: line-through;
	color: #A8A29E;
}

.watchlist-time {
	display: block;
	font-size: 12px;
	color: #A8A29E;
	margin-top: 4px;
}

.watchlist-link {
	display: block;
	font-size: 13px;
	color: #EA580C;
	margin-top: 6px;
	word-break: break-all;
	text-decoration: underline;
}

.watchlist-card-actions {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	gap: 10px;
	margin-top: 12px;
}

.watchlist-done-btn {
	padding: 6px 16px;
	border-radius: 10px;
	background: linear-gradient(145deg, #10B981 0%, #059669 100%);
	box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

.watchlist-done-btn text {
	font-size: 13px;
	font-weight: 700;
	color: #FFFFFF;
}

.watchlist-delete-btn {
	padding: 6px 16px;
	border-radius: 10px;
	background-color: #F5F5F4;
	border: 1px solid #E7E5E4;
}

.watchlist-delete-btn text {
	font-size: 13px;
	font-weight: 600;
	color: #A8A29E;
}
</style>
