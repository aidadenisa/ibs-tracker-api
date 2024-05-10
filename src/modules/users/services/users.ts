import * as bcrypt from 'bcrypt'
import User from '@/modules/users/repo/user'
import recordService from '@/modules/records/services/records'
import { addMinutes } from 'date-fns'

const LOGIN_WINDOW = 2 // minutes

const getUserById = (userId, populate) => {
  if (populate && populate.toLowerCase() === 'true') {
    return User.findById(userId).populate('records')
  }
  return User.findById(userId)
}

const hashPassword = async (pass) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(pass, saltRounds)
  return passwordHash
}

const createNewUser = async (user) => {
  const passwordHash = await hashPassword(user.pass)

  const newUser = new User({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    hash: passwordHash,
    hasMenstruationSupport: user.hasMenstruationSupport,
    registeredOn: new Date(),
    records: [],
    accessEndDate: addMinutes(new Date(), LOGIN_WINDOW),
  })

  return newUser.save()
}

const addRecordIdsToUser = async (_userId, recordIds) => {
  const result = await User.findByIdAndUpdate(
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
  const records = await recordService.listRecordsByUserId(
    _userId.toString(),
    false
  )

  // TODO: MAKE A DICTIONARY AND UPDATE ONLY THE SPECIFIC DATE
  await User.findByIdAndUpdate(_userId, {
    records: records.map((record) => record._id.toString()),
  })
}

const updateUser = (_userId, updatedProperties) => {
  if (updatedProperties['hash']) {
    delete updatedProperties['hash']
  }
  // properties that are not part of the schema will be ignored
  return User.findByIdAndUpdate(_userId, updatedProperties, { new: true })
}

const updateUserOTP = async (_userId, otp) => {
  const hash = await hashPassword(otp)
  return User.findByIdAndUpdate(
    _userId,
    {
      hash,
      accessEndDate: addMinutes(new Date(), LOGIN_WINDOW),
    },
    { new: true }
  )
}

const resetUserOTP = async (_userId) => {
  return User.findByIdAndUpdate(
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
  addRecordIdsToUser,
  updateUserRecordIds,
  updateUser,
  updateUserOTP,
  resetUserOTP,
}
