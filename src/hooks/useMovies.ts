
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

export const useMovies = () => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching movies:', error);
        throw new Error(error.message);
      }

      return data as Movie[];
    },
  });
};
