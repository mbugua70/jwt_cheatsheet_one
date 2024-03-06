const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "node tokens", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUsers = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "node tokens", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        req.user = user;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);

        req.user = user;
        next();
      }
    });
  } else {
    // res.redirect("/login");
    req.user = user;
    next();
  }
};

module.exports = { requireAuth, checkUsers };
