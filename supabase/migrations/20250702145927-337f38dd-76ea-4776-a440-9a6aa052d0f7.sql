
-- Create the movies table
CREATE TABLE public.movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  poster_url TEXT,
  rating DECIMAL(3,1),
  duration INTEGER,
  release_date DATE,
  language TEXT,
  genres TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample movie data
INSERT INTO public.movies (title, description, poster_url, rating, duration, release_date, language, genres, is_active) VALUES
('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop', 9.0, 152, '2008-07-18', 'English', ARRAY['Action', 'Crime', 'Drama'], true),
('Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop', 8.8, 148, '2010-07-16', 'English', ARRAY['Action', 'Sci-Fi'], true),
('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop', 8.6, 169, '2014-11-07', 'English', ARRAY['Adventure', 'Drama', 'Sci-Fi'], true),
('The Avengers', 'Earth''s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop', 8.0, 143, '2012-05-04', 'English', ARRAY['Action', 'Adventure', 'Sci-Fi'], true),
('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 'https://images.unsplash.com/photo-1489599735734-79b4625d1e53?w=300&h=450&fit=crop', 8.9, 154, '1994-10-14', 'English', ARRAY['Crime', 'Drama'], true),
('The Matrix', 'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop', 8.7, 136, '1999-03-31', 'English', ARRAY['Action', 'Sci-Fi'], true),
('Fight Club', 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into an anarchist organization.', 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=300&h=450&fit=crop', 8.8, 139, '1999-10-15', 'English', ARRAY['Drama'], true),
('Forrest Gump', 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.', 'https://images.unsplash.com/photo-1489599735734-79b4625d1e53?w=300&h=450&fit=crop', 8.8, 142, '1994-07-06', 'English', ARRAY['Drama'], true);

-- Enable Row Level Security (optional, but good practice)
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to active movies
CREATE POLICY "Allow public read access to active movies" 
ON public.movies 
FOR SELECT 
USING (is_active = true);
