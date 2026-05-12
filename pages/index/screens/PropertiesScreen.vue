<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<text class="back-arrow" @click="$emit('navigate', 'back')">← 返回</text>
			<view class="topbar-title-wrap">
				<text class="brand-title small-brand">各类性质</text>
				<text class="topbar-subtitle">连续 · 可导 · 可积</text>
			</view>
			<text></text>
		</view>
		<view class="page-content formulas-content">
			<view class="formulas-placeholder soft-card">
				<text class="formulas-placeholder-icon">◆</text>
				<text class="formulas-placeholder-title">函数各类性质</text>
				<text class="formulas-placeholder-sub">内容即将上线</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		emits: ['navigate']
	}
</script>
