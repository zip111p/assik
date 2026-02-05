# FINAL DEFENSE CHECKLIST - Assignment 4

## ✅ PRE-DEFENSE SETUP (5 minutes before)

### Server & Database
- [ ] Terminal open in `C:\Users\User\Desktop\eljan\good`
- [ ] Run: `npm start`
- [ ] Verify: "Server running on port 3000"
- [ ] Verify: "✅ Connected to MongoDB"
- [ ] MongoDB is running (local or Atlas)

### Browser Setup
- [ ] Open: http://localhost:3000
- [ ] Open DevTools (F12)
- [ ] Go to: Application → Cookies
- [ ] Ready to show `connect.sid` cookie

### Documentation Ready
- [ ] README.md available for reference
- [ ] DEFENSE_INSTRUCTIONS.md open
- [ ] ASSIGNMENT4_REQUIREMENTS.md reviewed
- [ ] This checklist ready

---

## ✅ DEMONSTRATION FLOW (45 minutes total)

### PART 1: Home Page (2 min)
- [ ] Show homepage with professional design
- [ ] Point out "🎬 Movie Library" title
- [ ] Show navigation: Home, Movies, About, Contact
- [ ] Explain it's a secure web application

**Say:** "This is Movie Library - a secure web application implementing sessions-based authentication and authorization. The application has 23 movies with 8 fields each, protected by bcrypt password hashing and HttpOnly cookies."

---

### PART 2: Registration (3 min)
- [ ] Click "Create Account" button
- [ ] Fill registration form:
  - Username: `demouser`
  - Email: `demo@test.com`
  - Password: `test123456`
  - Confirm: `test123456`
- [ ] Click "Register"
- [ ] Show success message
- [ ] Show redirect to /movies page

**Say:** "Registration validates passwords must be at least 6 characters. The password is immediately hashed using bcrypt with 10 salt rounds. Passwords are NEVER stored in plain text."

---

### PART 3: Session & Cookie Check (3 min)
- [ ] DevTools → Application → Cookies → localhost:3000
- [ ] Find `connect.sid` cookie
- [ ] Point out:
  - Name: `connect.sid`
  - Value: Long hexadecimal string
  - HttpOnly: ✓ (checked)
  - Secure: ✓ (checked in production)
  - SameSite: Lax
  - Expiration: ~24 hours

**Say:** "After login, Express-session creates a session. The session ID is stored in this HttpOnly cookie. HttpOnly prevents JavaScript from accessing it - this protects against XSS attacks. Even if attacker injects malicious code, they cannot steal the session ID."

---

### PART 4: Movie Collection (5 min)
- [ ] Look at movies table
- [ ] Point out columns: Title, Genre, Director, Year, Duration, Rating, Description, Actions
- [ ] Count movies: "We have 23 movies in the library"
- [ ] Show different genres: Action, Drama, Sci-Fi, Crime, Thriller, etc.
- [ ] Show ratings range: 8.4 to 9.3
- [ ] Point out durations: 88 to 201 minutes
- [ ] Explain: "Each movie has 8 meaningful fields"

**Movies visible:**
- The Shawshank Redemption
- The Godfather
- The Dark Knight
- Inception
- Parasite
- ... and 18 more

---

### PART 5: CREATE Operation (4 min)
- [ ] Scroll to "Add New Movie" form
- [ ] Fill form with:
  - Title: `The Demo Movie`
  - Genre: `Action`
  - Release Year: `2024`
  - Director: `Demo Director`
  - Rating: `8.5`
  - Duration: `150`
  - Description: `A thrilling demonstration movie showcasing CRUD operations and security.`
- [ ] Click "✓ Add Movie"
- [ ] Show success message
- [ ] Verify new movie appears in table
- [ ] Show movie is associated with your userId

**Say:** "The form validates all inputs on both client-side and server-side. Only authenticated users can create movies. When you add a movie, it's associated with your userId, so only you can edit or delete it. This demonstrates authorization - users can only modify their own data."

---

### PART 6: READ Operation (2 min)
- [ ] Show the complete movies table
- [ ] Point out all 8 fields are visible
- [ ] Scroll through table
- [ ] Show "🎬 Movie Collection" header with count
- [ ] Explain data is loaded dynamically from `/api/movies` endpoint

**Say:** "The table displays all 23 movies loaded dynamically from our backend. The data comes from MongoDB database. Notice each movie has 8 fields as required: title, genre, director, year, duration, rating, description, and userId for authorization."

---

### PART 7: UPDATE Operation (3 min)
- [ ] Find your newly created movie or use john@example.com's movie
- [ ] Click "✏️ Edit" button on your movie
- [ ] JavaScript prompt appears: "Enter new title:"
  - Type: `The Updated Demo Movie`
  - Click OK
- [ ] Second prompt: "Enter new rating (0-10):"
  - Type: `9.2`
  - Click OK
