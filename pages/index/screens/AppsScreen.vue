<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<text class="brand-title small-brand">应用中心</text>
		</view>
		<view class="page-content apps-content">
			<view class="apps-grid">
				<view class="app-card app-card-active" @click="$emit('show-formulas')">
					<view class="app-card-icon-wrap app-card-icon-orange">
						<image class="app-card-icon-img" src="/static/icons/formula.svg" mode="aspectFit"></image>
					</view>
					<view class="app-card-info">
						<text class="app-card-title">公式手册</text>
						<text class="app-card-desc">极限 · 导数 · 积分</text>
					</view>
					<image class="app-card-arrow-img" src="/static/icons/arrow.svg" mode="aspectFit"></image>
				</view>

				<view class="app-card app-card-active" @click="$emit('show-theorems')">
					<view class="app-card-icon-wrap app-card-icon-purple">
						<image class="app-card-icon-img" src="/static/icons/theorem.svg" mode="aspectFit"></image>
					</view>
					<view class="app-card-info">
						<text class="app-card-title">定理合集</text>
						<text class="app-card-desc">中值 · 积分 · 级数</text>
					</view>
					<image class="app-card-arrow-img" src="/static/icons/arrow.svg" mode="aspectFit"></image>
				</view>

				<view class="app-card app-card-disabled">
					<view class="app-card-icon-wrap app-card-icon-gray">
						<image class="app-card-icon-img" src="/static/icons/scale.svg" mode="aspectFit"></image>
					</view>
					<view class="app-card-info">
						<text class="app-card-title">特殊放缩</text>
						<text class="app-card-desc">即将上线</text>
					</view>
					<view class="app-card-badge">敬请期待</view>
				</view>

				<view class="app-card app-card-disabled">
					<view class="app-card-icon-wrap app-card-icon-gray">
						<image class="app-card-icon-img" src="/static/icons/property.svg" mode="aspectFit"></image>
					</view>
					<view class="app-card-info">
						<text class="app-card-title">各类性质</text>
						<text class="app-card-desc">即将上线</text>
					</view>
					<view class="app-card-badge">敬请期待</view>
				</view>

				<view class="app-card app-card-active" @click="$emit('go-conclusion')">
					<view class="app-card-icon-wrap app-card-icon-green">
						<text class="app-card-icon-text">结</text>
					</view>
					<view class="app-card-info">
						<text class="app-card-title">二级结论</text>
						<text class="app-card-desc">总结 · 速查</text>
					</view>
					<image class="app-card-arrow-img" src="/static/icons/arrow.svg" mode="aspectFit"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		emits: ['navigate', 'show-formulas', 'show-theorems', 'show-scaling', 'show-properties', 'go-conclusion']
	}
</script>
