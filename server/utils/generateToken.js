import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });
  res.setHeader('Authorization', `Bearer ${token}`);
  return token;
};

export default generateTokenAndSetCookie;
