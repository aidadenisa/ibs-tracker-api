import { User as UserRepo } from '@/modules/users/repo/user'
import { User, UserRecord } from '@/modules/users/domain/user'
import { Result } from '@/utils/utils'
import { InternalError } from '@/utils/errors'

export type CreateUserInput = {
  email: string
  firstName: string
  lastName: string
  hasMenstruationSupport: boolean
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
      error: {
        message: `error while querying user by id ${userId}: ${err.message}`,
      } satisfies InternalError,
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
      error: {
        message: `error while querying user by email ${email}: ${err.message}`,
      } satisfies InternalError,
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
    return {
      data: null,
      error: {
        message: `error while creating new user with email ${input.email}: ${error.message}`,
      } satisfies InternalError,
    }
  }
}
export default {
  findUserById,
  findUserByEmail,
  createUser,
}
