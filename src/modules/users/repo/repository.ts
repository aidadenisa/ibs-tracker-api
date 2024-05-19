import { User as UserRepo } from '@/modules/users/repo/user'
import { User, UserRecord } from '@/modules/users/domain/user'
import { Result } from '@/utils/utils'
import { InternalError, ValidationError } from '@/utils/errors'

export type CreateUserInput = {
  email: string
  firstName: string
  lastName: string
  hasMenstruationSupport: boolean
  hash: string
  accessEndDate: Date
}

type UserAuthData = {
  id: string
  email: string
  hash: string
  accessEndDate: Date
}

const findUserById = async (userId: string): Promise<Result<User>> => {
  try {
    const queryResult = await UserRepo.findById(userId)
    return {
      data: {
        id: queryResult.id?.toString(),
        firstName: queryResult.firstName,
        lastName: queryResult.lastName,
        email: queryResult.email,
        hasMenstruationSupport: queryResult.hasMenstruationSupport,
        records: queryResult.records.map(
          (r) =>
            ({
              id: r.id.toString(),
            } satisfies UserRecord)
        ),
      } satisfies User,
      error: null,
    } satisfies Result<User>
  } catch (err) {
    return {
      data: null,
      error: new InternalError({
        message: `error while querying user by id ${userId}: ${err.message}`,
      }),
    }
  }
}
const findUserByEmail = async (email: string): Promise<Result<User>> => {
  try {
    const queryResult = await UserRepo.findOne({ email })
    return {
      data: {
        id: queryResult.id?.toString(),
        firstName: queryResult.firstName,
        lastName: queryResult.lastName,
        email: queryResult.email,
        hasMenstruationSupport: queryResult.hasMenstruationSupport,
        records: queryResult.records.map(
          (r) =>
            ({
              id: r.id.toString(),
            } satisfies UserRecord)
        ),
      } satisfies User,
      error: null,
    } satisfies Result<User>
  } catch (err) {
    return {
      data: null,
      error: new InternalError({
        message: `error while querying user by email ${email}: ${err.message}`,
      }),
    }
  }
}

const createUser = async (input: CreateUserInput): Promise<Result<User>> => {
  const newUser = new UserRepo({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    hash: input.hash,
    hasMenstruationSupport: input.hasMenstruationSupport,
    registeredOn: new Date(),
    records: [],
    accessEndDate: input.accessEndDate,
  })
  try {
    const queryResult = await newUser.save()
    return {
      data: {
        id: queryResult.id,
        firstName: queryResult.firstName,
        lastName: queryResult.lastName,
        email: queryResult.email,
        hasMenstruationSupport: queryResult.hasMenstruationSupport,
        records: [],
      } satisfies User,
      error: null,
    }
  } catch (error) {
    if (error.message && error.message.match(/expected `email` to be unique/)) {
      return {
        data: null,
        error: new ValidationError({
          message: `error while creating new user with email ${input.email}: the email address is already in use.`,
        }),
      }
    }

    return {
      data: null,
      error: new InternalError({
        message: `error while creating new user with email ${input.email}: ${error.message}`,
      }),
    }
  }
}

const findUserAuthDataByEmail = async (email: string): Promise<Result<UserAuthData>> => {
  try {
    const queryResult = await UserRepo.findOne({ email })
    return {
      data: {
        id: queryResult.id,
        email: queryResult.email,
        hash: queryResult.hash,
        accessEndDate: queryResult.accessEndDate,
      } satisfies UserAuthData,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: new InternalError({
        message: `error while querying user auth data by email ${email}: ${err.message}`,
      }),
    }
  }
}

const updateUserRecords = async (userId: string, recordIds: string[]): Promise<InternalError> => {
  try {
    await UserRepo.findByIdAndUpdate(userId, {
      $push: { records: { $each: [...recordIds] } },
    })
    return null
  } catch (error) {
    return new InternalError({
      message: `error while updating user with id ${userId}: ${error.message}`,
    })
  }
}

const updateUserAuthData = async (userId: string, hash: string, accessEndDate: Date): Promise<InternalError> => {
  try {
    await UserRepo.findByIdAndUpdate(userId, {
      hash,
      accessEndDate,
    })
  } catch (error) {
    return new InternalError({
      message: `error while updating user auth data for user id ${userId}: ${error.message}`,
    })
  }
}

export default {
  findUserById,
  findUserByEmail,
  findUserAuthDataByEmail,
  createUser,
  updateUserRecords,
  updateUserAuthData,
}
