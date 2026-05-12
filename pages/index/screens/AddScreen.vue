<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<text class="back-arrow" @click="$emit('navigate', 'back')">← 返回</text>
		</view>

		<view class="page-content add-content">
			<view class="page-heading">
				<text class="page-title">新增错题</text>
				<text class="page-subtitle">上传题目和答案，系统自动安排 2 天后复习</text>
			</view>

			<view class="upload-box" @click="chooseQuestionImage">
				<image
					v-if="form.questionImage.length > 0"
					class="upload-preview"
					:src="form.questionImage"
					mode="aspectFill"
					@click.stop="previewSingleImage(form.questionImage)"
				></image>
				<view v-if="form.questionImage.length > 0" class="upload-change" @click.stop="chooseQuestionImage">
					<text>更换</text>
				</view>
				<view v-if="form.questionImage.length === 0" class="upload-placeholder">
					<view class="upload-icon"><text>▣</text></view>
					<text class="upload-title">上传题目图</text>
					<text class="upload-desc">支持相册或拍照</text>
				</view>
			</view>

			<view v-if="ocrStatus === 'question'" class="ocr-loading">
				<text>正在识别题目...</text>
			</view>
			<view v-if="form.questionText" class="ocr-preview soft-card">
				<text class="field-label">识别结果</text>
				<text class="ocr-text">{{ form.questionText }}</text>
				<view class="ocr-edit-btn" @click="editOcrText('question')">
					<text>编辑</text>
				</view>
			</view>

			<view class="upload-box" @click="chooseAnswerImage">
				<image
					v-if="form.answerImage.length > 0"
					class="upload-preview"
					:src="form.answerImage"
					mode="aspectFill"
					@click.stop="previewSingleImage(form.answerImage)"
				></image>
				<view v-if="form.answerImage.length > 0" class="upload-change" @click.stop="chooseAnswerImage">
					<text>更换</text>
				</view>
				<view v-if="form.answerImage.length === 0" class="upload-placeholder">
					<view class="upload-icon"><text>▤</text></view>
					<text class="upload-title">上传答案图</text>
					<text class="upload-desc">复习时默认不会先展示</text>
				</view>
			</view>

			<view v-if="ocrStatus === 'answer'" class="ocr-loading">
				<text>正在识别答案...</text>
			</view>
			<view v-if="form.answerText" class="ocr-preview soft-card">
				<text class="field-label">识别结果</text>
				<text class="ocr-text">{{ form.answerText }}</text>
				<view class="ocr-edit-btn" @click="editOcrText('answer')">
					<text>编辑</text>
				</view>
			</view>

			<view class="form-card soft-card">
				<text class="field-label">选择科目</text>
				<view class="chip-row">
					<view
						v-for="subject in subjectOptionsAll"
						:key="subject"
						:class="form.subject === subject ? 'subject-chip subject-active' : 'subject-chip'"
						@click="selectFormSubject(subject)"
					>
						<text>{{ subject }}</text>
					</view>
					<view class="subject-chip chip-add" @click="addCustomOption('subject')"><text>+ 自定义</text></view>
				</view>

				<text class="field-label field-space">选择章节</text>
				<view class="chip-row">
					<view
						v-for="chapter in chaptersForForm"
						:key="chapter"
						:class="form.chapter === chapter ? 'subject-chip subject-active' : 'subject-chip'"
						@click="setFormChapter(chapter)"
					>
						<text>{{ chapter }}</text>
					</view>
					<view class="subject-chip chip-add" @click="addCustomOption('chapter')"><text>+ 自定义</text></view>
				</view>

				<text class="field-label field-space">选择错因</text>
				<view class="chip-row">
					<view
						v-for="errorType in errorTypeOptionsAll"
						:key="errorType"
						:class="form.errorType === errorType ? 'subject-chip subject-active' : 'subject-chip'"
						@click="setFormError(errorType)"
					>
						<text>{{ errorType }}</text>
					</view>
					<view class="subject-chip chip-add" @click="addCustomOption('errorType')"><text>+ 自定义</text></view>
				</view>

				<text class="field-label field-space">难度</text>
				<view class="chip-row">
					<view
						v-for="difficulty in difficultyOptions"
						:key="difficulty"
						:class="form.difficulty === difficulty ? 'subject-chip subject-active' : 'subject-chip'"
						@click="setFormDifficulty(difficulty)"
					>
						<text>{{ difficulty }}</text>
					</view>
				</view>

				<text class="field-label field-space">题目来源</text>
				<input class="settings-input" v-model="form.source" placeholder="例如：1000题 第3章 第15题" />

				<text class="field-label field-space">备注</text>
				<textarea class="note-field" v-model="form.note" placeholder="例如：换元后忘记乘内函数导数"></textarea>
			</view>

			<view class="save-button" @click="saveMistake">
				<text class="save-icon">▣</text>
				<text>保存错题</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { createMistake, saveCustomOptions } from '@/utils/storage/storage.js'
	import { persistImageFile, previewImages } from '@/utils/file.js'
	import { getOcrConfig, recognizeImage, extractQuestionNumber } from '@/utils/ai/ocr.js'

	function createDefaultForm() {
		return {
			questionImage: '',
			answerImage: '',
			subject: '高数',
			chapter: '极限',
			errorType: '思路错',
			difficulty: '中等',
			source: '',
			note: '',
			questionText: '',
			answerText: ''
		}
	}

	export default {
		props: {
			subjectOptions: { type: Array, default: () => ['高数', '线代', '概率'] },
			customSubjects: { type: Array, default: () => [] },
			customChapters: { type: Object, default: () => ({}) },
			customErrorTypes: { type: Array, default: () => [] },
			errorTypeOptions: { type: Array, default: () => ['思路错', '计算错', '公式忘记', '审题失误'] },
			difficultyOptions: { type: Array, default: () => ['简单', '中等', '偏难'] }
		},
		emits: ['navigate', 'show-detail', 'data-changed'],
		data() {
			return {
				form: createDefaultForm(),
				ocrStatus: '',
				ocrResult: '',
				imageSaving: false,
				_localCustomSubjects: [],
				_localCustomChapters: {},
				_localCustomErrorTypes: []
			}
		},
		created() {
			this._localCustomSubjects = (this.customSubjects || []).slice()
			this._localCustomChapters = JSON.parse(JSON.stringify(this.customChapters || {}))
			this._localCustomErrorTypes = (this.customErrorTypes || []).slice()
		},
		computed: {
			subjectOptionsAll() {
				return this.subjectOptions.concat(this._localCustomSubjects)
			},
			chaptersForForm() {
				var base = this.getChaptersForSubject(this.form.subject)
				var custom = this._localCustomChapters[this.form.subject] || []
				return base.concat(custom)
			},
			errorTypeOptionsAll() {
				return this.errorTypeOptions.concat(this._localCustomErrorTypes)
			}
		},
		methods: {
			getChaptersForSubject(subject) {
				if (subject === '线代') return ['行列式', '矩阵', '向量', '线性方程组', '特征值']
				if (subject === '概率') return ['随机事件', '随机变量', '数字特征', '大数定律', '参数估计']
				if (subject === '高数') return ['极限', '导数', '积分', '级数', '多元函数']
				return this._localCustomChapters[subject] || []
			},
			chooseQuestionImage() {
				var self = this
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async function(res) {
						if (!res.tempFilePaths || res.tempFilePaths.length === 0) return
						var tempFilePath = res.tempFilePaths[0]
						self.imageSaving = true
						var output = await persistImageFile(tempFilePath)
						self.form.questionImage = output.path
						self.imageSaving = false
						self.autoRecognize('question', output.path)
					},
					fail: function() {
						self.imageSaving = false
					}
				})
			},
			chooseAnswerImage() {
				var self = this
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async function(res) {
						if (!res.tempFilePaths || res.tempFilePaths.length === 0) return
						self.imageSaving = true
						var output = await persistImageFile(res.tempFilePaths[0])
						self.form.answerImage = output.path
						self.imageSaving = false
					},
					fail: function() {
						self.imageSaving = false
					}
				})
			},
			async autoRecognize(type, imagePath) {
				var config = getOcrConfig()
				if (!config.apiKey) return
				this.ocrStatus = type
				this.ocrResult = ''
				try {
					var questionNumber = this.form.source ? extractQuestionNumber(this.form.source) : ''
					var text = await recognizeImage(imagePath, questionNumber)
					if (type === 'question') {
						this.form.questionText = text
					} else {
						this.form.answerText = text
					}
					this.ocrResult = '识别完成'
				} catch (e) {
					this.ocrResult = '识别失败：' + e.message
				} finally {
					this.ocrStatus = ''
				}
			},
			editOcrText(type) {
				var self = this
				var current = type === 'question' ? this.form.questionText : this.form.answerText
				uni.showModal({
					title: '编辑识别结果',
					editable: true,
					content: current,
					success: function(res) {
						if (res.confirm) {
							if (type === 'question') {
								self.form.questionText = res.content
							} else {
								self.form.answerText = res.content
							}
						}
					}
				})
			},
			selectFormSubject(subject) {
				this.form.subject = subject
				var chapters = this.getChaptersForSubject(subject)
				this.form.chapter = chapters.length > 0 ? chapters[0] : ''
			},
			setFormChapter(chapter) {
				this.form.chapter = chapter
			},
			setFormError(errorType) {
				this.form.errorType = errorType
			},
			setFormDifficulty(difficulty) {
				this.form.difficulty = difficulty
			},
			addCustomOption(type) {
				var self = this
				var titles = { subject: '自定义科目', chapter: '自定义章节', errorType: '自定义错因' }
				uni.showModal({
					title: titles[type] || '自定义',
					editable: true,
					placeholderText: '请输入关键词',
					success(res) {
						if (!res.confirm || !res.content || !res.content.trim()) return
						var val = res.content.trim()
						if (type === 'subject') {
							if (self.subjectOptionsAll.indexOf(val) >= 0) { self.toast('已存在'); return }
							self._localCustomSubjects.push(val)
							saveCustomOptions({ subjects: self._localCustomSubjects, chapters: self._localCustomChapters, errorTypes: self._localCustomErrorTypes })
							self.form.subject = val
						} else if (type === 'chapter') {
							if (self.chaptersForForm.indexOf(val) >= 0) { self.toast('已存在'); return }
							if (!self._localCustomChapters[self.form.subject]) self._localCustomChapters[self.form.subject] = []
							self._localCustomChapters[self.form.subject].push(val)
							saveCustomOptions({ subjects: self._localCustomSubjects, chapters: self._localCustomChapters, errorTypes: self._localCustomErrorTypes })
							self.form.chapter = val
						} else if (type === 'errorType') {
							if (self.errorTypeOptionsAll.indexOf(val) >= 0) { self.toast('已存在'); return }
							self._localCustomErrorTypes.push(val)
							saveCustomOptions({ subjects: self._localCustomSubjects, chapters: self._localCustomChapters, errorTypes: self._localCustomErrorTypes })
							self.form.errorType = val
						}
						self.$emit('data-changed')
						self.toast('已添加')
					}
				})
			},
			saveMistake() {
				if (this.imageSaving) {
					this.toast('图片正在保存，请稍等')
					return
				}
				if (!this.form.questionImage || !this.form.answerImage) {
					this.toast('请先上传题目图和答案图')
					return
				}
				var mistake = createMistake({ ...this.form })
				this.resetForm()
				this.$emit('data-changed')
				this.toast('已保存，2天后开始复习')
				this.$emit('show-detail', mistake)
			},
			resetForm() {
				this.form = createDefaultForm()
			},
			previewSingleImage(filePath) {
				if (!previewImages([filePath], filePath)) this.toast('暂无可预览图片')
			},
			toast(title) {
				uni.showToast({ title, icon: 'none' })
			}
		}
	}
</script>
