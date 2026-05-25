require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "../public/assets")));
app.use("/uploads", express.static(path.join(__dirname, "../public/assets/uploads")));

const uploadDir = path.join(__dirname, "../public/assets/uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only JPG, PNG, and WebP are allowed."));
        }
    }
});

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
            CREATE TABLE IF NOT EXISTS instructors (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                bio TEXT,
                image TEXT
            )
        `);

        const instructorCountRes = await pool.query("SELECT COUNT(*) FROM instructors");
        if (parseInt(instructorCountRes.rows[0].count) === 0) {
            console.log("Seeding default celebrity instructors...");
            const defaultInstructors = [
                {
                    name: "Sam Altman",
                    bio: "CEO of OpenAI & Tech Visionary. Leading the charge on artificial general intelligence and the future of human-AI collaboration.",
                    image: "assets/instructors/sam-altman.jpg"
                },
                {
                    name: "Taylor Swift",
                    bio: "Global Pop Sensation & Songwriter. Multiple Grammy winner teaching you narrative storytelling, creative flow, and building a global community.",
                    image: "assets/instructors/taylor-swift.jpg"
                },
                {
                    name: "Virat Kohli",
                    bio: "Indian Cricket Legend & Athletic Icon. Renowned for elite discipline, high-performance coaching, and supreme mental toughness under pressure.",
                    image: "assets/instructors/virat-kohli.jpg"
                },
                {
                    name: "Arijit Singh",
                    bio: "Voice of a Generation & Music Director. Teaching vocal excellence, soulful storytelling through music, and the architecture of chart-topping hits.",
                    image: "assets/instructors/arijit-singh.jpg"
                },
                {
                    name: "Elon Musk",
                    bio: "CEO of Tesla & SpaceX. Futurist teaching multi-planetary engineering, clean energy architectures, and hyper-scale manufacturing workflows.",
                    image: "assets/instructors/elon-musk.avif"
                },
                {
                    name: "Cristiano Ronaldo",
                    bio: "Global Football Icon & Elite Athlete. Teaching hyper-focused performance, physical conditioning architectures, and a champion's daily winning mindset.",
                    image: "assets/instructors/cristiano-ronaldo.jpg"
                },
                {
                    name: "Shah Rukh Khan",
                    bio: "King of Bollywood & Charismatic Actor. Teaching public speaking, presence mastery, theatrical expression, and global brand building.",
                    image: "assets/instructors/shah-rukh-khan.jpg"
                },
                {
                    name: "Dwayne Johnson",
                    bio: "The Rock - Hollywood Icon & Action Superstar. Teaching fitness design, entrepreneurial scaling, and maximum athletic charisma.",
                    image: "assets/instructors/dwayne-johnson.jpg"
                }
            ];

            for (const inst of defaultInstructors) {
                await pool.query("INSERT INTO instructors (name, bio, image) VALUES ($1, $2, $3)", [inst.name, inst.bio, inst.image]);
            }
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'student',
                full_name TEXT,
                approved BOOLEAN DEFAULT FALSE
            )
        `);
        await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE");
        await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS selected_instructor_id INTEGER REFERENCES instructors(id) ON DELETE SET NULL");

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
        await pool.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0");

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

        await pool.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                assigned_to INTEGER REFERENCES users(id) ON DELETE CASCADE,
                status TEXT DEFAULT 'pending',
                due_date TIMESTAMP,
                submission_link TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS submission_link TEXT");
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

