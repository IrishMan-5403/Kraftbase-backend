import dotenv from "dotenv";
import Restaurant from "../entities/restaurant";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../utils/context";
import { Pizza } from "../entities/pizza";
import { AddPizzaInput } from "../types/pizza";

dotenv.config();
@Resolver()
export class PizzaResolver {
    @Mutation(() => Boolean)
    async addPizza(
        @Arg("data") data: AddPizzaInput,
        // @Ctx() {restaurant}: MyContext
    ): Promise<Boolean> {
        // if(!restaurant) throw new Error("Restaurant not logged in")
        const restaurant= await Restaurant.findOne ({where:{ id:data.restaurant_id}})
        if(!restaurant) throw new Error("Restaurant Id invalid")
        const peeza=await Pizza.findOne({ where: { name: data.name, restaurant: {id: data.restaurant_id}}
        })
        if(peeza) throw new Error("Pizza already exists");

        const pizza = await Pizza.create({
            ...data,
            restaurant:restaurant
        }).save();  

        return !!pizza;
    }
    @Mutation(() => Boolean)
    async deletePizza(@Arg('id') id:string):Promise<Boolean> {
        try {
            const result = await Pizza.delete(id);
      
            if (result.affected === 0) {
              throw new Error('Pizza not found');
            }
      
            return !(result.affected ===0);
          } catch (err:any) {
            throw new Error(`Error deleting pizza: ${err.message}`);
        }
    }

    @Query(() => [Pizza])
    async getPizzasbyRestaurant(@Arg('restaurantId') restaurantId: string): Promise<Pizza[]> {
        return await Pizza.find({ where: { restaurant:{id:restaurantId}} })
    }
}