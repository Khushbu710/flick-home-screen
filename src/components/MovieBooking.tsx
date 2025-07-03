
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Clock, Users, IndianRupee } from "lucide-react";
import { useShowtimes } from '@/hooks/useShowtimes';
import { useTheaters } from '@/hooks/useTheaters';
import { Movie } from '@/hooks/useMovies';
import { format } from 'date-fns';

interface MovieBookingProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieBooking = ({ movie, isOpen, onClose }: MovieBookingProps) => {
  const { data: theaters, isLoading: theatersLoading } = useTheaters();
  const { data: showtimes, isLoading: showtimesLoading } = useShowtimes(movie?.id);

  if (!movie) return null;

  // Group showtimes by theater
  const showtimesByTheater = showtimes?.reduce((acc, showtime) => {
    const theaterId = showtime.theater_id;
    if (!acc[theaterId]) {
      acc[theaterId] = [];
    }
    acc[theaterId].push(showtime);
    return acc;
  }, {} as Record<string, typeof showtimes>) || {};

  // Get theaters that have showtimes for this movie
  const theatersWithShowtimes = theaters?.filter(theater => 
    showtimesByTheater[theater.id]?.length > 0
  ) || [];

  const isLoading = theatersLoading || showtimesLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl">
            Theaters Showing {movie.title}
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : theatersWithShowtimes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No showtimes available for this movie at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {theatersWithShowtimes.map((theater) => (
              <Card key={theater.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900">{theater.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{theater.address}</span>
                      </div>
                      {theater.phone && (
                        <p className="text-sm text-gray-500 mt-1">{theater.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(
                      showtimesByTheater[theater.id]?.reduce((acc, showtime) => {
                        const date = showtime.show_date;
                        if (!acc[date]) {
                          acc[date] = [];
                        }
                        acc[date].push(showtime);
                        return acc;
                      }, {} as Record<string, typeof showtimesByTheater[string]>) || {}
                    ).map(([date, dateShowtimes]) => (
                      <div key={date} className="border-t pt-4 first:border-t-0 first:pt-0">
                        <h4 className="font-medium text-gray-800 mb-3">
                          {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {dateShowtimes?.map((showtime) => (
                            <Button
                              key={showtime.id}
                              variant="outline"
                              className="h-auto p-3 hover:bg-red-50 hover:border-red-300"
                            >
                              <div className="text-center w-full">
                                <div className="flex items-center justify-center mb-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span className="font-medium">
                                    {format(new Date(`1970-01-01T${showtime.show_time}`), 'h:mm a')}
                                  </span>
                                </div>
                                <div className="flex items-center justify-center text-xs text-gray-600">
                                  <IndianRupee className="h-3 w-3 mr-1" />
                                  <span>{showtime.price}</span>
                                </div>
                                <div className="flex items-center justify-center text-xs text-gray-500 mt-1">
                                  <Users className="h-3 w-3 mr-1" />
                                  <span>{showtime.available_seats} seats</span>
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MovieBooking;
