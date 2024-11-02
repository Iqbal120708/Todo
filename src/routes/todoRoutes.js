const express = require('express');
const { Index, Update, Delete } = require('../controllers/todoController');
const TodoValidator = require('../utils/todoValidator')

const router = express.Router();
let validator = new TodoValidator()

const index = new Index()
const update = new Update()
const del = new Delete()

router.get('/', index.get);
router.post('/', validator.field(), index.post);
router.get('/update/:id', validator.params(), update.get);
router.post('/update/:id', validator.all(),update.post);
router.post('/delete', validator.fieldDelete(), del.post);

module.exports = router;
