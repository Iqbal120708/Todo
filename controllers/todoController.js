const TodoValidator = require('../utils/todoValidator');
const db = require('../db/db');
const formatDate = require('../utils/formatDate');

let validator = new TodoValidator();

class Index {
  async get(req, res) {
    let check = false;
    try {
      let [todos] = await db.query(
        'select * from todo order by start_date asc'
      );
      res.render('index', {
        title: 'Todo',
        check,
        todos,
        formatDate,
        csrf: req.csrfToken()
      });
    } catch (err) {
      console.log(err);
      res.status(500).send('Error fetching todo');
    }
  }

  async post(req, res) {
    let validasi = validator.is_not_valid(req);
    if (validasi) {
      return res.send(validasi);
    }
    try {
      let { aktivitas, startDate, endDate } = req.body;
      const sql =
        'INSERT INTO todo (aktivitas, start_date, end_date) VALUES (?, ?, ?)';
      await db.query(sql, [aktivitas, startDate, endDate]);
    } catch (err) {
      console.log(err);
      res.status(500).send('Error post todo');
    }
    res.redirect('/');
  }
}

class Update {
  async get(req, res) {
    let validasi = validator.is_not_valid(req);
    if (validasi) {
      return res.send(validasi);
    }
    try {
      let id = req.params.id;
      let sql = 'select aktivitas, start_date, end_date from todo where id = ?';
      let [todos] = await db.query(sql, [id]);
      let todo = todos[0];
      if (todo) {
        res.render('update', {
          title: 'Update',
          todo,
          formatDate,
          csrf: req.csrfToken()
        });
      } else {
        res.status(404).send('Todo not found');
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Error fetching todo');
    }
  }

  async post(req, res) {
    let validasi = validator.is_not_valid(req);
    if (validasi) {
      return res.send(validasi);
    }
    let id = req.params.id;
    try {
      let [todos] = await db.query('select * from todo where id = ?', [id]);
      let todo = todos[0];
      if (!todo) {
        return res.status(404).send('Todo not found');
      }
      let { aktivitas, startDate, endDate } = req.body;
      const sql =
        'UPDATE todo SET aktivitas = ?, start_date = ?, end_date = ? WHERE id = ?';
      await db.query(sql, [aktivitas, startDate, endDate, id]);
    } catch (err) {
      console.log(err);
      res.status(500).send('Error put todo');
    }
    res.redirect(`/`);
  }
}

class Delete {
  async post(req, res) {
    let validasi = validator.is_not_valid(req);
    if (validasi) {
      return res.send(validasi);
    }
    try {
      let sql = 'delete from todo where id = ?';
      let { ids } = req.body;
      if (!Array.isArray(ids)) {
        ids = [ids];
      }
      for (let id of ids) {
        await db.query(sql, [id]);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Error delete todo');
    }
    res.redirect('/');
  }
}

module.exports = { Index, Update, Delete };