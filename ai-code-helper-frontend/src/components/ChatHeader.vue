
<template>
  <div class="chat-header">
    <button class="new-chat-button" @click="handleNewChat" title="新对话">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="header-content">
      <h1>AI编程小助手</h1>
      <div class="chat-id">聊天室ID: {{ chatId }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  chatId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['new-chat'])

const handleNewChat = () => {
  emit('new-chat')
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
