const request = require('supertest');
const { sequelize, Todo } = require("../db/models")
const app = require('../app');

const agent = request.agent(app)

const invalidPost = async (tasks, startDate, endDate, msg_error) => {
  const response = await agent.post('/')
      .type('form').send({ tasks, startDate, endDate })
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
    
    const redirectResponse = await agent.get('/')
    expect(redirectResponse.text).toContain(msg_error)
    
    let todo = await Todo.findOne({ where: { tasks } })
    expect(todo).toBeNull()
    
    let count = await Todo.count()
    expect(count).toEqual(0)
}

const invalidUpdate = async (todo, tasks, startDate, endDate, msg_error) => {
  const response = await agent.post(`/update/${todo.id}`)
      .type('form').send({ tasks, startDate, endDate })
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(`/update/${todo.id}`);
    
    const redirectResponse = await agent.get(`/update/${todo.id}`)
    // mengecek pesan error di response html
    expect(redirectResponse.text).toContain(msg_error)
    // mengecek response html bahwa data masih sama dan tidak terupdate
    expect(redirectResponse.text).toContain('initial test update');
    expect(redirectResponse.text).toContain('2024-11-03');
    expect(redirectResponse.text).toContain('2024-11-04');
    
    // mengecek data masih sama dan tidak terupdate
    let todo_update = await Todo.findOne({ where: { id: todo.id } })
    expect(todo_update.tasks).toEqual('initial test update')
    expect(todo_update.startDate).toEqual('2024-11-03')
    expect(todo_update.endDate).toEqual('2024-11-04')
    
    let count = await Todo.count()
    expect(count).toEqual(1)
}

async function createTodo() {
  let todo = await Todo.create({
      tasks: 'initial test update',
      startDate: '2024-11-03',
      endDate: '2024-11-04'
    })
    expect(todo.tasks).toEqual('initial test update')
    expect(todo.startDate).toEqual('2024-11-03')
    expect(todo.endDate).toEqual('2024-11-04')
    
  return todo
}

async function creatTodoForDelete(loop=1) {
  for(let i=0; i<loop; i++){
    let todo = await Todo.create({
      tasks: `initial test delete ${loop+1}`,
      startDate: '2024-11-03',
      endDate: '2024-11-04'
    })
  }
  let count = await Todo.count()
  expect(count).toEqual(loop)
  return await Todo.findAll()
}

beforeEach(async () => {
  await Todo.destroy({ where: {} })
})

describe('POST /', () => {
  it('cek post data', async () => {
    const tasks = 'test post todo'
    const startDate = '2024-11-02'
    const endDate = '2024-11-03'
    
    const response = await agent
      .post('/')
      .type('form').send({ tasks, startDate, endDate })
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
    
    const redirectResponse = await agent.get('/')
    expect(redirectResponse.text).toContain('Todo berhasil ditambahkan')
    
    let todo = await Todo.findOne({ where: { tasks } })
    expect(todo.tasks).toEqual(tasks)
    expect(todo.startDate).toEqual(startDate)
    expect(todo.endDate).toEqual(endDate)
    
    count = await Todo.count()
    expect(count).toEqual(1)
  });
  
  it('cek post tasks invalid', async () => {
    const tasks = ''
    const startDate = '2024-11-02'
    const endDate = '2024-11-03'
    
    await invalidPost(tasks, startDate, endDate, 'tasks is required')
    
  });
  
  it('cek post startDate invalid', async () => {
    const tasks = 'cek startDate invalid'
    const startDate = ''
    const endDate = '2024-11-03'
    
    await invalidPost(tasks, startDate, endDate, 'startDate is required')
  });
  
  it('cek post endDate invalid', async () => {
    const tasks = 'cek endDate invalid'
    const startDate = '2024-11-02'
    const endDate = ''
    
    await invalidPost(tasks, startDate, endDate, 'endDate is required')
  });
  
  it('cek post invalid startDate > endDate', async () => {
    const tasks = 'error startDate > endDate'
    const startDate = '2024-11-04'
    const endDate = '2024-11-03'
    
    await invalidPost(tasks, startDate, endDate, 'startDate lebih besar dari endDate')
  });
});

describe('GET /', () => {
  it('cek response "Tidak ada tasks"', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Tidak ada tasks');
  });
});

