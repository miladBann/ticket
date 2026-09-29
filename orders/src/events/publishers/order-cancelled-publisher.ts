import { Publisher, OrderCancelledEvent, Subjects } from "@mb_ticket/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}