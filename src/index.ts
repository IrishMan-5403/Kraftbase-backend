import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import express from "express";
import { json } from "body-parser";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import resolvers from "./resolvers";
import entities from "./entities";
import User from "./entities/pizza";
import { MyContext } from "./utils/context";
// import cookieParser from "cookie-parser";
import Restaurant from "./entities/restaurant";

dotenv.config();
const PORT = process.env.PORT;
const corsOrigin = ["http://localhost:8080", "http://localhost:3000"];


async function bootstrap() {
    const schema = await buildSchema({
        resolvers,
        validate: { forbidUnknownValues: false },
    });
    
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    

    app.use(
        "/graphql",
        cors<cors.CorsRequest>({
            origin: corsOrigin,
            credentials: true,
        }),
        json(),
        expressMiddleware(server, {
            context: async ({ req, res } : MyContext) => {
                let user: User | null = null;
                let restaurant: Restaurant | null = null;
                console.log(req.cookies)
                if (req.headers.cookie) {
                    console
                    const token = req.headers.cookie.split("token=")[1];
                    if (token) {
                        try {
                            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
                            user = await User.findOneOrFail({where: { id: decoded.id }});
                            restaurant = await Restaurant.findOneOrFail({where: { id: decoded.id }});

                        } catch(err: any) {
                            if(err.message === "jwt malformed") res.clearCookie("token");
                            else console.log("Some Other JWT error", err)
                        }
                    }
                }
                return { req, res, user };
            },
        })
    );

    await new Promise<void>((resolve) =>
        httpServer.listen({ port: PORT }, resolve)
    );
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
}

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    synchronize: true,
    logging: true,
    entities
});

AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized");
    bootstrap();
}).catch((err) => {
    console.error("Error during Data Source initialization", err);
});