import { OrderResolver } from "./order";
import { PizzaResolver } from "./pizza";
import { RestaurantResolver } from "./restaurant";
import { UserResolver } from "./user";

export default [UserResolver, PizzaResolver, RestaurantResolver,OrderResolver] as const