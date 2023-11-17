import dotenv from "dotenv";
import Restaurant from "../entities/restaurant";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../utils/context";
import {RegisterRestaurantInput , LoginRestaurantInput} from "../types/restaurant";

dotenv.config();
@Resolver()
export class RestaurantResolver {
    @Mutation(() => Boolean)
    async registerRestaurant(
        @Arg("data") data: RegisterRestaurantInput,
        @Ctx() { res }: MyContext
    ): Promise<Boolean> {
        if(await Restaurant.findOne({ where: { email: data.email } })) throw new Error("Restaurant already exists");

        const restaurant = await Restaurant.create({
            ...data,
        }).save();

        let token = jwt.sign({ id: restaurant.id }, process.env.JWT_SECRET!);
        res.cookie("token", token, { httpOnly: false });

        return !!restaurant;
    }

    @Mutation(() => Boolean)
    async loginRestaurant(
        @Arg("data") data: LoginRestaurantInput,
        @Ctx() { res }: MyContext
    ): Promise<Boolean> {
        const restaurant = await Restaurant.findOne({ where: { email: data.email } });
        if(!restaurant) throw new Error("Invalid Credentials");
        if(await bcrypt.compare(data.password, restaurant.password)) throw new Error("Invalid password");

        let token = jwt.sign({ id: restaurant.id }, process.env.JWT_SECRET || "secret");
        res.cookie("token", token, { httpOnly: false });

        return !!Restaurant;
    }

    @Mutation(() => Boolean)
    async logoutRestaurant(@Ctx() { res }: any): Promise<Boolean> {
        res.clearCookie("token");
        return true;
    }

    @Mutation(()=> Boolean)
    async deleteRestaurant(@Ctx() {res}:any):Promise<Boolean> {
        
    }

    @Query(() => [Restaurant])
    async getRestaurants(): Promise<Restaurant[]> {
        return await Restaurant.find()
    }
}