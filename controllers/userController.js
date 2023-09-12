exports.getAllUsers = async (req, res, next) => {
  res.send('get all users');
}

exports.getSingleUser = async (req, res, next) => {
  res.send('get single user');
}

exports.showCurrentUser = async (req, res, next) => {
  res.send('show current user');
}

exports.updateUser = async (req, res, next) => {
  res.send('update user');
}

exports.updateUserPassword = async (req, res, next) => {
  res.send('update user password');
}