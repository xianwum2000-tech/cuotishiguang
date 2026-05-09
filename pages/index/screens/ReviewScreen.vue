<template>
	<view class="screen screen-lilac review-screen">
		<view class="topbar">
			<view class="brand-row">
				<view class="avatar avatar-ring">
					<image class="avatar-img" :src="activeReview.questionImage || ''" mode="aspectFill"></image>
				</view>
				<text class="brand-title">复习进行中</text>
			</view>
			<text class="gear" @click="$emit('navigate', 'today')">×</text>
		</view>

		<view v-if="hasActiveReview" class="page-content review-content">
			<view class="progress-head">
				<text class="progress-label">今日目标</text>
				<text class="progress-number">{{ filteredTodayList.length }} / {{ dueCount }}</text>
			</view>
			<view class="progress-track">
				<view class="progress-fill"></view>
			</view>

			<view class="review-card question-card">
				<view class="review-meta">
					<text class="tag-purple">题目</text>
					<text class="muted">{{ activeReview.subject }} · {{ activeReview.chapter }}</text>
				</view>
				<image
					class="review-image"
					:src="activeReview.questionImage"
					mode="aspectFill"
					@click="previewReviewImage(activeReview.questionImage)"
					@error="handleImageError('题目图片', 'questionImage')"
				></image>
				<view v-if="reviewQuestionImageBroken" class="image-repair-action" @click="$emit('navigate', 'today')">
					<text>图片失效，去详情更换</text>
				</view>
				<text class="question-text">{{ activeReview.errorType }}｜{{ activeReview.difficulty }}</text>
				<text v-if="activeReview.note.length > 0" class="review-note">{{ activeReview.note }}</text>
			</view>

			<view v-if="answerVisible === false" class="reveal-button" @click="revealAnswer">
				<text>查看答案</text>
			</view>

			<view v-if="answerVisible" class="review-card answer-card">
				<view class="review-meta">
					<text class="tag-grey">正确答案</text>
				</view>
				<image
					class="answer-image"
					:src="activeReview.answerImage"
					mode="aspectFill"
					@click="previewReviewImage(activeReview.answerImage)"
					@error="handleImageError('答案图片', 'answerImage')"
				></image>
				<view v-if="reviewAnswerImageBroken" class="image-repair-action" @click="$emit('navigate', 'today')">
					<text>图片失效，去详情更换</text>
				</view>
				<view class="answer-note">
					<text class="answer-text">确认自己的思路后，再选择本次复习结果。</text>
				</view>
			</view>
		</view>

		<view v-if="hasActiveReview === false" class="page-content">
			<view class="empty-card soft-card">
				<text class="empty-title">没有正在复习的错题</text>
				<text class="empty-sub">请从今日复习列表进入单题流程。</text>
			</view>
		</view>

		<view v-if="answerVisible && hasActiveReview" class="review-actions">
			<view class="review-choice wrong" @click="submitReview('wrong')">
				<text class="choice-mark">×</text>
				<text class="choice-label">不会</text>
			</view>
			<view class="review-choice unsure spaced-choice" @click="submitReview('fuzzy')">
				<text class="choice-mark">?</text>
				<text class="choice-label">模糊</text>
			</view>
			<view class="review-choice right spaced-choice" @click="submitReview('known')">
				<text class="choice-mark">✓✓</text>
				<text class="choice-label">会了</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { todayKey } from '@/utils/date.js'
	import { completeReview } from '@/utils/storage.js'
	import { getResultLabel, getStageLabel, getOverdueDays } from '@/utils/scheduler.js'
	import { previewImages } from '@/utils/file.js'

	export default {
		name: 'ReviewScreen',
		props: {
			activeReview: {
				type: Object,
				default: function () {
					return {}
				}
			},
			hasActiveReview: {
				type: Boolean,
				default: false
			},
			dueCount: {
				type: Number,
				default: 0
			},
			filteredTodayList: {
				type: Array,
				default: function () {
					return []
				}
			}
		},
		emits: ['navigate', 'review-completed'],
		data: function () {
			return {
				answerVisible: false,
				reviewQuestionImageBroken: false,
				reviewAnswerImageBroken: false
			}
		},
		methods: {
			revealAnswer: function () {
				this.answerVisible = true
			},
			submitReview: function (result) {
				if (!this.hasActiveReview) return
				var currentId = this.activeReview.id
				var output = completeReview(currentId, result)
				if (!output) {
					this.toast('复习记录保存失败')
					return
				}
				this.toast('已记录：' + this.resultLabel(result))
				var self = this
				var next = this.filteredTodayList.find(function (item) {
					return item.id !== currentId
				})
				if (next) {
					this.answerVisible = false
					this.reviewQuestionImageBroken = false
					this.reviewAnswerImageBroken = false
					this.$emit('review-completed', { nextMistake: next })
				} else {
					this.answerVisible = false
					this.reviewQuestionImageBroken = false
					this.reviewAnswerImageBroken = false
					this.$emit('review-completed', { nextMistake: null })
				}
			},
			previewReviewImage: function (current) {
				var urls = [this.activeReview.questionImage, this.activeReview.answerImage]
				previewImages(urls, current)
			},
			handleImageError: function (label, field) {
				if (field === 'questionImage') {
					this.reviewQuestionImageBroken = true
				} else if (field === 'answerImage') {
					this.reviewAnswerImageBroken = true
				}
				this.toast(label + '加载失败')
			},
			resultLabel: function (result) {
				return getResultLabel(result)
			},
			stageLabel: function (stage) {
				return getStageLabel(stage)
			},
			formatDueText: function (item) {
				var overdueDays = getOverdueDays(item, todayKey())
				var stage = getStageLabel(item.reviewStage)
				if (overdueDays > 0) {
					return '逾期 ' + overdueDays + ' 天 · ' + stage
				}
				return '今天到期 · ' + stage
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
	.review-screen {
		background: #F8F6FC;
	}

	.review-content {
		padding: 14px 16px;
	}

	.review-card {
		background: #FFFFFF;
		border-radius: 14px;
		padding: 14px;
		margin-bottom: 10px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}

	.question-card {
		margin-top: 4px;
	}

	.review-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
	}

	.tag-purple {
		background: #EDE9FE;
		color: #7C3AED;
		font-size: 11px;
		font-weight: 600;
		padding: 2px 8px;
		border-radius: 8px;
	}

	.tag-grey {
		background: #F5F0EB;
		color: #57534E;
		font-size: 11px;
		font-weight: 600;
		padding: 2px 8px;
		border-radius: 8px;
	}

	.muted {
		font-size: 12px;
		color: #A8A29E;
	}

	.review-image {
		width: 100%;
		border-radius: 10px;
		background: #F5F0EB;
		margin-bottom: 8px;
	}

	.answer-image {
		width: 100%;
		border-radius: 10px;
		background: #F5F0EB;
		margin-bottom: 8px;
	}

	.answer-card {
		margin-top: 10px;
	}

	.question-text {
		font-size: 13px;
		color: #57534E;
		display: block;
		margin-bottom: 4px;
	}

	.review-note {
		font-size: 12px;
		color: #A8A29E;
		display: block;
		margin-top: 4px;
	}

	.answer-note {
		margin-top: 4px;
	}

	.answer-text {
		font-size: 12px;
		color: #A8A29E;
	}

	.image-repair-action {
		padding: 8px;
		margin-bottom: 8px;
		text-align: center;
		cursor: pointer;
	}

	.image-repair-action text {
		font-size: 12px;
		color: #F59E0B;
	}

	.review-actions {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: 393px;
		display: flex;
		justify-content: space-around;
		padding: 10px 16px 16px;
		background: linear-gradient(180deg, rgba(248, 246, 252, 0) 0%, #F8F6FC 20%);
		z-index: 20;
	}

	.review-choice {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 90px;
		height: 90px;
		border-radius: 16px;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.wrong {
		background: #FFF1F2;
		border: 2px solid #FECDD3;
	}

	.unsure {
		background: #FFF7ED;
		border: 2px solid #FED7AA;
	}

	.right {
		background: #F0FDF4;
		border: 2px solid #BBF7D0;
	}

	.spaced-choice {
		margin-left: 0;
	}

	.choice-mark {
		font-size: 22px;
		font-weight: 700;
		color: #292524;
		margin-bottom: 4px;
	}

	.wrong .choice-mark {
		color: #E11D48;
	}

	.unsure .choice-mark {
		color: #F59E0B;
	}

	.right .choice-mark {
		color: #16A34A;
	}

	.choice-label {
		font-size: 13px;
		font-weight: 600;
		color: #44403C;
	}

	.progress-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 6px;
	}

	.progress-label {
		font-size: 12px;
		color: #A8A29E;
	}

	.progress-number {
		font-size: 14px;
		font-weight: 600;
		color: #292524;
	}
</style>
