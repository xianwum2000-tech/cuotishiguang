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
	import { todayKey } from '@/utils/date.js'
	import { getDueMistakes, getOverdueDays, getStageLabel } from '@/utils/scheduler.js'

	export default {
		name: 'TodayListScreen',
		props: {
			mistakes: {
				type: Array,
				default: function () {
					return []
				}
			},
			records: {
				type: Array,
				default: function () {
					return []
				}
			},
			subjectOptionsAll: {
				type: Array,
				default: function () {
					return []
				}
			},
			todaySubject: {
				type: String,
				default: '全部'
			},
			todayChapter: {
				type: String,
				default: '全部'
			}
		},
		computed: {
			currentDate: function () {
				return todayKey()
			},
			activeMistakes: function () {
				return this.mistakes.filter(function (item) {
					return !item.isArchived
				})
			},
			dueList: function () {
				return getDueMistakes(this.activeMistakes, this.currentDate)
			},
			filterSubjects: function () {
				return ['全部'].concat(this.subjectOptionsAll)
			},
			filterChapters: function () {
				var self = this
				var chapters = []
				var seen = {}
				var relevantMistakes = self.activeMistakes
				if (self.todaySubject !== '全部') {
					relevantMistakes = relevantMistakes.filter(function (item) {
						return item.subject === self.todaySubject
					})
				}
				relevantMistakes.forEach(function (item) {
					if (item.chapter && !seen[item.chapter]) {
						seen[item.chapter] = true
						chapters.push(item.chapter)
					}
				})
				return ['全部'].concat(chapters)
			},
			filteredTodayList: function () {
				var self = this
				return this.dueList.filter(function (item) {
					var subjectMatch = self.todaySubject === '全部' || item.subject === self.todaySubject
					var chapterMatch = self.todayChapter === '全部' || item.chapter === self.todayChapter
					return subjectMatch && chapterMatch
				})
			}
		},
		methods: {
			setTodaySubject: function (subject) {
				this.$emit('update:todaySubject', subject)
			},
			setTodayChapter: function (chapter) {
				this.$emit('update:todayChapter', chapter)
			},
			startFirstReview: function () {
				if (this.filteredTodayList.length === 0) {
					this.toast('当前筛选没有待复习错题')
					return
				}
				this.$emit('start-review', this.filteredTodayList[0])
			},
			formatDueText: function (item) {
				var overdueDays = getOverdueDays(item, this.currentDate)
				var stage = getStageLabel(item.reviewStage)
				if (overdueDays > 0) {
					return '逾期 ' + overdueDays + ' 天 · ' + stage
				}
				return '今天到期 · ' + stage
			},
			stageLabel: function (stage) {
				return getStageLabel(stage)
			},
			noteText: function (note) {
				return note || ''
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
	.today-content {
		padding: 14px 16px;
	}

	.today-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 14px;
	}

	.today-title {
		font-size: 16px;
		font-weight: 700;
		color: #292524;
	}

	.today-sub {
		font-size: 12px;
		color: #A8A29E;
		margin-top: 2px;
	}

	.today-start {
		background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
		border-radius: 12px;
		padding: 8px 18px;
		cursor: pointer;
		box-shadow: 0 2px 6px rgba(245, 158, 11, 0.24);
	}

	.today-start text {
		color: #FFFFFF;
		font-size: 14px;
		font-weight: 600;
	}

	.today-card {
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
	}

	.today-thumb {
		width: 48px;
		height: 48px;
		border-radius: 10px;
		background: #F5F0EB;
		flex-shrink: 0;
	}

	.today-copy {
		flex: 1;
		min-width: 0;
	}

	.today-card-title {
		font-size: 14px;
		font-weight: 600;
		color: #292524;
	}

	.today-card-sub {
		font-size: 12px;
		color: #A8A29E;
		margin-top: 2px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.today-arrow {
		font-size: 20px;
		color: #D6D3D1;
		flex-shrink: 0;
	}
</style>
