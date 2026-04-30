import { addDays, compareDateKeys, daysBetween, todayKey } from './date.js'

export const REVIEW_RESULTS = {
	WRONG: 'wrong',
	FUZZY: 'fuzzy',
	KNOWN: 'known'
}

export const REVIEW_STAGES = {
	NEW: 'new',
	PASS1: 'pass1',
	PASS2: 'pass2',
	PASS3: 'pass3'
}

const STAGE_INTERVALS = {
	new: 2,
	pass1: 5,
	pass2: 10,
	pass3: 20
}

export function createInitialSchedule(createdAt = new Date()) {
	return {
		reviewStage: REVIEW_STAGES.NEW,
		nextReviewDate: addDays(createdAt, STAGE_INTERVALS.new)
	}
}

export function calculateNextReview(stageBefore = REVIEW_STAGES.NEW, result, reviewedAt = new Date()) {
	let stageAfter = REVIEW_STAGES.NEW
	let intervalDays = STAGE_INTERVALS.new

	if (result === REVIEW_RESULTS.KNOWN) {
		if (stageBefore === REVIEW_STAGES.NEW) {
			stageAfter = REVIEW_STAGES.PASS1
		} else if (stageBefore === REVIEW_STAGES.PASS1) {
			stageAfter = REVIEW_STAGES.PASS2
		} else {
			stageAfter = REVIEW_STAGES.PASS3
		}
		intervalDays = STAGE_INTERVALS[stageAfter]
	}

	if (result === REVIEW_RESULTS.FUZZY) {
		if (stageBefore === REVIEW_STAGES.NEW) {
			stageAfter = REVIEW_STAGES.NEW
			intervalDays = STAGE_INTERVALS.new
		} else {
			stageAfter = REVIEW_STAGES.PASS1
			intervalDays = STAGE_INTERVALS.pass1
		}
	}

	return {
		stageAfter,
		intervalDays,
		nextReviewDate: addDays(reviewedAt, intervalDays)
	}
}

export function isDue(mistake, currentDate = todayKey()) {
	return !mistake.isArchived && mistake.nextReviewDate && compareDateKeys(mistake.nextReviewDate, currentDate) <= 0
}

export function isOverdue(mistake, currentDate = todayKey()) {
	return !mistake.isArchived && mistake.nextReviewDate && compareDateKeys(mistake.nextReviewDate, currentDate) < 0
}

export function getOverdueDays(mistake, currentDate = todayKey()) {
	if (!mistake.nextReviewDate) return 0
	return Math.max(0, daysBetween(currentDate, mistake.nextReviewDate))
}

export function sortMistakesByPriority(mistakes, currentDate = todayKey()) {
	return mistakes.slice().sort((left, right) => {
		const overdueDiff = getOverdueDays(right, currentDate) - getOverdueDays(left, currentDate)
		if (overdueDiff !== 0) return overdueDiff

		const wrongDiff = (right.totalWrongCount || 0) - (left.totalWrongCount || 0)
		if (wrongDiff !== 0) return wrongDiff

		const dateDiff = compareDateKeys(left.nextReviewDate || '9999-12-31', right.nextReviewDate || '9999-12-31')
		if (dateDiff !== 0) return dateDiff

		return compareDateKeys(left.createdAt || '9999-12-31', right.createdAt || '9999-12-31')
	})
}

export function getDueMistakes(mistakes, currentDate = todayKey()) {
	return sortMistakesByPriority(mistakes.filter((mistake) => isDue(mistake, currentDate)), currentDate)
}

export function getOverdueMistakes(mistakes, currentDate = todayKey()) {
	return sortMistakesByPriority(mistakes.filter((mistake) => isOverdue(mistake, currentDate)), currentDate)
}

export function getStageLabel(stage) {
	const labels = {
		new: '新错题',
		pass1: '第1轮',
		pass2: '第2轮',
		pass3: '稳定复习'
	}
	return labels[stage] || '新错题'
}

export function getResultLabel(result) {
	const labels = {
		wrong: '不会',
		fuzzy: '模糊',
		known: '会了'
	}
	return labels[result] || '未复习'
}
