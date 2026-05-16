import { AnyD1Database, drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono'
import auth from './routes/auth';
import { jwt } from 'hono/jwt';
import user from './routes/user';
import { sessions } from './db/schema';
import { eq, gte } from 'drizzle-orm';
import { Layout } from './components/Layout';
import { Home } from './components/Home';

type Bindings = {
  "my_db": AnyD1Database;
  "jwt_secret": string;
}

const app = new Hono<{ Bindings: Bindings }>()

const AuthMiddleware = async (c: any, next: any) => {
  const db = drizzle(c.env.my_db)
  const token = c.req.header("Authorization")?.split(" ")[1];
  console.log(token)
  const session_id = token.split("|")[0]
  const token_part = token.split("|")[1]
  const session = await db.select().from(sessions)
    .where(eq(sessions.id, session_id))
    .get();
  if (!session || session?.token !== token_part || new Date(session.expiresAt) < new Date()) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  c.set("userId", session.userId.toString())
  await next()
}
app.use('/user/*', AuthMiddleware)
app.get('/', (c) => {
  return c.html(
    <Layout title="Home" description="The Permanent Archive">
      <Home />
    </Layout>
  )
})

app.route("/auth", auth)
app.route("/user", user)

app.get("/test", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>HTMX Test</title>
        <script src="https://unpkg.com/htmx.org@2.0.0"></script>
    </head>
    <body style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #0f172a; color: white; font-family: sans-serif;">
        <button hx-get="/test1" hx-target="this" hx-swap="outerHTML" style="padding: 12px 24px; font-size: 16px; cursor: pointer; background: #3b82f6; color: white; border: none; border-radius: 8px;">
            Click Me
        </button>
    </body>
    </html>
  `)
})
app.get("/test1", (c) => {
  return c.html(`<button hx-get="/test2" hx-target="this" hx-swap="outerHTML" style="padding: 12px 24px; font-size: 16px; cursor: pointer; background: #10b981; color: white; border: none; border-radius: 8px;">Click Me too </button>`)
})
app.get("/test2", (c) => {
  return c.html(`<div style="padding: 12px 24px; font-size: 18px; color: #f8fafc; background: #1e293b; border-radius: 8px; border: 1px solid #334155;">All done! 🎉</div>`)
})
export default app
