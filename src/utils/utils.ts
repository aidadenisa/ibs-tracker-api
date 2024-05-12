import { InternalError } from '@/utils/errors'

const parseBoolean = (value: string) => {
  switch (value) {
    case 'true':
      return true
    case 'false':
    default:
      return false
  }
}

type Result<T> = {
  data: T
  error: InternalError
}

export { parseBoolean }
export type { Result }
