/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsBookmarkPlusFill, BsBookmarkCheckFill } from "react-icons/bs";
import { addToWatchlist } from "../../store/watchListSlice";

const OMDB_API_KEY = "5ba0a15c";

const MovieDetails = ({ movieId, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
 const currentUser = useSelector((state) => state.user.currentUser);
  const userWatchlist = useSelector((state) => state.watchlist.lists[currentUser?.id] || []);
  const searchHistory = useSelector((state) => state.movies.searchHistory);
  const currentSearchTerm = searchHistory[0] || "";
  const dispatch = useDispatch();

  const isInWatchlist = userWatchlist.some((movie) => movie.id === movieId);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${movieId}&plot=full`
        );
        const data = await response.json();
        if (data.Response === "True") {
          setMovieDetails(data);
        }
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const handleAddToWatchlist = () => {
    if (currentUser && !isInWatchlist) {
      dispatch(
        addToWatchlist({
          userId: currentUser.id,
          movie: {
            id: movieDetails.imdbID,
            title: movieDetails.Title,
            poster_path: movieDetails.Poster !== "N/A" ? movieDetails.Poster : null,
            release_date: movieDetails.Year,
          },
          searchTerm: currentSearchTerm
        })
      );
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">Loading...</div>
      </div>
    );
  }

  if (!movieDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="p-6 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            {movieDetails.Poster !== "N/A" ? (
              <img
                src={movieDetails.Poster}
                alt={movieDetails.Title}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
                No Poster Available
              </div>
            )}
          </div>

          <div className="md:w-2/3">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold mb-2">{movieDetails.Title}</h2>
              {currentUser && (
                <button
                  onClick={handleAddToWatchlist}
                  disabled={isInWatchlist}
                  className={`mt-4 w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                    isInWatchlist 
                      ? 'bg-green-500 text-white cursor-default'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {isInWatchlist ? (
                    <>
                      <BsBookmarkCheckFill size={20} />
                      Added to Watchlist
                    </>
                  ) : (
                    <>
                      <BsBookmarkPlusFill size={20} />
                      Add to Watchlist
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                <span className="font-semibold">Year:</span> {movieDetails.Year}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Runtime:</span>{" "}
                {movieDetails.Runtime}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Genre:</span>{" "}
                {movieDetails.Genre}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Director:</span>{" "}
                {movieDetails.Director}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Cast:</span>{" "}
                {movieDetails.Actors}
              </p>
              <div>
                <h3 className="font-semibold mb-2">Plot Summary</h3>
                <p className="text-gray-600">{movieDetails.Plot}</p>
              </div>
              {movieDetails.Ratings?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Ratings</h3>
                  <div className="space-y-2">
                    {movieDetails.Ratings.map((rating, index) => (
                      <p key={index} className="text-gray-600">
                        {rating.Source}: {rating.Value}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
