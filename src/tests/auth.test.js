const request = require("supertest");
require("dotenv").config();
const mongoose = require('mongoose')

beforeAll(async () => {

  await mongoose.connect(process.env.MONGO_URI);

});

const app = require("../app");

describe("Auth API", () => {

  test("should register user", async () => {

    const response = await request(app)
      .post("/api/v1/user/register")
      .send({
        name: "Rochit",
        email: "rochit7@test.com",
        password: "123456"
      });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

  });

  test('should login user', async() => {
    const response = await request(app).
    post('/api/v1/user/login').
    send({
      email: 'rochit6@test.com',
      password: '123456'
    })
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true)
  })

  test('should able to create account', async ()=>{
    const agent = request.agent(app)
    await agent.post('/api/v1/user/login').
    send({
      email: 'rochit4@test.com',
      password: '123456'
    })
    const response = await agent.
    post('/api/v1/account/create');

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
  })

  test('should able to get balance', async ()=>{
    const agent = request.agent(app);
    await agent.post('/api/v1/user/login')
    .send({
      email: 'rochit1@test.com',
      password: '123456'
    })
    const response = await agent.get('/api/v1/account/balance')
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true)
  })

  test('able to make transaction', async ()=>{
    const agent = request.agent(app);
    await agent.post('/api/v1/user/login').send({
      "email": "rochit1@test.com",
        "password": "123456"
    })

    const response = await agent.post('/api/v1/transaction').send({
      toAccount: Object('6a1553b1092061f5b2170a69'),
      idempotencyKey: 'a5bd5356-e9c8-400b-9530-cd585a88b56q',
      amount: 20
    })

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true)
  })
});

afterAll(async () => {

  await mongoose.connection.close();

});