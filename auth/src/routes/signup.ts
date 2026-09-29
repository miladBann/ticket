import express, {Request, Response} from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { BadRequestError } from "@mb_ticket/common";
import jwt from "jsonwebtoken";
import { UserCreated } from "../interfaces/user-created.interface";
import { validateRequest } from "@mb_ticket/common";

const router = express.Router();

router.post("/api/users/signup", [
    body("email").isEmail().withMessage("enter a valid email."),
    body("password").trim().isLength({min: 4, max: 20}).withMessage("password must be between 4 - 30 chars.")
], validateRequest ,async (req: Request, res: Response) => {

    const {email, password} = req.body;

    const existingUser = await User.findOne({email});

    if (existingUser) {
        throw new BadRequestError("email already in use.");
    }

    const user = User.build({email, password});
    await user.save();

    //generating the jwt and setting it on the session object
    const userJwt = jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.JWT_KEY!);

    req.session = {
        jwt: userJwt
    }

    const createdUser: UserCreated = {
        id: user._id.toString(),
        email: user.email
    }

    res.status(201).send(createdUser);
})

export {router as signUpRouter};