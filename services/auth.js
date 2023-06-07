import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET } from '../utils/config.js';

const login = async (email, pass) => {
  const user = await User.findOne({ email });
  if(!user) throw new Error('User not found.');

  const correctPass = await bcrypt.compare(pass, user.hash);
  if(!correctPass) {
    throw new Error('Invalid email or password.');
  }

  const tokenData = {
    email: user.email,
    id: user.id
  }
  const token = jwt.sign(tokenData, SECRET);

  return { token };
}

export default {
  login,
}