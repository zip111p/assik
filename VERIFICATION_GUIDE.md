# HOW TO VERIFY YOUR PROJECT MEETS ALL REQUIREMENTS

This guide shows you EXACTLY how to check that your project corresponds to Assignment 4 requirements.

---

## 1. PROJECT BASE REQUIREMENTS

### Check 1.1: Node.js + Express backend exists
**Where to check:** `package.json`

```bash
# Open the file and verify:
- "express": "^4.18.2"
- "mongodb": "^6.10.0"
- "express-session": "^1.18.0"
```

**Action:**
1. Open `c:\Users\User\Desktop\eljan\good\package.json`
2. Look for "dependencies" section
3. Should see: express, mongodb, express-session, bcrypt, dotenv

**Evidence:** All dependencies present

---

### Check 1.2: MongoDB database is connected
**Where to check:** Terminal output

**Action:**
```bash
npm start
```

**Expected output:**
```
Server running on port 3000
Session store: MongoDB
Authentication: Enabled
Connected to MongoDB
```

**Evidence:** "Connected to MongoDB" message

---

### Check 1.3: CRUD functionality not removed
**Where to check:** Browser at `http://localhost:3000/movies`

**Action:**
1. Start server: `npm start`
2. Open browser: `http://localhost:3000`
3. Go to /movies page
4. Check all 4 operations work:
   - **CREATE**: Add movie form visible
   - **READ**: Table of 23 movies visible
   - **UPDATE**: Edit buttons on movies you created
   - **DELETE**: Delete buttons on movies you created

**Evidence:** All CRUD buttons present and functional

---

## 2. DOMAIN DATA REQUIREMENTS

### Check 2.1: NOT generic entities (Movies domain)
**Where to check:** Movie table on `/movies` page

**Action:**
1. Go to `http://localhost:3000/movies`
2. Look at table headers
3. Verify: Title, Genre, Director, Year, Duration, Rating, Description (NOT generic "item", "product", "task")

**Evidence:** Movie-specific domain data

---

### Check 2.2: At least 8 meaningful fields per movie
**Where to check:** `/movies` table + database

**Action:**

Option A - Browser table:
1. Look at columns in movie table
2. Count fields: Title, Genre, Director, Year, Duration, Rating, Description, (+ userId in backend)
3. Should see 8 fields

Option B - Database check:
```bash
# In MongoDB/Atlas:
db.movies.findOne()
```

**Should show:**
```javascript
{
  _id: ObjectId(...),
  title: "The Shawshank Redemption",
  genre: "Drama",
  director: "Frank Darabont",
  release_year: 1994,
  rating: 9.3,
  duration: 142,
  description: "Two imprisoned men...",
  userId: ObjectId(...),
  public: true,
  createdAt: Date(...),
  updatedAt: Date(...)
}
```

**Evidence:** 8+ meaningful fields per movie

---

### Check 2.3: At least 20 records in database
**Where to check:** Movie table or database count

**Action:**

Option A - Browser:
1. Go to `/movies` page
2. Count movies in table
3. Should see "23 movies in your library"

Option B - Database:
```bash
# MongoDB check:
npm run seed
# Output: "Created 23 movies"
```

**Evidence:** 23 movies (exceeds 20 requirement)

---

### Check 2.4: Realistic and logically structured data
**Where to check:** Movie table

**Action:**
1. Look at sample movies:
   - The Shawshank Redemption (1994, Drama, rating 9.3)
   - The Godfather (1972, Crime, rating 9.2)
   - The Dark Knight (2008, Action, rating 9.0)
   - Inception (2010, Sci-Fi, rating 8.8)
   
2. Verify:
   - Years are realistic (1979-2019)
   - Ratings are realistic (8.4-9.3)
   - Durations are realistic (88-201 minutes)
   - Directors are real names
   - Genres are valid

**Evidence:** Realistic movie data from IMDb

---

## 3. PRODUCTION WEB INTERFACE REQUIREMENTS

### Check 3.1: CREATE operation via Web UI
**Where to check:** `/movies` page

