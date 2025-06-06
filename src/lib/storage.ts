import { safeJsonStringify, safeJsonParse } from './json-utils';

// 新建文件保存常用参数
export interface ProcessSettings {
  format: string
  quality: number
  width: number
  height: number
  maintainAspectRatio: boolean
}

export function saveSettings(settings: ProcessSettings) {
  try {
    const jsonString = safeJsonStringify(settings);
    localStorage.setItem('process-settings', jsonString);
  } catch (error) {
    console.warn('Failed to save settings:', error);
  }
}

export function loadSettings(): ProcessSettings | null {
  try {
    const saved = localStorage.getItem('process-settings');
    const parsed = safeJsonParse<ProcessSettings>(saved);
    return parsed;
  } catch (error) {
    console.warn('Failed to load saved settings:', error);
    // 清除无效的数据
    localStorage.removeItem('process-settings');
    return null;
  }
} 