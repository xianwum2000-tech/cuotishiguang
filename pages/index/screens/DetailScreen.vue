<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<view class="brand-row">
				<view class="back-button" @click="$emit('navigate', 'library')"><text>&#8249;</text></view>
				<text class="brand-title small-brand">错题详情</text>
			</view>
			<view class="detail-topbar-actions">
				<text class="gear small-gear" @click="enterEdit">编辑</text>
				<text class="gear small-gear" @click="archiveActiveDetail">归档</text>
			</view>
		</view>

		<view v-if="hasActiveDetail" class="page-content detail-content">
			<view class="detail-card soft-card">
				<text class="mistake-title">{{ activeDetail.subject }} &#183; {{ activeDetail.chapter }}</text>
				<text class="mistake-desc">错因：{{ activeDetail.errorType }}｜难度：{{ activeDetail.difficulty }}</text>
				<text v-if="activeDetail.source" class="mistake-desc">来源：{{ activeDetail.source }}</text>
				<text class="mistake-desc">下次复习：{{ activeDetail.nextReviewDate }}｜{{ stageLabel(activeDetail.reviewStage) }}</text>
			</view>

			<view class="detail-card soft-card">
				<text class="field-label">题目图片</text>
				<image
					class="detail-image"
					:src="activeDetail.questionImage"
					mode="aspectFill"
					@click="previewMistakeImages(activeDetail, activeDetail.questionImage)"
					@error="handleImageError('题目图片', 'questionImage')"
				></image>
				<view class="detail-image-actions">
					<view class="detail-image-action" @click="previewMistakeImages(activeDetail, activeDetail.questionImage)">
						<text>放大查看</text>
					</view>
					<view class="detail-image-action muted-action" @click="replaceDetailImage('questionImage')">
						<text>更换图片</text>
					</view>
				</view>
			</view>

			<view class="detail-card soft-card">
				<text class="field-label">答案图片</text>
				<image
					class="detail-image"
					:src="activeDetail.answerImage"
					mode="aspectFill"
					@click="previewMistakeImages(activeDetail, activeDetail.answerImage)"
					@error="handleImageError('答案图片', 'answerImage')"
				></image>
				<view class="detail-image-actions">
					<view class="detail-image-action" @click="previewMistakeImages(activeDetail, activeDetail.answerImage)">
						<text>放大查看</text>
					</view>
					<view class="detail-image-action muted-action" @click="replaceDetailImage('answerImage')">
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
					<text class="record-main">{{ record.reviewDate }} &#183; {{ resultLabel(record.result) }}</text>
					<text class="record-sub">{{ stageLabel(record.stageBefore) }} &#8594; {{ stageLabel(record.stageAfter) }}，下次 {{ record.nextReviewDate }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { archiveMistake, updateMistake } from '@/utils/storage/storage.js'
import { getStageLabel, getResultLabel, getOverdueDays } from '@/utils/review/scheduler.js'
import { previewImages, persistImageFile } from '@/utils/file.js'
import { todayKey } from '@/utils/date.js'

export default {
	props: {
		activeDetail: {
			type: Object,
			default: function () {
				return {}
			}
		},
		hasActiveDetail: {
			type: Boolean,
			default: false
		},
		records: {
			type: Array,
			default: function () {
				return []
			}
		}
	},
	emits: ['navigate', 'edit-mistake', 'data-changed'],
	computed: {
		currentDate: function () {
			return todayKey()
		},
		detailRecords: function () {
			var self = this
			if (!self.activeDetail || !self.activeDetail.id) return []
			return self.records.filter(function (record) {
				return record.questionId === self.activeDetail.id
			})
		}
	},
	methods: {
		previewSingleImage: function (filePath) {
			previewImages([filePath], filePath)
		},
		previewMistakeImages: function (item, current) {
			previewImages([item.questionImage, item.answerImage], current)
		},
		replaceDetailImage: function (field) {
			var self = this
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: function (chooseRes) {
					var tempPath = chooseRes.tempFilePaths && chooseRes.tempFilePaths[0]
					if (!tempPath) return
					persistImageFile(tempPath).then(function (persistRes) {
						var patch = {}
						patch[field] = persistRes.path
						updateMistake(self.activeDetail.id, patch)
						self.$emit('data-changed')
						self.toast('图片已更换')
					})
				}
			})
		},
		archiveActiveDetail: function () {
			var self = this
			uni.showModal({
				title: '确认归档',
				content: '归档后该错题将从待复习列表中移除，可在错题库中查看。',
				confirmText: '归档',
				cancelText: '取消',
				success: function (modalRes) {
					if (!modalRes.confirm) return
					archiveMistake(self.activeDetail.id)
					self.$emit('data-changed')
					self.$emit('navigate', 'library')
					self.toast('已归档')
				}
			})
		},
		handleImageError: function (label, field) {
			this.toast(label + '加载失败，可尝试更换图片')
		},
		enterEdit: function () {
			this.$emit('edit-mistake', this.activeDetail)
		},
		formatDueText: function (item) {
			if (!item.nextReviewDate) return '未安排'
			var overdue = getOverdueDays(item, this.currentDate)
			if (overdue > 0) {
				return '逾期' + overdue + '天'
			}
			return getStageLabel(item.reviewStage)
		},
		noteText: function (note) {
			if (note && note.trim()) {
				return note
			}
			return '暂无备注'
		},
		stageLabel: function (stage) {
			return getStageLabel(stage)
		},
		resultLabel: function (result) {
			return getResultLabel(result)
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
	.detail-content {
		padding: 14px 16px;
	}

	.detail-card {
		background: #FFFFFF;
		border-radius: 14px;
		padding: 14px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
		margin-bottom: 10px;
	}

	.mistake-title {
		font-size: 15px;
		font-weight: 600;
		color: #292524;
		margin-bottom: 6px;
	}

	.mistake-desc {
		font-size: 13px;
		color: #78716C;
		line-height: 1.6;
	}

	.detail-image {
		width: 100%;
		height: 200px;
		border-radius: 10px;
		background: #F5F0EB;
		margin-bottom: 8px;
		object-fit: cover;
	}

	.detail-image-actions {
		display: flex;
		gap: 10px;
	}

	.detail-image-action {
		flex: 1;
		background: #FFF7ED;
		border: 1px solid #FDE68A;
		border-radius: 10px;
		padding: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.detail-image-action text {
		font-size: 13px;
		color: #D97706;
		font-weight: 500;
	}

	.muted-action {
		background: #FAFAF9;
		border-color: #E7E5E4;
	}

	.muted-action text {
		color: #78716C;
	}

	.detail-note {
		font-size: 13px;
		color: #44403C;
		line-height: 1.6;
		white-space: pre-wrap;
	}

	.record-line {
		padding: 8px 0;
		border-bottom: 1px solid #F5F0EB;
	}

	.record-line:last-child {
		border-bottom: none;
	}

	.record-main {
		font-size: 13px;
		font-weight: 600;
		color: #292524;
		display: block;
		margin-bottom: 2px;
	}

	.record-sub {
		font-size: 12px;
		color: #A8A29E;
	}
</style>
