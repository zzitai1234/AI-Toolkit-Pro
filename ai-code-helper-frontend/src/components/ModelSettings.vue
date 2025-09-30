<template>
  <div v-if="visible" class="settings-overlay" @click.self="closeSettings">
    <div class="settings-panel">
      <div class="settings-header">
        <h3>模型设置</h3>
        <button @click="closeSettings" class="close-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div class="settings-content">
        <!-- 模型选择 -->
        <div class="setting-group">
          <label class="setting-label">模型</label>
          <select v-model="settings.model" class="setting-input">
            <option value="qwen-plus">Qwen-Plus</option>
            <option value="qwen-turbo">Qwen-Turbo</option>
            <option value="qwen-max">Qwen-Max</option>
          </select>
        </div>

        <!-- 温度设置 -->
        <div class="setting-group">
          <label class="setting-label">
            温度 (Temperature)
            <span class="setting-value">{{ settings.temperature }}</span>
          </label>
          <input 
            v-model.number="settings.temperature" 
            type="range" 
            min="0" 
            max="2" 
            step="0.1" 
            class="setting-slider"
          />
          <div class="setting-description">
            控制回答的随机性。较低的值使回答更确定，较高的值使回答更有创意。
          </div>
        </div>

        <!-- Top P 设置 -->
        <div class="setting-group">
          <label class="setting-label">
            Top P
            <span class="setting-value">{{ settings.topP }}</span>
          </label>
          <input 
            v-model.number="settings.topP" 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            class="setting-slider"
          />
          <div class="setting-description">
            控制回答的多样性。较低的值使回答更集中，较高的值使回答更多样。
          </div>
        </div>

        <!-- 最大Token数 -->
        <div class="setting-group">
          <label class="setting-label">
            最大Token数
            <span class="setting-value">{{ settings.maxTokens }}</span>
          </label>
          <input 
            v-model.number="settings.maxTokens" 
            type="range" 
            min="100" 
            max="4000" 
            step="100" 
            class="setting-slider"
          />
          <div class="setting-description">
            控制回答的最大长度。Token数越多，回答可能越长。
          </div>
        </div>

        <!-- 系统提示词 -->
        <div class="setting-group">
          <label class="setting-label">系统提示词</label>
          <textarea 
            v-model="settings.systemPrompt" 
            class="setting-textarea"
            placeholder="输入系统提示词，用于指导AI的行为..."
            rows="4"
          ></textarea>
          <div class="setting-description">
            系统提示词会影响AI的回答风格和行为。
          </div>
        </div>

        <!-- 预设模板 -->
        <div class="setting-group">
          <label class="setting-label">预设模板</label>
          <div class="template-buttons">
            <button 
              v-for="template in templates" 
              :key="template.id"
              @click="applyTemplate(template)"
              class="template-btn"
              :class="{ active: settings.systemPrompt === template.prompt }"
            >
              {{ template.name }}
            </button>
          </div>
        </div>
      </div>

      <div class="settings-footer">
        <button @click="resetSettings" class="reset-btn">重置</button>
        <button @click="saveSettings" class="save-btn">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  modelSettings: {
    type: Object,
    default: () => ({
      model: 'qwen-plus',
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 2000,
      systemPrompt: ''
    })
  }
})

const emit = defineEmits(['close', 'save'])

const settings = ref({ ...props.modelSettings })

// 预设模板
const templates = ref([
  {
    id: 'default',
    name: '默认',
    prompt: ''
  },
  {
    id: 'coding',
    name: '编程助手',
    prompt: '你是一个专业的编程助手，擅长各种编程语言和技术栈。请用简洁明了的语言回答问题，并提供实用的代码示例。'
  },
  {
    id: 'creative',
    name: '创意写作',
    prompt: '你是一个富有创意的写作助手，擅长各种文体和创作风格。请用生动有趣的语言回答问题，激发用户的想象力。'
  },
  {
    id: 'academic',
    name: '学术研究',
    prompt: '你是一个严谨的学术研究助手，擅长分析和解释复杂的概念。请用准确、客观的语言回答问题，并提供可靠的参考资料。'
  },
  {
    id: 'casual',
    name: '轻松聊天',
    prompt: '你是一个友好的聊天伙伴，喜欢用轻松幽默的语言与人交流。请用温暖、亲切的语气回答问题。'
  }
])

// 监听外部设置变化
watch(() => props.modelSettings, (newSettings) => {
  settings.value = { ...newSettings }
}, { deep: true })

const closeSettings = () => {
  emit('close')
}

const saveSettings = () => {
  emit('save', { ...settings.value })
  closeSettings()
}

const resetSettings = () => {
  settings.value = {
    model: 'qwen-plus',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2000,
    systemPrompt: ''
  }
}

const applyTemplate = (template) => {
  settings.value.systemPrompt = template.prompt
}
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.settings-panel {
  background: white;
  border-radius: 12px;
  width: 500px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideIn 0.3s ease;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.settings-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: #6b7280;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.settings-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.setting-group {
  margin-bottom: 24px;
}

.setting-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  font-size: 14px;
}

.setting-value {
  font-weight: 600;
  color: #059669;
  font-size: 13px;
}

.setting-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: all 0.2s;
}

.setting-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.setting-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.setting-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.setting-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.setting-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s;
}

.setting-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.setting-description {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
  line-height: 1.4;
}

.template-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.template-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.template-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.settings-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

.reset-btn, .save-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn {
  background: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.reset-btn:hover {
  background: #f9fafb;
  color: #374151;
}

.save-btn {
  background: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
}

.save-btn:hover {
  background: #2563eb;
  border-color: #2563eb;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 滚动条样式 */
.settings-content::-webkit-scrollbar {
  width: 4px;
}

.settings-content::-webkit-scrollbar-track {
  background: transparent;
}

.settings-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.settings-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
