import dotenv from "dotenv";
import Restaurant from "../entities/restaurant";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../utils/context";
import { Pizza } from "../entities/pizza";

dotenv.config();
@Resolver()
export class PizzaResolver {
    @Mutation(() => Boolean)
    async addPizza(
        @Arg("data") data: AddPizzaInput,
        @Ctx() { res }: MyContext
    ): Promise<Boolean> {
        if(await Pizza.findOne({ where: { name: data.name, restaurant:data.restaurant  } })) throw new Error("Pizza already exists");

        const restaurant = await Pizza.create({
            ...data,
        }).save();

        

        return !!restaurant;
    }