<template>
  <div class="sidebar" :class="{ 'sidebar-collapsed': collapsed }">
    <!-- 侧边栏头部 -->
    <div class="sidebar-header">
      <button @click="toggleCollapse" class="collapse-btn" :title="collapsed ? '展开' : '收起'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div v-if="!collapsed" class="header-content">
        <h3>对话历史</h3>
        <button @click="createNewChat" class="new-chat-btn" title="新建对话">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 会话列表 -->
    <div v-if="!collapsed" class="conversations-list">
      <div 
        v-for="conversation in conversations" 
        :key="conversation.id"
        class="conversation-item"
        :class="{ 'active': conversation.id === currentChatId }"
        @click="selectConversation(conversation.id)"
      >
        <div class="conversation-content">
          <div class="conversation-title">{{ conversation.title }}</div>
          <div class="conversation-preview">{{ conversation.lastMessage }}</div>
          <div class="conversation-time">{{ formatTime(conversation.updatedAt) }}</div>
        </div>
        <div class="conversation-actions">
          <button 
            @click.stop="renameConversation(conversation.id)" 
            class="action-btn rename-btn"
            title="重命名"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
            </svg>
          </button>
          <button 
            @click.stop="deleteConversation(conversation.id)" 
            class="action-btn delete-btn"
            title="删除"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="conversations.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>还没有对话记录</p>
        <button @click="createNewChat" class="create-first-btn">开始新对话</button>
      </div>
    </div>

    <!-- 重命名对话框 -->
    <div v-if="renamingId" class="rename-dialog" @click.self="cancelRename">
      <div class="rename-content">
        <h4>重命名对话</h4>
        <input 
          v-model="newTitle" 
          @keyup.enter="confirmRename"
          @keyup.escape="cancelRename"
          ref="renameInput"
          class="rename-input"
          placeholder="输入新标题"
        />
        <div class="rename-actions">
          <button @click="cancelRename" class="cancel-btn">取消</button>
          <button @click="confirmRename" class="confirm-btn">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  conversations: {
    type: Array,
    default: () => []
  },
  currentChatId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['new-chat', 'select-conversation', 'rename-conversation', 'delete-conversation'])

const collapsed = ref(false)
const renamingId = ref(null)
const newTitle = ref('')

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

const createNewChat = () => {
  emit('new-chat')
}

const selectConversation = (id) => {
  emit('select-conversation', id)
}

const renameConversation = async (id) => {
  renamingId.value = id
  const conversation = props.conversations.find(c => c.id === id)
  newTitle.value = conversation?.title || ''
  await nextTick()
  const input = document.querySelector('.rename-input')
  if (input) {
    input.focus()
    input.select()
  }
}

const confirmRename = () => {
  if (newTitle.value.trim()) {
    emit('rename-conversation', renamingId.value, newTitle.value.trim())
  }
  cancelRename()
}

const cancelRename = () => {
  renamingId.value = null
  newTitle.value = ''
}

const deleteConversation = (id) => {
  if (confirm('确定要删除这个对话吗？')) {
    emit('delete-conversation', id)
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
  
  return date.toLocaleDateString()
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
}

.sidebar-collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 12px;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: #6c757d;
  transition: all 0.2s;
}

.collapse-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-content h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
}

.new-chat-btn {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.new-chat-btn:hover {
  background: #0056b3;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  group: hover;
}

.conversation-item:hover {
  background: #e9ecef;
}

.conversation-item.active {
  background: #e3f2fd;
  border: 1px solid #2196f3;
}

.conversation-content {
  flex: 1;
  min-width: 0;
}

.conversation-title {
  font-weight: 500;
  color: #212529;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-preview {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-time {
  font-size: 11px;
  color: #adb5bd;
}

.conversation-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.conversation-item:hover .conversation-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  color: #6c757d;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f8f9fa;
  color: #495057;
}

.delete-btn:hover {
  color: #dc3545;
  background: #f8d7da;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0 0 16px 0;
  font-size: 14px;
}

.create-first-btn {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.create-first-btn:hover {
  background: #0056b3;
}

.rename-dialog {
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
}

.rename-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 400px;
  max-width: 90vw;
}

.rename-content h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.rename-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
}

.rename-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.rename-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.cancel-btn, .confirm-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #5a6268;
}

.confirm-btn {
  background: #007bff;
  color: white;
}

.confirm-btn:hover {
  background: #0056b3;
}

/* 滚动条样式 */
.conversations-list::-webkit-scrollbar {
  width: 4px;
}

.conversations-list::-webkit-scrollbar-track {
  background: transparent;
}

.conversations-list::-webkit-scrollbar-thumb {
  background: #ced4da;
  border-radius: 2px;
}

.conversations-list::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}
</style>
