import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  //create JWT token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '10d',
  });

  //set JWT as HTTP only cookie
  // will be send every subsequent request
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
