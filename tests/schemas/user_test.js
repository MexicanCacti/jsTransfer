const {expect} = require('chai');
const User = require('../../schemas/User');

let mongo

let testEmail = "example@test.com"
let testPassword = "hashedPassword"


describe('User Schema', () => {
    it("saves a vaild user", async() => {
        const user = new User({
            email: testEmail,
            hashedPassword: testPassword,
        })

        const saved = await user.save()

        expect(saved._id).to.exist
        expect(saved.email).to.equal(testEmail)
        expect(saved.hashedPassword).to.equal(testPassword)

        it("fails without email", async() => {
            try{
                await User.create({
                    password: testPassword
                })
                throw new Error("Should not save user without email")
            } catch(err){
                expect(err).to.exist
                expect(err.errors.email).to.exist
            }
        })

        it("fails without password", async() => {
            try{
                await User.create({
                    email: testEmail
                })
                throw new Error("Should not save user without password")
            } catch(err){
                expect(err).to.exist
                expect(err.errors.password).to.exist
            }
        })
    })
})