import bcrypt from 'bcrypt';
import User from '../models/user.js';
import logger from '../utils/logger.js';

const getUserById = (userId) => {
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

const updateUserRecordIds = async (_userId, _recordId) => {
  const result = await User.findByIdAndUpdate(_userId, {
    '$push': { 'records' : _recordId.toString()},
  }, {
    'new': true, 
  });
  return result;
}

export default {
  createNewUser,
  getUserById,
  updateUserRecordIds,
}