const request = require('supertest');
const { sequelize, Todo } = require("../db/models")
const app = require('../app');

const agent = request.agent(app)

beforeEach(async () => {
  await Todo.destroy({ where: {} })
})

describe('POST /', () => {
  it('cek post data', async () => {
    const tasks = 'test post todo'
    const startDate = '2024-11-02'
    const endDate = '2024-11-03'
    
    const response = await request(app)
      .post('/')
      .type('form').send({ tasks, startDate, endDate })
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
    
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
    
    const response = await agent.post('/')
      .type('form').send({ tasks, startDate, endDate })
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
    
    const redirectResponse = await agent.get('/')
    expect(redirectResponse.text).toContain('tasks is required')
    
    let todo = await Todo.findOne({ where: { tasks } })
    expect(todo).toBeNull()
    
    count = await Todo.count()
    expect(count).toEqual(0)
  });
  
  it('cek post startDate invalid', async () => {
    const tasks = 'cek startDate invalid'
    const startDate = ''
    const endDate = '2024-11-03'
    
    const response = await agent.post('/')
      .type('form').send({ tasks, startDate, endDate })
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
    
    const redirectResponse = await agent.get('/')
    expect(redirectResponse.text).toContain('startDate is required')
    
    let todo = await Todo.findOne({ where: { tasks } })
    expect(todo).toBeNull()
    
    count = await Todo.count()
    expect(count).toEqual(0)
  });
  
  it('cek post endDate invalid', async () => {
    const tasks = 'cek endDate invalid'
    const startDate = '2024-11-02'
    const endDate = ''
    
    const response = await agent.post('/')
      .type('form').send({ tasks, startDate, endDate })
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
    
    const redirectResponse = await agent.get('/')
    expect(redirectResponse.text).toContain('endDate is required')
    
    let todo = await Todo.findOne({ where: { tasks } })
    expect(todo).toBeNull()
    
    count = await Todo.count()
    expect(count).toEqual(0)
  });
});

describe('GET /', () => {
  it('cek response "Tidak ada tasks"', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Tidak ada tasks');
  });
});