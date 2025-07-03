
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useMovies, Movie } from '@/hooks/useMovies';
import UserButton from '@/components/UserButton';
import MovieBooking from '@/components/MovieBooking';

const Index = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { data: movies, isLoading: moviesLoading } = useMovies();
  const navigate = useNavigate();

  const genres = ["All", "Action", "Adventure", "Drama", "Sci-Fi", "Crime"];

  const filteredMovies = selectedGenre === "All" 
    ? movies || []
    : movies?.filter(movie => movie.genres?.includes(selectedGenre)) || [];

  // Show featured movies (first 3)
  const featuredMovies = movies?.slice(0, 3) || [];

  const handleBookNow = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedMovie(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-red-600">BookMyShow</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Mumbai</span>
              </div>
              {user ? (
                <UserButton />
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Featured Movies */}
      <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">Featured Movies</h2>
          {moviesLoading ? (
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
                        onClick={() => handleBookNow(movie)}
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

      {/* Movie Listings */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Movies in Mumbai</h2>
            
            {/* Genre Filter */}
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGenre(genre)}
                  className={selectedGenre === genre ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>

          {/* Movie Grid */}
          {moviesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {filteredMovies.map((movie) => (
                <Card key={movie.id} className="group cursor-pointer hover:shadow-lg transition-shadow duration-300">
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
                      onClick={() => handleBookNow(movie)}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!moviesLoading && filteredMovies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No movies found for the selected genre.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-4">BookMyShow</h3>
          <p className="text-gray-400 text-sm">Your ultimate destination for movie bookings</p>
        </div>
      </footer>

      {/* Movie Booking Modal */}
      <MovieBooking 
        movie={selectedMovie}
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
      />
    </div>
  );
};

export default Index;
