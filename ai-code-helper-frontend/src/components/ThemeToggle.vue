<template>
  <div class="theme-toggle">
    <button 
      @click="toggleTheme" 
      class="theme-button"
      :title="getCurrentTheme().name"
    >
      <svg v-if="currentTheme === 'light'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5M17.6859 17.69L18.5 18.5M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    
    <!-- 主题选择下拉菜单 -->
    <div v-if="showDropdown" class="theme-dropdown" @click.stop>
      <div class="theme-dropdown-header">
        <span>选择主题</span>
        <button @click="showDropdown = false" class="close-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="theme-options">
        <button 
          v-for="(theme, key) in themes" 
          :key="key"
          @click="selectTheme(key)"
          class="theme-option"
          :class="{ active: currentTheme === key }"
        >
          <div class="theme-preview" :class="`theme-${key}`">
            <div class="preview-bg"></div>
            <div class="preview-content">
              <div class="preview-line"></div>
              <div class="preview-line short"></div>
              <div class="preview-line"></div>
            </div>
          </div>
          <span class="theme-name">{{ theme.name }}</span>
          <svg v-if="currentTheme === key" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme.js'

const { currentTheme, themes, toggleTheme, setTheme, getCurrentTheme } = useTheme()

const showDropdown = ref(false)

const selectTheme = (themeName) => {
  setTheme(themeName)
  showDropdown.value = false
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (!event.target.closest('.theme-toggle')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.theme-toggle {
  position: relative;
  display: inline-block;
}

.theme-button {
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

.theme-button:hover {
  background: rgba(107, 114, 128, 0.1);
  border-color: #6b7280;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.2);
}

.theme-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(107, 114, 128, 0.2);
}

.theme-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  min-width: 200px;
  z-index: 1000;
  animation: slideDown 0.2s ease;
}

.theme-dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.theme-options {
  padding: 8px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.theme-option:hover {
  background: #f9fafb;
}

.theme-option.active {
  background: #e3f2fd;
  color: #1976d2;
}

.theme-preview {
  width: 32px;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  border: 1px solid #e5e7eb;
}

.theme-preview.theme-light {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
}

.theme-preview.theme-dark {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #424242 100%);
}

.preview-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.3;
}

.preview-content {
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 2px;
  padding: 2px;
}

.theme-preview.theme-dark .preview-content {
  background: rgba(30, 30, 30, 0.9);
}

.preview-line {
  height: 1px;
  background: #333;
  margin: 1px 0;
  border-radius: 0.5px;
}

.theme-preview.theme-dark .preview-line {
  background: #fff;
}

.preview-line.short {
  width: 60%;
}

.theme-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-dropdown {
    right: -10px;
    left: -10px;
    min-width: auto;
  }
}
</style>
