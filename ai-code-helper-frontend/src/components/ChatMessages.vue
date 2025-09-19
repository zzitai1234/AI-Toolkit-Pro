<template>
  <div class="chat-messages" ref="messagesContainer">
    <!-- 复制成功提示 -->
    <div v-if="showCopyToast" class="copy-toast">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
      </svg>
      已复制到剪贴板
    </div>
    
    <div 
      v-for="message in messages" 
      :key="message.id"
      :class="['message', message.type]"
    >
      <div class="message-avatar" v-if="message.type === 'ai'">
        <div class="ai-avatar">🤖</div>
      </div>
      <div class="message-content">
        <div class="message-text" v-html="formatMessageText(message.text)">
        </div>
        <div class="message-footer">
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          <!-- 用户消息的操作按钮 -->
          <div class="message-actions" v-if="message.type === 'user'">
            <button class="action-button copy-button" @click="copyMessage(message.text)" title="复制">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
              </svg>
            </button>
            <button class="action-button edit-button" @click="editMessage(message)" title="编辑">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="message-avatar" v-if="message.type === 'user'">
        <div class="user-avatar">👤</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { formatTime } from '../api/index.js'

// 配置marked选项
marked.setOptions({
  breaks: true, // 支持换行
  gfm: true, // 支持GitHub风格的Markdown
  sanitize: false, // 允许HTML标签
  smartLists: true, // 智能列表
  smartypants: true, // 智能标点符号
  highlight: function(code, lang) {
    try {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value
      } else {
        return hljs.highlightAuto(code).value
      }
    } catch (err) {
      console.error('代码高亮错误:', err)
      return code
    }
  }
})

const props = defineProps({
  messages: {
    type: Array,
    required: true
  }
})

const messagesContainer = ref(null)
const showCopyToast = ref(false)

const emit = defineEmits(['edit-message'])

// formatTime函数已从API模块导入

// 格式化消息文本，支持Markdown样式
const formatMessageText = (text) => {
  if (!text) return ''
  
  try {
    // 使用marked解析Markdown
    const html = marked.parse(text)
    return html
  } catch (error) {
    console.error('Markdown解析错误:', error)
    // 如果Markdown解析失败，回退到简单的HTML转义
    return text.replace(/\n/g, '<br>')
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 复制消息
const copyMessage = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // 显示复制成功提示
    showCopyToast.value = true
    setTimeout(() => {
      showCopyToast.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
    // 降级方案：使用传统的复制方法
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    // 显示复制成功提示
    showCopyToast.value = true
    setTimeout(() => {
      showCopyToast.value = false
    }, 2000)
  }
}

// 编辑消息
const editMessage = (message) => {
  emit('edit-message', message)
}

// 监听消息变化，自动滚动到底部
watch(() => props.messages, () => {
  scrollToBottom()
}, { deep: true })

// 暴露方法给父组件
defineExpose({
  scrollToBottom
})
</script>

<style scoped>
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.25rem 6rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  z-index: 5;
}

.message {
  display: flex;
  align-items: flex-start;
  max-width: 85%;
  animation: messageSlideIn 0.3s ease-out;
  gap: 0.625rem;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  align-self: flex-end;
}

.message.ai {
  align-self: flex-start;
}

.message-avatar {
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.ai-avatar, .user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.ai-avatar {
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  color: white;
}

.user-avatar {
  background: linear-gradient(135deg, #81c784, #66bb6a);
  color: white;
}

.message-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.875rem 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex: 1;
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
}

.message.user .message-text {
  color: white;
}

.message.ai .message-content {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
}

.message.user .message-content::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid #764ba2;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.message.ai .message-content::after {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-right: 8px solid rgba(255, 255, 255, 0.95);
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.message-text {
  margin-bottom: 0.375rem;
  line-height: 1.6;
  word-wrap: break-word;
  font-size: 0.95rem;
  color: #333333;
}

/* AI回答的Markdown样式 */
.message.ai .message-text {
  color: #333333;
}

/* 标题样式 */
.message.ai .message-text h1 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1976d2;
  margin: 1.5rem 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #e3f2fd;
}

.message.ai .message-text h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1976d2;
  margin: 1.25rem 0 0.75rem 0;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid #e3f2fd;
}

