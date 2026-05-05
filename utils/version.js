export const APP_VERSION = {
	name: '1.0.2',
	code: 102,
	packageName: 'com.cuotishiguang.app',
	channel: 'github-release'
}

export const UPDATE_CONFIG = {
	manifestUrl: 'https://github.com/xianwum2000-tech/cuotishiguang/releases/latest/download/update.json'
}

export function isUpdateConfigured() {
	return UPDATE_CONFIG.manifestUrl.indexOf('YOUR_GITHUB_USERNAME') < 0 &&
		UPDATE_CONFIG.manifestUrl.indexOf('YOUR_REPOSITORY') < 0
}

export function getCurrentAppVersion() {
	const version = { ...APP_VERSION }

	if (typeof plus !== 'undefined' && plus.runtime) {
		if (plus.runtime.version) version.name = plus.runtime.version
		if (plus.runtime.versionCode) version.code = Number(plus.runtime.versionCode)
	}

	return version
}

