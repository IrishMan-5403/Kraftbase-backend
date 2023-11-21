import dotenv from "dotenv";
import Restaurant from "../entities/restaurant";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../utils/context";
import Order from "../entities/order";
import { AddOrderInput, ChangeOrderStatusInput } from "../types/order";
import Pizza from "../entities/pizza";
import { In } from "typeorm";
import User from "../entities/user";

dotenv.config();
@Resolver()
export class OrderResolver {
    @Mutation(() => Boolean)
    async addOrder(
        @Arg("data") data: AddOrderInput,
        // @Ctx() {user}:MyContext
    ): Promise<Boolean> {
        const user= await User.findOneOrFail({where:{id:data.user_id}})
        const restaurant = await Restaurant.findOneOrFail({where :{id:data.restaurant_id}})
        const pizzas = await Pizza.findBy({id: In(data.pizzaIds)})
        const order= await Order.create({
            ...data,
            pizzas,
            restaurant,
            user:user
        }).save();  
        return !!order;
    }

    @Mutation(()=>Boolean)
    async changeOrderStatus(
        @Arg('data') data:ChangeOrderStatusInput
    ):Promise<Boolean> {
        try {
            const order = await Order.findOne({where:{id:data.order_id}});
        
            if (!order) {
              throw new Error('Order not found');
            }
        
            order.status = data.new_status;
            await order.save();
        
            return true;
          } catch (err: any) {
            throw new Error(`Error changing order status: ${err.message}`);
          }
    }

    @Query(() => [Order])
    async getOrdersbyRestaurant(@Arg('restaurantId') restaurantId: string): Promise<Order[]> {
        return await Order.find({where :{restaurant:{id:restaurantId}}})
    }

    @Query(()=>[Order])
    async getOrdersbyUser(@Arg('userId') userId: string): Promise<Order[]> {
        return await Order.find({ where: { user:{id:userId}} })
    }
}