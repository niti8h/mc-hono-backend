import { Hono } from "hono";

type Bindings = {
    my_db: D1Database;
}

const listings = new Hono<{ Bindings: Bindings }>()

// GET /api/v1/listings — paginated, filterable list
listings.get("/", async (c) => {
    try {
        const db = c.env.my_db;
        const userId = c.get("userId");
        const page = parseInt(c.req.query("page") || "1");
        const limit = parseInt(c.req.query("limit") || "20");
        const category = c.req.query("category") || "";
        const search = c.req.query("search") || "";
        const offset = (page - 1) * limit;

        const conditions: string[] = ["m.is_admin_disabled = 0", "m.is_hidden = 0"];
        const binds: any[] = [];
        if (category) { conditions.push("m.category = ?"); binds.push(category); }
        if (search) { 
            conditions.push("(m.name LIKE ? OR m.alias LIKE ? OR m.description LIKE ? OR u.username LIKE ?)"); 
            binds.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`); 
        }

        const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";
        binds.push(limit, offset);

        const { results } = await db.prepare(`
            SELECT m.*, u.username as creator_name, u.avatar_url as creator_avatar,
                COALESCE(SUM(CASE WHEN v.vote_type='up' THEN 1 ELSE 0 END),0) as upvotes,
                COALESCE(SUM(CASE WHEN v.vote_type='down' THEN 1 ELSE 0 END),0) as downvotes,
                COUNT(DISTINCT cmt.id) as comment_count
            FROM madarchods m
            LEFT JOIN users u ON m.created_by = u.id
            LEFT JOIN madarchod_votes v ON m.id = v.madarchod_id
            LEFT JOIN madarchod_comments cmt ON m.id = cmt.madarchod_id
            ${where}
            GROUP BY m.id ORDER BY m.created_at DESC LIMIT ? OFFSET ?
        `).bind(...binds).all();

        const withVotes = await Promise.all((results as any[]).map(async (m) => {
            let userVote = null;
            if (userId) {
                const v = await db.prepare("SELECT vote_type FROM madarchod_votes WHERE madarchod_id=? AND user_id=?").bind(m.id, userId).first<{ vote_type: string }>();
                if (v) userVote = v.vote_type;
            }
            return { ...m, userVote };
        }));

        return c.json({ listings: withVotes, page, limit });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
});

// GET /api/v1/listings/rankings?type=today|alltime|most_commented
listings.get("/rankings", async (c) => {
    try {
        const db = c.env.my_db;
        const userId = c.get("userId");
        const type = c.req.query("type") || "alltime";

        const dateCond = type === "today" ? "AND DATE(m.created_at) = DATE('now')" : "";
        const orderBy = type === "most_commented" ? "comment_count DESC" : "upvotes DESC";

        const { results } = await db.prepare(`
            SELECT m.*, u.username as creator_name, u.avatar_url as creator_avatar,
                COALESCE(SUM(CASE WHEN v.vote_type='up' THEN 1 ELSE 0 END),0) as upvotes,
                COALESCE(SUM(CASE WHEN v.vote_type='down' THEN 1 ELSE 0 END),0) as downvotes,
                COUNT(DISTINCT cmt.id) as comment_count
            FROM madarchods m
            LEFT JOIN users u ON m.created_by = u.id
            LEFT JOIN madarchod_votes v ON m.id = v.madarchod_id
            LEFT JOIN madarchod_comments cmt ON m.id = cmt.madarchod_id
            WHERE m.is_admin_disabled = 0 AND m.is_hidden = 0 ${dateCond}
            GROUP BY m.id ORDER BY ${orderBy} LIMIT 20
        `).all();

        const ranked = await Promise.all((results as any[]).map(async (m, idx) => {
            let userVote = null;
            if (userId) {
                const v = await db.prepare("SELECT vote_type FROM madarchod_votes WHERE madarchod_id=? AND user_id=?").bind(m.id, userId).first<{ vote_type: string }>();
                if (v) userVote = v.vote_type;
            }
            return { ...m, rank: idx + 1, userVote };
        }));

        return c.json({ rankings: ranked, type });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
});

// GET /api/v1/listings/:id — detail + comments
listings.get("/:id", async (c) => {
    try {
        const id = c.req.param("id");
        const db = c.env.my_db;

        const listing = await db.prepare(`
            SELECT m.*, u.username as creator_name, u.avatar_url as creator_avatar,
                COALESCE(SUM(CASE WHEN v.vote_type='up' THEN 1 ELSE 0 END),0) as upvotes,
                COALESCE(SUM(CASE WHEN v.vote_type='down' THEN 1 ELSE 0 END),0) as downvotes,
                COUNT(DISTINCT cmt.id) as comment_count
            FROM madarchods m
            LEFT JOIN users u ON m.created_by = u.id
            LEFT JOIN madarchod_votes v ON m.id = v.madarchod_id
            LEFT JOIN madarchod_comments cmt ON m.id = cmt.madarchod_id
            WHERE m.id = ? AND m.is_admin_disabled = 0 AND m.is_hidden = 0 GROUP BY m.id
        `).bind(id).first();

        if (!listing) return c.json({ error: "Not found" }, 404);

        const { results: comments } = await db.prepare(`
            SELECT c.*, u.username, u.avatar_url FROM madarchod_comments c
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.madarchod_id = ? ORDER BY c.created_at DESC
        `).bind(id).all();

        return c.json({ listing, comments });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
});

// POST /api/v1/listings — create listing
listings.post("/", async (c) => {
    try {
        const userId = c.get("userId");
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const body = await c.req.json();
        const { name, alias, location, category, description, person_image, evidence_image } = body;

        if (!name || !description) return c.json({ error: "Name and description are required" }, 400);

        const createdAt = new Date().toISOString();
        const cat = category || "General";
        const fallbackImg = `https://api.dicebear.com/8.x/shapes/svg?seed=${encodeURIComponent(name)}`;

        const result = await c.env.my_db.prepare(`
            INSERT INTO madarchods (name, alias, location, category, description, person_image, evidence_image, image, created_at, created_by)
            VALUES (?,?,?,?,?,?,?,?,?,?) RETURNING *
        `).bind(name, alias||null, location||null, cat, description, person_image||null, evidence_image||null, person_image||fallbackImg, createdAt, userId).first();

        return c.json({ message: "Madarchod listed. They can't hide now.", listing: result }, 201);
    } catch (e: any) { return c.json({ error: e.message }, 500); }
});

// POST /api/v1/listings/:id/vote
listings.post("/:id/vote", async (c) => {
    try {
        const listingId = c.req.param("id");
        const userId = c.get("userId");
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const { voteType } = await c.req.json();
        if (!["up", "down"].includes(voteType)) return c.json({ error: "Invalid vote type" }, 400);

        await c.env.my_db.prepare(`
            INSERT INTO madarchod_votes (madarchod_id, user_id, vote_type, created_at)
            VALUES (?,?,?,?)
            ON CONFLICT(madarchod_id, user_id) DO UPDATE SET vote_type = excluded.vote_type
        `).bind(listingId, userId, voteType, new Date().toISOString()).run();

        return c.json({ message: "Vote registered" });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
});

// POST /api/v1/listings/:id/comments
listings.post("/:id/comments", async (c) => {
    try {
        const listingId = c.req.param("id");
        const userId = c.get("userId");
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const { comment } = await c.req.json();
        if (!comment?.trim()) return c.json({ error: "Comment cannot be empty" }, 400);

        const result = await c.env.my_db.prepare(`
            INSERT INTO madarchod_comments (madarchod_id, user_id, comment, created_at)
            VALUES (?,?,?,?) RETURNING *
        `).bind(listingId, userId, comment.trim(), new Date().toISOString()).first();

        return c.json({ comment: result }, 201);
    } catch (e: any) { return c.json({ error: e.message }, 500); }
});

// PUT /api/v1/listings/:id/visibility (toggle is_hidden)
listings.put("/:id/visibility", async (c) => {
    try {
        const id = c.req.param("id");
        const userId = c.get("userId");
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const db = c.env.my_db;
        const listing = await db.prepare("SELECT created_by, is_hidden FROM madarchods WHERE id = ?").bind(id).first<{ created_by: number, is_hidden: number }>();
        if (!listing) return c.json({ error: "Not found" }, 404);
        if (listing.created_by !== userId) return c.json({ error: "Forbidden: You don't own this listing" }, 403);

        const newVisibility = listing.is_hidden ? 0 : 1;
        await db.prepare("UPDATE madarchods SET is_hidden = ? WHERE id = ?").bind(newVisibility, id).run();
        return c.json({ message: "Visibility updated", is_hidden: newVisibility });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
});

// DELETE /api/v1/listings/:id
listings.delete("/:id", async (c) => {
    try {
        const id = c.req.param("id");
        const userId = c.get("userId");
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const db = c.env.my_db;
        const listing = await db.prepare("SELECT created_by FROM madarchods WHERE id = ?").bind(id).first<{ created_by: number }>();
        if (!listing) return c.json({ error: "Not found" }, 404);
        if (listing.created_by !== userId) return c.json({ error: "Forbidden: You don't own this listing" }, 403);

        // Delete associated comments and votes first (foreign key constraints or manual cleanup)
        await db.prepare("DELETE FROM madarchod_comments WHERE madarchod_id = ?").bind(id).run();
        await db.prepare("DELETE FROM madarchod_votes WHERE madarchod_id = ?").bind(id).run();
        await db.prepare("DELETE FROM madarchods WHERE id = ?").bind(id).run();
        
        return c.json({ message: "Listing permanently deleted" });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
});

export default listings;
