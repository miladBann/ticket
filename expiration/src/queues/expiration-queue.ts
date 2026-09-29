import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

//interface describing the data/props of the jobs that we will save in redis
interface Payload {
    orderId: string;
}

//setting up the expiration queue in redis
const expirationQueue = new Queue<Payload>("order:expiration", {
    redis: {
        host: process.env.REDIS_HOST
    }
});

//publish an expiration:complete event (need to create a publisher)
expirationQueue.process(async (job) => {
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId,
    })
});

export {expirationQueue};