const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  email: String
});

UserSchema.statc('findOrCreate', (email, profile) => {
  if (!email) return Promise.reject(new Error('no email given'));

  User.findOne({email})
    .then((user) => {
      if (!user) {
        user = new User({email, profile});
        user.save().then(() => {
          return Promise.resolve(user);
        });
      } else {
        return Promise.resolve(user);
      }
    });
});

mongoose.model('User', UserSchema);
const User = mongoose.model('User');
export default User;