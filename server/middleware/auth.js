const { User } = require('../models/User');

let auth = (req, res, next) => {
  let token = req.cookies.w_auth;
  //token으로 제대로된 사용자가 맞는지 확인
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true
      });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
