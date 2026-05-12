<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<text class="back-arrow" @click="$emit('navigate', 'apps')">← 返回</text>
			<view class="topbar-title-wrap">
				<text class="brand-title small-brand">特殊放缩</text>
				<text class="topbar-subtitle">常用放缩 · 不等式</text>
			</view>
			<text></text>
		</view>
		<view class="page-content formulas-content">
			<view class="formulas-placeholder soft-card">
				<text class="formulas-placeholder-icon">↔</text>
				<text class="formulas-placeholder-title">特殊放缩公式</text>
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
