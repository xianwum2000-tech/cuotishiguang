<template>
	<view class="app">
		<view class="phone">
			<HomeScreen
				v-if="screen === 'home'"
				:mistakes="mistakes"
				:records="records"
				:preferences="preferences"
				:quotes-data="quotesData"
				:progress-rings="progressRings"
				:countdown-target="countdownTarget"
				:countdown-label="countdownLabel"
				:watchlist-items="watchlistItems"
				:knowledge-items="knowledgeItems"
				@navigate="navigateTo"
				@start-review="startReview"
				@goto-watchlist="goWatchlist"
				@goto-knowledge="goKnowledge"
			/>

			<AddScreen
				v-if="screen === 'add'"
				:subject-options="subjectOptions"
				:custom-subjects="customSubjects"
				:custom-chapters="customChapters"
				:custom-error-types="customErrorTypes"
				:error-type-options="errorTypeOptions"
				:difficulty-options="difficultyOptions"
				@navigate="handleAddScreenNavigate"
				@show-detail="showDetail"
				@data-changed="refreshData"
			/>

			<TodayListScreen
				v-if="screen === 'today'"
				:mistakes="mistakes"
				:records="records"
				:preferences="preferences"
				:subject-options="subjectOptions"
				:custom-subjects="customSubjects"
				@navigate="navigateTo"
				@start-review="startReview"
			/>

			<ReviewScreen
				v-if="screen === 'review'"
				:key="activeReview.id"
				:active-review="activeReview"
				:has-active-review="hasActiveReview"
				:due-count="dueCount"
				:filtered-today-list="filteredTodayList"
				:preferences="preferences"
				@navigate="handleReviewNavigate"
				@review-completed="handleReviewCompleted"
			/>

			<LibraryScreen
				v-if="screen === 'library'"
				:mistakes="mistakes"
				:subject-options="subjectOptions"
				:custom-subjects="customSubjects"
				:error-type-options="errorTypeOptions"
				:custom-error-types="customErrorTypes"
				@navigate="navigateTo"
				@show-detail="showDetail"
				@add-mistake="showAdd"
			/>

			<DetailScreen
				v-if="screen === 'detail'"
				:active-detail="activeDetail"
				:has-active-detail="hasActiveDetail"
				:detail-records="detailRecords"
				:preferences="preferences"
				@navigate="navigateTo"
				@archive="archiveActiveDetail"
				@edit="enterEdit"
				@replace-image="replaceDetailImage"
				@preview-images="previewMistakeImages"
			/>

			<AppsScreen
				v-if="screen === 'apps'"
				@navigate="navigateTo"
				@show-formulas="showFormulas"
				@show-theorems="showTheorems"
				@show-scaling="showScaling"
				@show-properties="showProperties"
				@go-conclusion="goConclusion"
			/>

			<FormulasScreen
				v-if="screen === 'formulas'"
				@navigate="navigateTo"
				@show-limits="showLimits"
				@show-derivatives="showDerivatives"
				@show-integrals="showIntegrals"
			/>

				<view v-if="screen === 'limits'" class="screen screen-cream">
					<view class="topbar compact-topbar">
						<text class="back-arrow" @click="handleBackPress">← 返回</text>
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
						<view v-if="screen === 'derivatives'" class="screen screen-cream">
					<view class="topbar compact-topbar">
						<text class="back-arrow" @click="handleBackPress">← 返回</text>
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
						<view v-if="screen === 'integrals'" class="screen screen-cream">
					<view class="topbar compact-topbar">
						<text class="back-arrow" @click="handleBackPress">← 返回</text>
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
<view v-if="screen === 'theorems'" class="screen screen-cream">
				<view class="topbar compact-topbar">
					<text class="back-arrow" @click="handleBackPress">← 返回</text>
					<view class="topbar-title-wrap">
						<text class="brand-title small-brand">定理合集</text>
						<text class="topbar-subtitle">中值 · 积分 · 级数</text>
					</view>
					<text></text>
				</view>
				<view class="page-content formulas-content">
					<view class="formulas-placeholder soft-card">
						<text class="formulas-placeholder-icon">◈</text>
						<text class="formulas-placeholder-title">考研数学定理</text>
						<text class="formulas-placeholder-sub">定理内容即将上线</text>
					</view>
				</view>
			</view>

				<view v-if="screen === 'scaling'" class="screen screen-cream">
					<view class="topbar compact-topbar">
						<text class="back-arrow" @click="handleBackPress">← 返回</text>
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

				<view v-if="screen === 'properties'" class="screen screen-cream">
					<view class="topbar compact-topbar">
						<text class="back-arrow" @click="handleBackPress">← 返回</text>
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

			<StatsScreen
				v-if="screen === 'stats'"
				:mistakes="mistakes"
				:records="records"
				:preferences="preferences"
				:app-version="appVersion"
				:update-configured="updateConfigured"
				:update-checking="updateChecking"
				:update-downloading="updateDownloading"
				:update-progress="updateProgress"
				:latest-version="latestVersion"
				@navigate="navigateTo"
				@check-update="checkAppUpdate"
				@install-update="installLatestVersion"
				@goto-review-report="goReviewReport"
			/>

			<ProfileScreen
				v-if="screen === 'profile'"
				:preferences="preferences"
				:app-version="appVersion"
				:update-configured="updateConfigured"
				:update-checking="updateChecking"
				:update-downloading="updateDownloading"
				:update-progress="updateProgress"
				:latest-version="latestVersion"
				@navigate="navigateTo"
				@check-update="checkAppUpdate"
			/>

			<view v-if="screen === 'quotes-settings'" class="screen screen-cream">
				<view class="topbar compact-topbar">
					<view class="brand-row">
						<view class="back-button" @click="handleBackPress"><text>‹</text></view>
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

			<SettingsScreen
				v-if="screen === 'settings'"
				:preferences="preferences"
				:countdown-target="countdownTarget"
				:countdown-label="countdownLabel"
				:progress-rings="progressRings"
				:daily-goal-mode="dailyGoalMode"
				:daily-goal-fixed="dailyGoalFixed"
				:ocr-api-key="ocrApiKey"
				:ocr-model="ocrModel"
				:github-token="githubToken"
				:daily-goal-target="dailyGoalTarget"
				:quotes-data="quotesData"
				@navigate="handleSettingsNavigate"
				@save-settings="handleSaveSettings"
				@save-countdown="handleSaveCountdown"
				@save-progress-rings="handleSaveProgressRings"
				@reset-settings="resetHomeSettings"
				@reset-ai-data="resetAiData"
			/>

			<EditScreen
				v-if="screen === 'edit'"
				:initial-mistake="editingMistake"
				:subject-options="subjectOptions"
				:custom-subjects="customSubjects"
				:custom-chapters="customChapters"
				:custom-error-types="customErrorTypes"
				:error-type-options="errorTypeOptions"
				:difficulty-options="difficultyOptions"
				@navigate="handleEditNavigate"
				@data-changed="handleEditDataChanged"
			/>

			<!-- AI 聊天屏幕 -->
			<view v-if="screen === 'ai-chat'" class="screen screen-lilac ai-screen">
				<view class="topbar compact-topbar">
					<view class="brand-row">
						<view class="back-button" @click="handleBackPress"><text>‹</text></view>
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

			<!-- AI 设置屏幕 -->
			<view v-if="screen === 'ai-settings'" class="screen screen-cream">
				<view class="topbar compact-topbar">
					<view class="brand-row">
						<view class="back-button" @click="handleBackPress"><text>‹</text></view>
						<text class="brand-title small-brand">AI 配置</text>
					</view>
					<text class="gear small-gear" @click="saveAiSettings">保存</text>
				</view>
				<view class="page-content" style="padding-top: 20px;">
					<view class="settings-card soft-card">
						<text class="field-label">API Key</text>
						<input class="settings-input" v-model="aiSettingsForm.deepseekApiKey" placeholder="输入你的 DeepSeek API Key" type="password" />

						<text class="field-label field-space">API Base URL</text>
						<input class="settings-input" v-model="aiSettingsForm.deepseekBaseUrl" placeholder="https://api.deepseek.com" />

						<text class="field-label field-space">选择模型</text>
						<view class="ai-model-grid">
							<view v-for="m in aiModelOptions" :key="m.id"
								:class="aiSettingsForm.deepseekModel === m.id ? 'ai-model-card ai-model-active' : 'ai-model-card'"
								@click="aiSettingsForm.deepseekModel = m.id"
							>
								<text class="ai-model-name">{{ m.name }}</text>
								<text class="ai-model-desc">{{ m.desc }}</text>
							</view>
						</view>
					</view>

					<view class="settings-card soft-card">
						<text class="field-label">AI 性格设定</text>
						<textarea class="ai-personality-field" v-model="aiSettingsForm.aiPersonality" placeholder="自定义 AI 的性格和回答风格，例如：&#10;&#10;请用轻松幽默的语气回答，多举例子帮助理解。&#10;每次回答结尾给我留一道练习题。&#10;回答要详细，推导过程要完整。" :maxlength="500"></textarea>
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

			<view v-if="screen === 'home' || screen === 'library' || screen === 'ai-chat' || screen === 'ai-settings' || screen === 'apps' || screen === 'stats'" class="bottom-nav">
				<view :class="homeNavClass" @click="showHome">
					<image class="nav-icon-img" src="/static/icons/home.svg" mode="aspectFit"></image>
					<text class="nav-label">首页</text>
				</view>
				<view :class="libraryNavClass" @click="showLibrary">
					<image class="nav-icon-img" src="/static/icons/library.svg" mode="aspectFit"></image>
					<text class="nav-label">错题</text>
				</view>
				<view :class="aiNavClass" @click="showAiChat">
					<view class="ai-nav-icon-wrap">
						<image class="nav-icon-img ai-nav-icon-img" src="/static/icons/ai.svg" mode="aspectFit"></image>
					</view>
					<text class="nav-label">AI</text>
				</view>
				<view :class="screen === 'apps' || screen === 'formulas' || screen === 'theorems' || screen === 'scaling' || screen === 'properties' || screen === 'limits' || screen === 'derivatives' || screen === 'integrals' ? 'nav-item nav-active' : 'nav-item'" @click="showApps">
					<image class="nav-icon-img" src="/static/icons/apps.svg" mode="aspectFit"></image>
					<text class="nav-label">应用</text>
				</view>
				<view :class="screen === 'stats' ? 'nav-item nav-active' : 'nav-item'" @click="showStats">
					<image class="nav-icon-img" src="/static/icons/user.svg" mode="aspectFit"></image>
					<text class="nav-label">用户</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import HomeScreen from './screens/HomeScreen.vue'
	import AddScreen from './screens/AddScreen.vue'
	import ReviewScreen from './screens/ReviewScreen.vue'
	import TodayListScreen from './screens/TodayListScreen.vue'
	import LibraryScreen from './screens/LibraryScreen.vue'
	import DetailScreen from './screens/DetailScreen.vue'
	import StatsScreen from './screens/StatsScreen.vue'
	import SettingsScreen from './screens/SettingsScreen.vue'
	import EditScreen from './screens/EditScreen.vue'
	import ProfileScreen from './screens/ProfileScreen.vue'
	import FormulasScreen from './screens/FormulasScreen.vue'
	import AppsScreen from './screens/AppsScreen.vue'
	import { addDays, daysBetween, todayKey } from '@/utils/date.js'
	import {
		getDueMistakes,
		getOverdueMistakes,
		getResultLabel,
		getStageLabel,
		getOverdueDays,
		sortMistakesByPriority
	} from '@/utils/review/scheduler.js'
	import {
		archiveMistake,
		completeReview,
		getCustomOptions,
		getMistakeById,
		getMistakes,
		getPreferences,
		getQuotes,
		getReviewRecords,
		savePreferences,
		saveQuotes,
		updateMistake,
		getAiChatHistory,
		saveAiChatHistory,
		clearAiChatHistory
	} from '@/utils/storage/storage.js'
	import { buildSystemPrompt, callDeepSeek, trimMessages, formatAiText as _formatAiText } from '@/utils/ai/ai.js'
	import { persistImageFile, previewImages } from '@/utils/file.js'
	import { checkForUpdate, downloadAndInstallApk, getUpdateRuntimeInfo } from '@/utils/app/updater.js'
