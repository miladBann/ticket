import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from "@mb_ticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = "orders-service";

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error("order not found");
        }

        order.set({
            status: OrderStatus.Complete,
        });
        await order.save();

        msg.ack();
    } 
}