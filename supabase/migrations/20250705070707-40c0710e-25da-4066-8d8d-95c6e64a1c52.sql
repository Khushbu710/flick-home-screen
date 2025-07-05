
-- Fix the typo in the previous migration (total_seeds should be total_seats)
UPDATE public.showtimes 
SET total_seats = 120 
WHERE total_seats IS NULL OR total_seats = 0;

-- Add more comprehensive showtimes for better availability
WITH all_theaters AS (
  SELECT id, city FROM theaters
),
all_movies AS (
  SELECT id FROM movies WHERE is_active = true
),
extended_time_slots AS (
  SELECT unnest(ARRAY['08:00', '10:30', '13:00', '15:30', '18:00', '20:30', '23:00']) as show_time
),
extended_dates AS (
  SELECT CURRENT_DATE + generate_series(0, 14) as show_date -- Extended to 2 weeks
)
INSERT INTO public.showtimes (movie_id, theater_id, show_date, show_time, price, available_seats, total_seats)
SELECT 
  m.id as movie_id,
  t.id as theater_id,
  d.show_date,
  ts.show_time::time as show_time,
  CASE 
    WHEN ts.show_time IN ('08:00', '10:30', '13:00') THEN 120 + (random() * 30)::integer
    WHEN ts.show_time IN ('15:30', '18:00') THEN 180 + (random() * 40)::integer
    ELSE 220 + (random() * 80)::integer
  END as price,
  60 + (random() * 50)::integer as available_seats,
  120 as total_seats
FROM all_movies m
CROSS JOIN all_theaters t
CROSS JOIN extended_time_slots ts
CROSS JOIN extended_dates d
WHERE random() > 0.2 -- More showtimes available
ON CONFLICT DO NOTHING; -- Avoid duplicates

-- Add special late night shows for weekends
INSERT INTO public.showtimes (movie_id, theater_id, show_date, show_time, price, available_seats, total_seats)
SELECT 
  m.id as movie_id,
  t.id as theater_id,
  d.show_date,
  '01:00'::time as show_time,
  350 + (random() * 50)::integer as price,
  40 + (random() * 30)::integer as available_seats,
  120 as total_seats
FROM all_movies m
CROSS JOIN all_theaters t
CROSS JOIN (
  SELECT CURRENT_DATE + generate_series(0, 14) as show_date
  WHERE EXTRACT(dow FROM CURRENT_DATE + generate_series(0, 14)) IN (0, 5, 6) -- Friday, Saturday, Sunday
) d
WHERE random() > 0.6
ON CONFLICT DO NOTHING;
