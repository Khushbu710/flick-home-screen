
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar } from "lucide-react";
import { Movie } from '@/hooks/useMovies';

interface MovieCardProps {
  movie: Movie;
  onBookNow: (movie: Movie) => void;
}

const MovieCard = ({ movie, onBookNow }: MovieCardProps) => {
  // Array of fallback poster images
  const fallbackPosters = [
    "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop",
    "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=450&fit=crop",
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=450&fit=crop",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=450&fit=crop"
  ];

  // Generate a consistent fallback image based on movie ID
  const getFallbackImage = (movieId: string) => {
    const index = movieId.charCodeAt(0) % fallbackPosters.length;
    return fallbackPosters[index];
  };

  const posterUrl = movie.poster_url || getFallbackImage(movie.id);

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={posterUrl} 
          alt={movie.title}
          className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // If the image fails to load, use a fallback
            const target = e.target as HTMLImageElement;
            if (target.src !== getFallbackImage(movie.id)) {
              target.src = getFallbackImage(movie.id);
            }
          }}
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
          <Star className="h-3 w-3 text-yellow-400 mr-1" />
          {movie.rating || 'N/A'}
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2">{movie.title}</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genres?.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{movie.language} • {movie.duration} min</span>
        </div>
        <Button 
          className="w-full bg-red-600 hover:bg-red-700 text-white" 
          size="sm"
          onClick={() => onBookNow(movie)}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
