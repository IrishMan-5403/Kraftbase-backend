import { Field, InputType } from "type-graphql";

@InputType("RegisterRestaurantInput")
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

@InputType("LoginRestaurantInput")
export class LoginRestaurantInput {
    @Field()
    email!:string;

    @Field()
    password!:string;
}


