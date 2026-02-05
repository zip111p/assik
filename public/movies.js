// movies.js - Movie Management
const form = document.getElementById("movieForm");
const tableBody = document.getElementById("moviesTableBody");
const addMovieSection = document.getElementById("addMovieSection");
const loginPrompt = document.getElementById("loginPrompt");
const userWelcome = document.getElementById("userWelcome");
const usernameElement = document.getElementById("username");
const movieCountElement = document.getElementById("movieCount");

let currentUser = null;

// Check authentication status
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (data.authenticated) {
            currentUser = data.user;
            addMovieSection.style.display = 'block';
            loginPrompt.style.display = 'none';
            userWelcome.style.display = 'block';
            usernameElement.textContent = data.user.username || data.user.email;
        } else {
            currentUser = null;
            addMovieSection.style.display = 'none';
            loginPrompt.style.display = 'block';
            userWelcome.style.display = 'none';
        }
    } catch (error) {
        console.error('Auth check error:', error);
        currentUser = null;
        addMovieSection.style.display = 'none';
        loginPrompt.style.display = 'block';
        userWelcome.style.display = 'none';
    }
}

async function loadMovies() {
    try {
        const res = await fetch("/api/movies");
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const movies = await res.json();

        tableBody.innerHTML = "";

        if (movies.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #999;">No movies found. Add one to get started!</td></tr>`;
            movieCountElement.textContent = '0 movies in library';
            return;
        }

        movieCountElement.textContent = `${movies.length} movies in your library`;

        movies.forEach(movie => {
            const isOwner = currentUser && movie.userId === currentUser._id;
            const actions = isOwner ? `
                <button class="action-btn edit" onclick="editMovie('${movie._id}', true)">✏️ Edit</button>
                <button class="action-btn delete" onclick="deleteMovie('${movie._id}', true)">🗑️ Delete</button>
            ` : '<span class="view-only">View Only</span>';
            
            tableBody.innerHTML += `
            <tr>
                <td><strong>${movie.title}</strong></td>
                <td><span class="genre-badge">${movie.genre}</span></td>
                <td>${movie.director || "-"}</td>
                <td>${movie.release_year || "-"}</td>
                <td>${movie.duration || "-"} min</td>
                <td><strong>⭐ ${movie.rating || "-"}</strong></td>
                <td><small>${(movie.description || "").substring(0, 50)}...</small></td>
                <td class="actions-cell">${actions}</td>
            </tr>`;
        });
    } catch (error) {
        console.error("Error loading movies:", error);
        tableBody.innerHTML = `<tr><td colspan="8" style="color: red; text-align: center;">Error loading movies. Please try again.</td></tr>`;
    }
}

if (form) {
    form.addEventListener("submit", async e => {
        e.preventDefault();
        
        if (!currentUser) {
            alert('Please login to add movies');
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            return;
        }
        
        const title = document.getElementById("title").value.trim();
        const genre = document.getElementById("genre").value;
        const release_year = parseInt(document.getElementById("release_year").value);
        const rating = parseFloat(document.getElementById("rating").value);
        const director = document.getElementById("director").value.trim();
        const duration = parseInt(document.getElementById("duration").value);
        const description = document.getElementById("description").value.trim();
        
        if (!title || !genre || !director || !description) {
            alert('Please fill in all required fields');
            return;
        }

        if (rating < 0 || rating > 10) {
            alert('Rating must be between 0 and 10');
            return;
        }

        if (duration < 1) {
            alert('Duration must be at least 1 minute');
            return;
        }
        
        const movie = { title, genre, release_year, rating, director, duration, description };
        
        try {
            const response = await fetch("/api/movies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(movie)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('✓ Movie added successfully!');
                form.reset();
                loadMovies();
            } else {
                alert(data.error || "Error adding movie");
            }
        } catch (error) {
            console.error("Error adding movie:", error);
            alert("Network error. Please try again.");
        }
    });
}

async function deleteMovie(id, isOwner) {
    if (!currentUser || !isOwner) {
        alert('You can only delete your own movies');
        return;
    }
    
    if (!confirm("Are you sure you want to delete this movie? This action cannot be undone.")) {
        return;
    }
    
    try {
        const response = await fetch(`/api/movies/${id}`, { method: "DELETE" });
        const data = await response.json();
        
        if (response.ok) {
            alert('✓ Movie deleted successfully!');
            loadMovies();
        } else {
            alert(data.error || "Error deleting movie");
        }
    } catch (error) {
        console.error("Error deleting movie:", error);
        alert("Network error. Please try again.");
    }
}

async function editMovie(id, isOwner) {
    if (!currentUser || !isOwner) {
        alert('You can only edit your own movies');
        return;
    }
    
    const newTitle = prompt("Enter new title:");
    if (!newTitle || !newTitle.trim()) return;
    
    const newRating = prompt("Enter new rating (0-10):");
    if (newRating === null) return;
    
    const rating = parseFloat(newRating);
    if (isNaN(rating) || rating < 0 || rating > 10) {
        alert("Rating must be between 0 and 10");
        return;
    }
    
    const updates = { title: newTitle.trim(), rating: rating };
    
    try {
        const response = await fetch(`/api/movies/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('✓ Movie updated successfully!');
            loadMovies();
        } else {
            alert(data.error || "Error updating movie");
        }
    } catch (error) {
        console.error("Error updating movie:", error);
        alert("Network error. Please try again.");
    }
}

async function logout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            window.location.href = data.redirect || '/';
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadMovies();
});


