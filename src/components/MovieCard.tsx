
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
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={movie.poster_url || "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop"} 
          alt={movie.title}
          className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
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
