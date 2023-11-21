import { Field, InputType } from "type-graphql";
import { Restaurant } from "../entities/restaurant";

@InputType("AddPizzaInput")
export class AddPizzaInput {
   
    @Field()
    name!: string;
    
    @Field()
    description!: string;
    
    @Field()
    nonveg!: boolean;

    @Field()
    restaurant_id!:string;
        
    @Field()
    image!: string;

};
