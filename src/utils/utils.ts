import { InternalError, NotFoundError, ValidationError } from '@/utils/errors'

const parseBoolean = (value: string) => {
  switch (value) {
    case 'true':
      return true
    case 'false':
    default:
      return false
  }
}

type ErrorUnion = InternalError | ValidationError | NotFoundError

type Result<T> = {
  data: T
  error: ErrorUnion
}

export { parseBoolean }
export type { Result, ErrorUnion }
