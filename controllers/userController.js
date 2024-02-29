const models = require("../models");
const validators = require("fastest-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Sign Up
function signUp(req, res) {
  // Check if user already exists with the provided email
  models.User.findOne({
    where: { email: req.body.email },
  })
    .then((user) => {
      if (user) {
        // If user already exists, send a conflict response
        res
          .status(409)
          .json({ message: "User with this email already exists" });
      } else {
        // If user does not exist, hash the password and create the user
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (err, hashedPassword) {
            // Create user object with hashed password
            const user = {
              name: req.body.name,
              email: req.body.email,
              password: hashedPassword,
            };

            // Validation schema for user data
            const schema = {
              name: { type: "string", optional: false, max: 100 },
              email: { type: "email", optional: false },
              password: { type: "string", optional: false, min: 8, max: 100 },
            };

            // Create a new instance of fastest-validator
            const v = new validators();
            // Validate user data against the schema
            const validationResult = v.validate(user, schema);
            // If validation fails, send a bad request response with validation errors
            if (validationResult !== true) {
              return res.status(400).json({
                message: "Validation failed",
                errors: validationResult,
              });
            }

            // Create the user in the database
            models.User.create(user)
              .then((createdUser) => {
                // If user is created successfully, send a created response
                res.status(201).json({
                  message: "User created successfully",
                  user: createdUser,
                });
              })
              .catch((err) => {
                // If an error occurs while creating the user, send a server error response
                res.status(500).json({
                  message: "Error creating user",
                  error: err,
                });
              });
          });
        });
      }
    })
    .catch((err) => {
      // If an error occurs while finding the user, send a server error response
      res.status(500).json({ message: "Error finding user", error: err });
    });
}

// User Log In
function logIn(req, res) {
  const schema = {
    email: { type: "email", optional: false },
    password: { type: "string", optional: false, min: 8, max: 100 },
  };

  const v = new validators();
  const validationResult = v.validate(req.body, schema);
  if (validationResult !== true) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validationResult,
    });
  }

  // Find user by email
  models.User.findOne({
    where: { email: req.body.email },
  })
    .then((user) => {
      // If user is not found, send a not found response
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } else {
        // If user is found, compare the provided password with the hashed password in the database
        bcrypt.compare(
          req.body.password,
          user.password,
          function (err, result) {
            // If there is an error during comparison, send a server error response
            if (err) {
              return res
                .status(500)
                .json({ message: "Error comparing passwords", error: err });
            }
            // If password is incorrect, send a bad request response
            if (!result) {
              return res.status(400).json({ message: "Incorrect password" });
            } else {
              // If password is correct, generate a JWT and send it in the response
              const token = jwt.sign(
                {
                  email: user.email,
                  userId: user.id,
                },
                "mohamedramadan"
              );
              return res.status(200).json({
                message: "User logged in successfully",
                token: token,
              });
            }
          }
        );
      }
    })
    .catch((err) => {
      // If an error occurs while finding the user, send a server error response
      res.status(500).json({ message: "Error finding user", error: err });
    });
}

module.exports = {
  signUp,
  logIn,
};
