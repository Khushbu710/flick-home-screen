
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Showtime {
  id: string;
  movie_id: string;
  theater_id: string;
  show_date: string;
  show_time: string;
  price: number;
  available_seats: number;
  total_seats: number;
}

export const useShowtimes = (movieId?: string) => {
  return useQuery({
    queryKey: ['showtimes', movieId],
    queryFn: async () => {
      if (!movieId) return [];
      
      const { data, error } = await supabase
        .from('showtimes')
        .select('*')
        .eq('movie_id', movieId)
        .order('show_date', { ascending: true })
        .order('show_time', { ascending: true });

      if (error) {
        console.error('Error fetching showtimes:', error);
        throw new Error(error.message);
      }

      return data as Showtime[];
    },
    enabled: !!movieId,
  });
};
