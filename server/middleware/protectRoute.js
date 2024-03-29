import jwt from 'jsonwebtoken';
import User from '../models/UserSchema.js';

const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ error: 'Unauthorized - No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return res
          .status(401)
          .json({ error: 'Unauthorized - No token provided' });
      }
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      req.user = user;

      next();
    } catch (error) {
      return res
        .status(401)
        .json({ error: 'Unauthorized - No token provided' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default protectRoute;
