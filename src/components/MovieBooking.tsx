
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Clock, Users, IndianRupee, Plus, Minus } from "lucide-react";
import { useShowtimes } from '@/hooks/useShowtimes';
import { useTheaters } from '@/hooks/useTheaters';
import { Movie } from '@/hooks/useMovies';
import { format, isSameDay } from 'date-fns';
import SeatSelection from './SeatSelection';
import PaymentForm from './PaymentForm';
import BookingConfirmation from './BookingConfirmation';
import DateSelector from './DateSelector';

interface MovieBookingProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep = 'showtimes' | 'seats' | 'payment' | 'confirmation';

const MovieBooking = ({ movie, isOpen, onClose }: MovieBookingProps) => {
  const [bookingStep, setBookingStep] = useState<BookingStep>('showtimes');
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [selectedTheater, setSelectedTheater] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingReference, setBookingReference] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { data: theaters, isLoading: theatersLoading } = useTheaters();
  const { data: showtimes, isLoading: showtimesLoading } = useShowtimes(movie?.id);

  if (!movie) return null;

  // Filter showtimes for selected date
  const filteredShowtimes = showtimes?.filter(showtime => 
    isSameDay(new Date(showtime.show_date), selectedDate)
  ) || [];

  // Group showtimes by theater
  const showtimesByTheater = filteredShowtimes.reduce((acc, showtime) => {
    const theaterId = showtime.theater_id;
    if (!acc[theaterId]) {
      acc[theaterId] = [];
    }
    acc[theaterId].push(showtime);
    return acc;
  }, {} as Record<string, typeof filteredShowtimes>);

  // Get theaters that have showtimes for the selected date
  const theatersWithShowtimes = theaters?.filter(theater => 
    showtimesByTheater[theater.id]?.length > 0
  ) || [];

  const isLoading = theatersLoading || showtimesLoading;

  const handleShowtimeSelect = (showtime: any, theater: any) => {
    setSelectedShowtime(showtime);
    setSelectedTheater(theater);
    setBookingStep('seats');
  };

  const handleBackToShowtimes = () => {
    setBookingStep('showtimes');
    setSelectedShowtime(null);
    setSelectedTheater(null);
    setSelectedSeats([]);
  };

  const handleSeatConfirm = (seats: string[]) => {
    setSelectedSeats(seats);
    setBookingStep('payment');
  };

  const handleBackToSeats = () => {
    setBookingStep('seats');
  };

  const handlePaymentSuccess = (reference: string) => {
    setBookingReference(reference);
    setBookingStep('confirmation');
  };

  const handleClose = () => {
    setBookingStep('showtimes');
    setSelectedShowtime(null);
    setSelectedTheater(null);
    setSelectedSeats([]);
    setBookingReference('');
    setTicketCount(1);
    setSelectedDate(new Date());
    onClose();
  };

  const renderContent = () => {
    switch (bookingStep) {
      case 'seats':
        return (
          <SeatSelection
            movie={movie}
            theater={selectedTheater}
            showtime={selectedShowtime}
            ticketCount={ticketCount}
            onBack={handleBackToShowtimes}
            onConfirm={handleSeatConfirm}
          />
        );
      case 'payment':
        return (
          <PaymentForm
            movie={movie}
            theater={selectedTheater}
            showtime={selectedShowtime}
            selectedSeats={selectedSeats}
            onBack={handleBackToSeats}
            onSuccess={handlePaymentSuccess}
          />
        );
      case 'confirmation':
        return (
          <BookingConfirmation
            movie={movie}
            theater={selectedTheater}
            showtime={selectedShowtime}
            selectedSeats={selectedSeats}
            bookingReference={bookingReference}
            onClose={handleClose}
          />
        );
      default:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl">
                Book Tickets for {movie.title}
              </DialogTitle>
            </DialogHeader>
            
            {/* Ticket Count Selector */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Number of Tickets</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                      disabled={ticketCount <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold min-w-[2rem] text-center">
                      {ticketCount}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                      disabled={ticketCount >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date Selector */}
            <DateSelector 
              selectedDate={selectedDate} 
              onDateSelect={setSelectedDate} 
            />

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : theatersWithShowtimes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No showtimes available for {format(selectedDate, 'EEEE, MMMM d, yyyy')}.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Try selecting a different date.
                </p>
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
                        <div className="border-t pt-4 first:border-t-0 first:pt-0">
                          <h4 className="font-medium text-gray-800 mb-3">
                            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {showtimesByTheater[theater.id]?.map((showtime) => (
                              <Button
                                key={showtime.id}
                                variant="outline"
                                className="h-auto p-3 hover:bg-red-50 hover:border-red-300"
                                onClick={() => handleShowtimeSelect(showtime, theater)}
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default MovieBooking;
