require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'student',
                full_name TEXT
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS enrollments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                course_id INTEGER NOT NULL,
                enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                progress INTEGER DEFAULT 0,
                completed BOOLEAN DEFAULT FALSE,
                certificate_url TEXT,
                last_video_index INTEGER DEFAULT 0
            )
        `);

        await pool.query("ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS last_video_index INTEGER DEFAULT 0");
        await pool.query("ALTER TABLE courses ALTER COLUMN duration DROP NOT NULL");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                level TEXT NOT NULL,
                duration TEXT,
                enrollments INTEGER DEFAULT 0,
                rating DECIMAL(3,1) DEFAULT 0.0,
                rating_count INTEGER DEFAULT 0,
                image TEXT,
                about TEXT,
                description TEXT,
                outcomes TEXT[],
                requirements TEXT[],
                instructor_name TEXT,
                instructor_bio TEXT,
                instructor_image TEXT,
                topic TEXT,
                curriculum JSONB DEFAULT '[]'
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Database tables verified.");
    } catch (err) {
        console.error("DB Init Error:", err.message);
    }
};

initDb();

app.get("/api/courses", async (req, res) => {
    const { search, topic, level } = req.query;
    let query = `
        SELECT c.*, 
        COALESCE(r.avg_rating, 0) as rating, 
        COALESCE(r.total_reviews, 0) as rating_count,
        COALESCE(e.total_enrolls, 0) as enrollments
        FROM courses c
        LEFT JOIN (
            SELECT course_id, 
            ROUND(AVG(rating), 1) as avg_rating, 
            COUNT(*) as total_reviews
            FROM reviews
            GROUP BY course_id
        ) r ON c.id = r.course_id
        LEFT JOIN (
            SELECT course_id, COUNT(*) as total_enrolls 
            FROM enrollments 
            GROUP BY course_id
        ) e ON c.id = e.course_id
        WHERE 1=1`;
    let params = [];
    let idx = 1;
    if (search) { query += ` AND (c.title ILIKE $${idx} OR c.instructor_name ILIKE $${idx})`; params.push(`%${search}%`); idx++; }
    if (topic) { query += ` AND c.topic = ANY($${idx})`; params.push(Array.isArray(topic) ? topic : [topic]); idx++; }
    if (level) { query += ` AND c.level = ANY($${idx})`; params.push(Array.isArray(level) ? level : [level]); idx++; }
    query += " ORDER BY c.id ASC";
    try { const result = await pool.query(query, params); res.json(result.rows); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/courses/:id", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, 
            COALESCE(r.avg_rating, 0) as rating, 
            COALESCE(r.total_reviews, 0) as rating_count
            FROM courses c
            LEFT JOIN (
                SELECT course_id, 
                ROUND(AVG(rating), 1) as avg_rating, 
                COUNT(*) as total_reviews
                FROM reviews
                GROUP BY course_id
            ) r ON c.id = r.course_id
            WHERE c.id = $1`, [req.params.id]);
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/courses", async (req, res) => {
    const { title, level, image, about, description, topic, instructor_name, instructor_bio, instructor_image, outcomes, requirements, curriculum } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO courses (title, level, image, about, description, topic, instructor_name, instructor_bio, instructor_image, outcomes, requirements, curriculum) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
            [title, level, image, about, description, topic, instructor_name, instructor_bio, instructor_image, outcomes || [], requirements || [], JSON.stringify(curriculum || [])]
        );
        res.status(201).json({ id: result.rows[0].id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/courses/:id", async (req, res) => {
    const { title, level, image, about, description, topic, instructor_name, instructor_bio, instructor_image, outcomes, requirements, curriculum } = req.body;
    try {
        await pool.query(
            `UPDATE courses SET title=$1, level=$2, image=$3, about=$4, description=$5, topic=$6, instructor_name=$7, instructor_bio=$8, instructor_image=$9, outcomes=$10, requirements=$11, curriculum=$12 WHERE id=$13`,
            [title, level, image, about, description, topic, instructor_name, instructor_bio, instructor_image, outcomes, requirements, JSON.stringify(curriculum || []), req.params.id]
        );
        res.json({ message: "Updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete("/api/courses/:id", async (req, res) => {
    try { await pool.query("DELETE FROM courses WHERE id = $1", [req.params.id]); res.json({ message: "Deleted" }); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/courses/:id/reviews", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.*, u.full_name as user_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.course_id = $1 
            ORDER BY r.created_at DESC`, [req.params.id]);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/reviews", async (req, res) => {
    const { course_id, user_id, rating, comment } = req.body;
    try {
        await pool.query("INSERT INTO reviews (course_id, user_id, rating, comment) VALUES ($1, $2, $3, $4)", [course_id, user_id, rating, comment]);

        const stats = await pool.query("SELECT AVG(rating)::numeric(3,1) as avg_rating, COUNT(*) as count FROM reviews WHERE course_id = $1", [course_id]);
        await pool.query("UPDATE courses SET rating = $1, rating_count = $2 WHERE id = $3", [stats.rows[0].avg_rating, stats.rows[0].count, course_id]);

        res.status(201).json({ message: "Review added" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/auth/register", async (req, res) => {
    const { username, email, password, role, fullName } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query("INSERT INTO users (username, email, password, role, full_name) VALUES ($1, $2, $3, $4, $5) RETURNING id", [username || email, email, hash, role || 'student', fullName]);
        res.status(201).json({ userId: result.rows[0].id });
    } catch (err) { res.status(400).json({ error: "Email exists" }); }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [req.body.email]);
        const user = result.rows[0];
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            res.json({ user: { id: user.id, email: user.email, role: user.role, fullName: user.full_name } });
        } else { res.status(401).json({ error: "Invalid credentials" }); }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/auth/profile", async (req, res) => {
    const { id, fullName, email } = req.body;
    try {
        await pool.query("UPDATE users SET full_name = $1, email = $2 WHERE id = $3", [fullName, email, id]);
        res.json({ message: "Profile updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/enrollments/:userId", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.*, c.title as course_title, c.image as course_image, c.instructor_name, c.duration, c.curriculum 
            FROM enrollments e 
            JOIN courses c ON e.course_id = c.id 
            WHERE e.user_id = $1`, [req.params.userId]);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/enrollments", async (req, res) => {
    const { userId, courseId } = req.body;
    try {
        await pool.query("INSERT INTO enrollments (user_id, course_id, progress) VALUES ($1, $2, 0) ON CONFLICT DO NOTHING", [userId, courseId]);
        res.json({ message: "Enrolled" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/enrollments/complete", async (req, res) => {
    const { userId, courseId } = req.body;
    const cert = `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`;
    try {
        await pool.query("UPDATE enrollments SET completed = TRUE, progress = 100, certificate_url = $1 WHERE user_id = $2 AND course_id = $3", [cert, userId, courseId]);
        res.json({ message: "Done" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/enrollments/:userId/:courseId", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2",
            [req.params.userId, req.params.courseId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/admin/reviews", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.*, c.title as course_title, u.full_name as user_name
            FROM reviews r
            JOIN courses c ON r.course_id = c.id
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/admin/reviews/recent", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.*, c.title as course_title, u.full_name as user_name
            FROM reviews r
            JOIN courses c ON r.course_id = c.id
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
            LIMIT 5
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/admin/reviews/:id", async (req, res) => {
    try {
        await pool.query("DELETE FROM reviews WHERE id = $1", [req.params.id]);
        res.json({ message: "Review deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/enrollments/:id/progress", async (req, res) => {
    const { progress, last_video_index } = req.body;
    try {
        await pool.query(
            "UPDATE enrollments SET progress = $1, last_video_index = $2, completed = $3 WHERE id = $4",
            [progress, last_video_index, progress >= 100, req.params.id]
        );
        res.json({ message: "Progress updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/admin/stats", async (req, res) => {
    try {
        const users = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
        const courses = await pool.query("SELECT COUNT(*) FROM courses");
        const enrolls = await pool.query("SELECT COUNT(*) FROM enrollments");
        res.json({ totalStudents: users.rows[0].count, totalCourses: courses.rows[0].count, totalEnrollments: enrolls.rows[0].count });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/admin/users", async (req, res) => {
    try { const result = await pool.query("SELECT id, full_name, email, role FROM users ORDER BY id DESC"); res.json(result.rows); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/admin/enrollments", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.*, u.full_name as user_name, u.email as user_email, c.title as course_title 
            FROM enrollments e 
            JOIN users u ON e.user_id = u.id 
            JOIN courses c ON e.course_id = c.id 
            ORDER BY e.enrolled_at DESC`);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete("/api/admin/enrollments/:id", async (req, res) => {
    try { await pool.query("DELETE FROM enrollments WHERE id = $1", [req.params.id]); res.json({ message: "Deleted" }); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete("/api/admin/users/:id", async (req, res) => {
    try {
        await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => { console.log(`Server on http://localhost:${PORT}`); });