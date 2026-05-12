<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<view class="brand-row">
				<view class="back-button" @click="goBack"><text>‹</text></view>
				<text class="brand-title small-brand">不足知识点</text>
			</view>
			<text class="gear small-gear" @click="showDone = !showDone">{{ showDone ? '待学' : '已学' }}</text>
		</view>

		<view class="page-content know-content">
			<view class="add-card soft-card">
				<input class="know-input" v-model="newName" placeholder="知识点名称" />
				<view class="know-subject-row">
					<view v-for="s in subjects" :key="s"
						:class="!isCustomSubject && newSubject === s ? 'know-subject-tag know-subject-active' : 'know-subject-tag'"
						@click="selectSubject(s)">
						<text>{{ s }}</text>
					</view>
					<view :class="isCustomSubject ? 'know-subject-tag know-subject-active' : 'know-subject-tag'" @click="enableCustomSubject">
						<text>自定义</text>
					</view>
				</view>
				<input v-if="isCustomSubject" class="know-input know-input-space" v-model="customSubject" placeholder="输入自定义类型" />
				<textarea class="know-method-input" v-model="newTeacher" placeholder="推荐看的老师（可选）" :maxlength="200" />
				<view class="know-add-btn" @click="addItem">
					<text>添加知识点</text>
				</view>
			</view>

			<view v-if="!showDone">
				<view class="section-head">
					<text class="section-title">待学习</text>
					<text class="section-count">{{ pendingItems.length }} 项</text>
				</view>

				<view v-if="pendingItems.length === 0" class="empty-card soft-card">
					<text class="empty-title">暂无待学习知识点</text>
					<text class="empty-sub">添加薄弱知识点，记录突破方法，逐步攻克。</text>
				</view>

				<view v-for="item in pendingItems" :key="item.id" class="know-card soft-card">
					<view class="know-card-body" @click="goDetail(item.id)">
						<view class="know-card-top">
							<text class="know-name">{{ item.name }}</text>
							<text class="know-subject-badge">{{ item.subject }}</text>
						</view>
						<text v-if="item.teacher" class="know-teacher-preview">推荐老师：{{ item.teacher }}</text>
						<text class="know-time">{{ formatTime(item.createdAt) }}</text>
					</view>
					<view class="know-method-row" @click.stop>
						<text class="know-method-label">突破方法</text>
						<textarea class="know-method-inline" v-model="item.method" placeholder="写下突破这个知识点的方法..." :maxlength="500" @blur="saveItems" />
					</view>
					<view class="know-card-actions" @click.stop>
						<view class="know-done-btn" @click="completeItem(item.id)">
							<text>已学习</text>
						</view>
						<view class="know-delete-btn" @click="deleteItem(item.id)">
							<text>删除</text>
						</view>
					</view>
				</view>
			</view>

			<view v-if="showDone">
				<view class="section-head">
					<text class="section-title">已学习</text>
					<view v-if="doneItems.length > 0" class="section-clear" @click="clearDone">
						<text>清空</text>
					</view>
				</view>

				<view v-if="doneItems.length === 0" class="empty-card soft-card">
					<text class="empty-title">暂无已学习知识点</text>
					<text class="empty-sub">学完后点击"已学习"，记录会出现在这里。</text>
				</view>

				<view v-for="item in doneItems" :key="item.id" class="know-card soft-card know-card-done" @click="goDetail(item.id)">
					<view class="know-card-body">
						<view class="know-card-top">
							<text class="know-name know-name-done">{{ item.name }}</text>
							<text class="know-subject-badge">{{ item.subject }}</text>
						</view>
						<text class="know-time">{{ formatTime(item.completedAt) }} 完成</text>
					</view>
					<view class="know-card-actions" @click.stop>
						<view class="know-delete-btn" @click="deleteDoneItem(item.id)">
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

const STORAGE_KEY = 'mistake_scheduler_knowledge_v1'
const subjects = ['高数', '线代', '概率论']

const items = ref([])
const newName = ref('')
const newSubject = ref('高数')
const customSubject = ref('')
const isCustomSubject = ref(false)
const newTeacher = ref('')
const showDone = ref(false)

function enableCustomSubject() {
	isCustomSubject.value = true
	newSubject.value = ''
}

function loadItems() {
	try {
		const raw = uni.getStorageSync(STORAGE_KEY)
		items.value = Array.isArray(raw) ? raw : []
	} catch (e) {
		items.value = []
	}
}

function saveItems() {
	uni.setStorageSync(STORAGE_KEY, items.value)
}

const pendingItems = computed(() => {
	return items.value.filter(item => !item.done).sort((a, b) => {
		return new Date(b.createdAt) - new Date(a.createdAt)
	})
})

const doneItems = computed(() => {
	return items.value.filter(item => item.done).sort((a, b) => {
		return new Date(b.completedAt || 0) - new Date(a.completedAt || 0)
	})
})

function selectSubject(s) {
	isCustomSubject.value = false
	newSubject.value = s
}

