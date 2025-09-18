/**
 * API工具函数
 * 提供通用的API处理功能
 */

import { API_CONFIG, ERROR_MESSAGES } from './config.js'

/**
 * 创建带超时的fetch请求
 * @param {string} url - 请求URL
 * @param {Object} options - fetch选项
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise<Response>} fetch响应
 */
export function fetchWithTimeout(url, options = {}, timeout = API_CONFIG.TIMEOUT) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      reject(new Error(ERROR_MESSAGES.TIMEOUT_ERROR))
    }, timeout)

    fetch(url, {
      ...options,
      signal: controller.signal
    })
    .then(response => {
      clearTimeout(timeoutId)
      resolve(response)
    })
    .catch(error => {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        reject(new Error(ERROR_MESSAGES.TIMEOUT_ERROR))
      } else {
        reject(error)
      }
    })
  })
}

/**
 * 处理API响应
 * @param {Response} response - fetch响应
 * @returns {Promise<any>} 解析后的数据
 */
export async function handleApiResponse(response) {
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }
  
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  }
  
  return await response.text()
}

/**
 * 重试机制
 * @param {Function} fn - 要重试的函数
 * @param {number} maxAttempts - 最大重试次数
 * @param {number} delay - 重试延迟（毫秒）
 * @returns {Promise<any>} 函数执行结果
 */
export async function retry(fn, maxAttempts = API_CONFIG.RETRY.MAX_ATTEMPTS, delay = API_CONFIG.RETRY.DELAY) {
  let lastError
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxAttempts) {
        throw error
      }
      
      // 计算退避延迟
      const backoffDelay = delay * Math.pow(API_CONFIG.RETRY.BACKOFF_FACTOR, attempt - 1)
      console.log(`第${attempt}次尝试失败，${backoffDelay}ms后重试...`)
      
      await new Promise(resolve => setTimeout(resolve, backoffDelay))
    }
  }
  
  throw lastError
}

/**
 * 错误处理工具
 * @param {Error} error - 错误对象
 * @returns {string} 用户友好的错误消息
 */
export function getErrorMessage(error) {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR
  }
  
  if (error.message.includes('timeout') || error.message.includes('TIMEOUT')) {
    return ERROR_MESSAGES.TIMEOUT_ERROR
  }
  
  if (error.message.includes('ECONNREFUSED') || error.message.includes('connection refused')) {
    return ERROR_MESSAGES.CONNECTION_REFUSED
  }
  
  if (error.message.includes('HTTP 5')) {
    return ERROR_MESSAGES.SERVER_ERROR
  }
  
  return error.message || ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * 构建查询字符串
 * @param {Object} params - 参数对象
 * @returns {string} 查询字符串
 */
export function buildQueryString(params) {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value))
    }
  })
  
  return searchParams.toString()
}

/**
 * 构建完整URL
 * @param {string} endpoint - API端点
 * @param {Object} params - 查询参数
 * @returns {string} 完整URL
 */
export function buildApiUrl(endpoint, params = {}) {
  const baseUrl = API_CONFIG.BASE_URL
  const queryString = buildQueryString(params)
  
  if (queryString) {
    return `${baseUrl}${endpoint}?${queryString}`
  }
  
  return `${baseUrl}${endpoint}`
}

/**
 * 日志工具
 * @param {string} level - 日志级别
 * @param {string} message - 日志消息
 * @param {any} data - 附加数据
 */
export function log(level, message, data = null) {
  if (API_CONFIG.DEV_CONFIG?.ENABLE_VERBOSE_LOGGING) {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`
    
    switch (level) {
      case 'error':
        console.error(logMessage, data)
        break
      case 'warn':
        console.warn(logMessage, data)
        break
      case 'info':
        console.info(logMessage, data)
        break
      default:
        console.log(logMessage, data)
    }
  }
}
