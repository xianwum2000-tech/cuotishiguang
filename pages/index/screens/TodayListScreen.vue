<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<text class="back-arrow" @click="$emit('navigate', 'home')">← 返回</text>
		</view>

		<view class="page-content today-content">
			<view class="today-head soft-card">
				<view>
					<text class="today-title">今天应复习</text>
					<text class="today-sub">{{ filteredTodayList.length }} 题符合当前筛选</text>
				</view>
				<view class="today-start" @click="startFirstReview">
					<text>开始</text>
				</view>
			</view>

			<text class="field-label">按科目筛选</text>
			<view class="tabs-row">
				<view
					v-for="subject in filterSubjects"
					:key="subject"
					:class="todaySubject === subject ? 'tab-chip tab-active' : 'tab-chip'"
					@click="setTodaySubject(subject)"
				>
					<text>{{ subject }}</text>
				</view>
			</view>

			<text class="field-label">按章节筛选</text>
			<view class="tabs-row">
				<view
					v-for="chapter in filterChapters"
					:key="chapter"
					:class="todayChapter === chapter ? 'tab-chip tab-active' : 'tab-chip'"
					@click="setTodayChapter(chapter)"
				>
					<text>{{ chapter }}</text>
				</view>
			</view>

			<view v-if="filteredTodayList.length === 0" class="empty-card soft-card">
				<text class="empty-title">没有待复习错题</text>
				<text class="empty-sub">任务不会消失，到了复习日期后会自动累计到这里。</text>
			</view>

			<view
				v-for="item in filteredTodayList"
				:key="item.id"
				class="today-card soft-card"
				@click="$emit('start-review', item)"
			>
				<image class="today-thumb" :src="item.questionImage" mode="aspectFill"></image>
				<view class="today-copy">
					<text class="today-card-title">{{ item.subject }} · {{ item.chapter }}</text>
					<text class="today-card-sub">{{ item.errorType }}｜错 {{ item.totalWrongCount }} 次｜{{ formatDueText(item) }}</text>
				</view>
				<text class="today-arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { todayKey, daysBetween } from '@/utils/date.js'
	import {
		getDueMistakes,
		getOverdueDays,
		getStageLabel
	} from '@/utils/review/scheduler.js'

	export default {
		props: {
			mistakes: { type: Array, default: () => [] },
			records: { type: Array, default: () => [] },
			preferences: { type: Object, default: () => ({}) },
			subjectOptions: { type: Array, default: () => [] },
			customSubjects: { type: Array, default: () => [] }
		},
		emits: ['navigate', 'start-review'],
		data() {
			return {
				todaySubject: '全部',
				todayChapter: '全部'
			}
		},
		computed: {
			activeMistakes() {
				return this.mistakes.filter((item) => !item.isArchived)
			},
			dueList() {
				return getDueMistakes(this.activeMistakes, todayKey())
			},
			subjectOptionsAll() {
				return this.subjectOptions.concat(this.customSubjects)
			},
			filterSubjects() {
				return ['全部'].concat(this.subjectOptionsAll)
			},
			filterChapters() {
				const names = ['全部']
				this.activeMistakes.forEach((item) => {
					if (item.chapter && names.indexOf(item.chapter) < 0) names.push(item.chapter)
				})
				return names
			},
			filteredTodayList() {
				return this.dueList.filter((item) => {
					const subjectMatch = this.todaySubject === '全部' || item.subject === this.todaySubject
					const chapterMatch = this.todayChapter === '全部' || item.chapter === this.todayChapter
					return subjectMatch && chapterMatch
				})
			}
		},
		methods: {
			setTodaySubject(subject) {
				this.todaySubject = subject
			},
			setTodayChapter(chapter) {
				this.todayChapter = chapter
			},
			startFirstReview() {
				if (this.filteredTodayList.length === 0) {
					uni.showToast({ title: '当前筛选下没有待复习错题', icon: 'none' })
					return
				}
				this.$emit('start-review', this.filteredTodayList[0])
			},
			formatDueText(item) {
				const overdue = getOverdueDays(item, todayKey())
				if (overdue > 0) return '逾期' + overdue + '天'
				if (item.nextReviewDate === todayKey()) return '今日'
				if (!item.nextReviewDate) return '未安排'
				const diff = daysBetween(item.nextReviewDate, todayKey())
				return diff + '天后'
			},
			stageLabel(stage) {
				return getStageLabel(stage)
			}
		}
	}
</script>
