import { User as UserRepo } from '@/modules/users/repo/user'
import { User, UserRecord } from '@/modules/users/domain/user'
import { Result } from '@/utils/utils'
import { InternalError } from '@/utils/errors'

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

export default {
  findUserById,
}
