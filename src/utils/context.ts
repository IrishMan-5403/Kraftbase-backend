import { Request, Response } from "express";
import User from "../entities/user";
import { Restaurant } from "../entities/restaurant";
import Pizza from "../entities/pizza";

export interface MyContext {
    res: Response
    req: Request
    user?: User
    restaurant?:Restaurant
}