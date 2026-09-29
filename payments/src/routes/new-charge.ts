import express, { Request, Response} from "express";
import { body } from "express-validator";
import {requireAuth, validateRequest, NotAuthorizedError,BadRequestError, NotFoundError, OrderStatus} from "@mb_ticket/common";
import { Order } from "../models/order";
import {stripe} from "../stripe";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { Payment } from "../models/payment";

const router = express.Router();

router.post("/api/payments", 
    requireAuth, 
[
    body("token").not().isEmpty(),
    body("orderId").not().isEmpty(),
], 
validateRequest,

async (req: Request, res: Response) => {
    const {token, orderId} = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("cant pay for cancelled order");
    }

    const charge = await stripe.charges.create({
        currency: "usd",
        //the amount we store is in dollars, but stripe works with cents 
        //so we multiply times 100
        amount: order.price * 100,
        source: token,
    });

    const payment = Payment.build({
        orderId,
        stripeId: charge.id
    });
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment._id.toString(),
        orderId: payment._id.toString(),
        stripeId: payment.stripeId
    })

    res.send({id: payment._id});
});

export {router as createChargeRouter};