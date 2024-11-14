import { BsBookmarkPlusFill } from "react-icons/bs";
import MovieSearch from "../components/MovieSearch/MovieSearch";
import Movies from "../components/Movies/Movies";

const Home = () => {
  return (
    <div className="p-10 flex flex-col ml-[320px]">
      <div className="border border-[#a85859] rounded-lg p-6">
        <h1 className="text-4xl mb-10">
          Welcome to <span className="text-[#f23f3f]">Watchlists</span>
        </h1>
        <h3 className="mb-4">
          Browse movies, add them to watchlists and share them with friends.
        </h3>
        <h3 className="flex">
          Just Click the{" "}
          <BsBookmarkPlusFill size={"30px"} className="mx-1" color="gray" /> to
          add a movie, the poster to see more details created to mark the movie
          as watched.
        </h3>
      </div>
      <MovieSearch />
      <Movies />
    </div>
  );
};

export default Home;
