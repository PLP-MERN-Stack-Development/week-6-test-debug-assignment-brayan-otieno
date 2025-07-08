const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Bug = require('../models/Bug');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Bug.deleteMany({});
});

describe('Bug API tests', () => {
  test('POST /api/bugs creates a new bug', async () => {
    const response = await request(app)
      .post('/api/bugs')
      .send({
        title: 'Test Bug',
        description: 'This is a test bug',
        status: 'open',
        priority: 'medium'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Test Bug');
  });

  test('GET /api/bugs returns all bugs', async () => {
    const testBug = new Bug({
      title: 'Test Bug',
      description: 'This is a test bug',
      status: 'open',
      priority: 'medium'
    });
    await testBug.save();

    const response = await request(app).get('/api/bugs');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe('Test Bug');
  });

  test('PUT /api/bugs/:id updates a bug', async () => {
    const testBug = new Bug({
      title: 'Test Bug',
      description: 'This is a test bug',
      status: 'open',
      priority: 'medium'
    });
    await testBug.save();

    const response = await request(app)
      .put(`/api/bugs/${testBug._id}`)
      .send({
        status: 'resolved'
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('resolved');
  });

  test('DELETE /api/bugs/:id removes a bug', async () => {
    const testBug = new Bug({
      title: 'Test Bug',
      description: 'This is a test bug',
      status: 'open',
      priority: 'medium'
    });
    await testBug.save();

    const response = await request(app).delete(`/api/bugs/${testBug._id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Bug removed');
  });
});
