import { AnyD1Database, drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono'
import auth from './routes/auth';
import { jwt } from 'hono/jwt';
import user from './routes/user';
import { sessions } from './db/schema';
import { eq, gte } from 'drizzle-orm';
type Bindings = {
  "my_db": AnyD1Database;
  "jwt_secret": string;
}

const app = new Hono<{ Bindings: Bindings }>()

const AuthMiddleware = async (c: any, next: any) => {
  const db = drizzle(c.env.my_db)
  const token = c.req.header("Authorization")?.split(" ")[1];
  console.log(token)
  const session = await db.select().from(sessions)
    .where(eq(sessions.token, token))
    .where(gte(sessions.expiresAt, new Date().toISOString()))
    .get();
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  c.set("userId", session.userId.toString())
  await next()
}
app.use('/user/*', AuthMiddleware)
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/auth", auth)
app.route("/user", user)
export default app
