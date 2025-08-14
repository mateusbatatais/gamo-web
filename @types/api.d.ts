export interface ApiError {
  code?: string;
  message: string;
  errors?: Record<string, FieldError>;
  statusCode?: number;
}
