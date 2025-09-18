/**
 * API模块入口文件
 * 统一导出所有API相关的功能
 */

// 导出聊天API
export {
  createChatSSE,
  checkServiceHealth,
  sendChatMessage,
  generateChatId,
  formatTime
} from './chat.js'

// 导出配置
export {
  API_CONFIG,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  DEV_CONFIG
} from './config.js'

// 导出工具函数
export {
  fetchWithTimeout,
  handleApiResponse,
  retry,
  getErrorMessage,
  buildQueryString,
  buildApiUrl,
  log
} from './utils.js'
