<template>
  <div class="chat-room">
    <ChatHeader :chat-id="chatId" @new-chat="handleNewChat" />
    <ChatMessages :messages="messages" ref="chatMessagesRef" @edit-message="handleEditMessage" />
    <ChatInput 
      :is-loading="isLoading"
      :editing-message="editingMessage"
      @send="handleSendMessage"
      @focus="handleInputFocus"
      @blur="handleInputBlur"
      @cancel-edit="handleCancelEdit"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChatHeader from './ChatHeader.vue'
import ChatMessages from './ChatMessages.vue'
import ChatInput from './ChatInput.vue'
import { useChat } from '../composables/useChat.js'

// 使用聊天功能组合式函数
const { messages, isLoading, chatId, sendMessage, startNewChat } = useChat()

// 编辑消息状态
const editingMessage = ref(null)

// 处理发送消息
const handleSendMessage = (message) => {
  sendMessage(message)
}

// 处理新对话
const handleNewChat = () => {
  startNewChat()
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
</script>

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
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
}
</style>

