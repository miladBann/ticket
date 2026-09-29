import nats from "node-nats-streaming";
import { randomBytes } from "node:crypto";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const client = nats.connect("ticket", randomBytes(4).toString("hex"), {
    url: "http://localhost:4222"
});

client.on("connect", async () => {
    console.log("publisher connected to NATS");

    const publisher = new TicketCreatedPublisher(client);

    try {
        await publisher.publish({
            id: "123",
            title: "concert",
            price: 20
        });
    }catch (err) {
        console.log(err);
    }
    
});