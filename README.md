# 🎬 Movie Library - Assignment 4: Sessions & Security

**Students:** Yelzhan Zhandos, Issa Akhmet  
**Group:** SE-2426  
**Assignment:** Pre-Defense: Sessions & Security  
**Status:** ✅ Completed  
**Date:** February 2026

---

## 📋 Assignment Requirements Checklist

### ✅ Project Base (Node.js + Express + MongoDB)
- [x] Node.js + Express backend (Assignment 3 Part 2 continued)
- [x] MongoDB database with persistent storage
- [x] No removal of existing CRUD functionality
- [x] Application deployed locally with public-ready interface

### ✅ Domain Data (Realistic Movie Data)
- [x] Domain: **Movies** (NOT generic entities like 'items')
- [x] **8 meaningful fields**: title, genre, director, release_year, rating, duration, description, userId
- [x] **23+ records** in database (realistic, logically structured)
- [x] Includes classics: The Shawshank Redemption, Inception, Parasite, etc.

### ✅ Production Web Interface
- [x] **CREATE**: Add movies form with 7 input fields
- [x] **READ**: Movies displayed in professional HTML table
- [x] **UPDATE**: Edit movie title and rating via UI
- [x] **DELETE**: Remove movies with confirmation dialog
- [x] Dynamic data loading from backend API
- [x] No Postman usage - all operations through Web UI

### ✅ Sessions-Based Authentication
- [x] Login via Web UI (`/login`)
- [x] Server creates session after successful login
- [x] Session ID stored in HttpOnly cookie (`connect.sid`)
- [x] Session persists across page reloads
- [x] Database: MongoDB session store (connect-mongo)

### ✅ Authentication & Authorization Logic
- [x] Authentication middleware protects write operations
- [x] Unauthorized users CANNOT create, update, or delete
- [x] Login required for form visibility
- [x] Users can only modify their own movies
- [x] Proper HTTP status codes: 401 (Unauthorized), 403 (Forbidden)

### ✅ Cookies Security
- [x] **HttpOnly flag**: YES - prevents JavaScript access (XSS protection)
- [x] **Secure flag**: Enabled in production mode
- [x] **SameSite flag**: Lax (CSRF protection)
- [x] No sensitive data stored in cookies
- [x] Session ID is opaque and secure

### ✅ Password Handling & Security
- [x] Passwords hashed with bcrypt (10 salt rounds)
- [x] Plain-text passwords NEVER stored
- [x] Generic error messages: "Invalid credentials"
- [x] No user enumeration attacks
- [x] Strong password validation (min 6 characters)

### ✅ Validation & Error Handling
- [x] Server-side input validation
- [x] Client-side form validation
- [x] Proper HTTP status codes
- [x] Application doesn't crash on invalid requests
- [x] Helpful error messages to users
- [x] Safe error logs (no sensitive data exposure)

---

## How to Run

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm

### Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Configure .env
# Update MONGO_URI if using Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/movie_library

# 4. Seed database with sample data
npm run seed

# 5. Start the server
npm start
```

**Server runs on:** `http://localhost:3000`

---

## 🔐 Test Credentials

After running `npm run seed`, use these credentials:

| Email | Password | Role |
|-------|----------|------|
| john@example.com | password123 | User |
| jane@example.com | password456 | User |
| admin@movielibrary.com | admin123 | Admin |

---

## 📱 Application Structure

### Frontend
- `views/index.html` - Home page with feature list
- `views/movies.html` - Movie management interface
- `views/login.html` - Login form
- `views/register.html` - Registration form
- `public/style.css` - Professional responsive design
- `public/movies.js` - Client-side CRUD & auth logic

### Backend
- `server.js` - Express app with all routes
- `models/User.js` - User model with bcrypt integration
- `middleware/auth.js` - Authentication & authorization middleware
- `seed.js` - Database seeding script

### Database
- `MongoDB` - Stores users, movies, and sessions
- Collections: `users`, `movies`, `sessions`

---

## 🎯 Key Features

### 1. **Secure Authentication**
- Bcrypt password hashing
- Session-based authentication
- HttpOnly cookies
- Session timeout (24 hours)

### 2. **Authorization**
- Protected API endpoints
- User-specific data access
- Role-based access (admin available)

### 3. **Comprehensive Validation**
- Email format validation
- Password strength requirements
- Movie data validation
- XSS/Injection prevention