describe('GET /update/:id', () => {
  it('cek get update', async () => {
    let todo = await createTodo()
    
    const response = await request(app).get(`/update/${todo.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('initial test update');
    expect(response.text).toContain('2024-11-03');
    expect(response.text).toContain('2024-11-04');
  });
  
  it('cek get update id task tidak ditemukan', async () => {
    let todo = await createTodo()
    const response = await request(app).get(`/update/${todo.id+100}`);
    expect(response.statusCode).toBe(404);
    expect(response.text).toContain('Task not found');
  });
});

describe('POST /update/:id', () => {
  it('cek post update', async () => {
    let todo = await createTodo()
    
    new_tasks = 'initial test update2'
    const response = await agent.post(`/update/${todo.id}`)
      .type('form').send({ 
        tasks: new_tasks,
        startDate: todo.startDate,
        endDate: todo.endDate,
      })
    
    let todo_update = await Todo.findOne({ where: { id: todo.id } })
    expect(todo_update.tasks).toEqual(new_tasks)
    expect(todo_update.startDate).toEqual(todo.startDate)
    expect(todo_update.endDate).toEqual(todo.endDate)
    
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(`/`);
    
    const redirectResponse = await agent.get(response.headers.location)
    expect(redirectResponse.text).toContain(todo_update.tasks);
    expect(redirectResponse.text).toContain(todo_update.startDate);
    expect(redirectResponse.text).toContain(todo_update.endDate);
    expect(redirectResponse.text)
      .toContain('Todo berhasil diperbaharui');
  });
  
  it('cek post update tasks invalid', async () => {
    let todo = await createTodo()
    
    new_tasks = ''
    msg_error = 'tasks is required'
    await invalidUpdate(
      todo, 
      new_tasks, 
      todo.startDate, 
      todo.endDate, 
      msg_error
    )
  });
  
  it('cek post update startDate invalid', async () => {
    let todo = await createTodo()
    
    new_startDate = ''
    msg_error = 'startDate is required'
    await invalidUpdate(
      todo, 
      todo.tasks, 
      new_startDate, 
      todo.endDate, 
      msg_error
    )
  });
  
  it('cek post update endDate invalid', async () => {
    let todo = await createTodo()
    
    new_endDate = ''
    msg_error = 'endDate is required'
    await invalidUpdate(
      todo, 
      todo.tasks, 
      todo.startDate, 
      new_endDate, 
      msg_error
    )
  });
  
  it('cek post update startDate > endDate', async () => {
    let todo = await createTodo()
    
    new_startDate = '2024-11-04'
    new_endDate = '2024-11-03'
    msg_error = 'startDate lebih besar dari endDate'
    await invalidUpdate(
      todo, 
      todo.tasks, 
      new_startDate, 
      new_endDate, 
      msg_error
    )
  });
  
  it('cek post update id task tidak ditemukan', async () => {
    let todo = await createTodo()
    
    new_tasks = 'initial test update2'
    const response = await agent.post(`/update/${todo.id+1}`)
      .type('form').send({ 
        tasks: new_tasks,
        startDate: todo.startDate,
        endDate: todo.endDate,
      })
    expect(response.statusCode).toBe(404);
    expect(response.text).toContain('Task not found');
    
    // mengecek data masih sama dan tidak terupdate
    let todo_update = await Todo.findOne({ where: { id: todo.id } })
    expect(todo.tasks).toEqual('initial test update')
    expect(todo.startDate).toEqual('2024-11-03')
    expect(todo.endDate).toEqual('2024-11-04')
  });
});



const validDelete = async (todos, ) => {
  const todos_id = todos.map(todo => todo.id);
    const response = await agent.post(`/delete`)
      .type('form').send({ ids: todos_id })
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
    
    const redirectResponse = await agent.get(response.headers.location)
    expect(redirectResponse.text).toContain('Todo berhasil dihapus');
    
    // mengecek data terhapus semua
    let count = await Todo.count()
    expect(count).toEqual(0)
}

describe('POST /delete', () => {
  it('cek post delete dengan 1 id task', async () => {
    let todos = await creatTodoForDelete(loop=1)
    await validDelete(todos)
  });
  
  it('cek post delete dengan lebih dari 1 id task', async () => {
    let todos = await creatTodoForDelete(loop=2)
    await validDelete(todos)
  });
  
  it('cek post delete hanya salah satu 1 id task', async () => {
    let todos = await creatTodoForDelete(loop=2)
    const todos_id = todos.map(todo => todo.id);
    const response = await agent.post(`/delete`)
      .type('form').send({ ids: todos_id[0] })
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
    
    const redirectResponse = await agent.get(response.headers.location)
    expect(redirectResponse.text).toContain('Todo berhasil dihapus');
    
    // mengecek data terhapus
    let count = await Todo.count()
    expect(count).toEqual(1)
  });
  
  it('cek post delete invalid id task', async () => {
    length_data = 2
    let todos = await creatTodoForDelete(loop=length_data)
    const todos_id = todos.map(todo => todo.id+100);
    const response = await agent.post(`/delete`)
      .type('form').send({ ids: todos_id })
      
    expect(response.statusCode).toBe(404);
    expect(response.text)
      .toContain('Tidak ada task yang ditemukan untuk dihapus');
    
    // mengecek data tidak terhapus
    let count = await Todo.count()
    expect(count).toEqual(length_data)
  });
});