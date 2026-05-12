<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<view class="brand-row">
				<view class="back-button" @click="goBack"><text>‹</text></view>
				<text class="brand-title small-brand">二级结论</text>
			</view>
			<text class="gear small-gear" @click="showAdd = !showAdd">{{ showAdd ? '收起' : '添加' }}</text>
		</view>

		<view class="page-content concl-content">
			<view v-if="showAdd" class="add-card soft-card">
				<input class="concl-input" v-model="newName" placeholder="结论名称" />
				<textarea class="concl-textarea" v-model="newEffect" placeholder="结论效果（如：可直接得出...）" :maxlength="500" />
				<textarea class="concl-textarea concl-textarea-space" v-model="newScope" placeholder="使用范围（如：适用于连续函数...）" :maxlength="500" />
				<text class="field-label">好用程度</text>
				<view class="concl-rating-row">
					<view v-for="n in 5" :key="n"
						:class="n <= newRating ? 'concl-star concl-star-active' : 'concl-star'"
						@click="newRating = n">
						<text>{{ n <= newRating ? '★' : '☆' }}</text>
					</view>
				</view>
				<view class="concl-images-header">
					<text class="field-label">图片（可选）</text>
					<view class="concl-add-image" @click="addImage">
						<text>+ 拍照/相册</text>
					</view>
				</view>
				<view v-if="newImages.length > 0" class="concl-images-grid">
					<view v-for="(img, idx) in newImages" :key="idx" class="concl-image-wrap">
						<image class="concl-image" :src="img" mode="aspectFill" @click="previewImage(newImages, idx)"></image>
						<view class="concl-image-del" @click="removeImage(idx)">
							<text>×</text>
						</view>
					</view>
				</view>
				<view class="concl-add-btn" @click="addItem">
					<text>添加结论</text>
				</view>
			</view>

			<view class="section-head">
				<text class="section-title">我的二级结论</text>
				<text class="section-count">{{ items.length }} 条</text>
			</view>

			<view v-if="items.length === 0" class="empty-card soft-card">
				<text class="empty-title">暂无二级结论</text>
				<text class="empty-sub">点击右上角添加你总结的二级结论，方便随时查阅。</text>
			</view>

			<view v-for="item in sortedItems" :key="item.id" class="concl-card soft-card" @click="goDetail(item.id)">
				<view class="concl-card-header">
					<text class="concl-card-name">{{ item.name }}</text>
					<view class="concl-card-stars">
						<text v-for="n in 5" :key="n" class="concl-star-text">{{ n <= item.rating ? '★' : '☆' }}</text>
					</view>
				</view>
				<text v-if="item.effect" class="concl-card-preview">{{ item.effect }}</text>
				<view class="concl-card-footer">
					<view class="concl-card-tags">
						<text v-if="item.scope" class="concl-card-tag">{{ item.scope }}</text>
						<text v-if="item.images && item.images.length > 0" class="concl-card-tag concl-card-tag-img">{{ item.images.length }} 张图</text>
					</view>
					<view class="concl-delete-btn" @click.stop="deleteItem(item.id)">
						<text>删除</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { persistImageFile, previewImages } from '@/utils/file.js'

const STORAGE_KEY = 'mistake_scheduler_conclusion_v1'

const items = ref([])
const showAdd = ref(false)
const newName = ref('')
const newEffect = ref('')
const newScope = ref('')
const newRating = ref(3)
const newImages = ref([])

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

const sortedItems = computed(() => {
	return items.value.slice().sort((a, b) => {
		if (b.rating !== a.rating) return b.rating - a.rating
		return new Date(b.createdAt) - new Date(a.createdAt)
	})
})

function addItem() {
	const name = newName.value.trim()
	if (!name) {
		uni.showToast({ title: '请输入结论名称', icon: 'none' })
		return
	}
	items.value.push({
		id: 'concl_' + Date.now() + '_' + Math.floor(Math.random() * 100000),
		name,
		effect: newEffect.value.trim(),
		scope: newScope.value.trim(),
		rating: newRating.value,
		images: [...newImages.value],
		createdAt: new Date().toISOString()
	})
	saveItems()
	newName.value = ''
	newEffect.value = ''
	newScope.value = ''
	newRating.value = 3
	newImages.value = []
	showAdd.value = false
	uni.showToast({ title: '已添加', icon: 'success' })
}

function addImage() {
	uni.chooseImage({
		count: 9 - newImages.value.length,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: async (res) => {
			for (const tempPath of res.tempFilePaths) {
				if (newImages.value.length >= 9) break
				const result = await persistImageFile(tempPath)
				newImages.value.push(result.path)
			}
		}
	})
}

function removeImage(idx) {
	newImages.value.splice(idx, 1)
}

function previewImage(images, idx) {
	previewImages(images, images[idx])
}

