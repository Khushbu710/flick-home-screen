
import { Button } from "@/components/ui/button";

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
}

const GenreFilter = ({ genres, selectedGenre, onGenreSelect }: GenreFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <Button
          key={genre}
          variant={selectedGenre === genre ? "default" : "outline"}
          size="sm"
          onClick={() => onGenreSelect(genre)}
          className={selectedGenre === genre ? "bg-red-600 hover:bg-red-700" : ""}
        >
          {genre}
        </Button>
      ))}
    </div>
  );
};

export default GenreFilter;
