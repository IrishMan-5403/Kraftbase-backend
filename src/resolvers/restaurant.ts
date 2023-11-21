import dotenv from "dotenv";
import Restaurant from "../entities/restaurant";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../utils/context";
import {RegisterRestaurantInput , LoginRestaurantInput} from "../types/restaurant";
import { idText } from "typescript";

dotenv.config();
@Resolver()
export class RestaurantResolver {
    @Mutation(() => Boolean)
    async registerRestaurant(
        @Arg("data") data: RegisterRestaurantInput,
        @Ctx() { res }: MyContext
    ): Promise<Boolean> {
        if(await Restaurant.findOne({ where: { email: data.email } })) throw new Error("Restaurant already exists");
        const pass=await bcrypt.hash(data.password, 12);
        const restaurant = await Restaurant.create({
            ...data,
            password:pass
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
        const pass=await bcrypt.hash(data.password, 12);
        if(await bcrypt.compare(pass, restaurant.password)) throw new Error("Invalid password");

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
    async deleteRestaurant(@Arg('id') id:number):Promise<Boolean> {
        try {
            const result = await Restaurant.delete(id);
      
            if (result.affected === 0) {
              throw new Error('Restaurant not found');
            }
      
            return !(result.affected ===0);
          } catch (err:any) {
            throw new Error(`Error deleting restaurant: ${err.message}`);
          }
        }
    
    
    @Mutation(()=>Boolean)
    async changeRestaurantStatus(
        @Arg('restaurant_id') restaurant_id:string,
        // @Ctx ('restaurant') resttaurant:MyContext
    ):Promise<Boolean> {
        try {
            const restaurant = await Restaurant.findOne({where:{id:restaurant_id}});
        
            if (!restaurant) {
              throw new Error('Restaurant not logged in');
            }
        
            restaurant.online = !restaurant.online;
            await restaurant.save();
        
            return true;
          } catch (err: any) {
            throw new Error(`Error changing order status: ${err.message}`);
          }
    }

    @Query(() => [Restaurant])
    async getRestaurants(): Promise<Restaurant[]> {
        return await Restaurant.find()
    }
}