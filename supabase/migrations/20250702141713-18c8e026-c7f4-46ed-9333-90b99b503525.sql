
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  city TEXT DEFAULT 'Mumbai',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create movies table
CREATE TABLE public.movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  poster_url TEXT,
  rating DECIMAL(3,1),
  duration INTEGER, -- in minutes
  release_date DATE,
  language TEXT DEFAULT 'English',
  genres TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create theaters table
CREATE TABLE public.theaters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT DEFAULT 'Mumbai',
  total_seats INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create showtimes table
CREATE TABLE public.showtimes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE,
  theater_id UUID REFERENCES public.theaters(id) ON DELETE CASCADE,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  available_seats INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  showtime_id UUID REFERENCES public.showtimes(id) ON DELETE CASCADE,
  seats_booked INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_status TEXT DEFAULT 'confirmed' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  booking_reference TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user preferences table for AI recommendations
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  preferred_genres TEXT[] DEFAULT '{}',
  preferred_languages TEXT[] DEFAULT '{"English"}',
  preferred_cities TEXT[] DEFAULT '{"Mumbai"}',
  last_booking_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theaters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showtimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for movies (public read)
CREATE POLICY "Anyone can view active movies" ON public.movies
  FOR SELECT USING (is_active = true);

-- RLS Policies for theaters (public read)
CREATE POLICY "Anyone can view theaters" ON public.theaters
  FOR SELECT USING (true);

-- RLS Policies for showtimes (public read)
CREATE POLICY "Anyone can view showtimes" ON public.showtimes
  FOR SELECT USING (true);

-- RLS Policies for bookings (user-specific)
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample data
INSERT INTO public.movies (title, description, poster_url, rating, duration, release_date, language, genres) VALUES
('Avengers: Endgame', 'After the devastating events of Avengers: Infinity War, the universe is in ruins.', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop', 8.4, 181, '2019-04-26', 'English', '{"Action", "Adventure", "Drama"}'),
('Spider-Man: No Way Home', 'Spider-Man''s identity is revealed and he can no longer separate his normal life from his superhero responsibilities.', 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=450&fit=crop', 8.2, 148, '2021-12-17', 'English', '{"Action", "Adventure", "Sci-Fi"}'),
('The Batman', 'Batman ventures into Gotham City''s underworld when a sadistic killer leaves behind a trail of cryptic clues.', 'https://images.unsplash.com/photo-1635863138275-d9864d73fda5?w=300&h=450&fit=crop', 7.8, 176, '2022-03-04', 'English', '{"Action", "Crime", "Drama"}'),
('Dune', 'A noble family becomes embroiled in a war for control over the galaxy''s most valuable asset.', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop', 8.0, 155, '2021-10-22', 'English', '{"Action", "Adventure", "Drama"}'),
('Top Gun: Maverick', 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=450&fit=crop', 8.3, 130, '2022-05-27', 'English', '{"Action", "Drama"}'),
('Black Panther', 'T''Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop', 7.3, 134, '2018-02-16', 'English', '{"Action", "Adventure", "Sci-Fi"}');

INSERT INTO public.theaters (name, location, city) VALUES
('PVR Cinemas Phoenix', 'Phoenix MarketCity, Kurla West', 'Mumbai'),
('INOX Leisure Ltd', 'R City Mall, Ghatkopar West', 'Mumbai'),
('Cinepolis Fun Cinemas', 'Andheri West', 'Mumbai'),
('Carnival Cinemas', 'Imax Wadala', 'Mumbai');

-- Insert sample showtimes for today and tomorrow
INSERT INTO public.showtimes (movie_id, theater_id, show_date, show_time, price, available_seats) 
SELECT 
  m.id,
  t.id,
  CURRENT_DATE + (days || ' day')::interval,
  (times.show_time || ':00')::time,
  CASE 
    WHEN times.show_time::int < 12 THEN 150.00
    WHEN times.show_time::int < 18 THEN 200.00
    ELSE 250.00
  END,
  95
FROM public.movies m
CROSS JOIN public.theaters t
CROSS JOIN (VALUES (0), (1)) AS days_offset(days)
CROSS JOIN (VALUES ('10:00'), ('13:30'), ('17:00'), ('20:30')) AS times(show_time)
WHERE m.is_active = true;
