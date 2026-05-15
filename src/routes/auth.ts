import { compare, hash } from "bcryptjs";
import { AnyD1Database, drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import { sign } from "hono/jwt";

type Bindings = {
    "my_db": AnyD1Database;
    "jwt_secret": string;
}
const auth = new Hono<{ Bindings: Bindings }>()

auth.post("/register", async (c) => {
    try {
        let username, password;
        try {
            const body = await c.req.json();
            username = body.username;
            password = body.password;
        } catch (e) {
            return c.json({ error: "Invalid or missing JSON body" }, 400);
        }

        if (!username || !password) {
            return c.json({ error: "Username and password are required" }, 400);
        }

        const db = drizzle(c.env.my_db)
        const hashedPassword = await hash(password, 12);

        await db.insert(users).values({
            username,
            password: hashedPassword,
        })

        return c.json({ message: "User registered successfully" }, 201)
    }
    catch (error: any) {
        if (error.message?.includes("UNIQUE") || error.cause?.message?.includes("UNIQUE")) {
            return c.json({ error: "Username already exists" }, 400)
        }
        return c.json({ error: error.message || "Registration failed" }, 400)
    }
})
auth.post("/login", async (c) => {
    try {
        let username, password;
        try {
            const body = await c.req.json();
            username = body.username;
            password = body.password;
        } catch (e) {
            return c.json({ error: "Invalid or missing JSON body" }, 400);
        }

        if (!username || !password) {
            return c.json({ error: "Username and password are required" }, 400);
        }

        const db = drizzle(c.env.my_db)
        const user = await db.select().from(users).where(eq(users.username, username)).get();
        if (!user) {
            return c.json({ error: "User not found" }, 404)
        }
        const validPassword = await compare(password, user.password);
        if (!validPassword) {
            return c.json({ error: "Invalid password" }, 401)
        }
        const token = await hash(password + username + user.id, 12)
        const session = await db.insert(sessions).values({
            userId: user.id,
            token: token,
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
        })

        return c.json({
            message: "Login successful",
            user: user,
            token: token,
        }, 200)
    } catch (error: any) {
        return c.json({ error: error.message || "Login failed" }, 400)
    }
})
export default auth