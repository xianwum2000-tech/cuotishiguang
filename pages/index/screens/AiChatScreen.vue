<template>
	<view class="screen screen-lilac ai-screen">
		<view class="topbar compact-topbar">
			<view class="brand-row">
				<view class="back-button" @click="$emit('navigate', 'back')"><text>‹</text></view>
				<text class="brand-title small-brand">AI 助手</text>
			</view>
			<view class="ai-topbar-actions">
				<text class="gear small-gear" @click="clearAiChat">清空</text>
				<text class="gear small-gear" @click="showAiSettings">设置</text>
			</view>
		</view>
		<scroll-view class="ai-chat-area" scroll-y :scroll-top="_aiScrollTop || 0" :scroll-with-animation="true">
			<view class="ai-chat-inner">
				<!-- 欢迎消息 -->
				<view v-if="aiMessages.length === 0" class="ai-welcome-card">
					<view class="ai-welcome-icon">
						<image class="ai-welcome-icon-img" src="/static/icons/ai.svg" mode="aspectFit"></image>
					</view>
					<text class="ai-welcome-title">你好，我是 AI 助手</text>
					<text class="ai-welcome-desc">我了解你的所有错题记录，可以帮你分析薄弱环节、推荐复习重点，也能回答数学问题。</text>
					<view class="ai-quick-questions">
						<view class="ai-quick-btn" @click="sendQuickQuestion('分析我的薄弱章节')">
							<text class="ai-quick-text">分析薄弱章节</text>
						</view>
						<view class="ai-quick-btn" @click="sendQuickQuestion('推荐今日复习重点')">
							<text class="ai-quick-text">今日复习重点</text>
						</view>
						<view class="ai-quick-btn" @click="sendQuickQuestion('我的错因分布有什么规律？')">
							<text class="ai-quick-text">错因分析</text>
						</view>
						<view class="ai-quick-btn" @click="sendQuickQuestion('给我一些考研数学复习建议')">
							<text class="ai-quick-text">复习建议</text>
						</view>
					</view>
				</view>

				<!-- 加载更多 -->
				<view v-if="aiHasMoreMessages" class="ai-load-more" @click="loadMoreAiMessages">
					<text class="ai-load-more-text">加载更早的消息</text>
				</view>

				<!-- 消息列表 -->
				<view v-for="(msg, idx) in visibleAiMessages" :key="idx" :class="msg.role === 'user' ? 'ai-msg ai-msg-user' : 'ai-msg ai-msg-ai'">
					<view v-if="msg.role === 'assistant'" class="ai-msg-avatar">
						<image class="ai-msg-avatar-img" src="/static/icons/ai.svg" mode="aspectFit"></image>
					</view>
					<view :class="msg.role === 'user' ? 'ai-bubble ai-bubble-user' : 'ai-bubble ai-bubble-ai'">
						<text v-if="msg.role === 'user'" class="ai-bubble-text" :selectable="true">{{ msg.content }}</text>
						<rich-text v-else class="ai-bubble-text ai-rich-text" :selectable="true" :nodes="formatAiText(msg.content)"></rich-text>
					</view>
				</view>

				<!-- 加载动画 -->
				<view v-if="aiLoading" class="ai-msg ai-msg-ai">
					<view class="ai-msg-avatar">
						<image class="ai-msg-avatar-img" src="/static/icons/ai.svg" mode="aspectFit"></image>
					</view>
					<view class="ai-bubble ai-bubble-ai">
						<view class="ai-typing">
							<view class="ai-dot"></view>
							<view class="ai-dot"></view>
							<view class="ai-dot"></view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 输入区域 -->
		<view class="ai-input-bar">
			<view class="ai-math-toolbar">
				<scroll-view scroll-x class="ai-math-scroll">
					<view class="ai-math-buttons">
						<view class="ai-math-btn" @click="insertMath('ln()')"><text>ln</text></view>
						<view class="ai-math-btn" @click="insertMath('e^{}')"><text>eˣ</text></view>
						<view class="ai-math-btn" @click="insertMath('x^n')"><text>xⁿ</text></view>
						<view class="ai-math-btn" @click="insertMath('√()')"><text>√</text></view>
						<view class="ai-math-btn" @click="insertMath('∫_{a}^{b} f(x)dx')"><text>∫</text></view>
						<view class="ai-math-btn" @click="insertMath('lim_{x→∞}')"><text>lim</text></view>
						<view class="ai-math-btn" @click="insertMath('∑_{n=1}^{∞}')"><text>∑</text></view>
						<view class="ai-math-btn" @click="insertMath('π')"><text>π</text></view>
						<view class="ai-math-btn" @click="insertMath('∞')"><text>∞</text></view>
						<view class="ai-math-btn" @click="insertMath('≤')"><text>≤</text></view>
						<view class="ai-math-btn" @click="insertMath('≥')"><text>≥</text></view>
						<view class="ai-math-btn" @click="insertMath('≠')"><text>≠</text></view>
						<view class="ai-math-btn" @click="insertMath('dx')"><text>dx</text></view>
						<view class="ai-math-btn" @click="insertMath('dy/dx')"><text>dy/dx</text></view>
						<view class="ai-math-btn" @click="insertMath('∂/∂x')"><text>∂</text></view>
						<view class="ai-math-btn" @click="insertMath('±')"><text>±</text></view>
						<view class="ai-math-btn" @click="insertMath('×')"><text>×</text></view>
						<view class="ai-math-btn" @click="insertMath('÷')"><text>÷</text></view>
					</view>
				</scroll-view>
			</view>
			<textarea class="ai-input-field" v-model="aiInputText" placeholder="输入你的问题..." :disabled="aiLoading" :auto-height="true" :maxlength="2000" @confirm="sendAiMessage" confirm-type="send"></textarea>
			<view v-if="aiLoading" class="ai-send-btn ai-cancel-btn" @click="cancelAiMessage">
				<text class="ai-send-text">取消</text>
			</view>
			<view v-else :class="aiInputText.trim() ? 'ai-send-btn ai-send-active' : 'ai-send-btn'" @click="sendAiMessage">
				<text class="ai-send-text">发送</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { getPreferences, getAiChatHistory, saveAiChatHistory, clearAiChatHistory } from '@/utils/storage/storage.js'
	import { buildSystemPrompt, callDeepSeek, trimMessages, formatAiText } from '@/utils/ai/ai.js'

	export default {
		props: {
			preferences: {
				type: Object,
				default: function() { return {} }
			}
		},
		emits: ['navigate'],
		data() {
			return {
				aiMessages: [],
				aiInputText: '',
				aiLoading: false,
				aiInitialized: false,
				aiVisibleCount: 50,
				_aiScrollTop: 0,
				_aiAbort: null,
				_aiRequestTime: 0
			}
		},
		computed: {
			visibleAiMessages() {
				var msgs = this.aiMessages
				if (msgs.length <= this.aiVisibleCount) return msgs
				return msgs.slice(msgs.length - this.aiVisibleCount)
			},
			aiHasMoreMessages() {
				return this.aiMessages.length > this.aiVisibleCount
			}
		},
		created() {
			this.initAiChat()
		},
		methods: {
			initAiChat() {
				if (!this.aiInitialized) {
					var history = getAiChatHistory()
					this.aiMessages = history.messages || []
					this.aiInitialized = true
					this.aiVisibleCount = 50
				}

				// 检测超时死请求：App 切后台后请求回调可能丢失，aiLoading 卡在 true
				if (this.aiLoading && this._aiRequestTime > 0 && Date.now() - this._aiRequestTime > 35000) {
					this.aiLoading = false
					this._aiAbort = null
					this._aiRequestTime = 0
				}

				var self = this
				this.$nextTick(function() {
					self.scrollAiToBottom()
				})
			},
			loadMoreAiMessages() {
				this.aiVisibleCount += 50
			},
			scrollAiToBottom() {
				var self = this
				setTimeout(function() {
					self._aiScrollTop = (self._aiScrollTop || 0) + 99999
				}, 100)
			},
			sendAiMessage() {
				var text = (this.aiInputText || '').trim()
				if (!text || this.aiLoading) return

				var prefs = getPreferences()
				if (!prefs.deepseekApiKey) {
					uni.showToast({ title: '请先在设置中配置 API Key', icon: 'none' })
					return
				}

				this.aiMessages.push({ role: 'user', content: text })
				this.aiInputText = ''
				this.aiLoading = true
				this._aiRequestTime = Date.now()
				this.scrollAiToBottom()

				var self = this
				var savedPersonality = prefs.aiPersonality
				var savedApiKey = prefs.deepseekApiKey
				var savedBaseUrl = prefs.deepseekBaseUrl
				var savedModel = prefs.deepseekModel

				// 用 setTimeout 释放主线程，防止 buildSystemPrompt 阻塞 UI
				setTimeout(function() {
					var systemPrompt = buildSystemPrompt(savedPersonality)
					var chatMessages = [{ role: 'system', content: systemPrompt }]
					var historyMessages = self.aiMessages.filter(function(m) { return m.role === 'user' || m.role === 'assistant' })
					chatMessages = chatMessages.concat(trimMessages(historyMessages, 41))

					var aiPromise = callDeepSeek(chatMessages, savedApiKey, savedBaseUrl, savedModel)
					self._aiAbort = aiPromise.abort || null

					aiPromise.then(function(reply) {
						if (reply === '[已取消]') {
							self.aiLoading = false
							self._aiAbort = null
							self._aiRequestTime = 0
							return
						}
						self.aiMessages.push({ role: 'assistant', content: reply })
						self.aiLoading = false
						self._aiAbort = null
						self._aiRequestTime = 0
						self.scrollAiToBottom()
						saveAiChatHistory(self.aiMessages)
					}).catch(function(err) {
						self.aiMessages.push({ role: 'assistant', content: '抱歉，出错了：' + err.message })
						self.aiLoading = false
						self._aiAbort = null
						self._aiRequestTime = 0
						self.scrollAiToBottom()
						saveAiChatHistory(self.aiMessages)
					})
				}, 50)
			},
			cancelAiMessage() {
				if (this._aiAbort) {
					this._aiAbort()
					this._aiAbort = null
				}
				this.aiLoading = false
				this._aiRequestTime = 0
			},
			insertMath(symbol) {
				var input = this.aiInputText || ''
				this.aiInputText = input + symbol
			},
			sendQuickQuestion(q) {
				this.aiInputText = q
				this.sendAiMessage()
			},
			clearAiChat() {
				var self = this
				uni.showModal({
					title: '清空对话',
					content: '确定要清空所有对话记录吗？',
					success: function(res) {
						if (res.confirm) {
							if (self._aiAbort) {
								self._aiAbort()
								self._aiAbort = null
							}
							self.aiLoading = false
							self.aiMessages = []
							self.aiInitialized = false
							clearAiChatHistory()
							uni.showToast({ title: '对话已清空', icon: 'none' })
						}
					}
				})
			},
			showAiSettings() {
				this.$emit('navigate', 'ai-settings')
			},
			formatAiText(text) {
				return formatAiText(text)
			}
		}
	}
</script>
