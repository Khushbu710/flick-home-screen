
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Loader2 } from "lucide-react";
import { Movie } from '@/hooks/useMovies';

interface HeroSectionProps {
  movies: Movie[];
  isLoading: boolean;
  onBookNow: (movie: Movie) => void;
}

const HeroSection = ({ movies, isLoading, onBookNow }: HeroSectionProps) => {
  const featuredMovies = movies.slice(0, 3);

  return (
    <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold mb-6">Featured Movies</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredMovies.map((movie) => (
              <Card key={movie.id} className="bg-white/10 backdrop-blur-sm border-white/20 text-white overflow-hidden">
                <div className="flex">
                  <img 
                    src={movie.poster_url || "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop"} 
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded-l-lg"
                  />
                  <CardContent className="p-4 flex-1">
                    <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm">{movie.rating || 'N/A'}/10</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {movie.genres?.slice(0, 2).map((g) => (
                        <Badge key={g} variant="secondary" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-white/80 mb-2">{movie.duration} min</p>
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => onBookNow(movie)}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
