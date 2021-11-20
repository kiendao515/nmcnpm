const jwt = require("jsonwebtoken")

const createJwtToken = (userID) => {
  return jwt.sign({ userID },"kiendao2001", {
    expiresIn: 60*60
  })
}

module.exports = { createJwtToken }