import { Field, InputType } from "type-graphql";

@InputType("RegistUserInput")
export class RegisterUserInput {
   
    @Field()
    name!: string;

    @Field()
    email!:string;

    @Field()
    password!:string;  

};


@InputType("LoginUserInput")
export class LoginUserInput {
    @Field()
    email!:string;

    @Field()
    password!:string;
}