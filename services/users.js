import bcrypt from 'bcrypt';
import User from '../models/user.js';
import logger from '../utils/logger.js';
import recordService from './records.js';

const getUserById = (userId, populate) => {
  if(populate && populate.toLowerCase() === 'true') {
    return User.findById(userId).populate('records');
  }
  return User.findById(userId);
}

const createNewUser = async (user) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(user.pass, saltRounds);

  const newUser = new User({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    hash: passwordHash,
    hasMenstruationSupport: user.hasMenstruationSupport,
    registeredOn: new Date(),
    records: [],
  });

  return newUser.save();
}

const addRecordIdsToUser = async (_userId, recordIds) => {
  const result = await User.findByIdAndUpdate(_userId, {
    '$push': { 'records' : { $each: [...recordIds] } },
  }, {
    'new': true, 
  });
  return result;
}

const updateUserRecordIds = async (_userId) => {
  // const records = await Record.find({ user: _userId });
  const records = await recordService.listRecordsByUserId(_userId.toString(), false);
  
  await User.findByIdAndUpdate(_userId, {
    'records': records.map(record => record._id.toString())
  })
}

const updateUser = (_userId, updatedProperties) => {
  // properties that are not part of the schema will be ignored
  return User.findByIdAndUpdate(_userId, updatedProperties, { new: true } );
}

export default {
  createNewUser,
  getUserById,
  addRecordIdsToUser,
  updateUserRecordIds,
  updateUser,
}