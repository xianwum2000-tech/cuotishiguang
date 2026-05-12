<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<text class="back-arrow" @click="$emit('navigate', 'formulas')">← 返回</text>
			<view class="topbar-title-wrap">
				<text class="brand-title small-brand">极限公式</text>
				<text class="topbar-subtitle">泰勒 · 等价无穷小 · 重要极限 · 洛必达</text>
			</view>
			<text></text>
		</view>
		<view class="page-content formula-detail-content">
			<view class="formula-group-card">
				<text class="formula-group-title">泰勒展开（x=0）</text>
				<view class="formula-card-grid">
					<view class="formula-mini-card"><text class="formula-mini-line">eˣ = 1+x+</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">x²</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">2!</text></view><text class="formula-mini-line">+</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">x³</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">3!</text></view></view>
					<view class="formula-mini-card"><text class="formula-mini-line">sinx = x−</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">x³</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">3!</text></view></view>
					<view class="formula-mini-card"><text class="formula-mini-line">cosx = 1−</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">x²</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">2!</text></view></view>
					<view class="formula-mini-card"><text class="formula-mini-line">tanx = x+</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">x³</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">3</text></view></view>
					<view class="formula-mini-card"><text class="formula-mini-line">arcsinx = x+</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">x³</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">6</text></view></view>
					<view class="formula-mini-card"><text class="formula-mini-line">arctanx = x−</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">x³</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">3</text></view></view>
					<view class="formula-mini-card"><text class="formula-mini-line">ln(1+x) = x−</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">x²</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">2</text></view><text class="formula-mini-line">+</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">x³</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">3</text></view></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(1+x)ᵅ = 1+αx+</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">α(α−1)x²</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">2!</text></view></view>
					<view class="formula-mini-card"><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">1−x</text></view><text class="formula-mini-line"> = 1+x+x²+x³</text></view>
					<view class="formula-mini-card"><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">1+x</text></view><text class="formula-mini-line"> = 1−x+x²−x³</text></view>
				</view>
			</view>

			<view class="formula-group-card">
				<text class="formula-group-title">等价无穷小（x→0）</text>
				<view class="formula-card-grid">
					<view class="formula-mini-card"><text class="formula-mini-line">sinx ~ x</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">tanx ~ x</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">arcsinx ~ x</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">arctanx ~ x</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">ln(1+x) ~ x</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">eˣ−1 ~ x</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">1−cosx ~ </text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">x²</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">2</text></view></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(1+x)ᵅ−1 ~ αx</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">aˣ−1 ~ x·lna</text></view>
				</view>
			</view>

			<view class="formula-group-card">
				<text class="formula-group-title">重要极限</text>
				<view class="formula-card-grid">
					<view class="formula-mini-card"><view class="formula-mini-frac"><text class="formula-mini-num">sinx</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">x</text></view><text class="formula-mini-eq">→ 1</text><text class="formula-mini-cond">x→0</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(1+x)</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">x</text></view><text class="formula-mini-eq">→ e</text><text class="formula-mini-cond">x→0</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(1+</text><view class="formula-mini-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">x</text></view><text class="formula-mini-line">)ˣ → e</text><text class="formula-mini-cond">x→∞</text></view>
				</view>
			</view>

			<view class="formula-group-card">
				<text class="formula-group-title">洛必达法则</text>
				<view class="formula-card-grid">
					<view class="formula-mini-card formula-mini-wide">
						<view class="formula-mini-frac">
							<text class="formula-mini-num">f(x)</text>
							<text class="formula-mini-bar">—</text>
							<text class="formula-mini-den">g(x)</text>
						</view>
						<text class="formula-mini-eq">=</text>
						<view class="formula-mini-frac">
							<text class="formula-mini-num">f'(x)</text>
							<text class="formula-mini-bar">—</text>
							<text class="formula-mini-den">g'(x)</text>
						</view>
					</view>
				</view>
				<text class="formula-footnote">适用于 0/0 或 ∞/∞ 型，可多次使用</text>
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
