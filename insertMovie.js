
const movie = {
  title: "Interstellar",
  genre: "Sci-Fi",
  release_year: 2014,
  rating: 9.5
};

async function insertMovie() {
  const res = await fetch("http://localhost:3000/api/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie)
  });

  const data = await res.json();
  console.log(data);
}

insertMovie();


