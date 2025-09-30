import { ref, onMounted, onUnmounted } from 'vue'
import { createChatSSE, generateChatId, log } from '../api/index.js'
import { 
  getConversations, 
  createConversation, 
  updateConversation, 
  deleteConversation,
  getConversationMessages,
  saveMessageToConversation
} from '../api/conversations.js'

export function useChat() {
  // 响应式数据
  const messages = ref([])
  const isLoading = ref(false)
  const chatId = ref('')
  const conversations = ref([])
  const currentConversationId = ref(null)
  const connectionState = ref({
    isConnected: false,
    isReconnecting: false,
    lastError: null
  })
  let sseManager = null

  // 添加消息
  const addMessage = (text, type, isTyping = false) => {
    const message = {
      id: Date.now() + Math.random(),
      text,
      type,
      timestamp: Date.now(),
      isTyping
    }
    messages.value.push(message)
    return message
  }

  // 发送消息
  const sendMessage = async (userMessage) => {
    if (!userMessage.trim() || isLoading.value) return
    
    // 确保有当前会话
    if (!currentConversationId.value) {
      await createNewConversation()
    }
    
    // 添加用户消息
    const userMsg = addMessage(userMessage, 'user')
    
    // 保存用户消息到会话
    await saveMessageToConversation(currentConversationId.value, {
      text: userMessage,
      type: 'user',
      timestamp: userMsg.timestamp
    })
    
    // 开始加载
    isLoading.value = true
    
    try {
      // 创建AI消息占位符
      const aiMessageId = Date.now() + Math.random()
      const aiMessage = {
        id: aiMessageId,
        text: '',
        type: 'ai',
        timestamp: Date.now(),
        isTyping: true
      }
      messages.value.push(aiMessage)
      
      // 创建SSE连接
      sseManager = createChatSSE(chatId.value, userMessage, {
        onOpen: () => {
          log('info', 'SSE连接已建立')
          connectionState.value.isConnected = true
          connectionState.value.isReconnecting = false
        },
        
        onMessage: (data) => {
          const aiMessageIndex = messages.value.findIndex(msg => msg.id === aiMessageId)
          if (aiMessageIndex !== -1) {
            messages.value[aiMessageIndex].text += data
            messages.value[aiMessageIndex].isTyping = false
          }
        },
        
        onError: (error, errorMessage) => {
          const aiMessageIndex = messages.value.findIndex(msg => msg.id === aiMessageId)
          if (aiMessageIndex !== -1) {
            if (!messages.value[aiMessageIndex].text.trim()) {
              messages.value[aiMessageIndex].text = errorMessage
            }
            messages.value[aiMessageIndex].isTyping = false
          }
          connectionState.value.isConnected = false
          connectionState.value.lastError = error
          isLoading.value = false
        },
        
        onReconnecting: (attempt, maxAttempts) => {
          connectionState.value.isReconnecting = true
          // 显示重连提示
          if (window.$toast) {
            window.$toast.info(`正在重连... (${attempt}/${maxAttempts})`)
          }
        },
        
        onMaxReconnectAttempts: () => {
          connectionState.value.isReconnecting = false
          if (window.$toast) {
            window.$toast.error('连接失败，已达到最大重连次数')
          }
        },
        
        onEnd: async () => {
          const aiMessageIndex = messages.value.findIndex(msg => msg.id === aiMessageId)
          if (aiMessageIndex !== -1) {
            messages.value[aiMessageIndex].isTyping = false
            
            // 保存AI消息到会话
            const aiMsg = messages.value[aiMessageIndex]
            await saveMessageToConversation(currentConversationId.value, {
              text: aiMsg.text,
              type: 'ai',
              timestamp: aiMsg.timestamp
            })
          }
          connectionState.value.isConnected = false
          isLoading.value = false
        },
        
        onTimeout: () => {
          const aiMessageIndex = messages.value.findIndex(msg => msg.id === aiMessageId)
          if (aiMessageIndex !== -1 && !messages.value[aiMessageIndex].text.trim()) {
            messages.value[aiMessageIndex].text = '抱歉，连接超时，请检查网络连接或稍后重试。'
            messages.value[aiMessageIndex].isTyping = false
          }
          connectionState.value.isConnected = false
          isLoading.value = false
        }
      })
      
    } catch (error) {
      log('error', '发送消息失败', error)
      addMessage('抱歉，发送消息时出现错误，请稍后重试。', 'ai')
      isLoading.value = false
    }
  }

  // 初始化聊天
  const initializeChat = () => {
    chatId.value = generateChatId()
    
    // 简洁的欢迎消息
    const welcomeMessage = `欢迎使用AI编程小助手

我可以帮你解答技术问题、制定学习计划、优化简历等。

有什么可以帮您？`
    
    addMessage(welcomeMessage, 'ai')
  }

  // 创建新会话
  const createNewConversation = async () => {
    try {
      const conversation = await createConversation('新对话')
      currentConversationId.value = conversation.id
      chatId.value = generateChatId()
      
      // 清空消息
      messages.value = []
      
      // 添加欢迎消息
      const welcomeMessage = `欢迎使用AI编程小助手

我可以帮你解答技术问题、制定学习计划、优化简历等。

有什么可以帮您？`
      
      addMessage(welcomeMessage, 'ai')
      
      // 刷新会话列表
      await loadConversations()
      
      log('info', '创建新会话', { conversationId: conversation.id })
      return conversation
    } catch (error) {
      log('error', '创建会话失败', error)
      throw error
    }
  }

  // 开始新对话
  const startNewChat = async () => {
    // 清理当前连接
    cleanup()
    
    // 重置状态
    isLoading.value = false
    
    // 创建新会话
    await createNewConversation()
  }

  // 加载会话列表
  const loadConversations = async () => {
    try {
      const data = await getConversations()
      conversations.value = data
    } catch (error) {
      log('error', '加载会话列表失败', error)
    }
  }

  // 选择会话
  const selectConversation = async (conversationId) => {
    if (conversationId === currentConversationId.value) return
    
    try {
      // 清理当前连接
      cleanup()
      
      // 加载会话消息
      const conversationMessages = await getConversationMessages(conversationId)
      
      // 转换消息格式
      messages.value = conversationMessages.map(msg => ({
        id: msg.id || Date.now() + Math.random(),
        text: msg.text || msg.content || '',
        type: msg.type || msg.role || 'user',
        timestamp: msg.timestamp || msg.createdAt || Date.now(),
        isTyping: false
      }))
      
      // 设置当前会话
      currentConversationId.value = conversationId
      chatId.value = generateChatId()
      
      // 重置状态
      isLoading.value = false
      
      log('info', '选择会话', { conversationId })
    } catch (error) {
      log('error', '选择会话失败', error)
    }
  }

  // 重命名会话
  const renameConversation = async (conversationId, newTitle) => {
    try {
      await updateConversation(conversationId, { title: newTitle })
      await loadConversations()
      log('info', '重命名会话', { conversationId, newTitle })
    } catch (error) {
      log('error', '重命名会话失败', error)
    }
  }

  // 删除会话
  const deleteConversationById = async (conversationId) => {
    try {
      await deleteConversation(conversationId)
      
      // 如果删除的是当前会话，创建新会话
      if (conversationId === currentConversationId.value) {
        await createNewConversation()
      }
      
      await loadConversations()
      log('info', '删除会话', { conversationId })
    } catch (error) {
      log('error', '删除会话失败', error)
    }
  }

  // 清理资源
  const cleanup = () => {
    if (sseManager) {
      sseManager.close()
      sseManager = null
    }
    connectionState.value.isConnected = false
    connectionState.value.isReconnecting = false
  }

  // 强制重连
  const forceReconnect = () => {
    if (sseManager) {
      sseManager.forceReconnect()
    }
  }

  // 获取连接状态
  const getConnectionState = () => {
    return connectionState.value
  }

  // 组件挂载时初始化
  onMounted(async () => {
    await loadConversations()
    initializeChat()
  })

  // 组件卸载时清理
  onUnmounted(() => {
    cleanup()
  })

  return {
    messages,
    isLoading,
    chatId,
    conversations,
    currentConversationId,
    connectionState,
    sendMessage,
    addMessage,
    initializeChat,
    startNewChat,
    createNewConversation,
    loadConversations,
    selectConversation,
    renameConversation,
    deleteConversationById,
    forceReconnect,
    getConnectionState,
    cleanup
  }
}
