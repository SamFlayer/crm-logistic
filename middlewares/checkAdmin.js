const checkAdmin = (req, res, next) => {
  if (res.locals.admin) {
    return next();
  }
  return res.redirect('/');
};

module.exports = {
  checkAdmin,
};
