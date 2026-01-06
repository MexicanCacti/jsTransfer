const request = require('supertest');
const {expect} = require('chai');
const File = require("../../schemas/File")
const User = require("../../schemas/User")

let mongo

let testEmail = "example@test.com"
let testPassword = "hashedPassword"

let testPath = "./test.txt"
let testFilename = "test.txt"
let testFilePassword = "hashedFilePassword"
let testUploadedBy = new User({
    email: testEmail,
    hashedPassword: testPassword
})
let testUploadDate = Date.now()

describe("File Schema", () => {
    it ("saves a file", async () => {
        const file = new File({
            path: testPath,
            filename: testFilename,
            password: testFilePassword,
            uploadedBy: testUploadedBy,
            uploadDate: testUploadDate
        })

        const saved = await file.save()

        expect(saved._id).to.exist
        expect(saved.filename).to.equal(testFilename)
        expect(saved.password).to.equal(testFilePassword)
        expect(saved.uploadedBy).to.equal(testUploadedBy)
        expect(saved.downloadCount).to.equal(0)
    })

    it("fails when missing required fields", async() => {
        try{
            const file = new File({
                path: testPath,
                password: testPassword,
                uploadedBy: testUploadedBy,
                uploadDate: testUploadDate
            })
            throw new Error("Should not save file without filename")
        } catch(err) {
            expect(err).to.exist
        }
    })
})