function goDetail(id) {
	uni.navigateTo({ url: '/pages/conclusion/detail?id=' + id })
}

function deleteItem(id) {
	uni.showModal({
		title: '确认删除',
		content: '确定删除这条二级结论？',
		success(res) {
			if (res.confirm) {
				items.value = items.value.filter(i => i.id !== id)
				saveItems()
			}
		}
	})
}

function formatTime(iso) {
	if (!iso) return ''
	const d = new Date(iso)
	const m = d.getMonth() + 1
	const day = d.getDate()
	return m + '/' + day
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

.concl-content {
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

.concl-input {
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

.concl-textarea {
	width: 100%;
	height: 70px;
	border-radius: 12px;
	background-color: #FEF9F0;
	padding: 10px 14px;
	font-size: 14px;
	color: #1C1917;
	border: 1px solid #F1E2D8;
	box-sizing: border-box;
}

.concl-textarea-space {
	margin-top: 10px;
}

.field-label {
	display: block;
	font-size: 14px;
	font-weight: 700;
	color: #1C1917;
	margin-top: 12px;
	margin-bottom: 8px;
}

.concl-rating-row {
	display: flex;
	flex-direction: row;
	gap: 8px;
}

.concl-star {
	width: 36px;
	height: 36px;
	border-radius: 18px;
	background-color: #FEF9F0;
	border: 1px solid #F1E2D8;
	display: flex;
	align-items: center;
	justify-content: center;
}

.concl-star text {
	font-size: 18px;
	color: #D1D5DB;
}

.concl-star-active {
	background-color: #FEF3C7;
	border-color: #FCD34D;
}

.concl-star-active text {
	color: #F59E0B;
}

.concl-add-btn {
	width: 100%;
	height: 42px;
	border-radius: 12px;
	background: linear-gradient(145deg, #F97316 0%, #EC8358 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 14px;
	box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
}

.concl-add-btn text {
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

.concl-card {
	padding: 16px 18px;
	margin-bottom: 12px;
}

.concl-card-header {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}

.concl-card-name {
	font-size: 16px;
	font-weight: 800;
	color: #1C1917;
}

.concl-card-stars {
	display: flex;
	flex-direction: row;
	gap: 2px;
}

.concl-star-text {
	font-size: 16px;
	color: #F59E0B;
}

.concl-card-section {
	margin-top: 10px;
	padding: 10px 12px;
	background-color: #FEF9F0;
	border-radius: 10px;
}

.concl-card-label {
	display: block;
	font-size: 12px;
	font-weight: 700;
	color: #A8A29E;
	margin-bottom: 4px;
}

.concl-card-text {
	display: block;
	font-size: 14px;
	color: #1C1917;
	line-height: 20px;
}

.concl-card-preview {
	display: block;
	font-size: 13px;
	color: #78716C;
	margin-top: 8px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.concl-card-tags {
	display: flex;
	flex-direction: row;
	gap: 6px;
	flex: 1;
}

.concl-card-tag {
	font-size: 11px;
	font-weight: 600;
	color: #78716C;
	background-color: #F5F5F4;
	padding: 2px 8px;
	border-radius: 6px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 120px;
}

.concl-card-tag-img {
	color: #8B5CF6;
	background-color: #EDE9FE;
}

.concl-images-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 12px;
		margin-bottom: 8px;
	}

	.concl-images-header .field-label {
		margin: 0;
	}

	.concl-add-image {
		padding: 6px 14px;
		border-radius: 10px;
		background-color: #EDE9FE;
	}

	.concl-add-image text {
		font-size: 13px;
		font-weight: 700;
		color: #6D28D9;
	}

	.concl-images-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 10px;
	}

	.concl-image-wrap {
		position: relative;
		width: 70px;
		height: 70px;
	}

	.concl-image {
		width: 70px;
		height: 70px;
		border-radius: 10px;
	}

	.concl-image-del {
		position: absolute;
		top: -6px;
		right: -6px;
		width: 20px;
		height: 20px;
		border-radius: 10px;
		background-color: #EF4444;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.concl-image-del text {
		font-size: 14px;
		font-weight: 700;
		color: #FFFFFF;
		line-height: 1;
	}

	.concl-card-images {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 10px;
	}

	.concl-card-image-wrap {
		width: 60px;
		height: 60px;
	}

	.concl-card-image {
		width: 60px;
		height: 60px;
		border-radius: 8px;
	}

	.concl-card-footer {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-top: 12px;
}

.concl-card-time {
	font-size: 12px;
	color: #A8A29E;
}

.concl-delete-btn {
	padding: 4px 12px;
	border-radius: 8px;
	background-color: #F5F5F4;
	border: 1px solid #E7E5E4;
}

.concl-delete-btn text {
	font-size: 12px;
	font-weight: 600;
	color: #A8A29E;
}
</style>
