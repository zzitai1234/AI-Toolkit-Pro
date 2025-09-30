<template>
  <div class="toast-manager">
    <TransitionGroup name="toast-list" tag="div">
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :visible="true"
        :type="toast.type"
        :title="toast.title"
        :message="toast.message"
        :duration="toast.duration"
        :closable="toast.closable"
        @close="removeToast(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import Toast from './Toast.vue'

const toasts = ref([])
let nextId = 1

// 添加Toast
const addToast = (options) => {
  const toast = {
    id: nextId++,
    type: 'info',
    title: '',
    message: '',
    duration: 3000,
    closable: true,
    ...options
  }
  
  toasts.value.push(toast)
  
  // 如果设置了自动关闭，在指定时间后移除
  if (toast.duration > 0) {
    setTimeout(() => {
      removeToast(toast.id)
    }, toast.duration)
  }
  
  return toast.id
}

// 移除Toast
const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

// 清空所有Toast
const clearAll = () => {
  toasts.value = []
}

// 便捷方法
const success = (message, options = {}) => {
  return addToast({ ...options, type: 'success', message })
}

const error = (message, options = {}) => {
  return addToast({ ...options, type: 'error', message })
}

const warning = (message, options = {}) => {
  return addToast({ ...options, type: 'warning', message })
}

const info = (message, options = {}) => {
  return addToast({ ...options, type: 'info', message })
}

// 暴露方法给全局使用
window.$toast = {
  add: addToast,
  remove: removeToast,
  clear: clearAll,
  success,
  error,
  warning,
  info
}

// 组件内部方法
const handleRemoveToast = (id) => {
  removeToast(id)
}
</script>

<style scoped>
.toast-manager {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
}

.toast-manager > div {
  pointer-events: auto;
}

/* Toast列表动画 */
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-list-move {
  transition: transform 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toast-list-enter-from {
    transform: translateY(-100%);
  }
  
  .toast-list-leave-to {
    transform: translateY(-100%);
  }
}
</style>
