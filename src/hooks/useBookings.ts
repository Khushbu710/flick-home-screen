
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Booking {
  id: string;
  user_id: string;
  movie_id: string;
  theater_id: string;
  showtime_id: string;
  selected_seats: string[];
  total_amount: number;
  payment_method: string;
  payment_status: string;
  booking_reference: string;
  created_at: string;
  updated_at: string;
  // Joined data
  movie?: {
    title: string;
    poster_url: string;
  };
  theater?: {
    name: string;
    address: string;
  };
  showtime?: {
    show_date: string;
    show_time: string;
    price: number;
  };
}

export const useBookings = (userId?: string) => {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          movie:movies(title, poster_url),
          theater:theaters(name, address),
          showtime:showtimes(show_date, show_time, price)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw new Error(error.message);
      }

      return data as Booking[];
    },
    enabled: !!userId,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: {
      user_id: string;
      movie_id: string;
      theater_id: string;
      showtime_id: string;
      selected_seats: string[];
      total_amount: number;
      payment_method: string;
      payment_status: string;
      booking_reference: string;
    }) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
