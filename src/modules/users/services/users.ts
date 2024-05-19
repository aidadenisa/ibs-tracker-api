import * as bcrypt from 'bcrypt'
import repo from '@/modules/users/repo/repository'
import { User } from '@/modules/users/domain/user'
import recordService from '@/modules/records/services/records'
import { ErrorUnion, Result } from '@/utils/utils'
import { addMinutes } from 'date-fns'
import { InternalError } from '@/utils/errors'

const LOGIN_WINDOW = 2 // minutes
export type NewUserInput = {
  email: string
  firstName: string
  lastName: string
  hasMenstruationSupport: boolean
}
type UserAuthData = {
  id: string
  email: string
  hash: string
  accessEndDate: Date
}

const getUserById = async (userId: string, populate: boolean = false): Promise<Result<User>> => {
  const { data: user, error } = await repo.findUserById(userId)
  if (error) {
    return { data: null, error }
  }

  if (user && populate) {
    const { data: records, error: err } = await recordService.listRecordsByUserId(userId)
    if (err) {
      return { data: null, error: err }
    }
    if (records && records.length) {
      user.records = records
    }
  }
  return { data: user, error: null }
}

const getUserByEmail = async (email: string): Promise<Result<User>> => {
  const { data: user, error } = await repo.findUserByEmail(email)
  if (error) {
    return { data: null, error }
  }

  return { data: user, error: null }
}

const getUserAuthDataByEmail = async (email: string): Promise<Result<UserAuthData>> => {
  const { data: user, error } = await repo.findUserAuthDataByEmail(email)
  if (error) {
    return { data: null, error }
  }

  return { data: user, error: null }
}

const hashPassword = async (pass) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(pass, saltRounds)
  return passwordHash
}

const createNewUser = async (input: NewUserInput, otp: string): Promise<Result<User>> => {
  const hashedOTP = await hashPassword(otp)
  const accessEndDate = addMinutes(new Date(), LOGIN_WINDOW)

  const { data, error } = await repo.createUser({
    ...input,
    hash: hashedOTP,
    accessEndDate: accessEndDate,
  })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

const updateUserRecordIds = async (userId: string): Promise<ErrorUnion> => {
  const { data: records, error } = await recordService.listRecordsByUserId(userId, false)
  if (error) {
    return error
  }

  // TODO: MAKE A DICTIONARY AND UPDATE ONLY THE SPECIFIC DATE
  return repo.updateUserRecords(
    userId,
    records.map((r) => r.id)
  )
}

const updateUserOTP = async (userId: string, otp: string): Promise<InternalError> => {
  const hash = await hashPassword(otp)
  const accessEndDate = addMinutes(new Date(), LOGIN_WINDOW)

  return repo.updateUserAuthData(userId, hash, accessEndDate)
}

const resetUserOTP = async (userId: string): Promise<InternalError> => {
  return repo.updateUserAuthData(userId, null, null)
}

export default {
  LOGIN_WINDOW,
  createNewUser,
  getUserById,
  getUserByEmail,
  getUserAuthDataByEmail,
  updateUserRecordIds,
  updateUserOTP,
  resetUserOTP,
}
