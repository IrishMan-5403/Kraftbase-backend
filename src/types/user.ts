import { Field, InputType } from "type-graphql";

@InputType("EventInput")
export class RegisterUserInput {
   
    @Field()
    name!: string;

    @Field()
    email!:string;

    @Field()
    password!:string;  

};

export class LoginUserInput {
    @Field()
    email!:string;

    @Field()
    password!:string;
}