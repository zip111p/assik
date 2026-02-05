// server.js (обновленный)
require("dotenv").config();

const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const authMiddleware = require("./middleware/auth");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const client = new MongoClient(process.env.MONGO_URI);
let db;
let userModel;

async function connectDB() {
    try {
        if (!db) {
            await client.connect();
            db = client.db("movie_library");
            userModel = new User(db);
            console.log("Connected to MongoDB");

            // Создание индексов
            await db.collection("users").createIndex({ email: 1 }, { unique: true });
            await db.collection("movies").createIndex({ userId: 1 });
        }
        return db;
    } catch (err) {
        console.error("Mongo connection failed:", err);
        process.exit(1);
    }
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'movie-library-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: "movie_library",
        ttl: 24 * 60 * 60 // 24 часа
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // В продакшене true
        maxAge: 24 * 60 * 60 * 1000, // 24 часа
        sameSite: 'lax'
    }
}));

// Make session and db available in templates
app.use(async(req, res, next) => {
    req.db = await connectDB();

    // Get user data if logged in
    if (req.session.userId) {
        try {
            req.user = await userModel.findById(new ObjectId(req.session.userId));
            if (req.user) {
                req.user.password = undefined; // Remove password
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }

    // Make user available in views
    res.locals.user = req.user;
    res.locals.isAuthenticated = !!req.session.userId;
    next();
});

// ================= AUTHENTICATION ROUTES =================

// Login Page
app.get("/login", (req, res) => {
    if (req.session.userId) {
        return res.redirect("/movies");
    }
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Login Handler
app.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;

        // Валидация
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Найти пользователя
        const user = await userModel.findByEmail(email);
        if (!user) {
            // Общее сообщение об ошибке для безопасности
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Проверить пароль
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Создать сессию
        req.session.userId = user._id;
        req.session.save(err => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            res.json({
                success: true,
                message: "Login successful",
                redirect: req.query.redirect || "/movies"
            });
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Register Page
app.get("/register", (req, res) => {
    if (req.session.userId) {
        return res.redirect("/movies");
    }
    res.sendFile(path.join(__dirname, "views", "register.html"));
});

// Register Handler
app.post("/register", async(req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Валидация
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        // Проверить, существует ли пользователь
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Создать пользователя
        const user = await userModel.create(username, email, password);

        // Автоматический логин после регистрации
        req.session.userId = user.id;

        res.json({
            success: true,
            message: "Registration successful",
            redirect: "/movies"
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Logout
app.post("/logout", authMiddleware.requireAuth, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: "Logout successful", redirect: "/" });
    });
});

// ================= PROTECTED MOVIE API ROUTES =================

// GET ALL (публичный доступ)
app.get("/api/movies", authMiddleware.optionalAuth, async(req, res) => {
    try {
        const database = await connectDB();
        const filter = req.isAuthenticated ? {} : { public: true };
        const movies = await database.collection("movies").find(filter).toArray();
        res.json(movies);
    } catch (error) {
        console.error("Get movies error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// CREATE (только для авторизованных)
app.post("/api/movies", authMiddleware.requireAuth, async(req, res) => {
    try {
        const { title, genre, release_year, rating, director, duration, description } = req.body;

        // Валидация
        if (!title || !genre) {
            return res.status(400).json({ error: "Title and genre are required" });
        }

        if (title.length > 255) {
            return res.status(400).json({ error: "Title too long" });
        }

        if (release_year && (isNaN(release_year) || release_year < 1888 || release_year > new Date().getFullYear() + 5)) {
            return res.status(400).json({ error: "Invalid release year" });
        }

        if (rating && (isNaN(rating) || rating < 0 || rating > 10)) {
            return res.status(400).json({ error: "Rating must be between 0 and 10" });
        }

        const database = await connectDB();

        const movie = {
            title,
            genre,
            release_year: release_year ? Number(release_year) : null,
            rating: rating ? Number(rating) : null,
            director: director || null,
            duration: duration || null,
            description: description || null,
            userId: new ObjectId(req.session.userId),
            public: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await database.collection("movies").insertOne(movie);

        res.status(201).json({
            success: true,
            message: "Movie created successfully",
            movieId: result.insertedId
        });
    } catch (error) {
        console.error("Create movie error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// UPDATE (только для авторизованных + проверка владельца)
app.put("/api/movies/:id", authMiddleware.requireAuth, async(req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid movie ID" });
        }

        const database = await connectDB();
        const movieId = new ObjectId(req.params.id);

        // Проверить существование и владельца
        const movie = await database.collection("movies").findOne({ _id: movieId });
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        if (movie.userId.toString() !== req.session.userId.toString()) {
            return res.status(403).json({ error: "You can only edit your own movies" });
        }

        // Валидация обновлений
        const updates = {};
        if (req.body.title !== undefined) {
            if (!req.body.title.trim()) {
                return res.status(400).json({ error: "Title cannot be empty" });
            }
            updates.title = req.body.title;
        }

        if (req.body.rating !== undefined) {
            const rating = Number(req.body.rating);
            if (isNaN(rating) || rating < 0 || rating > 10) {
                return res.status(400).json({ error: "Rating must be between 0 and 10" });
            }
            updates.rating = rating;
        }

        updates.updatedAt = new Date();

        const result = await database.collection("movies").updateOne({ _id: movieId }, { $set: updates });

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Movie not found" });
        }

        res.json({
            success: true,
            message: "Movie updated successfully"
        });
    } catch (error) {
        console.error("Update movie error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE (только для авторизованных + проверка владельца)
app.delete("/api/movies/:id", authMiddleware.requireAuth, async(req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid movie ID" });
        }

        const database = await connectDB();
        const movieId = new ObjectId(req.params.id);

        // Проверить существование и владельца
        const movie = await database.collection("movies").findOne({ _id: movieId });
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        if (movie.userId.toString() !== req.session.userId.toString()) {
            return res.status(403).json({ error: "You can only delete your own movies" });
        }

        const result = await database.collection("movies").deleteOne({ _id: movieId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Movie not found" });
        }

        res.json({
            success: true,
            message: "Movie deleted successfully"
        });
    } catch (error) {
        console.error("Delete movie error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ================= PAGE ROUTES =================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Auth Status (for frontend)
app.get("/api/auth/status", async(req, res) => {
    try {
        if (req.session.userId && req.user) {
            res.json({
                authenticated: true,
                user: {
                    _id: req.user._id,
                    username: req.user.username,
                    email: req.user.email
                }
            });
        } else {
            res.json({ authenticated: false });
        }
    } catch (error) {
        console.error("Auth status error:", error);
        res.json({ authenticated: false });
    }
});

app.get("/movies", authMiddleware.optionalAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "movies.html"));
});

app.get("/search", authMiddleware.optionalAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "movies.html"));
});

app.get("/item/:id", authMiddleware.optionalAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "movies.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "contact.html"));
});

// ================= ERROR HANDLING =================

// 404 Handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// Error Handler
app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
});

// ================= SERVER START =================

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`🔒 Session store: MongoDB`);
    console.log(`🔐 Authentication: Enabled`);
});


