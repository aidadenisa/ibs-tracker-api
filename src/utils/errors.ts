// TODO: Check what to use: type, interface, class

enum ErrorType {
  ErrInternal,
  ErrValidation,
  ErrAPI,
  ErrNotFound,
}
type ErrorConfig = {
  message?: string
  type?: ErrorType
  statusCode?: number
}
class BaseError {
  message: string
  type: ErrorType
  statusCode?: number

  constructor(config: ErrorConfig) {
    this.message = config.message || ''
    this.type = config.type || ErrorType.ErrInternal
    this.statusCode = config.statusCode
  }
}

class ApiFailureError extends BaseError {
  constructor(config: ErrorConfig) {
    super(config)
    this.type = ErrorType.ErrAPI
  }
}

class ValidationError extends BaseError {
  constructor(config: ErrorConfig) {
    super(config)
    this.type = ErrorType.ErrValidation
  }
}
class NotFoundError extends BaseError {
  constructor(config: ErrorConfig) {
    super(config)
    this.type = ErrorType.ErrNotFound
  }
}

class InternalError extends BaseError {
  constructor(config: ErrorConfig) {
    super(config)
    this.type = ErrorType.ErrInternal
  }
}

const API_SERVER_ERROR: ApiFailureError = new ApiFailureError({
  message: 'Internal Server Error',
  statusCode: 500,
})

export { ApiFailureError, ValidationError, InternalError, NotFoundError }
export { ErrorType, API_SERVER_ERROR }
