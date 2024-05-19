// src/types/express/index.d.ts

import { User } from '@/modules/users/domain/user'

// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
      context?: Context
    }
  }
}

class Context {
  userId?: string
}
