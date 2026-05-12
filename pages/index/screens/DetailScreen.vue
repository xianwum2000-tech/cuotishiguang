<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<view class="brand-row">
				<view class="back-button" @click="$emit('navigate', 'back')"><text>‹</text></view>
				<text class="brand-title small-brand">错题详情</text>
			</view>
			<view class="detail-topbar-actions">
				<text class="gear small-gear" @click="$emit('edit', activeDetail)">编辑</text>
				<text class="gear small-gear" @click="$emit('archive', activeDetail)">归档</text>
			</view>
		</view>

		<view v-if="hasActiveDetail" class="page-content detail-content">
			<view class="detail-card soft-card">
				<text class="mistake-title">{{ activeDetail.subject }} · {{ activeDetail.chapter }}</text>
				<text class="mistake-desc">错因：{{ activeDetail.errorType }}｜难度：{{ activeDetail.difficulty }}</text>
				<text v-if="activeDetail.source" class="mistake-desc">来源：{{ activeDetail.source }}</text>
				<text class="mistake-desc">下次复习：{{ activeDetail.nextReviewDate }}｜{{ stageLabel(activeDetail.reviewStage) }}</text>
			</view>

			<view class="detail-card soft-card">
				<view class="detail-tab-row">
					<text class="field-label">题目</text>
					<view class="detail-tabs">
						<view :class="detailQTab === 'text' ? 'detail-tab detail-tab-active' : 'detail-tab'" @click="detailQTab = 'text'">
							<text>文本</text>
						</view>
						<view :class="detailQTab === 'image' ? 'detail-tab detail-tab-active' : 'detail-tab'" @click="detailQTab = 'image'">
							<text>原图</text>
						</view>
					</view>
				</view>
				<view v-if="detailQTab === 'text' && activeDetail.questionText" class="ocr-text-display">
					<text>{{ activeDetail.questionText }}</text>
				</view>
				<view v-if="detailQTab === 'text' && !activeDetail.questionText" class="ocr-empty">
					<text>暂无识别文本</text>
					<view class="ocr-recognize-btn" @click="recognizeDetail('question')">
						<text>{{ detailOcrLoading === 'question' ? '识别中...' : '立即识别' }}</text>
					</view>
				</view>
				<image v-if="detailQTab === 'image'" class="detail-image" :src="activeDetail.questionImage" mode="aspectFill" @click="$emit('preview-images', activeDetail, activeDetail.questionImage)"></image>
				<view class="detail-image-actions" v-if="detailQTab === 'image'">
					<view class="detail-image-action" @click="$emit('preview-images', activeDetail, activeDetail.questionImage)">
						<text>放大查看</text>
					</view>
					<view class="detail-image-action muted-action" @click="$emit('replace-image', 'questionImage')">
						<text>更换图片</text>
					</view>
				</view>
			</view>

			<view class="detail-card soft-card">
				<view class="detail-tab-row">
					<text class="field-label">答案</text>
					<view class="detail-tabs">
						<view :class="detailATab === 'text' ? 'detail-tab detail-tab-active' : 'detail-tab'" @click="detailATab = 'text'">
							<text>文本</text>
						</view>
						<view :class="detailATab === 'image' ? 'detail-tab detail-tab-active' : 'detail-tab'" @click="detailATab = 'image'">
							<text>原图</text>
						</view>
					</view>
				</view>
				<view v-if="detailATab === 'text' && activeDetail.answerText" class="ocr-text-display">
					<text>{{ activeDetail.answerText }}</text>
				</view>
				<view v-if="detailATab === 'text' && !activeDetail.answerText" class="ocr-empty">
					<text>暂无识别文本</text>
					<view class="ocr-recognize-btn" @click="recognizeDetail('answer')">
						<text>{{ detailOcrLoading === 'answer' ? '识别中...' : '立即识别' }}</text>
					</view>
				</view>
				<image v-if="detailATab === 'image'" class="detail-image" :src="activeDetail.answerImage" mode="aspectFill" @click="$emit('preview-images', activeDetail, activeDetail.answerImage)"></image>
				<view class="detail-image-actions" v-if="detailATab === 'image'">
					<view class="detail-image-action" @click="$emit('preview-images', activeDetail, activeDetail.answerImage)">
						<text>放大查看</text>
					</view>
					<view class="detail-image-action muted-action" @click="$emit('replace-image', 'answerImage')">
						<text>更换图片</text>
					</view>
				</view>
			</view>

			<view class="detail-card soft-card">
				<text class="field-label">备注</text>
				<text class="detail-note">{{ noteText(activeDetail.note) }}</text>
			</view>

			<view class="detail-card soft-card">
				<text class="field-label">复习记录</text>
				<view v-if="detailRecords.length === 0" class="record-line">
					<text class="record-main">暂无复习记录</text>
				</view>
				<view v-for="record in detailRecords" :key="record.id" class="record-line">
					<text class="record-main">{{ record.reviewDate }} · {{ resultLabel(record.result) }}</text>
					<text class="record-sub">{{ stageLabel(record.stageBefore) }} → {{ stageLabel(record.stageAfter) }}，下次 {{ record.nextReviewDate }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { updateMistake, getMistakeById } from '@/utils/storage/storage.js'
	import { getStageLabel, getResultLabel } from '@/utils/review/scheduler.js'
	import { getOcrConfig, recognizeImage, extractQuestionNumber } from '@/utils/ai/ocr.js'

	export default {
		name: 'DetailScreen',
		props: {
			activeDetail: {
				type: Object,
				required: true
			},
			hasActiveDetail: {
				type: Boolean,
				default: false
			},
			detailRecords: {
				type: Array,
				default: () => []
			},
			preferences: {
				type: Object,
				default: () => ({})
			}
		},
		emits: ['navigate', 'archive', 'edit', 'replace-image', 'preview-images'],
		data() {
			return {
				detailQTab: 'text',
				detailATab: 'text',
				detailOcrLoading: ''
			}
		},
		methods: {
			stageLabel(stage) {
				return getStageLabel(stage)
			},
			resultLabel(result) {
				return getResultLabel(result)
			},
			noteText(note) {
				return note || '暂无备注'
			},
			async recognizeDetail(type) {
				var config = getOcrConfig()
				if (!config.apiKey) {
					uni.showToast({ title: '请先在设置中配置通义千问 API Key', icon: 'none' })
					return
				}
				var self = this
				this.detailOcrLoading = type
				try {
					var image = type === 'question' ? this.activeDetail.questionImage : this.activeDetail.answerImage
					var questionNumber = this.activeDetail.source ? extractQuestionNumber(this.activeDetail.source) : ''
					var text = await recognizeImage(image, questionNumber)
					var patch = type === 'question' ? { questionText: text } : { answerText: text }
					updateMistake(this.activeDetail.id, patch)
					this.activeDetail = getMistakeById(this.activeDetail.id)
					uni.showToast({ title: '识别完成', icon: 'success' })
				} catch (e) {
					uni.showToast({ title: '识别失败：' + e.message, icon: 'none' })
				} finally {
					this.detailOcrLoading = ''
				}
			}
		}
	}
</script>
