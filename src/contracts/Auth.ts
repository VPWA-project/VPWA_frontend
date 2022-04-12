export interface ApiToken {
    type: 'bearer'
    token: string
    expires_at?: string
    expires_in?: number
  }
  
  export interface RegisterData {
    email: string
    password: string
    passwordConfirmation: string
    firstname: string
    lastname: string
    nickname: string
  }
  
  export interface LoginCredentials {
    email: string
    password: string
  }
  
  export interface User {
    id: string
    email: string
    firstname: string
    lastname: string
    nickname: string
    created_at: string,
    updated_at: string
  }

  export interface ValidationError {
    rule: string
    field: string
    message: string
  }

  export interface ValidationErrorResponse {
    errors: ValidationError[]
  }