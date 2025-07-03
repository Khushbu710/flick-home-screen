
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Theater {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
}

export const useTheaters = () => {
  return useQuery({
    queryKey: ['theaters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('theaters')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching theaters:', error);
        throw new Error(error.message);
      }

      return data as Theater[];
    },
  });
};