import { getOcrConfig, recognizeImage, extractQuestionNumber } from '@/utils/ai/ocr.js'

	function createDefaultPreferences() {
		return {
			homeTitle: '复习达人',
			greetingTitle: '早上好，小明',
			homeAvatar: '/static/stitch_assets/avatar-home.jpg',
			statsName: '小明'
		}
	}

	function createEmptyMistake() {
		return {
			id: '',
			questionImage: '',
			answerImage: '',
			subject: '',
			chapter: '',
			errorType: '',
			difficulty: '',
			source: '',
			note: '',
			questionText: '',
			answerText: '',
			ocrStatus: '',
			createdAt: '',
			updatedAt: '',
			reviewStage: 'new',
			nextReviewDate: '',
			totalReviewCount: 0,
			totalWrongCount: 0,
			lastReviewResult: '',
			isArchived: false
		}
	}

	export default {
		components: { HomeScreen, AddScreen, ReviewScreen, TodayListScreen, LibraryScreen, DetailScreen, StatsScreen, SettingsScreen, ProfileScreen, EditScreen, FormulasScreen, AppsScreen },
		data() {
			return {
				_tick: Date.now(),
				screen: 'home',
					screenHistory: [],
					lastBackTime: 0,
				mistakes: [],
				records: [],
				appVersion: getUpdateRuntimeInfo().current,
				updateConfigured: getUpdateRuntimeInfo().configured,
				updateManifestUrl: getUpdateRuntimeInfo().manifestUrl,
				updateChecking: false,
				updateDownloading: false,
				updateProgress: 0,
				latestVersion: {
					versionName: '',
					versionCode: 0,
					apkUrl: '',
					changelog: '',
					force: false
				},
				preferences: createDefaultPreferences(),
				quotesData: getQuotes(),
				quoteSettingsForm: getQuotes(),
				activeReview: createEmptyMistake(),
				activeDetail: createEmptyMistake(),
				hasActiveReview: false,
				hasActiveDetail: false,
				todaySubject: '全部',
				todayChapter: '全部',
				librarySubject: '全部',
				libraryError: '全部',
				libraryKeyword: '',
				imageSaving: false,
				imageMigrationDone: false,
				subjectOptions: ['高数', '线代', '概率'],
				errorTypeOptions: ['思路错', '计算错', '公式忘记', '审题失误'],
				difficultyOptions: ['简单', '中等', '偏难'],
				customSubjects: [],
				customChapters: {},
				customErrorTypes: [],
				editingMistakeId: null,
				progressRings: [
					{ name: '高数', current: 0, target: 10 },
					{ name: '线代', current: 0, target: 10 },
					{ name: '概率', current: 0, target: 10 }
				],
				countdownTarget: '2027-12-25',
				countdownLabel: '距离27年考研还剩下',
				watchlistItems: [],
				knowledgeItems: [],
				aiMessages: [],
				aiInputText: '',
				aiLoading: false,
				aiInitialized: false,
				aiVisibleCount: 50,
				aiSettingsForm: {
					deepseekApiKey: '',
					deepseekBaseUrl: 'https://api.deepseek.com',
					deepseekModel: 'deepseek-chat',
					aiPersonality: ''
				},
				aiModelOptions: [
					{ id: 'deepseek-v4-pro', name: 'V4 Pro', desc: '最强 · 数学推理最佳' },
					{ id: 'deepseek-v4-flash', name: 'V4 Flash', desc: '快速 · 性价比高' },
					{ id: 'deepseek-chat', name: 'V3 Chat', desc: '标准 · 够用实惠' },
					{ id: 'deepseek-reasoner', name: 'R1 推理', desc: '深度推理 · 严谨' }
				],
				dailyGoalMode: 'dynamic',
				dailyGoalFixed: 10,
				todayCompletedCount: 0,
				ocrApiKey: '',
				ocrModel: 'qwen-vl-plus',
				githubToken: '',
				detailQTab: 'text',
				detailATab: 'text',
				detailOcrLoading: '',
				_aiScrollTop: 0,
				_aiAbort: null,
				_aiRequestTime: 0
			}
		},
		computed: {
			currentDate() {
				void this._tick
				return todayKey()
			},
			currentQuote() {
				void this._tick
				const data = this.quotesData
				if (!data.quotes || data.quotes.length === 0) return ''
				const days = Math.abs(data.quoteDays || 1)
				const idx = Math.floor(Date.now() / (days * 86400000)) % data.quotes.length
				return data.quotes[idx]
			},
			activeMistakes() {
				return this.mistakes.filter((item) => !item.isArchived)
			},
			totalCount() {
				return this.activeMistakes.length
			},
			dueList() {
				return getDueMistakes(this.activeMistakes, this.currentDate)
			},
			dueCount() {
				return this.dueList.length
			},
			overdueCount() {
				return getOverdueMistakes(this.activeMistakes, this.currentDate).length
			},
			watchlistPendingCount() {
				return this.watchlistItems.filter(item => !item.done).length
			},
			knowledgePendingCount() {
				return this.knowledgeItems.filter(item => !item.done).length
			},
			countdownDays() {
				void this._tick
				try {
					const target = new Date(this.countdownTarget + 'T00:00:00')
					const today = new Date()
					today.setHours(0, 0, 0, 0)
					const diff = Math.ceil((target - today) / 86400000)
					return diff >= 0 ? diff : 0
				} catch (e) { return 0 }
			},
			countdownText() {
				return this.countdownLabel || '距离考研还剩下'
			},
			masteredCount() {
				return this.activeMistakes.filter((item) => item.reviewStage === 'pass3' && item.lastReviewResult === 'known').length
			},
			dailyGoalTarget() {
				if (this.dailyGoalMode === 'fixed') {
					return Math.max(3, Math.min(30, this.dailyGoalFixed))
				}
				var due = this.dueCount
				var overdue = this.overdueCount
				return Math.max(3, Math.min(30, due + Math.ceil(overdue * 0.2)))
			},
			dailyGoalProgress() {
				return Math.min(this.todayCompletedCount, this.dailyGoalTarget)
			},
			dailyGoalCompleted() {
				return this.todayCompletedCount >= this.dailyGoalTarget
			},
			goalConicGradient() {
				var pct = this.dailyGoalTarget > 0 ? Math.min(100, Math.round(this.todayCompletedCount / this.dailyGoalTarget * 100)) : 0
				return 'conic-gradient(#F59E0B 0% ' + pct + '%, #E7E5E4 ' + pct + '% 100%)'
			},
			priorityList() {
				return this.dueList.slice(0, 3)
			},
			subjectOptionsAll() {
				return this.subjectOptions.concat(this.customSubjects)
			},
			errorTypeOptionsAll() {
				return this.errorTypeOptions.concat(this.customErrorTypes)
			},
			editingMistake() {
				if (!this.editingMistakeId) return null
				return getMistakeById(this.editingMistakeId)
			},
			filterSubjects() {
				return ['全部'].concat(this.subjectOptionsAll)
			},
			filterChapters() {
				const names = ['全部']
				this.activeMistakes.forEach((item) => {
					if (item.chapter && names.indexOf(item.chapter) < 0) names.push(item.chapter)
				})
				return names
			},
			filterErrors() {
				return ['全部'].concat(this.errorTypeOptionsAll)
			},
			filteredTodayList() {
				return this.dueList.filter((item) => {
					const subjectMatch = this.todaySubject === '全部' || item.subject === this.todaySubject
					const chapterMatch = this.todayChapter === '全部' || item.chapter === this.todayChapter
					return subjectMatch && chapterMatch
				})
			},
			libraryList() {
				const keyword = this.libraryKeyword.trim()
				const filtered = this.activeMistakes.filter((item) => {
					const subjectMatch = this.librarySubject === '全部' || item.subject === this.librarySubject
					const errorMatch = this.libraryError === '全部' || item.errorType === this.libraryError
					const note = item.note || ''
					const keywordMatch =
						keyword.length === 0 ||
						item.chapter.indexOf(keyword) >= 0 ||
						item.errorType.indexOf(keyword) >= 0 ||
						note.indexOf(keyword) >= 0
					return subjectMatch && errorMatch && keywordMatch
				})
				return sortMistakesByPriority(filtered, this.currentDate)
			},
			detailRecords() {
				if (!this.hasActiveDetail) return []
				return this.records.filter((record) => record.questionId === this.activeDetail.id)
			},
			visibleAiMessages() {
				var msgs = this.aiMessages
				if (msgs.length <= this.aiVisibleCount) return msgs
				return msgs.slice(msgs.length - this.aiVisibleCount)
			},
			aiHasMoreMessages() {
				return this.aiMessages.length > this.aiVisibleCount
			},
			homeNavClass() {
				return this.screen === 'home' || this.screen === 'settings' ? 'nav-item nav-active' : 'nav-item'
			},
			reviewNavClass() {
				return this.screen === 'today' || this.screen === 'review' ? 'nav-item nav-active' : 'nav-item'
			},
			libraryNavClass() {
				return this.screen === 'library' || this.screen === 'detail' || this.screen === 'add' ? 'nav-item nav-active' : 'nav-item'
			},
			aiNavClass() {
				return this.screen === 'ai-chat' || this.screen === 'ai-settings' ? 'nav-item nav-item-ai nav-active' : 'nav-item nav-item-ai'
			}
		},
		onLoad() {
			this.refreshData()
			this.migrateStoredImages()
			var self = this
			if (typeof plus !== 'undefined' && plus.key) {
				plus.key.addEventListener('backbutton', function() {
					self.handleBackPress()
					return false
				})
			}
			this._tickTimer = setInterval(function() {
				self._tick = Date.now()
			}, 60000)
			setTimeout(function() {
				self.checkAppUpdate(true)
			}, 1500)
		},
		onUnload() {
			if (this._tickTimer) {
				clearInterval(this._tickTimer)
				this._tickTimer = null
			}
		},
					onShow() {
				this.refreshData()
			},
			methods: {
			navigateTo(newScreen) {
				if (this.screen && this.screen !== newScreen) {
					this.screenHistory.push(this.screen)
				}
				this.screen = newScreen
			},
			handleBackPress() {
				if (this.screenHistory.length > 0) {
					this.screen = this.screenHistory.pop()
					return
				}
				if (this.screen !== 'home') {
					this.showHome()
					return
				}
				var now = Date.now()
				if (now - this.lastBackTime < 2000) {
					if (typeof plus !== 'undefined' && plus.runtime) {
						plus.runtime.quit()
					}
				} else {
					this.lastBackTime = now
				}
			},
			refreshData() {
				this.mistakes = getMistakes()
				this.records = getReviewRecords()
				this.preferences = getPreferences()
				const co = getCustomOptions()
				this.customSubjects = co.subjects || []
				this.customChapters = co.chapters || {}
				this.customErrorTypes = co.errorTypes || []
				const runtimeInfo = getUpdateRuntimeInfo()
				this.appVersion = runtimeInfo.current
				this.updateConfigured = runtimeInfo.configured
				this.updateManifestUrl = runtimeInfo.manifestUrl
				this.loadProgressRings()
				this.loadCountdown()
				try {
					const wl = uni.getStorageSync('mistake_scheduler_watchlist_v1')
					this.watchlistItems = Array.isArray(wl) ? wl : []
				} catch (e) { this.watchlistItems = [] }
				try {
					const kn = uni.getStorageSync('mistake_scheduler_knowledge_v1')
					this.knowledgeItems = Array.isArray(kn) ? kn : []
				} catch (e) { this.knowledgeItems = [] }
				var prefs = getPreferences()
				this.dailyGoalMode = prefs.dailyGoalMode || 'dynamic'
				this.dailyGoalFixed = prefs.dailyGoalFixed || 10
				this.ocrApiKey = prefs.ocrApiKey || ''
				this.ocrModel = prefs.ocrModel || 'qwen-vl-plus'
				this.githubToken = prefs.githubToken || ''
				this.refreshTodayCompletedCount()
			},
			refreshTodayCompletedCount() {
				var today = todayKey()
				var prev = this.todayCompletedCount
				this.todayCompletedCount = this.records.filter(function(r) { return r.reviewDate === today }).length
				if (prev < this.dailyGoalTarget && this.todayCompletedCount >= this.dailyGoalTarget) {
					uni.showToast({ title: '今日目标已达成！', icon: 'success' })
				}
			},
			async migrateStoredImages() {
				if (this.imageMigrationDone) return
				this.imageMigrationDone = true
				let hasChanged = false

				for (let index = 0; index < this.mistakes.length; index++) {
					const item = this.mistakes[index]
					const question = await persistImageFile(item.questionImage)
					const answer = await persistImageFile(item.answerImage)
					const patch = {}
					if (question.changed) patch.questionImage = question.path
					if (answer.changed) patch.answerImage = answer.path
					if (Object.keys(patch).length > 0) {
						updateMistake(item.id, patch)
						hasChanged = true
					}
				}

				const avatar = await persistImageFile(this.preferences.homeAvatar)
				if (avatar.changed) {
					this.preferences = savePreferences({
						...this.preferences,
						homeAvatar: avatar.path
					})
					hasChanged = true
				}

				if (hasChanged) this.refreshData()
			},
			showHome() {
				this.refreshData()
				this.screenHistory = []
				this.screen = 'home'
			},
			showAdd() {
				this.navigateTo('add')
			},
			handleAddScreenNavigate(target) {
				if (target === 'back') {
					this.handleBackPress()
				} else {
					this.navigateTo(target)
				}
			},
			goWatchlist() {
				uni.navigateTo({ url: '/pages/watchlist/watchlist' })
			},
			goKnowledge() {
				uni.navigateTo({ url: '/pages/knowledge/knowledge' })
			},
			goConclusion() {
				uni.navigateTo({ url: '/pages/conclusion/conclusion' })
			},
			goReviewReport() {
				uni.navigateTo({ url: '/pages/review-report/review-report' })
			},
			showToday() {
				this.refreshData()
				this.navigateTo('today')
			},
			showLibrary() {
				this.refreshData()
				this.navigateTo('library')
			},
			showStats() {
				this.refreshData()
				this.navigateTo('stats')
			},
			showApps() {
				this.navigateTo('apps')
			},
			showFormulas() {
				this.navigateTo('formulas')
			},
			showTheorems() {
				this.navigateTo('theorems')
			},
			showScaling() {
				this.navigateTo('scaling')
			},
			showProperties() {
				this.navigateTo('properties')
			},
			showLimits() {
				this.navigateTo('limits')
			},
			showDerivatives() {
				this.navigateTo('derivatives')
			},
			showIntegrals() {
				this.navigateTo('integrals')
			},
			showProfile() {
				this.refreshData()
				this.navigateTo('profile')
			},
			showQuotesSettings() {
				this.quoteSettingsForm = JSON.parse(JSON.stringify(this.quotesData))
				this.navigateTo('quotes-settings')
			},
			addQuote() {
				this.quoteSettingsForm.quotes.push('')
			},
			removeQuote(index) {
				if (this.quoteSettingsForm.quotes.length <= 1) return
				this.quoteSettingsForm.quotes.splice(index, 1)
			},
			saveQuoteSettings() {
				const days = Math.max(1, parseInt(this.quoteSettingsForm.quoteDays) || 1)
				const quotes = this.quoteSettingsForm.quotes.filter(q => q.trim())
				if (quotes.length === 0) {
					this.toast('至少保留一条名句')
					return
				}
				const data = { quoteDays: days, quotes }
				saveQuotes(data)
				this.quotesData = data
				this.toast('名句设置已保存')
				this.handleBackPress()
			},
			showSettings() {
				this.preferences = getPreferences()
				this.navigateTo('settings')
			},
			handleSettingsNavigate(target) {
				if (target === 'back') {
					this.handleBackPress()
				} else {
					this.navigateTo(target)
				}
			},
			handleSaveSettings(form) {
				this.preferences = savePreferences(form)
				this.dailyGoalMode = form.dailyGoalMode
				this.dailyGoalFixed = form.dailyGoalFixed
				this.ocrApiKey = form.ocrApiKey
				this.ocrModel = form.ocrModel
				this.githubToken = form.githubToken
				this.toast('首页文案已保存')
				this.handleBackPress()
			},
			handleSaveCountdown(target, label) {
				this.countdownTarget = target
				this.countdownLabel = label
				uni.setStorageSync('mistake_scheduler_countdown_v1', { target, label })
				this.toast('倒计时已保存')
			},
			handleSaveProgressRings(rings) {
				this.progressRings = rings
				uni.setStorageSync('mistake_scheduler_progress_rings_v1', rings)
				this.toast('学习进度已保存')
			},
			resetHomeSettings() {
				var defaults = createDefaultPreferences()
				this.preferences = savePreferences(defaults)
				this.toast('已恢复默认')
				this.handleBackPress()
			},
			loadProgressRings() {
				try {
					const raw = uni.getStorageSync('mistake_scheduler_progress_rings_v1')
					if (Array.isArray(raw) && raw.length === 3) {
						this.progressRings = raw
					}
				} catch (e) {}
			},
			saveProgressRings() {
				uni.setStorageSync('mistake_scheduler_progress_rings_v1', this.progressRings)
				this.toast('学习进度已保存')
			},
			loadCountdown() {
				try {
					const raw = uni.getStorageSync('mistake_scheduler_countdown_v1')
					if (raw && typeof raw === 'object') {
						if (raw.target) this.countdownTarget = raw.target
						if (raw.label) this.countdownLabel = raw.label
					}
				} catch (e) {}
			},
			saveCountdown() {
				uni.setStorageSync('mistake_scheduler_countdown_v1', {
					target: this.countdownTarget,
					label: this.countdownLabel
				})
				this.toast('倒计时已保存')
			},
			ringConic(ring) {
				const pct = ring.target > 0 ? Math.min(ring.current / ring.target, 1) : 0
				const deg = pct * 360
				if (deg === 0) return '#E7E5E4'
				if (deg >= 360) return '#10B981'
				return 'conic-gradient(#10B981 0deg ' + deg + 'deg, #E7E5E4 ' + deg + 'deg 360deg)'
			},
			async checkAppUpdate(silent) {
				if (this.updateChecking || this.updateDownloading) return
				this.updateChecking = true
				const result = await checkForUpdate()
				this.updateChecking = false
				this.appVersion = result.current || this.appVersion

				if (!result.ok) {
					if (!silent) this.toast(this.updateErrorText(result.reason))
					return
				}

				if (!result.hasUpdate) {
					this.latestVersion = {
						versionName: '',
						versionCode: 0,
						apkUrl: '',
						changelog: '',
						force: false
					}
					if (!silent) this.toast('当前已是最新版本')
					return
				}

				this.latestVersion = result.remote
				this.showUpdateDialog(result.remote)
			},
			updateErrorText(reason) {
				if (reason === 'not-configured') return '还未配置 GitHub Releases 更新地址'
				if (reason === 'bad-manifest') return '更新配置格式不正确'
				if (reason === 'package-mismatch') return '更新包名不一致，已阻止安装'
				if (reason === 'network') return '检查更新失败，请稍后重试'
				return '检查更新失败'
			},
			showUpdateDialog(remote) {
				const content = remote.changelog || '检测到新版本，是否立即下载安装？'
				uni.showModal({
					title: '发现新版本 ' + remote.versionName,
					content,
					confirmText: '立即更新',
					cancelText: '稍后',
					showCancel: !remote.force,
					success: (res) => {
						if (res.confirm) this.installLatestVersion(remote)
					}
				})
			},
			async installLatestVersion(remote) {
				this.updateDownloading = true
				this.updateProgress = 0
				try {
					await downloadAndInstallApk(remote, (progress) => {
						this.updateProgress = Math.max(0, Math.min(100, progress))
					})
					this.updateDownloading = false
					this.toast('已调起安装，请按提示覆盖安装')
				} catch (error) {
					this.updateDownloading = false
					this.toast('下载或安装失败，请稍后重试')
				}
			},
			getChaptersForSubject(subject) {
				if (subject === '线代') return ['行列式', '矩阵', '向量', '线性方程组', '特征值']
				if (subject === '概率') return ['随机事件', '随机变量', '数字特征', '大数定律', '参数估计']
				if (subject === '高数') return ['极限', '导数', '积分', '级数', '多元函数']
				return this.customChapters[subject] || []
			},
			setTodaySubject(subject) {
				this.todaySubject = subject
			},
			setTodayChapter(chapter) {
				this.todayChapter = chapter
			},
			setLibrarySubject(subject) {
				this.librarySubject = subject
			},
			setLibraryError(errorType) {
				this.libraryError = errorType
			},
			async recognizeDetail(type) {
				var config = getOcrConfig()
				if (!config.apiKey) {
					uni.showToast({ title: '请先在设置中配置通义千问 API Key', icon: 'none' })
					return
				}
				var self = this
				this.detailOcrLoading = type
				try {
					var image = type === 'question' ? this.activeDetail.questionImage : this.activeDetail.answerImage
					var questionNumber = this.activeDetail.source ? extractQuestionNumber(this.activeDetail.source) : ''
					var text = await recognizeImage(image, questionNumber)
					var patch = type === 'question' ? { questionText: text } : { answerText: text }
					updateMistake(this.activeDetail.id, patch)
					this.activeDetail = getMistakeById(this.activeDetail.id)
					uni.showToast({ title: '识别完成', icon: 'success' })
				} catch (e) {
					uni.showToast({ title: '识别失败：' + e.message, icon: 'none' })
				} finally {
					this.detailOcrLoading = ''
				}
			},
			enterEdit() {
				if (!this.hasActiveDetail) return
				this.editingMistakeId = this.activeDetail.id
				this.navigateTo('edit')
			},
			handleEditNavigate(target) {
				if (target === 'back') {
					this.editingMistakeId = null
					this.handleBackPress()
				} else {
					this.navigateTo(target)
				}
			},
			handleEditDataChanged(updated) {
				this.refreshData()
				if (updated) {
					this.activeDetail = updated
				}
			},
			startFirstReview() {
				if (this.filteredTodayList.length === 0) {
					this.toast('当前筛选下没有待复习错题')
					return
				}
				this.startReview(this.filteredTodayList[0])
			},
			startReview(item) {
				this.activeReview = item
				this.hasActiveReview = true
				this.navigateTo('review')
			},
			handleReviewCompleted({ nextMistake }) {
				this.refreshData()
				if (nextMistake) {
					this.activeReview = nextMistake
					this.hasActiveReview = true
				} else {
					this.activeReview = createEmptyMistake()
					this.hasActiveReview = false
					if (this.screenHistory.length > 0 && this.screenHistory[this.screenHistory.length - 1] === 'today') {
						this.screenHistory.pop()
					}
					this.screen = 'today'
				}
			},
			handleReviewNavigate(payload) {
				if (typeof payload === 'string') {
					if (payload === 'today') {
						this.refreshData()
						this.navigateTo('today')
					} else {
						this.navigateTo(payload)
					}
				} else if (payload && payload.screen === 'detail' && payload.item) {
					this.showDetail(payload.item)
				}
			},
			showDetail(item) {
				this.refreshData()
				this.activeDetail = this.mistakes.find((mistake) => mistake.id === item.id) || item
				this.hasActiveDetail = true
				this.detailQTab = item.questionText ? 'text' : 'image'
				this.detailATab = item.answerText ? 'text' : 'image'
				this.navigateTo('detail')
			},
			replaceDetailImage(field) {
				if (!this.hasActiveDetail) return
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async (res) => {
						if (!res.tempFilePaths || res.tempFilePaths.length === 0) return
						this.imageSaving = true
						const output = await persistImageFile(res.tempFilePaths[0])
						const updated = updateMistake(this.activeDetail.id, {
							[field]: output.path
						})
						this.imageSaving = false
						this.refreshData()
						this.activeDetail = updated || this.activeDetail
						if (this.hasActiveReview && this.activeReview.id === this.activeDetail.id) {
							this.activeReview = this.activeDetail
						}
						this.toast('图片已更新')
					},
					fail: () => {
						this.imageSaving = false
					}
				})
			},
			archiveActiveDetail() {
				if (!this.hasActiveDetail) return
				archiveMistake(this.activeDetail.id)
				this.refreshData()
				this.activeDetail = createEmptyMistake()
				this.hasActiveDetail = false
				this.toast('已归档')
				this.handleBackPress()
			},
			priorityLabel(item) {
				if (getOverdueDays(item, this.currentDate) >= 2 || (item.totalWrongCount || 0) >= 3) return '高'
				if (getOverdueDays(item, this.currentDate) >= 1 || (item.totalWrongCount || 0) >= 1) return '中'
				return '低'
			},
			priorityCardClass(item) {
				const label = this.priorityLabel(item)
				if (label === '高') return 'priority-card priority-high soft-card'
				if (label === '中') return 'priority-card priority-mid soft-card'
				return 'priority-card priority-low soft-card'
			},
			priorityIconClass(item) {
				const label = this.priorityLabel(item)
				if (label === '高') return 'priority-icon priority-icon-high'
				if (label === '中') return 'priority-icon priority-icon-mid'
				return 'priority-icon priority-icon-low'
			},
			formatDueText(item) {
				const overdue = getOverdueDays(item, this.currentDate)
				if (overdue > 0) return '逾期' + overdue + '天'
				if (item.nextReviewDate === this.currentDate) return '今日'
				if (!item.nextReviewDate) return '未安排'
				const diff = daysBetween(item.nextReviewDate, this.currentDate)
				return diff + '天后'
			},
			noteText(note) {
				return note || '暂无备注'
			},
			stageLabel(stage) {
				return getStageLabel(stage)
			},
			resultLabel(result) {
				return getResultLabel(result)
			},
			previewSingleImage(filePath) {
				if (!previewImages([filePath], filePath)) this.toast('暂无可预览图片')
			},
			previewMistakeImages(item, current) {
				const urls = [item.questionImage, item.answerImage]
				if (!previewImages(urls, current)) this.toast('暂无可预览图片')
			},
			showAiChat() {
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

				this.navigateTo('ai-chat')
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
					this.toast('请先在设置中配置 API Key')
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
							self.toast('对话已清空')
						}
					}
				})
			},
			showAiSettings() {
				var prefs = getPreferences()
				this.aiSettingsForm = {
					deepseekApiKey: prefs.deepseekApiKey || '',
					deepseekBaseUrl: prefs.deepseekBaseUrl || 'https://api.deepseek.com',
					deepseekModel: prefs.deepseekModel || 'deepseek-chat',
					aiPersonality: prefs.aiPersonality || ''
				}
				this.navigateTo('ai-settings')
			},
			saveAiSettings() {
				var apiKey = (this.aiSettingsForm.deepseekApiKey || '').trim()
				var baseUrl = (this.aiSettingsForm.deepseekBaseUrl || '').trim() || 'https://api.deepseek.com'
				var model = (this.aiSettingsForm.deepseekModel || '').trim() || 'deepseek-chat'
				var personality = this.aiSettingsForm.aiPersonality || ''
				savePreferences({
					deepseekApiKey: apiKey,
					deepseekBaseUrl: baseUrl,
					deepseekModel: model,
					aiPersonality: personality
				})
				this.preferences = getPreferences()
				this.toast('AI 配置已保存')
				this.handleBackPress()
			},
			formatAiText(text) {
				return _formatAiText(text)
			},
			testAiConnection() {
				var apiKey = (this.aiSettingsForm.deepseekApiKey || '').trim()
				if (!apiKey) {
					this.toast('请先填写 API Key')
					return
				}
				var baseUrl = (this.aiSettingsForm.deepseekBaseUrl || '').trim() || 'https://api.deepseek.com'
				var model = (this.aiSettingsForm.deepseekModel || '').trim() || 'deepseek-chat'
				var self = this
				this.toast('正在测试...')
				callDeepSeek([{ role: 'user', content: '你好，请回复"连接成功"' }], apiKey, baseUrl, model).then(function(reply) {
					uni.showModal({ title: '连接成功', content: 'AI 回复：' + reply.substring(0, 100), showCancel: false })
				}).catch(function(err) {
					uni.showModal({ title: '连接失败', content: err.message, showCancel: false })
				})
			},
			resetAiData() {
				var self = this
				uni.showModal({
					title: '重置 AI 数据',
					content: '将清除所有聊天记录。API Key、模型选择等配置会保留。',
					confirmText: '继续',
					confirmColor: '#EF4444',
					success: function(res) {
						if (!res.confirm) return
						uni.showModal({
							title: '确认重置',
							content: '此操作不可撤销，确定要清除所有聊天记录吗？',
							confirmText: '确定重置',
							confirmColor: '#EF4444',
							success: function(res2) {
								if (!res2.confirm) return
								self.aiMessages = []
								self.aiInitialized = false
								self.aiLoading = false
								self._aiAbort = null
								self._aiRequestTime = 0
								self.aiVisibleCount = 50
								clearAiChatHistory()
								self.toast('AI 聊天记录已清除')
							}
						})
					}
				})
			},
			toast(title) {
				uni.showToast({
					title,
					icon: 'none'
				})
			}
		}
	}
