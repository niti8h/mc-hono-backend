import { Hono } from "hono";

type Bindings = { my_db: D1Database; }

const users = new Hono<{ Bindings: Bindings }>()

// GET /api/v1/users/search?q=
users.get("/search", async (c) => {
    try {
        const q = (c.req.query("q") || "").trim();
        if (!q) return c.json({ users: [] });

        const { results } = await c.env.my_db.prepare(`
            SELECT u.id, u.username, u.avatar_url, u.bio, u.created_at,
                COUNT(DISTINCT m.id) as listing_count
            FROM users u LEFT JOIN madarchods m ON m.created_by = u.id
            WHERE u.username LIKE ? GROUP BY u.id ORDER BY listing_count DESC LIMIT 20
        `).bind(`%${q}%`).all();

        return c.json({ users: results });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
});

// GET /api/v1/users/me
users.get("/me", async (c) => {
    try {
        const userId = c.get("userId");
        const user = await c.env.my_db.prepare(
            "SELECT id, username, avatar_url, bio, created_at FROM users WHERE id = ?"
        ).bind(userId).first();
        if (!user) return c.json({ error: "Not found" }, 404);

        const { results: listings } = await c.env.my_db.prepare(`
            SELECT m.*,
                COALESCE(SUM(CASE WHEN v.vote_type='up' THEN 1 ELSE 0 END),0) as upvotes,
                COALESCE(SUM(CASE WHEN v.vote_type='down' THEN 1 ELSE 0 END),0) as downvotes
            FROM madarchods m LEFT JOIN madarchod_votes v ON m.id=v.madarchod_id
            WHERE m.created_by=? AND m.is_admin_disabled = 0
            GROUP BY m.id ORDER BY m.created_at DESC
        `).bind(userId).all();

        return c.json({ user, listings });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
});

// PUT /api/v1/users/me
users.put("/me", async (c) => {
    try {
        const userId = c.get("userId");
        const { bio, avatar_url } = await c.req.json();

        await c.env.my_db.prepare(
            "UPDATE users SET bio = COALESCE(?, bio), avatar_url = COALESCE(?, avatar_url) WHERE id = ?"
        ).bind(bio ?? null, avatar_url ?? null, userId).run();

        const updated = await c.env.my_db.prepare(
            "SELECT id, username, avatar_url, bio, created_at FROM users WHERE id = ?"
        ).bind(userId).first();

        return c.json({ user: updated });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
});

// GET /api/v1/users/:username — public profile
users.get("/:username", async (c) => {
    try {
        const username = c.req.param("username");
        const user = await c.env.my_db.prepare(
            "SELECT id, username, avatar_url, bio, created_at FROM users WHERE username = ?"
        ).bind(username).first();
        if (!user) return c.json({ error: "User not found" }, 404);

        const { results: listings } = await c.env.my_db.prepare(`
            SELECT m.*,
                COALESCE(SUM(CASE WHEN v.vote_type='up' THEN 1 ELSE 0 END),0) as upvotes,
                COALESCE(SUM(CASE WHEN v.vote_type='down' THEN 1 ELSE 0 END),0) as downvotes
            FROM madarchods m LEFT JOIN madarchod_votes v ON m.id=v.madarchod_id
            WHERE m.created_by=(SELECT id FROM users WHERE username=?) 
              AND m.is_admin_disabled = 0 AND m.is_hidden = 0
            GROUP BY m.id ORDER BY upvotes DESC
        `).bind(username).all();

        return c.json({ user, listings });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
});

export default users;
