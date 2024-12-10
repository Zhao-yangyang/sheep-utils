import { AppError, ErrorType } from "@/types/error"

const ERROR_MESSAGES: Record<ErrorType, string> = {
  FILE_SIZE_EXCEEDED: "文件大小超出限制",
  INVALID_FILE_TYPE: "不支持的文件格式",
  PROCESS_FAILED: "处理失败",
  NETWORK_ERROR: "网络错误",
  UNKNOWN_ERROR: "未知错误"
}

const ERROR_SUGGESTIONS: Record<ErrorType, string> = {
  FILE_SIZE_EXCEEDED: "请选择小于10MB的文件",
  INVALID_FILE_TYPE: "请选择PNG、JPEG或WebP格式的图片",
  PROCESS_FAILED: "请重试，如果问题持续存在请刷新页面",
  NETWORK_ERROR: "请检查网络连接后重试",
  UNKNOWN_ERROR: "请刷新页面后重试"
}

export function createError(
  type: ErrorType,
  details?: string
): AppError {
  return {
    type,
    message: ERROR_MESSAGES[type],
    details,
    suggestion: ERROR_SUGGESTIONS[type]
  }
}

export function handleError(error: unknown): AppError {
  if ((error as AppError).type) {
    return error as AppError
  }

  if (error instanceof Error) {
    return createError("UNKNOWN_ERROR", error.message)
  }

  return createError("UNKNOWN_ERROR")
} 