const jwt = require("jsonwebtoken")

const createJwtToken = (userID) => {
  return jwt.sign({ userID },"kiendao2001", {
    expiresIn: "30 days",
  })
}

module.exports = { createJwtToken }