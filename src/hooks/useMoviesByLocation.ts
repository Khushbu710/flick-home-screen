
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Movie {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  rating: number | null;
  duration: number | null;
  release_date: string | null;
  language: string | null;
  genres: string[] | null;
  is_active: boolean | null;
}

export const useMoviesByLocation = (location: string) => {
  return useQuery({
    queryKey: ['movies', location],
    queryFn: async () => {
      // First get theaters in the selected location
      const { data: theaters, error: theatersError } = await supabase
        .from('theaters')
        .select('id')
        .eq('city', location);

      if (theatersError) {
        console.error('Error fetching theaters:', theatersError);
        throw new Error(theatersError.message);
      }

      if (!theaters || theaters.length === 0) {
        return [];
      }

      const theaterIds = theaters.map(theater => theater.id);

      // Get movies that have showtimes in those theaters
      const { data: showtimes, error: showtimesError } = await supabase
        .from('showtimes')
        .select('movie_id')
        .in('theater_id', theaterIds);

      if (showtimesError) {
        console.error('Error fetching showtimes:', showtimesError);
        throw new Error(showtimesError.message);
      }

      if (!showtimes || showtimes.length === 0) {
        return [];
      }

      const movieIds = [...new Set(showtimes.map(showtime => showtime.movie_id))];

      // Get the actual movie details
      const { data: movies, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .in('id', movieIds)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (moviesError) {
        console.error('Error fetching movies:', moviesError);
        throw new Error(moviesError.message);
      }

      return movies as Movie[];
    },
  });
};
