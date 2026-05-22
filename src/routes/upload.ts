import { Hono } from "hono";

type Bindings = { my_db: D1Database; MY_BUCKET: R2Bucket; }

const upload = new Hono<{ Bindings: Bindings }>()

upload.post("/", async (c) => {
    try {
        const userId = c.get("userId");
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const formData = await c.req.formData();
        const file = formData.get("file") as File | null;
        if (!file) return c.json({ error: "No file provided" }, 400);

        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowed.includes(file.type)) return c.json({ error: "Only JPEG, PNG, WebP allowed" }, 400);
        if (file.size > 5 * 1024 * 1024) return c.json({ error: "Max file size is 5MB" }, 400);

        const ext = file.name.split(".").pop() || "jpg";
        const key = `uploads/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        await c.env.MY_BUCKET.put(key, await file.arrayBuffer(), {
            httpMetadata: { contentType: file.type }
        });

        // In production, replace with your R2 public domain
        const publicUrl = `https://pub-madarchod.r2.dev/${key}`;
        return c.json({ url: publicUrl, key });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

export default upload;
