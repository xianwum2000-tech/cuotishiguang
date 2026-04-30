function pad2(value) {
	return value < 10 ? `0${value}` : `${value}`
}

export function toLocalDate(input = new Date()) {
	if (input instanceof Date) {
		return new Date(input.getFullYear(), input.getMonth(), input.getDate())
	}

	if (typeof input === 'string') {
		if (input.indexOf('T') >= 0) {
			const date = new Date(input)
			return new Date(date.getFullYear(), date.getMonth(), date.getDate())
		}

		const parts = input.split('-').map((part) => Number(part))
		if (parts.length >= 3) {
			return new Date(parts[0], parts[1] - 1, parts[2])
		}
	}

	const date = new Date(input)
	return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function toDateKey(input = new Date()) {
	const date = toLocalDate(input)
	return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function todayKey() {
	return toDateKey(new Date())
}

export function addDays(input, days) {
	const date = toLocalDate(input)
	date.setDate(date.getDate() + days)
	return toDateKey(date)
}

export function compareDateKeys(left, right) {
	if (left === right) return 0
	return left < right ? -1 : 1
}

export function daysBetween(later, earlier) {
	const laterDate = toLocalDate(later).getTime()
	const earlierDate = toLocalDate(earlier).getTime()
	return Math.floor((laterDate - earlierDate) / 86400000)
}
