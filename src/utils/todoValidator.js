const { param, body, validationResult } = require('express-validator');

const logger = require('./logger')

class TodoValidator {
  field() {
    return [
      body('tasks')
        .notEmpty()
        .withMessage('tasks is required')
        .escape(),
      body('startDate')
        .notEmpty()
        .withMessage('startDate is required')
        .escape(),
      body('endDate')
        .notEmpty()
        .withMessage('endDate is required')
        .escape()
    ];
  }
  fieldDelete() {
    return [body('ids').notEmpty().withMessage('ids is required').escape()];
  }
  params() {
    return [
      param('id')
        .notEmpty()
        .withMessage('id is required')
        .isInt()
        .withMessage('id harus berupa angka')
        .escape()
    ];
  }
  all() {
    return this.field().concat(this.params());
  }

  is_not_valid(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Invalid data', {
        method: req.method,
        url: req.url,
        body: req.body,
        fields_error: errors.array()
      })
      req.flash('fields_error', errors.array());
      return true
    }
    if (req.body.startDate > req.body.endDate) {
      logger.error('Invalid data', {
        method: req.method,
        url: req.url,
        body: req.body,
        fields_error: ['startDate lebih besar dari endDate']
      })
      req.flash('error_msg', 'startDate lebih besar dari endDate');
      return true
    }
    return false;
  }
}

module.exports = TodoValidator;
