import express from "express";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "@mb_ticket/common";
import { NotFoundError } from "@mb_ticket/common";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
}))

app.get("/api/users", (req, res) => {
    res.send("this is the ticketing app")
})

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};