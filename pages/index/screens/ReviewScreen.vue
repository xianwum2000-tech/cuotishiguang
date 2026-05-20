<template>
	<view class="screen screen-lilac review-screen">
		<view class="topbar">
			<view class="brand-row">
				<view class="avatar avatar-ring">
					<image class="avatar-img" :src="preferences.homeAvatar" mode="aspectFill"></image>
				</view>
				<text class="brand-title">复习进行中</text>
			</view>
			<view style="display: flex; gap: 16px;">
				<text class="gear" @click="editCurrent">编辑</text>
				<text class="gear" @click="$emit('navigate', 'today')">×</text>
			</view>
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
				<view v-if="reviewQuestionImageBroken" class="image-repair-action" @click="showDetail(activeReview)">
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
				<view v-if="reviewAnswerImageBroken" class="image-repair-action" @click="showDetail(activeReview)">
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
	import { todayKey, daysBetween } from '@/utils/date.js'
	import { completeReview } from '@/utils/storage/storage.js'
	import { getResultLabel, getStageLabel, getOverdueDays } from '@/utils/review/scheduler.js'
	import { previewImages } from '@/utils/file.js'

	export default {
		props: {
			activeReview: { type: Object, required: true },
			hasActiveReview: { type: Boolean, default: false },
			dueCount: { type: Number, default: 0 },
			filteredTodayList: { type: Array, default: () => [] },
			preferences: { type: Object, default: () => ({}) }
		},
		emits: ['navigate', 'review-completed'],
		data() {
			return {
				answerVisible: false,
				reviewQuestionImageBroken: false,
				reviewAnswerImageBroken: false
			}
		},
		methods: {
			editCurrent() {
				if (!this.hasActiveReview) return
				this.$emit('navigate', { screen: 'edit-review', item: this.activeReview })
			},
			revealAnswer() {
				this.answerVisible = true
			},
			submitReview(result) {
				if (!this.hasActiveReview) return
				const currentId = this.activeReview.id
				const output = completeReview(currentId, result)
				if (!output) {
					uni.showToast({ title: '复习记录保存失败', icon: 'none' })
					return
				}
				uni.showToast({ title: '已记录：' + this.resultLabel(result), icon: 'none' })
				const next = this.filteredTodayList.find((item) => item.id !== currentId)
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
			previewReviewImage(current) {
				const urls = [this.activeReview.questionImage]
				if (this.answerVisible) urls.push(this.activeReview.answerImage)
				if (!previewImages(urls, current)) uni.showToast({ title: '暂无可预览图片', icon: 'none' })
			},
			handleImageError(label, field) {
				if (field === 'questionImage') this.reviewQuestionImageBroken = true
				if (field === 'answerImage') this.reviewAnswerImageBroken = true
				uni.showToast({ title: label + '无法读取，可在错题详情里更换图片', icon: 'none' })
			},
			showDetail(item) {
				this.$emit('navigate', { screen: 'detail', item })
			},
			resultLabel(result) {
				return getResultLabel(result)
			},
			stageLabel(stage) {
				return getStageLabel(stage)
			},
			formatDueText(item) {
				const today = todayKey()
				const overdue = getOverdueDays(item, today)
				if (overdue > 0) return '逾期' + overdue + '天'
				if (item.nextReviewDate === today) return '今日'
				if (!item.nextReviewDate) return '未安排'
				const diff = daysBetween(item.nextReviewDate, today)
				return diff + '天后'
			}
		}
	}
</script>
