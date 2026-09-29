import express from "express";
import { currentUser } from "@mb_ticket/common";
import { requireAuth } from "@mb_ticket/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser , (req, res) => {
    //now we get the current user from the currentUser middleware, and if it
    //doesnt exist we will return null
    res.send({currentUser: req.currentUser || null});
    
})

export {router as currentUserRouter};