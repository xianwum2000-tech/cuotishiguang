<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<text class="back-arrow" @click="$emit('navigate', 'apps')">← 返回</text>
			<view class="topbar-title-wrap">
				<text class="brand-title small-brand">积分公式</text>
				<text class="topbar-subtitle">基本积分 · 三角积分 · 凑微分 · 积分技巧</text>
			</view>
			<text></text>
		</view>
		<view class="page-content formula-detail-content">
			<view class="formula-group-card">
				<text class="formula-group-title">基本积分公式</text>
				<view class="formula-card-grid">
					<view class="formula-mini-card"><text class="formula-mini-line">∫ xⁿ dx = </text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">xⁿ⁺¹</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">n+1</text></view><text class="formula-mini-line"> + C</text><text class="formula-mini-cond">n≠−1</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">∫ ¹⁄ₓ dx = ln|x| + C</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">∫ eˣ dx = eˣ + C</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">∫ aˣ dx = aˣ⁄lna + C</text></view>
				</view>
			</view>

			<view class="formula-group-card">
				<text class="formula-group-title">三角函数积分</text>
				<view class="formula-card-grid">
					<view class="formula-mini-card"><text class="formula-mini-line">∫ sinx dx = −cosx + C</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">∫ cosx dx = sinx + C</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">∫ tanx dx = −ln|cosx| + C</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">∫ cotx dx = ln|sinx| + C</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">∫ sec²x dx = tanx + C</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">∫ csc²x dx = −cotx + C</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">∫ secx·tanx dx = secx + C</text></view>
				</view>
			</view>

			<view class="formula-group-card">
				<text class="formula-group-title">常见凑微分</text>
				<view class="formula-card-grid">
					<view class="formula-mini-card"><text class="formula-mini-line">∫ </text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">1+x²</text></view><text class="formula-mini-line"> dx = arctanx + C</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">∫ </text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">√1−x²</text></view><text class="formula-mini-line"> dx = arcsinx + C</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">∫ </text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">a²+x²</text></view><text class="formula-mini-line"> dx = </text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">a</text></view><text class="formula-mini-line"> arctan</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">x</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">a</text></view><text class="formula-mini-line"> + C</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">∫ </text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">√a²−x²</text></view><text class="formula-mini-line"> dx = arcsin</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">x</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">a</text></view><text class="formula-mini-line"> + C</text></view>
					<view class="formula-mini-card formula-mini-wide"><text class="formula-mini-line">∫ </text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">x²−a²</text></view><text class="formula-mini-line"> dx = </text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">2a</text></view><text class="formula-mini-line"> ln</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">x−a</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">x+a</text></view><text class="formula-mini-line"> + C</text></view>
				</view>
			</view>

			<view class="formula-group-card">
				<text class="formula-group-title">积分技巧</text>
				<view class="formula-card-grid">
					<view class="formula-mini-card"><text class="formula-mini-line">分部积分：∫ u dv = uv − ∫ v du</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">换元积分：∫ f[φ(x)]φ'(x)dx = ∫ f(t)dt</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">定积分：∫ₐᵇ f(x)dx = F(b) − F(a)</text></view>
					<view class="formula-mini-card formula-mini-wide"><text class="formula-mini-line">华里士：∫₀ᵖⁱᐟ² sinⁿx dx，n奇→</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">(n−1)!!</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">n!!</text></view><text class="formula-mini-line">，n偶→</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">(n−1)!!</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">n!!</text></view><text class="formula-mini-line">·</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">π</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">2</text></view></view>
				</view>
			</view>
			<view style="height: 24px;"></view>
		</view>
	</view>
</template>

<script>
	export default {
		emits: ['navigate']
	}
</script>
