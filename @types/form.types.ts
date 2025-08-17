import { CollectionStatus, Condition, MediaType } from "./collection.types";

export interface FieldError {
  message: string;
  type?: string;
}

export interface ApiError {
  code?: string;
  message: string;
  errors?: Record<string, FieldError>;
  statusCode?: number;
}

// Dados de formulário unificados
export interface CollectionFormData {
  description: string;
  status: CollectionStatus;
  price: string;
  hasBox: boolean;
  hasManual: boolean;
  condition: Condition;
  acceptsTrade: boolean;
  // Campos específicos de jogos
  progress?: string;
  rating?: string;
  review?: string;
  abandoned?: boolean;
  media?: MediaType;
}