**Action:**
1. Login: `john@example.com` / `password123`
2. Scroll to "Add New Movie" form
3. Fill fields:
   - Title: `Test Movie`
   - Genre: `Action`
   - Release Year: `2024`
   - Director: `Test Director`
   - Rating: `8.5`
   - Duration: `120`
   - Description: `Test description`
4. Click "Add Movie" button
5. See success message
6. See new movie appears in table

**Evidence:** Movie created successfully in table

---

### Check 3.2: READ operation via Web UI
**Where to check:** `/movies` page

**Action:**
1. Go to `/movies` without login (or after logout)
2. See table of 23 movies
3. All 8 fields visible: Title, Genre, Director, Year, Duration, Rating, Description, Actions
4. Movies load from API (not hardcoded)
5. Shows "23 movies in your library"

**To verify data loads from API:**
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Look for request to `/api/movies`
5. Response should show JSON array of 23 movies

**Evidence:** 23 movies displayed dynamically

---

### Check 3.3: UPDATE operation via Web UI
**Where to check:** `/movies` page

**Action:**
1. Login: `john@example.com` / `password123`
2. Find a movie you created (your userId)
3. Click "Edit" button
4. Prompt appears: "Enter new title:"
5. Type: `Updated Test Movie`
6. Click OK
7. Prompt appears: "Enter new rating (0-10):"
8. Type: `9.0`
9. Click OK
10. See success message
11. Verify movie title/rating updated in table

**Evidence:** Movie updated in table

---

### Check 3.4: DELETE operation via Web UI
**Where to check:** `/movies` page

**Action:**
1. Login: `john@example.com` / `password123`
2. Find a movie you created
3. Click "Delete" button
4. Confirmation dialog: "Are you sure you want to delete this movie?"
5. Click "OK"
6. See success message
7. Movie disappears from table

**Evidence:** Movie deleted from table

---

### Check 3.5: Data displayed in table, list, or catalog
**Where to check:** `/movies` page

**Action:**
1. Go to `/movies`
2. See professional HTML table with:
   - Column headers: Title, Genre, Director, Year, Duration, Rating, Description, Actions
   - Rows for each movie
   - Styled with CSS (not plain HTML)

**Evidence:** Professional table layout

---

### Check 3.6: Data loaded dynamically from backend API
**Where to check:** DevTools Network tab

**Action:**
1. Open DevTools (F12)
2. Go to Network tab
3. Go to `/movies` page
4. Look for XHR/Fetch request
5. Find request to `/api/movies`
6. Click on it
7. Go to "Response" tab
8. See JSON array with 23 movies

**Evidence:** API request with JSON response

---

### Check 3.7: Postman usage NOT allowed
**Evidence:**
- All operations done through browser UI
- No terminal API calls
- No Postman screenshots
- Web UI only

---

## 4. SESSIONS-BASED AUTHENTICATION REQUIREMENTS

### Check 4.1: Login via Web UI
**Where to check:** `/login` page

**Action:**
1. Go to `http://localhost:3000/login`
2. See login form with fields: Email, Password
3. Enter: `john@example.com` / `password123`
4. Click Login button
5. Redirected to `/movies` page
6. See user welcome message: "Welcome, john!"

**Evidence:** Login form works

---

### Check 4.2: Server creates session after successful login
**Where to check:** Browser DevTools + server logs

**Action:**

Option A - Browser:
1. Login
2. Open DevTools (F12)
3. Go to Application tab
4. Go to Cookies → localhost:3000
5. Look for `connect.sid` cookie
6. It should appear AFTER login

Option B - Server:
1. Check terminal running `npm start`
2. Should show connection logs
3. Session data stored in MongoDB

**Evidence:** `connect.sid` cookie present after login

---

### Check 4.3: Session ID stored in cookie
**Where to check:** DevTools Cookies

**Action:**
1. Open DevTools (F12)
2. Go to Application → Cookies → localhost:3000
3. Find cookie named `connect.sid`
4. Value looks like: long hexadecimal string
5. Properties:
   - Domain: localhost
   - Path: /
   - HttpOnly: ✓ (checked)
   - Secure: ✓ (checked, production mode)
   - SameSite: Lax

**Evidence:** Cookie visible with correct flags

---

### Check 4.4: Session persists between requests
**Where to check:** Browser behavior

