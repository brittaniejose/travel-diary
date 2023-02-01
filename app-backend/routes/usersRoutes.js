var express = require('express');
var router = express.Router();
const { User, Token } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Token Creation
const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: maxAge})
}

// Signup
router.post('/signup', async function(req, res, next) {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await User.findOne({ where: { email: email }});

  if (!existingUser) {

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({ firstName: firstName, lastName: lastName, email: email, password: hashedPassword });
    console.log(user);
    const token = createToken(user.id);
    console.log(token, 'token ln 24')
    const auth = await Token.create({token: token, userID: user.id});
  
    const authUser = {
      user: user,
      token: auth.token,
      message: "Thank you for joining. Redirecting you to the homepage."
    }
    res.json(authUser);   
  } else {
    res.json({message: 'This email is already registered'})
  }

});

//Login
router.post('/login', async function(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email: email }});

  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      const authToken = createToken(user.id);
      console.log(authToken, "jwt token ln 22");
      const token = await Token.create({token: authToken, userID: user.id})

      const authUser = {
        user: user,
        token: token.token,
        message: "Login Successful"
      }

      res.json(authUser)
    } else {
      res.json({message: 'Password is incorrect'})

    }
  } else {
    res.json({message: "This email is not registered"})
  }
})

module.exports = router;
