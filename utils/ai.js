import { getMistakes, getReviewRecords } from './storage.js'
import { getDueMistakes, getOverdueMistakes } from './scheduler.js'
import { todayKey } from './date.js'

const STAGE_LABELS = {
	new: '新错题',
	pass1: '第1轮',
	pass2: '第2轮',
	pass3: '已掌握'
}

const MAX_HISTORY_MESSAGES = 40

export function buildMistakeSummary() {
	const mistakes = getMistakes()
	const records = getReviewRecords()
	const today = todayKey()
	const active = mistakes.filter(function(m) { return !m.isArchived })
	const due = getDueMistakes(active, today)
	const overdue = getOverdueMistakes(active, today)
	var mastered = active.filter(function(m) { return m.reviewStage === 'pass3' && m.lastReviewResult === 'known' })

	var total = active.length
	var dueCount = due.length
	var overdueCount = overdue.length
	var masteredCount = mastered.length

	// 科目分布
	var subjectMap = {}
	active.forEach(function(m) {
		var s = m.subject || '未分类'
		subjectMap[s] = (subjectMap[s] || 0) + 1
	})

	// 章节分布
	var chapterMap = {}
	active.forEach(function(m) {
		var key = (m.subject || '') + '-' + (m.chapter || '未分类')
		chapterMap[key] = (chapterMap[key] || 0) + 1
	})

	// 错因分布
	var errorMap = {}
	active.forEach(function(m) {
		var e = m.errorType || '未分类'
		errorMap[e] = (errorMap[e] || 0) + 1
	})

	// 难度分布
	var diffMap = {}
	active.forEach(function(m) {
		var d = m.difficulty || '中等'
		diffMap[d] = (diffMap[d] || 0) + 1
	})

	// 复习阶段分布
	var stageMap = {}
	active.forEach(function(m) {
		var s = STAGE_LABELS[m.reviewStage] || '新错题'
		stageMap[s] = (stageMap[s] || 0) + 1
	})

	// 最近7天复习情况
	var sevenDaysAgo = new Date()
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
	var recentRecords = records.filter(function(r) {
		return r.reviewDate && r.reviewDate >= sevenDaysAgo.toISOString().slice(0, 10)
	})
	var recentTotal = recentRecords.length
	var recentKnown = recentRecords.filter(function(r) { return r.result === 'known' }).length
	var recentRate = recentTotal > 0 ? Math.round(recentKnown / recentTotal * 100) : 0

	// 错误次数最多的题目
	var topWrong = active.slice().sort(function(a, b) {
		return (b.totalWrongCount || 0) - (a.totalWrongCount || 0)
	}).slice(0, 5)

	// 构建摘要文本
	var lines = []
	lines.push('=== 用户错题数据摘要 ===')
	lines.push('')

	lines.push('【总体概况】')
	lines.push('- 总错题数：' + total + ' 道（已归档 ' + (mistakes.length - total) + ' 道）')
	lines.push('- 待复习：' + dueCount + ' 道')
	lines.push('- 已逾期：' + overdueCount + ' 道')
	lines.push('- 已掌握：' + masteredCount + ' 道')
	lines.push('')

	if (total > 0) {
		lines.push('【科目分布】')
		Object.keys(subjectMap).sort(function(a, b) { return subjectMap[b] - subjectMap[a] }).forEach(function(s) {
			lines.push('- ' + s + '：' + subjectMap[s] + ' 道（' + Math.round(subjectMap[s] / total * 100) + '%）')
		})
		lines.push('')

		// 薄弱章节 TOP5
		var chapterArr = Object.keys(chapterMap).map(function(k) {
			return { name: k.replace('-', ' / '), count: chapterMap[k] }
		}).sort(function(a, b) { return b.count - a.count }).slice(0, 5)
		if (chapterArr.length > 0) {
			lines.push('【薄弱章节 TOP5】')
			chapterArr.forEach(function(c, i) {
				lines.push('- ' + (i + 1) + '. ' + c.name + '：' + c.count + ' 道')
			})
			lines.push('')
		}

		// 错因分析
		lines.push('【错因分布】')
		Object.keys(errorMap).sort(function(a, b) { return errorMap[b] - errorMap[a] }).forEach(function(e) {
			lines.push('- ' + e + '：' + errorMap[e] + ' 道（' + Math.round(errorMap[e] / total * 100) + '%）')
		})
		lines.push('')

		// 难度分布
		lines.push('【难度分布】')
		;['简单', '中等', '偏难'].forEach(function(d) {
			if (diffMap[d]) {
				lines.push('- ' + d + '：' + diffMap[d] + ' 道')
			}
		})
		lines.push('')

		// 复习阶段
		lines.push('【复习进度】')
		Object.keys(stageMap).forEach(function(s) {
			lines.push('- ' + s + '：' + stageMap[s] + ' 道')
		})
		lines.push('')
	}

	// 近期趋势
	lines.push('【近7天复习情况】')
	lines.push('- 复习次数：' + recentTotal + ' 次')
	lines.push('- 正确率：' + recentRate + '%')
	lines.push('')

	// 高频错误题目
	if (topWrong.length > 0 && topWrong[0].totalWrongCount > 0) {
		lines.push('【高频错题 TOP5】')
		topWrong.forEach(function(m, i) {
			if (m.totalWrongCount > 0) {
				lines.push('- ' + (i + 1) + '. ' + (m.subject || '') + ' / ' + (m.chapter || '') + ' / ' + (m.errorType || '') + '（错 ' + m.totalWrongCount + ' 次）' + (m.note ? ' 备注：' + m.note : ''))
			}
		})
		lines.push('')
	}

	return lines.join('\n')
}

