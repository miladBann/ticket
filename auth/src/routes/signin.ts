import express, {Request, Response} from "express";
import { body } from "express-validator";
import { validateRequest } from "@mb_ticket/common";
import { User } from "../models/user";
import { BadRequestError } from "@mb_ticket/common";
import { Password } from "../services/password";
import { UserCreated } from "../interfaces/user-created.interface";
import  jwt  from "jsonwebtoken";

const router = express.Router();

router.post("/api/users/signin", [
    body("email").isEmail().withMessage("must be a valid email"),
    body("password").trim().notEmpty().withMessage("supply a password")
], validateRequest, async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});
    if(!existingUser) {
        throw new BadRequestError("invalid credentials");
    }

    const passwordMatch = await Password.compare(existingUser.password, password);
    if(!passwordMatch) {
        throw new BadRequestError("invalid credentials");
    }

    //generating the jwt and setting it on the session object
    const userJwt = jwt.sign({
        id: existingUser._id,
        email: existingUser.email
    }, process.env.JWT_KEY!);

    req.session = {
        jwt: userJwt
    }

    const createdUser: UserCreated = {
        id: existingUser._id.toString(),
        email: existingUser.email
    }

    res.status(200).send(createdUser);

})

export {router as signInRouter};