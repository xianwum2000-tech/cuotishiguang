import { getPreferences } from './storage.js'

var OCR_SYSTEM_PROMPT = '你是一个数学公式识别助手。请识别图片中的数学题目内容。\n' +
  '要求：\n' +
  '1. 数学公式用 $...$ 包裹（行内）或 $$...$$ 包裹（独立成行）\n' +
  '2. 保持原文的题目编号和格式\n' +
  '3. 如果图片中有多个题目，只识别用户指定的那道题\n' +
  '4. 输出纯文本，不要添加解题步骤或分析\n' +
  '5. 如果用户指定了第几题，只提取那一道题的内容'

export function getOcrConfig() {
  var prefs = getPreferences()
  return {
    apiKey: prefs.ocrApiKey || '',
    model: prefs.ocrModel || 'qwen-vl-plus'
  }
}

export function testOcrApiKey(apiKey) {
  return new Promise(function(resolve) {
    if (!apiKey) {
      resolve({ success: false, error: '请输入 API Key' })
      return
    }
    uni.request({
      url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      data: {
        model: 'qwen-vl-plus',
        input: {
          messages: [
            {
              role: 'user',
              content: [{ text: 'hello' }]
            }
          ]
        }
      },
      success: function(res) {
        if (res.statusCode === 200) {
          resolve({ success: true })
        } else if (res.statusCode === 401) {
          resolve({ success: false, error: 'API Key 无效' })
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

export function recognizeImage(imagePath, questionNumber) {
  return new Promise(function(resolve, reject) {
    var config = getOcrConfig()
    if (!config.apiKey) {
      reject(new Error('请先在设置中配置通义千问 API Key'))
      return
    }

    plus.io.resolveLocalFileSystemURL(imagePath, function(entry) {
      entry.file(function(file) {
        var reader = new plus.io.FileReader()
        reader.onloadend = function(e) {
          var base64 = e.target.result
          callOcrApi(base64, questionNumber, config)
            .then(resolve)
            .catch(reject)
        }
        reader.readAsDataURL(file)
      }, function() {
        reject(new Error('读取图片文件失败'))
      })
    }, function() {
      reject(new Error('解析图片路径失败'))
    })
  })
}

function callOcrApi(base64DataUrl, questionNumber, config) {
  return new Promise(function(resolve, reject) {
    var userContent = [{ image: base64DataUrl }]
    var userText = '请识别这张图片中的数学题目内容。'
    if (questionNumber) {
      userText += ' 图片中有多个题目，请只提取第 ' + questionNumber + ' 题。'
    }
    userContent.push({ text: userText })

    uni.request({
      url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + config.apiKey
      },
      data: {
        model: config.model || 'qwen-vl-plus',
        input: {
          messages: [
            { role: 'system', content: OCR_SYSTEM_PROMPT },
            { role: 'user', content: userContent }
          ]
        },
        parameters: {
          result_format: 'message'
        }
      },
      timeout: 30000,
      success: function(res) {
        if (res.statusCode === 200 && res.data && res.data.output && res.data.output.choices) {
          var choice = res.data.output.choices[0]
          var text = choice.message && choice.message.content && choice.message.content[0]
            ? choice.message.content[0].text
            : ''
          resolve(text || '未识别到内容')
        } else if (res.statusCode === 401) {
          reject(new Error('API Key 无效，请检查配置'))
        } else if (res.statusCode === 429) {
          reject(new Error('请求过于频繁，请稍后再试'))
        } else {
          var errMsg = (res.data && res.data.message) || '识别失败 (' + res.statusCode + ')'
          reject(new Error(errMsg))
        }
      },
      fail: function(err) {
        reject(new Error('网络请求失败，请检查网络连接'))
      }
    })
  })
}

export function extractQuestionNumber(source) {
  if (!source) return ''
  var match = source.match(/第?\s*(\d+)\s*题/)
  return match ? match[1] : ''
}
