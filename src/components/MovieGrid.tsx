
import { Loader2 } from "lucide-react";
import { Movie } from '@/hooks/useMovies';
import GenreFilter from './GenreFilter';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
  onBookNow: (movie: Movie) => void;
  selectedLocation: string;
}

const MovieGrid = ({ movies, isLoading, selectedGenre, onGenreSelect, onBookNow, selectedLocation }: MovieGridProps) => {
  const genres = ["All", "Action", "Adventure", "Drama", "Sci-Fi", "Crime"];
  
  const filteredMovies = selectedGenre === "All" 
    ? movies 
    : movies.filter(movie => movie.genres?.includes(selectedGenre));

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Movies in {selectedLocation}</h2>
          <GenreFilter 
            genres={genres}
            selectedGenre={selectedGenre}
            onGenreSelect={onGenreSelect}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard 
                key={movie.id}
                movie={movie}
                onBookNow={onBookNow}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No movies found for the selected genre in {selectedLocation}.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieGrid;
