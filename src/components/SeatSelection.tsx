
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users } from "lucide-react";
import { Showtime } from '@/hooks/useShowtimes';
import { Theater } from '@/hooks/useTheaters';
import { Movie } from '@/hooks/useMovies';
import { format } from 'date-fns';

interface SeatSelectionProps {
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  ticketCount: number;
  onBack: () => void;
  onConfirm: (selectedSeats: string[]) => void;
}

const SeatSelection = ({ movie, theater, showtime, ticketCount, onBack, onConfirm }: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Generate theater layout (10 rows x 12 seats per row)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 12;

  // Generate occupied seats (random for demo)
  const occupiedSeats = new Set<string>();
  const totalSeats = rows.length * seatsPerRow;
  const occupiedCount = totalSeats - showtime.available_seats;
  
  // Generate random occupied seats
  while (occupiedSeats.size < occupiedCount) {
    const randomRow = rows[Math.floor(Math.random() * rows.length)];
    const randomSeat = Math.floor(Math.random() * seatsPerRow) + 1;
    occupiedSeats.add(`${randomRow}${randomSeat}`);
  }

  const handleSeatClick = (seatId: string) => {
    if (occupiedSeats.has(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else if (selectedSeats.length < ticketCount) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getSeatClass = (seatId: string) => {
    if (occupiedSeats.has(seatId)) {
      return "bg-gray-400 cursor-not-allowed text-gray-600";
    }
    if (selectedSeats.includes(seatId)) {
      return "bg-green-600 text-white border-2 border-green-600";
    }
    return "bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 cursor-pointer";
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Showtimes
        </Button>
        <div className="text-right">
          <h2 className="text-lg font-semibold">{movie.title}</h2>
          <p className="text-sm text-gray-600">{theater.name}</p>
        </div>
      </div>

      {/* Showtime Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {format(new Date(showtime.show_date), 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-sm text-gray-600">
                {format(new Date(`1970-01-01T${showtime.show_time}`), 'h:mm a')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{showtime.price} per ticket</p>
              <p className="text-sm text-gray-600">Select {ticketCount} seats</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screen */}
      <div className="text-center">
        <div className="bg-gray-200 rounded-lg py-2 px-8 inline-block mb-4">
          <span className="text-gray-600 font-medium">SCREEN</span>
        </div>
      </div>

      {/* Seat Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Select Your Seats</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row} className="flex items-center justify-center gap-2">
                {/* Row Label */}
                <div className="w-8 text-center font-medium text-gray-600">
                  {row}
                </div>
                
                {/* Seats */}
                <div className="flex gap-1">
                  {Array.from({ length: seatsPerRow }, (_, index) => {
                    const seatNumber = index + 1;
                    const seatId = `${row}${seatNumber}`;
                    
                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={occupiedSeats.has(seatId)}
                        className={`
                          w-8 h-8 rounded text-xs font-medium transition-colors
                          ${getSeatClass(seatId)}
                        `}
                      >
                        {seatNumber}
                      </button>
                    );
                  })}
                </div>
                
                {/* Row Label (Right) */}
                <div className="w-8 text-center font-medium text-gray-600">
                  {row}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-green-500 rounded"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-sm">Occupied</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Selected Seats: {selectedSeats.length}/{ticketCount}</span>
              {selectedSeats.length > 0 && (
                <Badge variant="secondary">
                  {selectedSeats.join(', ')}
                </Badge>
              )}
            </div>
            <div className="text-right">
              <p className="font-medium">
                Total: ₹{selectedSeats.length * showtime.price}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Button */}
      <div className="text-center">
        <Button 
          onClick={() => onConfirm(selectedSeats)}
          disabled={selectedSeats.length !== ticketCount}
          className="bg-red-600 hover:bg-red-700 px-8"
        >
          Confirm Seats ({selectedSeats.length}/{ticketCount})
        </Button>
      </div>
    </div>
  );
};

export default SeatSelection;
