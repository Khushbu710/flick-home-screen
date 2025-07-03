
import { useState } from 'react';
import { Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useMovies, Movie } from '@/hooks/useMovies';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MovieGrid from '@/components/MovieGrid';
import Footer from '@/components/Footer';
import MovieBooking from '@/components/MovieBooking';

const Index = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { loading: authLoading } = useAuth();
  const { data: movies, isLoading: moviesLoading } = useMovies();

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
      <Header />
      
      <HeroSection 
        movies={movies || []}
        isLoading={moviesLoading}
        onBookNow={handleBookNow}
      />

      <MovieGrid 
        movies={movies || []}
        isLoading={moviesLoading}
        selectedGenre={selectedGenre}
        onGenreSelect={setSelectedGenre}
        onBookNow={handleBookNow}
      />

      <Footer />

      <MovieBooking 
        movie={selectedMovie}
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
      />
    </div>
  );
};

export default Index;
