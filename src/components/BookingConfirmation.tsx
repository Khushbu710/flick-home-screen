
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Calendar, MapPin, Clock, Users, Ticket } from "lucide-react";
import { Movie } from '@/hooks/useMovies';
import { Theater } from '@/hooks/useTheaters';
import { Showtime } from '@/hooks/useShowtimes';
import { format } from 'date-fns';

interface BookingConfirmationProps {
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  selectedSeats: string[];
  bookingReference: string;
  onClose: () => void;
}

const BookingConfirmation = ({ 
  movie, 
  theater, 
  showtime, 
  selectedSeats, 
  bookingReference, 
  onClose 
}: BookingConfirmationProps) => {
  const totalAmount = selectedSeats.length * showtime.price;

  const handleDownloadTicket = () => {
    // In a real app, this would generate a PDF ticket
    const ticketData = {
      bookingReference,
      movie: movie.title,
      theater: theater.name,
      date: format(new Date(showtime.show_date), 'EEEE, MMMM d, yyyy'),
      time: format(new Date(`1970-01-01T${showtime.show_time}`), 'h:mm a'),
      seats: selectedSeats,
      total: totalAmount
    };
    
    console.log('Downloading ticket:', ticketData);
    alert('Ticket download would start here. Check console for ticket data.');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">Your tickets have been successfully booked</p>
      </div>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Booking Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-600">Booking Reference</p>
            <p className="text-lg font-bold text-red-600">{bookingReference}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Movie Details
              </h3>
              <p className="font-medium">{movie.title}</p>
              <p className="text-sm text-gray-600">{movie.language} • {movie.duration} min</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {movie.genres?.slice(0, 3).map((genre) => (
                  <Badge key={genre} variant="outline" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Theater Details
              </h3>
              <p className="font-medium">{theater.name}</p>
              <p className="text-sm text-gray-600">{theater.address}</p>
              {theater.phone && (
                <p className="text-sm text-gray-600">{theater.phone}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Show Details
              </h3>
              <p className="text-sm">
                <strong>Date:</strong> {format(new Date(showtime.show_date), 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-sm">
                <strong>Time:</strong> {format(new Date(`1970-01-01T${showtime.show_time}`), 'h:mm a')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Seat Details
              </h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedSeats.map(seat => (
                  <Badge key={seat} variant="secondary">{seat}</Badge>
                ))}
              </div>
              <p className="text-sm">
                <strong>Tickets:</strong> {selectedSeats.length} × ₹{showtime.price}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
            <span className="font-semibold">Total Amount Paid:</span>
            <span className="text-lg font-bold text-green-600">₹{totalAmount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Important Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Important Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Please arrive at the theater at least 15 minutes before the show time</li>
            <li>• Carry a valid ID proof for verification</li>
            <li>• Show this booking confirmation or downloaded ticket at the theater</li>
            <li>• Outside food and beverages are not allowed</li>
            <li>• Seat numbers are printed on your ticket</li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleDownloadTicket}
          variant="outline" 
          className="flex-1 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Ticket
        </Button>
        <Button 
          onClick={onClose}
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          Book More Tickets
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