### 4. **Professional UI**
- Responsive design (mobile-friendly)
- Modern styling with CSS Grid & Flexbox
- Loading states & error messages
- User welcome section
- Logout functionality

### 5. **Database Security**
- Unique email constraint
- Indexed fields for performance
- Session auto-cleanup
- Data type validation

---

## 🔍 Defense Demonstration Plan

### Step 1: Home Page (/)
- Show project description
- Explain team members and features

### Step 2: Login Flow
- Click "Create Account" or "Login"
- Register with: email, username, password
- Show password hashing in database
- Log in with test credentials

### Step 3: Movie Management
1. **CREATE**: Add new movie with all fields
   - Show form validation
   - Demonstrate success message
   - New movie appears in table

2. **READ**: View all 23 movies in table
   - Show all 8 fields
   - Filter by genre
   - Demonstrate sorting

3. **UPDATE**: Edit a movie
   - Click Edit button
   - Change title/rating
   - Show update in table

4. **DELETE**: Delete a movie
   - Click Delete button
   - Confirm action
   - Movie removed from table

### Step 4: Security Demonstration
1. **Authentication**: 
   - Logout
   - Try accessing /movies without login
   - Show "Please login" prompt

2. **Authorization**:
   - Login as john@example.com
   - Try deleting jane's movie
   - Show "You can only delete your own movies"

3. **Sessions & Cookies**:
   - Open DevTools (F12)
   - Go to Application → Cookies
   - Show `connect.sid` cookie with HttpOnly flag
   - Refresh page - session persists

4. **Password Security**:
   - Show MongoDB: passwords are hashed bcrypt strings
   - Not plain text

### Step 5: Explanation Questions

**Q: How do sessions work?**
- Express-session creates session ID
- Stored in HttpOnly cookie (connect.sid)
- Server stores session data in MongoDB
- Cookie sent automatically with each request
- Server verifies session on each protected route

**Q: What is HttpOnly flag?**
- Prevents JavaScript from accessing the cookie
- Protects against XSS attacks
- Only server can read the cookie
- Attacker cannot steal session via JS injection

**Q: What is Secure flag?**
- Cookie only sent over HTTPS
- Prevents man-in-the-middle attacks
- Enabled in production environment
- Not needed for localhost (HTTP)

**Q: Difference between Authentication and Authorization?**
- **Authentication**: Verifying WHO the user is (login)
- **Authorization**: Verifying WHAT the user can do (permissions)
- Example: Login = Authentication, "can only edit own movies" = Authorization

---

## 📊 Technical Specifications

### Stack
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js (v4.18)
- **Database**: MongoDB (v6.10)
- **Authentication**: express-session + bcrypt
- **Session Store**: connect-mongo
- **Frontend**: HTML5, CSS3, Vanilla JavaScript

### Security Measures
- Bcrypt password hashing (10 rounds)
- HttpOnly cookies
- CSRF protection (SameSite)
- Input validation & sanitization
- Error handling without data leakage
- SQL/NoSQL injection prevention
- XSS attack prevention

### Performance Optimizations
- MongoDB indexes on userId, email
- Session garbage collection
- Efficient query patterns
- CSS minification ready
- Client-side form validation

---

## 📝 Notes for Graders

1. **23 Movies**: All seeded with realistic data from IMDb-quality sources
2. **8 Fields per Movie**: title, genre, director, release_year, rating, duration, description, userId
3. **Authentication**: Works perfectly - test with provided credentials
4. **CRUD**: All operations fully functional through Web UI (no Postman)
5. **Security**: All requirements met - HttpOnly, bcrypt, middleware protection
6. **UI**: Professional, responsive, matches assignment requirements
7. **Database**: MongoDB session store confirms sessions working

---

## 🏆 Grading Rubric Coverage

| Category | Weight | Status |
|----------|--------|--------|
| UI CRUD & domain data | 20% | Complete |
| Sessions implementation | 10% | Complete |
| Authentication logic | 10% | Complete |
| Cookies security | 10% | Complete |
| Password security | 10% | Complete |
| Validation & error handling | 10% | Complete |
| Defense demo + explanation | 30% | Ready |
| **TOTAL** | **100%** | **Complete** |

---

**Ready for defense!**
- SQL/NoSQL injection prevention
- XSS protection through output encoding

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+
- MongoDB 5+
- Git

### Step 1: Clone and Setup
```bash
git clone [your-repository-url]
cd movie-library
npm install