</script>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap");

	@import "@/pages/styles/global.css";


	.home-content {
		padding-top: 10px;
	}

	.greeting-block {
		padding-top: 6px;
		padding-bottom: 16px;
	}


	.home-title {
		display: block;
		font-size: 27px;
		line-height: 36px;
		font-weight: 800;
		color: #171717;
	}

	.home-subtitle {
		display: block;
		margin-top: 3px;
		font-size: 16px;
		line-height: 24px;
		color: #766F6A;
	}


	.status-grid {
		display: flex;
		flex-direction: row;
		width: 100%;
		margin-top: 28px;
	}


	.study-actions {
		display: flex;
		flex-direction: row;
		width: 100%;
		margin-top: 40px;
		margin-bottom: 36px;
		align-items: center;
	}

	.add-mistake-button,
	.review-start-button {
		flex: 1;
		height: 64px;
		border-radius: 24px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.add-mistake-button:active,
	.review-start-button:active {
		transform: scale(0.96);
	}

	.add-mistake-button {
		margin-right: 14px;
		background: linear-gradient(145deg, #3B3530 0%, #2B211E 100%);
		box-shadow: 0 6px 20px rgba(43, 33, 30, 0.3);
	}

	.review-start-button {
		background: linear-gradient(145deg, #FFF8F2 0%, #FFE8D6 100%);
		box-shadow: 0 6px 20px rgba(236, 131, 88, 0.15);
		border: 1px solid rgba(236, 131, 88, 0.2);
	}

	.add-symbol {
		font-size: 27px;
		line-height: 30px;
		font-weight: 800;
		color: #FFFFFF;
		margin-right: 10px;
	}

	.add-text,
	.review-start-text {
		font-size: 18px;
		line-height: 24px;
		font-weight: 800;
	}

	.add-text {
		color: #FFFFFF;
	}

	.review-start-text {
		color: #D4541E;
	}

	.review-icon-img {
		width: 22px;
		height: 22px;
		margin-right: 8px;
		filter: invert(33%) sepia(90%) saturate(1200%) hue-rotate(12deg) brightness(92%) contrast(95%);
	}

	.countdown-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 24px 20px;
		margin-bottom: 20px;
		background: linear-gradient(145deg, #1C1917 0%, #292524 100%);
		border-radius: 20px;
		box-shadow: 0 8px 24px rgba(28, 25, 23, 0.2), 0 2px 6px rgba(0, 0, 0, 0.08);
	}

	.countdown-label {
		font-size: 15px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.7);
		margin-bottom: 8px;
	}

	.countdown-num-row {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		gap: 6px;
	}

	.countdown-days {
		font-size: 52px;
		font-weight: 900;
		color: #FFFFFF;
		line-height: 1;
	}

	.countdown-unit {
		font-size: 18px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.5);
	}

	.progress-ring-row {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		margin-bottom: 20px;
		padding: 20px 10px;
		background: linear-gradient(145deg, #FFFFFF 0%, #FFFBF5 100%);
		border-radius: 20px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(241, 226, 216, 0.5);
	}

	.progress-ring-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}

	.progress-ring-wrap {
		width: 76px;
		height: 76px;
		border-radius: 999px;
		position: relative;
	}

	.progress-ring-fill {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 999px;
	}

	.progress-ring-inner {
		position: absolute;
		top: 6px;
		left: 6px;
		width: 64px;
		height: 64px;
		border-radius: 999px;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.progress-ring-value {
		font-size: 20px;
		font-weight: 900;
		color: #1C1917;
	}

	.progress-ring-slash {
		font-size: 14px;
		font-weight: 400;
		color: #D6D3D1;
		margin: 0 1px;
	}

	.progress-ring-target {
		font-size: 14px;
		font-weight: 600;
		color: #A8A29E;
	}

	.progress-ring-name {
		font-size: 14px;
		font-weight: 700;
		color: #6B6370;
	}

	.goal-section {
		margin-top: 10px;
		padding-top: 10px;
		border-top: 1px solid #F1E2D8;
	}

	.watchlist-entry {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 14px 18px;
		margin-bottom: 20px;
		background-color: #FF5A1F;
		border-radius: 16px;
		box-shadow: 0 6px 20px rgba(255, 90, 31, 0.3), 0 2px 6px rgba(0, 0, 0, 0.06);
		transition: transform 0.2s ease;
		gap: 10px;
	}

	.watchlist-entry:active {
		transform: scale(0.97);
	}

	.knowledge-entry {
		background: linear-gradient(145deg, #8B5CF6 0%, #7C3AED 100%);
		box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3), 0 2px 6px rgba(0, 0, 0, 0.06);
	}

	.watchlist-entry-title {
		font-size: 16px;
		font-weight: 700;
		color: #FFFFFF;
	}

	.watchlist-entry-badge {
		min-width: 24px;
		height: 24px;
		border-radius: 999px;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: 800;
		color: #FF5A1F;
		padding: 0 7px;
	}


	.priority-card {
		height: 96px;
		border-radius: 20px;
		margin-bottom: 14px;
		padding: 17px 12px 17px 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: linear-gradient(145deg, #FFFFFF 0%, #FFFBF5 100%);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05), 0 1px 4px rgba(0, 0, 0, 0.03);
		border: 1px solid rgba(241, 226, 216, 0.4);
		transition: transform 0.2s ease;
	}

	.priority-card:active {
		transform: scale(0.98);
	}

	.priority-high {
		border-left: 5px solid #F97316;
	}

	.priority-mid {
		border-left: 5px solid #7C3AED;
	}

	.priority-low {
		border-left: 5px solid #EAB308;
	}

	.priority-icon {
		width: 50px;
		height: 50px;
		border-radius: 14px;
		margin-right: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.priority-icon text {
		font-size: 19px;
		font-weight: 700;
	}

	.priority-icon-high {
		background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
		color: #EA580C;
		box-shadow: 0 2px 8px rgba(234, 88, 12, 0.12);
	}

	.priority-icon-mid {
		background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%);
		color: #7C3AED;
		box-shadow: 0 2px 8px rgba(124, 58, 237, 0.12);
	}

	.priority-icon-low {
		background: linear-gradient(135deg, #FEFCE8 0%, #FEF9C3 100%);
		color: #CA8A04;
		box-shadow: 0 2px 8px rgba(202, 138, 4, 0.12);
	}

	.priority-copy {
		flex: 1;
	}

	.priority-title {
		display: block;
		font-size: 15px;
		line-height: 22px;
		font-weight: 700;
		color: #1C1917;
	}

	.priority-meta {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		line-height: 18px;
		color: #A8A29E;
	}

	.priority-pill {
		min-width: 50px;
		height: 28px;
		padding-left: 10px;
		padding-right: 10px;
		border-radius: 999px;
		background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.priority-pill text {
		font-size: 11px;
		line-height: 14px;
		font-weight: 700;
		color: #7C3AED;
	}

	.add-content,
	.today-content,
	.library-content,
	.detail-content,
	.stats-content,
	.settings-content {
		padding-top: 12px;
		padding-bottom: 24px;
	}

	.page-heading {
		margin-bottom: 18px;
	}

	.page-title {
		display: block;
		font-size: 25px;
		line-height: 34px;
		font-weight: 800;
		color: #1D1B20;
	}

	.page-subtitle {
		display: block;
		font-size: 12px;
		line-height: 18px;
		font-weight: 600;
		color: #7B7480;
	}

	.upload-box {
		position: relative;
		height: 196px;
		border-radius: 30px;
		border: 2px dashed #CBC4D2;
		margin-bottom: 14px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.upload-preview {
		width: 100%;
		height: 196px;
	}

	.upload-change {
		position: absolute;
		right: 14px;
		top: 14px;
		height: 30px;
		padding-left: 12px;
		padding-right: 12px;
		border-radius: 999px;
		background-color: rgba(255, 255, 255, 0.92);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.upload-change text {
		font-size: 12px;
		line-height: 16px;
		font-weight: 800;
		color: #EA580C;
	}

	.upload-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.upload-icon {
		width: 42px;
		height: 42px;
		border-radius: 999px;
		background-color: #FFF2E6;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #FF8E4E;
		margin-bottom: 16px;
	}

	.upload-title {
		font-size: 13px;
		line-height: 18px;
		font-weight: 800;
		color: #1D1B20;
	}

	.upload-desc {
		margin-top: 6px;
		font-size: 10px;
		line-height: 14px;
		font-weight: 700;
		color: #7B7480;
	}

	.form-card,
	.detail-card {
		border-radius: 28px;
		padding: 20px;
		margin-top: 16px;
	}


	.detail-topbar-actions {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12px;
	}


	.settings-card,
	.settings-preview {
		border-radius: 28px;
		padding: 20px;
		margin-top: 16px;
	}


	.goal-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 12px;
	}

	.goal-label {
		font-size: 14px;
		font-weight: 600;
		color: #6B6370;
		min-width: 80px;
	}

	.goal-input {
		width: 100px;
		height: 42px;
		border-radius: 14px;
		text-align: center;
		padding-left: 0;
		padding-right: 0;
	}

	.settings-avatar-row {
		min-height: 72px;
		border-radius: 24px;
		background-color: #FFF8F2;
		border: 1px solid #F1E2D8;
		padding: 12px;
		margin-bottom: 18px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.settings-avatar {
		width: 48px;
		height: 48px;
		border-radius: 999px;
		overflow: hidden;
		background-color: #FFFFFF;
		margin-right: 12px;
	}

	.settings-avatar-copy {
		flex: 1;
	}

	.settings-avatar-title {
		display: block;
		font-size: 15px;
		line-height: 21px;
		font-weight: 800;
		color: #1D1B20;
	}

	.settings-avatar-sub {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		line-height: 18px;
		color: #7B7480;
	}

	.preview-label {
		display: block;
		font-size: 11px;
		line-height: 16px;
		font-weight: 800;
		color: #9A827A;
		margin-bottom: 12px;
	}

	.preview-brand {
		display: block;
	}

	.preview-brand-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.preview-greeting {
		margin-top: 18px;
	}

	.preview-stats-title {
		display: block;
		margin-top: 14px;
		font-size: 18px;
		line-height: 26px;
		font-weight: 800;
		color: #EC8358;
	}


	.save-icon {
		margin-right: 8px;
	}

	.today-head {
		height: 92px;
		border-radius: 28px;
		padding: 18px;
		margin-bottom: 18px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.today-title {
		display: block;
		font-size: 20px;
		line-height: 28px;
		font-weight: 800;
	}

	.today-sub {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		line-height: 18px;
		color: #766F6A;
	}

	.today-start {
		width: 70px;
		height: 44px;
		border-radius: 999px;
		background-color: #F5A623;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.today-start text {
		font-size: 14px;
		font-weight: 900;
		color: #111111;
	}

	.today-card {
		min-height: 92px;
		border-radius: 22px;
		padding: 12px;
		margin-bottom: 12px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.today-thumb {
		width: 74px;
		height: 62px;
		border-radius: 16px;
		margin-right: 12px;
	}

	.today-copy {
		flex: 1;
	}

	.today-card-title {
		display: block;
		font-size: 15px;
		line-height: 21px;
		font-weight: 800;
		color: #2D3436;
	}

	.today-card-sub {
		display: block;
		margin-top: 5px;
		font-size: 11px;
		line-height: 17px;
		color: #6E6874;
	}

	.today-arrow {
		font-size: 24px;
		color: #B0A9B8;
	}

	.review-screen {
		padding-bottom: 188px;
	}

	.review-content {
		padding-top: 18px;
	}

	.progress-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.progress-label {
		font-size: 12px;
		line-height: 18px;
		font-weight: 800;
		color: #494551;
	}

	.progress-number {
		font-size: 20px;
		line-height: 28px;
		font-weight: 800;
		color: #4F378A;
	}

	.progress-track {
		width: 100%;
		height: 10px;
		border-radius: 999px;
		background-color: #E8E0EA;
		overflow: hidden;
		margin-bottom: 16px;
	}

	.progress-fill {
		width: 25%;
		height: 10px;
		border-radius: 999px;
		background-color: #FFB38E;
	}

	.review-card {
		border-radius: 30px;
		background-color: #FFFDF2;
		border: 1px solid rgba(255, 179, 142, 0.22);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
		padding: 22px;
		margin-bottom: 16px;
	}

	.question-card {
		margin-top: 14px;
	}

	.review-meta {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 18px;
	}

	.tag-purple,
	.tag-grey {
		height: 22px;
		line-height: 22px;
		border-radius: 999px;
		padding-left: 12px;
		padding-right: 12px;
		font-size: 11px;
		font-weight: 800;
		margin-right: 12px;
	}

	.tag-purple {
		color: #4F378A;
		background-color: #F0EAF6;
	}

	.tag-grey {
		color: #6D6875;
		background-color: #EAE6EC;
	}

	.muted {
		font-size: 12px;
		line-height: 18px;
		font-weight: 700;
		color: #8B8590;
	}

	.review-image,
	.answer-image {
		width: 100%;
		height: 168px;
		border-radius: 28px;
	}

	.question-text,
	.review-note {
		display: block;
		margin-top: 16px;
		font-size: 16px;
		line-height: 26px;
		font-weight: 600;
		color: #302B2B;
	}

	.review-note {
		font-size: 13px;
		line-height: 21px;
		color: #6E6874;
	}

	.answer-note {
		margin-top: 18px;
		border-left: 3px solid #FFB38E;
		border-radius: 18px;
		background-color: #FFFFFF;
		padding: 14px 16px;
	}

	.image-repair-action {
		height: 38px;
		border-radius: 999px;
		background-color: #FFF0E7;
		margin-top: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-repair-action text {
		font-size: 12px;
		line-height: 16px;
		font-weight: 800;
		color: #EC8358;
	}

	.answer-text {
		font-size: 15px;
		line-height: 24px;
		color: #3A3030;
	}

	.review-actions {
		position: fixed;
		left: 50%;
		bottom: 92px;
		transform: translateX(-50%);
		width: 345px;
		height: 76px;
		padding: 8px;
		border-radius: 36px;
		background-color: #FFFDF4;
		border: 1px solid #FDE4C8;
		box-shadow: 0 10px 26px rgba(114, 90, 40, 0.14);
		display: flex;
		flex-direction: row;
		z-index: 12;
	}

	.review-choice {
		flex: 1;
		border-radius: 32px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.spaced-choice {
		margin-left: 7px;
	}

	.wrong {
		background-color: #E5DDEC;
	}

	.unsure {
		background-color: #FFD8C5;
	}

	.right {
		background-color: #FFA779;
	}

	.choice-mark {
		font-size: 21px;
		line-height: 22px;
		font-weight: 800;
		color: #4F4551;
	}

	.choice-label {
		margin-top: 4px;
		font-size: 10px;
		line-height: 12px;
		font-weight: 800;
		color: #4F4551;
	}


	.mistake-card {
		border-radius: 20px;
		overflow: hidden;
		margin-bottom: 22px;
	}

	.mistake-image-wrap {
		position: relative;
		width: 100%;
		height: 150px;
	}

	.mistake-image {
		width: 100%;
		height: 150px;
	}

	.due-pill {
		position: absolute;
		right: 10px;
		top: 10px;
		height: 24px;
		padding-left: 10px;
		padding-right: 10px;
		border-radius: 999px;
		background-color: #FFF4E7;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.due-pill text {
		font-size: 10px;
		line-height: 12px;
		font-weight: 800;
		color: #F4A261;
	}

	.mistake-copy {
		padding: 14px 16px 18px;
	}

	.mini-subject {
		align-self: flex-start;
		display: block;
		width: 64px;
		height: 20px;
		border-radius: 999px;
		background-color: #FEE4D2;
		text-align: center;
		line-height: 20px;
		font-size: 10px;
		font-weight: 800;
		color: #2D3436;
	}

	.mistake-title {
		display: block;
		margin-top: 8px;
		font-size: 16px;
		line-height: 22px;
		font-weight: 800;
		color: #2D3436;
	}

	.mistake-desc {
		display: block;
		margin-top: 6px;
		font-size: 12px;
		line-height: 20px;
		color: #506070;
	}


	.detail-image {
		width: 100%;
		height: 180px;
		border-radius: 22px;
		margin-top: 10px;
	}

	.detail-image-actions {
		display: flex;
		flex-direction: row;
		margin-top: 12px;
	}

	.detail-image-action {
		flex: 1;
		height: 38px;
		border-radius: 999px;
		background-color: #FFF0E7;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
	}

	.detail-image-action text {
		font-size: 12px;
		line-height: 16px;
		font-weight: 800;
		color: #EC8358;
	}

	.muted-action {
		margin-right: 0;
		background-color: #F8F2FA;
	}

	.muted-action text {
		color: #6750A4;
	}

	.detail-note {
		font-size: 14px;
		line-height: 22px;
		color: #494551;
	}

	.record-line {
		padding-top: 12px;
		padding-bottom: 12px;
		border-bottom: 1px solid #F1E8E3;
	}

	.record-main {
		display: block;
		font-size: 14px;
		line-height: 20px;
		font-weight: 800;
		color: #2D3436;
	}

	.record-sub {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		line-height: 18px;
		color: #6E6874;
	}

	.stat-summary-grid {
		display: flex;
		flex-direction: row;
		margin-bottom: 14px;
	}

	.insight-mini {
		flex: 1;
		height: 96px;
		border-radius: 22px;
		padding: 16px 12px;
		margin-right: 10px;
	}

	.insight-last {
		margin-right: 0;
	}

	.insight-number {
		display: block;
		margin-top: 8px;
		font-size: 28px;
		line-height: 34px;
		font-weight: 900;
		color: #EA580C;
	}

	.insight-card {
		border-radius: 22px;
		padding: 18px;
		margin-bottom: 14px;
	}

	.weekly-card {
		min-height: 250px;
	}

	.weekly-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.weekly-title {
		display: block;
		font-size: 19px;
		line-height: 26px;
		font-weight: 800;
		color: #1D1B20;
	}

	.weekly-sub {
		display: block;
		width: 172px;
		margin-top: 3px;
		font-size: 12px;
		line-height: 18px;
		font-weight: 600;
		color: #6F6874;
	}

	.weekly-total {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.weekly-total-number {
		display: block;
		font-size: 18px;
		line-height: 24px;
		font-weight: 900;
		color: #EA580C;
		text-align: right;
	}

	.weekly-total-label {
		display: block;
		font-size: 9px;
		line-height: 12px;
		font-weight: 800;
		color: #9E7C68;
	}

	.bars-row {
		height: 150px;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
		margin-top: 30px;
		padding-left: 20px;
		padding-right: 20px;
	}

	.bar-col {
		width: 22px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
	}

	.bar-fill {
		width: 8px;
		border-radius: 999px;
		background-color: #6750A4;
	}

	.bar-col text {
		margin-top: 10px;
		font-size: 10px;
		line-height: 12px;
		font-weight: 800;
		color: #9B95A1;
	}

	.dist-line {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 12px;
	}

	.dist-name {
		width: 76px;
		font-size: 12px;
		line-height: 18px;
		font-weight: 800;
		color: #494551;
	}

	.dist-track {
		flex: 1;
		height: 10px;
		border-radius: 999px;
		background-color: #F0EAF6;
		overflow: hidden;
	}

	.dist-fill {
		height: 10px;
		border-radius: 999px;
		background-color: #6750A4;
	}

	.dist-fill-red {
		background-color: #EC8358;
	}

	.dist-count {
		width: 32px;
		text-align: right;
		font-size: 12px;
		font-weight: 900;
		color: #1D1B20;
	}

	.momentum-card {
		position: relative;
		height: 116px;
		border-radius: 22px;
		overflow: hidden;
		margin-top: 16px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
	}

	.momentum-image {
		width: 100%;
		height: 116px;
		opacity: 0.86;
	}

	.momentum-copy {
		position: absolute;
		left: 20px;
		right: 20px;
		bottom: 18px;
	}

	.momentum-title {
		display: block;
		font-size: 23px;
		line-height: 28px;
		font-weight: 900;
		color: #FFFFFF;
	}

	.momentum-sub {
		display: block;
		font-size: 12px;
		line-height: 18px;
		font-weight: 700;
		color: #FFFFFF;
	}

	.user-hero-card {
		border-radius: 22px;
		padding: 28px 20px 20px;
		margin-bottom: 14px;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
	}

	.user-avatar-ring {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 3px solid #E87B35;
		padding: 3px;
		margin-bottom: 14px;
		overflow: hidden;
	}

	.user-avatar-large {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.user-display-name {
		font-size: 22px;
		font-weight: 900;
		color: #4A3728;
		line-height: 28px;
		margin-bottom: 4px;
	}

	.user-slogan {
		font-size: 13px;
		font-weight: 600;
		color: #998B7A;
		line-height: 18px;
		margin-bottom: 20px;
	}

	.user-stat-trio {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-evenly;
		width: 100%;
		border-top: 1px solid #F1E2D8;
		padding-top: 16px;
	}

	.user-stat-cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}

	.user-stat-divider {
		width: 1px;
		height: 32px;
		background-color: #F1E2D8;
	}

	.user-stat-num {
		font-size: 24px;
		font-weight: 900;
		color: #6750A4;
		line-height: 30px;
	}

	.user-stat-label {
		font-size: 12px;
		font-weight: 600;
		color: #998B7A;
		line-height: 16px;
		margin-top: 2px;
	}

	.version-card {
		margin-top: 14px;
	}

	.version-source {
		color: #998B7A;
		font-size: 12px;
		margin-bottom: 8px;
	}

	.version-update-hint {
		background-color: #FFF8F0;
		border-radius: 16px;
		padding: 14px;
		margin-top: 10px;
		border: 1px solid #F1E2D8;
	}

	.version-new-label {
		display: block;
		font-size: 15px;
		font-weight: 800;
		color: #E87B35;
		margin-bottom: 6px;
	}

	.version-changelog {
		display: block;
		font-size: 13px;
		line-height: 18px;
		color: #6750A4;
		margin-bottom: 6px;
	}

	.download-status {
		margin-top: 8px;
	}

	.download-percent {
		display: block;
		font-size: 13px;
		font-weight: 800;
		color: #6750A4;
		margin-top: 6px;
		text-align: center;
	}

	.profile-card {
		border-radius: 28px;
		padding: 24px;
		margin-top: 24px;
	}

	.profile-line {
		display: block;
		margin-top: 10px;
		font-size: 12px;
		line-height: 18px;
		font-weight: 700;
		color: #6E6874;
	}

	.update-note {
		border-radius: 20px;
		background-color: #FFF0E7;
		padding: 14px;
		margin-top: 14px;
	}

	.update-note text {
		font-size: 12px;
		line-height: 18px;
		font-weight: 800;
		color: #9A3412;
	}

	.update-progress {
		width: 100%;
		height: 10px;
		border-radius: 999px;
		background-color: #F1E8E3;
		overflow: hidden;
		margin-top: 16px;
	}

	.update-progress-fill {
		height: 10px;
		border-radius: 999px;
		background-color: #EA580C;
	}


	.apps-content {
		padding-top: 20px;
	}

	.apps-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.app-card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 20px 16px 16px;
		border-radius: 20px;
		min-height: 140px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
	}

	.app-card:active {
		transform: scale(0.96);
	}

	.app-card-active {
		background: linear-gradient(145deg, #FFFFFF 0%, #FFFBF5 100%);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(241, 226, 216, 0.6);
	}

	.app-card-active::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		border-radius: 20px 20px 0 0;
	}

	.app-card-active:nth-child(1)::before {
		background: linear-gradient(90deg, #F97316, #FB923C);
	}

	.app-card-active:nth-child(2)::before {
		background: linear-gradient(90deg, #8B5CF6, #A78BFA);
	}

	.app-card-disabled {
		background: linear-gradient(145deg, #F5F5F4 0%, #F0EFED 100%);
		border: 1px solid #E7E5E4;
		opacity: 0.7;
	}

	.app-card-icon-wrap {
		width: 48px;
		height: 48px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 14px;
	}

	.app-card-icon-orange {
		background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
		color: #EA580C;
		box-shadow: 0 2px 8px rgba(234, 88, 12, 0.15);
	}

	.app-card-icon-purple {
		background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%);
		color: #7C3AED;
		box-shadow: 0 2px 8px rgba(124, 58, 237, 0.15);
	}

	.app-card-icon-gray {
		background: linear-gradient(135deg, #F5F5F4 0%, #E7E5E4 100%);
		color: #A8A29E;
	}

	.app-card-icon-green {
		background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
		color: #059669;
	}

	.app-card-icon-text {
		font-size: 18px;
		font-weight: 900;
	}

	.app-card-icon-img {
		width: 28px;
		height: 28px;
	}

	.app-card-icon-orange .app-card-icon-img {
		filter: invert(58%) sepia(68%) saturate(2638%) hue-rotate(2deg) brightness(101%) contrast(103%);
	}

	.app-card-icon-purple .app-card-icon-img {
		filter: invert(35%) sepia(65%) saturate(3207%) hue-rotate(254deg) brightness(91%) contrast(97%);
	}

	.app-card-icon-gray .app-card-icon-img {
		opacity: 0.5;
	}

	.app-card-info {
		flex: 1;
	}

	.app-card-title {
		font-size: 16px;
		font-weight: 700;
		color: #292524;
		line-height: 20px;
		margin-bottom: 4px;
	}

	.app-card-disabled .app-card-title {
		color: #A8A29E;
	}

	.app-card-desc {
		font-size: 12px;
		color: #A8A29E;
		line-height: 16px;
	}

	.app-card-disabled .app-card-desc {
		color: #D6D3D1;
	}

	.app-card-arrow-img {
		position: absolute;
		right: 16px;
		bottom: 16px;
		width: 18px;
		height: 18px;
		opacity: 0.3;
	}

	.app-card-active .app-card-arrow-img {
		opacity: 1;
		filter: invert(58%) sepia(68%) saturate(2638%) hue-rotate(2deg) brightness(101%) contrast(103%);
	}

	.app-card-badge {
		position: absolute;
		right: 12px;
		top: 12px;
		padding: 3px 8px;
		border-radius: 6px;
		background-color: #E7E5E4;
		font-size: 10px;
		font-weight: 600;
		color: #A8A29E;
	}

	.quote-line {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 10px;
	}

	.quote-input {
		flex: 1;
		height: 44px;
		border-radius: 14px;
		border: 1px solid #F1E2D8;
		background-color: #FFF8F0;
		padding: 0 14px;
		font-size: 14px;
		font-weight: 600;
		color: #4A3728;
	}

	.quote-delete {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background-color: #FEE2E2;
		color: #DC2626;
		font-size: 18px;
		font-weight: 800;
		line-height: 36px;
		text-align: center;
		margin-left: 10px;
	}

	.formulas-content {
		padding-top: 20px;
	}

	.formulas-placeholder {
		border-radius: 22px;
		padding: 48px 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.formulas-placeholder-icon {
		font-size: 56px;
		font-weight: 900;
		color: #E87B35;
		margin-bottom: 16px;
	}

	.formulas-placeholder-title {
		font-size: 20px;
		font-weight: 900;
		color: #4A3728;
		line-height: 28px;
		margin-bottom: 6px;
	}

	.formulas-placeholder-sub {
		font-size: 14px;
		color: #998B7A;
		font-weight: 600;
	}

	.formula-category-grid {
		display: flex;
		flex-direction: column;
	}

	.formula-category-card {
		border-radius: 20px;
		padding: 28px 20px;
		margin-bottom: 14px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		transition: transform 0.2s ease;
		position: relative;
		overflow: hidden;
	}

	.formula-category-card:active {
		transform: scale(0.97);
	}

	.formula-card-limits {
		background: linear-gradient(145deg, #FFFFFF 0%, #FFF7ED 100%);
		box-shadow: 0 6px 20px rgba(249, 115, 22, 0.1), 0 2px 6px rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(249, 115, 22, 0.1);
	}

	.formula-card-limits::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, #F97316, #FB923C);
	}

	.formula-card-derivatives {
		background: linear-gradient(145deg, #FFFFFF 0%, #F5F3FF 100%);
		box-shadow: 0 6px 20px rgba(124, 58, 237, 0.1), 0 2px 6px rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(124, 58, 237, 0.1);
	}

	.formula-card-derivatives::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, #8B5CF6, #A78BFA);
	}

	.formula-card-integrals {
		background: linear-gradient(145deg, #FFFFFF 0%, #ECFDF5 100%);
		box-shadow: 0 6px 20px rgba(16, 185, 129, 0.1), 0 2px 6px rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(16, 185, 129, 0.1);
	}

	.formula-card-integrals::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, #10B981, #34D399);
	}

	.formula-card-icon-circle {
		width: 60px;
		height: 60px;
		border-radius: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 14px;
	}

	.formula-icon-orange {
		background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
		box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
	}

	.formula-icon-purple {
		background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%);
		box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
	}

	.formula-icon-green {
		background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
	}

	.formula-category-icon {
		font-size: 32px;
		font-weight: 900;
		line-height: 1;
	}

	.formula-icon-orange .formula-category-icon {
		color: #EA580C;
	}

	.formula-icon-purple .formula-category-icon {
		color: #7C3AED;
	}

	.formula-icon-green .formula-category-icon {
		color: #059669;
	}

	.formula-category-title {
		font-size: 18px;
		font-weight: 800;
		color: #1C1917;
		margin-bottom: 6px;
	}

	.formula-category-desc {
		font-size: 13px;
		color: #A8A29E;
		font-weight: 600;
	}

	.formula-detail-content {
		padding-top: 12px;
	}

	.formula-group-card {
		background: linear-gradient(145deg, #FFFFFF 0%, #FFFBF5 100%);
		border-radius: 20px;
		padding: 22px 18px;
		margin-bottom: 16px;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.03);
		border: 1px solid rgba(241, 226, 216, 0.5);
	}

	.formula-group-title {
		display: block;
		font-size: 16px;
		font-weight: 700;
		color: #7C3AED;
		margin-bottom: 14px;
		padding-left: 2px;
	}

	.formula-card-grid {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 10px;
	}

	.formula-mini-card {
		background: linear-gradient(145deg, #FEF9F0 0%, #FFFFFF 100%);
		border-radius: 12px;
		padding: 10px 14px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(241, 226, 216, 0.6);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 3px;
	}

	.formula-mini-wide {
		padding: 14px 18px;
	}

	.formula-mini-frac {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.sup-frac {
		vertical-align: super;
		margin-left: 2px;
	}

	.formula-mini-num {
		font-size: 14px;
		font-weight: 700;
		color: #1C1917;
		line-height: 17px;
	}

	.formula-mini-bar {
		font-size: 11px;
		color: #A8A29E;
		line-height: 6px;
		letter-spacing: 1px;
	}

	.formula-mini-den {
		font-size: 14px;
		font-weight: 700;
		color: #1C1917;
		line-height: 17px;
	}

	.formula-mini-eq {
		font-size: 14px;
		font-weight: 700;
		color: #EA580C;
	}

	.formula-mini-cond {
		font-size: 12px;
		font-weight: 600;
		color: #A8A29E;
		margin-left: 2px;
	}

	.formula-mini-line {
		font-size: 14px;
		font-weight: 600;
		color: #1C1917;
		line-height: 20px;
	}

	.formula-footnote {
		display: block;
		margin-top: 10px;
		font-size: 13px;
		color: #A8A29E;
		padding-left: 2px;
	}

	.formula-section {
		border-radius: 18px;
		padding: 18px 16px;
		margin-bottom: 14px;
	}

	.formula-section-title {
		font-size: 17px;
		font-weight: 900;
		color: #E87B35;
		margin-bottom: 12px;
		display: block;
	}

	.formula-line {
		font-size: 14px;
		font-weight: 600;
		color: #4A3728;
		line-height: 28px;
		display: block;
	}

	.formula-block {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		padding: 4px 0;
	}

	.formula-frac {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 2px 6px;
	}

	.formula-num {
		font-size: 14px;
		font-weight: 700;
		color: #4A3728;
		line-height: 20px;
	}

	.formula-bar {
		font-size: 12px;
		color: #4A3728;
		line-height: 14px;
		font-weight: 400;
	}

	.formula-den {
		font-size: 14px;
		font-weight: 700;
		color: #4A3728;
		line-height: 20px;
	}

	.formula-tail {
		font-size: 14px;
		font-weight: 600;
		color: #4A3728;
		line-height: 28px;
	}

	.formula-inline {
		font-size: 14px;
		font-weight: 600;
		color: #4A3728;
		line-height: 28px;
	}

	.formula-sub {
		font-size: 11px;
		font-weight: 600;
		color: #998B7A;
		line-height: 28px;
		margin-right: 2px;
	}

	/* ==================== AI 助手样式 ==================== */

	.ai-screen {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 90px;
		display: flex;
		flex-direction: column;
		min-height: 0;
		padding-bottom: 0;
		overflow: hidden;
		z-index: 10;
		background-color: #FDF7FF;
	}

	.ai-screen .compact-topbar {
		height: 86px;
		padding-top: 40px;
	}

	.ai-topbar-actions {
		display: flex;
		gap: 16px;
	}

	/* 聊天区域 */
	.ai-chat-area {
		flex: 1;
		height: 0;
		overflow: hidden;
	}

	.ai-chat-inner {
		padding: 16px 16px 24px;
		min-height: 100%;
	}

	/* 加载更多 */
	.ai-load-more {
		display: flex;
		justify-content: center;
		padding: 12px 0;
		margin-bottom: 12px;
	}
	.ai-load-more-text {
		font-size: 13px;
		color: #8B5CF6;
		padding: 6px 16px;
		border-radius: 16px;
		background-color: rgba(139, 92, 246, 0.08);
	}

	/* 欢迎卡片 */
	.ai-welcome-card {
		background-color: #FFFFFF;
		border-radius: 24px;
		padding: 28px 20px;
		margin-bottom: 20px;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.ai-welcome-icon {
		width: 56px;
		height: 56px;
		border-radius: 16px;
		background: linear-gradient(135deg, #8B5CF6, #A78BFA);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 14px;
		box-shadow: 0 4px 14px rgba(139, 92, 246, 0.3);
	}

	.ai-welcome-icon-img {
		width: 30px;
		height: 30px;
	}

	.ai-welcome-title {
		font-size: 18px;
		font-weight: 800;
		color: #1D1B20;
		margin-bottom: 8px;
	}

	.ai-welcome-desc {
		font-size: 13px;
		color: #766F6A;
		text-align: center;
		line-height: 20px;
		margin-bottom: 20px;
	}

	/* 快捷提问 */
	.ai-quick-questions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		justify-content: center;
	}

	.ai-quick-btn {
		padding: 8px 16px;
		border-radius: 20px;
		background-color: #F5F3FF;
		border: 1px solid #EDE9FE;
	}

	.ai-quick-text {
		font-size: 13px;
		font-weight: 600;
		color: #6750A4;
	}

	/* 消息气泡 */
	.ai-msg {
		display: flex;
		margin-bottom: 16px;
		align-items: flex-start;
	}

	.ai-msg-user {
		justify-content: flex-end;
	}

	.ai-msg-ai {
		justify-content: flex-start;
	}

	.ai-msg-avatar {
		width: 32px;
		height: 32px;
		border-radius: 10px;
		background: linear-gradient(135deg, #8B5CF6, #A78BFA);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-right: 10px;
	}

	.ai-msg-avatar-img {
		width: 18px;
		height: 18px;
	}

	.ai-bubble {
		max-width: 78%;
		padding: 12px 16px;
		border-radius: 20px;
		word-wrap: break-word;
		word-break: break-all;
	}

	.ai-bubble-user {
		background-color: #EA580C;
		border-bottom-right-radius: 6px;
	}

	.ai-bubble-user .ai-bubble-text {
		color: #FFFFFF;
		font-size: 14px;
		font-weight: 600;
		line-height: 22px;
	}

	.ai-bubble-ai {
		background-color: #FFFFFF;
		border-bottom-left-radius: 6px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	}

	.ai-bubble-ai .ai-bubble-text {
		color: #1D1B20;
		font-size: 14px;
		font-weight: 500;
		line-height: 22px;
	}

	/* 打字动画 */
	.ai-typing {
		display: flex;
		gap: 6px;
		padding: 4px 0;
	}

	.ai-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #A78BFA;
		animation: ai-bounce 1.4s infinite ease-in-out;
	}

	.ai-dot:nth-child(1) { animation-delay: 0s; }
	.ai-dot:nth-child(2) { animation-delay: 0.2s; }
	.ai-dot:nth-child(3) { animation-delay: 0.4s; }


	/* 数学符号工具栏 */
	.ai-math-toolbar {
		padding: 6px 0;
		border-bottom: 1px solid #F1E2D8;
		margin-bottom: 8px;
	}

	.ai-math-scroll {
		white-space: nowrap;
	}

	.ai-math-buttons {
		display: flex;
		flex-direction: row;
		gap: 8px;
		padding: 0 4px;
	}

	.ai-math-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 40px;
		height: 34px;
		padding: 0 10px;
		border-radius: 8px;
		background-color: #FEF9F0;
		border: 1px solid #F1E2D8;
		flex-shrink: 0;
	}

	.ai-math-btn text {
		font-size: 15px;
		font-weight: 600;
		color: #6750A4;
	}

	/* 输入栏 */
	.ai-input-bar {
		display: flex;
		flex-direction: column;
		padding: 10px 14px;
		padding-bottom: calc(10px + env(safe-area-inset-bottom));
		background-color: #FFFFFF;
		border-top: 1px solid #F1E2D8;
	}

	.ai-input-bar .ai-input-field {
		width: 100%;
	}

	.ai-input-bar .ai-send-btn,
	.ai-input-bar .ai-cancel-btn {
		align-self: flex-end;
		margin-top: 8px;
	}

	.ai-input-field {
		flex: 1;
		min-height: 40px;
		max-height: 100px;
		border-radius: 20px;
		background-color: #FFF8F2;
		border: 1px solid #F1E2D8;
		padding: 10px 16px;
		font-size: 14px;
		font-weight: 500;
		color: #1D1B20;
		line-height: 20px;
	}

	.ai-send-btn {
		width: 60px;
		height: 40px;
		border-radius: 20px;
		background-color: #E7E5E4;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.ai-send-active {
		background-color: #EA580C;
		box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);
	}

	.ai-cancel-btn {
		background-color: #F87171;
		width: 60px;
	}

	.ai-send-text {
		font-size: 14px;
		font-weight: 800;
		color: #FFFFFF;
	}

	/* 底部导航 AI 图标 */

	/* AI 性格设定 */
	.ai-personality-field {
		width: 100%;
		min-height: 120px;
		border-radius: 20px;
		background-color: #FFF8F2;
		border: 1px solid #F1E2D8;
		padding: 14px 16px;
		font-size: 13px;
		color: #1D1B20;
		line-height: 22px;
		margin-top: 8px;
	}

	.ai-personality-hint {
		font-size: 11px;
		color: #A8A29E;
		margin-top: 8px;
		padding: 0 4px;
	}

	/* AI 富文本渲染 */
	.ai-rich-text {
		line-height: 22px;
	}

	.ai-rich-text b {
		font-weight: 800;
		color: #7C3AED;
	}

	.ai-inline-code {
		font-size: 12px;
		background-color: #F5F3FF;
		color: #6750A4;
		padding: 1px 6px;
		border-radius: 4px;
		font-family: monospace;
	}

	.ai-code-block {
		background-color: #F5F3FF;
		border-radius: 10px;
		padding: 10px 12px;
		margin: 6px 0;
	}

	.ai-code-text {
		font-size: 12px;
		color: #4A3728;
		font-family: monospace;
		line-height: 20px;
	}

	/* 公式独立块 */
	.ai-formula-block {
		background: linear-gradient(135deg, #FDF4FF, #F5F3FF);
		border-left: 3px solid #A78BFA;
		border-radius: 0 12px 12px 0;
		padding: 12px 16px;
		margin: 8px 0;
	}

	.ai-formula-text {
		font-size: 15px;
		font-weight: 700;
		color: #5B21B6;
		font-family: 'Courier New', Courier, monospace;
		line-height: 26px;
		letter-spacing: 0.5px;
	}

	/* 行内公式 */
	.ai-inline-formula {
		font-size: 14px;
		font-weight: 700;
		color: #6D28D9;
		background-color: #F5F3FF;
		padding: 1px 6px;
		border-radius: 4px;
		font-family: 'Courier New', Courier, monospace;
	}

	/* 上下标 */
	.ai-rich-text sup {
		font-size: 0.75em;
		vertical-align: super;
		color: #6D28D9;
	}

	.ai-rich-text sub {
		font-size: 0.75em;
		vertical-align: sub;
		color: #6D28D9;
	}

	/* 分数 */
	.ai-frac {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		vertical-align: middle;
		margin: 0 3px;
	}

	.ai-frac-num {
		font-size: 12px;
		font-weight: 700;
		color: #6D28D9;
		border-bottom: 1.5px solid #6D28D9;
		padding: 0 4px 1px;
		line-height: 1.2;
	}

	.ai-frac-den {
		font-size: 12px;
		font-weight: 700;
		color: #6D28D9;
		padding: 1px 4px 0;
		line-height: 1.2;
	}

	/* 模型选择卡片 */
	.ai-model-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-top: 8px;
	}

	.ai-model-card {
		background-color: #FFFFFF;
		border: 1.5px solid #E8E2E0;
		border-radius: 16px;
		padding: 14px 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.ai-model-active {
		border-color: #8B5CF6;
		background-color: #FDF4FF;
		box-shadow: 0 2px 12px rgba(139, 92, 246, 0.18);
	}

	.ai-model-active .ai-model-name {
		color: #7C3AED;
	}

	.ai-model-name {
		font-size: 14px;
		font-weight: 800;
		color: #44403C;
	}

	.ai-model-desc {
		font-size: 11px;
		color: #A8A29E;
		text-align: center;
	}


	/* ===== UI 动画 ===== */

	/* 1. 卡片淡入 */

	.soft-card,
	.stat-card,
	.daily-goal-card,
	.watchlist-entry,
	.countdown-card,
	.priority-card {
		animation: cardFadeIn 0.5s ease forwards;
	}

	.stat-card:nth-child(2) { animation-delay: 0.1s; }
	.stat-card:nth-child(3) { animation-delay: 0.2s; }

	/* 2. 进度环动画 */

	.progress-ring-item {
		animation: ringFill 0.6s ease forwards;
	}

	.progress-ring-item:nth-child(1) { animation-delay: 0.1s; }
	.progress-ring-item:nth-child(2) { animation-delay: 0.2s; }
	.progress-ring-item:nth-child(3) { animation-delay: 0.3s; }

	/* 3. 按钮反馈增强 */
	.save-button,
	.review-start-button,
	.add-mistake-button {
		position: relative;
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.save-button:active,
	.review-start-button:active {
		transform: scale(0.96);
		box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
	}

	.add-mistake-button:active {
		transform: scale(0.97);
	}

	/* 4. 底部导航弹跳 */

	.nav-active .nav-icon-img {
		animation: navBounce 0.4s ease;
	}

	.nav-item {
		transition: all 0.2s ease;
	}

	.nav-item:active {
		transform: scale(0.92);
	}

	/* 5. 屏幕切换过渡 */
	.screen {
		animation: screenSlideIn 0.3s ease;
	}


	/* 6. 复习卡片 3D 翻转 */
	.review-card {
		perspective: 1000px;
		transition: transform 0.6s ease;
		transform-style: preserve-3d;
	}

	/* 7. 列表项入场 */

	.today-card,
	.mistake-card {
		animation: listItemIn 0.4s ease forwards;
	}

	.today-card:nth-child(1) { animation-delay: 0.05s; }
	.today-card:nth-child(2) { animation-delay: 0.1s; }
	.today-card:nth-child(3) { animation-delay: 0.15s; }
	.today-card:nth-child(4) { animation-delay: 0.2s; }
	.today-card:nth-child(5) { animation-delay: 0.25s; }

	/* 8. 倒计时数字脉冲 */

	.countdown-days {
		animation: countdownPulse 2s ease-in-out infinite;
	}

	/* 9. 每日目标完成动画 */

	.daily-goal-done {
		animation: goalComplete 0.5s ease;
	}

	/* 10. 空状态动画 */

	.empty-card {
		animation: emptyBounce 3s ease-in-out infinite;
	}

	/* 11. 标签页切换 */
	.tab-chip,
	.subject-chip {
		transition: all 0.2s ease;
	}

	.tab-chip:active,
	.subject-chip:active {
		transform: scale(0.95);
	}

	/* 12. 搜索框聚焦 */
	.search-input {
		transition: all 0.3s ease;
	}

	.search-input:focus {
		box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
	}
</style>
