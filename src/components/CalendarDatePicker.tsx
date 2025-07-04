
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface CalendarDatePickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarDatePicker = ({ selectedDate, onDateSelect }: CalendarDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Select Date</h3>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full md:w-[280px] justify-start text-left font-normal h-12",
              "border-2 border-red-200 hover:border-red-300 focus:border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-red-600" />
            <span className="text-base">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onDateSelect(date);
                setIsOpen(false);
              }
            }}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CalendarDatePicker;
