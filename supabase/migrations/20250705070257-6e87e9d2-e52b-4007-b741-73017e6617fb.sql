
-- Add theaters for other major cities
INSERT INTO public.theaters (name, address, city, phone) VALUES
-- Delhi theaters
('PVR Select City Walk', 'Select City Walk, Saket', 'Delhi', '+91-11-4166-8888'),
('INOX Nehru Place', 'Nehru Place, New Delhi', 'Delhi', '+91-11-4166-9999'),
('Cinepolis DLF Mall', 'DLF Mall of India, Noida', 'Delhi', '+91-11-4166-7777'),

-- Bangalore theaters
('PVR Forum Mall', 'Forum Mall, Koramangala', 'Bangalore', '+91-80-4166-8888'),
('INOX Garuda Mall', 'Garuda Mall, Magrath Road', 'Bangalore', '+91-80-4166-9999'),
('Cinepolis Orion Mall', 'Orion Mall, Brigade Gateway', 'Bangalore', '+91-80-4166-7777'),

-- Hyderabad theaters
('PVR Inorbit', 'Inorbit Mall, Madhapur', 'Hyderabad', '+91-40-4166-8888'),
('INOX GVK One', 'GVK One Mall, Banjara Hills', 'Hyderabad', '+91-40-4166-9999'),
('Cinepolis Forum Sujana', 'Forum Sujana Mall, Kukatpally', 'Hyderabad', '+91-40-4166-7777'),

-- Chennai theaters
('PVR Ampa Skywalk', 'Ampa Skywalk, Aminjikarai', 'Chennai', '+91-44-4166-8888'),
('INOX Express Avenue', 'Express Avenue Mall, Royapettah', 'Chennai', '+91-44-4166-9999'),
('Cinepolis VR Mall', 'VR Mall, Anna Nagar', 'Chennai', '+91-44-4166-7777'),

-- Kolkata theaters
('PVR South City', 'South City Mall, Jadavpur', 'Kolkata', '+91-33-4166-8888'),
('INOX City Centre', 'City Centre, Salt Lake', 'Kolkata', '+91-33-4166-9999'),
('Cinepolis Acropolis', 'Acropolis Mall, Rajdanga', 'Kolkata', '+91-33-4166-7777'),

-- Pune theaters
('PVR Phoenix MarketCity', 'Phoenix MarketCity, Viman Nagar', 'Pune', '+91-20-4166-8888'),
('INOX Jai Ganesh', 'Jai Ganesh Vision, Akurdi', 'Pune', '+91-20-4166-9999'),
('Cinepolis Seasons Mall', 'Seasons Mall, Magarpatta', 'Pune', '+91-20-4166-7777');

-- Add more comprehensive showtimes for all cities and movies
WITH all_theaters AS (
  SELECT id, city FROM theaters
),
all_movies AS (
  SELECT id FROM movies WHERE is_active = true
),
time_slots AS (
  SELECT unnest(ARRAY['09:30', '12:45', '16:00', '19:15', '22:30']) as show_time
),
dates AS (
  SELECT CURRENT_DATE + generate_series(0, 7) as show_date
)
INSERT INTO public.showtimes (movie_id, theater_id, show_date, show_time, price, available_seats, total_seats)
SELECT 
  m.id as movie_id,
  t.id as theater_id,
  d.show_date,
  ts.show_time::time as show_time,
  CASE 
    WHEN ts.show_time IN ('09:30', '12:45') THEN 150 + (random() * 50)::integer
    WHEN ts.show_time = '16:00' THEN 200 + (random() * 50)::integer
    ELSE 250 + (random() * 100)::integer
  END as price,
  80 + (random() * 40)::integer as available_seats,
  120 as total_seats
FROM all_movies m
CROSS JOIN all_theaters t
CROSS JOIN time_slots ts
CROSS JOIN dates d
WHERE random() > 0.3; -- Add some randomness to make it realistic

-- Add additional weekend showtimes
INSERT INTO public.showtimes (movie_id, theater_id, show_date, show_time, price, available_seats, total_seats)
SELECT 
  m.id as movie_id,
  t.id as theater_id,
  d.show_date,
  ts.show_time::time as show_time,
  300 + (random() * 100)::integer as price,
  60 + (random() * 50)::integer as available_seats,
  120 as total_seeds
FROM (SELECT id FROM movies WHERE is_active = true LIMIT 8) m
CROSS JOIN (SELECT id FROM theaters) t
CROSS JOIN (VALUES ('11:00'), ('14:30'), ('18:00'), ('21:00')) ts(show_time)
CROSS JOIN (
  SELECT CURRENT_DATE + generate_series(0, 7) as show_date
  WHERE EXTRACT(dow FROM CURRENT_DATE + generate_series(0, 7)) IN (0, 6) -- Weekend only
) d
WHERE random() > 0.4;
