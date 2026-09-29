import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Mongo!");
    } catch (err) {
        console.error("Mongoose connect failed:");
        console.error(err);
        process.exit(1);
    }

    app.listen(4000, () => {
        console.log("auth service, listening on port 4000.")
    })   
}

start();