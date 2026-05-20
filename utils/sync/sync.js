import { getMistakes, getReviewRecords, getPreferences, getQuotes, getCustomOptions, savePreferences } from '../storage/storage.js'

var REPO_OWNER = 'xianwum2000-tech'
var REPO_NAME = 'cuotishiguang'
var BACKUP_PATH = 'Data/backup.json'

function getApiUrl() {
  return 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME + '/contents/' + BACKUP_PATH
}

export function getSyncConfig() {
  var prefs = getPreferences()
  return {
    token: prefs.githubToken || ''
  }
}

export function saveSyncGithubToken(token) {
  var prefs = getPreferences()
  savePreferences({
    ...prefs,
    githubToken: token
  })
}

export function testGitHubToken(token) {
  return new Promise(function(resolve) {
    if (!token) {
      resolve({ success: false, error: '请输入 GitHub Token' })
      return
    }
    uni.request({
      url: 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME,
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
        } else if (res.statusCode === 404) {
          resolve({ success: false, error: '仓库不存在或 Token 权限不足' })
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

function base64Encode(str) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var output = ''
  var i = 0
  while (i < str.length) {
    var c1 = str.charCodeAt(i++)
    var c2 = str.charCodeAt(i++)
    var c3 = str.charCodeAt(i++)
    var e1 = c1 >> 2
    var e2 = ((c1 & 3) << 4) | (c2 >> 4)
    var e3 = isNaN(c2) ? 64 : (((c2 & 15) << 2) | (c3 >> 6))
    var e4 = isNaN(c3) ? 64 : (c3 & 63)
    output += chars.charAt(e1) + chars.charAt(e2) + chars.charAt(e3) + chars.charAt(e4)
  }
  return output
}

function base64Decode(str) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var output = ''
  var i = 0
  str = str.replace(/[^A-Za-z0-9\+\/\=]/g, '')
  while (i < str.length) {
    var e1 = chars.indexOf(str.charAt(i++))
    var e2 = chars.indexOf(str.charAt(i++))
    var e3 = chars.indexOf(str.charAt(i++))
    var e4 = chars.indexOf(str.charAt(i++))
    var c1 = (e1 << 2) | (e2 >> 4)
    var c2 = ((e2 & 15) << 4) | (e3 >> 2)
    var c3 = ((e3 & 3) << 6) | e4
    output += String.fromCharCode(c1)
    if (e3 !== 64) output += String.fromCharCode(c2)
    if (e4 !== 64) output += String.fromCharCode(c3)
  }
  return output
}

function fetchCurrentSha(token) {
  return new Promise(function(resolve) {
    uni.request({
      url: getApiUrl(),
      method: 'GET',
      header: {
        'Authorization': 'token ' + token,
        'User-Agent': 'CuotiShiguang-App'
      },
      success: function(res) {
        if (res.statusCode === 200 && res.data && res.data.sha) {
          resolve(res.data.sha)
        } else {
          resolve(null)
        }
      },
      fail: function() {
        resolve(null)
      }
    })
  })
}

export function backupToRepo() {
  return new Promise(function(resolve) {
    var config = getSyncConfig()
    if (!config.token) {
      resolve({ success: false, error: '请先配置 GitHub Token' })
      return
    }

    var payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      mistakes: getMistakes(),
      records: getReviewRecords(),
      preferences: getPreferences(),
      quotes: getQuotes(),
      customOptions: getCustomOptions()
    }
    var json = JSON.stringify(payload, null, 2)
    var encoded = base64Encode(json)

    fetchCurrentSha(config.token).then(function(sha) {
      var body = {
        message: '错题拾光备份 ' + new Date().toISOString().slice(0, 19).replace('T', ' '),
        content: encoded
      }
      if (sha) body.sha = sha

      uni.request({
        url: getApiUrl(),
        method: 'PUT',
        header: {
          'Authorization': 'token ' + config.token,
          'Content-Type': 'application/json',
          'User-Agent': 'CuotiShiguang-App'
        },
        data: body,
        success: function(res) {
          if (res.statusCode === 200 || res.statusCode === 201) {
            var now = new Date().toISOString()
            uni.setStorageSync('mistake_scheduler_last_backup', now)
            resolve({ success: true, time: now })
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
  })
}

export function restoreFromRepo() {
  return new Promise(function(resolve) {
    var config = getSyncConfig()
    if (!config.token) {
      resolve({ success: false, error: '请先配置 GitHub Token' })
      return
    }

    uni.request({
      url: getApiUrl(),
      method: 'GET',
      header: {
        'Authorization': 'token ' + config.token,
        'User-Agent': 'CuotiShiguang-App'
      },
      success: function(res) {
        if (res.statusCode === 200 && res.data && res.data.content) {
          try {
            var json = base64Decode(res.data.content)
            var data = JSON.parse(json)
            resolve({ success: true, data: data })
          } catch (e) {
            resolve({ success: false, error: '备份数据格式错误' })
          }
        } else if (res.statusCode === 404) {
          resolve({ success: false, error: '没有找到备份文件，请先备份' })
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