var _systemPromptCache = ''
var _systemPromptCacheTime = 0

export function buildSystemPrompt(customPersonality) {
	// 缓存 5 分钟，避免重复生成
	var now = Date.now()
	if (_systemPromptCache && now - _systemPromptCacheTime < 300000) {
		return _systemPromptCache
	}

	var summary = buildMistakeSummary()

	// 限制摘要长度，防止主线程阻塞
	if (summary.length > 6000) {
		summary = summary.substring(0, 6000) + '\n...(数据已截断)'
	}

	var base = '你是「错题拾光」内置的考研数学 AI 助手。你的核心能力：\n' +
		'1. 深入了解用户的错题记录，分析薄弱环节，给出针对性复习建议\n' +
		'2. 解答考研数学问题（高数、线代、概率论），给出清晰的解题思路和步骤\n' +
		'3. 根据用户的错因分布，推荐重点复习方向和方法\n\n' +
		'【公式格式要求 —— 严格遵守】\n' +
		'- 所有数学公式用 $...$ 包裹（行内）或 $$...$$ 包裹（独立成行），系统会自动渲染\n' +
		'- 用 ^ 表示上标：$x^2$、$e^{-x}$、$\\sin^{2}x$\n' +
		'- 用 _ 表示下标：$a_n$、$x_{n+1}$、$\\lim_{n\\to\\infty}$\n' +
		'- 用 / 表示分数：$(a+b)/(c+d)$、$dy/dx$\n' +
		'- 常用符号直接写 Unicode：∫ ∑ √ π ∞ ≤ ≥ ≠ ≈ → ⇒\n' +
		'- 重要公式独占一行用 $$：\n' +
		'  $$\\int_0^1 x^2 dx = 1/3$$\n' +
		'  $$\\lim_{x\\to 0} \\frac{\\sin x}{x} = 1$$\n' +
		'- 解题步骤用「第一步」「第二步」分段，关键结论用 **加粗**\n' +
		'- 示例：求 e^(x^2) 的导数 → 先求 $e^u$ 的导数，再用链式法则...\n\n' +
		'回答风格：简洁、条理清晰、重点突出。如果用户问的不是数学问题，也可以正常聊天。\n\n'
		'  $$\n' +
		'  [1  2  3]\n' +
		'  [4  5  6]\n' +
		'  [7  8  9]\n' +
		'  $$\n' +
		'- 解题步骤用「第一步」「第二步」分段，关键结论用 **加粗**\n' +
		'- 每个关键公式都要单独一行展示，不要把公式嵌在文字中间\n\n' +
		'回答风格：简洁、条理清晰、重点突出。如果用户问的不是数学问题，也可以正常聊天。\n\n'

	if (customPersonality && customPersonality.trim()) {
		base += '【用户设定的性格/风格】\n' + customPersonality.trim() + '\n\n'
	}

	base += '以下是该用户的错题数据摘要：\n\n' + summary

	_systemPromptCache = base
	_systemPromptCacheTime = now

	return base
}

var _formatCache = {}
var _formatCacheSize = 0
var MAX_FORMAT_CACHE = 200