app.post("/api/courses", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'instructor_image', maxCount: 1 }]), async (req, res) => {
    const { title, level, about, description, topic, instructor_name, instructor_bio, outcomes, requirements, curriculum } = req.body;
    let image = req.body.image;
    let instructor_image = req.body.instructor_image;

    if (req.files && req.files['image']) {
        image = `/uploads/${req.files['image'][0].filename}`;
    }
    if (req.files && req.files['instructor_image']) {
        instructor_image = `/uploads/${req.files['instructor_image'][0].filename}`;
    }

    try {
        const parsedCurriculum = typeof curriculum === 'string' ? JSON.parse(curriculum) : curriculum;
        const parsedOutcomes = typeof outcomes === 'string' ? JSON.parse(outcomes) : outcomes;
        const parsedRequirements = typeof requirements === 'string' ? JSON.parse(requirements) : requirements;

        const result = await pool.query(
            `INSERT INTO courses (title, level, image, about, description, topic, instructor_name, instructor_bio, instructor_image, outcomes, requirements, curriculum) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
            [title, level, image, about, description, topic, instructor_name, instructor_bio, instructor_image, parsedOutcomes || [], parsedRequirements || [], JSON.stringify(parsedCurriculum || [])]
        );
        res.status(201).json({ id: result.rows[0].id, image, instructor_image });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/courses/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'instructor_image', maxCount: 1 }]), async (req, res) => {
    const { title, level, about, description, topic, instructor_name, instructor_bio, outcomes, requirements, curriculum } = req.body;
    let image = req.body.image;
    let instructor_image = req.body.instructor_image;

    if (req.files && req.files['image']) {
        image = `/uploads/${req.files['image'][0].filename}`;
    }
    if (req.files && req.files['instructor_image']) {
        instructor_image = `/uploads/${req.files['instructor_image'][0].filename}`;
    }

    try {
        const parsedCurriculum = typeof curriculum === 'string' ? JSON.parse(curriculum) : curriculum;
        const parsedOutcomes = typeof outcomes === 'string' ? JSON.parse(outcomes) : outcomes;
        const parsedRequirements = typeof requirements === 'string' ? JSON.parse(requirements) : requirements;

        await pool.query(
            `UPDATE courses SET title=$1, level=$2, image=$3, about=$4, description=$5, topic=$6, instructor_name=$7, instructor_bio=$8, instructor_image=$9, outcomes=$10, requirements=$11, curriculum=$12 WHERE id=$13`,
            [title, level, image, about, description, topic, instructor_name, instructor_bio, instructor_image, parsedOutcomes, parsedRequirements, JSON.stringify(parsedCurriculum || []), req.params.id]
        );
        res.json({ message: "Updated", image, instructor_image });
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
            res.json({ user: { id: user.id, email: user.email, role: user.role, fullName: user.full_name, approved: user.approved, selectedInstructorId: user.selected_instructor_id } });
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

app.get("/api/users/:id", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, email, role, full_name, approved, selected_instructor_id FROM users WHERE id = $1", [req.params.id]);
        if (result.rows.length > 0) {
            res.json({ user: { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, fullName: result.rows[0].full_name, approved: result.rows[0].approved, selectedInstructorId: result.rows[0].selected_instructor_id } });
        } else {
            res.status(404).json({ error: "User not found" });
        }
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

app.get("/api/enrollment/:id", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.*, c.title as course_title, c.image as course_image, c.duration, c.curriculum,
                   c.instructor_name as default_instructor_name,
                   c.instructor_bio as default_instructor_bio,
                   c.instructor_image as default_instructor_image,
                   u.full_name as user_fullname, 
                   i.name as selected_instructor_name,
                   i.bio as selected_instructor_bio,
                   i.image as selected_instructor_image
            FROM enrollments e 
            JOIN courses c ON e.course_id = c.id 
            JOIN users u ON e.user_id = u.id
            LEFT JOIN instructors i ON u.selected_instructor_id = i.id
            WHERE e.id = $1`, [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Enrollment not found" });
        }
        res.json(result.rows[0]);
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

app.get("/api/instructors", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM instructors ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/instructors", upload.single("image"), async (req, res) => {
    const { name, bio } = req.body;
    let image = null;
    if (req.file) {
        image = `/uploads/${req.file.filename}`;
    }
    try {
        const result = await pool.query(
            "INSERT INTO instructors (name, bio, image) VALUES ($1, $2, $3) RETURNING *",
            [name, bio, image]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/instructors/:id", upload.single("image"), async (req, res) => {
    const { name, bio } = req.body;
    let image = req.body.image;
    if (req.file) {
        image = `/uploads/${req.file.filename}`;
    }
    try {
        const result = await pool.query(
            "UPDATE instructors SET name = $1, bio = $2, image = $3 WHERE id = $4 RETURNING *",
            [name, bio, image, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Instructor not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/instructors/:id", async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM instructors WHERE id = $1 RETURNING *", [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Instructor not found" });
        }
        res.json({ message: "Instructor deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/users/:id/instructor", async (req, res) => {
    const { selected_instructor_id } = req.body;
    try {
        const result = await pool.query(
            "UPDATE users SET selected_instructor_id = $1 WHERE id = $2 RETURNING id, email, role, full_name, approved, selected_instructor_id as \"selectedInstructorId\"",
            [selected_instructor_id, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "Instructor updated successfully", user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/admin/stats", async (req, res) => {
    try {
        const users = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
        const courses = await pool.query("SELECT COUNT(*) FROM courses");
        const enrolls = await pool.query("SELECT COUNT(*) FROM enrollments");

        const pendingUsers = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student' AND approved = false");
        const weeklyEnrolls = await pool.query("SELECT COUNT(*) FROM enrollments WHERE enrolled_at >= NOW() - INTERVAL '7 days'");

        const completedEnrolls = await pool.query("SELECT COUNT(*) FROM enrollments WHERE completed = true");
        const totalE = parseInt(enrolls.rows[0].count);
        const compE = parseInt(completedEnrolls.rows[0].count);
        const completionRate = totalE > 0 ? Math.round((compE / totalE) * 100) : 0;

        const instructorStats = await pool.query(`
            SELECT i.id, i.name, i.image, i.bio, COUNT(u.id) as student_count
            FROM instructors i
            LEFT JOIN users u ON u.selected_instructor_id = i.id AND u.role = 'student'
            GROUP BY i.id, i.name, i.image, i.bio
            ORDER BY student_count DESC
        `);

        res.json({
            totalStudents: parseInt(users.rows[0].count),
            totalCourses: parseInt(courses.rows[0].count),
            totalEnrollments: totalE,
            enrollmentsThisWeek: parseInt(weeklyEnrolls.rows[0].count),
            completionRate: completionRate,
            pendingApprovals: parseInt(pendingUsers.rows[0].count),
            systemHealth: "Optimal",
            instructorStats: instructorStats.rows
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/admin/users", async (req, res) => {
    try { const result = await pool.query("SELECT id, full_name, email, role, approved FROM users ORDER BY id DESC"); res.json(result.rows); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/admin/users/:id/approve", async (req, res) => {
    try {
        await pool.query("UPDATE users SET approved = TRUE WHERE id = $1", [req.params.id]);
        res.json({ message: "User approved" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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

app.post("/api/admin/users", async (req, res) => {
    const { email, password, full_name, role } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, email, password, role, full_name, approved) VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING *",
            [email, email, hash, role || 'student', full_name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: "Email might already exist or invalid data" });
    }
});

app.get("/api/admin/tasks", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.*, u.full_name as assigned_to_name, u.email as assigned_to_email
            FROM tasks t
            LEFT JOIN users u ON t.assigned_to = u.id
            ORDER BY t.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/admin/tasks", async (req, res) => {
    const { title, description, assigned_to, due_date } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO tasks (title, description, assigned_to, due_date) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, description, assigned_to, due_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/admin/tasks/:id", async (req, res) => {
    const { title, description, assigned_to, status, due_date } = req.body;
    try {
        await pool.query(
            "UPDATE tasks SET title=$1, description=$2, assigned_to=$3, status=$4, due_date=$5 WHERE id=$6",
            [title, description, assigned_to, status, due_date, req.params.id]
        );
        res.json({ message: "Task updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/admin/tasks/:id", async (req, res) => {
    try {
        await pool.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/tasks/user/:userId", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC",
            [req.params.userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/tasks/:taskId/status", async (req, res) => {
    const { status, submission_link } = req.body;
    try {
        await pool.query(
            "UPDATE tasks SET status = $1, submission_link = COALESCE($2, submission_link) WHERE id = $3",
            [status, submission_link, req.params.taskId]
        );
        res.json({ message: "Task status updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => { console.log(`Server on http://localhost:${PORT}`); });