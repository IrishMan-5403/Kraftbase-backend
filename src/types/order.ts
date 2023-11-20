import { Field, InputType } from "type-graphql";
import  Restaurant  from "../entities/restaurant";
import User from "../entities/user";
import Pizza from "../entities/pizza";

@InputType("AddOrderInput")
export class AddOrderInput {
   
    @Field()
    paid!: boolean;
    
    @Field()
    restaurant_id!:string;

    @Field(()=> [String])
    pizzaIds!:string[]

    @Field()
    status!: string;

};