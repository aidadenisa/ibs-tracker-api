import jwt from 'jsonwebtoken';
import { SECRET } from '../utils/config.js';
import User from '../models/user.js';

const authorize = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  const token = bearerToken && bearerToken.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Missing Authorization Token.' });
  }

  const decoded = jwt.verify(token, SECRET);

  const user = await User.findById(decoded.userId);
  if (!user) {
    res.status(404).send({ error: 'User not found.' });
  }
  req.user = user;
  next();
}

export {
  authorize,
}

