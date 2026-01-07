const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.registerValidator = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars'),
  body('firstName').notEmpty().withMessage('First Name is required'),
  body('role').isIn(['Owner', 'Manager', 'Employee']).withMessage('Invalid role'),
  validate
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];