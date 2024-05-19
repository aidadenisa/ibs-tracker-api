import { Record } from '@/modules/records/domain/record'
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  hasMenstruationSupport: boolean
  records?: UserRecord[]
}

export type UserRecord = Partial<Record>
