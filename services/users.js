import User from '../models/user.js';
import logger from '../utils/logger.js';

const createNewUser = async (user) => {

  const newUser = new User({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    hash: user.hash,
    hasMenstruationSupport: user.hasMenstruationSupport,
    registeredOn: new Date(),
  });

  const result = await newUser.save();
  logger.info(result);
  return result;
}

export default {
  createNewUser
}