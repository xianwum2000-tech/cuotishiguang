import { getMistakes, getReviewRecords, getPreferences, getQuotes } from './storage.js'
import { todayKey } from './date.js'

export function exportAllData() {
	try {
		const payload = {
			version: 1,
			exportedAt: new Date().toISOString(),
			mistakes: getMistakes(),
			records: getReviewRecords(),
			preferences: getPreferences(),
			quotes: getQuotes()
		}
		const json = JSON.stringify(payload, null, 2)
		const fileName = '错题拾光_备份_' + todayKey() + '.json'

		return new Promise(function (resolve) {
			if (typeof plus !== 'undefined' && plus.io) {
				try {
					const downloadDir = plus.io.getDownloadDir ? plus.io.getDownloadDir() : ''
					if (downloadDir) {
						const filePath = downloadDir + '/' + fileName
						const writer = plus.io.createFileWriter(filePath, function (w) {
							w.write(json)
							w.close()
							resolve({ success: true, fileName: fileName })
						}, function () {
							resolve({ success: false, error: '写入文件失败' })
						})
						if (!writer) {
							resolve({ success: false, error: '创建文件失败' })
						}
						return
					}
				} catch (e) {
					// plus.io 不可用，降级到 saveFile
				}
			}

			if (typeof uni.saveFile === 'function') {
				const tempKey = '_export_temp_' + Date.now()
				uni.setStorageSync(tempKey, json)
				uni.saveFile({
					tempFilePath: tempKey,
					success: function (res) {
						resolve({ success: true, fileName: fileName })
					},
					fail: function () {
						resolve({ success: false, error: '保存文件失败' })
					}
				})
			} else {
				resolve({ success: false, error: '当前环境不支持保存文件' })
			}
		})
	} catch (err) {
		return Promise.resolve({ success: false, error: err.message || '导出失败' })
	}
}
