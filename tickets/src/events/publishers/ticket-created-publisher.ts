import {Publisher, Subjects, TicketCreatedEvent} from "@mb_ticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}