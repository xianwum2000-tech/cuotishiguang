<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<view class="brand-row">
				<view class="back-button" @click="cancelEdit"><text>&#8249;</text></view>
				<text class="brand-title small-brand">编辑错题</text>
			</view>
			<text class="gear small-gear" @click="saveEdit">保存</text>
		</view>

		<view v-if="editForm" class="page-content add-content">
			<view class="upload-box" @click="chooseEditQuestionImage">
				<image v-if="editForm.questionImage.length > 0" class="upload-preview" :src="editForm.questionImage" mode="aspectFill" @click.stop="previewSingleImage(editForm.questionImage)"></image>
				<view v-if="editForm.questionImage.length > 0" class="upload-change" @click.stop="chooseEditQuestionImage"><text>更换</text></view>
				<view v-if="editForm.questionImage.length === 0" class="upload-placeholder">
					<view class="upload-icon"><text>&#9635;</text></view>
					<text class="upload-title">上传题目图</text>
				</view>
			</view>

			<view class="upload-box" @click="chooseEditAnswerImage">
				<image v-if="editForm.answerImage.length > 0" class="upload-preview" :src="editForm.answerImage" mode="aspectFill" @click.stop="previewSingleImage(editForm.answerImage)"></image>
				<view v-if="editForm.answerImage.length > 0" class="upload-change" @click.stop="chooseEditAnswerImage"><text>更换</text></view>
				<view v-if="editForm.answerImage.length === 0" class="upload-placeholder">
					<view class="upload-icon"><text>&#9637;</text></view>
					<text class="upload-title">上传答案图</text>
				</view>
			</view>

			<view class="form-card soft-card">
				<text class="field-label">选择科目</text>
				<view class="chip-row">
					<view v-for="subject in subjectOptionsAll" :key="subject"
						:class="editForm.subject === subject ? 'subject-chip subject-active' : 'subject-chip'"
						@click="editForm.subject = subject">
						<text>{{ subject }}</text>
					</view>
					<view class="subject-chip chip-add" @click="addCustomOption('subject')"><text>+ 自定义</text></view>
				</view>

				<text class="field-label field-space">选择章节</text>
				<view class="chip-row">
					<view v-for="chapter in editChaptersForForm" :key="chapter"
						:class="editForm.chapter === chapter ? 'subject-chip subject-active' : 'subject-chip'"
						@click="editForm.chapter = chapter">
						<text>{{ chapter }}</text>
					</view>
					<view class="subject-chip chip-add" @click="addCustomOption('chapter')"><text>+ 自定义</text></view>
				</view>

				<text class="field-label field-space">选择错因</text>
				<view class="chip-row">
					<view v-for="errorType in errorTypeOptionsAll" :key="errorType"
						:class="editForm.errorType === errorType ? 'subject-chip subject-active' : 'subject-chip'"
						@click="editForm.errorType = errorType">
						<text>{{ errorType }}</text>
					</view>
					<view class="subject-chip chip-add" @click="addCustomOption('errorType')"><text>+ 自定义</text></view>
				</view>

				<text class="field-label field-space">难度</text>
				<view class="chip-row">
					<view v-for="difficulty in difficultyOptions" :key="difficulty"
						:class="editForm.difficulty === difficulty ? 'subject-chip subject-active' : 'subject-chip'"
						@click="editForm.difficulty = difficulty">
						<text>{{ difficulty }}</text>
					</view>
				</view>

				<text class="field-label field-space">题目来源</text>
				<view class="chip-row">
					<view v-for="source in sourceOptionsAll" :key="source"
						:class="editForm.source === source ? 'subject-chip subject-active' : 'subject-chip'"
						@click="editForm.source = source">
						<text>{{ source }}</text>
					</view>
					<view class="subject-chip chip-add" @click="addCustomOption('source')"><text>+ 自定义</text></view>
				</view>

				<text class="field-label field-space">备注</text>
				<textarea class="note-field" v-model="editForm.note" placeholder="例如：换元后忘记乘内函数导数"></textarea>
			</view>

			<view class="save-button" @click="saveEdit">
				<text>保存修改</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { updateMistake, saveCustomOptions } from '@/utils/storage/storage.js'
	import { persistImageFile, previewImages } from '@/utils/file.js'

	export default {
		props: {
			initialMistake: { type: Object, default: null },
			subjectOptions: { type: Array, default: () => ['高数', '线代', '概率'] },
			customSubjects: { type: Array, default: () => [] },
			customChapters: { type: Object, default: () => ({}) },
			customErrorTypes: { type: Array, default: () => [] },
			errorTypeOptions: { type: Array, default: () => ['思路错', '计算错', '公式忘记', '审题失误'] },
			difficultyOptions: { type: Array, default: () => ['简单', '中等', '偏难'] },
			sourceOptions: { type: Array, default: () => ['1000题A', '1000题B', '880', '大观', '真题', '模拟题'] },
			customSources: { type: Array, default: () => [] }
		},
		emits: ['navigate', 'data-changed'],
		data() {
			return {
				editForm: null,
				editingMistakeId: null,
				imageSaving: false,
				_localCustomSubjects: [],
				_localCustomChapters: {},
				_localCustomErrorTypes: [],
				_localCustomSources: []
			}
		},
		created() {
			this._localCustomSubjects = (this.customSubjects || []).slice()
			this._localCustomChapters = JSON.parse(JSON.stringify(this.customChapters || {}))
			this._localCustomErrorTypes = (this.customErrorTypes || []).slice()
			this._localCustomSources = (this.customSources || []).slice()
			if (this.initialMistake) {
				this.editForm = {
					questionImage: this.initialMistake.questionImage,
					answerImage: this.initialMistake.answerImage,
					subject: this.initialMistake.subject,
					chapter: this.initialMistake.chapter,
					errorType: this.initialMistake.errorType,
					difficulty: this.initialMistake.difficulty,
					source: this.initialMistake.source || '',
					note: this.initialMistake.note || ''
				}
				this.editingMistakeId = this.initialMistake.id
			}
		},
		computed: {
			subjectOptionsAll() {
				return this.subjectOptions.concat(this._localCustomSubjects)
			},
			errorTypeOptionsAll() {
				return this.errorTypeOptions.concat(this._localCustomErrorTypes)
			},
			sourceOptionsAll() {
				return this.sourceOptions.concat(this._localCustomSources)
			},
			editChaptersForForm() {
				if (!this.editForm) return []
				var base = this.getChaptersForSubject(this.editForm.subject)
				var custom = this._localCustomChapters[this.editForm.subject] || []
				return base.concat(custom)
			}
		},
		methods: {
			getChaptersForSubject(subject) {
				if (subject === '线代') return ['行列式', '矩阵', '向量', '线性方程组', '特征值']
				if (subject === '概率') return ['随机事件', '随机变量', '数字特征', '大数定律', '参数估计']
				if (subject === '高数') return ['极限', '导数', '积分', '级数', '多元函数']
				return this._localCustomChapters[subject] || []
			},
			chooseEditQuestionImage() {
				this.chooseEditImage('questionImage')
			},
			chooseEditAnswerImage() {
				this.chooseEditImage('answerImage')
			},
			chooseEditImage(field) {
				if (!this.editForm) return
				var self = this
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async function(res) {
						if (!res.tempFilePaths || res.tempFilePaths.length === 0) return
						self.imageSaving = true
						var output = await persistImageFile(res.tempFilePaths[0])
						self.editForm[field] = output.path
						self.imageSaving = false
						self.toast('图片已更换')
					}
				})
			},
			addCustomOption(type) {
				var self = this
				var target = self.editForm
				if (!target) return
				var titles = { subject: '自定义科目', chapter: '自定义章节', errorType: '自定义错因', source: '自定义来源' }
				uni.showModal({
					title: titles[type] || '自定义',
					editable: true,
					placeholderText: '请输入关键词',
					success(res) {
						if (!res.confirm || !res.content || !res.content.trim()) return
						var val = res.content.trim()
						var saveData = { subjects: self._localCustomSubjects, chapters: self._localCustomChapters, errorTypes: self._localCustomErrorTypes, sources: self._localCustomSources }
						if (type === 'subject') {
							if (self.subjectOptionsAll.indexOf(val) >= 0) { self.toast('已存在'); return }
							self._localCustomSubjects.push(val)
							saveCustomOptions(saveData)
							target.subject = val
						} else if (type === 'chapter') {
							var allChapters = self.editChaptersForForm
							if (allChapters.indexOf(val) >= 0) { self.toast('已存在'); return }
							if (!self._localCustomChapters[target.subject]) self._localCustomChapters[target.subject] = []
							self._localCustomChapters[target.subject].push(val)
							saveCustomOptions(saveData)
							target.chapter = val
						} else if (type === 'errorType') {
							if (self.errorTypeOptionsAll.indexOf(val) >= 0) { self.toast('已存在'); return }
							self._localCustomErrorTypes.push(val)
							saveCustomOptions(saveData)
							target.errorType = val
						} else if (type === 'source') {
							if (self.sourceOptionsAll.indexOf(val) >= 0) { self.toast('已存在'); return }
							self._localCustomSources.push(val)
							saveCustomOptions(saveData)
							target.source = val
						}
						self.$emit('data-changed')
						self.toast('已添加')
					}
				})
			},
			saveEdit() {
				if (!this.editingMistakeId || !this.editForm) return
				if (!this.editForm.questionImage || !this.editForm.answerImage) {
					this.toast('请先上传题目图和答案图')
					return
				}
				var updated = updateMistake(this.editingMistakeId, { ...this.editForm })
				this.$emit('data-changed', updated)
				this.toast('已更新')
				this.$emit('navigate', 'back')
			},
			cancelEdit() {
				this.$emit('navigate', 'back')
			},
			previewSingleImage(filePath) {
				if (!previewImages([filePath], filePath)) this.toast('暂无可预览图片')
			},
			toast(title) {
				uni.showToast({ title: title, icon: 'none' })
			}
		}
	}
</script>
