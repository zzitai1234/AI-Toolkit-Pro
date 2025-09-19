import { ref, onMounted, onUnmounted } from 'vue'
import { createChatSSE, generateChatId, log } from '../api/index.js'

export function useChat() {
  // 响应式数据
  const messages = ref([])
  const isLoading = ref(false)
  const chatId = ref('')
  let eventSource = null

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
    
    // 添加用户消息
    addMessage(userMessage, 'user')
    
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
      eventSource = createChatSSE(chatId.value, userMessage, {
        onOpen: () => {
          log('info', 'SSE连接已建立')
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
          isLoading.value = false
        },
        
        onEnd: () => {
          const aiMessageIndex = messages.value.findIndex(msg => msg.id === aiMessageId)
          if (aiMessageIndex !== -1) {
            messages.value[aiMessageIndex].isTyping = false
          }
          isLoading.value = false
        },
        
        onTimeout: () => {
          const aiMessageIndex = messages.value.findIndex(msg => msg.id === aiMessageId)
          if (aiMessageIndex !== -1 && !messages.value[aiMessageIndex].text.trim()) {
            messages.value[aiMessageIndex].text = '抱歉，连接超时，请检查网络连接或稍后重试。'
            messages.value[aiMessageIndex].isTyping = false
          }
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

  // 开始新对话
  const startNewChat = () => {
    // 清理当前连接
    cleanup()
    
    // 清空消息
    messages.value = []
    
    // 重置状态
    isLoading.value = false
    
    // 生成新的聊天ID
    chatId.value = generateChatId()
    
    // 添加新的欢迎消息
    const welcomeMessage = `欢迎使用AI编程小助手

我可以帮你解答技术问题、制定学习计划、优化简历等。

有什么可以帮您？`
    
    addMessage(welcomeMessage, 'ai')
    
    log('info', '开始新对话', { chatId: chatId.value })
  }

  // 清理资源
  const cleanup = () => {
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
  }

  // 组件挂载时初始化
  onMounted(() => {
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
    sendMessage,
    addMessage,
    initializeChat,
    startNewChat,
    cleanup
  }
}
