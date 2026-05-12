<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<view class="brand-row">
				<view class="back-button" @click="$emit('navigate', 'back')"><text>‹</text></view>
				<text class="brand-title small-brand">AI 配置</text>
			</view>
			<text class="gear small-gear" @click="saveAiSettings">保存</text>
		</view>
		<view class="page-content" style="padding-top: 20px;">
			<view class="settings-card soft-card">
				<text class="field-label">API Key</text>
				<input class="settings-input" v-model="formLocal.deepseekApiKey" placeholder="输入你的 DeepSeek API Key" type="password" />

				<text class="field-label field-space">API Base URL</text>
				<input class="settings-input" v-model="formLocal.deepseekBaseUrl" placeholder="https://api.deepseek.com" />

				<text class="field-label field-space">选择模型</text>
				<view class="ai-model-grid">
					<view v-for="m in aiModelOptions" :key="m.id"
						:class="formLocal.deepseekModel === m.id ? 'ai-model-card ai-model-active' : 'ai-model-card'"
						@click="formLocal.deepseekModel = m.id"
					>
						<text class="ai-model-name">{{ m.name }}</text>
						<text class="ai-model-desc">{{ m.desc }}</text>
					</view>
				</view>
			</view>

			<view class="settings-card soft-card">
				<text class="field-label">AI 性格设定</text>
				<textarea class="ai-personality-field" v-model="formLocal.aiPersonality" placeholder="自定义 AI 的性格和回答风格，例如：&#10;&#10;请用轻松幽默的语气回答，多举例子帮助理解。&#10;每次回答结尾给我留一道练习题。&#10;回答要详细，推导过程要完整。" :maxlength="500"></textarea>
				<text class="ai-personality-hint">留空则使用默认风格。设定后 AI 会按你写的风格来回答。</text>
			</view>

			<view class="save-button" @click="saveAiSettings">
				<text>保存配置</text>
			</view>
			<view class="secondary-button" @click="testAiConnection">
				<text>测试连接</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { getPreferences, savePreferences } from '@/utils/storage/storage.js'
	import { callDeepSeek } from '@/utils/ai/ai.js'

	export default {
		props: {
			preferences: { type: Object, default: () => ({}) },
			aiSettingsForm: { type: Object, default: () => ({}) },
			aiModelOptions: { type: Array, default: () => [] }
		},
		emits: ['navigate', 'save-ai-settings', 'reset-ai-data'],
		data() {
			return {
				formLocal: {
					deepseekApiKey: '',
					deepseekBaseUrl: 'https://api.deepseek.com',
					deepseekModel: 'deepseek-chat',
					aiPersonality: ''
				}
			}
		},
		created() {
			this.initForm()
		},
		methods: {
			initForm() {
				var src = this.aiSettingsForm
				if (src && src.deepseekApiKey !== undefined) {
					this.formLocal = {
						deepseekApiKey: src.deepseekApiKey || '',
						deepseekBaseUrl: src.deepseekBaseUrl || 'https://api.deepseek.com',
						deepseekModel: src.deepseekModel || 'deepseek-chat',
						aiPersonality: src.aiPersonality || ''
					}
				} else {
					var prefs = getPreferences()
					this.formLocal = {
						deepseekApiKey: prefs.deepseekApiKey || '',
						deepseekBaseUrl: prefs.deepseekBaseUrl || 'https://api.deepseek.com',
						deepseekModel: prefs.deepseekModel || 'deepseek-chat',
						aiPersonality: prefs.aiPersonality || ''
					}
				}
			},
			saveAiSettings() {
				var apiKey = (this.formLocal.deepseekApiKey || '').trim()
				var baseUrl = (this.formLocal.deepseekBaseUrl || '').trim() || 'https://api.deepseek.com'
				var model = (this.formLocal.deepseekModel || '').trim() || 'deepseek-chat'
				var personality = this.formLocal.aiPersonality || ''
				savePreferences({
					deepseekApiKey: apiKey,
					deepseekBaseUrl: baseUrl,
					deepseekModel: model,
					aiPersonality: personality
				})
				this.$emit('save-ai-settings', {
					deepseekApiKey: apiKey,
					deepseekBaseUrl: baseUrl,
					deepseekModel: model,
					aiPersonality: personality
				})
				uni.showToast({ title: 'AI 配置已保存', icon: 'none' })
				this.$emit('navigate', 'back')
			},
			testAiConnection() {
				var apiKey = (this.formLocal.deepseekApiKey || '').trim()
				if (!apiKey) {
					uni.showToast({ title: '请先填写 API Key', icon: 'none' })
					return
				}
				var baseUrl = (this.formLocal.deepseekBaseUrl || '').trim() || 'https://api.deepseek.com'
				var model = (this.formLocal.deepseekModel || '').trim() || 'deepseek-chat'
				uni.showToast({ title: '正在测试...', icon: 'none' })
				callDeepSeek([{ role: 'user', content: '你好，请回复"连接成功"' }], apiKey, baseUrl, model).then(function(reply) {
					uni.showModal({ title: '连接成功', content: 'AI 回复：' + reply.substring(0, 100), showCancel: false })
				}).catch(function(err) {
					uni.showModal({ title: '连接失败', content: err.message, showCancel: false })
				})
			}
		}
	}
</script>
