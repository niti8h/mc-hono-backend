import { Hono } from "hono";
import { AnyD1Database } from "drizzle-orm/d1";

type Bindings = {
    "my_db": AnyD1Database;
    "jwt_secret": string;
}
const user = new Hono<{ Bindings: Bindings }>()

user.get("/profile", (c) => {
    return c.text(c.get("userId"));
})
export default user