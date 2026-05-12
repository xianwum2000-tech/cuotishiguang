<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<view class="brand-row">
				<view class="back-button" @click="$emit('navigate', 'back')"><text>‹</text></view>
				<text class="brand-title small-brand">名句设置</text>
			</view>
			<text class="gear small-gear" @click="saveQuoteSettings">保存</text>
		</view>
		<view class="page-content settings-content">
			<view class="page-heading">
				<text class="page-title">每日名句轮换</text>
				<text class="page-subtitle">设置首页问候语每天轮换的句子。</text>
			</view>
			<view class="settings-card soft-card">
				<text class="field-label">轮换间隔（天）</text>
				<input class="settings-input" v-model="quoteSettingsForm.quoteDays" type="number" placeholder="1" />
				<text class="field-label field-space">名句列表</text>
				<view v-for="(quote, index) in quoteSettingsForm.quotes" :key="index" class="quote-line">
					<input class="quote-input" v-model="quoteSettingsForm.quotes[index]" />
					<text class="quote-delete" @click="removeQuote(index)">×</text>
				</view>
				<view class="secondary-button" @click="addQuote">
					<text>＋ 添加名句</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { saveQuotes } from '@/utils/storage/storage.js'

	export default {
		props: {
			quotesData: {
				type: Object,
				default: function() { return { quoteDays: 1, quotes: [] } }
			}
		},
		emits: ['navigate', 'save-quotes'],
		data() {
			return {
				quoteSettingsForm: JSON.parse(JSON.stringify(this.quotesData))
			}
		},
		methods: {
			addQuote() {
				this.quoteSettingsForm.quotes.push('')
			},
			removeQuote(index) {
				if (this.quoteSettingsForm.quotes.length <= 1) return
				this.quoteSettingsForm.quotes.splice(index, 1)
			},
			saveQuoteSettings() {
				var days = Math.max(1, parseInt(this.quoteSettingsForm.quoteDays) || 1)
				var quotes = this.quoteSettingsForm.quotes.filter(function(q) { return q.trim() })
				if (quotes.length === 0) {
					uni.showToast({ title: '至少保留一条名句', icon: 'none' })
					return
				}
				var data = { quoteDays: days, quotes: quotes }
				saveQuotes(data)
				this.$emit('save-quotes', data)
			}
		}
	}
</script>
