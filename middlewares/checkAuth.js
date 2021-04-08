const checkAuth = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  return res.redirect('/users/login');
};

module.exports = {
  checkAuth,
};

// const User = require("../models/users.model")

// const checkAuth = async (req, res, next) => {
//   const userId = req.session?.user?.id

//   if (userId) {
//     const currentUser = await User.findById(userId)
//     req.userRole = currentUser.role
//     return next()
//   }

//   return res.redirect('/user/signup')
// }

// module.exports = {
//   checkAuth,
// }
