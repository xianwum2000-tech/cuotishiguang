// 公式手册数据
// type: 'section'=分组, 'line'=单行, 'frac'=分数, 'block'=混合块, 'limitCards'=极限卡片组

export const FORMULA_DATA = {
	limits: {
		title: '极限公式',
		sections: [
			{
				title: '基本极限',
				type: 'limitCards',
				groups: [
					{
					label: 'x → 0',
					cards: [
						{ tilde: true, left: 'sinx', right: 'x' },
						{ tilde: true, left: 'tanx', right: 'x' },
						{ tilde: true, left: 'arcsinx', right: 'x' },
						{ tilde: true, left: 'arctanx', right: 'x' },
						{ tilde: true, left: 'eˣ − 1', right: 'x' },
						{ tilde: true, left: 'ln(1 + x)', right: 'x' },
						{ tilde: true, left: '(1 + x)ᵅ − 1', right: 'αx' },
						{ tilde: true, left: '1 − cosx', right: '½ x²' },
						{ tilde: true, left: 'aˣ − 1', right: 'x·lna' }
					]
				},
									{
						label: 'x → ∞',
						cards: [
							{ top: '1', bottom: 'x', before: '(1 + ', after: ')ˣ', result: 'e' }
						]
					}
				]
			},
			{
				title: '洛必达法则',
				items: [
					{ type: 'line', text: '0/0 或 ∞/∞ 型：' },
					{ type: 'block', parts: [
						{ kind: 'frac', top: 'f(x)', bottom: 'g(x)' },
						{ kind: 'text', value: ' = lim ' },
						{ kind: 'frac', top: "f'(x)", bottom: "g'(x)" }
					]},
					{ type: 'line', text: '可多次使用，每次使用前需验证条件' }
				]
			},
			{
				title: '常见泰勒展开（x = 0）',
				items: [
					{ type: 'line', text: 'eˣ = 1 + x + x²/2! + x³/3! + ···' },
					{ type: 'line', text: 'sinx = x − x³/3! + x⁵/5! − ···' },
					{ type: 'line', text: 'cosx = 1 − x²/2! + x⁴/4! − ···' },
					{ type: 'line', text: 'ln(1 + x) = x − x²/2 + x³/3 − ···' },
					{ type: 'line', text: '(1 + x)ᵅ = 1 + αx + α(α−1)x²/2! + ···' }
				]
			}
		]
	},
	derivatives: {
		title: '导数公式',
		sections: [
			{
				title: '基本导数公式',
				items: [
					{ type: 'line', text: "(C)' = 0" },
					{ type: 'line', text: "(xⁿ)' = n·xⁿ⁻¹" },
					{ type: 'line', text: "(eˣ)' = eˣ" },
					{ type: 'line', text: "(aˣ)' = aˣ·lna" },
					{ type: 'line', text: "(lnx)' = ¹⁄ₓ" },
					{ type: 'line', text: "(logₐx)' = ¹⁄₍ₓ·ₗₙₐ₎" }
				]
			},
			{
				title: '三角函数导数',
				items: [
					{ type: 'line', text: "(sinx)' = cosx" },
					{ type: 'line', text: "(cosx)' = −sinx" },
					{ type: 'line', text: "(tanx)' = sec²x" },
					{ type: 'line', text: "(cotx)' = −csc²x" },
					{ type: 'line', text: "(secx)' = secx·tanx" },
					{ type: 'line', text: "(cscx)' = −cscx·cotx" }
				]
			},
			{
				title: '反三角函数导数',
				items: [
					{ type: 'line', text: "(arcsinx)' = ¹⁄√₍₁₋ₓ²₎" },
					{ type: 'line', text: "(arccosx)' = −¹⁄√₍₁₋ₓ²₎" },
					{ type: 'line', text: "(arctanx)' = ¹⁄₍₁₊ₓ²₎" },
					{ type: 'line', text: "(arccotx)' = −¹⁄₍₁₊ₓ²₎" }
				]
			},
			{
				title: '求导法则',
				items: [
					{ type: 'line', text: '(u ± v)′ = u′ ± v′' },
					{ type: 'line', text: '(uv)′ = u′v + uv′' },
					{ type: 'line', text: '(u/v)′ = (u′v − uv′)/v²' },
					{ type: 'line', text: '链式法则：dy/dx = dy/du · du/dx' }
				]
			},
			{
				title: '高阶导数',
				items: [
					{ type: 'line', text: '(sinx)⁽ⁿ⁾ = sin(x + nπ/2)' },
					{ type: 'line', text: '(cosx)⁽ⁿ⁾ = cos(x + nπ/2)' }
				]
			}
		]
	},
	integrals: {
		title: '积分公式',
		sections: [
			{
				title: '基本积分公式',
				items: [
					{ type: 'line', text: '∫ xⁿ dx = xⁿ⁺¹/(n+1) + C  (n ≠ −1)' },
					{ type: 'line', text: '∫ 1/x dx = ln|x| + C' },
					{ type: 'line', text: '∫ eˣ dx = eˣ + C' },
					{ type: 'line', text: '∫ aˣ dx = aˣ/lna + C' },
					{ type: 'line', text: '∫ sinx dx = −cosx + C' },
					{ type: 'line', text: '∫ cosx dx = sinx + C' },
					{ type: 'line', text: '∫ sec²x dx = tanx + C' },
					{ type: 'line', text: '∫ csc²x dx = −cotx + C' },
					{ type: 'line', text: '∫ secx·tanx dx = secx + C' },
					{ type: 'line', text: '∫ cscx·cotx dx = −cscx + C' }
				]
			},
			{
				title: '有理函数积分',
				items: [
					{ type: 'line', text: '∫ 1/(1+x²) dx = arctanx + C' },
					{ type: 'line', text: '∫ 1/√(1−x²) dx = arcsinx + C' },
					{ type: 'line', text: '∫ 1/(x²−a²) dx = 1/(2a) ln|(x−a)/(x+a)| + C' }
				]
			},
			{
				title: '分部积分',
				items: [
					{ type: 'line', text: '∫ u dv = uv − ∫ v du' },
					{ type: 'line', text: '∫ x·eˣ dx = eˣ(x−1) + C' },
					{ type: 'line', text: '∫ x·sinx dx = −x·cosx + sinx + C' },
					{ type: 'line', text: '∫ x·cosx dx = x·sinx + cosx + C' },
					{ type: 'line', text: '∫ lnx dx = x·lnx − x + C' },
					{ type: 'line', text: '∫ x·lnx dx = x²/2·lnx − x²/4 + C' }
				]
			},
			{
				title: '定积分常用结论',
				items: [
					{ type: 'line', text: '∫₋ₐᵃ f(x) dx = 0（f 为奇函数）' },
					{ type: 'line', text: '∫₋ₐᵃ f(x) dx = 2∫₀ᵃ f(x) dx（f 为偶函数）' },
					{ type: 'line', text: '∫₀ᴨ sinⁿx dx = ∫₀ᴨ cosⁿx dx' }
				]
			}
		]
	}
}
