import { Publisher, OrderCreatedEvent, Subjects } from "@mb_ticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}