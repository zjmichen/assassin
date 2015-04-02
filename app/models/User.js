var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  profile: Object,
  email: String,
  receiveNewsletter: { type: Boolean, default: false }
});

UserSchema.static('findOrCreate', function(data, done) {
  if (!data.email) { return done('No email given'); }
  User.findOne({email: data.email}, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
      user = new User(data);
      user.save(function(err) {
        if (err) { return done(err); }
        done(null, user);
      });
    } else {
      if (!user.profile) {
        user.profile = data.profile;
        user.save(function(err) {
          if (err) { return done(err); }
          done(null, user);
        });
      } else {
        done(null, user);
      }
    }
  });
});

UserSchema.static('findOrCreateByEmail', function(emails, done) {
  User.find({}).where('email').in(emails).exec(function(err, users) {
    if (err) { return done(err); }

    var userEmails = users.map(function(user) {
      return user.email;
    });

    // create missing users
    User.create(
      emails.filter(function(email) {
        // get emails of missing users
        return userEmails.indexOf(email) === -1;
      }).map(function(email) {
        // convert to object for creation
        return {email: email};
      }), 

      function(err) {
        var args = arguments;
        var keys = Object.keys(args);
        keys.shift();

        var newUsers = keys.map(function(key) {
          return args[key];
        });

        done(err, users.concat(newUsers)); 
      }
    );
  });

});

mongoose.model('User', UserSchema);
var User = mongoose.model('User');
module.exports = User;