import { Hono } from "hono";

type Bindings = {
    "my_db": D1Database;
    "jwt_secret": string;
}

const madarchod = new Hono<{ Bindings: Bindings }>()

madarchod.get("/", async (c) => {
    try {
        const db = c.env.my_db;
        
        // Fetch all madarchods
        const { results: mResults } = await db.prepare("SELECT * FROM madarchods ORDER BY created_at DESC").all();
        
        // Enhance with votes
        const madarchods = await Promise.all(mResults.map(async (m) => {
            const { results: votes } = await db.prepare("SELECT vote_type, COUNT(*) as count FROM madarchod_votes WHERE madarchod_id = ? GROUP BY vote_type").bind(m.id).all();
            
            let upvotes = 0;
            let downvotes = 0;
            
            votes.forEach((v: any) => {
                if (v.vote_type === 'up') upvotes = v.count;
                if (v.vote_type === 'down') downvotes = v.count;
            });
            
            // Check user's own vote
            const userId = c.get("userId");
            let userVote = null;
            if (userId) {
                const myVote = await db.prepare("SELECT vote_type FROM madarchod_votes WHERE madarchod_id = ? AND user_id = ?").bind(m.id, userId).first();
                if (myVote) userVote = myVote.vote_type;
            }

            return {
                ...m,
                upvotes,
                downvotes,
                userVote
            };
        }));
        
        return c.json({ madarchods });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

madarchod.post("/", async (c) => {
    try {
        const body = await c.req.parseBody();
        const name = body.name as string;
        const description = body.description as string;
        const image = body.image as string || "https://picsum.photos/400/400?random=" + Math.floor(Math.random() * 100);
        const userId = c.get("userId");

        if (!userId) return c.json({ error: "Unauthorized" }, 401);
        if (!name || !description) return c.json({ error: "Name and description are required" }, 400);

        const createdAt = new Date().toISOString();

        const result = await c.env.my_db.prepare(
            "INSERT INTO madarchods (name, description, image, created_at, created_by) VALUES (?, ?, ?, ?, ?) RETURNING *"
        ).bind(name, description, image, createdAt, userId).first();

        return c.json({ message: "Madarchod added successfully", madarchod: result }, 201);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

madarchod.post("/:id/vote", async (c) => {
    try {
        const madarchodId = c.req.param("id");
        const body = await c.req.json();
        const voteType = body.voteType; // 'up' or 'down'
        const userId = c.get("userId");

        if (!userId) return c.json({ error: "Unauthorized" }, 401);
        if (!['up', 'down'].includes(voteType)) return c.json({ error: "Invalid vote type" }, 400);

        const db = c.env.my_db;
        const createdAt = new Date().toISOString();

        // Use UPSERT for SQLite
        await db.prepare(
            `INSERT INTO madarchod_votes (madarchod_id, user_id, vote_type, created_at) 
             VALUES (?, ?, ?, ?)
             ON CONFLICT(madarchod_id, user_id) DO UPDATE SET vote_type = ?`
        ).bind(madarchodId, userId, voteType, createdAt, voteType).run();

        return c.json({ message: "Vote registered" });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

madarchod.get("/:id", async (c) => {
    try {
        const id = c.req.param("id");
        const db = c.env.my_db;
        
        const madarchodInfo = await db.prepare(
            "SELECT m.*, u.username as creator_name FROM madarchods m LEFT JOIN users u ON m.created_by = u.id WHERE m.id = ?"
        ).bind(id).first();

        if (!madarchodInfo) return c.json({ error: "Not found" }, 404);

        const { results: comments } = await db.prepare(
            "SELECT c.*, u.username FROM madarchod_comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.madarchod_id = ? ORDER BY c.created_at DESC"
        ).bind(id).all();

        return c.json({ madarchod: madarchodInfo, comments });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

madarchod.post("/:id/comments", async (c) => {
    try {
        const madarchodId = c.req.param("id");
        const body = await c.req.json();
        const comment = body.comment;
        const userId = c.get("userId");

        if (!userId) return c.json({ error: "Unauthorized" }, 401);
        if (!comment) return c.json({ error: "Comment is required" }, 400);

        const createdAt = new Date().toISOString();

        const result = await c.env.my_db.prepare(
            "INSERT INTO madarchod_comments (madarchod_id, user_id, comment, created_at) VALUES (?, ?, ?, ?) RETURNING *"
        ).bind(madarchodId, userId, comment, createdAt).first();

        return c.json({ message: "Comment added", comment: result }, 201);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

export default madarchod;
