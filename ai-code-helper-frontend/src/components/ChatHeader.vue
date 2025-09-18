
<template>
  <div class="chat-header">
    <h1>AI编程小助手</h1>
    <div class="chat-id">聊天室ID: {{ chatId }}</div>
  </div>
</template>

<script setup>
defineProps({
  chatId: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.chat-header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  color: #333333;
  padding: 0.75rem 1.5rem;
  text-align: center;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 10;
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
  }
  
  .chat-header h1 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .chat-header h1 {
    font-size: 1.25rem;
  }
}
</style>
