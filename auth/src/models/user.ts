import mongoose from "mongoose";
import { Password } from "../services/password";


// An interface the describes the properties needed to create a new user.
// Attrs is short for attributes
interface UserAttrs {
    email: string;
    password: string;
}

//An interface that describes the properties a User model has.
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

//An interface that describes the props that a user document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string
    //if we had more props like createdAt/ updatedAt... this is where we will put them
}

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    
});

UserSchema.pre("save", async function() {

    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
});

UserSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>("User", UserSchema);

export {User};