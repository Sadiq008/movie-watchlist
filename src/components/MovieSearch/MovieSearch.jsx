import { useState } from "react";
import { useDispatch } from "react-redux";
import { CiSearch } from "react-icons/ci";
import {
  setMovies,
  setLoading,
  setError,
  addToSearchHistory,
} from "../../store/movieSlice";

const MovieSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const handleSearch = async () => {
  if (!searchTerm.trim()) return;

  dispatch(setLoading(true));
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=5ba0a15c&s=${searchTerm}`
    );
    const data = await response.json();

    if (data.Response === "True") {
      dispatch(
        setMovies(
          data.Search.map((movie) => ({
            id: movie.imdbID,
            title: movie.Title,
            poster_path: movie.Poster === "N/A" ? null : movie.Poster,
            release_date: movie.Year,
          }))
        )
      );
      dispatch(addToSearchHistory(searchTerm.toLowerCase())); // Add toLowerCase()
    } else {
      dispatch(setError(data.Error));
    }
  } catch (error) {
    dispatch(setError("Failed to fetch movies", error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center border border-[#b5b5b5] rounded-md">
        <CiSearch className="text-gray-400 text-xl mr-2 ml-2" />
        <input
          type="search"
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search movies..."
          className="outline-none flex-grow bg-transparent p-2"
        />
        <button
          onClick={handleSearch}
          className="py-2 px-4 bg-[#f23f3f] text-white rounded-t-md rounded-b-md rounded-r-md border-2 border-transparent hover:bg-[#ff5353]"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default MovieSearch;
