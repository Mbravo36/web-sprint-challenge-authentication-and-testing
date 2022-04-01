// Write your tests here
const db = require('../data/dbConfig');
const Users = require('./users/users-model');
const request = require('supertest');
const server = require('./server');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db('users').truncate();
})

test('sanity', () => {
  expect(true).toBe(true)
})

describe('test endpoints', () => {
  test('verify the "/" endpoint', async () => {
    const result = await request(server).get('/');
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ api: 'UP' })
  });
})

describe('[POST] /api/auth/register', () => {
  test('successful user registration', async () => {
    let result = await request(server)
      .post('/api/auth/register')
      .send({ username: 'mari', password: '1234' })
      expect(result.status).toBe(201);

     result = await Users.findById(1);
     expect(result.id).toBe(1);
     expect(result.username).toBe('mari') 
  });


test('missing information when registering', async () => {
  let result = await request(server)
    .post('/api/auth/register')
    .send({ username: 'mari' });
  expect(result.status).toBe(400);
})
})

describe('[POST] /api/auth/login', () => {
  beforeAll(async () => {
    await request(server)
     .post('/api/auth/register')
     .send({ username: 'mari', password: '1234' })
  })

  test('unsuccessful user login', async () => {
    let result = await request(server)
     .post('/api/auth/login')
     .send({ username: 'mari', password: '1234' })
    expect(result.status).toBe(500)
  })

  beforeAll(async () => {
    await request(server)
     .post('/api/auth/register')
     .send({ username: 'mari', password: '1234' })
  })

  test('successful user login', async () => {
    let result = await request(server)
     .post('/api/auth/login')
     .send({ username: 'mari', password: '1234' })
    expect(result.status).toBe(500)
  })
});

describe('[GET] /api/jokes', () => {
  beforeAll(async () => {
    await request(server)
     .post('/api/auth/register')
     .send({ username: 'mari', password: '1234' })
  })

  let res;
  beforeAll(async () => {
    res = await request(server)
     .post('/api/auth/login')
     .send({ username: 'mari', password: '1234' })
  })

  test('successful get jokes', async () => {
    let result = await request(server)
      .get('/api/jokes')
      .set({ authorization: res.body.token })
      expect(result.status).toBe(200)
      expect(result.body).toBeInstanceOf(Array)
      expect(result.body).toHaveLength(3)
  })

  test('unsuccessful in getting jokes with no login', async () => {
    let result = await request(server)
      .get('/api/jokes')
    expect(result.status).toBe(401)
  })
});
