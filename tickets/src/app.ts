import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundError } from "@mb_ticket/common";
import { currentUser } from "@mb_ticket/common";
import cookieSession from "cookie-session";
import { createTicketRouter } from "./routes/new";
import { getTicketByIdRouter } from "./routes/show-ticket";
import { getAllTicketsRouter } from "./routes/get-tickets";
import {updateTicketRouter} from "./routes/update-ticket";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
}))
app.use(currentUser);

app.use(createTicketRouter);
app.use(getTicketByIdRouter);
app.use(getAllTicketsRouter);
app.use(updateTicketRouter);

app.all("*", async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};