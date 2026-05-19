<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<text class="gear small-gear" @click="$emit('add-mistake')">＋</text>
		</view>

		<view class="page-content library-content">
			<view class="search-row">
				<view class="search-box">
					<text class="search-icon">⌕</text>
					<input class="search-input" v-model="libraryKeyword" placeholder="搜索章节、错因、备注..." />
				</view>
				<view class="filter-button" @click="$emit('add-mistake')">
					<text>＋</text>
				</view>
			</view>

			<view class="tabs-row">
				<view
					v-for="subject in filterSubjects"
					:key="subject"
					:class="librarySubject === subject ? 'tab-chip tab-active' : 'tab-chip'"
					@click="setLibrarySubject(subject)"
				>
					<text>{{ subject }}</text>
				</view>
			</view>
			<view class="tabs-row">
				<view
					v-for="errorType in filterErrors"
					:key="errorType"
					:class="libraryError === errorType ? 'tab-chip tab-active' : 'tab-chip'"
					@click="setLibraryError(errorType)"
				>
					<text>{{ errorType }}</text>
				</view>
			</view>
			<view class="tabs-row">
				<view
					v-for="source in filterSources"
					:key="source"
					:class="librarySource === source ? 'tab-chip tab-active' : 'tab-chip'"
					@click="setLibrarySource(source)"
				>
					<text>{{ source }}</text>
				</view>
			</view>
			<view class="tabs-row">
				<view
					v-for="chapter in filterChapters"
					:key="chapter"
					:class="libraryChapter === chapter ? 'tab-chip tab-active' : 'tab-chip'"
					@click="setLibraryChapter(chapter)"
				>
					<text>{{ chapter }}</text>
				</view>
			</view>

			<view v-if="libraryList.length === 0" class="empty-card soft-card">
				<text class="empty-title">错题库还是空的</text>
				<text class="empty-sub">新增错题后，会在这里看到全部本地记录。</text>
			</view>

			<view
				v-for="item in libraryList"
				:key="item.id"
				class="mistake-card soft-card"
				@click="$emit('show-detail', item)"
			>
				<view class="mistake-image-wrap">
					<image
						class="mistake-image"
						:src="item.questionImage"
						mode="aspectFill"
						@click.stop="previewMistakeImages(item, item.questionImage)"
					></image>
					<view class="due-pill"><text>{{ formatDueText(item) }}</text></view>
				</view>
				<view class="mistake-copy">
					<text class="mini-subject">{{ item.subject }}</text>
					<text class="mistake-title">{{ item.chapter }} · {{ item.errorType }}</text>
					<text class="mistake-desc">{{ noteText(item.note) }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { todayKey, daysBetween } from '@/utils/date.js'
import { getOverdueDays, sortMistakesByPriority, getStageLabel } from '@/utils/review/scheduler.js'
import { previewImages } from '@/utils/file.js'

export default {
	props: {
		mistakes: { type: Array, default: () => [] },
		subjectOptions: { type: Array, default: () => [] },
		customSubjects: { type: Array, default: () => [] },
		errorTypeOptions: { type: Array, default: () => [] },
		customErrorTypes: { type: Array, default: () => [] },
		sourceOptions: { type: Array, default: () => [] },
		customSources: { type: Array, default: () => [] },
		customChapters: { type: Object, default: () => ({}) }
	},
	emits: ['navigate', 'show-detail', 'add-mistake'],
	data() {
		return {
			librarySubject: '全部',
			libraryError: '全部',
			librarySource: '全部',
			libraryChapter: '全部',
			libraryKeyword: ''
		}
	},
	computed: {
		activeMistakes() {
			return this.mistakes.filter((item) => !item.isArchived)
		},
		subjectOptionsAll() {
			return this.subjectOptions.concat(this.customSubjects)
		},
		errorTypeOptionsAll() {
			return this.errorTypeOptions.concat(this.customErrorTypes)
		},
		filterSubjects() {
			return ['全部'].concat(this.subjectOptionsAll)
		},
		filterErrors() {
			return ['全部'].concat(this.errorTypeOptionsAll)
		},
		sourceOptionsAll() {
			return this.sourceOptions.concat(this.customSources)
		},
		filterSources() {
			return ['全部'].concat(this.sourceOptionsAll)
		},
		filterChapters() {
			var self = this
			var chapters = ['全部']
			if (self.librarySubject === '全部') {
				self.activeMistakes.forEach(function(item) {
					if (item.chapter && chapters.indexOf(item.chapter) < 0) chapters.push(item.chapter)
				})
			} else {
				var base = self.getChaptersForSubject(self.librarySubject)
				base.forEach(function(ch) {
					if (chapters.indexOf(ch) < 0) chapters.push(ch)
				})
				var custom = self.customChapters[self.librarySubject] || []
				custom.forEach(function(ch) {
					if (chapters.indexOf(ch) < 0) chapters.push(ch)
				})
			}
			return chapters
		},
		libraryList() {
			const keyword = this.libraryKeyword.trim()
			const filtered = this.activeMistakes.filter((item) => {
				const subjectMatch = this.librarySubject === '全部' || item.subject === this.librarySubject
				const errorMatch = this.libraryError === '全部' || item.errorType === this.libraryError
				const sourceMatch = this.librarySource === '全部' || item.source === this.librarySource
				const chapterMatch = this.libraryChapter === '全部' || item.chapter === this.libraryChapter
				const note = item.note || ''
				const source = item.source || ''
				const keywordMatch =
					keyword.length === 0 ||
					item.chapter.indexOf(keyword) >= 0 ||
					item.errorType.indexOf(keyword) >= 0 ||
					note.indexOf(keyword) >= 0 ||
					source.indexOf(keyword) >= 0
				return subjectMatch && errorMatch && sourceMatch && chapterMatch && keywordMatch
			})
			return sortMistakesByPriority(filtered, todayKey())
		}
	},
	methods: {
		setLibrarySubject(subject) {
			this.librarySubject = subject
		},
		setLibraryError(errorType) {
			this.libraryError = errorType
		},
		setLibrarySource(source) {
			this.librarySource = source
		},
		setLibraryChapter(chapter) {
			this.libraryChapter = chapter
		},
		getChaptersForSubject(subject) {
			if (subject === '线代') return ['行列式', '矩阵', '向量', '线性方程组', '特征值']
			if (subject === '概率') return ['随机事件', '随机变量', '数字特征', '大数定律', '参数估计']
			if (subject === '高数') return ['极限', '导数', '积分', '级数', '多元函数']
			return this.customChapters[subject] || []
		},
		formatDueText(item) {
			const overdue = getOverdueDays(item, todayKey())
			if (overdue > 0) return '逾期' + overdue + '天'
			if (item.nextReviewDate === todayKey()) return '今日'
			if (!item.nextReviewDate) return '未安排'
			const diff = daysBetween(item.nextReviewDate, todayKey())
			return diff + '天后'
		},
		noteText(note) {
			return note || '暂无备注'
		},
		previewMistakeImages(item, current) {
			const urls = [item.questionImage, item.answerImage]
			if (!previewImages(urls, current)) {
				uni.showToast({ title: '暂无可预览图片', icon: 'none' })
			}
		}
	}
}
</script>
