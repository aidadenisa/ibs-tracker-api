import * as bcrypt from 'bcrypt'
import { User as UserRepo } from '@/modules/users/repo/user'
import repo from '@/modules/users/repo/repository'
import { User } from '@/modules/users/domain/user'
import recordService from '@/modules/records/services/records'
import logger from '@/utils/logger'
import { Result } from '@/utils/utils'
import { addMinutes } from 'date-fns'

const LOGIN_WINDOW = 2 // minutes
export type NewUserInput = {
  email: string
  firstName: string
  lastName: string
  hasMenstruationSupport: boolean
}

const getUserById = async (userId: string, populate: boolean): Promise<Result<User>> => {
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

const addRecordIdsToUser = async (_userId, recordIds) => {
  const result = await UserRepo.findByIdAndUpdate(
    _userId,
    {
      $push: { records: { $each: [...recordIds] } },
    },
    {
      new: true,
    }
  )
  return result
}

const updateUserRecordIds = async (_userId) => {
  // const records = await Record.find({ user: _userId });
  const { data: records, error } = await recordService.listRecordsByUserId(_userId.toString(), false)
  if (error) {
    // TODO: return error
    logger.error(error.message)
    return
  }

  // TODO: MAKE A DICTIONARY AND UPDATE ONLY THE SPECIFIC DATE
  await UserRepo.findByIdAndUpdate(_userId, {
    records: records.map((record) => record.id.toString()),
  })
}

const updateUser = (_userId, updatedProperties) => {
  if (updatedProperties['hash']) {
    delete updatedProperties['hash']
  }
  // properties that are not part of the schema will be ignored
  return UserRepo.findByIdAndUpdate(_userId, updatedProperties, { new: true })
}

const updateUserOTP = async (_userId, otp) => {
  const hash = await hashPassword(otp)
  return UserRepo.findByIdAndUpdate(
    _userId,
    {
      hash,
      accessEndDate: addMinutes(new Date(), LOGIN_WINDOW),
    },
    { new: true }
  )
}

const resetUserOTP = async (_userId) => {
  return UserRepo.findByIdAndUpdate(
    _userId,
    {
      hash: null,
      accessEndDate: null,
    },
    { new: true }
  )
}

export default {
  LOGIN_WINDOW,
  createNewUser,
  getUserById,
  getUserByEmail,
  addRecordIdsToUser,
  updateUserRecordIds,
  updateUser,
  updateUserOTP,
  resetUserOTP,
}
