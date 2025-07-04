
-- Create bookings table to store completed bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  movie_id UUID REFERENCES public.movies(id),
  theater_id UUID REFERENCES public.theaters(id),
  showtime_id UUID REFERENCES public.showtimes(id),
  selected_seats TEXT[] NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  booking_reference TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add some sample movies with proper poster URLs
INSERT INTO public.movies (title, description, poster_url, rating, duration, release_date, language, genres, is_active) VALUES
('Avengers: Endgame', 'The epic conclusion to the Infinity Saga', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop', 8.4, 181, '2019-04-26', 'English', ARRAY['Action', 'Adventure', 'Sci-Fi'], true),
('Spider-Man: No Way Home', 'Spider-Man faces his greatest challenge yet', 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop', 8.2, 148, '2021-12-17', 'English', ARRAY['Action', 'Adventure', 'Sci-Fi'], true),
('The Dark Knight', 'Batman faces the Joker in this epic crime thriller', 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop', 9.0, 152, '2008-07-18', 'English', ARRAY['Action', 'Crime', 'Drama'], true),
('Inception', 'A thief enters the dreams of others to steal secrets', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop', 8.8, 148, '2010-07-16', 'English', ARRAY['Action', 'Sci-Fi', 'Drama'], true),
('Interstellar', 'A team of explorers travel through a wormhole in space', 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop', 8.6, 169, '2014-11-07', 'English', ARRAY['Adventure', 'Drama', 'Sci-Fi'], true),
('Dune', 'A noble family becomes embroiled in a war for control', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop', 8.0, 155, '2021-10-22', 'English', ARRAY['Adventure', 'Drama', 'Sci-Fi'], true),
('Black Panther', 'The king of Wakanda fights to protect his nation', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', 7.3, 134, '2018-02-16', 'English', ARRAY['Action', 'Adventure', 'Sci-Fi'], true),
('Top Gun: Maverick', 'Maverick trains a new generation of pilots', 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=600&fit=crop', 8.3, 130, '2022-05-27', 'English', ARRAY['Action', 'Drama'], true),
('Avatar: The Way of Water', 'Jake Sully and his family face new threats', 'https://images.unsplash.com/photo-1544077960-604201fe74bc?w=400&h=600&fit=crop', 7.6, 192, '2022-12-16', 'English', ARRAY['Action', 'Adventure', 'Sci-Fi'], true),
('Fast X', 'Dom and his family face their most lethal opponent', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop', 5.8, 141, '2023-05-19', 'English', ARRAY['Action', 'Adventure', 'Crime'], true);
