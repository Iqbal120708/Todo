const express = require('express');
const csrfProtection = require('csurf')({ cookie: true });
const { Index, Update, Delete } = require('../controllers/todoController');
const TodoValidator = require('../utils/todoValidator')

const router = express.Router();
let validator = new TodoValidator()

const index = new Index()
const update = new Update()
const del = new Delete()

router.get('/', csrfProtection, index.get);
router.post('/', csrfProtection, validator.field(), index.post);
router.get('/update/:id', csrfProtection, validator.params(), update.get);
router.post('/update/:id', csrfProtection, validator.all(),update.post);
router.post('/delete', csrfProtection, validator.fieldDelete(), del.post);

module.exports = router;