// TODO: Check what to use: type, interface, class
class BaseError {
  message: string
}

class ApiFailureError extends BaseError {
  statusCode: number
}

class ValidationError extends BaseError {}

class InternalError extends BaseError {}
class NotFoundError extends BaseError {}

const API_SERVER_ERROR: ApiFailureError = {
  message: 'Internal Server Error',
  statusCode: 500,
}

export { BaseError, ApiFailureError, ValidationError, InternalError, NotFoundError, API_SERVER_ERROR }
