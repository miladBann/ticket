import { Subjects, PaymentCreatedEvent, Publisher } from "@mb_ticket/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}