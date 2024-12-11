export type ErrorType = 
  | "FILE_SIZE_EXCEEDED"
  | "INVALID_FILE_TYPE"
  | "PROCESS_FAILED"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  suggestion: string;
}

export interface ErrorResponse {
  error: AppError;
} 