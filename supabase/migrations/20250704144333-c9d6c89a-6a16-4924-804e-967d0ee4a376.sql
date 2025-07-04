
-- Add sample theaters first
INSERT INTO public.theaters (name, address, city, phone) VALUES
('PVR Phoenix Mills', 'High Street Phoenix, Lower Parel', 'Mumbai', '+91-22-6671-7777'),
('INOX R-City Mall', 'R City Mall, Ghatkopar West', 'Mumbai', '+91-22-6745-1111'),
('Cinepolis Fun Republic', 'Fun Republic Mall, Andheri West', 'Mumbai', '+91-22-6745-2222'),
('PVR Icon', 'Infiniti Mall, Malad West', 'Mumbai', '+91-22-6745-3333'),
('Multiplex Carnival', 'Carnival Cinemas, Wadala', 'Mumbai', '+91-22-6745-4444');

-- Add sample showtimes for different movies and theaters
-- Get movie IDs and theater IDs for sample data
WITH movie_theater_data AS (
  SELECT 
    m.id as movie_id,
    t.id as theater_id,
    m.title,
    t.name as theater_name
  FROM movies m 
  CROSS JOIN theaters t
  WHERE m.is_active = true
  LIMIT 50
)
INSERT INTO public.showtimes (movie_id, theater_id, show_date, show_time, price, available_seats)
SELECT 
  movie_id,
  theater_id,
  CURRENT_DATE + (random() * 7)::integer as show_date,
  (ARRAY['09:00', '12:30', '15:45', '18:30', '21:15'])[floor(random() * 5 + 1)]::time as show_time,
  (ARRAY[150, 200, 250, 300, 350])[floor(random() * 5 + 1)] as price,
  floor(random() * 80 + 20)::integer as available_seats
FROM movie_theater_data;

-- Add more showtimes for today and next few days to ensure availability
INSERT INTO public.showtimes (movie_id, theater_id, show_date, show_time, price, available_seats)
SELECT 
  m.id as movie_id,
  t.id as theater_id,
  CURRENT_DATE + day_offset as show_date,
  show_times.show_time::time as show_time,
  (ARRAY[150, 200, 250, 300])[floor(random() * 4 + 1)] as price,
  floor(random() * 60 + 40)::integer as available_seats
FROM movies m 
CROSS JOIN theaters t
CROSS JOIN generate_series(0, 6) as day_offset
CROSS JOIN (VALUES ('10:00'), ('13:30'), ('17:00'), ('20:30')) as show_times(show_time)
WHERE m.is_active = true
LIMIT 200;
