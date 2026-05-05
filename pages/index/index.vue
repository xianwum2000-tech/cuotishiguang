<template>
	<view class="app">
		<view class="phone">
			<view v-if="screen === 'home'" class="screen screen-cream">
				<view class="topbar">
					<view class="brand-row">
						<view class="avatar avatar-ring">
							<image class="avatar-img" :src="preferences.homeAvatar" mode="aspectFill"></image>
						</view>
						<text class="brand-title">{{ preferences.homeTitle }}</text>
					</view>
				</view>

				<view class="page-content home-content">
					<view class="greeting-block">
						<text class="home-title">{{ preferences.greetingTitle }}</text>
						<text class="home-subtitle">准备好提升你的技能了吗？</text>
					</view>

					<view class="status-grid">
						<view class="stat-card stat-primary">
							<text class="stat-label stat-label-light">今日待复习</text>
							<text class="stat-number stat-number-light">{{ dueCount }}</text>
						</view>
						<view class="stat-card stat-surface stat-middle">
							<text class="stat-label stat-label-red">已逾期</text>
							<text class="stat-number stat-number-red">{{ overdueCount }}</text>
						</view>
						<view class="stat-card stat-surface">
							<text class="stat-label stat-label-muted">错题总数</text>
							<text class="stat-number stat-number-dark">{{ totalCount }}</text>
						</view>
					</view>

					<view class="study-actions">
						<view class="add-mistake-button" @click="showAdd">
							<text class="add-symbol">＋</text>
							<text class="add-text">新增错题</text>
						</view>
						<view class="review-start-button" @click="showToday">
							<view class="play-circle">
								<text class="play-symbol">▶</text>
							</view>
							<text class="review-start-text">开始复习</text>
						</view>
					</view>

					<view class="section-head">
						<text class="section-title">建议优先级</text>
						<text class="section-link" @click="showToday">查看全部</text>
					</view>

					<view v-if="priorityList.length === 0" class="empty-card soft-card">
						<text class="empty-title">今天暂无复习任务</text>
						<text class="empty-sub">新增错题后，系统会从 2 天后开始自动安排复习。</text>
					</view>

					<view
						v-for="item in priorityList"
						:key="item.id"
						:class="priorityCardClass(item)"
						@click="startReview(item)"
					>
						<view :class="priorityIconClass(item)">
							<text>{{ priorityLabel(item) }}</text>
						</view>
						<view class="priority-copy">
							<text class="priority-title">{{ item.subject }} · {{ item.chapter }}</text>
							<text class="priority-meta">错因：{{ item.errorType }}｜{{ stageLabel(item.reviewStage) }}</text>
						</view>
						<view class="priority-pill">
							<text>{{ formatDueText(item) }}</text>
						</view>
					</view>
				</view>
			</view>

			<view v-if="screen === 'add'" class="screen screen-cream">
				<view class="topbar compact-topbar">
					<view class="brand-row">
						<view class="avatar small-avatar">
							<image class="avatar-img" src="/static/stitch_assets/avatar-add.jpg" mode="aspectFill"></image>
						</view>
						<text class="brand-title small-brand">ReviewMaster</text>
					</view>
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

					<view class="form-card soft-card">
						<text class="field-label">选择科目</text>
						<view class="chip-row">
							<view
								v-for="subject in subjectOptions"
								:key="subject"
								:class="form.subject === subject ? 'subject-chip subject-active' : 'subject-chip'"
								@click="selectFormSubject(subject)"
							>
								<text>{{ subject }}</text>
							</view>
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
						</view>

						<text class="field-label field-space">选择错因</text>
						<view class="chip-row">
							<view
								v-for="errorType in errorTypeOptions"
								:key="errorType"
								:class="form.errorType === errorType ? 'subject-chip subject-active' : 'subject-chip'"
								@click="setFormError(errorType)"
							>
								<text>{{ errorType }}</text>
							</view>
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

						<text class="field-label field-space">备注</text>
						<textarea class="note-field" v-model="form.note" placeholder="例如：换元后忘记乘内函数导数"></textarea>
					</view>

					<view class="save-button" @click="saveMistake">
						<text class="save-icon">▣</text>
						<text>保存错题</text>
					</view>
				</view>
			</view>

			<view v-if="screen === 'today'" class="screen screen-cream">
				<view class="topbar compact-topbar">
					<view class="brand-row">
						<view class="avatar small-avatar">
							<image class="avatar-img" :src="preferences.homeAvatar" mode="aspectFill"></image>
						</view>
						<text class="brand-title small-brand">今日复习</text>
					</view>
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
						@click="startReview(item)"
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

			<view v-if="screen === 'review'" class="screen screen-lilac review-screen">
				<view class="topbar">
					<view class="brand-row">
						<view class="avatar avatar-ring">
							<image class="avatar-img" :src="preferences.homeAvatar" mode="aspectFill"></image>
						</view>
						<text class="brand-title">复习进行中</text>
					</view>
					<text class="gear" @click="showToday">×</text>
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

			<view v-if="screen === 'library'" class="screen screen-cream">
				<view class="topbar compact-topbar">
					<view class="brand-row">
						<view class="avatar small-avatar">
							<image class="avatar-img" :src="preferences.homeAvatar" mode="aspectFill"></image>
						</view>
						<text class="brand-title small-brand">错题达人</text>
					</view>
					<text class="gear small-gear" @click="showAdd">＋</text>
				</view>

				<view class="page-content library-content">
					<view class="search-row">
						<view class="search-box">
							<text class="search-icon">⌕</text>
							<input class="search-input" v-model="libraryKeyword" placeholder="搜索章节、错因、备注..." />
						</view>
						<view class="filter-button" @click="showAdd">
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
						@click="showDetail(item)"
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

			<view v-if="screen === 'detail'" class="screen screen-cream">
				<view class="topbar compact-topbar">
					<view class="brand-row">
						<view class="back-button" @click="showLibrary"><text>‹</text></view>
						<text class="brand-title small-brand">错题详情</text>
					</view>
					<text class="gear small-gear" @click="archiveActiveDetail">归档</text>
				</view>

				<view v-if="hasActiveDetail" class="page-content detail-content">
					<view class="detail-card soft-card">
						<text class="mistake-title">{{ activeDetail.subject }} · {{ activeDetail.chapter }}</text>
						<text class="mistake-desc">错因：{{ activeDetail.errorType }}｜难度：{{ activeDetail.difficulty }}</text>
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
							<text class="record-main">{{ record.reviewDate }} · {{ resultLabel(record.result) }}</text>
							<text class="record-sub">{{ stageLabel(record.stageBefore) }} → {{ stageLabel(record.stageAfter) }}，下次 {{ record.nextReviewDate }}</text>
						</view>
					</view>
				</view>
			</view>

			<view v-if="screen === 'stats'" class="screen screen-lilac">
				<view class="topbar compact-topbar">
					<view class="brand-row">
						<view class="avatar small-avatar">
							<image class="avatar-img" :src="preferences.homeAvatar" mode="aspectFill"></image>
						</view>
						<text class="brand-title small-brand">{{ preferences.statsName }}</text>
					</view>
					<text class="gear small-gear" @click="showSettings">⚙</text>
				</view>

				<view class="page-content stats-content">
					<view class="user-hero-card soft-card">
						<view class="user-avatar-ring">
							<image class="user-avatar-large" :src="preferences.homeAvatar" mode="aspectFill"></image>
						</view>
						<text class="user-display-name">{{ preferences.statsName }}</text>
						<text class="user-slogan">考研数学 · 错题复习记录</text>
						<view class="user-stat-trio">
							<view class="user-stat-cell">
								<text class="user-stat-num">{{ totalCount }}</text>
								<text class="user-stat-label">总错题</text>
							</view>
							<view class="user-stat-divider"></view>
							<view class="user-stat-cell">
								<text class="user-stat-num">{{ dueCount }}</text>
								<text class="user-stat-label">待复习</text>
							</view>
							<view class="user-stat-divider"></view>
							<view class="user-stat-cell">
								<text class="user-stat-num">{{ masteredCount }}</text>
								<text class="user-stat-label">已掌握</text>
							</view>
						</view>
					</view>

					<view class="insight-card soft-card weekly-card">
						<view class="weekly-head">
							<view>
								<text class="weekly-title">最近7天复习情况</text>
								<text class="weekly-sub">每天完成后会写入本地复习记录。</text>
							</view>
							<view class="weekly-total">
								<text class="weekly-total-number">{{ records.length }}</text>
								<text class="weekly-total-label">累计记录</text>
							</view>
						</view>
						<view class="bars-row">
							<view v-for="bar in weeklyBars" :key="bar.date" class="bar-col">
								<view class="bar-fill" :style="barHeightStyle(bar)"></view>
								<text>{{ bar.label }}</text>
							</view>
						</view>
					</view>

					<view class="insight-card soft-card">
						<text class="section-title">各章节错题分布</text>
						<view v-for="item in chapterStats" :key="item.name" class="dist-line">
							<text class="dist-name">{{ item.name }}</text>
							<view class="dist-track"><view class="dist-fill" :style="distWidthStyle(item)"></view></view>
							<text class="dist-count">{{ item.count }}</text>
						</view>
					</view>

					<view class="insight-card soft-card">
						<text class="section-title">各错因分布</text>
						<view v-for="item in errorStats" :key="item.name" class="dist-line">
							<text class="dist-name">{{ item.name }}</text>
							<view class="dist-track"><view class="dist-fill dist-fill-red" :style="distWidthStyle(item)"></view></view>
							<text class="dist-count">{{ item.count }}</text>
						</view>
					</view>

					<view class="insight-card soft-card version-card">
						<text class="section-title">版本更新</text>
						<text class="profile-line">当前版本 {{ appVersion.name }}（{{ appVersion.code }}）</text>
						<text class="profile-line version-source">更新源：{{ updateSourceText }}</text>
						<view v-if="latestVersion.versionCode > appVersion.code" class="version-update-hint">
							<text class="version-new-label">发现新版 {{ latestVersion.versionName }}</text>
							<text class="version-changelog">{{ latestVersion.changelog || '暂无更新说明' }}</text>
							<view class="secondary-button" @click="installLatestVersion(latestVersion)" v-if="!updateDownloading">
								<text>下载并安装</text>
							</view>
							<view v-if="updateDownloading" class="download-status">
								<view class="progress-track"><view class="progress-fill" :style="updateProgressStyle"></view></view>
								<text class="download-percent">{{ updateProgress }}%</text>
							</view>
						</view>
						<view class="secondary-button" @click="checkAppUpdate(false)" v-if="!updateDownloading && latestVersion.versionCode <= appVersion.code">
							<text>{{ updateChecking ? '检查中...' : '检查更新' }}</text>
						</view>
					</view>
				</view>
			</view>

			<view v-if="screen === 'profile'" class="screen screen-cream">
				<view class="topbar compact-topbar">
					<view class="brand-row">
						<view class="avatar small-avatar">
							<image class="avatar-img" :src="preferences.homeAvatar" mode="aspectFill"></image>
						</view>
						<text class="brand-title small-brand">我的</text>
					</view>
				</view>
				<view class="page-content">
					<view class="profile-card soft-card">
						<text class="page-title">本地错题调度器</text>
						<text class="page-subtitle">离线可用 · 无账号 · 无题库 · 无 AI 识别</text>
					</view>

					<view class="profile-card soft-card">
						<text class="page-title">版本管理</text>
						<text class="page-subtitle">当前版本 {{ appVersion.name }}（{{ appVersion.code }}）</text>
						<text class="profile-line">包名：{{ appVersion.packageName }}</text>
						<text class="profile-line">更新源：{{ updateSourceText }}</text>
						<view v-if="latestVersion.versionCode > 0" class="update-note">
							<text>发现新版 {{ latestVersion.versionName }}：{{ latestVersion.changelog || '暂无更新说明' }}</text>
						</view>
						<view v-if="updateDownloading" class="update-progress">
							<view class="update-progress-fill" :style="updateProgressStyle"></view>
						</view>
						<text v-if="updateDownloading" class="profile-line">正在下载 {{ updateProgress }}%</text>
						<view class="secondary-button" @click="checkAppUpdate(false)">
							<text>{{ updateChecking ? '检查中...' : '检查更新' }}</text>
						</view>
					</view>
				</view>
			</view>

			<view v-if="screen === 'settings'" class="screen screen-cream">
				<view class="topbar compact-topbar">
					<view class="brand-row">
						<view class="back-button" @click="showHome"><text>‹</text></view>
						<text class="brand-title small-brand">首页设置</text>
					</view>
					<text class="gear small-gear" @click="saveHomeSettings">保存</text>
				</view>

				<view class="page-content settings-content">
					<view class="page-heading">
						<text class="page-title">自定义首页文案</text>
						<text class="page-subtitle">只影响本机显示，离线保存在本地。</text>
					</view>

					<view class="settings-card soft-card">
						<text class="field-label">首页头像</text>
						<view class="settings-avatar-row" @click="chooseHomeAvatar">
							<view class="settings-avatar avatar-ring">
								<image class="avatar-img" :src="settingsForm.homeAvatar" mode="aspectFill"></image>
							</view>
							<view class="settings-avatar-copy">
								<text class="settings-avatar-title">点击上传头像</text>
								<text class="settings-avatar-sub">支持相册或拍照，保存后首页生效</text>
							</view>
						</view>

						<text class="field-label">顶部标题</text>
						<input class="settings-input" v-model="settingsForm.homeTitle" placeholder="例如：复习达人" />

						<text class="field-label field-space">首页问候语</text>
						<input class="settings-input" v-model="settingsForm.greetingTitle" placeholder="例如：早上好，小明" />

						<text class="field-label field-space">统计页姓名</text>
						<input class="settings-input" v-model="settingsForm.statsName" placeholder="例如：小明" />
					</view>

					<view class="settings-preview soft-card">
						<text class="preview-label">预览</text>
						<view class="preview-brand-row">
							<view class="avatar avatar-ring">
								<image class="avatar-img" :src="settingsForm.homeAvatar" mode="aspectFill"></image>
							</view>
							<text class="brand-title preview-brand">{{ previewHomeTitle }}</text>
						</view>
						<text class="home-title preview-greeting">{{ previewGreetingTitle }}</text>
						<text class="home-subtitle">准备好提升你的技能了吗？</text>
						<text class="preview-stats-title">{{ previewStatsName }}的学习洞察</text>
					</view>

					<view class="save-button" @click="saveHomeSettings">
						<text>保存设置</text>
					</view>
					<view class="secondary-button" @click="resetHomeSettings">
						<text>恢复默认</text>
					</view>
				</view>
			</view>

			<view class="bottom-nav">
				<view :class="homeNavClass" @click="showHome">
					<text class="nav-icon">▢</text>
					<text class="nav-label">首页</text>
				</view>
				<view :class="reviewNavClass" @click="showToday">
					<text class="nav-icon">▶</text>
					<text class="nav-label">复习</text>
				</view>
				<view :class="libraryNavClass" @click="showLibrary">
					<text class="nav-icon">▱</text>
					<text class="nav-label">错题</text>
				</view>
				<view :class="screen === 'stats' ? 'nav-item nav-active' : 'nav-item'" @click="showStats">
					<text class="nav-icon">◎</text>
					<text class="nav-label">用户</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { addDays, daysBetween, todayKey } from '@/utils/date.js'
	import {
		getDueMistakes,
		getOverdueMistakes,
		getResultLabel,
		getStageLabel,
		getOverdueDays,
		sortMistakesByPriority
	} from '@/utils/scheduler.js'
	import {
		archiveMistake,
		completeReview,
		createMistake,
		getMistakes,
		getPreferences,
		getReviewRecords,
		savePreferences,
		updateMistake
	} from '@/utils/storage.js'
	import { persistImageFile, previewImages } from '@/utils/file.js'
	import { checkForUpdate, downloadAndInstallApk, getUpdateRuntimeInfo } from '@/utils/updater.js'

	function createDefaultPreferences() {
		return {
			homeTitle: '复习达人',
			greetingTitle: '早上好，小明',
			homeAvatar: '/static/stitch_assets/avatar-home.jpg',
			statsName: '小明'
		}
	}

	function createDefaultForm() {
		return {
			questionImage: '',
			answerImage: '',
			subject: '高数',
			chapter: '极限',
			errorType: '思路错',
			difficulty: '中等',
			note: ''
		}
	}

	function createEmptyMistake() {
		return {
			id: '',
			questionImage: '',
			answerImage: '',
			subject: '',
			chapter: '',
			errorType: '',
			difficulty: '',
			note: '',
			createdAt: '',
			updatedAt: '',
			reviewStage: 'new',
			nextReviewDate: '',
			totalReviewCount: 0,
			totalWrongCount: 0,
			lastReviewResult: '',
			isArchived: false
		}
	}

	export default {
		data() {
			return {
				screen: 'home',
				mistakes: [],
				records: [],
				appVersion: getUpdateRuntimeInfo().current,
				updateConfigured: getUpdateRuntimeInfo().configured,
				updateManifestUrl: getUpdateRuntimeInfo().manifestUrl,
				updateChecking: false,
				updateDownloading: false,
				updateProgress: 0,
				latestVersion: {
					versionName: '',
					versionCode: 0,
					apkUrl: '',
					changelog: '',
					force: false
				},
				preferences: createDefaultPreferences(),
				settingsForm: createDefaultPreferences(),
				activeReview: createEmptyMistake(),
				activeDetail: createEmptyMistake(),
				hasActiveReview: false,
				hasActiveDetail: false,
				answerVisible: false,
				reviewQuestionImageBroken: false,
				reviewAnswerImageBroken: false,
				todaySubject: '全部',
				todayChapter: '全部',
				librarySubject: '全部',
				libraryError: '全部',
				libraryKeyword: '',
				imageSaving: false,
				imageMigrationDone: false,
				subjectOptions: ['高数', '线代', '概率'],
				errorTypeOptions: ['思路错', '计算错', '公式忘记', '审题失误'],
				difficultyOptions: ['简单', '中等', '偏难'],
				form: createDefaultForm()
			}
		},
		computed: {
			currentDate() {
				return todayKey()
			},
			activeMistakes() {
				return this.mistakes.filter((item) => !item.isArchived)
			},
			totalCount() {
				return this.activeMistakes.length
			},
			dueList() {
				return getDueMistakes(this.activeMistakes, this.currentDate)
			},
			dueCount() {
				return this.dueList.length
			},
			overdueCount() {
				return getOverdueMistakes(this.activeMistakes, this.currentDate).length
			},
			masteredCount() {
				return this.activeMistakes.filter((item) => item.reviewStage === 'pass3' && item.lastReviewResult === 'known').length
			},
			priorityList() {
				return this.dueList.slice(0, 3)
			},
			chaptersForForm() {
				return this.getChaptersForSubject(this.form.subject)
			},
			filterSubjects() {
				return ['全部'].concat(this.subjectOptions)
			},
			filterChapters() {
				const names = ['全部']
				this.activeMistakes.forEach((item) => {
					if (item.chapter && names.indexOf(item.chapter) < 0) names.push(item.chapter)
				})
				return names
			},
			filterErrors() {
				return ['全部'].concat(this.errorTypeOptions)
			},
			filteredTodayList() {
				return this.dueList.filter((item) => {
					const subjectMatch = this.todaySubject === '全部' || item.subject === this.todaySubject
					const chapterMatch = this.todayChapter === '全部' || item.chapter === this.todayChapter
					return subjectMatch && chapterMatch
				})
			},
			libraryList() {
				const keyword = this.libraryKeyword.trim()
				const filtered = this.activeMistakes.filter((item) => {
					const subjectMatch = this.librarySubject === '全部' || item.subject === this.librarySubject
					const errorMatch = this.libraryError === '全部' || item.errorType === this.libraryError
					const note = item.note || ''
					const keywordMatch =
						keyword.length === 0 ||
						item.chapter.indexOf(keyword) >= 0 ||
						item.errorType.indexOf(keyword) >= 0 ||
						note.indexOf(keyword) >= 0
					return subjectMatch && errorMatch && keywordMatch
				})
				return sortMistakesByPriority(filtered, this.currentDate)
			},
			detailRecords() {
				if (!this.hasActiveDetail) return []
				return this.records.filter((record) => record.questionId === this.activeDetail.id)
			},
			weeklyBars() {
				const bars = []
				const labels = ['一', '二', '三', '四', '五', '六', '日']
				for (let index = 6; index >= 0; index--) {
					const date = addDays(this.currentDate, -index)
					const count = this.records.filter((record) => record.reviewDate === date).length
					const day = new Date(date).getDay()
					bars.push({
						date,
						count,
						label: labels[day === 0 ? 6 : day - 1],
						height: Math.max(8, Math.min(96, count * 18))
					})
				}
				return bars
			},
			chapterStats() {
				return this.buildDistribution('chapter')
			},
			errorStats() {
				return this.buildDistribution('errorType')
			},
			previewHomeTitle() {
				return this.settingsForm.homeTitle || '复习达人'
			},
			previewGreetingTitle() {
				return this.settingsForm.greetingTitle || '早上好，小明'
			},
			previewStatsName() {
				return this.settingsForm.statsName || '小明'
			},
			updateSourceText() {
				return this.updateConfigured ? 'GitHub Releases' : '未配置 GitHub 仓库'
			},
			updateProgressStyle() {
				return 'width: ' + this.updateProgress + '%'
			},
			homeNavClass() {
				return this.screen === 'home' || this.screen === 'settings' ? 'nav-item nav-active' : 'nav-item'
			},
			reviewNavClass() {
				return this.screen === 'today' || this.screen === 'review' ? 'nav-item nav-active' : 'nav-item'
			},
			libraryNavClass() {
				return this.screen === 'library' || this.screen === 'detail' || this.screen === 'add' ? 'nav-item nav-active' : 'nav-item'
			}
		},
		onLoad() {
			this.refreshData()
			this.migrateStoredImages()
			setTimeout(() => {
				this.checkAppUpdate(true)
			}, 1500)
		},
		methods: {
			refreshData() {
				this.mistakes = getMistakes()
				this.records = getReviewRecords()
				this.preferences = getPreferences()
				const runtimeInfo = getUpdateRuntimeInfo()
				this.appVersion = runtimeInfo.current
				this.updateConfigured = runtimeInfo.configured
				this.updateManifestUrl = runtimeInfo.manifestUrl
			},
			async migrateStoredImages() {
				if (this.imageMigrationDone) return
				this.imageMigrationDone = true
				let hasChanged = false

				for (let index = 0; index < this.mistakes.length; index++) {
					const item = this.mistakes[index]
					const question = await persistImageFile(item.questionImage)
					const answer = await persistImageFile(item.answerImage)
					const patch = {}
					if (question.changed) patch.questionImage = question.path
					if (answer.changed) patch.answerImage = answer.path
					if (Object.keys(patch).length > 0) {
						updateMistake(item.id, patch)
						hasChanged = true
					}
				}

				const avatar = await persistImageFile(this.preferences.homeAvatar)
				if (avatar.changed) {
					this.preferences = savePreferences({
						...this.preferences,
						homeAvatar: avatar.path
					})
					hasChanged = true
				}

				if (hasChanged) this.refreshData()
			},
			showHome() {
				this.refreshData()
				this.screen = 'home'
			},
			showAdd() {
				this.screen = 'add'
			},
			showToday() {
				this.refreshData()
				this.screen = 'today'
			},
			showLibrary() {
				this.refreshData()
				this.screen = 'library'
			},
			showStats() {
				this.refreshData()
				this.screen = 'stats'
			},
			showProfile() {
				this.refreshData()
				this.screen = 'profile'
			},
			showSettings() {
				this.preferences = getPreferences()
				this.settingsForm = {
					homeTitle: this.preferences.homeTitle,
					greetingTitle: this.preferences.greetingTitle,
					homeAvatar: this.preferences.homeAvatar,
					statsName: this.preferences.statsName
				}
				this.screen = 'settings'
			},
			saveHomeSettings() {
				const homeTitle = this.settingsForm.homeTitle.trim()
				const greetingTitle = this.settingsForm.greetingTitle.trim()
				const statsName = this.settingsForm.statsName.trim()
				if (!homeTitle || !greetingTitle || !statsName) {
					this.toast('标题、问候语和统计页姓名不能为空')
					return
				}
				const defaults = createDefaultPreferences()
				this.preferences = savePreferences({
					homeTitle,
					greetingTitle,
					homeAvatar: this.settingsForm.homeAvatar || defaults.homeAvatar,
					statsName
				})
				this.toast('首页文案已保存')
				this.screen = 'home'
			},
			resetHomeSettings() {
				this.settingsForm = createDefaultPreferences()
				this.preferences = savePreferences(this.settingsForm)
				this.toast('已恢复默认')
				this.screen = 'home'
			},
			async checkAppUpdate(silent) {
				if (this.updateChecking || this.updateDownloading) return
				this.updateChecking = true
				const result = await checkForUpdate()
				this.updateChecking = false
				this.appVersion = result.current || this.appVersion

				if (!result.ok) {
					if (!silent) this.toast(this.updateErrorText(result.reason))
					return
				}

				if (!result.hasUpdate) {
					this.latestVersion = {
						versionName: '',
						versionCode: 0,
						apkUrl: '',
						changelog: '',
						force: false
					}
					if (!silent) this.toast('当前已是最新版本')
					return
				}

				this.latestVersion = result.remote
				this.showUpdateDialog(result.remote)
			},
			updateErrorText(reason) {
				if (reason === 'not-configured') return '还未配置 GitHub Releases 更新地址'
				if (reason === 'bad-manifest') return '更新配置格式不正确'
				if (reason === 'package-mismatch') return '更新包名不一致，已阻止安装'
				if (reason === 'network') return '检查更新失败，请稍后重试'
				return '检查更新失败'
			},
			showUpdateDialog(remote) {
				const content = remote.changelog || '检测到新版本，是否立即下载安装？'
				uni.showModal({
					title: '发现新版本 ' + remote.versionName,
					content,
					confirmText: '立即更新',
					cancelText: '稍后',
					showCancel: !remote.force,
					success: (res) => {
						if (res.confirm) this.installLatestVersion(remote)
					}
				})
			},
			async installLatestVersion(remote) {
				this.updateDownloading = true
				this.updateProgress = 0
				try {
					await downloadAndInstallApk(remote, (progress) => {
						this.updateProgress = Math.max(0, Math.min(100, progress))
					})
					this.updateDownloading = false
					this.toast('已调起安装，请按提示覆盖安装')
				} catch (error) {
					this.updateDownloading = false
					this.toast('下载或安装失败，请稍后重试')
				}
			},
			getChaptersForSubject(subject) {
				if (subject === '线代') return ['行列式', '矩阵', '向量', '线性方程组', '特征值']
				if (subject === '概率') return ['随机事件', '随机变量', '数字特征', '大数定律', '参数估计']
				return ['极限', '导数', '积分', '级数', '多元函数']
			},
			selectFormSubject(subject) {
				this.form.subject = subject
				this.form.chapter = this.getChaptersForSubject(subject)[0]
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
			setTodaySubject(subject) {
				this.todaySubject = subject
			},
			setTodayChapter(chapter) {
				this.todayChapter = chapter
			},
			setLibrarySubject(subject) {
				this.librarySubject = subject
			},
			setLibraryError(errorType) {
				this.libraryError = errorType
			},
			chooseQuestionImage() {
				this.chooseImage('questionImage')
			},
			chooseAnswerImage() {
				this.chooseImage('answerImage')
			},
			chooseHomeAvatar() {
				this.chooseImage('homeAvatar')
			},
			chooseImage(field) {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async (res) => {
						if (!res.tempFilePaths || res.tempFilePaths.length === 0) return
						const tempFilePath = res.tempFilePaths[0]
						this.imageSaving = true
						const output = await persistImageFile(tempFilePath)
						this.setImageField(field, output.path)
						this.imageSaving = false
						if (!output.persisted && field !== 'homeAvatar') {
							this.toast('图片已选中；保存失败时会保留原路径')
						}
					},
					fail: () => {
						this.imageSaving = false
					}
				})
			},
			setImageField(field, filePath) {
				if (field === 'questionImage') this.form.questionImage = filePath
				if (field === 'answerImage') this.form.answerImage = filePath
				if (field === 'homeAvatar') this.settingsForm.homeAvatar = filePath
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
				const mistake = createMistake({ ...this.form })
				this.resetForm()
				this.refreshData()
				this.toast('已保存，2天后开始复习')
				this.showDetail(mistake)
			},
			resetForm() {
				this.form = createDefaultForm()
			},
			startFirstReview() {
				if (this.filteredTodayList.length === 0) {
					this.toast('当前筛选下没有待复习错题')
					return
				}
				this.startReview(this.filteredTodayList[0])
			},
			startReview(item) {
				this.activeReview = item
				this.hasActiveReview = true
				this.answerVisible = false
				this.reviewQuestionImageBroken = false
				this.reviewAnswerImageBroken = false
				this.screen = 'review'
			},
			revealAnswer() {
				this.answerVisible = true
			},
			submitReview(result) {
				if (!this.hasActiveReview) return
				const currentId = this.activeReview.id
				const output = completeReview(currentId, result)
				if (!output) {
					this.toast('复习记录保存失败')
					return
				}
				this.refreshData()
				this.toast('已记录：' + this.resultLabel(result))
				const next = this.filteredTodayList.find((item) => item.id !== currentId)
				if (next) {
					this.activeReview = next
					this.hasActiveReview = true
					this.answerVisible = false
					this.reviewQuestionImageBroken = false
					this.reviewAnswerImageBroken = false
				} else {
					this.activeReview = createEmptyMistake()
					this.hasActiveReview = false
					this.answerVisible = false
					this.reviewQuestionImageBroken = false
					this.reviewAnswerImageBroken = false
					this.screen = 'today'
				}
			},
			showDetail(item) {
				this.refreshData()
				this.activeDetail = this.mistakes.find((mistake) => mistake.id === item.id) || item
				this.hasActiveDetail = true
				this.screen = 'detail'
			},
			replaceDetailImage(field) {
				if (!this.hasActiveDetail) return
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async (res) => {
						if (!res.tempFilePaths || res.tempFilePaths.length === 0) return
						this.imageSaving = true
						const output = await persistImageFile(res.tempFilePaths[0])
						const updated = updateMistake(this.activeDetail.id, {
							[field]: output.path
						})
						this.imageSaving = false
						this.refreshData()
						this.activeDetail = updated || this.activeDetail
						if (this.hasActiveReview && this.activeReview.id === this.activeDetail.id) {
							this.activeReview = this.activeDetail
							if (field === 'questionImage') this.reviewQuestionImageBroken = false
							if (field === 'answerImage') this.reviewAnswerImageBroken = false
						}
						this.toast('图片已更新')
					},
					fail: () => {
						this.imageSaving = false
					}
				})
			},
			archiveActiveDetail() {
				if (!this.hasActiveDetail) return
				archiveMistake(this.activeDetail.id)
				this.refreshData()
				this.activeDetail = createEmptyMistake()
				this.hasActiveDetail = false
				this.toast('已归档')
				this.screen = 'library'
			},
			buildDistribution(field) {
				const map = {}
				this.activeMistakes.forEach((item) => {
					const key = item[field] || '未分类'
					map[key] = (map[key] || 0) + 1
				})
				const max = Math.max(1, ...Object.keys(map).map((key) => map[key]))
				return Object.keys(map).map((key) => ({
					name: key,
					count: map[key],
					percent: Math.max(8, Math.round((map[key] / max) * 100))
				}))
			},
			priorityLabel(item) {
				if (getOverdueDays(item, this.currentDate) >= 2 || (item.totalWrongCount || 0) >= 3) return '高'
				if (getOverdueDays(item, this.currentDate) >= 1 || (item.totalWrongCount || 0) >= 1) return '中'
				return '低'
			},
			priorityCardClass(item) {
				const label = this.priorityLabel(item)
				if (label === '高') return 'priority-card priority-high soft-card'
				if (label === '中') return 'priority-card priority-mid soft-card'
				return 'priority-card priority-low soft-card'
			},
			priorityIconClass(item) {
				const label = this.priorityLabel(item)
				if (label === '高') return 'priority-icon priority-icon-high'
				if (label === '中') return 'priority-icon priority-icon-mid'
				return 'priority-icon priority-icon-low'
			},
			formatDueText(item) {
				const overdue = getOverdueDays(item, this.currentDate)
				if (overdue > 0) return '逾期' + overdue + '天'
				if (item.nextReviewDate === this.currentDate) return '今日'
				if (!item.nextReviewDate) return '未安排'
				const diff = daysBetween(item.nextReviewDate, this.currentDate)
				return diff + '天后'
			},
			noteText(note) {
				return note || '暂无备注'
			},
			barHeightStyle(bar) {
				return 'height: ' + bar.height + 'px'
			},
			distWidthStyle(item) {
				return 'width: ' + item.percent + '%'
			},
			stageLabel(stage) {
				return getStageLabel(stage)
			},
			resultLabel(result) {
				return getResultLabel(result)
			},
			previewSingleImage(filePath) {
				if (!previewImages([filePath], filePath)) this.toast('暂无可预览图片')
			},
			previewMistakeImages(item, current) {
				const urls = [item.questionImage, item.answerImage]
				if (!previewImages(urls, current)) this.toast('暂无可预览图片')
			},
			previewReviewImage(current) {
				const urls = [this.activeReview.questionImage]
				if (this.answerVisible) urls.push(this.activeReview.answerImage)
				if (!previewImages(urls, current)) this.toast('暂无可预览图片')
			},
			handleImageError(label, field) {
				if (this.screen === 'review') {
					if (field === 'questionImage') this.reviewQuestionImageBroken = true
					if (field === 'answerImage') this.reviewAnswerImageBroken = true
				}
				this.toast(label + '无法读取，可在错题详情里更换图片')
			},
			toast(title) {
				uni.showToast({
					title,
					icon: 'none'
				})
			}
		}
	}