- [ ] Show success message
- [ ] Verify movie updated in table with new title and rating

**Say:** "Update operation validates all inputs and checks authorization - you can only edit movies you created. The server verifies your userId matches the movie's userId before allowing the update."

---

### PART 8: DELETE Operation (3 min)
- [ ] Find any movie you want to delete (your own)
- [ ] Click "🗑️ Delete" button
- [ ] Confirmation dialog: "Are you sure you want to delete this movie?"
- [ ] Click "OK"
- [ ] Show success message
- [ ] Verify movie is gone from table

**Say:** "Delete is the final CRUD operation. The confirmation dialog is a UX best practice. The server checks authorization - only the movie owner can delete. After deletion, the table updates immediately without page reload."

---

### PART 9: Authorization Demo (4 min)
- [ ] Go to DevTools → Console
- [ ] Type test JavaScript to try unauthorized action:
  ```javascript
  fetch('/api/movies/SOME_OTHER_USER_ID', {method: 'DELETE'})
  ```
- [ ] Show response: 403 Forbidden
- [ ] Show message: "You can only delete your own movies"

**Alternative:**
- [ ] Look at movies from jane@example.com
- [ ] Try clicking Edit on her movie
- [ ] Show alert: "You can only edit your own movies"

**Say:** "This demonstrates authorization. The server checks if the userId of the person trying to modify matches the userId of the movie's owner. If they don't match, the server responds with 403 Forbidden."

---

### PART 10: Session Persistence (2 min)
- [ ] Reload page (F5)
- [ ] Show you're still logged in
- [ ] User welcome message still visible
- [ ] Session persists across page reloads

**Say:** "The session persists because the HttpOnly cookie is automatically sent with every request. The server checks if the session is valid and loads the user data."

---

### PART 11: Logout (2 min)
- [ ] Find logout button in user welcome section
- [ ] Click "Logout"
- [ ] Redirected to home page
- [ ] Login prompt reappears
- [ ] Check DevTools Cookies: `connect.sid` is gone

**Say:** "Logout destroys the session in MongoDB and clears the cookie. The user is now unauthenticated. To access protected features, they need to login again."

---

## ✅ EXPLANATION QUESTIONS (15 minutes)

### Q1: How do sessions work? (2 min)
**Your Answer:**
- When a user logs in, we use bcrypt to verify their password
- If correct, express-session creates a session object
- The session is stored in MongoDB database
- A session ID is generated and sent to the browser as `connect.sid` cookie
- The cookie is HttpOnly - only the server can access it
- On every subsequent request, the browser automatically sends the cookie
- The server checks if the session exists in MongoDB
- If valid, the user is authenticated
- Session expires in 24 hours
- When user logs out, the session is destroyed

**Additional points:**
- Sessions are server-side (more secure than tokens)
- Session data is not exposed to client
- Users can't modify their session
- Multiple requests from same user share same session

---

### Q2: What is the HttpOnly flag? (2 min)
**Your Answer:**
- HttpOnly is a cookie flag that prevents JavaScript from accessing the cookie
- It protects against Cross-Site Scripting (XSS) attacks
- Even if attacker injects malicious JavaScript code, they CANNOT read the session cookie
- Only the server (HTTP requests) can access the cookie
- The browser automatically sends the cookie with HTTP requests
- If HttpOnly was not set, `document.cookie` would expose the session

**Why it matters:**
- XSS attacks are common web vulnerabilities
- Attacker could inject code via HTML injection
- Without HttpOnly, they'd have access to session ID
- With HttpOnly, the session is protected

---

### Q3: What is the Secure flag? (2 min)
**Your Answer:**
- Secure flag ensures the cookie is only sent over HTTPS
- It prevents man-in-the-middle attacks
- If someone intercepts network traffic, they cannot see HTTPS cookies
- We enable it in production mode
- For localhost (HTTP), we disable it for development
- In our code: `secure: process.env.NODE_ENV === 'production'`

**Why it matters:**
- HTTPS encrypts traffic between browser and server
- Without Secure flag, cookies sent over HTTP are visible to attackers
- Production apps must use HTTPS + Secure flag

---

### Q4: Explain authentication vs authorization (3 min)
**Your Answer:**

**Authentication:** "Who are you?"
- Login form asks for email and password
- Server uses bcrypt to verify the password
- If correct, session is created
- User is authenticated
- Example: User logs in with john@example.com

**Authorization:** "What can you do?"
- After authentication, what can this user access?
- Can user create movies? Yes
- Can user edit john's movies? Only if they ARE john
- Can user edit jane's movies? No
- Check is: does userId match movieOwner?
- Example: Only john can edit john's movies

**Code Example:**
```javascript
// Authentication: Check if user is logged in
if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
}

// Authorization: Check if user owns the movie
if (movie.userId !== req.session.userId) {
    return res.status(403).json({ error: "Forbidden" });
}
```

