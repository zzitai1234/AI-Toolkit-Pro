/**
 * API配置文件
 * 统一管理API相关的配置
 */

// API基础配置
export const API_CONFIG = {
  // 后端服务地址
  BASE_URL: 'http://localhost:8081',
  
  // 请求超时时间（毫秒）
  TIMEOUT: 15000,
  
  // SSE连接超时时间（毫秒）
  SSE_TIMEOUT: 15000,
  
  // 健康检查超时时间（毫秒）
  HEALTH_CHECK_TIMEOUT: 5000,
  
  // 重试配置
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 重试延迟（毫秒）
    BACKOFF_FACTOR: 2 // 退避因子
  }
}

// API端点配置
export const API_ENDPOINTS = {
  // 聊天相关
  CHAT: '/api/ai/chat',
  HEALTH: '/api/ai/health',
  
  // 其他可能的端点
  USER: '/api/user',
  AUTH: '/api/auth'
}

// 错误消息配置
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络连接',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  SERVER_ERROR: '服务器错误，请稍后重试',
  CONNECTION_REFUSED: '无法连接到后端服务，请确保后端服务正在运行',
  UNKNOWN_ERROR: '未知错误，请稍后重试'
}

// 开发环境配置
export const DEV_CONFIG = {
  // 是否启用详细日志
  ENABLE_VERBOSE_LOGGING: true,
  
  // 是否模拟API响应（用于开发测试）
  MOCK_API_RESPONSES: false,
  
  // 模拟延迟（毫秒）
  MOCK_DELAY: 1000
}
