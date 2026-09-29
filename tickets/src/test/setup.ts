import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {app} from "../app";
import request from "supertest";

//telling typescript to accept signin as a global prop 
declare global {
      var signin: () => string[];
}

let mongo: any;

beforeAll(async () => {
    //define any important env variables like JWT_KEY
    process.env.JWT_KEY = "assadfd";
    
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db?.collections();

        for (let collection of collections) {
            await collection.deleteMany();
        }
    }

});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    
    await mongoose.connection.close();
})

global.signin = () => {
    //build a jwt payload {id ,email}
    const payload = {
        id: "126546sds454",
        email: "test@test.com"
    }

    //create the jwt
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    //build session object {jwt: MY_JWT}
    const session = {jwt: token};

    //turn that session into json
    const sessionJSON = JSON.stringify(session);

    //take json and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    //return a string that is teh cookie and the encoded data
    return [`session=${base64}`];
}