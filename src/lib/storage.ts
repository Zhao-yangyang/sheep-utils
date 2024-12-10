// 新建文件保存常用参数
export interface ProcessSettings {
  format: string
  quality: number
  width: number
  height: number
  maintainAspectRatio: boolean
}

export function saveSettings(settings: ProcessSettings) {
  localStorage.setItem('process-settings', JSON.stringify(settings))
}

export function loadSettings(): ProcessSettings | null {
  const saved = localStorage.getItem('process-settings')
  return saved ? JSON.parse(saved) : null
} 