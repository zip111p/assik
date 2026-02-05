// seed.js - Run with: node seed.js
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

async function seedDatabase() {
    const client = new MongoClient(process.env.MONGO_URI);
    
    try {
        await client.connect();
        const db = client.db("movie_library");
        
        console.log("🌱 Seeding database...");
        
        // Clear existing collections
        await db.collection("users").deleteMany({});
        await db.collection("movies").deleteMany({});
        
        // Create test users
        const users = [
            {
                username: "john_doe",
                email: "john@example.com",
                password: await bcrypt.hash("password123", 10),
                createdAt: new Date(),
                role: "user"
            },
            {
                username: "jane_smith",
                email: "jane@example.com",
                password: await bcrypt.hash("password456", 10),
                createdAt: new Date(),
                role: "user"
            },
            {
                username: "admin",
                email: "admin@movielibrary.com",
                password: await bcrypt.hash("admin123", 10),
                createdAt: new Date(),
                role: "admin"
            }
        ];
        
        const userResult = await db.collection("users").insertMany(users);
        const userIds = Object.values(userResult.insertedIds);
        
        console.log(`✅ Created ${users.length} users`);
        
        // Create realistic movie data (20+ records)
        const movies = [
            {
                title: "The Shawshank Redemption",
                genre: "Drama",
                release_year: 1994,
                rating: 9.3,
                director: "Frank Darabont",
                duration: 142,
                description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
                userId: userIds[0],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "The Godfather",
                genre: "Crime",
                release_year: 1972,
                rating: 9.2,
                director: "Francis Ford Coppola",
                duration: 175,
                description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
                userId: userIds[0],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "The Dark Knight",
                genre: "Action",
                release_year: 2008,
                rating: 9.0,
                director: "Christopher Nolan",
                duration: 152,
                description: "When the menace known as the Joker wreaks havoc on Gotham City, Batman must accept one of the greatest psychological tests.",
                userId: userIds[1],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Pulp Fiction",
                genre: "Crime",
                release_year: 1994,
                rating: 8.9,
                director: "Quentin Tarantino",
                duration: 154,
                description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
                userId: userIds[1],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Inception",
                genre: "Sci-Fi",
                release_year: 2010,
                rating: 8.8,
                director: "Christopher Nolan",
                duration: 148,
                description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
                userId: userIds[2],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Forrest Gump",
                genre: "Drama",
                release_year: 1994,
                rating: 8.8,
                director: "Robert Zemeckis",
                duration: 142,
                description: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other history unfold through Forrest's eyes.",
                userId: userIds[0],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "The Matrix",
                genre: "Sci-Fi",
                release_year: 1999,
                rating: 8.7,
                director: "The Wachowskis",
                duration: 136,
                description: "A computer hacker learns from mysterious rebels about the true nature of his reality.",
                userId: userIds[1],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Goodfellas",
                genre: "Crime",
                release_year: 1990,
                rating: 8.7,
                director: "Martin Scorsese",
                duration: 146,
                description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen and his mob partners.",
                userId: userIds[2],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "The Silence of the Lambs",
                genre: "Thriller",
                release_year: 1991,
                rating: 8.6,
                director: "Jonathan Demme",
                duration: 118,
                description: "A young FBI cadet must receive the help of an incarcerated cannibal killer to help catch another serial killer.",
                userId: userIds[0],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Parasite",
                genre: "Thriller",
                release_year: 2019,
                rating: 8.6,
                director: "Bong Joon Ho",
                duration: 132,
                description: "A poor family schemes to become employed by a wealthy family by infiltrating their household.",
                userId: userIds[1],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Interstellar",
                genre: "Sci-Fi",
                release_year: 2014,
                rating: 8.6,
                director: "Christopher Nolan",
                duration: 169,
                description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                userId: userIds[2],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "The Green Mile",
                genre: "Drama",
                release_year: 1999,
                rating: 8.6,
                director: "Frank Darabont",
                duration: 189,
                description: "The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder.",
                userId: userIds[0],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "The Lord of the Rings: The Return of the King",
                genre: "Fantasy",
                release_year: 2003,
                rating: 8.9,
                director: "Peter Jackson",
                duration: 201,
                description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam.",
                userId: userIds[1],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Fight Club",
                genre: "Drama",
                release_year: 1999,
                rating: 8.8,
                director: "David Fincher",
                duration: 139,
                description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club.",
                userId: userIds[2],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Spirited Away",
                genre: "Animation",
                release_year: 2001,
                rating: 8.6,
                director: "Hayao Miyazaki",
                duration: 125,
                description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods and spirits.",
                userId: userIds[0],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "The Departed",
                genre: "Crime",
                release_year: 2006,
                rating: 8.5,
                director: "Martin Scorsese",
                duration: 151,
                description: "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang.",
                userId: userIds[1],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Whiplash",
                genre: "Drama",
                release_year: 2014,
                rating: 8.5,
                director: "Damien Chazelle",
                duration: 106,
                description: "A promising young drummer enrolls at a cut-throat music conservatory.",
                userId: userIds[2],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "The Prestige",
                genre: "Mystery",
                release_year: 2006,
                rating: 8.5,
                director: "Christopher Nolan",
                duration: 130,
                description: "After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion.",
                userId: userIds[0],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Gladiator",
                genre: "Action",
                release_year: 2000,
                rating: 8.5,
                director: "Ridley Scott",
                duration: 155,
                description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.",
                userId: userIds[1],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "The Lion King",
                genre: "Animation",
                release_year: 1994,
                rating: 8.5,
                director: "Roger Allers, Rob Minkoff",
                duration: 88,
                description: "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
                userId: userIds[2],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Back to the Future",
                genre: "Adventure",
                release_year: 1985,
                rating: 8.5,
                director: "Robert Zemeckis",
                duration: 116,
                description: "Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time machine.",
                userId: userIds[0],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Alien",
                genre: "Horror",
                release_year: 1979,
                rating: 8.5,
                director: "Ridley Scott",
                duration: 117,
                description: "The crew of a commercial spacecraft encounter a deadly lifeform after investigating an unknown transmission.",
                userId: userIds[1],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Avengers: Endgame",
                genre: "Action",
                release_year: 2019,
                rating: 8.4,
                director: "Anthony Russo, Joe Russo",
                duration: 181,
                description: "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions.",
                userId: userIds[2],
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        
        const movieResult = await db.collection("movies").insertMany(movies);
        console.log(`✅ Created ${movies.length} movies`);
        
        console.log("🌱 Database seeding completed!");
        console.log(`👥 Users: ${users.length}`);
        console.log(`🎬 Movies: ${movies.length}`);
        
        // Display test credentials
        console.log("\n🔐 Test Credentials:");
        console.log("1. Email: john@example.com | Password: password123");
        console.log("2. Email: jane@example.com | Password: password456");
        console.log("3. Email: admin@movielibrary.com | Password: admin123");
        
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await client.close();
    }
}

seedDatabase();



