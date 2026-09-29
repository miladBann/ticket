import { Listener, OrderCreatedEvent,  OrderStatus,  Subjects } from "@mb_ticket/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

    queueGroupName = "tickets-service";

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        // find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);

        //if no ticket throw error
        if (!ticket) {
            throw new Error("ticket not found");
        }

        //mark the ticket as being reserved by setting its orderId prop
        ticket.set({orderId: data.id});

        //save the ticket
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            ...(ticket.orderId && { orderId: ticket.orderId })
        });

        //ack the message
        msg.ack();
    }
}