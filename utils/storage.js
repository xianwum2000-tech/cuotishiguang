import { createInitialSchedule, calculateNextReview, REVIEW_RESULTS } from './scheduler.js'
import { todayKey } from './date.js'

const MISTAKES_KEY = 'mistake_scheduler_mistakes_v1'
const RECORDS_KEY = 'mistake_scheduler_review_records_v1'
const PREFERENCES_KEY = 'mistake_scheduler_preferences_v1'

const QUOTES_KEY = 'mistake_scheduler_quotes_v1'
const CUSTOM_OPTIONS_KEY = 'mistake_scheduler_custom_options_v1'

const DEFAULT_QUOTES = {
	quotes: [
		'准备好提升你的技能了吗？',
		'每一次复习，都是对未来的投资。',
		'数学不是看会的，是算会的。'
	],
	quoteDays: 1
}

const DEFAULT_PREFERENCES = {
	homeTitle: '复习达人',
	greetingTitle: '早上好，小明',
	homeAvatar: '/static/stitch_assets/avatar-home.jpg',
	statsName: '小明',
	deepseekApiKey: '',
	deepseekBaseUrl: 'https://api.deepseek.com',
	deepseekModel: 'deepseek-chat',
	aiPersonality: ''
}

const AI_CHAT_KEY = 'mistake_scheduler_ai_chat_v1'

function createId(prefix) {
	return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`
}

function readArray(key) {
	const raw = uni.getStorageSync(key)
	if (Array.isArray(raw)) return raw
	if (typeof raw === 'string' && raw.length > 0) {
		try {
			const parsed = JSON.parse(raw)
			return Array.isArray(parsed) ? parsed : []
		} catch (error) {
			return []
		}
	}
	return []
}

function writeArray(key, value) {
	uni.setStorageSync(key, value)
}

function readObject(key, defaults) {
	const raw = uni.getStorageSync(key)
	if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
		return { ...defaults, ...raw }
	}
	if (typeof raw === 'string' && raw.length > 0) {
		try {
			const parsed = JSON.parse(raw)
			return parsed && typeof parsed === 'object' ? { ...defaults, ...parsed } : { ...defaults }
		} catch (error) {
			return { ...defaults }
		}
	}
	return { ...defaults }
}

export function getMistakes() {
	return readArray(MISTAKES_KEY)
}

export function saveMistakes(mistakes) {
	writeArray(MISTAKES_KEY, mistakes)
}

export function getReviewRecords() {
	return readArray(RECORDS_KEY)
}

export function saveReviewRecords(records) {
	writeArray(RECORDS_KEY, records)
}

export function getPreferences() {
	return readObject(PREFERENCES_KEY, DEFAULT_PREFERENCES)
}

export function savePreferences(preferences) {
	const current = readObject(PREFERENCES_KEY, DEFAULT_PREFERENCES)
	const next = {
		...DEFAULT_PREFERENCES,
		...current,
		...preferences
	}
	uni.setStorageSync(PREFERENCES_KEY, next)
	return next
}

export function createMistake(payload) {
	const now = new Date().toISOString()
	const schedule = createInitialSchedule(now)
	const mistake = {
		id: createId('mistake'),
		questionImage: payload.questionImage,
		answerImage: payload.answerImage,
		subject: payload.subject,
		chapter: payload.chapter,
		errorType: payload.errorType,
		difficulty: payload.difficulty || '中等',
		source: payload.source || '',
		note: payload.note || '',
		createdAt: now,
		updatedAt: now,
		reviewStage: schedule.reviewStage,
		nextReviewDate: schedule.nextReviewDate,
		totalReviewCount: 0,
		totalWrongCount: 0,
		lastReviewResult: '',
		isArchived: false
	}

	const mistakes = getMistakes()
	saveMistakes([mistake].concat(mistakes))
	return mistake
}

export function updateMistake(id, patch) {
	const mistakes = getMistakes()
	const updated = mistakes.map((mistake) => {
		if (mistake.id !== id) return mistake
		return {
			...mistake,
			...patch,
			updatedAt: new Date().toISOString()
		}
	})
	saveMistakes(updated)
	return updated.find((mistake) => mistake.id === id)
}

export function getMistakeById(id) {
	return getMistakes().find((mistake) => mistake.id === id)
}

export function completeReview(questionId, result, reviewedAt = new Date()) {
	const mistakes = getMistakes()
	const index = mistakes.findIndex((mistake) => mistake.id === questionId)
	if (index < 0) return null

	const mistake = mistakes[index]
	const stageBefore = mistake.reviewStage || 'new'
	const schedule = calculateNextReview(stageBefore, result, reviewedAt)
	const now = new Date().toISOString()
	const totalWrongCount = (mistake.totalWrongCount || 0) + (result === REVIEW_RESULTS.WRONG ? 1 : 0)
	const updatedMistake = {
		...mistake,
		updatedAt: now,
		reviewStage: schedule.stageAfter,
		nextReviewDate: schedule.nextReviewDate,
		totalReviewCount: (mistake.totalReviewCount || 0) + 1,
		totalWrongCount,
		lastReviewResult: result
	}

	mistakes.splice(index, 1, updatedMistake)
	saveMistakes(mistakes)

	const record = {
		id: createId('record'),
		questionId,
		reviewDate: todayKey(),
		result,
		stageBefore,
		stageAfter: schedule.stageAfter,
		nextReviewDate: schedule.nextReviewDate
	}
	saveReviewRecords([record].concat(getReviewRecords()))

	return {
		mistake: updatedMistake,
		record
	}
}

export function archiveMistake(id) {
	return updateMistake(id, { isArchived: true })
}

export function getQuotes() {
	return readObject(QUOTES_KEY, DEFAULT_QUOTES)
}

export function saveQuotes(data) {
	const next = { ...DEFAULT_QUOTES, ...data }
	uni.setStorageSync(QUOTES_KEY, next)
	return next
}

const DEFAULT_CUSTOM_OPTIONS = {
	subjects: [],
	chapters: {},
	errorTypes: []
}

export function getCustomOptions() {
	return readObject(CUSTOM_OPTIONS_KEY, DEFAULT_CUSTOM_OPTIONS)
}

export function saveCustomOptions(data) {
	const next = { ...DEFAULT_CUSTOM_OPTIONS, ...data }
	uni.setStorageSync(CUSTOM_OPTIONS_KEY, next)
	return next
}

export function getAiChatHistory() {
	return readObject(AI_CHAT_KEY, { messages: [], lastUpdated: '' })
}

export function saveAiChatHistory(messages) {
	uni.setStorageSync(AI_CHAT_KEY, {
		messages: messages,
		lastUpdated: new Date().toISOString()
	})
}

export function clearAiChatHistory() {
	uni.setStorageSync(AI_CHAT_KEY, { messages: [], lastUpdated: '' })
}