**Action:**
1. Login: `john@example.com` / `password123`
2. See welcome message
3. Reload page (F5)
4. Still logged in (welcome message still visible)
5. Navigate to different page
6. Still logged in

**Evidence:** Stay logged in across navigation

---

## 5. AUTHENTICATION & AUTHORIZATION LOGIC REQUIREMENTS

### Check 5.1: Authentication implemented using middleware
**Where to check:** `middleware/auth.js`

**Action:**
1. Open file: `c:\Users\User\Desktop\eljan\good\middleware\auth.js`
2. Look for functions:
   - `requireAuth` - checks if user logged in
   - `optionalAuth` - allows both authenticated and public

**Should see code like:**
```javascript
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};
```

**Evidence:** Middleware file exists with auth logic

---

### Check 5.2: Middleware protects write operations
**Where to check:** `server.js`

**Action:**
1. Open file: `server.js`
2. Search for these routes:
   - `app.post("/api/movies"` - should have `authMiddleware.requireAuth`
   - `app.put("/api/movies/:id"` - should have `authMiddleware.requireAuth`
   - `app.delete("/api/movies/:id"` - should have `authMiddleware.requireAuth`

**Should see:**
```javascript
app.post("/api/movies", authMiddleware.requireAuth, async (req, res) => {
    // Create movie - protected
});

app.put("/api/movies/:id", authMiddleware.requireAuth, async (req, res) => {
    // Update movie - protected
});

app.delete("/api/movies/:id", authMiddleware.requireAuth, async (req, res) => {
    // Delete movie - protected
});
```

**Evidence:** Write operations protected by middleware

---

### Check 5.3: Unauthorized users cannot modify data
**Where to check:** Browser + API response

**Action:**

Option A - Try without login:
1. Logout (or open incognito tab)
2. Open DevTools Console
3. Type:
```javascript
fetch('/api/movies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Test' })
})
```
4. Response should be: `401 Unauthorized`

Option B - Try to edit another user's movie:
1. Login as `jane@example.com`
2. Find movie by `john@example.com`
3. Click Edit button
4. Should see: "You can only edit your own movies"

**Evidence:** Unauthorized access blocked

---

## 6. COOKIES SECURITY REQUIREMENTS

### Check 6.1: HttpOnly flag - REQUIRED
**Where to check:** DevTools Cookies

**Action:**
1. Open DevTools (F12)
2. Application → Cookies → localhost:3000
3. Click on `connect.sid` cookie
4. Look for "HttpOnly" property
5. Should be ✓ (checked/enabled)

**Verify in code:**
1. Open `server.js`
2. Search for `httpOnly`
3. Should see: `httpOnly: true`

✅ **Evidence:** HttpOnly flag enabled

---

### Check 6.2: Secure flag - recommended in production
**Where to check:** DevTools Cookies

**Action:**
1. Open DevTools (F12)
2. Application → Cookies → localhost:3000
3. Click on `connect.sid` cookie
4. Look for "Secure" property
5. In production mode: should be checked/enabled
6. For localhost (dev): may be unchecked

**Verify in code:**
1. Open `server.js`
2. Search for `secure:`
3. Should see: `secure: process.env.NODE_ENV === 'production'`

**Evidence:** Secure flag set correctly

---

### Check 6.3: Cookies must not store sensitive data
**Where to check:** DevTools Cookies

**Action:**
1. Open DevTools (F12)
2. Application → Cookies → localhost:3000
3. Look at `connect.sid` cookie value
4. It's a long hexadecimal string (session ID)
5. NOT plain text (no email, password, user data visible)

**Evidence:** Only session ID in cookie, no sensitive data

---

## 7. PASSWORD HANDLING & SECURITY REQUIREMENTS

### Check 7.1: Passwords hashed using bcrypt
**Where to check:** `models/User.js` + database

**Action:**

Option A - Code check:
1. Open `models/User.js`
2. Look for `bcrypt.hash`
3. Should see: `await bcrypt.hash(password, 10)`
4. The "10" is salt rounds

Option B - Database check:
1. MongoDB/Atlas
2. Check `users` collection
3. Click on any user document
4. Look at `password` field
5. Should be: `$2b$10$...` (bcrypt format, not plain text)