function addItem() {
	const name = newName.value.trim()
	if (!name) {
		uni.showToast({ title: '请输入知识点名称', icon: 'none' })
		return
	}
	const subject = isCustomSubject.value ? customSubject.value.trim() : newSubject.value
	if (!subject) {
		uni.showToast({ title: '请选择或输入知识点类型', icon: 'none' })
		return
	}
	items.value.push({
		id: 'know_' + Date.now() + '_' + Math.floor(Math.random() * 100000),
		name,
		subject,
		teacher: newTeacher.value.trim(),
		method: '',
		notes: '',
		images: [],
		done: false,
		createdAt: new Date().toISOString(),
		completedAt: null
	})
	saveItems()
	newName.value = ''
	newTeacher.value = ''
	customSubject.value = ''
	isCustomSubject.value = false
	uni.showToast({ title: '已添加', icon: 'success' })
}

function completeItem(id) {
	const item = items.value.find(i => i.id === id)
	if (item) {
		item.done = true
		item.completedAt = new Date().toISOString()
		saveItems()
	}
}

function deleteItem(id) {
	uni.showModal({
		title: '确认删除',
		content: '确定删除这个知识点？',
		success(res) {
			if (res.confirm) {
				items.value = items.value.filter(i => i.id !== id)
				saveItems()
			}
		}
	})
}

function deleteDoneItem(id) {
	items.value = items.value.filter(i => i.id !== id)
	saveItems()
}

function clearDone() {
	uni.showModal({
		title: '确认清空',
		content: '确定清空所有已学习知识点？',
		success(res) {
			if (res.confirm) {
				items.value = items.value.filter(i => !i.done)
				saveItems()
			}
		}
	})
}

function goDetail(id) {
	uni.navigateTo({ url: '/pages/knowledge/detail?id=' + id })
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

.know-content {
	padding-top: 12px;
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

.know-input {
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

.know-subject-row {
	display: flex;
	flex-direction: row;
	gap: 8px;
	margin-top: 10px;
}

.know-subject-tag {
	padding: 6px 14px;
	border-radius: 16px;
	background-color: #FEF9F0;
	border: 1px solid #F1E2D8;
}

.know-subject-tag text {
	font-size: 13px;
	font-weight: 600;
	color: #78716C;
}

.know-subject-active {
	background-color: #EDE9FE;
	border-color: #C4B5FD;
}

.know-subject-active text {
	color: #6D28D9;
}

.know-method-input {
	width: 100%;
	height: 70px;
	border-radius: 12px;
	background-color: #FEF9F0;
	padding: 10px 14px;
	font-size: 14px;
	color: #1C1917;
	border: 1px solid #F1E2D8;
	box-sizing: border-box;
	margin-top: 10px;
}

.know-add-btn {
	width: 100%;
	height: 42px;
	border-radius: 12px;
	background: linear-gradient(145deg, #8B5CF6 0%, #7C3AED 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 12px;
	box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
}

.know-add-btn text {
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

.know-card {
	padding: 16px 18px;
	margin-bottom: 10px;
	display: flex;
	flex-direction: column;
}

.know-card-done {
	opacity: 0.7;
}

.know-card-body {
	flex: 1;
}

.know-card-top {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 8px;
}

.know-name {
	font-size: 15px;
	font-weight: 700;
	color: #1C1917;
	line-height: 22px;
}

.know-name-done {
	text-decoration: line-through;
	color: #A8A29E;
}

.know-subject-badge {
	font-size: 11px;
	font-weight: 700;
	color: #6D28D9;
	background-color: #EDE9FE;
	padding: 2px 8px;
	border-radius: 8px;
}

.know-method-preview {
	display: block;
	font-size: 13px;
	color: #78716C;
	margin-top: 6px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.know-teacher-preview {
	display: block;
	font-size: 13px;
	color: #8B5CF6;
	margin-top: 6px;
}

.know-method-row {
	margin-top: 10px;
	padding: 10px 12px;
	background-color: #FEF9F0;
	border-radius: 12px;
	border: 1px solid #F1E2D8;
}

.know-method-label {
	display: block;
	font-size: 12px;
	font-weight: 700;
	color: #A8A29E;
	margin-bottom: 6px;
}

.know-method-inline {
	width: 100%;
	height: 60px;
	font-size: 13px;
	color: #1C1917;
	background: transparent;
	border: none;
	padding: 0;
	box-sizing: border-box;
}

.know-input-space {
	margin-top: 10px;
}

.know-time {
	display: block;
	font-size: 12px;
	color: #A8A29E;
	margin-top: 4px;
}

.know-card-actions {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	gap: 10px;
	margin-top: 12px;
}

.know-done-btn {
	padding: 6px 16px;
	border-radius: 10px;
	background: linear-gradient(145deg, #10B981 0%, #059669 100%);
	box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

.know-done-btn text {
	font-size: 13px;
	font-weight: 700;
	color: #FFFFFF;
}

.know-delete-btn {
	padding: 6px 16px;
	border-radius: 10px;
	background-color: #F5F5F4;
	border: 1px solid #E7E5E4;
}

.know-delete-btn text {
	font-size: 13px;
	font-weight: 600;
	color: #A8A29E;
}
</style>
