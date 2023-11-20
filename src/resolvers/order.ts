import dotenv from "dotenv";
import Restaurant from "../entities/restaurant";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../utils/context";
import Order from "../entities/order";
import { AddOrderInput } from "../types/order";
import Pizza from "../entities/pizza";
import { In } from "typeorm";

dotenv.config();
@Resolver()
export class OrderResolver {
    @Mutation(() => Boolean)
    async addOrder(
        @Arg("data") data: AddOrderInput,
        @Ctx() {user}:MyContext
    ): Promise<Boolean> {

        const restaurant = await Restaurant.findOneOrFail({where :{id:data.restaurant_id}})
        const pizzas = await Pizza.findBy({id: In(data.pizzaIds)})
        const order= await Order.create({
            ...data,
            pizzas,
            restaurant,
            user
        }).save();  
        return !!order;
    }

    // async changeOrderStatus(@Arg('id') id:string):Promise<Boolean> {
    //     // try {
    //     //     const result = await Order.delete(id);
      
    //     //     if (result.affected === 0) {
    //     //       throw new Error('Pizza not found');
    //     //     }
      
    //     //     return !(result.affected ===0);
    //     //   } catch (err:any) {
    //     //     throw new Error(`Error deleting pizza: ${err.message}`);
    //     return true
    //     // }?
    // }

    @Query(() => [Order])
    async getOrdersbyRestaurant(@Arg('restaurantId') restaurantId: string): Promise<Order[]> {
        return await Order.find({where :{restaurant:{id:restaurantId}}})
    }

    @Query(()=>[Order])
    async getOrdersbyUser(@Arg('userId') userId: string): Promise<Order[]> {
        return await Order.find({ where: { user:{id:userId}} })
    }
}