**NOT plain text like:** `password123`

**Evidence:** Bcrypt hash format in database

---

### Check 7.2: Plain-text password storage NOT allowed
**Where to check:** Database

**Action:**
1. Open MongoDB Atlas or local MongoDB
2. Check `users` collection
3. Look at any user's password field
4. Should be: `$2b$10$jN36gtzfAu0UHgcL0T1xW.wWJlMw8FZGPdAj6pV6YPJqH9Ey5lD0a`
5. NOT: `password123`

**Evidence:** No plain-text passwords in database

---

### Check 7.3: Generic error messages only
**Where to check:** Login page behavior

**Action:**
1. Go to `/login` page
2. Try logging in with:
   - Non-existent email: `fake@example.com` / `pass123`
   - Correct email, wrong password: `john@example.com` / `wrongpass`
3. Both should show SAME message: "Invalid credentials"
4. NOT: "User not found" or "Password incorrect"

**Check in code:**
1. Open `server.js`
2. Search for "Invalid credentials"
3. Should use same message for both cases

**Evidence:** Generic error messages (no user enumeration)

---

## 8. VALIDATION & ERROR HANDLING REQUIREMENTS

### Check 8.1: Server-side input validation
**Where to check:** `server.js` POST/PUT routes

**Action:**
1. Open `server.js`
2. Look at `/api/movies` POST route
3. Should see validation checks:
   ```javascript
   if (!title || !genre) {
       return res.status(400).json({ error: "..." });
   }
   if (rating < 0 || rating > 10) {
       return res.status(400).json({ error: "..." });
   }
   ```

**Evidence:** Validation code in routes

---

### Check 8.2: Client-side validation
**Where to check:** `/movies` page form

**Action:**
1. Go to `/movies` page
2. Try to submit form with:
   - Empty title field
   - Empty genre field
3. Form should prevent submission (HTML5 validation)
4. Should see: "Please fill in this field"

**Evidence:** Form validation prevents invalid submission

---

### Check 8.3: Use correct HTTP status codes
**Where to check:** DevTools Network tab + code

**Action:**

Option A - Network check:
1. Open DevTools (F12)
2. Go to Network tab
3. Create a movie: see **201 Created**
4. Try unauthorized access: see **401 Unauthorized**
5. Try editing someone else's movie: see **403 Forbidden**

Option B - Code check:
1. Open `server.js`
2. Search for: `res.status(201)`, `res.status(400)`, `res.status(401)`, `res.status(403)`, `res.status(404)`, `res.status(500)`
3. All status codes present

**Evidence:** Correct HTTP status codes used

---

### Check 8.4: Application doesn't crash on invalid requests
**Where to check:** Browser + server logs

**Action:**
1. Go to `/movies` form
2. Try submitting invalid data multiple times
3. Application keeps working (no crash)
4. Server logs show errors but app continues
5. User sees error message

**Evidence:** Graceful error handling

---

## QUICK VERIFICATION CHECKLIST

Print this out and check off as you verify:

```
DOMAIN DATA:
- Movies entity (not generic items)
- 8 fields per movie visible
- 23 movies in table
- Realistic data (years, ratings, etc.)

CRUD OPERATIONS:
- CREATE: Can add movie
- READ: Table shows all movies
- UPDATE: Can edit title/rating
- DELETE: Can remove movie
- All via Web UI (no Postman)

AUTHENTICATION:
- Login page works
- Session created after login
- connect.sid cookie appears
- Session persists on reload
- Can logout

SECURITY:
- HttpOnly flag on cookie
- Secure flag configured
- Bcrypt hashes in database
- No plain-text passwords
- Generic error messages
- Cannot edit others' movies
- Unauthorized get 401/403

VALIDATION:
- Cannot submit empty form
- Server validates all inputs
- Correct HTTP status codes
- App doesn't crash

DEPLOYMENT:
- Server runs on port 3000
- MongoDB connected
- All routes work
- No console errors
```

---

## VERIFICATION SUMMARY

If you can check ALL items above, your project meets 100% of Assignment 4 requirements!

Ready to demonstrate!



