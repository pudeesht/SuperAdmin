const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Authentication token required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid.' });
    }
    // console.log("yeh hai middleware",userPayload);
    req.user = userPayload;
    next();
  });
};

const requireSuperadmin = (req, res, next) => {
  
  if (!req.user || !req.user.roles || !req.user.roles.includes('superadmin')) {
    return res.status(403).json({ message: 'Access denied. Superadmin role required.' });
  }
  next();
};



module.exports = {
  authenticateToken,
  requireSuperadmin,
};