import { ValidationError } from '@/utils/errors'

type ValidationResult<T> = {
  data: T
  error: ValidationError
}

export type { ValidationResult }
