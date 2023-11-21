import { Field, InputType } from "type-graphql";
import  Restaurant  from "../entities/restaurant";
import User from "../entities/user";
import Pizza from "../entities/pizza";

@InputType("AddOrderInput")
export class AddOrderInput {
   
    @Field()
    paid!: boolean;

    @Field()
    user_id!:string;
    
    @Field()
    restaurant_id!:string;

    @Field(()=> [String])
    pizzaIds!:string[]

    @Field()
    status!: string;

};

@InputType("ChangeOrderStatusInput")
export class ChangeOrderStatusInput{
    @Field()
    order_id!:string;

    @Field()
    new_status!:string;
}