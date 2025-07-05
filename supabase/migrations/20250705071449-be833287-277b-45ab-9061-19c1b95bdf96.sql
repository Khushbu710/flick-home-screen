
-- First, let's add more diverse movies to the database
INSERT INTO public.movies (title, description, poster_url, rating, duration, release_date, language, genres, is_active) VALUES
('The Dark Knight Returns', 'Batman faces his greatest challenge in this epic finale to the trilogy.', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop', 9.0, 165, '2024-01-15', 'English', ARRAY['Action', 'Drama', 'Crime'], true),
('Bollywood Dreams', 'A heartwarming story of dreams, music, and family in modern India.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop', 8.2, 155, '2024-02-10', 'Hindi', ARRAY['Drama', 'Romance', 'Musical'], true),
('Space Odyssey 2025', 'Humanity ventures into deep space in this stunning sci-fi epic.', 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=450&fit=crop', 8.8, 180, '2024-01-22', 'English', ARRAY['Sci-Fi', 'Adventure', 'Drama'], true),
('Chennai Express 2', 'The hilarious sequel to the beloved comedy adventure.', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=450&fit=crop', 7.5, 145, '2024-02-05', 'Tamil', ARRAY['Comedy', 'Action', 'Romance'], true),
('Mission Impossible 8', 'Ethan Hunt returns for his most dangerous mission yet.', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=450&fit=crop', 8.5, 148, '2024-01-30', 'English', ARRAY['Action', 'Thriller', 'Adventure'], true),
('Punjabi Warriors', 'An epic tale of courage and brotherhood set in Punjab.', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop', 8.0, 140, '2024-02-12', 'Punjabi', ARRAY['Action', 'Drama', 'Historical'], true),
('Bengal Tiger', 'A thrilling action drama set in the streets of Kolkata.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop', 7.8, 135, '2024-01-28', 'Bengali', ARRAY['Action', 'Crime', 'Thriller'], true),
('Hyderabad Nights', 'A romantic comedy exploring modern relationships in the IT city.', 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=450&fit=crop', 7.2, 125, '2024-02-08', 'Telugu', ARRAY['Romance', 'Comedy', 'Drama'], true),
('Delhi Diaries', 'Multiple interconnected stories from the heart of India.', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=450&fit=crop', 8.3, 160, '2024-01-25', 'Hindi', ARRAY['Drama', 'Romance', 'Comedy'], true),
('Bangalore Techies', 'A slice-of-life comedy about software engineers in Silicon Valley of India.', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=450&fit=crop', 7.6, 130, '2024-02-15', 'Kannada', ARRAY['Comedy', 'Drama', 'Romance'], true),
('Pune Patriots', 'A sports drama about a local cricket team chasing their dreams.', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop', 8.1, 142, '2024-01-20', 'Marathi', ARRAY['Drama', 'Sports', 'Inspiration'], true),
('Superhero Origins', 'The beginning of a new superhero franchise with stunning visuals.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop', 8.4, 152, '2024-02-01', 'English', ARRAY['Action', 'Sci-Fi', 'Adventure'], true);

-- Add extensive showtimes for all movies across all cities with more time slots
WITH all_theaters AS (
  SELECT id, city, name FROM theaters
),
all_movies AS (
  SELECT id, title FROM movies WHERE is_active = true
),
comprehensive_time_slots AS (
  SELECT unnest(ARRAY[
    '06:30', '08:00', '09:15', '10:30', '11:45', 
    '13:00', '14:15', '15:30', '16:45', '18:00', 
    '19:15', '20:30', '21:45', '23:00', '00:15'
  ]) as show_time
),
extended_dates AS (
  SELECT CURRENT_DATE + generate_series(0, 21) as show_date -- Extended to 3 weeks
)
INSERT INTO public.showtimes (movie_id, theater_id, show_date, show_time, price, available_seats, total_seats)
SELECT 
  m.id as movie_id,
  t.id as theater_id,
  d.show_date,
  ts.show_time::time as show_time,
  CASE 
    WHEN ts.show_time IN ('06:30', '08:00', '09:15') THEN 100 + (random() * 40)::integer
    WHEN ts.show_time IN ('10:30', '11:45', '13:00') THEN 140 + (random() * 40)::integer
    WHEN ts.show_time IN ('14:15', '15:30', '16:45') THEN 180 + (random() * 50)::integer
    WHEN ts.show_time IN ('18:00', '19:15', '20:30') THEN 220 + (random() * 60)::integer
    ELSE 280 + (random() * 70)::integer -- Late night premium
  END as price,
  50 + (random() * 60)::integer as available_seats,
  120 as total_seats
FROM all_movies m
CROSS JOIN all_theaters t
CROSS JOIN comprehensive_time_slots ts
CROSS JOIN extended_dates d
WHERE random() > 0.15 -- Higher availability of showtimes
ON CONFLICT DO NOTHING;

-- Add special weekend marathon shows (double features)
INSERT INTO public.showtimes (movie_id, theater_id, show_date, show_time, price, available_seats, total_seats)
SELECT 
  m.id as movie_id,
  t.id as theater_id,
  d.show_date,
  ts.show_time::time as show_time,
  400 + (random() * 100)::integer as price, -- Premium pricing for marathon shows
  30 + (random() * 40)::integer as available_seats,
  120 as total_seats
FROM all_movies m
CROSS JOIN all_theaters t
CROSS JOIN (VALUES ('02:30'), ('04:00'), ('05:15')) ts(show_time)
CROSS JOIN (
  SELECT CURRENT_DATE + generate_series(0, 21) as show_date
  WHERE EXTRACT(dow FROM CURRENT_DATE + generate_series(0, 21)) IN (0, 5, 6) -- Friday, Saturday, Sunday
) d
WHERE random() > 0.7 -- Limited special shows
ON CONFLICT DO NOTHING;

-- Add matinee shows with special pricing for weekdays
INSERT INTO public.showtimes (movie_id, theater_id, show_date, show_time, price, available_seats, total_seats)
SELECT 
  m.id as movie_id,
  t.id as theater_id,
  d.show_date,
  ts.show_time::time as show_time,
  80 + (random() * 30)::integer as price, -- Discounted matinee pricing
  70 + (random() * 40)::integer as available_seats,
  120 as total_seats
FROM all_movies m
CROSS JOIN all_theaters t
CROSS JOIN (VALUES ('12:00'), '14:00', '16:00') ts(show_time)
CROSS JOIN (
  SELECT CURRENT_DATE + generate_series(0, 21) as show_date
  WHERE EXTRACT(dow FROM CURRENT_DATE + generate_series(0, 21)) BETWEEN 1 AND 5 -- Monday to Friday
) d
WHERE random() > 0.3
ON CONFLICT DO NOTHING;
