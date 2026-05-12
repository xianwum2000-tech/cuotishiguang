<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<view class="brand-row">
				<view class="back-button" @click="goBack"><text>‹</text></view>
				<text class="brand-title small-brand">结论详情</text>
			</view>
			<text class="gear small-gear" @click="saveItem">保存</text>
		</view>

		<view class="page-content detail-content" v-if="item">
			<view class="detail-card soft-card">
				<text class="field-label">结论名称</text>
				<input class="detail-input" v-model="name" placeholder="结论名称" />

				<text class="field-label">好用程度</text>
				<view class="detail-rating-row">
					<view v-for="n in 5" :key="n"
						:class="n <= rating ? 'detail-star detail-star-active' : 'detail-star'"
						@click="rating = n">
						<text>{{ n <= rating ? '★' : '☆' }}</text>
					</view>
				</view>
			</view>

			<view class="detail-card soft-card">
				<text class="field-label">结论效果</text>
				<textarea class="detail-textarea" v-model="effect" placeholder="写下这个结论的效果..." :maxlength="500" />
			</view>

			<view class="detail-card soft-card">
				<text class="field-label">使用范围</text>
				<textarea class="detail-textarea" v-model="scope" placeholder="写下这个结论的使用范围..." :maxlength="500" />
			</view>

			<view class="detail-card soft-card">
				<view class="detail-images-header">
					<text class="field-label">相关图片</text>
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
					<text class="detail-images-empty-text">暂无图片</text>
				</view>
			</view>

			<view class="save-button" @click="saveItem">
				<text>保存修改</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { persistImageFile, previewImages } from '@/utils/file.js'

const STORAGE_KEY = 'mistake_scheduler_conclusion_v1'

const item = ref(null)
const name = ref('')
const effect = ref('')
const scope = ref('')
const rating = ref(3)
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
			name.value = item.value.name || ''
			effect.value = item.value.effect || ''
			scope.value = item.value.scope || ''
			rating.value = item.value.rating || 3
			images.value = Array.isArray(item.value.images) ? [...item.value.images] : []
		}
	} catch (e) {
		item.value = null
	}
}

function saveItem() {
	if (!item.value) return
	const n = name.value.trim()
	if (!n) {
		uni.showToast({ title: '请输入结论名称', icon: 'none' })
		return
	}
	try {
		const raw = uni.getStorageSync(STORAGE_KEY)
		const list = Array.isArray(raw) ? raw : []
		const idx = list.findIndex(i => i.id === item.value.id)
		if (idx >= 0) {
			list[idx].name = n
			list[idx].effect = effect.value.trim()
			list[idx].scope = scope.value.trim()
			list[idx].rating = rating.value
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

.field-label {
	display: block;
	font-size: 14px;
	font-weight: 700;
	color: #1C1917;
	margin-bottom: 8px;
}

.detail-input {
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

.detail-textarea {
	width: 100%;
	height: 100px;
	border-radius: 12px;
	background-color: #FEF9F0;
	padding: 10px 14px;
	font-size: 14px;
	color: #1C1917;
	border: 1px solid #F1E2D8;
	box-sizing: border-box;
}

.detail-rating-row {
	display: flex;
	flex-direction: row;
	gap: 8px;
}

.detail-star {
	width: 40px;
	height: 40px;
	border-radius: 20px;
	background-color: #FEF9F0;
	border: 1px solid #F1E2D8;
	display: flex;
	align-items: center;
	justify-content: center;
}

.detail-star text {
	font-size: 20px;
	color: #D1D5DB;
}

.detail-star-active {
	background-color: #FEF3C7;
	border-color: #FCD34D;
}

.detail-star-active text {
	color: #F59E0B;
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
	background: linear-gradient(145deg, #F97316 0%, #EC8358 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 10px;
	box-shadow: 0 4px 16px rgba(249, 115, 22, 0.3);
}

.save-button text {
	font-size: 16px;
	font-weight: 800;
	color: #FFFFFF;
}
</style>
