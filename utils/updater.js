import { APP_VERSION, UPDATE_CONFIG, getCurrentAppVersion, isUpdateConfigured } from './version.js'

function parseRemotePayload(payload) {
	if (typeof payload === 'string') {
		try {
			return JSON.parse(payload)
		} catch (error) {
			return null
		}
	}

	if (payload && typeof payload === 'object') return payload
	return null
}

function normalizeRemoteVersion(payload) {
	const info = parseRemotePayload(payload)
	if (!info) return null

	const versionCode = Number(info.versionCode)
	if (!versionCode || !info.apkUrl) return null

	return {
		versionName: info.versionName || String(versionCode),
		versionCode,
		packageName: info.packageName || APP_VERSION.packageName,
		apkUrl: info.apkUrl,
		changelog: info.changelog || '',
		force: info.force === true,
		publishedAt: info.publishedAt || ''
	}
}

export function getUpdateRuntimeInfo() {
	return {
		current: getCurrentAppVersion(),
		configured: isUpdateConfigured(),
		manifestUrl: UPDATE_CONFIG.manifestUrl
	}
}

export function fetchLatestVersion() {
	return new Promise((resolve) => {
		if (!isUpdateConfigured()) {
			resolve({
				ok: false,
				reason: 'not-configured'
			})
			return
		}

		uni.request({
			url: UPDATE_CONFIG.manifestUrl,
			method: 'GET',
			timeout: 10000,
			success: (res) => {
				const remote = normalizeRemoteVersion(res.data)
				if (!remote) {
					resolve({
						ok: false,
						reason: 'bad-manifest'
					})
					return
				}

				resolve({
					ok: true,
					remote
				})
			},
			fail: () => {
				resolve({
					ok: false,
					reason: 'network'
				})
			}
		})
	})
}

export async function checkForUpdate() {
	const current = getCurrentAppVersion()
	const result = await fetchLatestVersion()
	if (!result.ok) {
		return {
			...result,
			current,
			hasUpdate: false
		}
	}

	if (result.remote.packageName !== APP_VERSION.packageName) {
		return {
			ok: false,
			reason: 'package-mismatch',
			current,
			remote: result.remote,
			hasUpdate: false
		}
	}

	return {
		ok: true,
		current,
		remote: result.remote,
		hasUpdate: result.remote.versionCode > current.code
	}
}

export function downloadAndInstallApk(remote, onProgress) {
	return new Promise((resolve, reject) => {
		if (typeof plus === 'undefined' || !plus.downloader || !plus.runtime) {
			reject(new Error('app-plus-only'))
			return
		}

		const fileName = 'cuotishiguang-' + remote.versionName + '.apk'
		const task = plus.downloader.createDownload(
			remote.apkUrl,
			{ filename: '_doc/update/' + fileName },
			(download, status) => {
				if (status !== 200) {
					reject(new Error('download-status-' + status))
					return
				}

				try {
					plus.runtime.install(
						download.filename,
						{},
						() => resolve(),
						(error) => reject(error)
					)
				} catch (error) {
					reject(error)
				}
			}
		)

		task.addEventListener('statechanged', (download) => {
			if (download.state === 3 && download.totalSize > 0) {
				const progress = Math.floor((download.downloadedSize / download.totalSize) * 100)
				if (typeof onProgress === 'function') onProgress(progress)
			}
		})

		task.start()
	})
}
