
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, Lock, ArrowLeft } from "lucide-react";
import { Movie } from '@/hooks/useMovies';
import { Theater } from '@/hooks/useTheaters';
import { Showtime } from '@/hooks/useShowtimes';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface PaymentFormProps {
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  selectedSeats: string[];
  onBack: () => void;
  onSuccess: (bookingReference: string) => void;
}

const PaymentForm = ({ movie, theater, showtime, selectedSeats, onBack, onSuccess }: PaymentFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    email: '',
    phone: ''
  });

  const { user } = useAuth();
  const totalAmount = selectedSeats.length * showtime.price;

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const generateBookingReference = () => {
    return `BMS${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  };

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your booking.",
        variant: "destructive"
      });
      return;
    }

    // Basic validation
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.nameOnCard) {
      toast({
        title: "Payment Details Required",
        description: "Please fill in all payment details.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate booking reference
      const bookingReference = generateBookingReference();

      // Create booking record
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          movie_id: movie.id,
          theater_id: theater.id,
          showtime_id: showtime.id,
          selected_seats: selectedSeats,
          total_amount: totalAmount,
          payment_method: 'Credit Card',
          payment_status: 'completed',
          booking_reference: bookingReference
        });

      if (error) {
        console.error('Booking error:', error);
        throw new Error('Failed to create booking');
      }

      // Update available seats (in a real app, this would be handled server-side)
      const { error: updateError } = await supabase
        .from('showtimes')
        .update({ 
          available_seats: showtime.available_seats - selectedSeats.length 
        })
        .eq('id', showtime.id);

      if (updateError) {
        console.error('Seat update error:', updateError);
      }

      toast({
        title: "Payment Successful!",
        description: `Your booking has been confirmed. Reference: ${bookingReference}`,
      });

      onSuccess(bookingReference);
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Seats
        </Button>
        <div className="text-right">
          <h2 className="text-lg font-semibold">Complete Payment</h2>
          <p className="text-sm text-gray-600">Secure checkout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">{movie.title}</h3>
              <p className="text-sm text-gray-600">{theater.name}</p>
              <p className="text-sm text-gray-600">{theater.address}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{format(new Date(showtime.show_date), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{format(new Date(`1970-01-01T${showtime.show_time}`), 'h:mm a')}</span>
              </div>
              <div className="flex justify-between">
                <span>Seats:</span>
                <div className="flex gap-1">
                  {selectedSeats.map(seat => (
                    <Badge key={seat} variant="secondary">{seat}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span>Tickets:</span>
                <span>{selectedSeats.length} × ₹{showtime.price}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount:</span>
              <span>₹{totalAmount}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  type="password"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 3))}
                  maxLength={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameOnCard">Name on Card</Label>
              <Input
                id="nameOnCard"
                placeholder="John Doe"
                value={paymentData.nameOnCard}
                onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={paymentData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                value={paymentData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
              <Lock className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              {isProcessing ? (
                "Processing Payment..."
              ) : (
                `Pay ₹${totalAmount}`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentForm;