export function formatAiText(text) {
	if (!text) return ''

	var cached = _formatCache[text]
	if (cached !== undefined) return cached

	var result = text

	// 转义 HTML
	result = result.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

	// 公式块 $$...$$（独立成行，居中高亮）
	result = result.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, function(match, formula) {
		var cleaned = formula.trim().replace(/\n/g, '<br/>')
		return '</p><view class="ai-formula-block"><text class="ai-formula-text">' + cleaned + '</text></view><p>'
	})

	// $...$ 行内公式
	result = result.replace(/\$([^$\n]+?)\$/g, function(match, formula) {
		return '<text class="ai-inline-formula">' + formula + '</text>'
	})

	// 数学表达式识别（仅在普通文本中）

	// 上标：x^n, e^{...}, x^{...}
	result = result.replace(/([a-zA-Z0-9π∞\)\]])\^(\{[^}]+\})/g, function(match, base, exp) {
		var inner = exp.slice(1, -1)
		return base + '<sup>' + inner + '</sup>'
	})
	result = result.replace(/([a-zA-Z0-9π∞\)\]])\^([a-zA-Z0-9]+)/g, function(match, base, exp) {
		return base + '<sup>' + exp + '</sup>'
	})

	// 下标：x_n, x_{...}
	result = result.replace(/([a-zA-Z0-9π∞\)\]])_(\{[^}]+\})/g, function(match, base, sub) {
		var inner = sub.slice(1, -1)
		return base + '<sub>' + inner + '</sub>'
	})
	result = result.replace(/([a-zA-Z0-9π∞\)\]])_([a-zA-Z0-9]+)/g, function(match, base, sub) {
		return base + '<sub>' + sub + '</sub>'
	})

	// 分数：(a)/(b) → 竖排分数
	result = result.replace(/\(([^)]+)\)\/\(([^)]+)\)/g, function(match, num, den) {
		return '<text class="ai-frac"><text class="ai-frac-num">' + num + '</text><text class="ai-frac-den">' + den + '</text></text>'
	})

	// 简单分数：dy/dx, ∂y/∂x 等导数形式
	result = result.replace(/(d[a-zA-Z])\/(d[a-zA-Z])/g, function(match, num, den) {
		return '<text class="ai-frac"><text class="ai-frac-num">' + num + '</text><text class="ai-frac-den">' + den + '</text></text>'
	})
	result = result.replace(/(∂[a-zA-Z])\/(∂[a-zA-Z])/g, function(match, num, den) {
		return '<text class="ai-frac"><text class="ai-frac-num">' + num + '</text><text class="ai-frac-den">' + den + '</text></text>'
	})

	// **加粗**
	result = result.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')

	// `行内代码`
	result = result.replace(/`([^`\n]+?)`/g, '<text class="ai-inline-code">$1</text>')

	// 代码块 ```...```
	result = result.replace(/```[\s\S]*?```/g, function(match) {
		var code = match.replace(/```(\w*)\n?/g, '').replace(/```$/g, '')
		return '</p><view class="ai-code-block"><text class="ai-code-text">' + code + '</text></view><p>'
	})

	// 换行 → 段落
	result = result.replace(/\n{2,}/g, '</p><p>')
	result = result.replace(/\n/g, '<br/>')

	// 包裹为段落
	result = '<p>' + result + '</p>'

	// 清理空段落
	result = result.replace(/<p>\s*<\/p>/g, '')
	result = result.replace(/<p>\s*(<br\/>\s*)*<\/p>/g, '')

	// 缓存结果，限制缓存大小
	if (_formatCacheSize >= MAX_FORMAT_CACHE) {
		_formatCache = {}
		_formatCacheSize = 0
	}
	_formatCache[text] = result
	_formatCacheSize++

	return result
}

export function callDeepSeek(messages, apiKey, baseUrl, model) {
	var requestTask = null
	var aborted = false

	var promise = new Promise(function(resolve, reject) {
		if (!apiKey) {
			reject(new Error('请先在设置中配置 API Key'))
			return
		}

		var url = (baseUrl || 'https://api.deepseek.com').replace(/\/+$/, '') + '/chat/completions'

		requestTask = uni.request({
			url: url,
			method: 'POST',
			header: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + apiKey
			},
			data: {
				model: model || 'deepseek-chat',
				messages: messages,
				temperature: 0.7,
				max_tokens: 2000
			},
			timeout: 30000,
			success: function(res) {
				if (aborted) return
				if (res.statusCode === 200 && res.data && res.data.choices && res.data.choices.length > 0) {
					resolve(res.data.choices[0].message.content)
				} else if (res.statusCode === 401) {
					reject(new Error('API Key 无效，请检查配置'))
				} else if (res.statusCode === 429) {
					reject(new Error('请求过于频繁，请稍后再试'))
				} else {
					var errMsg = (res.data && res.data.error && res.data.error.message) || '请求失败 (' + res.statusCode + ')'
					reject(new Error(errMsg))
				}
			},
			fail: function(err) {
				if (aborted) return
				if (err.errMsg && err.errMsg.indexOf('abort') >= 0) {
					resolve('[已取消]')
				} else {
					reject(new Error('网络请求失败，请检查网络连接'))
				}
			}
		})
	})

	promise.abort = function() {
		aborted = true
		if (requestTask && requestTask.abort) {
			requestTask.abort()
		}
	}

	return promise
}

export function trimMessages(messages, maxCount) {
	maxCount = maxCount || MAX_HISTORY_MESSAGES
	if (messages.length <= maxCount) return messages

	// 始终保留第一条 system prompt
	var systemMsg = messages[0]
	var rest = messages.slice(1)

	if (rest.length > maxCount - 1) {
		rest = rest.slice(rest.length - (maxCount - 1))
	}

	return [systemMsg].concat(rest)
}
