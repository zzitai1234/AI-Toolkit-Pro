
<template>
  <div class="chat-header">
    <button class="new-chat-button" @click="handleNewChat" title="新对话">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="header-content">
      <h1>AI编程小助手</h1>
      <div class="header-info">
        <div class="chat-id">聊天室ID: {{ chatId }}</div>
        <div class="connection-status" :class="getConnectionStatusClass()">
          <div class="status-indicator"></div>
          <span class="status-text">{{ getConnectionStatusText() }}</span>
          <button 
            v-if="!connectionState.isConnected && !connectionState.isReconnecting" 
            @click="handleReconnect" 
            class="reconnect-btn"
            title="重新连接"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="header-actions">
      <ThemeToggle />
      <button class="settings-button" @click="handleOpenSettings" title="设置">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19.4 15C19.2669 15.3016 19.2272 15.6472 19.286 15.9796C19.3448 16.3121 19.4995 16.6246 19.73 16.87L19.79 16.93C19.903 17.0437 19.9851 17.1862 20.0273 17.3433C20.0695 17.5005 20.0705 17.6672 20.03 17.825L19.99 17.985C19.9513 18.1426 19.8729 18.2881 19.7626 18.4072C19.6523 18.5263 19.5139 18.6154 19.36 18.665L19.2 18.705C19.0426 18.7437 18.8774 18.7447 18.7198 18.708C18.5622 18.6713 18.4167 18.5979 18.2976 18.4944C18.1785 18.3909 18.0894 18.2605 18.04 18.115L19.4 15ZM14.4 5.00001C14.2669 5.30162 14.2272 5.64716 14.286 5.97961C14.3448 6.31205 14.4995 6.62456 14.73 6.87001L14.79 6.93001C14.903 7.04369 14.9851 7.1862 15.0273 7.3433C15.0695 7.5005 15.0705 7.6672 15.03 7.825L14.99 7.98501C14.9513 8.14264 14.8729 8.2881 14.7626 8.40721C14.6523 8.52632 14.5139 8.6154 14.36 8.665L14.2 8.70501C14.0426 8.74374 13.8774 8.74474 13.7198 8.708C13.5622 8.67127 13.4167 8.59794 13.2976 8.49442C13.1785 8.3909 13.0894 8.26054 13.04 8.115L14.4 5.00001ZM9.6 5.00001C9.46694 5.30162 9.42721 5.64716 9.486 5.97961C9.54479 6.31205 9.69952 6.62456 9.93 6.87001L9.99 6.93001C10.103 7.04369 10.1851 7.1862 10.2273 7.3433C10.2695 7.5005 10.2705 7.6672 10.23 7.825L10.19 7.98501C10.1513 8.14264 10.0729 8.2881 9.9626 8.40721C9.85232 8.52632 9.71394 8.6154 9.56 8.665L9.4 8.70501C9.24264 8.74374 9.07738 8.74474 8.91981 8.708C8.76224 8.67127 8.61675 8.59794 8.49764 8.49442C8.37853 8.3909 8.28944 8.26054 8.24 8.115L9.6 5.00001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import ThemeToggle from './ThemeToggle.vue'

const props = defineProps({
  chatId: {
    type: String,
    required: true
  },
  connectionState: {
    type: Object,
    default: () => ({
      isConnected: false,
      isReconnecting: false,
      lastError: null
    })
  }
})

const emit = defineEmits(['new-chat', 'open-settings', 'reconnect'])

const handleNewChat = () => {
  emit('new-chat')
}

const handleOpenSettings = () => {
  emit('open-settings')
}

const handleReconnect = () => {
  emit('reconnect')
}

const getConnectionStatusClass = () => {
  if (props.connectionState.isReconnecting) return 'reconnecting'
  if (props.connectionState.isConnected) return 'connected'
  return 'disconnected'
}

const getConnectionStatusText = () => {
  if (props.connectionState.isReconnecting) return '重连中...'
  if (props.connectionState.isConnected) return '已连接'
  return '未连接'
}
</script>

<style scoped>
.chat-header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  color: #333333;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.new-chat-button {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(25, 118, 210, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1976d2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.new-chat-button:hover {
  background: rgba(25, 118, 210, 0.1);
  border-color: #1976d2;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.new-chat-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.2);
}

.settings-button {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(107, 114, 128, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.settings-button:hover {
  background: rgba(107, 114, 128, 0.1);
  border-color: #6b7280;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.2);
}

.settings-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(107, 114, 128, 0.2);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.connection-status.connected {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.connection-status.reconnecting {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.connection-status.disconnected {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

.connection-status.connected .status-indicator {
  animation: none;
}

.connection-status.reconnecting .status-indicator {
  animation: spin 1s linear infinite;
}

.status-text {
  font-weight: 500;
}

.reconnect-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  color: currentColor;
  transition: all 0.2s;
  opacity: 0.7;
}

.reconnect-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  opacity: 1;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.header-content {
  flex: 1;
  text-align: center;
}

.chat-header h1 {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 500;
  color: #333333;
}

.chat-id {
  font-size: 0.75rem;
  color: #666666;
  font-weight: 400;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-header {
    padding: 1rem;
    gap: 0.75rem;
  }
  
  .chat-header h1 {
    font-size: 1.5rem;
  }
  
  .new-chat-button {
    min-width: 36px;
    height: 36px;
    padding: 0.4rem;
  }
  
  .new-chat-button svg {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .chat-header h1 {
    font-size: 1.25rem;
  }
  
  .new-chat-button {
    min-width: 32px;
    height: 32px;
    padding: 0.3rem;
  }
  
  .new-chat-button svg {
    width: 16px;
    height: 16px;
  }
}
</style>
