<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<view class="brand-row">
				<view class="back-button" @click="goBack"><text>‹</text></view>
				<text class="brand-title small-brand">知识点详情</text>
			</view>
			<text class="gear small-gear" @click="saveItem">保存</text>
		</view>

		<view class="page-content detail-content" v-if="item">
			<view class="detail-card soft-card">
				<text class="detail-name">{{ item.name }}</text>
				<text class="detail-subject">{{ item.subject }}</text>
				<view v-if="item.teacher" class="detail-teacher-box">
					<text class="detail-teacher-label">推荐老师</text>
					<text class="detail-teacher-text">{{ item.teacher }}</text>
				</view>
				<view class="detail-method-box">
					<text class="detail-method-label">突破方法</text>
					<textarea class="detail-method-input" v-model="method" placeholder="写下突破这个知识点的方法..." :maxlength="500" />
				</view>
			</view>

			<view class="detail-card soft-card">
				<text class="field-label">学习心得</text>
				<textarea class="detail-notes-input" v-model="notes" placeholder="写下你的学习心得和理解..." :maxlength="2000" />
			</view>

			<view class="detail-card soft-card">
				<view class="detail-images-header">
					<text class="field-label">笔记照片</text>
					<view class="detail-add-image" @click="addImage">
						<text>+ 拍照/相册</text>
					</view>
				</view>
				<view v-if="images.length > 0" class="detail-images-grid">
					<view v-for="(img, idx) in images" :key="idx" class="detail-image-wrap">
						<image class="detail-image" :src="img" mode="aspectFill" @click="previewImage(idx)"></image>
						<view class="detail-image-del" @click="removeImage(idx)">
							<text>×</text>
						</view>
					</view>
				</view>
				<view v-else class="detail-images-empty">
					<text class="detail-images-empty-text">暂无笔记照片</text>
				</view>
			</view>

			<view class="save-button" @click="saveItem">
				<text>保存</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { persistImageFile, previewImages } from '@/utils/file.js'

const STORAGE_KEY = 'mistake_scheduler_knowledge_v1'

const item = ref(null)
const notes = ref('')
const method = ref('')
const images = ref([])

function loadItem() {
	const pages = getCurrentPages()
	const page = pages[pages.length - 1]
	const id = page.options && page.options.id
	if (!id) return

	try {
		const raw = uni.getStorageSync(STORAGE_KEY)
		const list = Array.isArray(raw) ? raw : []
		item.value = list.find(i => i.id === id) || null
		if (item.value) {
			notes.value = item.value.notes || ''
			method.value = item.value.method || ''
			images.value = Array.isArray(item.value.images) ? [...item.value.images] : []
		}
	} catch (e) {
		item.value = null
	}
}

function saveItem() {
	if (!item.value) return
	try {
		const raw = uni.getStorageSync(STORAGE_KEY)
		const list = Array.isArray(raw) ? raw : []
		const idx = list.findIndex(i => i.id === item.value.id)
		if (idx >= 0) {
			list[idx].notes = notes.value
			list[idx].method = method.value
			list[idx].images = [...images.value]
			uni.setStorageSync(STORAGE_KEY, list)
			uni.showToast({ title: '已保存', icon: 'success' })
		}
	} catch (e) {
		uni.showToast({ title: '保存失败', icon: 'none' })
	}
}

function addImage() {
	uni.chooseImage({
		count: 9 - images.value.length,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: async (res) => {
			for (const tempPath of res.tempFilePaths) {
				if (images.value.length >= 9) break
				const result = await persistImageFile(tempPath)
				images.value.push(result.path)
			}
		}
	})
}

function removeImage(idx) {
	images.value.splice(idx, 1)
}

function previewImage(idx) {
	previewImages(images.value, images.value[idx])
}

function goBack() {
	uni.navigateBack()
}

onMounted(() => {
	loadItem()
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

.detail-content {
	padding-top: 12px;
}

.soft-card {
	background-color: #FFFFFF;
	border-radius: 20px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.detail-card {
	padding: 18px;
	margin-bottom: 14px;
}

.detail-name {
	display: block;
	font-size: 18px;
	font-weight: 800;
	color: #1C1917;
}

.detail-subject {
	display: inline-block;
	font-size: 12px;
	font-weight: 700;
	color: #6D28D9;
	background-color: #EDE9FE;
	padding: 3px 10px;
	border-radius: 10px;
	margin-top: 8px;
}

.detail-method-box {
	margin-top: 12px;
	padding: 12px;
	background-color: #FEF9F0;
	border-radius: 12px;
	border: 1px solid #F1E2D8;
}

.detail-method-label {
	display: block;
	font-size: 12px;
	font-weight: 700;
	color: #A8A29E;
	margin-bottom: 6px;
}

.detail-method-input {
	width: 100%;
	height: 80px;
	font-size: 14px;
	color: #1C1917;
	background: transparent;
	border: none;
	padding: 0;
	box-sizing: border-box;
}

.detail-teacher-box {
	margin-top: 12px;
	padding: 12px;
	background-color: #EDE9FE;
	border-radius: 12px;
	border: 1px solid #C4B5FD;
}

.detail-teacher-label {
	display: block;
	font-size: 12px;
	font-weight: 700;
	color: #8B5CF6;
	margin-bottom: 4px;
}

.detail-teacher-text {
	display: block;
	font-size: 14px;
	color: #1C1917;
	line-height: 20px;
}

.field-label {
	display: block;
	font-size: 14px;
	font-weight: 700;
	color: #1C1917;
	margin-bottom: 10px;
}

.detail-notes-input {
	width: 100%;
	height: 150px;
	border-radius: 12px;
	background-color: #FEF9F0;
	padding: 12px 14px;
	font-size: 14px;
	color: #1C1917;
	border: 1px solid #F1E2D8;
	box-sizing: border-box;
}

.detail-images-header {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 10px;
}

.detail-images-header .field-label {
	margin-bottom: 0;
}

.detail-add-image {
	padding: 6px 14px;
	border-radius: 10px;
	background-color: #EDE9FE;
}

.detail-add-image text {
	font-size: 13px;
	font-weight: 700;
	color: #6D28D9;
}

.detail-images-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.detail-image-wrap {
	position: relative;
	width: 80px;
	height: 80px;
}

.detail-image {
	width: 80px;
	height: 80px;
	border-radius: 10px;
}

.detail-image-del {
	position: absolute;
	top: -6px;
	right: -6px;
	width: 22px;
	height: 22px;
	border-radius: 11px;
	background-color: #EF4444;
	display: flex;
	align-items: center;
	justify-content: center;
}

.detail-image-del text {
	font-size: 14px;
	font-weight: 700;
	color: #FFFFFF;
	line-height: 1;
}

.detail-images-empty {
	padding: 20px;
	text-align: center;
}

.detail-images-empty-text {
	font-size: 13px;
	color: #A8A29E;
}

.save-button {
	width: 100%;
	height: 54px;
	border-radius: 28px;
	background: linear-gradient(145deg, #8B5CF6 0%, #7C3AED 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 10px;
	box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
}

.save-button text {
	font-size: 16px;
	font-weight: 800;
	color: #FFFFFF;
}
</style>
