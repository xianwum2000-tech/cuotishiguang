<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<text class="gear small-gear" @click="$emit('navigate', 'add')">＋</text>
		</view>

		<view class="page-content library-content">
			<view class="search-row">
				<view class="search-box">
					<text class="search-icon">⌕</text>
					<input class="search-input" v-model="libraryKeyword" placeholder="搜索章节、错因、备注..." />
				</view>
				<view class="filter-button" @click="$emit('navigate', 'add')">
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
						@click.stop="$emit('preview-images', { urls: [item.questionImage, item.answerImage], current: item.questionImage })"
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
	import { todayKey } from '@/utils/date.js'
	import { getOverdueDays, sortMistakesByPriority, getStageLabel } from '@/utils/review/scheduler.js'

	export default {
		name: 'LibraryScreen',
		props: {
			mistakes: {
				type: Array,
				default: function() {
					return []
				}
			},
			subjectOptionsAll: {
				type: Array,
				default: function() {
					return []
				}
			},
			errorTypeOptionsAll: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		emits: ['navigate', 'show-detail', 'preview-images'],
		data() {
			return {
				librarySubject: '全部',
				libraryError: '全部',
				libraryKeyword: ''
			}
		},
		computed: {
			currentDate() {
				return todayKey()
			},
			activeMistakes() {
				return this.mistakes.filter(function(item) {
					return !item.isArchived
				})
			},
			filterSubjects() {
				return ['全部'].concat(this.subjectOptionsAll)
			},
			filterErrors() {
				return ['全部'].concat(this.errorTypeOptionsAll)
			},
			libraryList() {
				var self = this
				var list = self.activeMistakes

				if (self.librarySubject !== '全部') {
					list = list.filter(function(item) {
						return item.subject === self.librarySubject
					})
				}

				if (self.libraryError !== '全部') {
					list = list.filter(function(item) {
						return item.errorType === self.libraryError
					})
				}

				if (self.libraryKeyword) {
					var kw = self.libraryKeyword.toLowerCase()
					list = list.filter(function(item) {
						return (item.chapter && item.chapter.toLowerCase().indexOf(kw) >= 0) ||
							(item.errorType && item.errorType.toLowerCase().indexOf(kw) >= 0) ||
							(item.note && item.note.toLowerCase().indexOf(kw) >= 0) ||
							(item.subject && item.subject.toLowerCase().indexOf(kw) >= 0)
					})
				}

				return sortMistakesByPriority(list, self.currentDate)
			}
		},
		methods: {
			setLibrarySubject(subject) {
				this.librarySubject = subject
			},
			setLibraryError(errorType) {
				this.libraryError = errorType
			},
			formatDueText(item) {
				if (!item.nextReviewDate) return '未安排'
				var overdue = getOverdueDays(item, this.currentDate)
				if (overdue > 0) {
					return '逾期' + overdue + '天'
				}
				return getStageLabel(item.reviewStage)
			},
			noteText(note) {
				if (note && note.trim()) {
					return note
				}
				return '暂无备注'
			}
		}
	}
</script>

<style>
	/* ---- Library ---- */
	.library-content {
		padding: 14px 16px;
	}

	.search-row {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
	}

	.search-box {
		flex: 1;
		display: flex;
		align-items: center;
		background: #FFFFFF;
		border-radius: 12px;
		padding: 0 12px;
		height: 40px;
		border: 1px solid #E7E5E4;
	}

	.search-icon {
		font-size: 18px;
		color: #A8A29E;
		margin-right: 8px;
	}

	.search-input {
		flex: 1;
		height: 100%;
		font-size: 13px;
		color: #292524;
	}

	.filter-button {
		width: 40px;
		height: 40px;
		background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow: 0 2px 6px rgba(245, 158, 11, 0.24);
	}

	.filter-button text {
		font-size: 20px;
		color: #FFFFFF;
		font-weight: 600;
	}

	/* ---- Mistake Card ---- */
	.mistake-card {
		display: flex;
		gap: 12px;
		cursor: pointer;
	}

	.mistake-image-wrap {
		width: 80px;
		height: 80px;
		border-radius: 10px;
		overflow: hidden;
		flex-shrink: 0;
		position: relative;
		background: #FAFAF9;
	}

	.mistake-image {
		width: 100%;
		height: 100%;
	}

	.due-pill {
		position: absolute;
		bottom: 4px;
		left: 4px;
		background: rgba(0, 0, 0, 0.55);
		border-radius: 6px;
		padding: 2px 6px;
	}

	.due-pill text {
		font-size: 10px;
		color: #FFFFFF;
	}

	.mistake-copy {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 4px;
		overflow: hidden;
	}

	.mini-subject {
		font-size: 11px;
		color: #D97706;
		font-weight: 600;
	}

	.mistake-title {
		font-size: 14px;
		font-weight: 600;
		color: #292524;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mistake-desc {
		font-size: 12px;
		color: #A8A29E;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
