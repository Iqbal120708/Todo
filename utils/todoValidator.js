const { param, body, validationResult } = require('express-validator');

class TodoValidator {
  field() {
    return [
      body('aktivitas')
        .notEmpty()
        .withMessage('aktivitas is required')
        .escape(),
      body('startDate')
        .notEmpty()
        .withMessage('startDate is required')
        .escape(),
      body('endDate').notEmpty().withMessage('endDate is required').escape()
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
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log(result.array());
      return result.array();
    }

    if (req.body.startDate > req.body.endDate) {
      return 'start date lebih besar dari end date';
    }

    return false;
  }
}

module.exports = TodoValidator;
