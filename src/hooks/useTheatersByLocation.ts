
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Theater {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
}

export const useTheatersByLocation = (location: string) => {
  return useQuery({
    queryKey: ['theaters', location],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('theaters')
        .select('*')
        .eq('city', location)
        .order('name');

      if (error) {
        console.error('Error fetching theaters:', error);
        throw new Error(error.message);
      }

      return data as Theater[];
    },
  });
};
