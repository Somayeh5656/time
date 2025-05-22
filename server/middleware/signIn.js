const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const signInMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token puuttuu' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // nyt käytettävissä req.user.userId
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Virheellinen token' });
  }
};

module.exports = signInMiddleware;
