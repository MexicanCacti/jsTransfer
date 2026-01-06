const request = require('supertest');
const {expect} = require('chai');
const app = require('../../server');
const User = require('../../schemas/User');
const File = require('../../schemas/File');

let testEmail = "example@test.com"
let testPassword = "hashedPassword"

let testPath = "./test.txt"
let testFilename = "test.txt"
let testFilePassword = "hashedFilePassword"
let testUploadDate = Date.now()

describe('POST /upload', () => {
    let user

    before(async () => {
        // create a user to reference
        user = await User.create({
            email: testEmail,
            hashedPassword: testPassword
        })
    })

    it("uploads a valid file", async() => {
        const res = await request(app)
        .post('/upload')
            .send({
                path : testPath,
                filename : testFilename,
                password : testFilePassword,
                uploadedBy : user._id,
                uploadDate : testUploadDate,
            }).timeout(20000)
        expect(res.statusCode).to.equal(201);
        expect(res.body.id).to.exist

        const fileInDb = await File.findById(res.body.id)
        expect(fileInDb).to.exist
        expect(fileInDb.filename).to.equal(testFilename)
        expect(fileInDb.uploadedBy.toString()).to.equal(user._id.toString())
    })

    it("rejects when missing required fields", async() => {
        const res = await request(app)
            .post('/upload')
            .send({
                path : testPath,
                filename : testFilename,
                password : testFilePassword,
                uploadDate : testUploadDate,
            }).timeout(20000)
        expect(res.statusCode).to.equal(400);
    })
})