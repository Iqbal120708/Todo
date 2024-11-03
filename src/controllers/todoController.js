const TodoValidator = require('../utils/todoValidator');
const {Todo} = require('../db/models')
const logger = require('../utils/logger')

const { Op } = require('sequelize');

let validator = new TodoValidator();

class Index {
  async get(req, res) {
    let check = false;
    try {
      let todos = await Todo.findAll();
      logger.info('Ambil data todo',{ method: req.method, url: req.url })
      res.render('index', {
        title: 'Todo',
        check,
        todos,
        csrf: req.csrfToken ? req.csrfToken() : null
      });
    } catch (err) {
      logger.error('Kesalahan mengambil todo', {
        method: req.method,
        url: req.url,
        error: {
          msg: err.message,
          stack: err.stack
        }
      })
      res.status(500).send('Error fetching todo');
    }
  }
  
  async post(req, res) {
    let validasi = validator.is_not_valid(req);
    if (validasi) {
       return res.redirect(req.url)
    }
    try {
      let { tasks, startDate, endDate } = req.body;
      await Todo.create({ tasks, startDate, endDate })
      req.flash('success_msg', 'Todo berhasil ditambahkan');
      logger.info('Todo berhasil ditambahkan', {
        method: req.method,
        url: req.url,
        body: req.body,
      })
    } catch (err) {
      logger.error('Kesalahan menambah todo', {
        method: req.method,
        url: req.url,
        body: req.body,
        error: {
          msg: err.message,
          stack: err.stack
        }
      })
      res.status(500).send('Error post todo');
    }
    res.redirect('/');
  }
}

class Update {
  async get(req, res) {
    let validasi = validator.is_not_valid(req);
    if (validasi) {
      return res.redirect(req.url)
    }
    try {
      let id = req.params.id;
      let todo = await Todo.findByPk(id)
      logger.info('Update data todo',{ method: req.method, url: req.url })
      if (todo) {
        res.render('update', {
          title: 'Update',
          todo,
          csrf: req.csrfToken ? req.csrfToken() : null
        });
      } else {
        logger.warn('Task not found',{ method: req.method, url: req.url })
        res.status(404).send('Task not found');
      }
    } catch (err) {
      logger.error('Kesalahan memperbaharui todo', {
        method: req.method,
        url: req.url,
        error: {
          msg: err.message,
          stack: err.stack
        }
      })
      res.status(500).send('Error fetching todo');
    }
  }

  async post(req, res) {
    let validasi = validator.is_not_valid(req);
    if (validasi) {
      return res.redirect(req.url)
    }
    let id = req.params.id;
    try {
      let todo = await Todo.findByPk(id)
      if (!todo) {
        logger.warn('Task not found',{ method: req.method, url: req.url })
        return res.status(404).send('Task not found');
      }
      let { tasks, startDate, endDate } = req.body;
      await todo.update({ tasks, startDate, endDate })
      req.flash('success_msg', 'Todo berhasil diperbaharui');
      logger.info('Todo berhasil diperbaharui', {
        method: req.method,
        url: req.url,
        body: req.body,
      })
    } catch (err) {
      logger.error('Kesalahan memperbaharui todo', {
        method: req.method,
        url: req.url,
        body: req.body,
        error: {
          msg: err.message,
          stack: err.stack
        }
      })
      res.status(500)
      return res.send('Error put todo');
    }
    res.redirect(`/`);
  }
}

class Delete {
  async post(req, res) {
    let validasi = validator.is_not_valid(req);
    if (validasi) {
      return res.redirect(req.url)
    }
    try {
      let { ids } = req.body;
      if (!Array.isArray(ids)) {
        ids = [ids];
      }
      const deletedCount = await Todo.destroy({
        where: {
          id: {
            [Op.in]: ids
          }
        }
      });
      if (deletedCount === 0) {
        logger.warn('Task tidak ditemukan',{ method: req.method, url: req.url })
        // Jika tidak ada baris yang dihapus
        return res.status(404).json({ message: 'Tidak ada task yang ditemukan untuk dihapus' });
      }
    } catch (err) {
      logger.error('Kesalahan menghapus todo', {
        method: req.method,
        url: req.url,
        body: req.body,
        error: {
          msg: err.message,
          stack: err.stack
        }
      })
      res.status(500).send('Error delete todo');
    }
    logger.info('Todo berhasil dihapus', {
      method: req.method,
      url: req.url,
      body: req.body,
    })
    req.flash('success_msg', 'Todo berhasil dihapus');
    res.redirect('/');
  }
}

module.exports = { Index, Update, Delete };
