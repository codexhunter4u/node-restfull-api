const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Sign up with new user  
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.signup = (req, res, next) => {
  User.find({ email: req.body.email }).exec().then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'User is not exist',
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, encrypted) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: encrypted,
            });
            user.save().then((result) => {
                res.status(201).json({
                  message: 'User created successfully.',
                });
            }).catch((err) => {
                res.status(500).json({
                  error: err,
                });
            });
          }
        });
      }
  });
};

/**
 * Login to get the token
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.login = (req, res, next) => {
  User.find({ email: req.body.email }).exec().then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'This email is not registered with us.',
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Incorrect password, Please use valid password',
          });
        }
        if (result) {
          const token = jwt.sign({
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY, {
              expiresIn: '1h',
            }
          );

          return res.status(200).json({
            message: 'User is authenticate successfully',
            token: token,
          });
        }

        res.status(401).json({
          message: 'Authentication failed',
        });
      });
    }).catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

/**
 * Delete user
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.delete = (req, res, next) => {
  User.remove({ _id: req.params.userId }).exec().then((result) => {
      res.status(200).json({
        message: 'User is deleted successfully',
      });
    }).catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
