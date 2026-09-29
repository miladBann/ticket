import express, {Request, Response} from "express";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@mb_ticket/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order  } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post("/api/orders/", requireAuth, [
    body("ticketId").not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("TicketId must be provided")
], validateRequest,
async (req: Request, res: Response) => {
    const {ticketId} = req.body;

    //find the ticket the user is trying to order in the db
    const ticket = await Ticket.findById(ticketId);
    if(!ticket) {
        throw new NotFoundError();
    }

    //make sure that the ticket is not already reserved
    //a reserved ticket is a ticket that is refrenced inside of an order
    //run query to look at all orders. Find an order where the ticket is the ticket 
    //we just found *and* the order status is *not* cancelled.
    //if we find an order from that, it means the ticket *is* reserved.
    //the logic for deciding if a ticket in an order is reserved is written in the ticket.ts file in the models folder.
    const isReserved = await ticket.isReserved();
    if(isReserved) {
        throw new BadRequestError("ticket is already reserved");
    }
    
    //calculate an expiration date for the order (15 minutes)
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 15 * 60);

    //build the order and save it to the db
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket
    });

    await order.save();

    //publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order._id.toString(),
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    })

    res.status(201).send(order);
})

export {router as newOrderRouter};