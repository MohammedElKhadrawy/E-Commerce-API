exports.register = async (req, res, next) => {
  res.send('register user');
};

exports.login = async (req, res, next) => {
  res.send('login user');
};

exports.logout = async (req, res, next) => {
  res.send('logout user');
};
