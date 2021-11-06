const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  console.log( req.headers.authorization);
  try {
    const token = req.headers.authorization.split(' ')[1]; 
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token,"kiendao2001");
    req.userData = {decodedToken};
    next();
  } catch (err) {
    console.error({msg: 'Authentication failed!'});
    return next(err);
  }
}

module.exports =authenticate