</script>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap");

	page {
		background-color: #FEF9F0;
	}

	view,
	text,
	input,
	textarea {
		box-sizing: border-box;
		font-family: Lexend, "PingFang SC", "Microsoft YaHei", sans-serif;
		letter-spacing: 0;
	}

	.app {
		min-height: 873px;
		background-color: #FDF7FF;
	}

	.phone {
		position: relative;
		width: 100%;
		max-width: 393px;
		min-height: 873px;
		margin: 0 auto;
		overflow-x: hidden;
		color: #1D1B20;
		background-color: #FEF9F0;
	}

	.screen {
		width: 100%;
		min-height: 873px;
		padding-bottom: 116px;
	}

	.screen-cream {
		background-color: #FEF9F0;
	}

	.screen-lilac {
		background-color: #FDF7FF;
	}

	.topbar {
		width: 100%;
		height: 66px;
		padding: 15px 20px 10px;
		background-color: #FEF9F0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.compact-topbar {
		height: 64px;
		padding-top: 12px;
	}

	.brand-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 999px;
		overflow: hidden;
		background-color: #FFFFFF;
		margin-right: 12px;
	}

	.small-avatar {
		width: 32px;
		height: 32px;
		margin-right: 10px;
	}

	.avatar-ring {
		border: 2px solid #4F378A;
	}

	.avatar-img {
		width: 100%;
		height: 100%;
	}

	.brand-title {
		font-size: 19px;
		line-height: 24px;
		font-weight: 900;
		color: #1E293B;
	}

	.small-brand {
		font-size: 15px;
		font-weight: 800;
	}

	.gear {
		min-width: 36px;
		height: 36px;
		text-align: center;
		line-height: 36px;
		color: #6750A4;
		font-size: 24px;
		font-weight: 700;
	}

	.small-gear {
		font-size: 16px;
	}

	.page-content {
		padding-left: 20px;
		padding-right: 20px;
	}

	.home-content {
		padding-top: 20px;
	}

	.greeting-block {
		padding-top: 6px;
		padding-bottom: 16px;
	}

	.home-title {
		display: block;
		font-size: 27px;
		line-height: 36px;
		font-weight: 800;
		color: #171717;
	}

	.home-subtitle {
		display: block;
		margin-top: 3px;
		font-size: 16px;
		line-height: 24px;
		color: #766F6A;
	}

	.soft-card {
		background-color: #FFFFFF;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
	}

	.status-grid {
		display: flex;
		flex-direction: row;
		width: 100%;
		margin-top: 28px;
	}

	.stat-card {
		flex: 1;
		height: 124px;
		border-radius: 28px;
		padding: 22px 8px 14px 16px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}

	.stat-primary,
	.stat-middle {
		margin-right: 10px;
	}

	.stat-primary {
		background-color: #EC8358;
	}

	.stat-surface {
		background-color: #FFFFFF;
	}

	.stat-label {
		display: block;
		font-size: 16px;
		line-height: 20px;
		font-weight: 800;
		white-space: nowrap;
	}

	.stat-label-light {
		color: #FFFFFF;
	}

	.stat-label-red {
		color: #E76B70;
	}

	.stat-label-muted {
		color: #9A827A;
	}

	.stat-number {
		display: block;
		margin-top: 16px;
		font-size: 46px;
		line-height: 48px;
		font-weight: 900;
	}

	.stat-number-light {
		color: #FFFFFF;
	}

	.stat-number-red {
		color: #E76B70;
	}

	.stat-number-dark {
		color: #2B211E;
	}

	.study-actions {
		display: flex;
		flex-direction: row;
		width: 100%;
		margin-top: 40px;
		margin-bottom: 36px;
		align-items: center;
	}

	.add-mistake-button,
	.review-start-button {
		flex: 1;
		height: 64px;
		border-radius: 24px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.add-mistake-button {
		margin-right: 14px;
		background-color: #2B211E;
	}

	.review-start-button {
		background-color: #FFF0E7;
	}

	.add-symbol {
		font-size: 27px;
		line-height: 30px;
		font-weight: 800;
		color: #FFFFFF;
		margin-right: 10px;
	}

	.add-text,
	.review-start-text {
		font-size: 18px;
		line-height: 24px;
		font-weight: 800;
	}

	.add-text {
		color: #FFFFFF;
	}

	.review-start-text {
		color: #EC8358;
	}

	.play-circle {
		width: 34px;
		height: 34px;
		border-radius: 999px;
		border: 3px solid #111111;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
	}

	.play-symbol {
		margin-left: 2px;
		font-size: 15px;
		line-height: 16px;
		color: #111111;
	}

	.section-head {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.section-title {
		font-size: 20px;
		line-height: 28px;
		font-weight: 700;
		color: #1D1B20;
	}

	.section-link {
		font-size: 11px;
		line-height: 16px;
		font-weight: 800;
		color: #4F378A;
	}

	.empty-card {
		border-radius: 26px;
		padding: 22px;
		margin-bottom: 14px;
	}

	.empty-title {
		display: block;
		font-size: 17px;
		line-height: 24px;
		font-weight: 800;
		color: #1D1B20;
	}

	.empty-sub {
		display: block;
		margin-top: 6px;
		font-size: 13px;
		line-height: 20px;
		color: #6E6874;
	}

	.priority-card {
		height: 96px;
		border-radius: 26px;
		margin-bottom: 14px;
		padding: 17px 12px 17px 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.priority-high {
		border-left: 6px solid #F5A623;
	}

	.priority-mid {
		border-left: 6px solid #6750A4;
	}

	.priority-low {
		border-left: 6px solid #C9A74D;
	}

	.priority-icon {
		width: 50px;
		height: 50px;
		border-radius: 999px;
		margin-right: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.priority-icon text {
		font-size: 19px;
		font-weight: 700;
	}

	.priority-icon-high {
		background-color: #FFF7ED;
		color: #F5A623;
	}

	.priority-icon-mid {
		background-color: #FAF5FF;
		color: #6750A4;
	}

	.priority-icon-low {
		background-color: #FEFCE8;
		color: #C9A74D;
	}

	.priority-copy {
		flex: 1;
	}

	.priority-title {
		display: block;
		font-size: 16px;
		line-height: 23px;
		font-weight: 800;
		color: #171717;
	}

	.priority-meta {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		line-height: 18px;
		color: #494551;
	}

	.priority-pill {
		min-width: 50px;
		height: 28px;
		padding-left: 8px;
		padding-right: 8px;
		border-radius: 999px;
		background-color: #F8F2FA;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.priority-pill text {
		font-size: 10px;
		line-height: 14px;
		font-weight: 800;
		color: #494551;
	}

	.add-content,
	.today-content,
	.library-content,
	.detail-content,
	.stats-content,
	.settings-content {
		padding-top: 12px;
		padding-bottom: 24px;
	}

	.page-heading {
		margin-bottom: 18px;
	}

	.page-title {
		display: block;
		font-size: 25px;
		line-height: 34px;
		font-weight: 800;
		color: #1D1B20;
	}

	.page-subtitle {
		display: block;
		font-size: 12px;
		line-height: 18px;
		font-weight: 600;
		color: #7B7480;
	}

	.upload-box {
		position: relative;
		height: 196px;
		border-radius: 30px;
		border: 2px dashed #CBC4D2;
		margin-bottom: 14px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.upload-preview {
		width: 100%;
		height: 196px;
	}

	.upload-change {
		position: absolute;
		right: 14px;
		top: 14px;
		height: 30px;
		padding-left: 12px;
		padding-right: 12px;
		border-radius: 999px;
		background-color: rgba(255, 255, 255, 0.92);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.upload-change text {
		font-size: 12px;
		line-height: 16px;
		font-weight: 800;
		color: #EA580C;
	}

	.upload-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.upload-icon {
		width: 42px;
		height: 42px;
		border-radius: 999px;
		background-color: #FFF2E6;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #FF8E4E;
		margin-bottom: 16px;
	}

	.upload-title {
		font-size: 13px;
		line-height: 18px;
		font-weight: 800;
		color: #1D1B20;
	}

	.upload-desc {
		margin-top: 6px;
		font-size: 10px;
		line-height: 14px;
		font-weight: 700;
		color: #7B7480;
	}

	.form-card,
	.detail-card {
		border-radius: 28px;
		padding: 20px;
		margin-top: 16px;
	}

	.field-label {
		display: block;
		font-size: 11px;
		line-height: 16px;
		font-weight: 800;
		color: #494551;
		margin-bottom: 10px;
	}

	.field-space {
		margin-top: 18px;
	}

	.chip-row,
	.tabs-row {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin-bottom: 8px;
	}

	.subject-chip,
	.tab-chip {
		height: 34px;
		padding-left: 14px;
		padding-right: 14px;
		border-radius: 999px;
		background-color: #FFFFFF;
		border: 1px solid #E8E2E0;
		box-shadow: 0 3px 9px rgba(0, 0, 0, 0.04);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 8px;
		margin-bottom: 8px;
	}

	.subject-chip text,
	.tab-chip text {
		font-size: 12px;
		font-weight: 800;
		color: #6B6370;
	}

	.subject-active,
	.tab-active {
		background-color: #EA580C;
		border-color: #EA580C;
	}

	.subject-active text,
	.tab-active text {
		color: #FFFFFF;
	}

	.note-field {
		width: 100%;
		height: 96px;
		border-radius: 26px;
		background-color: #FFFFFF;
		border: 0;
		padding: 16px 18px;
		font-size: 13px;
		color: #1D1B20;
	}

	.settings-card,
	.settings-preview {
		border-radius: 28px;
		padding: 20px;
		margin-top: 16px;
	}

	.settings-input {
		width: 100%;
		height: 50px;
		border-radius: 24px;
		background-color: #FFF8F2;
		border: 1px solid #F1E2D8;
		padding-left: 16px;
		padding-right: 16px;
		font-size: 15px;
		font-weight: 700;
		color: #1D1B20;
	}

	.settings-avatar-row {
		min-height: 72px;
		border-radius: 24px;
		background-color: #FFF8F2;
		border: 1px solid #F1E2D8;
		padding: 12px;
		margin-bottom: 18px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.settings-avatar {
		width: 48px;
		height: 48px;
		border-radius: 999px;
		overflow: hidden;
		background-color: #FFFFFF;
		margin-right: 12px;
	}

	.settings-avatar-copy {
		flex: 1;
	}

	.settings-avatar-title {
		display: block;
		font-size: 15px;
		line-height: 21px;
		font-weight: 800;
		color: #1D1B20;
	}

	.settings-avatar-sub {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		line-height: 18px;
		color: #7B7480;
	}

	.preview-label {
		display: block;
		font-size: 11px;
		line-height: 16px;
		font-weight: 800;
		color: #9A827A;
		margin-bottom: 12px;
	}

	.preview-brand {
		display: block;
	}

	.preview-brand-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.preview-greeting {
		margin-top: 18px;
	}

	.preview-stats-title {
		display: block;
		margin-top: 14px;
		font-size: 18px;
		line-height: 26px;
		font-weight: 800;
		color: #EC8358;
	}

	.save-button,
	.reveal-button {
		height: 58px;
		border-radius: 30px;
		background-color: #EA580C;
		box-shadow: 0 8px 20px rgba(234, 88, 12, 0.22);
		margin-top: 22px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.save-button text,
	.reveal-button text {
		font-size: 15px;
		line-height: 20px;
		font-weight: 800;
		color: #FFFFFF;
	}

	.secondary-button {
		height: 54px;
		border-radius: 28px;
		background-color: #FFFFFF;
		border: 1px solid #F1E2D8;
		margin-top: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.secondary-button text {
		font-size: 14px;
		line-height: 20px;
		font-weight: 800;
		color: #6750A4;
	}

	.save-icon {
		margin-right: 8px;
	}

	.today-head {
		height: 92px;
		border-radius: 28px;
		padding: 18px;
		margin-bottom: 18px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.today-title {
		display: block;
		font-size: 20px;
		line-height: 28px;
		font-weight: 800;
	}

	.today-sub {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		line-height: 18px;
		color: #766F6A;
	}

	.today-start {
		width: 70px;
		height: 44px;
		border-radius: 999px;
		background-color: #F5A623;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.today-start text {
		font-size: 14px;
		font-weight: 900;
		color: #111111;
	}

	.today-card {
		min-height: 92px;
		border-radius: 22px;
		padding: 12px;
		margin-bottom: 12px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.today-thumb {
		width: 74px;
		height: 62px;
		border-radius: 16px;
		margin-right: 12px;
	}

	.today-copy {
		flex: 1;
	}

	.today-card-title {
		display: block;
		font-size: 15px;
		line-height: 21px;
		font-weight: 800;
		color: #2D3436;
	}

	.today-card-sub {
		display: block;
		margin-top: 5px;
		font-size: 11px;
		line-height: 17px;
		color: #6E6874;
	}

	.today-arrow {
		font-size: 24px;
		color: #B0A9B8;
	}

	.review-screen {
		padding-bottom: 188px;
	}

	.review-content {
		padding-top: 18px;
	}

	.progress-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.progress-label {
		font-size: 12px;
		line-height: 18px;
		font-weight: 800;
		color: #494551;
	}

	.progress-number {
		font-size: 20px;
		line-height: 28px;
		font-weight: 800;
		color: #4F378A;
	}

	.progress-track {
		width: 100%;
		height: 10px;
		border-radius: 999px;
		background-color: #E8E0EA;
		overflow: hidden;
		margin-bottom: 16px;
	}

	.progress-fill {
		width: 25%;
		height: 10px;
		border-radius: 999px;
		background-color: #FFB38E;
	}

	.review-card {
		border-radius: 30px;
		background-color: #FFFDF2;
		border: 1px solid rgba(255, 179, 142, 0.22);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
		padding: 22px;
		margin-bottom: 16px;
	}

	.question-card {
		margin-top: 14px;
	}

	.review-meta {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 18px;
	}

	.tag-purple,
	.tag-grey {
		height: 22px;
		line-height: 22px;
		border-radius: 999px;
		padding-left: 12px;
		padding-right: 12px;
		font-size: 11px;
		font-weight: 800;
		margin-right: 12px;
	}

	.tag-purple {
		color: #4F378A;
		background-color: #F0EAF6;
	}

	.tag-grey {
		color: #6D6875;
		background-color: #EAE6EC;
	}

	.muted {
		font-size: 12px;
		line-height: 18px;
		font-weight: 700;
		color: #8B8590;
	}

	.review-image,
	.answer-image {
		width: 100%;
		height: 168px;
		border-radius: 28px;
	}

	.question-text,
	.review-note {
		display: block;
		margin-top: 16px;
		font-size: 16px;
		line-height: 26px;
		font-weight: 600;
		color: #302B2B;
	}

	.review-note {
		font-size: 13px;
		line-height: 21px;
		color: #6E6874;
	}

	.answer-note {
		margin-top: 18px;
		border-left: 3px solid #FFB38E;
		border-radius: 18px;
		background-color: #FFFFFF;
		padding: 14px 16px;
	}

	.image-repair-action {
		height: 38px;
		border-radius: 999px;
		background-color: #FFF0E7;
		margin-top: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-repair-action text {
		font-size: 12px;
		line-height: 16px;
		font-weight: 800;
		color: #EC8358;
	}

	.answer-text {
		font-size: 15px;
		line-height: 24px;
		color: #3A3030;
	}

	.review-actions {
		position: fixed;
		left: 50%;
		bottom: 92px;
		transform: translateX(-50%);
		width: 345px;
		height: 76px;
		padding: 8px;
		border-radius: 36px;
		background-color: #FFFDF4;
		border: 1px solid #FDE4C8;
		box-shadow: 0 10px 26px rgba(114, 90, 40, 0.14);
		display: flex;
		flex-direction: row;
		z-index: 12;
	}

	.review-choice {
		flex: 1;
		border-radius: 32px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.spaced-choice {
		margin-left: 7px;
	}

	.wrong {
		background-color: #E5DDEC;
	}

	.unsure {
		background-color: #FFD8C5;
	}

	.right {
		background-color: #FFA779;
	}

	.choice-mark {
		font-size: 21px;
		line-height: 22px;
		font-weight: 800;
		color: #4F4551;
	}

	.choice-label {
		margin-top: 4px;
		font-size: 10px;
		line-height: 12px;
		font-weight: 800;
		color: #4F4551;
	}

	.search-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 16px;
	}

	.search-box {
		flex: 1;
		height: 50px;
		border-radius: 26px;
		background-color: #FFFFFF;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 16px;
		padding-right: 16px;
		margin-right: 14px;
	}

	.search-icon {
		width: 20px;
		color: #A4AFBF;
		font-size: 19px;
		font-weight: 700;
	}

	.search-input {
		flex: 1;
		height: 48px;
		font-size: 12px;
		margin-left: 10px;
	}

	.filter-button {
		width: 48px;
		height: 48px;
		border-radius: 999px;
		background-color: #FFFFFF;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.filter-button text {
		font-size: 18px;
		line-height: 18px;
		color: #506070;
		font-weight: 800;
	}

	.mistake-card {
		border-radius: 20px;
		overflow: hidden;
		margin-bottom: 22px;
	}

	.mistake-image-wrap {
		position: relative;
		width: 100%;
		height: 150px;
	}

	.mistake-image {
		width: 100%;
		height: 150px;
	}

	.due-pill {
		position: absolute;
		right: 10px;
		top: 10px;
		height: 24px;
		padding-left: 10px;
		padding-right: 10px;
		border-radius: 999px;
		background-color: #FFF4E7;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.due-pill text {
		font-size: 10px;
		line-height: 12px;
		font-weight: 800;
		color: #F4A261;
	}

	.mistake-copy {
		padding: 14px 16px 18px;
	}

	.mini-subject {
		align-self: flex-start;
		display: block;
		width: 64px;
		height: 20px;
		border-radius: 999px;
		background-color: #FEE4D2;
		text-align: center;
		line-height: 20px;
		font-size: 10px;
		font-weight: 800;
		color: #2D3436;
	}

	.mistake-title {
		display: block;
		margin-top: 8px;
		font-size: 16px;
		line-height: 22px;
		font-weight: 800;
		color: #2D3436;
	}

	.mistake-desc {
		display: block;
		margin-top: 6px;
		font-size: 12px;
		line-height: 20px;
		color: #506070;
	}

	.back-button {
		width: 32px;
		height: 32px;
		border-radius: 999px;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
	}

	.back-button text {
		font-size: 24px;
		color: #6750A4;
	}

	.detail-image {
		width: 100%;
		height: 180px;
		border-radius: 22px;
		margin-top: 10px;
	}

	.detail-image-actions {
		display: flex;
		flex-direction: row;
		margin-top: 12px;
	}

	.detail-image-action {
		flex: 1;
		height: 38px;
		border-radius: 999px;
		background-color: #FFF0E7;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
	}

	.detail-image-action text {
		font-size: 12px;
		line-height: 16px;
		font-weight: 800;
		color: #EC8358;
	}

	.muted-action {
		margin-right: 0;
		background-color: #F8F2FA;
	}

	.muted-action text {
		color: #6750A4;
	}

	.detail-note {
		font-size: 14px;
		line-height: 22px;
		color: #494551;
	}

	.record-line {
		padding-top: 12px;
		padding-bottom: 12px;
		border-bottom: 1px solid #F1E8E3;
	}

	.record-main {
		display: block;
		font-size: 14px;
		line-height: 20px;
		font-weight: 800;
		color: #2D3436;
	}

	.record-sub {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		line-height: 18px;
		color: #6E6874;
	}

	.stat-summary-grid {
		display: flex;
		flex-direction: row;
		margin-bottom: 14px;
	}

	.insight-mini {
		flex: 1;
		height: 96px;
		border-radius: 22px;
		padding: 16px 12px;
		margin-right: 10px;
	}

	.insight-last {
		margin-right: 0;
	}

	.insight-number {
		display: block;
		margin-top: 8px;
		font-size: 28px;
		line-height: 34px;
		font-weight: 900;
		color: #EA580C;
	}

	.insight-card {
		border-radius: 22px;
		padding: 18px;
		margin-bottom: 14px;
	}

	.weekly-card {
		min-height: 250px;
	}

	.weekly-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.weekly-title {
		display: block;
		font-size: 19px;
		line-height: 26px;
		font-weight: 800;
		color: #1D1B20;
	}

	.weekly-sub {
		display: block;
		width: 172px;
		margin-top: 3px;
		font-size: 12px;
		line-height: 18px;
		font-weight: 600;
		color: #6F6874;
	}

	.weekly-total {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.weekly-total-number {
		display: block;
		font-size: 18px;
		line-height: 24px;
		font-weight: 900;
		color: #EA580C;
		text-align: right;
	}

	.weekly-total-label {
		display: block;
		font-size: 9px;
		line-height: 12px;
		font-weight: 800;
		color: #9E7C68;
	}

	.bars-row {
		height: 150px;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
		margin-top: 30px;
		padding-left: 20px;
		padding-right: 20px;
	}

	.bar-col {
		width: 22px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
	}

	.bar-fill {
		width: 8px;
		border-radius: 999px;
		background-color: #6750A4;
	}

	.bar-col text {
		margin-top: 10px;
		font-size: 10px;
		line-height: 12px;
		font-weight: 800;
		color: #9B95A1;
	}

	.dist-line {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 12px;
	}

	.dist-name {
		width: 76px;
		font-size: 12px;
		line-height: 18px;
		font-weight: 800;
		color: #494551;
	}

	.dist-track {
		flex: 1;
		height: 10px;
		border-radius: 999px;
		background-color: #F0EAF6;
		overflow: hidden;
	}

	.dist-fill {
		height: 10px;
		border-radius: 999px;
		background-color: #6750A4;
	}

	.dist-fill-red {
		background-color: #EC8358;
	}

	.dist-count {
		width: 32px;
		text-align: right;
		font-size: 12px;
		font-weight: 900;
		color: #1D1B20;
	}

	.momentum-card {
		position: relative;
		height: 116px;
		border-radius: 22px;
		overflow: hidden;
		margin-top: 16px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
	}

	.momentum-image {
		width: 100%;
		height: 116px;
		opacity: 0.86;
	}

	.momentum-copy {
		position: absolute;
		left: 20px;
		right: 20px;
		bottom: 18px;
	}

	.momentum-title {
		display: block;
		font-size: 23px;
		line-height: 28px;
		font-weight: 900;
		color: #FFFFFF;
	}

	.momentum-sub {
		display: block;
		font-size: 12px;
		line-height: 18px;
		font-weight: 700;
		color: #FFFFFF;
	}

	.user-hero-card {
		border-radius: 22px;
		padding: 28px 20px 20px;
		margin-bottom: 14px;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
	}

	.user-avatar-ring {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 3px solid #E87B35;
		padding: 3px;
		margin-bottom: 14px;
		overflow: hidden;
	}

	.user-avatar-large {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.user-display-name {
		font-size: 22px;
		font-weight: 900;
		color: #4A3728;
		line-height: 28px;
		margin-bottom: 4px;
	}

	.user-slogan {
		font-size: 13px;
		font-weight: 600;
		color: #998B7A;
		line-height: 18px;
		margin-bottom: 20px;
	}

	.user-stat-trio {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-evenly;
		width: 100%;
		border-top: 1px solid #F1E2D8;
		padding-top: 16px;
	}

	.user-stat-cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}

	.user-stat-divider {
		width: 1px;
		height: 32px;
		background-color: #F1E2D8;
	}

	.user-stat-num {
		font-size: 24px;
		font-weight: 900;
		color: #6750A4;
		line-height: 30px;
	}

	.user-stat-label {
		font-size: 12px;
		font-weight: 600;
		color: #998B7A;
		line-height: 16px;
		margin-top: 2px;
	}

	.version-card {
		margin-top: 14px;
	}

	.version-source {
		color: #998B7A;
		font-size: 12px;
		margin-bottom: 8px;
	}

	.version-update-hint {
		background-color: #FFF8F0;
		border-radius: 16px;
		padding: 14px;
		margin-top: 10px;
		border: 1px solid #F1E2D8;
	}

	.version-new-label {
		display: block;
		font-size: 15px;
		font-weight: 800;
		color: #E87B35;
		margin-bottom: 6px;
	}

	.version-changelog {
		display: block;
		font-size: 13px;
		line-height: 18px;
		color: #6750A4;
		margin-bottom: 6px;
	}

	.download-status {
		margin-top: 8px;
	}

	.download-percent {
		display: block;
		font-size: 13px;
		font-weight: 800;
		color: #6750A4;
		margin-top: 6px;
		text-align: center;
	}

	.profile-card {
		border-radius: 28px;
		padding: 24px;
		margin-top: 24px;
	}

	.profile-line {
		display: block;
		margin-top: 10px;
		font-size: 12px;
		line-height: 18px;
		font-weight: 700;
		color: #6E6874;
	}

	.update-note {
		border-radius: 20px;
		background-color: #FFF0E7;
		padding: 14px;
		margin-top: 14px;
	}

	.update-note text {
		font-size: 12px;
		line-height: 18px;
		font-weight: 800;
		color: #9A3412;
	}

	.update-progress {
		width: 100%;
		height: 10px;
		border-radius: 999px;
		background-color: #F1E8E3;
		overflow: hidden;
		margin-top: 16px;
	}

	.update-progress-fill {
		height: 10px;
		border-radius: 999px;
		background-color: #EA580C;
	}

	.bottom-nav {
		position: fixed;
		left: 50%;
		bottom: 0;
		transform: translateX(-50%);
		width: 100%;
		max-width: 393px;
		min-height: 88px;
		padding: 10px 16px 16px;
		border-top-left-radius: 38px;
		border-top-right-radius: 38px;
		background-color: #FEF9F0;
		box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		z-index: 20;
	}

	.nav-item {
		min-width: 58px;
		height: 52px;
		border-radius: 999px;
		padding-left: 10px;
		padding-right: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #94A3B8;
	}

	.nav-active {
		min-width: 68px;
		background-color: #FFEDD5;
		color: #9A3412;
	}

	.nav-icon {
		font-size: 18px;
		line-height: 18px;
		font-weight: 800;
	}

	.nav-label {
		margin-top: 4px;
		font-size: 11px;
		line-height: 13px;
		font-weight: 800;
	}
</style>
