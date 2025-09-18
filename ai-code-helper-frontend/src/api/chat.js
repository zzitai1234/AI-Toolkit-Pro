/**
 * 聊天API服务
 * 负责与后端聊天接口的通信
 */

// API基础配置
const API_BASE_URL = 'http://localhost:8081'
const API_TIMEOUT = 15000 // 15秒超时

/**
 * 创建SSE连接
 * @param {string} memoryId - 聊天记忆ID
 * @param {string} message - 用户消息
 * @param {Object} callbacks - 回调函数对象
 * @returns {EventSource} SSE连接对象
 */
export function createChatSSE(memoryId, message, callbacks = {}) {
  const url = `${API_BASE_URL}/api/ai/chat?memoryId=${memoryId}&message=${encodeURIComponent(message)}`
  console.log('尝试连接SSE:', url)
  
  const eventSource = new EventSource(url)
  
  // 设置连接超时
  const connectionTimeout = setTimeout(() => {
    if (eventSource && eventSource.readyState === EventSource.CONNECTING) {
      console.log('SSE连接超时，关闭连接')
      eventSource.close()
      if (callbacks.onTimeout) {
        callbacks.onTimeout()
      }
    }
  }, API_TIMEOUT)
  
  // 监听连接打开
  eventSource.onopen = () => {
    console.log('SSE连接已建立')
    clearTimeout(connectionTimeout)
    if (callbacks.onOpen) {
      callbacks.onOpen()
    }
  }
  
  // 监听SSE消息
  eventSource.onmessage = (event) => {
    console.log('收到SSE消息:', event.data)
    if (callbacks.onMessage) {
      callbacks.onMessage(event.data)
    }
  }
  
  // 监听连接错误
  eventSource.onerror = (error) => {
    console.error('SSE连接错误:', error)
    clearTimeout(connectionTimeout)
    
    let errorMessage = '抱歉，处理您的请求时发生错误，请稍后重试。'
    
    // 检查是否是网络连接问题
    if (error.type === 'error' && eventSource.readyState === EventSource.CLOSED) {
      errorMessage = '抱歉，无法连接到后端服务。请确保后端服务在 http://localhost:8081 运行，并检查网络连接。'
    }
    
    if (callbacks.onError) {
      callbacks.onError(error, errorMessage)
    }
    
    eventSource.close()
  }
  
  // 监听连接结束
  eventSource.addEventListener('end', () => {
    console.log('SSE连接结束')
    clearTimeout(connectionTimeout)
    if (callbacks.onEnd) {
      callbacks.onEnd()
    }
    eventSource.close()
  })
  
  return eventSource
}

/**
 * 检查后端服务健康状态
 * @returns {Promise<boolean>} 服务是否可用
 */
export async function checkServiceHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/health`, {
      method: 'GET',
      timeout: 5000
    })
    return response.ok
  } catch (error) {
    console.error('健康检查失败:', error)
    return false
  }
}

/**
 * 发送聊天消息（非SSE方式，备用）
 * @param {string} memoryId - 聊天记忆ID
 * @param {string} message - 用户消息
 * @returns {Promise<string>} AI回复
 */
export async function sendChatMessage(memoryId, message) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memoryId,
        message
      }),
      timeout: API_TIMEOUT
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.message || data.response || '抱歉，没有收到回复。'
  } catch (error) {
    console.error('发送消息失败:', error)
    throw new Error('发送消息时出现错误，请稍后重试。')
  }
}

/**
 * 生成聊天室ID
 * @returns {string} 聊天室ID
 */
export function generateChatId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 格式化时间戳
 * @param {number} timestamp - 时间戳
 * @returns {string} 格式化后的时间
 */
export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
