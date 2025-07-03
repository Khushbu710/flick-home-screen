
-- Create theaters table
CREATE TABLE public.theaters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Mumbai',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create showtimes table
CREATE TABLE public.showtimes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
  theater_id UUID REFERENCES public.theaters(id) ON DELETE CASCADE NOT NULL,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  available_seats INTEGER NOT NULL DEFAULT 100,
  total_seats INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.theaters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showtimes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to theaters" 
ON public.theaters 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to showtimes" 
ON public.showtimes 
FOR SELECT 
USING (true);

-- Insert sample theaters
INSERT INTO public.theaters (name, address, city, phone) VALUES
('PVR Cinemas Phoenix', 'High Street Phoenix, Lower Parel', 'Mumbai', '+91-22-6671-8888'),
('INOX Megaplex', 'R City Mall, Ghatkopar West', 'Mumbai', '+91-22-2500-0000'),
('Cinepolis Fun Republic', 'Fun Republic Mall, Andheri West', 'Mumbai', '+91-22-6745-1000'),
('MovieMax Infiniti', 'Infiniti Mall, Malad West', 'Mumbai', '+91-22-2844-4444'),
('PVR Icon', 'Palladium Mall, Lower Parel', 'Mumbai', '+91-22-6671-7777');

-- Insert sample showtimes for different movies and theaters
-- Get movie IDs first (assuming we have movies in the database)
WITH movie_ids AS (
  SELECT id, title FROM public.movies LIMIT 5
),
theater_ids AS (
  SELECT id, name FROM public.theaters
)
INSERT INTO public.showtimes (movie_id, theater_id, show_date, show_time, price, available_seats)
SELECT 
  m.id,
  t.id,
  CURRENT_DATE + INTERVAL '1 day' * (CASE WHEN random() < 0.5 THEN 0 ELSE 1 END),
  (ARRAY['10:00', '13:30', '17:00', '20:30'])[floor(random() * 4 + 1)]::TIME,
  150 + (random() * 100)::INTEGER,
  80 + (random() * 20)::INTEGER
FROM movie_ids m
CROSS JOIN theater_ids t
WHERE random() < 0.7; -- Add some randomness to make it realistic

-- Add more showtimes for popular movies
INSERT INTO public.showtimes (movie_id, theater_id, show_date, show_time, price, available_seats)
SELECT 
  m.id,
  t.id,
  CURRENT_DATE + INTERVAL '2 days',
  (ARRAY['11:00', '14:30', '18:00', '21:30'])[floor(random() * 4 + 1)]::TIME,
  150 + (random() * 100)::INTEGER,
  75 + (random() * 25)::INTEGER
FROM (SELECT id FROM public.movies LIMIT 3) m
CROSS JOIN (SELECT id FROM public.theaters) t
WHERE random() < 0.8;
