<template>
	<view>
		<!-- ===== Add Mode ===== -->
		<view v-if="mode === 'add'" class="screen screen-cream">
			<view class="topbar compact-topbar">
				<text class="back-arrow" @click="$emit('navigate', 'library')">← 返回</text>
			</view>
			<view class="page-content add-content">
				<view class="page-heading">
					<text class="page-title">新增错题</text>
					<text class="page-subtitle">上传题目和答案，系统自动安排 2 天后复习</text>
				</view>
				<view class="upload-box" @click="chooseQuestionImage">
					<image v-if="form.questionImage.length > 0" class="upload-preview" :src="form.questionImage" mode="aspectFill" @click.stop="previewSingleImage(form.questionImage)"></image>
					<view v-if="form.questionImage.length > 0" class="upload-change" @click.stop="chooseQuestionImage"><text>更换</text></view>
					<view v-if="form.questionImage.length === 0" class="upload-placeholder">
						<view class="upload-icon"><text>▣</text></view>
						<text class="upload-title">上传题目图</text>
						<text class="upload-desc">支持相册或拍照</text>
					</view>
				</view>
				<view class="upload-box" @click="chooseAnswerImage">
					<image v-if="form.answerImage.length > 0" class="upload-preview" :src="form.answerImage" mode="aspectFill" @click.stop="previewSingleImage(form.answerImage)"></image>
					<view v-if="form.answerImage.length > 0" class="upload-change" @click.stop="chooseAnswerImage"><text>更换</text></view>
					<view v-if="form.answerImage.length === 0" class="upload-placeholder">
						<view class="upload-icon"><text>▤</text></view>
						<text class="upload-title">上传答案图</text>
						<text class="upload-desc">复习时默认不会先展示</text>
					</view>
				</view>
				<view class="form-card soft-card">
					<text class="field-label">选择科目</text>
					<view class="chip-row">
						<view v-for="subject in subjectOptionsAll" :key="subject" :class="form.subject === subject ? 'subject-chip subject-active' : 'subject-chip'" @click="selectFormSubject(subject)"><text>{{ subject }}</text></view>
						<view class="subject-chip chip-add" @click="addCustomOption('subject')"><text>+ 自定义</text></view>
					</view>
					<text class="field-label field-space">选择章节</text>
					<view class="chip-row">
						<view v-for="chapter in chaptersForForm" :key="chapter" :class="form.chapter === chapter ? 'subject-chip subject-active' : 'subject-chip'" @click="setFormChapter(chapter)"><text>{{ chapter }}</text></view>
						<view class="subject-chip chip-add" @click="addCustomOption('chapter')"><text>+ 自定义</text></view>
					</view>
					<text class="field-label field-space">选择错因</text>
					<view class="chip-row">
						<view v-for="errorType in errorTypeOptionsAll" :key="errorType" :class="form.errorType === errorType ? 'subject-chip subject-active' : 'subject-chip'" @click="setFormError(errorType)"><text>{{ errorType }}</text></view>
						<view class="subject-chip chip-add" @click="addCustomOption('errorType')"><text>+ 自定义</text></view>
					</view>
					<text class="field-label field-space">难度</text>
					<view class="chip-row">
						<view v-for="difficulty in difficultyOptions" :key="difficulty" :class="form.difficulty === difficulty ? 'subject-chip subject-active' : 'subject-chip'" @click="setFormDifficulty(difficulty)"><text>{{ difficulty }}</text></view>
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

		<!-- ===== Edit Mode ===== -->
		<view v-if="mode === 'edit'" class="screen screen-cream">
			<view class="topbar compact-topbar">
				<view class="brand-row">
					<view class="back-button" @click="cancelEdit"><text>‹</text></view>
					<text class="brand-title small-brand">编辑错题</text>
				</view>
				<text class="gear small-gear" @click="saveEdit">保存</text>
			</view>
			<view v-if="editForm" class="page-content add-content">
				<view class="upload-box" @click="chooseEditQuestionImage">
					<image v-if="editForm.questionImage.length > 0" class="upload-preview" :src="editForm.questionImage" mode="aspectFill" @click.stop="previewSingleImage(editForm.questionImage)"></image>
					<view v-if="editForm.questionImage.length > 0" class="upload-change" @click.stop="chooseEditQuestionImage"><text>更换</text></view>
					<view v-if="editForm.questionImage.length === 0" class="upload-placeholder">
						<view class="upload-icon"><text>▣</text></view>
						<text class="upload-title">上传题目图</text>
					</view>
				</view>
				<view class="upload-box" @click="chooseEditAnswerImage">
					<image v-if="editForm.answerImage.length > 0" class="upload-preview" :src="editForm.answerImage" mode="aspectFill" @click.stop="previewSingleImage(editForm.answerImage)"></image>
					<view v-if="editForm.answerImage.length > 0" class="upload-change" @click.stop="chooseEditAnswerImage"><text>更换</text></view>
					<view v-if="editForm.answerImage.length === 0" class="upload-placeholder">
						<view class="upload-icon"><text>▤</text></view>
						<text class="upload-title">上传答案图</text>
					</view>
				</view>
				<view class="form-card soft-card">
					<text class="field-label">选择科目</text>
					<view class="chip-row">
						<view v-for="subject in subjectOptionsAll" :key="subject" :class="editForm.subject === subject ? 'subject-chip subject-active' : 'subject-chip'" @click="editForm.subject = subject"><text>{{ subject }}</text></view>
						<view class="subject-chip chip-add" @click="addCustomOption('subject')"><text>+ 自定义</text></view>
					</view>
					<text class="field-label field-space">选择章节</text>
					<view class="chip-row">
						<view v-for="chapter in editChaptersForForm" :key="chapter" :class="editForm.chapter === chapter ? 'subject-chip subject-active' : 'subject-chip'" @click="editForm.chapter = chapter"><text>{{ chapter }}</text></view>
						<view class="subject-chip chip-add" @click="addCustomOption('chapter')"><text>+ 自定义</text></view>
					</view>
					<text class="field-label field-space">选择错因</text>
					<view class="chip-row">
						<view v-for="errorType in errorTypeOptionsAll" :key="errorType" :class="editForm.errorType === errorType ? 'subject-chip subject-active' : 'subject-chip'" @click="editForm.errorType = errorType"><text>{{ errorType }}</text></view>
						<view class="subject-chip chip-add" @click="addCustomOption('errorType')"><text>+ 自定义</text></view>
					</view>
					<text class="field-label field-space">难度</text>
					<view class="chip-row">
						<view v-for="difficulty in difficultyOptions" :key="difficulty" :class="editForm.difficulty === difficulty ? 'subject-chip subject-active' : 'subject-chip'" @click="editForm.difficulty = difficulty"><text>{{ difficulty }}</text></view>
					</view>
					<text class="field-label field-space">题目来源</text>
					<input class="settings-input" v-model="editForm.source" placeholder="例如：1000题 第3章 第15题" />
					<text class="field-label field-space">备注</text>
					<textarea class="note-field" v-model="editForm.note" placeholder="例如：换元后忘记乘内函数导数"></textarea>
				</view>
				<view class="save-button" @click="saveEdit"><text>保存修改</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	import { createMistake, updateMistake, saveCustomOptions, getCustomOptions } from '@/utils/storage/storage.js'
	import { persistImageFile, previewImages } from '@/utils/file.js'

	const DEFAULT_CHAPTERS = {
		'高数': ['极限', '连续', '导数', '微分', '积分', '微分方程', '无穷级数', '多元微分', '重积分', '曲线积分', '曲面积分'],
		'线代': ['行列式', '矩阵', '向量', '线性方程组', '特征值', '二次型'],
		'概率': ['随机事件', '一维随机变量', '多维随机变量', '数字特征', '大数定律', '数理统计']
	}

	export default {
		name: 'AddScreen',
		props: {
			mode: {
				type: String,
				default: 'add'
			},
			initialMistake: {
				type: Object,
				default: function () {
					return null
				}
			},
			subjectOptions: {
				type: Array,
				default: function () {
					return ['高数', '线代', '概率']
				}
			},
			customSubjects: {
				type: Array,
				default: function () {
					return []
				}
			},
			customChapters: {
				type: Object,
				default: function () {
					return {}
				}
			},
			customErrorTypes: {
				type: Array,
				default: function () {
					return []
				}
			},
			errorTypeOptions: {
				type: Array,
				default: function () {
					return ['思路错', '计算错', '公式忘记', '审题失误']
				}
			},
			difficultyOptions: {
				type: Array,
				default: function () {
					return ['简单', '中等', '偏难']
				}
			}
		},
		emits: ['navigate', 'show-detail', 'data-changed'],
		data() {
			return {
				form: {
					questionImage: '',
					answerImage: '',
					subject: '高数',
					chapter: '极限',
					errorType: '思路错',
					difficulty: '中等',
					source: '',
					note: ''
				},
				editForm: null,
				editingMistakeId: null,
				imageSaving: false
			}
		},
		created() {
			if (this.mode === 'edit' && this.initialMistake) {
				this.editingMistakeId = this.initialMistake.id
				this.editForm = {
					questionImage: this.initialMistake.questionImage || '',
					answerImage: this.initialMistake.answerImage || '',
					subject: this.initialMistake.subject || '高数',
					chapter: this.initialMistake.chapter || '',
					errorType: this.initialMistake.errorType || '思路错',
					difficulty: this.initialMistake.difficulty || '中等',
					source: this.initialMistake.source || '',
					note: this.initialMistake.note || ''
				}
			}
		},
		computed: {
			subjectOptionsAll() {
				return this.subjectOptions.concat(this.customSubjects)
			},
			errorTypeOptionsAll() {
				return this.errorTypeOptions.concat(this.customErrorTypes)
			},
			chaptersForForm() {
				return this.getChaptersForSubject(this.form.subject)
			},
			editChaptersForForm() {
				if (!this.editForm) return []
				return this.getChaptersForSubject(this.editForm.subject)
			}
		},
		methods: {
			getChaptersForSubject(subject) {
				var defaults = DEFAULT_CHAPTERS[subject] || ['极限']
				var customs = this.customChapters[subject] || []
				return defaults.concat(customs)
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
			chooseQuestionImage() {
				this.chooseImage('questionImage')
			},
			chooseAnswerImage() {
				this.chooseImage('answerImage')
			},
			chooseEditQuestionImage() {
				this.chooseEditImage('questionImage')
			},
			chooseEditAnswerImage() {
				this.chooseEditImage('answerImage')
			},
			chooseImage(field) {
				var self = this
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async function (res) {
						var filePath = res.tempFilePaths[0]
						self.imageSaving = true
						var result = await persistImageFile(filePath)
						self.imageSaving = false
						self.setImageField(field, result.path)
					}
				})
			},
			chooseEditImage(field) {
				var self = this
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async function (res) {
						var filePath = res.tempFilePaths[0]
						self.imageSaving = true
						var result = await persistImageFile(filePath)
						self.imageSaving = false
						self.editForm[field] = result.path
					}
				})
			},
			setImageField(field, filePath) {
				this.form[field] = filePath
			},
			addCustomOption(type) {
				var self = this
				var title = ''
				var placeholder = ''
				if (type === 'subject') {
					title = '添加自定义科目'
					placeholder = '请输入科目名称'
				} else if (type === 'chapter') {
					title = '添加自定义章节'
					placeholder = '请输入章节名称'
				} else if (type === 'errorType') {
					title = '添加自定义错因'
					placeholder = '请输入错因类型'
				}
				uni.showModal({
					title: title,
					editable: true,
					placeholderText: placeholder,
					success: function (res) {
						if (res.confirm && res.content && res.content.trim()) {
							var value = res.content.trim()
							var co = getCustomOptions()
							if (type === 'subject') {
								if (co.subjects.indexOf(value) < 0) {
									co.subjects.push(value)
								}
							} else if (type === 'chapter') {
								var subject = self.mode === 'add' ? self.form.subject : (self.editForm ? self.editForm.subject : '高数')
								if (!co.chapters[subject]) {
									co.chapters[subject] = []
								}
								if (co.chapters[subject].indexOf(value) < 0) {
									co.chapters[subject].push(value)
								}
							} else if (type === 'errorType') {
								if (co.errorTypes.indexOf(value) < 0) {
									co.errorTypes.push(value)
								}
							}
							saveCustomOptions(co)
							self.$emit('data-changed')
						}
					}
				})
			},
			saveMistake() {
				if (!this.form.questionImage) {
					return this.toast('请上传题目图片')
				}
				if (!this.form.answerImage) {
					return this.toast('请上传答案图片')
				}
				var mistake = createMistake(this.form)
				this.resetForm()
				this.$emit('data-changed')
				this.$emit('show-detail', mistake)
			},
			saveEdit() {
				if (!this.editForm) return
				if (!this.editForm.questionImage) {
					return this.toast('请上传题目图片')
				}
				if (!this.editForm.answerImage) {
					return this.toast('请上传答案图片')
				}
				updateMistake(this.editingMistakeId, {
					questionImage: this.editForm.questionImage,
					answerImage: this.editForm.answerImage,
					subject: this.editForm.subject,
					chapter: this.editForm.chapter,
					errorType: this.editForm.errorType,
					difficulty: this.editForm.difficulty,
					source: this.editForm.source,
					note: this.editForm.note
				})
				this.$emit('data-changed')
				this.$emit('navigate', 'library')
			},
			cancelEdit() {
				this.editForm = null
				this.editingMistakeId = null
				this.$emit('navigate', 'library')
			},
			resetForm() {
				this.form = {
					questionImage: '',
					answerImage: '',
					subject: '高数',
					chapter: '极限',
					errorType: '思路错',
					difficulty: '中等',
					source: '',
					note: ''
				}
			},
			previewSingleImage(filePath) {
				previewImages([filePath], filePath)
			},
			toast(title) {
				uni.showToast({
					title: title,
					icon: 'none'
				})
			}
		}
	}
</script>

<style>
	/* ---- Add Content ---- */
	.add-content {
		padding: 14px 16px;
	}

	.upload-box {
		width: 100%;
		height: 160px;
		background: #FFFFFF;
		border: 2px dashed #D6D3D1;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		margin-bottom: 12px;
		position: relative;
		overflow: hidden;
	}

	.upload-preview {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.upload-change {
		position: absolute;
		bottom: 8px;
		right: 8px;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 8px;
		padding: 4px 10px;
		cursor: pointer;
	}

	.upload-change text {
		font-size: 11px;
		color: #FFFFFF;
	}

	.upload-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.upload-icon {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #F5F0EB;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 4px;
	}

	.upload-icon text {
		font-size: 20px;
		color: #A8A29E;
	}

	.upload-title {
		font-size: 14px;
		font-weight: 600;
		color: #44403C;
	}

	.upload-desc {
		font-size: 12px;
		color: #A8A29E;
	}
</style>
