function shouldPersistFile(filePath) {
	if (!filePath) return false
	if (filePath.indexOf('/static/') === 0) return false
	if (filePath.indexOf('http://') === 0 || filePath.indexOf('https://') === 0) return false
	if (filePath.indexOf('data:image') === 0) return false
	if (filePath.indexOf('_doc/uniapp_save') >= 0) return false
	if (filePath.indexOf('file://') === 0 && filePath.indexOf('uniapp_save') >= 0) return false
	return true
}

export function persistImageFile(filePath) {
	return new Promise((resolve) => {
		if (!shouldPersistFile(filePath) || typeof uni.saveFile !== 'function') {
			resolve({
				path: filePath || '',
				persisted: false,
				changed: false
			})
			return
		}

		uni.saveFile({
			tempFilePath: filePath,
			success: (res) => {
				const savedPath = res.savedFilePath || filePath
				resolve({
					path: savedPath,
					persisted: savedPath !== filePath,
					changed: savedPath !== filePath
				})
			},
			fail: () => {
				resolve({
					path: filePath,
					persisted: false,
					changed: false
				})
			}
		})
	})
}

export function previewImages(urls, current) {
	const list = urls.filter((url) => !!url)
	if (list.length === 0) return false

	uni.previewImage({
		urls: list,
		current: current || list[0],
		indicator: 'number'
	})
	return true
}
