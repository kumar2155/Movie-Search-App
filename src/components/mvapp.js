import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
export default function App() {
  const [movie, setMovie] = useState([]);
  const [squery, setquery] = useState("");
  const [sortby, setSortby] = useState("popularity.desc");
  const [genres, setgenre] = useState([]);
  const [selectedGenre, setselectedGenre] = useState("");
  const [expandedMovieId, setExpandedMovieId] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await axios.get(
        "https://api.themoviedb.org/3/genre/movie/list",
        {
          params: {
            api_key: "72510f88b8a58703a0be11d44df6954d",
          },
        }
      );
      setgenre(response.data.genres);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: {
            api_key: "72510f88b8a58703a0be11d44df6954d",
            sort_by: sortby,
            page: 1,
            with_genres: selectedGenre,
            query: squery,
          },
        }
      );
      setMovie(response.data.results);
    };
    fetchMovies();
  }, [squery, sortby, selectedGenre]);
  const handlechange = (event) => {
    setquery(event.target.value);
  };
  const handlesortchange = (event) => {
    setSortby(event.target.value);
  };
  const handleGenreChange = (event) => {
    setselectedGenre(event.target.value);
  };

  const handlesubmit = async () => {
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: "72510f88b8a58703a0be11d44df6954d",
          query: squery,
        },
      }
    );
    setMovie(response.data.results || []);
  };

  const toggleDescription = (movieId) => {
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="container">MOVIE EXPLORER</h1>
        <div className="contain">
          <input
            type="text"
            placeholder="search movie"
            value={squery}
            onChange={handlechange}
          />
          <button type="submit" onClick={handlesubmit} className="container2">
            <AiOutlineSearch />
          </button>
        </div>
        <div className="diver">
          <label htmlFor="sort-by" className="contain4">
            sortby:
          </label>
          <select id="sort-by" value={sortby} onChange={handlesortchange}>
            <option value="popularity.desc">Popularity Descending</option>
            <option value="popularity.asc">Popularity Ascending</option>
            <option value="vote_average.desc">Rating Descending</option>
            <option value="vote_average.asc">Rating Ascending</option>
            <option value="release_date.desc">Release Date Descending</option>
            <option value="release_date.asc">Release Date Ascending</option>
          </select>
          <label htmlFor="genre" className="contain3">
            Genre:
          </label>
          <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
            <option value="">ALL GENRE</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter">
          {movie.map((movie) => (
            <div key={movie.id} className="movie">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <h2>{movie.title}</h2>
              <p className="rating">Rating: {movie.vote_average}</p>
              {expandedMovieId === movie.id ? (
                <p>{movie.overview}</p>
              ) : (
                <p>{movie.overview.substring(0, 150)}...</p>
              )}
              <button
                onClick={() => toggleDescription(movie.id)}
                className="read-more"
              >
                {expandedMovieId === movie.id ? "Show Less" : "Read More"}
              </button>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}
