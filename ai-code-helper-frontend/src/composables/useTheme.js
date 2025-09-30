import { ref, watch, onMounted } from 'vue'

const THEME_KEY = 'ai-code-helper-theme'

// 主题配置
const themes = {
  light: {
    name: '浅色主题',
    class: 'theme-light',
    colors: {
      primary: '#2196f3',
      secondary: '#f5f5f5',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
      surface: 'rgba(255, 255, 255, 0.9)',
      text: '#333333',
      textSecondary: '#666666',
      border: 'rgba(0, 0, 0, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.1)'
    }
  },
  dark: {
    name: '深色主题',
    class: 'theme-dark',
    colors: {
      primary: '#64b5f6',
      secondary: '#424242',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #424242 100%)',
      surface: 'rgba(30, 30, 30, 0.9)',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: 'rgba(255, 255, 255, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.3)'
    }
  }
}

// 当前主题
const currentTheme = ref('light')

// 初始化主题
const initTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY)
  if (savedTheme && themes[savedTheme]) {
    currentTheme.value = savedTheme
  } else {
    // 检测系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    currentTheme.value = prefersDark ? 'dark' : 'light'
  }
  applyTheme()
}

// 应用主题
const applyTheme = () => {
  const theme = themes[currentTheme.value]
  if (!theme) return
  
  // 移除所有主题类
  document.documentElement.classList.remove(...Object.values(themes).map(t => t.class))
  
  // 添加当前主题类
  document.documentElement.classList.add(theme.class)
  
  // 设置CSS变量
  const root = document.documentElement
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })
  
  // 保存到本地存储
  localStorage.setItem(THEME_KEY, currentTheme.value)
}

// 切换主题
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
}

// 设置主题
const setTheme = (themeName) => {
  if (themes[themeName]) {
    currentTheme.value = themeName
  }
}

// 获取当前主题信息
const getCurrentTheme = () => {
  return themes[currentTheme.value]
}

// 获取所有主题
const getAllThemes = () => {
  return themes
}

// 监听主题变化
watch(currentTheme, () => {
  applyTheme()
})

// 组件挂载时初始化
onMounted(() => {
  initTheme()
})

export function useTheme() {
  return {
    currentTheme,
    themes,
    toggleTheme,
    setTheme,
    getCurrentTheme,
    getAllThemes,
    initTheme,
    applyTheme
  }
}
