import { fetchWithTimeout, handleApiResponse, buildApiUrl } from './utils.js'

// 获取会话列表
export const getConversations = async () => {
  try {
    const response = await fetchWithTimeout(buildApiUrl('/conversations'), { method: 'GET' })
    const data = await handleApiResponse(response)
    return data
  } catch (error) {
    console.error('获取会话列表失败:', error)
    // 返回本地存储的会话列表作为fallback
    return getLocalConversations()
  }
}

// 创建新会话
export const createConversation = async (title = '新对话') => {
  try {
    const response = await fetchWithTimeout(buildApiUrl('/conversations'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    })
    const conversation = await handleApiResponse(response)
    // 同时保存到本地存储
    saveConversationToLocal(conversation)
    return conversation
  } catch (error) {
    console.error('创建会话失败:', error)
    // 创建本地会话作为fallback
    const conversation = {
      id: generateId(),
      title,
      lastMessage: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    saveConversationToLocal(conversation)
    return conversation
  }
}

// 更新会话
export const updateConversation = async (id, updates) => {
  try {
    const response = await fetchWithTimeout(buildApiUrl(`/conversations/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updates,
        updatedAt: new Date().toISOString()
      })
    })
    const conversation = await handleApiResponse(response)
    // 同时更新本地存储
    updateConversationInLocal(conversation)
    return conversation
  } catch (error) {
    console.error('更新会话失败:', error)
    // 更新本地存储
    updateConversationInLocal({ id, ...updates, updatedAt: new Date().toISOString() })
    return { id, ...updates }
  }
}

// 删除会话
export const deleteConversation = async (id) => {
  try {
    await fetchWithTimeout(buildApiUrl(`/conversations/${id}`), { method: 'DELETE' })
    // 同时从本地存储删除
    deleteConversationFromLocal(id)
    return true
  } catch (error) {
    console.error('删除会话失败:', error)
    // 从本地存储删除
    deleteConversationFromLocal(id)
    return true
  }
}

// 获取会话消息
export const getConversationMessages = async (conversationId) => {
  try {
    const response = await fetchWithTimeout(buildApiUrl(`/conversations/${conversationId}/messages`), { method: 'GET' })
    const data = await handleApiResponse(response)
    return data
  } catch (error) {
    console.error('获取会话消息失败:', error)
    // 返回本地存储的消息作为fallback
    return getLocalMessages(conversationId)
  }
}

// 保存消息到会话
export const saveMessageToConversation = async (conversationId, message) => {
  try {
    const response = await fetchWithTimeout(buildApiUrl(`/conversations/${conversationId}/messages`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...message,
        createdAt: new Date().toISOString()
      })
    })
    const savedMessage = await handleApiResponse(response)
    // 同时保存到本地存储
    saveMessageToLocal(conversationId, savedMessage)
    return savedMessage
  } catch (error) {
    console.error('保存消息失败:', error)
    // 保存到本地存储
    const messageWithId = { ...message, id: generateId(), createdAt: new Date().toISOString() }
    saveMessageToLocal(conversationId, messageWithId)
    return messageWithId
  }
}

// 本地存储相关函数
const STORAGE_KEY = 'ai-code-helper-conversations'
const MESSAGES_STORAGE_KEY = 'ai-code-helper-messages'

const generateId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

const getLocalConversations = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('读取本地会话失败:', error)
    return []
  }
}

const saveConversationToLocal = (conversation) => {
  try {
    const conversations = getLocalConversations()
    const existingIndex = conversations.findIndex(c => c.id === conversation.id)
    if (existingIndex >= 0) {
      conversations[existingIndex] = conversation
    } else {
      conversations.unshift(conversation)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  } catch (error) {
    console.error('保存会话到本地失败:', error)
  }
}

const updateConversationInLocal = (conversation) => {
  try {
    const conversations = getLocalConversations()
    const index = conversations.findIndex(c => c.id === conversation.id)
    if (index >= 0) {
      conversations[index] = { ...conversations[index], ...conversation }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
    }
  } catch (error) {
    console.error('更新本地会话失败:', error)
  }
}

const deleteConversationFromLocal = (id) => {
  try {
    const conversations = getLocalConversations()
    const filtered = conversations.filter(c => c.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    
    // 同时删除相关消息
    const messages = getLocalMessages(id)
    if (messages.length > 0) {
      const allMessages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '{}')
      delete allMessages[id]
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMessages))
    }
  } catch (error) {
    console.error('从本地删除会话失败:', error)
  }
}

const getLocalMessages = (conversationId) => {
  try {
    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY)
    const allMessages = stored ? JSON.parse(stored) : {}
    return allMessages[conversationId] || []
  } catch (error) {
    console.error('读取本地消息失败:', error)
    return []
  }
}

const saveMessageToLocal = (conversationId, message) => {
  try {
    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '{}')
    if (!allMessages[conversationId]) {
      allMessages[conversationId] = []
    }
    allMessages[conversationId].push(message)
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMessages))
    
    // 更新会话的最后消息和时间
    const conversations = getLocalConversations()
    const conversation = conversations.find(c => c.id === conversationId)
    if (conversation) {
      conversation.lastMessage = message.text || message.content || ''
      conversation.updatedAt = message.createdAt
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
    }
  } catch (error) {
    console.error('保存消息到本地失败:', error)
  }
}
