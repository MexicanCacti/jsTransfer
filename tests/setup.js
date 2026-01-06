const mongoose = require("mongoose")
const {MongoMemoryServer} = require("mongodb-memory-server")

let mongo

const delay = (durationMs) => {
    return new Promise(resolve => setTimeout(resolve, durationMs))
}

before(async() => {

    mongo = await MongoMemoryServer.create()
    const uri = mongo.getUri()
    await mongoose.connect(uri)
}).timeout(20000)

afterEach(async() => {
    await mongoose.connection.db.dropDatabase()
}).timeout(20000)

after (async() => {
    await mongoose.disconnect()
    await mongo.stop()
}).timeout(20000)