<template>
	<view class="screen screen-cream">
		<view class="topbar compact-topbar">
			<text class="back-arrow" @click="$emit('navigate', 'formulas')">← 返回</text>
			<view class="topbar-title-wrap">
				<text class="brand-title small-brand">导数公式</text>
				<text class="topbar-subtitle">基本导数 · 三角函数 · 反三角 · 求导法则</text>
			</view>
			<text></text>
		</view>
		<view class="page-content formula-detail-content">
			<view class="formula-group-card">
				<text class="formula-group-title">基本导数公式</text>
				<view class="formula-card-grid">
					<view class="formula-mini-card"><text class="formula-mini-line">(C)' = 0</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(xⁿ)' = n·xⁿ⁻¹</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(eˣ)' = eˣ</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(aˣ)' = aˣ·lna</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(lnx)' = ¹⁄ₓ</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(logₐx)' = ¹⁄₍ₓ·ₗₙₐ₎</text></view>
				</view>
			</view>

			<view class="formula-group-card">
				<text class="formula-group-title">三角函数导数</text>
				<view class="formula-card-grid">
					<view class="formula-mini-card"><text class="formula-mini-line">(sinx)' = cosx</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(cosx)' = −sinx</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(tanx)' = sec²x</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(cotx)' = −csc²x</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(secx)' = secx·tanx</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(cscx)' = −cscx·cotx</text></view>
				</view>
			</view>

			<view class="formula-group-card">
				<text class="formula-group-title">反三角函数导数</text>
				<view class="formula-card-grid">
					<view class="formula-mini-card"><text class="formula-mini-line">(arcsinx)' = </text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">√1−x²</text></view></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(arccosx)' = −</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">√1−x²</text></view></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(arctanx)' = </text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">1+x²</text></view></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(arccotx)' = −</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">1</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">1+x²</text></view></view>
				</view>
			</view>

			<view class="formula-group-card">
				<text class="formula-group-title">求导法则</text>
				<view class="formula-card-grid">
					<view class="formula-mini-card"><text class="formula-mini-line">(u±v)' = u' ± v'</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(uv)' = u'v + uv'</text></view>
					<view class="formula-mini-card"><text class="formula-mini-line">(u/v)' = </text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">u'v − uv'</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">v²</text></view></view>
					<view class="formula-mini-card formula-mini-wide"><text class="formula-mini-line">链式：</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">dy</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">dx</text></view><text class="formula-mini-line"> = </text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">dy</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">du</text></view><text class="formula-mini-line"> · </text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">du</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">dx</text></view></view>
					<view class="formula-mini-card formula-mini-wide"><text class="formula-mini-line">隐函数：F(x,y)=0</text><text class="formula-mini-eq">→</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">dy</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">dx</text></view><text class="formula-mini-line"> = −</text><view class="formula-mini-frac sup-frac"><text class="formula-mini-num">Fₓ</text><text class="formula-mini-bar">—</text><text class="formula-mini-den">Fᵧ</text></view></view>
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
