import { Subjects, Publisher, ExpirationCompleteEvent } from "@mb_ticket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}