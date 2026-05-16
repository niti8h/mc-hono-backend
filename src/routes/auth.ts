import { compare, hash } from "bcryptjs";
import { Hono } from "hono";

type Bindings = {
    "my_db": D1Database;
    "jwt_secret": string;
}

type User = {
    id: number;
    username: string;
    password: string;
    is_payment_verified: string;
    created_at: string;
}

const auth = new Hono<{ Bindings: Bindings }>()

auth.post("/register", async (c) => {
    try {
        const body = await c.req.parseBody();
        const username = body.username as string;
        const password = body.password as string;

        if (!username || !password) {
            return c.json({ error: "Username and password are required" }, 400);
        }

        const hashedPassword = await hash(password, 12);
        const createdAt = new Date().toISOString();

        await c.env.my_db.prepare(
            "INSERT INTO users (username, password, created_at) VALUES (?, ?, ?)"
        ).bind(username, hashedPassword, createdAt).run();
        return c.redirect("/auth?tab=login&type=success&message=Account+forged+successfully.+Sign+in.", 302)        // return c.json({ message: "User registered successfully" }, 201)
    }
    catch (error: any) {
        if (error.message?.includes("UNIQUE")) {
            return c.redirect("/auth?tab=register&type=error&message=Username+already+exists+in+the+void.", 302)
            // return c.json({ error: "Username already exists" }, 400)
        }
        return c.json({ error: error.message || "Registration failed" }, 400)
    }
})

auth.post("/login", async (c) => {
    try {
        const body = await c.req.parseBody();
        const username = body.username as string;
        const password = body.password as string;

        if (!username || !password) {
            return c.redirect("/auth?tab=login&type=error&message=Username+and+password+are+required.", 302)
        }

        const user = await c.env.my_db.prepare(
            "SELECT * FROM users WHERE username = ?"
        ).bind(username).first<User>();

        if (!user) {
            return c.redirect("/auth?tab=login&type=error&message=User+not+found.", 302)
        }

        const validPassword = await compare(password, user.password);
        if (!validPassword) {
            return c.redirect("/auth?tab=login&type=error&message=Invalid+password.", 302)
        }

        const token = await hash(password + username + user.id, 12)
        const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString();
        const createdAt = new Date().toISOString();

        const session = await c.env.my_db.prepare(
            "INSERT INTO sessions (user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?) RETURNING id"
        ).bind(user.id, token, expiresAt, createdAt).first<{ id: number }>();

        return c.json({
            message: "Login successful",
            user: { id: user.id, username: user.username },
            token: session?.id + "|" + token,
        }, 200)
    } catch (error: any) {
        return c.json({ error: error.message || "Login failed" }, 400)
    }
})

export default auth
