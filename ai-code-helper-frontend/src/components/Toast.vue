<template>
  <Transition name="toast" appear>
    <div v-if="visible" class="toast" :class="[`toast-${type}`, { 'toast-closable': closable }]">
      <div class="toast-icon">
        <svg v-if="type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
        </svg>
        <svg v-else-if="type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM17 15.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59Z" fill="currentColor"/>
        </svg>
        <svg v-else-if="type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="currentColor"/>
        </svg>
        <svg v-else-if="type === 'info'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="currentColor"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="currentColor"/>
        </svg>
      </div>
      <div class="toast-content">
        <div class="toast-title" v-if="title">{{ title }}</div>
        <div class="toast-message">{{ message }}</div>
      </div>
      <button v-if="closable" @click="close" class="toast-close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 3000
  },
  closable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

// 自动关闭
let timer = null

const startTimer = () => {
  if (props.duration > 0) {
    timer = setTimeout(() => {
      close()
    }, props.duration)
  }
}

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

onMounted(() => {
  if (props.visible) {
    startTimer()
  }
})

onUnmounted(() => {
  clearTimer()
})

// 监听visible变化
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    startTimer()
  } else {
    clearTimer()
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  z-index: 1000;
  border-left: 4px solid;
}

.toast-success {
  border-left-color: #4caf50;
}

.toast-error {
  border-left-color: #f44336;
}

.toast-warning {
  border-left-color: #ff9800;
}

.toast-info {
  border-left-color: #2196f3;
}

.toast-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.toast-success .toast-icon {
  color: #4caf50;
}

.toast-error .toast-icon {
  color: #f44336;
}

.toast-warning .toast-icon {
  color: #ff9800;
}

.toast-info .toast-icon {
  color: #2196f3;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.toast-message {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #999;
  transition: all 0.2s;
  margin-top: -2px;
}

.toast-close:hover {
  background: #f5f5f5;
  color: #666;
}

/* 动画效果 */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toast {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
  
  .toast-enter-from {
    transform: translateY(-100%);
  }
  
  .toast-leave-to {
    transform: translateY(-100%);
  }
}
</style>
