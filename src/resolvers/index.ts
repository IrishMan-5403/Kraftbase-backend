import { PizzaResolver } from "./pizza";
import { RestaurantResolver } from "./restaurant";
import { UserResolver } from "./user";

export default [UserResolver, PizzaResolver, RestaurantResolver] as const