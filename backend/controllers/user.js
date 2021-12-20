
const user = require('../models/user');
const bcrypt = require('bcrypt');
const User = require('../models/user')

const jwt=require('jsonwebtoken');

exports.createUser=(req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save().then(result => {
      res.status(201).json({ message: 'User created', result: result });
    }).catch(error => {
      res.status(500).json({ error: error });
    })
  })

}



exports.loginUser=(req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(401).json({ 'message': 'User not found' });
    }
    console.log(user)
    fetchedUser=user;
    return bcrypt.compare(req.body.password, user.password)

  })
    .then(result => {
      console.log(result)
      if (!result) {
        return res.status(401).json({ 'message': 'Auth failed - password mismatch' });
      }
      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},'secret_key',{expiresIn: '1h'});
      console.log(token);
      return res.status(200).json({token: token, expiresIn: 3600, userId: fetchedUser._id})
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({ 'message': 'Auth failed' });
    })
}
