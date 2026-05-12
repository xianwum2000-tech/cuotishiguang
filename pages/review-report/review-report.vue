<template>
  <view class="screen screen-cream">
    <view class="topbar compact-topbar">
      <view class="brand-row">
        <view class="back-button" @click="goBack"><text>‹</text></view>
        <text class="brand-title small-brand">学习复盘</text>
      </view>
    </view>
    <view class="page-content report-content">
      <view class="report-tabs">
        <view :class="period === 'week' ? 'report-tab report-tab-active' : 'report-tab'" @click="period = 'week'">
          <text>本周</text>
        </view>
        <view :class="period === 'month' ? 'report-tab report-tab-active' : 'report-tab'" @click="period = 'month'">
          <text>本月</text>
        </view>
      </view>

      <view class="report-overview soft-card">
        <view class="report-stat">
          <text class="report-stat-num">{{ periodTotal }}</text>
          <text class="report-stat-label">复习总数</text>
        </view>
        <view class="report-stat-divider"></view>
        <view class="report-stat">
          <text class="report-stat-num">{{ periodRate }}%</text>
          <text class="report-stat-label">正确率</text>
        </view>
        <view class="report-stat-divider"></view>
        <view class="report-stat">
          <text class="report-stat-num" :class="trendClass">{{ trendText }}</text>
          <text class="report-stat-label">vs 上期</text>
        </view>
      </view>

      <view class="report-chart soft-card">
        <text class="section-title">每日复习趋势</text>
        <view class="chart-container">
          <view class="chart-bars">
            <view v-for="bar in trendBars" :key="bar.date" class="chart-bar-col">
              <view class="chart-bar-stack">
                <view class="chart-bar-total" :style="{ height: bar.totalHeight + 'px' }"></view>
                <view class="chart-bar-correct" :style="{ height: bar.correctHeight + 'px' }"></view>
              </view>
              <text class="chart-bar-label">{{ bar.label }}</text>
            </view>
          </view>
          <view class="chart-legend">
            <view class="legend-item"><view class="legend-dot legend-total"></view><text>总数</text></view>
            <view class="legend-item"><view class="legend-dot legend-correct"></view><text>正确</text></view>
          </view>
        </view>
      </view>

      <view class="report-distribution soft-card">
        <text class="section-title">错因分布</text>
        <view v-for="item in errorDist" :key="item.name" class="dist-line">
          <text class="dist-name">{{ item.name }}</text>
          <view class="dist-track"><view class="dist-fill dist-fill-red" :style="{ width: item.pct + '%' }"></view></view>
          <text class="dist-count">{{ item.count }}</text>
        </view>
      </view>

      <view class="report-distribution soft-card">
        <text class="section-title">章节分布</text>
        <view v-for="item in chapterDist" :key="item.name" class="dist-line">
          <text class="dist-name">{{ item.name }}</text>
          <view class="dist-track"><view class="dist-fill" :style="{ width: item.pct + '%' }"></view></view>
          <text class="dist-count">{{ item.count }}</text>
        </view>
      </view>

      <view class="report-summary soft-card">
        <text class="section-title">分析摘要</text>
        <text class="summary-text">{{ summaryText }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { todayKey, addDays } from '@/utils/date.js'
import { getMistakes, getReviewRecords } from '@/utils/storage.js'

export default {
  data() {
    return {
      period: 'week',
      records: [],
      mistakes: []
    }
  },
  computed: {
    periodDays() {
      return this.period === 'week' ? 7 : 30
    },
    periodRecords() {
      var start = addDays(todayKey(), -(this.periodDays - 1))
      var today = todayKey()
      return this.records.filter(function(r) { return r.reviewDate >= start && r.reviewDate <= today })
    },
    prevPeriodRecords() {
      var end = addDays(todayKey(), -this.periodDays)
      var start = addDays(end, -(this.periodDays - 1))
      return this.records.filter(function(r) { return r.reviewDate >= start && r.reviewDate <= end })
    },
    periodTotal() {
      return this.periodRecords.length
    },
    periodRate() {
      if (this.periodTotal === 0) return 0
      var known = this.periodRecords.filter(function(r) { return r.result === 'known' }).length
      return Math.round(known / this.periodTotal * 100)
    },
    prevPeriodRate() {
      if (this.prevPeriodRecords.length === 0) return 0
      var known = this.prevPeriodRecords.filter(function(r) { return r.result === 'known' }).length
      return Math.round(known / this.prevPeriodRecords.length * 100)
    },
    trendText() {
      var diff = this.periodRate - this.prevPeriodRate
      if (diff > 0) return '+' + diff + '%'
      if (diff < 0) return diff + '%'
      return '持平'
    },
    trendClass() {
      var diff = this.periodRate - this.prevPeriodRate
      if (diff > 0) return 'trend-up'
      if (diff < 0) return 'trend-down'
      return ''
    },
    trendBars() {
      var self = this
      var bars = []
      var days = this.periodDays
      var maxTotal = 1
      for (var i = days - 1; i >= 0; i--) {
        var date = addDays(todayKey(), -i)
        var dayRecords = self.periodRecords.filter(function(r) { return r.reviewDate === date })
        var total = dayRecords.length
        var correct = dayRecords.filter(function(r) { return r.result === 'known' }).length
        if (total > maxTotal) maxTotal = total
        bars.push({ date: date, total: total, correct: correct, label: self.formatBarLabel(date) })
      }
      return bars.map(function(b) {
        return {
          date: b.date,
          total: b.total,
          correct: b.correct,
          label: b.label,
          totalHeight: Math.max(4, Math.round(b.total / maxTotal * 80)),
          correctHeight: Math.max(0, Math.round(b.correct / maxTotal * 80))
        }
      })
    },
    errorDist() {
      return this.buildDist('errorType')
    },
    chapterDist() {
      return this.buildDist('chapter')
    },
    summaryText() {
      var total = this.periodTotal
      var rate = this.periodRate
      var trend = this.periodRate - this.prevPeriodRate
      var topError = this.errorDist.length > 0 ? this.errorDist[0].name : '无'
      var topChapter = this.chapterDist.length > 0 ? this.chapterDist[0].name : '无'
      var text = '本' + (this.period === 'week' ? '周' : '月') + '复习了 ' + total + ' 道题，正确率 ' + rate + '%。'
      if (topError !== '无') {
        text += ' 最常见的错因是「' + topError + '」。'
      }
      if (topChapter !== '无') {
        text += ' 薄弱章节是「' + topChapter + '」，建议重点复习。'
      }
      if (trend > 0) {
        text += ' 比上期提升了 ' + trend + '%，继续保持！'
      } else if (trend < 0) {
        text += ' 比上期下降了 ' + Math.abs(trend) + '%，需要加油。'
      }
      return text
    }
  },
  onLoad() {
    this.records = getReviewRecords()
    this.mistakes = getMistakes()
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    formatBarLabel(date) {
      var parts = date.split('-')
      return parseInt(parts[1]) + '/' + parseInt(parts[2])
    },
    buildDist(field) {
      var active = this.mistakes.filter(function(m) { return !m.isArchived })
      var tally = {}
      active.forEach(function(m) {
        var key = m[field] || '未分类'
        tally[key] = (tally[key] || 0) + 1
      })
      var total = active.length || 1
      var result = Object.keys(tally).map(function(name) {
        return { name: name, count: tally[name], pct: Math.round(tally[name] / total * 100) }
      })
      result.sort(function(a, b) { return b.count - a.count })
      return result
    }
  }
}
</script>

<style>
.report-content {
  padding-top: 12px;
}
.report-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}
.report-tab {
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  background: #FFFFFF;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.report-tab text {
  font-size: 14px;
  font-weight: 600;
  color: #78716C;
}
.report-tab-active {
  background: #EDE9FE;
}
.report-tab-active text {
  color: #6D28D9;
}
.report-overview {
  display: flex;
  align-items: center;
  padding: 18px;
  margin-bottom: 14px;
}
.report-stat {
  flex: 1;
  text-align: center;
}
.report-stat-num {
  font-size: 22px;
  font-weight: 700;
  color: #292524;
  display: block;
}
.report-stat-label {
  font-size: 11px;
  color: #A8A29E;
  display: block;
  margin-top: 2px;
}
.report-stat-divider {
  width: 1px;
  height: 32px;
  background: #E7E5E4;
}
.trend-up {
  color: #10B981;
}
.trend-down {
  color: #EF4444;
}
.report-chart {
  padding: 14px;
  margin-bottom: 14px;
}
.chart-container {
  margin-top: 12px;
}
.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100px;
  gap: 2px;
}
.chart-bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}
.chart-bar-stack {
  width: 100%;
  max-width: 24px;
  position: relative;
}
.chart-bar-total {
  width: 100%;
  background: #F59E0B;
  border-radius: 4px 4px 0 0;
  min-height: 2px;
}
.chart-bar-correct {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #10B981;
  border-radius: 0 0 4px 4px;
}
.chart-bar-label {
  font-size: 9px;
  color: #A8A29E;
}
.chart-legend {
  display: flex;
  gap: 14px;
  margin-top: 10px;
  justify-content: center;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}
.legend-item text {
  font-size: 11px;
  color: #A8A29E;
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.legend-total {
  background: #F59E0B;
}
.legend-correct {
  background: #10B981;
}
.report-distribution {
  padding: 14px;
  margin-bottom: 14px;
}
.report-summary {
  padding: 14px;
  margin-bottom: 20px;
}
.summary-text {
  font-size: 13px;
  color: #44403C;
  line-height: 1.8;
  display: block;
  margin-top: 8px;
}
/* Reuse existing dist-line styles if defined globally, otherwise add: */
.dist-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.dist-name {
  font-size: 12px;
  color: #57534E;
  width: 56px;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dist-track {
  flex: 1;
  height: 8px;
  background: #F5F0EB;
  border-radius: 4px;
  overflow: hidden;
}
.dist-fill {
  height: 100%;
  background: linear-gradient(90deg, #F59E0B, #F97316);
  border-radius: 4px;
}
.dist-fill-red {
  background: linear-gradient(90deg, #EF4444, #DC2626);
}
.dist-count {
  font-size: 12px;
  font-weight: 600;
  color: #44403C;
  width: 24px;
  text-align: right;
  flex-shrink: 0;
}
</style>
