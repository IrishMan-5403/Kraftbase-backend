import dotenv from "dotenv";
import User from "../entities/user";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../utils/context";
import { LoginUserInput, RegisterUserInput } from "../types/user";

dotenv.config();
@Resolver()
export class UserResolver {
    @Mutation(() => Boolean)
    async registerUser(
        @Arg("data") data: RegisterUserInput,
        @Ctx() { res }: MyContext
    ): Promise<Boolean> {
        if(await User.findOne({ where: { email: data.email } })) throw new Error("User already exists");
        const pass=await bcrypt.hash(data.password, 12);
        const user = await User.create({
            ...data,
              password:pass
        }).save();

        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
        res.cookie("token", token, { httpOnly: false });

        return !!user;
    }

    @Mutation(() => Boolean)
    async loginUser(
        @Arg("data") data: LoginUserInput,
        @Ctx() { res }: MyContext
    ): Promise<Boolean> {
        const user = await User.findOne({ where: { email: data.email } });
        if(!user) throw new Error("Invalid Credentials");
        const pass= await bcrypt.hash(data.password,12)
        if(await bcrypt.compare(pass, user.password)) throw new Error("Invalid password");

        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret");
        res.cookie("token", token, { httpOnly: false });

        return !!user;
    }

    @Mutation(() => Boolean)
    async logoutUser(@Ctx() { res }: any): Promise<Boolean> {
        res.clearCookie("token");
        return true;
    }

    @Query(() => [User])
    async getUsers(): Promise<User[]> {
        return await User.find()
    }
}