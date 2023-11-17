import { Field, InputType } from "type-graphql";

@InputType("EventInput")
export class RegisterRestaurantInput {
   
    @Field()
    name!: string;

    @Field()
    email!:string;

    @Field()
    password!:string;
    
    @Field()
    description!: string;

    @Field()
    location!:string;

    @Field()
    online!:boolean;

};

export class LoginRestaurantInput {
    @Field()
    email!:string;

    @Field()
    password!:string;
}