.message.ai .message-text h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1565c0;
  margin: 1rem 0 0.5rem 0;
}

.message.ai .message-text h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1565c0;
  margin: 0.75rem 0 0.25rem 0;
}

.message.ai .message-text h5,
.message.ai .message-text h6 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1565c0;
  margin: 0.5rem 0 0.25rem 0;
}

/* 段落样式 */
.message.ai .message-text p {
  margin: 0.75rem 0;
  line-height: 1.7;
}

/* 列表样式 */
.message.ai .message-text ul,
.message.ai .message-text ol {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.message.ai .message-text li {
  margin: 0.25rem 0;
  line-height: 1.6;
}

.message.ai .message-text ul li {
  list-style-type: disc;
}

.message.ai .message-text ol li {
  list-style-type: decimal;
}

/* 代码样式 */
.message.ai .message-text code {
  background: #f5f5f5;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', 'Monaco', monospace;
  font-size: 0.9rem;
  color: #d32f2f;
  border: 1px solid #e0e0e0;
}

.message.ai .message-text pre {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e0e0e0;
  margin: 1rem 0;
  overflow-x: auto;
  position: relative;
}

.message.ai .message-text pre code {
  background: none;
  padding: 0;
  border: none;
  color: #2c3e50;
  font-size: 0.9rem;
  font-family: 'Courier New', 'Monaco', 'Consolas', monospace;
}

/* 代码块语言标签 */
.message.ai .message-text pre::before {
  content: attr(data-lang);
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  background: #1976d2;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

/* 引用样式 */
.message.ai .message-text blockquote {
  border-left: 4px solid #1976d2;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #666;
  font-style: italic;
  background: rgba(25, 118, 210, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 0 0.25rem 0.25rem 0;
}

/* 链接样式 */
.message.ai .message-text a {
  color: #1976d2;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-bottom 0.3s ease;
}

.message.ai .message-text a:hover {
  border-bottom: 1px solid #1976d2;
}

/* 强调样式 */
.message.ai .message-text strong {
  font-weight: 600;
  color: #1976d2;
}

.message.ai .message-text em {
  font-style: italic;
  color: #1565c0;
}

/* 分割线样式 */
.message.ai .message-text hr {
  border: none;
  height: 2px;
  background: linear-gradient(to right, transparent, #e3f2fd, transparent);
  margin: 1.5rem 0;
}

/* 表格样式 */
.message.ai .message-text table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.message.ai .message-text th,
.message.ai .message-text td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.message.ai .message-text th {
  background: #f5f5f5;
  font-weight: 600;
  color: #1976d2;
}

.message.ai .message-text tr:hover {
  background: rgba(25, 118, 210, 0.05);
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  gap: 0.5rem;
}

.message-time {
  font-size: 0.75rem;
  color: #888888;
  font-weight: 400;
  opacity: 0.8;
}

.message.user .message-time {
  color: rgba(255, 255, 255, 0.8);
}

.message-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.message:hover .message-actions {
  opacity: 1;
}

.action-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.375rem;
  padding: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
  transform: translateY(-1px);
}

.action-button:active {
  transform: translateY(0);
}

.copy-button:hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: rgba(76, 175, 80, 0.4);
}

.edit-button:hover {
  background: rgba(33, 150, 243, 0.2);
  border-color: rgba(33, 150, 243, 0.4);
}

/* 复制提示样式 */
.copy-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  z-index: 1000;
  animation: toastSlideIn 0.3s ease-out;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-messages {
    padding: 1rem;
    gap: 1rem;
  }
  
  .message {
    max-width: 85%;
  }
  
  .message-content {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 480px) {
  .message {
    max-width: 90%;
  }
  
  .message-content {
    padding: 0.5rem 0.75rem;
  }
  
  .message-text {
    font-size: 0.9rem;
  }
}
</style>
