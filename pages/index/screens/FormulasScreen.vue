<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<text class="back-arrow" @click="$emit('navigate', 'apps')">← 返回</text>
			<view class="topbar-title-wrap">
				<text class="brand-title small-brand">公式手册</text>
				<text class="topbar-subtitle">极限 · 导数 · 积分</text>
			</view>
			<text></text>
		</view>
		<view class="page-content formulas-content">
			<view class="formula-category-grid">
				<view class="formula-category-card formula-card-limits" @click="$emit('show-limits')">
					<view class="formula-card-icon-circle formula-icon-orange">
						<text class="formula-category-icon">∞</text>
					</view>
					<text class="formula-category-title">极限</text>
					<text class="formula-category-desc">等价无穷小 · 洛必达 · 泰勒</text>
				</view>
				<view class="formula-category-card formula-card-derivatives" @click="$emit('show-derivatives')">
					<view class="formula-card-icon-circle formula-icon-purple">
						<text class="formula-category-icon">d</text>
					</view>
					<text class="formula-category-title">导数</text>
					<text class="formula-category-desc">基本导数 · 求导法则 · 高阶</text>
				</view>
				<view class="formula-category-card formula-card-integrals" @click="$emit('show-integrals')">
					<view class="formula-card-icon-circle formula-icon-green">
						<text class="formula-category-icon">∫</text>
					</view>
					<text class="formula-category-title">积分</text>
					<text class="formula-category-desc">不定积分 · 定积分 · 技巧</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		emits: ['navigate', 'show-limits', 'show-derivatives', 'show-integrals']
	}
</script>