---

### Q5: How are passwords secured? (2 min)
**Your Answer:**
- When user registers, the password is hashed with bcrypt
- Bcrypt is slow by design (uses salt + key stretching)
- We use 10 salt rounds (makes hashing even slower/stronger)
- The hashed password is stored in database
- Plain-text password is discarded (never stored or logged)
- On login, we hash the entered password and compare with stored hash
- If attacker steals the database, passwords are impossible to crack
- Bcrypt makes brute-force attacks extremely slow (milliseconds per attempt)

**Security benefits:**
- Even if database is compromised, passwords are safe
- Each password hash is unique (due to salt)
- Can't reverse bcrypt to get plain password
- Industry standard for password hashing

---

### Q6: What about CSRF protection? (2 min)
**Your Answer:**
- We use SameSite=Lax flag on the cookie
- This prevents Cross-Site Request Forgery attacks
- Attacker cannot trick user into making requests from another site
- SameSite=Lax means: send cookie for top-level navigation, but not for cross-site requests
- This protects against CSRF attacks

---

## ✅ ADDITIONAL POINTS TO MENTION

### Security Features Implemented
- ✅ Bcrypt password hashing (10 rounds)
- ✅ HttpOnly cookies (XSS protection)
- ✅ Secure flag (HTTPS enforcement)
- ✅ SameSite=Lax (CSRF protection)
- ✅ Input validation (server + client)
- ✅ Authorization middleware
- ✅ Generic error messages (no user enumeration)
- ✅ SQL/NoSQL injection prevention
- ✅ Session storage in database (not browser)
- ✅ Session timeout (24 hours)

### Technical Stack
- Node.js + Express.js
- MongoDB + express-session + connect-mongo
- Bcrypt for password hashing
- HTML5 + CSS3 + JavaScript (ES6)

### Database
- 23 realistic movies
- 3 test users
- Session collection (grows during usage)
- Indexes on email (unique) and userId

---

## ✅ COMMON QUESTIONS FROM GRADERS

**Q: Why is HttpOnly important?**
A: Prevents XSS attacks. Even if page is compromised, session cannot be stolen via JavaScript.

**Q: Can user modify their session?**
A: No, because session is stored on server (MongoDB), not sent to client.

**Q: Why hash passwords?**
A: If database is stolen, passwords are useless. Cannot reverse bcrypt.

**Q: Why sSession instead of JWT tokens?**
A: Sessions are more secure for this use case. Server-side control over session data.

**Q: What if user forgets password?**
A: Would implement password reset email. Not required for this assignment.

**Q: Can you deploy this?**
A: Yes, ready for Heroku, Railway, Vercel, or any cloud provider. Just update MONGO_URI.

**Q: What about 2FA?**
A: Not required for this assignment, but can be added.

**Q: How do you prevent SQL injection?**
A: We use MongoDB (not SQL) with parameterized queries. Plus input validation.

---

## ✅ TIMING GUIDE

- **Part 1-11:** 45 minutes (CRUD demo + explanations)
- **Questions:** 10-15 minutes
- **Buffer:** 5-10 minutes for technical issues

**Total:** ~60 minutes

---

## 🚨 IF SOMETHING GOES WRONG

### Server crashes
```bash
Get-Process node -Force | Stop-Process
npm start
```

### Can't login
- Check `.env` file has MONGO_URI
- Check MongoDB is running
- Check database has users (ran `npm run seed`)

### Movies don't appear
- Check browser console for errors (F12)
- Check server console for error messages
- Try refreshing page (Ctrl+F5)

### DevTools not showing cookie
- Logout and login again
- Check cookie is set with correct name: `connect.sid`
- Make sure you're looking at localhost:3000 cookies

---

## ✅ FINAL CHECKLIST (Day of presentation)

- [ ] Slept well
- [ ] Tested everything the day before
- [ ] Server running smoothly
- [ ] All 23 movies in database
- [ ] Test credentials working
- [ ] Practiced explanation questions
- [ ] Have all documentation ready
- [ ] Know the code (be able to explain any part)
- [ ] Confident about security concepts

---

## 🎉 YOU'RE READY!

This assignment meets 100% of requirements:
- ✅ Node.js + Express + MongoDB
- ✅ 23 movies with 8 fields
- ✅ Full CRUD via Web UI
- ✅ Sessions-based authentication
- ✅ HttpOnly + Secure cookies
- ✅ Bcrypt password hashing
- ✅ Authorization checks
- ✅ Comprehensive validation

**Go ace that defense!** 🎬🔐

---

**Questions?** Reference these files:
- README.md - Full project documentation
- DEFENSE_INSTRUCTIONS.md - Detailed demo script
- ASSIGNMENT4_REQUIREMENTS.md - Requirements verification
- server.js - Backend code
- middleware/auth.js - Authorization logic
- models/User.js - Password hashing



