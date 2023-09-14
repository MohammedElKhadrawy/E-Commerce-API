const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // technically, this isn't a validator..this is just checking for the index
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

// reserve the 'this' keyword by using 'function'
userSchema.pre('save', async function () {
  // console.log(this.modifiedPaths()); // Ex: ['name', 'email']
  // console.log(this.isModified('name')); // true/false
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
  // no need to pass in 'next' and call it [mongoose docs]
});

userSchema.methods.checkPassword = async function (enteredPassword) {
  const doesMatch = await bcrypt.compare(enteredPassword, this.password);
  return doesMatch;
};

module.exports = model('User', userSchema);
