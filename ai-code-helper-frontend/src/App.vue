<script setup>
import ChatRoom from './components/ChatRoom.vue'
import ToastManager from './components/ToastManager.vue'
</script>

<template>
  <ChatRoom />
  <ToastManager />
</template>

<style>
:root {
  /* 默认浅色主题变量 */
  --color-primary: #2196f3;
  --color-secondary: #f5f5f5;
  --color-background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
  --color-surface: rgba(255, 255, 255, 0.9);
  --color-text: #333333;
  --color-textSecondary: #666666;
  --color-border: rgba(0, 0, 0, 0.1);
  --color-shadow: rgba(0, 0, 0, 0.1);
}

/* 深色主题 */
.theme-dark {
  --color-primary: #64b5f6;
  --color-secondary: #424242;
  --color-background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #424242 100%);
  --color-surface: rgba(30, 30, 30, 0.9);
  --color-text: #ffffff;
  --color-textSecondary: #b0b0b0;
  --color-border: rgba(255, 255, 255, 0.1);
  --color-shadow: rgba(0, 0, 0, 0.3);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--color-background);
  color: var(--color-text);
  transition: background 0.3s ease, color 0.3s ease;
}

#app {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-background);
  transition: background 0.3s ease;
}
</style>
