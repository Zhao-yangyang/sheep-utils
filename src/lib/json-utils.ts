// 安全的JSON处理工具函数

/**
 * 安全地将对象转换为JSON字符串，过滤掉undefined值
 */
export function safeJsonStringify(obj: unknown): string {
  try {
    // 使用replacer函数过滤掉undefined值
    return JSON.stringify(obj, (key, value) => {
      if (value === undefined) {
        return null; // 将undefined转换为null
      }
      return value;
    }, 0);
  } catch (error) {
    console.warn('Failed to stringify object:', error);
    return '{}'; // 返回空对象作为fallback
  }
}

/**
 * 安全地解析JSON字符串
 */
export function safeJsonParse<T>(jsonString: string | null): T | null {
  try {
    if (!jsonString || jsonString === 'undefined' || jsonString.trim() === '') {
      return null;
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return null;
  }
}

/**
 * 验证对象是否可以安全地序列化为JSON
 */
export function isJsonSerializable(obj: unknown): boolean {
  try {
    JSON.stringify(obj);
    return true;
  } catch {
    return false;
  }
} 