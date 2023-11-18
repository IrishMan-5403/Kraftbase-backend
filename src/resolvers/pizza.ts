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
        // @Ctx() {res} :MyContext
    ): Promise<Boolean> {
        // const restaurant=await Restaurant.findOneOrFail({ where: {id:data.restaurant_id}})
        const peeza=await Pizza.findOne({ where: { name: data.name, restaurant: {id: data.restaurant_id}}
            // , relations: ["restaurant"]
        })
        if(peeza) throw new Error("Pizza already exists");

        const pizza = await Pizza.create({
            ...data,
        }).save();  

        return !!pizza;
    }

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
}