/* eslint-disable react/prop-types */
import { useSelector, useDispatch } from "react-redux";
import { removeFromWatchlist, toggleWatched } from "../../store/watchListSlice";
import { BsCheckCircle, BsCheckCircleFill, BsTrash } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ListView = () => {
  const location = useLocation(); // Add this hook
  const [currentTerm, setCurrentTerm] = useState(null); // Add state for currentTerm
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const watchlist = useSelector(
    (state) => state.watchlist.lists[currentUser?.id] || []
  );
  const searchTerms = useSelector(
    (state) => state.watchlist.searchTerms[currentUser?.id] || {}
  );
  const watchedMovies = useSelector(
    (state) => state.watchlist.watchedMovies[currentUser?.id] || []
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const term = searchParams.get("term");
    setCurrentTerm(term);
  }, [location.search]);

  const currentTermMovies = currentTerm
    ? watchlist.filter((movie) => searchTerms[currentTerm]?.includes(movie.id))
    : [];

  if (!currentUser) {
    return (
      <div className="p-10 text-center ml-[320px]">
        <h2 className="text-xl">Please login to view your watchlist</h2>
      </div>
    );
  }

  const MovieCard = ({ movie }) => {
  const isWatched = watchedMovies.includes(movie.id);
  return (
    <div className="relative group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-[2/3] rounded-lg overflow-hidden">
        {movie.poster_path ? (
          <img
            src={movie.poster_path}
            alt={movie.title}
            className={`w-full h-full object-cover transition duration-300 group-hover:opacity-75 ${
              isWatched ? "opacity-60" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() =>
              dispatch(
                toggleWatched({
                  userId: currentUser.id,
                  movieId: movie.id,
                })
              )
            }
            className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
            title={isWatched ? "Mark as unwatched" : "Mark as watched"}
          >
            {isWatched ? (
              <BsCheckCircleFill size={20} className="text-green-500" />
            ) : (
              <BsCheckCircle size={20} className="text-gray-400" />
            )}
          </button>
          <button
            onClick={() =>
              dispatch(
                removeFromWatchlist({
                  userId: currentUser.id,
                  movieId: movie.id,
                })
              )
            }
            className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
            title="Remove from watchlist"
          >
            <BsTrash size={20} className="text-red-500" />
          </button>
        </div>
      </div>
      <div className="p-4">
        {/* Emoji Ratings Section */}
        <div className="flex items-center justify-between mb-3 text-sm">
          <div className="flex items-center gap-1">
            <span role="img" aria-label="star" className="text-base">⭐</span>
            <span className="text-gray-600 font-medium text-sm">8.5</span>
          </div>
          <div className="flex items-center gap-1">
            <span role="img" aria-label="popcorn" className="text-base">🍿</span>
            <span className="text-gray-600 font-medium text-sm">92%</span>
          </div>
          <div className="flex items-center gap-1">
            <span role="img" aria-label="tomato" className="text-base">🍅</span>
            <span className="text-gray-600 font-medium text-sm">88%</span>
          </div>
        </div>

        {/* Title and Release Date */}
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
            {movie.title}
            {isWatched && (
              <span className="ml-2 text-xs text-green-500 bg-green-100 px-2 py-0.5 rounded-full">
                Watched
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-600">{movie.release_date}</p>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="p-10 ml-[320px]">
      {currentTerm ? (
        <>
          <h2 className="text-4xl font-semibold mb-8 flex items-cente">
            Movies by {currentTerm} <span className="ml-8"><FaEdit/></span>
          </h2>

          <h3 className="font-semibold text-xl mb-4">About this watchlist</h3>
          <h3 className="text-lg mb-14">
            This list Lorem ipsum dolor et blah blah blah
          </h3>

          {currentTermMovies.length === 0 ? (
            <p className="text-gray-600">No movies found for {currentTerm}</p>
          ) : (
            <div className="grid grid-cols-4 gap-8">
              {currentTermMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">
            My Watchlist
          </h2>
          <div className="space-y-16">
            {Object.entries(searchTerms).map(([term, movieIds]) => {
              const termMovies = watchlist.filter((movie) =>
                movieIds.includes(movie.id)
              );

              if (termMovies.length === 0) return null;

              return (
                <div key={term} className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    Movies by {term}
                  </h3>
                  <h3 className="font-semibold text-xl mb-4">
                    About this watchlist
                  </h3>
                  <h3 className="text-lg mb-14">
                    This list Lorem ipsum dolor et blah blah blah
                  </h3>
                  <div className="grid grid-cols-4 gap-8">
                    {termMovies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ListView;
