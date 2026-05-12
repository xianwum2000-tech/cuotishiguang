import { getMistakes, getReviewRecords, getPreferences, getQuotes, savePreferences } from './storage.js'

var GIST_DESC = '错题拾光备份'
var GIST_FILENAME = 'cuotishiguang-backup.json'

export function getSyncConfig() {
  var prefs = getPreferences()
  return {
    token: prefs.githubToken || '',
    gistId: prefs.githubGistId || ''
  }
}

export function saveSyncGithubToken(token) {
  var prefs = getPreferences()
  savePreferences({
    ...prefs,
    githubToken: token
  })
}

export function saveSyncGistId(gistId) {
  var prefs = getPreferences()
  savePreferences({
    ...prefs,
    githubGistId: gistId
  })
}

export function testGitHubToken(token) {
  return new Promise(function(resolve) {
    if (!token) {
      resolve({ success: false, error: '请输入 GitHub Token' })
      return
    }
    uni.request({
      url: 'https://api.github.com/gists',
      method: 'GET',
      header: {
        'Authorization': 'token ' + token,
        'User-Agent': 'CuotiShiguang-App'
      },
      success: function(res) {
        if (res.statusCode === 200) {
          resolve({ success: true })
        } else if (res.statusCode === 401) {
          resolve({ success: false, error: 'Token 无效' })
        } else {
          resolve({ success: false, error: '请求失败 (' + res.statusCode + ')' })
        }
      },
      fail: function() {
        resolve({ success: false, error: '网络请求失败' })
      }
    })
  })
}

export function backupToGist() {
  return new Promise(function(resolve) {
    var config = getSyncConfig()
    if (!config.token) {
      resolve({ success: false, error: '请先配置 GitHub Token' })
      return
    }

    var payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      mistakes: getMistakes(),
      records: getReviewRecords(),
      preferences: getPreferences(),
      quotes: getQuotes()
    }
    var json = JSON.stringify(payload, null, 2)

    var body = {
      description: GIST_DESC + ' - ' + new Date().toISOString().slice(0, 10),
      files: {}
    }
    body.files[GIST_FILENAME] = { content: json }

    var url = 'https://api.github.com/gists'
    var method = 'POST'
    if (config.gistId) {
      url = 'https://api.github.com/gists/' + config.gistId
      method = 'PATCH'
    }

    uni.request({
      url: url,
      method: method,
      header: {
        'Authorization': 'token ' + config.token,
        'Content-Type': 'application/json',
        'User-Agent': 'CuotiShiguang-App'
      },
      data: body,
      success: function(res) {
        if (res.statusCode === 200 || res.statusCode === 201) {
          var gistId = res.data.id
          saveSyncGistId(gistId)
          var now = new Date().toISOString()
          uni.setStorageSync('mistake_scheduler_last_backup', now)
          resolve({ success: true, gistId: gistId, time: now })
        } else {
          var errMsg = (res.data && res.data.message) || '备份失败 (' + res.statusCode + ')'
          resolve({ success: false, error: errMsg })
        }
      },
      fail: function() {
        resolve({ success: false, error: '网络请求失败' })
      }
    })
  })
}

export function restoreFromGist() {
  return new Promise(function(resolve) {
    var config = getSyncConfig()
    if (!config.token) {
      resolve({ success: false, error: '请先配置 GitHub Token' })
      return
    }
    if (!config.gistId) {
      resolve({ success: false, error: '没有备份记录，请先备份' })
      return
    }

    uni.request({
      url: 'https://api.github.com/gists/' + config.gistId,
      method: 'GET',
      header: {
        'Authorization': 'token ' + config.token,
        'User-Agent': 'CuotiShiguang-App'
      },
      success: function(res) {
        if (res.statusCode === 200 && res.data && res.data.files) {
          var file = res.data.files[GIST_FILENAME]
          if (!file || !file.content) {
            resolve({ success: false, error: '备份文件不存在' })
            return
          }
          try {
            var data = JSON.parse(file.content)
            resolve({ success: true, data: data })
          } catch (e) {
            resolve({ success: false, error: '备份数据格式错误' })
          }
        } else {
          resolve({ success: false, error: '获取备份失败 (' + res.statusCode + ')' })
        }
      },
      fail: function() {
        resolve({ success: false, error: '网络请求失败' })
      }
    })
  })
}
