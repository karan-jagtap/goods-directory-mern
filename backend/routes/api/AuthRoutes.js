const { request } = require('express');
const express = require('express');
const UsersModel = require('../../models/UsersModel');
const jwt = require('jsonwebtoken');
const router = express.Router();
const keys = require('../../config/keys');
const auth = require('../../middleware/AuthMiddleware');

// @route POST api/auth
// @desc Register new user
// @access Public
router.post('/', (req, res) => {
  const { email, password } = req.body;
  const newUser = new UsersModel({
    email,
    password
  });

  if (!email || !password) {
    return res.json({
      error: true,
      message: 'empty_field'
    })
  }
  UsersModel
    .findOne({ email })
    .then(user => {
      if (user) return res.json({ error: true, message: 'user_present' });
      newUser.save()
        .then(user => {
          jwt.sign(
            { id: user.id },
            keys.jwtSecret,
            (err, token) => {
              if (err) throw err;
              res.status(200).json({
                error: false,
                token,
                user: {
                  email: user.email
                },
                message: ''
              });
            });
        })
        .catch(err => {
          console.log(err);
          res.json({ error: true, message: err });
        })
    });
});

// @route POST /api/auth/login
// @desc Login user
// Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) return res.status(400).json({ error: true, message: 'empty_field' });

  UsersModel
    .findOne({ email })
    .then(user => {
      if (!user) return res.status(400).json({ error: true, message: 'user_absent' });
      if (user.password === password) {
        jwt.sign(
          { id: user.id },
          keys.jwtSecret,
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              error: false,
              token,
              user: {
                email: user.email
              },
              message: ''
            });
          });
      } else {
        res.json({ error: true, message: 'invalid_credentials' });
      }
    });
});


// @route GET /api/auth/user
// @desc Get user from token
// @access Private
router.get('/user', auth, (req, res) => {
  UsersModel.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user));
})
module.exports = router;