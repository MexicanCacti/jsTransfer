const request = require('supertest');
const {expect} = require('chai');
const app = require('../../server');

let testEmail = "example@test.com"
let testPassword = "hashedPassword"

describe ("POST /register", () => {
    it ("creates a user with valid input", async() => {
        const res = await request(app)
        .post('/register')
            .send({
                email : testEmail,
                hashedPassword: testPassword
            }).timeout(20000)

        expect(res.statusCode).to.equal(201);
        expect(res.body.id).to.exist
    })

    it ("rejects when missing required fields", async() => {
        const res = await request(app)
            .post('/register')
            .send({
                email : testEmail
            }).timeout(20000)
        expect(res.statusCode).to.equal(400);
    })
})