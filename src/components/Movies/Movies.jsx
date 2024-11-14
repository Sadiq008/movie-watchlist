import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsBookmarkPlusFill, BsBookmarkCheckFill } from "react-icons/bs";
import { addToWatchlist } from "../../store/watchListSlice";
import MovieDetails from "../MovieDetails/MovieDetails";

const Movies = () => {
   const [selectedMovieId, setSelectedMovieId] = useState(null);
  const { searchResults, loading, error, currentSearchTerm } = useSelector((state) => state.movies);
  const currentUser = useSelector((state) => state.user.currentUser);
  const userWatchlist = useSelector(
    (state) => state.watchlist.lists[currentUser?.id] || []
  );
  const dispatch = useDispatch();

  const handleAddToWatchlist = (movie) => {
    if (currentUser && !isInWatchlist(movie.id)) {
      dispatch(
        addToWatchlist({
          userId: currentUser.id,
          movie,
          searchTerm: currentSearchTerm.toLowerCase()
        })
      );
    }
  };

  const isInWatchlist = (movieId) => {
    return userWatchlist.some(movie => movie.id === movieId);
  };

  if (loading) return <div className="mt-8 text-center">Loading...</div>;
  if (error) return <div className="mt-8 text-center text-red-500">Error: {error}</div>;

  return (
    <>
      <div className="mt-8 grid grid-cols-4 gap-6">
        {searchResults.map((movie) => (
          <div key={movie.id} className="relative group">
            <div 
              onClick={() => setSelectedMovieId(movie.id)}
              className="cursor-pointer"
            >
              {movie.poster_path ? (
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  className="rounded-lg shadow-lg transition duration-300 group-hover:opacity-75 w-full h-[400px] object-cover"
                />
              ) : (
                <div className="rounded-lg shadow-lg bg-gray-200 w-full h-[400px] flex items-center justify-center">
                  No Poster Available
                </div>
              )}
            </div>
             <button
              onClick={() => handleAddToWatchlist(movie)} // Replace the existing onClick
              className={`absolute top-2 right-2 p-2 rounded-full shadow-md ${
                isInWatchlist(movie.id)
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-white hover:bg-gray-100'
              }`}
              disabled={!currentUser || isInWatchlist(movie.id)}
              title={
                !currentUser 
                  ? "Please login to add movies" 
                  : isInWatchlist(movie.id)
                  ? "Movie in watchlist"
                  : "Add to watchlist"
              }
            >
              {isInWatchlist(movie.id) ? (
                <BsBookmarkCheckFill 
                  size={20} 
                  className="text-white"
                />
              ) : (
                <BsBookmarkPlusFill 
                  size={20} 
                  className={`${currentUser ? 'text-gray-600' : 'text-gray-400'}`} 
                />
              )}
            </button>
            <h3 className="mt-2 font-semibold">{movie.title}</h3>
            <p className="text-sm text-gray-600">{movie.release_date}</p>
          </div>
        ))}
      </div>

      {selectedMovieId && (
        <MovieDetails 
          movieId={selectedMovieId} 
          onClose={() => setSelectedMovieId(null)} 
        />
      )}
    </>
  );
};

export default Movies;