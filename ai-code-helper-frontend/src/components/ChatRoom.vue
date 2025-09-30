<template>
  <div class="chat-room">
    <Sidebar 
      :conversations="conversations"
      :current-chat-id="currentConversationId"
      @new-chat="handleNewChat"
      @select-conversation="handleSelectConversation"
      @rename-conversation="handleRenameConversation"
      @delete-conversation="handleDeleteConversation"
    />
    <div class="chat-main">
      <ChatHeader 
        :chat-id="chatId" 
        :connection-state="connectionState"
        @new-chat="handleNewChat" 
        @open-settings="handleOpenSettings"
        @reconnect="handleReconnect"
      />
      <ChatMessages 
        :messages="messages" 
        :is-loading="isLoading"
        ref="chatMessagesRef" 
        @edit-message="handleEditMessage"
        @delete-message="handleDeleteMessage"
        @regenerate-message="handleRegenerateMessage"
        @continue-message="handleContinueMessage"
        @export-message="handleExportMessage"
      />
      <ChatInput 
        :is-loading="isLoading"
        :editing-message="editingMessage"
        @send="handleSendMessage"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        @cancel-edit="handleCancelEdit"
      />
    </div>
    
    <!-- 模型设置面板 -->
    <ModelSettings 
      :visible="showSettings"
      :model-settings="modelSettings"
      @close="handleCloseSettings"
      @save="handleSaveSettings"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import ChatHeader from './ChatHeader.vue'
import ChatMessages from './ChatMessages.vue'
import ChatInput from './ChatInput.vue'
import ModelSettings from './ModelSettings.vue'
import { useChat } from '../composables/useChat.js'

// 使用聊天功能组合式函数
const { 
  messages, 
  isLoading, 
  chatId, 
  conversations,
  currentConversationId,
  connectionState,
  sendMessage, 
  startNewChat,
  selectConversation,
  renameConversation,
  deleteConversationById,
  forceReconnect
} = useChat()

// 编辑消息状态
const editingMessage = ref(null)

// 设置面板状态
const showSettings = ref(false)
const modelSettings = ref({
  model: 'qwen-plus',
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 2000,
  systemPrompt: ''
})

// 处理发送消息
const handleSendMessage = (message) => {
  sendMessage(message)
}

// 处理新对话
const handleNewChat = () => {
  startNewChat()
}

// 处理选择会话
const handleSelectConversation = (conversationId) => {
  selectConversation(conversationId)
}

// 处理重命名会话
const handleRenameConversation = (conversationId, newTitle) => {
  renameConversation(conversationId, newTitle)
}

// 处理删除会话
const handleDeleteConversation = (conversationId) => {
  deleteConversationById(conversationId)
}

// 处理编辑消息
const handleEditMessage = (message) => {
  editingMessage.value = message
}

// 处理取消编辑
const handleCancelEdit = () => {
  editingMessage.value = null
}

// 处理输入框焦点事件（暂时为空，可根据需要扩展）
const handleInputFocus = () => {
  // 可以在这里添加焦点处理逻辑
}

// 处理输入框失焦事件（暂时为空，可根据需要扩展）
const handleInputBlur = () => {
  // 可以在这里添加失焦处理逻辑
}

// 处理打开设置
const handleOpenSettings = () => {
  showSettings.value = true
}

// 处理关闭设置
const handleCloseSettings = () => {
  showSettings.value = false
}

// 处理保存设置
const handleSaveSettings = (settings) => {
  modelSettings.value = { ...settings }
  // 这里可以将设置保存到本地存储或发送到后端
  localStorage.setItem('ai-code-helper-settings', JSON.stringify(settings))
  showSettings.value = false
}

// 处理重连
const handleReconnect = () => {
  forceReconnect()
}

// 处理删除消息
const handleDeleteMessage = (message) => {
  const index = messages.value.findIndex(msg => msg.id === message.id)
  if (index !== -1) {
    messages.value.splice(index, 1)
  }
}

// 处理重新生成消息
const handleRegenerateMessage = (message) => {
  if (isLoading.value) return
  
  // 找到用户消息（重新生成需要用户输入）
  const userMessageIndex = messages.value.findIndex(msg => 
    msg.type === 'user' && messages.value.indexOf(msg) < messages.value.indexOf(message)
  )
  
  if (userMessageIndex !== -1) {
    const userMessage = messages.value[userMessageIndex]
    // 删除当前AI消息
    const aiMessageIndex = messages.value.findIndex(msg => msg.id === message.id)
      if (aiMessageIndex !== -1) {
      messages.value.splice(aiMessageIndex, 1)
    }
    // 重新发送用户消息
    sendMessage(userMessage.text)
  }
}

// 处理继续生成消息
const handleContinueMessage = (message) => {
  if (isLoading.value) return
  
  // 这里可以实现继续生成逻辑
  // 使用Toast提示
  if (window.$toast) {
    window.$toast.info('继续生成功能正在开发中...')
  }
}

// 处理导出消息
const handleExportMessage = (message) => {
  try {
    const content = `# AI编程小助手 - 对话记录\n\n**时间：** ${new Date(message.timestamp).toLocaleString()}\n\n**消息内容：**\n\n${message.text}`
    
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-chat-${new Date().getTime()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    // 使用Toast提示
    if (window.$toast) {
      window.$toast.success('消息已导出')
    }
  } catch (error) {
    console.error('导出失败:', error)
    if (window.$toast) {
      window.$toast.error('导出失败，请重试')
    }
  }
}
</script>

<style scoped>
.chat-room {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.chat-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  position: relative;
}

.chat-room::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}

.chat-main > * {
  position: relative;
  z-index: 1;
}
</style>

