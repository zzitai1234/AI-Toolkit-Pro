<template>
  <!-- 初始状态输入框 -->
  <div 
    v-if="!inputFocused && !inputMessage" 
    class="chat-input initial-input"
    :class="{ 'input-focused': inputFocused }"
  >
    <div class="input-container">
      <textarea 
        v-model="inputMessage"
        @focus="handleInputFocus"
        @keydown="handleKeyDown"
        @input="handleInput"
        :disabled="isLoading"
        placeholder="请输入您的问题..."
        class="message-input"
        ref="initialInput"
        rows="1"
      ></textarea>
      <button 
        v-if="editingMessage"
        @click="handleCancelEdit"
        class="cancel-button"
      >
        取消
      </button>
      <button 
        @click="handleSend"
        :disabled="!inputMessage.trim() || isLoading"
        class="send-button"
      >
        {{ isLoading ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
  
  <!-- 固定底部输入框 -->
  <div 
    v-if="inputFocused || inputMessage"
    class="chat-input fixed-input"
    :class="{ 'input-focused': inputFocused }"
  >
    <div class="input-container">
      <textarea 
        v-model="inputMessage"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        @keydown="handleKeyDown"
        @input="handleInput"
        :disabled="isLoading"
        placeholder="请输入您的问题..."
        class="message-input"
        ref="fixedInput"
        rows="1"
      ></textarea>
      <button 
        v-if="editingMessage"
        @click="handleCancelEdit"
        class="cancel-button"
      >
        取消
      </button>
      <button 
        @click="handleSend"
        :disabled="!inputMessage.trim() || isLoading"
        class="send-button"
      >
        {{ isLoading ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  editingMessage: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['send', 'focus', 'blur', 'cancel-edit'])

const inputMessage = ref('')
const inputFocused = ref(false)
const initialInput = ref(null)
const fixedInput = ref(null)

// 监听编辑消息
watch(() => props.editingMessage, (newMessage) => {
  if (newMessage) {
    inputMessage.value = newMessage.text
    inputFocused.value = true
    // 延迟聚焦到输入框
    nextTick(() => {
      if (fixedInput.value) {
        fixedInput.value.focus()
        // 选中所有文本
        fixedInput.value.select()
      }
    })
  }
}, { immediate: true })

// 处理输入框焦点
const handleInputFocus = () => {
  inputFocused.value = true
  emit('focus')
  // 延迟聚焦到固定输入框
  nextTick(() => {
    if (fixedInput.value) {
      fixedInput.value.focus()
    }
  })
}

// 处理输入框失焦
const handleInputBlur = () => {
  emit('blur')
  // 如果输入框为空，延迟失焦
  setTimeout(() => {
    if (!inputMessage.value.trim()) {
      inputFocused.value = false
    }
  }, 200)
}

// 处理键盘事件
const handleKeyDown = (event) => {
  // Enter 键发送消息
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
  // Shift+Enter 换行（允许默认行为）
  else if (event.key === 'Enter' && event.shiftKey) {
    // 允许默认的换行行为，不做任何处理
  }
}

// 处理输入事件，自动调整高度
const handleInput = (event) => {
  const textarea = event.target
  // 重置高度以获取正确的scrollHeight
  textarea.style.height = 'auto'
  // 设置高度为scrollHeight，但限制最大高度
  const maxHeight = 120 // 最大高度120px
  const newHeight = Math.min(textarea.scrollHeight, maxHeight)
  textarea.style.height = newHeight + 'px'
}

// 处理发送
const handleSend = () => {
  if (!inputMessage.value.trim() || props.isLoading) return
  
  const message = inputMessage.value.trim()
  inputMessage.value = ''
  
  // 重置textarea高度
  if (initialInput.value) {
    initialInput.value.style.height = 'auto'
  }
  if (fixedInput.value) {
    fixedInput.value.style.height = 'auto'
  }
  
  // 如果是编辑模式，发送后取消编辑状态
  if (props.editingMessage) {
    emit('cancel-edit')
  }
  
  emit('send', message)
}

// 处理取消编辑
const handleCancelEdit = () => {
  inputMessage.value = ''
  emit('cancel-edit')
}

// 暴露方法给父组件
defineExpose({
  clearInput: () => {
    inputMessage.value = ''
    inputFocused.value = false
  }
})
</script>

<style scoped>
.chat-input {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 10;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 初始状态输入框 */
.chat-input.initial-input {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 3rem);
  max-width: 600px;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 固定底部输入框 */
.chat-input.fixed-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  border-radius: 0;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.05);
}

/* 输入框聚焦状态 */
.chat-input.input-focused {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.input-container {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.message-input {
  flex: 1;
  padding: 0.625rem 0.875rem;
  border: 1px solid rgba(25, 118, 210, 0.2);
  border-radius: 0.875rem;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  resize: none;
  min-height: 40px;
  max-height: 120px;
  line-height: 1.5;
  font-family: inherit;
  overflow-y: auto;
}

.message-input:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
  background: rgba(255, 255, 255, 1);
}

.message-input:disabled {
  background: rgba(245, 245, 245, 0.8);
  cursor: not-allowed;
  opacity: 0.6;
}

.send-button {
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  border: none;
  border-radius: 0.875rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.15);
  min-width: 70px;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
}

.send-button:active:not(:disabled) {
  transform: translateY(0);
}

.send-button:disabled {
  background: linear-gradient(135deg, #6c757d, #5a6268);
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
}

.cancel-button {
  padding: 0.625rem 1.25rem;
  background: rgba(255, 255, 255, 0.9);
  color: #666666;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.875rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  min-width: 70px;
}

.cancel-button:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cancel-button:active {
  transform: translateY(0);
}

/* textarea滚动条样式 */
.message-input::-webkit-scrollbar {
  width: 6px;
}

.message-input::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.message-input::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.message-input::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-input {
    padding: 1rem;
  }
  
  .chat-input.initial-input {
    width: calc(100% - 2rem);
    bottom: 1.5rem;
  }
  
  .input-container {
    gap: 0.5rem;
  }
  
  .message-input {
    padding: 0.75rem 1rem;
    min-height: 44px;
  }
  
  .send-button {
    padding: 0.75rem 1.5rem;
    min-width: 80px;
  }
}
</style>
